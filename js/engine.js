import * as Sprites from './renderer.js';
import { Input } from './input.js';
import { Audio } from './audio.js';
import { UI } from './ui.js';
import { Player } from './player.js';
import { Enemy } from './enemy.js';
import { getLevel, getTotalLevels } from './levels.js';
import { rectOverlap, HAZARD_IDS, COIN_IDS, HEART_IDS, EXIT_IDS, getTilesInRegion } from './collision.js';

const FIXED_DT = 1000 / 60;

export class Game {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.W = canvas.width;
        this.H = canvas.height;
        this.input = new Input();
        this.audio = new Audio();
        this.ui = new UI(this.ctx, this.W, this.H);

        this.state = 'LOADING';
        this.score = 0;
        this.levelIdx = 0;
        this.level = null;
        this.player = null;
        this.enemies = [];
        this.camX = 0;
        this.hitSet = new Set();
        this.particles = [];
        this.frameCount = 0;
        this.coinAnimId = 179;
        this.lastTime = 0;
        this.accumulator = 0;
    }

    async start() {
        this.ui.renderLoading();
        try {
            await Sprites.loadAll();
        } catch (e) {
            const ctx = this.ctx;
            ctx.fillStyle = '#f00';
            ctx.font = '14px monospace';
            ctx.textAlign = 'left';
            ctx.fillText('Failed to load assets. You need a web server.', 40, 40);
            ctx.fillText('Run this from C:\\ai\\pixels with:', 40, 70);
            ctx.fillText('  npx http-server', 40, 100);
            ctx.fillText('Then open http://localhost:8080', 40, 130);
            ctx.fillStyle = '#888';
            ctx.fillText('Error: ' + e.message, 40, 170);
            return;
        }
        this.state = 'MENU';
        this._loop = this._loop.bind(this);
        requestAnimationFrame(this._loop);
    }

    _loop(ts) {
        if (!this.lastTime) this.lastTime = ts;
        const dt = ts - this.lastTime;
        this.lastTime = ts;
        this.accumulator += Math.min(dt, 200);
        while (this.accumulator >= FIXED_DT) {
            this._update();
            this.accumulator -= FIXED_DT;
        }
        this._render();
        requestAnimationFrame(this._loop);
    }

    _update() {
        switch (this.state) {
            case 'MENU':
                if (this.input.enter) this._startNewGame();
                break;
            case 'PLAYING':
                if (this.input.escape) { this.state = 'PAUSED'; break; }
                this._updatePlay();
                break;
            case 'PAUSED':
                if (this.input.escape) this.state = 'PLAYING';
                break;
            case 'LEVEL_COMPLETE':
                if (this.input.enter) this._advanceLevel();
                break;
            case 'GAME_OVER':
                if (this.input.enter) this.state = 'MENU';
                break;
            case 'VICTORY':
                if (this.input.enter) this.state = 'MENU';
                break;
        }
        this.input.update();
    }

    _startNewGame() {
        this.score = 0;
        this.levelIdx = 0;
        this._loadLevel(0);
    }

    _loadLevel(idx) {
        const level = getLevel(idx);
        if (!level) { this.state = 'VICTORY'; return; }
        this.level = level;
        this.levelIdx = idx;

        const sx = level.spawn.tx * Sprites.RENDER_TILE;
        const sy = level.spawn.ty * Sprites.RENDER_TILE;
        this.player = new Player(sx, sy);

        this.enemies = level.entities.map(e => {
            return new Enemy(e.type, e.tx, e.ty, e.patrolL, e.patrolR, Sprites.RENDER_TILE, Sprites.RENDER_TILE);
        });

        this.hitSet.clear();
        this.particles = [];
        this.camX = 0;
        this.state = 'PLAYING';
    }

    _advanceLevel() {
        const next = this.levelIdx + 1;
        if (next >= getTotalLevels()) {
            this.state = 'VICTORY';
        } else {
            this._loadLevel(next);
        }
    }

    _updatePlay() {
        this.frameCount++;
        if (this.frameCount % 15 === 0) {
            this.coinAnimId = this.coinAnimId === 179 ? 180 : 179;
        }

        this.player.update(this.input, this.level.map, Sprites.RENDER_TILE, Sprites.RENDER_TILE);

        if (this.player.didJump) {
            this.audio.jump();
            this._emitParticles(this.player.x + this.player.w / 2, this.player.y + this.player.h, '#aaa', 4, 1, -1);
            this.player.didJump = false;
        }
        if (this.player.didAttack) {
            this.audio.attack();
            this.player.didAttack = false;
        }

        this._checkTileInteractions();

        this.enemies.forEach(e => {
            e.update(
                this.level.map, Sprites.RENDER_TILE, Sprites.RENDER_TILE,
                this.player.getCenterX(), this.player.getCenterY(), !this.player.dead
            );
        });

        this._checkPlayerAttack();
        this._checkEnemyContact();
        this._updateParticles();
        this._updateCamera();

        if (this.player.dead) {
            this.audio.gameOver();
            this._emitParticles(this.player.getCenterX(), this.player.getCenterY(), '#e74c3c', 20, 3, -3);
            this.state = 'GAME_OVER';
        }
    }

    _checkTileInteractions() {
        const tiles = getTilesInRegion(
            this.level.map,
            this.player.x, this.player.y,
            this.player.w, this.player.h,
            Sprites.RENDER_TILE, Sprites.RENDER_TILE
        );
        for (const t of tiles) {
            if (COIN_IDS.has(t.tileId)) {
                this.level.map[t.row][t.col] = 0;
                this.score += 10;
                this.audio.coin();
                this._emitParticles(t.x + Sprites.RENDER_TILE / 2, t.y + Sprites.RENDER_TILE / 2, '#ffd700', 6, 2, -2);
            } else if (HEART_IDS.has(t.tileId)) {
                this.level.map[t.row][t.col] = 0;
                this.player.health = Math.min(this.player.maxHealth, this.player.health + 25);
                this.score += 25;
                this.audio.heart();
                this._emitParticles(t.x + Sprites.RENDER_TILE / 2, t.y + Sprites.RENDER_TILE / 2, '#ff6b9d', 8, 2, -3);
            } else if (HAZARD_IDS.has(t.tileId)) {
                if (this.player.takeDamage(12)) {
                    this.player.knockback(this.player.x + this.player.w / 2);
                    this.audio.spike();
                    this._emitParticles(this.player.getCenterX(), this.player.getCenterY(), '#ff4444', 8, 3, -2);
                }
            } else if (EXIT_IDS.has(t.tileId)) {
                this.score += 200;
                this.audio.levelComplete();
                this._emitParticles(t.x + Sprites.RENDER_TILE / 2, t.y + Sprites.RENDER_TILE / 2, '#4caf50', 15, 3, -4);
                this.state = 'LEVEL_COMPLETE';
                return;
            }
        }
    }

    _checkPlayerAttack() {
        if (!this.player.attacking) {
            this.hitSet.clear();
            return;
        }
        const box = this.player.getAttackBox();
        if (!box) return;
        this.enemies.forEach((e, i) => {
            if (!e.alive || this.hitSet.has(i)) return;
            if (rectOverlap(box, e)) {
                e.takeDamage(this.player.getCenterX());
                this.hitSet.add(i);
                this._emitParticles(e.x + e.w / 2, e.y + e.h / 2, '#ff6b6b', 5, 2, -2);
                if (!e.alive) {
                    this.score += e.config.score;
                    this.audio.enemyDeath();
                    this._emitParticles(e.x + e.w / 2, e.y + e.h / 2, '#e74c3c', 12, 3, -3);
                }
            }
        });
    }

    _checkEnemyContact() {
        if (this.player.dead) return;
        this.enemies.forEach(e => {
            if (!e.alive || !e.canDamagePlayer()) return;
            if (rectOverlap(this.player, e)) {
                if (this.player.takeDamage(e.type === 'skeleton' ? 15 : 10)) {
                    this.player.knockback(e.x + e.w / 2);
                    e.onPlayerHit();
                    this.audio.hit();
                    this._emitParticles(this.player.getCenterX(), this.player.getCenterY(), '#ffffff', 8, 3, -2);
                }
            }
        });
    }

    _emitParticles(x, y, color, count, speedX, speedY) {
        for (let i = 0; i < count; i++) {
            this.particles.push({
                x, y,
                vx: (Math.random() - 0.5) * speedX * 2,
                vy: speedY + (Math.random() - 0.5) * Math.abs(speedY),
                life: 20 + Math.random() * 15,
                maxLife: 35,
                color,
                size: 2 + Math.random() * 3
            });
        }
    }

    _updateParticles() {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.08;
            p.life--;
            if (p.life <= 0) this.particles.splice(i, 1);
        }
    }

    _updateCamera() {
        const targetX = this.player.getCenterX() - this.W / 2;
        const maxX = this.level.width * Sprites.RENDER_TILE - this.W;
        const clamped = Math.max(0, Math.min(targetX, maxX));
        this.camX += (clamped - this.camX) * 0.12;
    }

    _render() {
        const ctx = this.ctx;
        ctx.clearRect(0, 0, this.W, this.H);

        switch (this.state) {
            case 'LOADING':
                this.ui.renderLoading();
                break;
            case 'MENU':
                this.ui.renderMenu();
                break;
            case 'PLAYING':
            case 'PAUSED':
                this._renderWorld();
                this._renderParticles();
                this.ui.renderHUD(this.player, this.score, this.level.name, this.levelIdx + 1, getTotalLevels());
                if (this.state === 'PAUSED') this.ui.renderPause(this.score, this.level.name);
                break;
            case 'LEVEL_COMPLETE':
                this._renderWorld();
                this._renderParticles();
                this.ui.renderHUD(this.player, this.score, this.level.name, this.levelIdx + 1, getTotalLevels());
                this.ui.renderLevelComplete(this.level.name, this.score, 200);
                break;
            case 'GAME_OVER':
                this._renderWorld();
                this.ui.renderGameOver(this.score, this.level.name, this.levelIdx);
                break;
            case 'VICTORY':
                this.ui.renderVictory(this.score);
                break;
        }
    }

    _renderWorld() {
        const ctx = this.ctx;
        const lvl = this.level;
        const cx = Math.round(this.camX);

        Sprites.drawBgParallax(ctx, this.W, this.H, this.camX, 0, lvl.bgColor);

        const startCol = Math.max(0, Math.floor(cx / Sprites.RENDER_TILE));
        const endCol = Math.min(lvl.width - 1, Math.ceil((cx + this.W) / Sprites.RENDER_TILE));

        for (let row = 0; row < lvl.height; row++) {
            for (let col = startCol; col <= endCol; col++) {
                let id = lvl.map[row][col];
                if (id === 179 || id === 180) id = this.coinAnimId;
                if (id > 0) {
                    const sx = col * Sprites.RENDER_TILE - cx;
                    const sy = row * Sprites.RENDER_TILE;
                    Sprites.drawTile(ctx, id, sx, sy);
                }
            }
        }

        this._renderExitGlow(cx);

        this.enemies.forEach(e => e.render(ctx, cx, 0, Sprites.drawChar));
        this.player.render(ctx, cx, 0, Sprites.drawChar);
    }

    _renderExitGlow(cx) {
        const lvl = this.level;
        const ex = lvl.exit.tx * Sprites.RENDER_TILE - cx;
        const ey = lvl.exit.ty * Sprites.RENDER_TILE;
        const pulse = 0.5 + 0.5 * Math.sin(this.frameCount * 0.06);
        const ctx = this.ctx;

        ctx.save();
        ctx.globalAlpha = 0.15 + pulse * 0.15;
        ctx.fillStyle = '#4caf50';
        ctx.shadowColor = '#4caf50';
        ctx.shadowBlur = 15 + pulse * 10;
        ctx.fillRect(ex - 4, ey - 4, Sprites.RENDER_TILE + 8, Sprites.RENDER_TILE + 8);
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 0.3 + pulse * 0.3;
        ctx.fillStyle = '#8f8';
        ctx.fillRect(ex + 8, ey - 20, 6, 12);
        ctx.globalAlpha = 1;
        ctx.restore();
    }

    _renderParticles() {
        const ctx = this.ctx;
        const cx = Math.round(this.camX);
        for (const p of this.particles) {
            ctx.globalAlpha = Math.max(0, p.life / p.maxLife);
            ctx.fillStyle = p.color;
            ctx.fillRect(p.x - cx - p.size / 2, p.y - p.size / 2, p.size, p.size);
        }
        ctx.globalAlpha = 1;
    }
}
