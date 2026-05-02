import * as Sprites from './renderer.js';
import { Input } from './input.js';
import { Audio } from './audio.js';
import { UI, INTRO_LINES } from './ui.js';
import { Player } from './player.js';
import { Enemy } from './enemy.js';
import { Boss, getBossDef, isBossLevel } from './boss.js';
import { getLevel, getTotalLevels, getCustomLevels, getCustomLevel, seedBuiltInLevels } from './levels.js';
import { rectOverlap, HAZARD_IDS, COIN_IDS, HEART_IDS, EXIT_IDS, SPRING_IDS, CHECKPOINT_IDS, KEY_IDS, LOCK_IDS, getTilesInRegion, getTileAt, isSolid } from './collision.js';

const FIXED_DT = 1000 / 60;
const SPRING_FORCE = -16;

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
        this.introLine = 0;
        this.introTimer = 0;
        this.score = 0;
        this.levelIdx = 0;
        this.level = null;
        this.player = null;
        this.enemies = [];
        this.boss = null;
        this.bossDefeated = false;
        this.camX = 0;
        this.camY = 0;
        this.hitSet = new Set();
        this.bossHit = false;
        this.particles = [];
        this.frameCount = 0;
        this.coinAnimId = 179;
        this.checkpointAnimId = 139;
        this.waterAnimFrame = 0;
        this.activatedCheckpoints = new Set();
        this.triggeredSprings = new Map();
        this.hasKey = false;
        this.lastTime = 0;
        this.accumulator = 0;

        this.menuSel = 0;
        this.menuItems = [];
        this.customMode = false;
        this.pauseSel = 0;
        this.pauseHeld = false;
    }

    _buildMenu() {
        const items = [];
        items.push({ type: 'play', label: 'Play Game', action: () => this._startNewGame() });
                items.push({ type: 'editor', label: 'Level Editor', action: () => { window.location.href = 'editor.html'; } });

        const customs = getCustomLevels();
        if (customs.length > 0) {
            items.push({ type: 'header', label: '-- Custom Levels --', action: null });
            for (const cl of customs) {
                const cName = cl.name;
                items.push({
                    type: 'custom',
                    label: '\u2605 ' + cName,
                    action: () => this._startCustomLevel(cName)
                });
            }
        }
        this.menuItems = items;
        if (this.menuSel >= items.length) this.menuSel = 0;
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
        seedBuiltInLevels();
        this._buildMenu();
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
            case 'INTRO':
                this.introTimer++;
                if (this.introTimer % 45 === 0 && this.introLine < INTRO_LINES.length) this.introLine++;
                if (this.input.enter || this.input.jumpPressed) {
                    if (this.introLine < INTRO_LINES.length) { this.introLine = INTRO_LINES.length; this.introTimer = 0; }
                    else { this._startAfterIntro(); }
                }
                break;
            case 'MENU':
                this._updateMenu();
                break;
            case 'PLAYING':
                if (this.input.escape) { this.state = 'PAUSED'; this.pauseSel = 0; this.pauseHeld = true; break; }
                this._updatePlay();
                break;
            case 'PAUSED':
                this._updatePause();
                break;
            case 'LEVEL_COMPLETE':
                if (this.input.enter) this._advanceLevel();
                break;
            case 'GAME_OVER':
                if (this.input.enter) { this.state = 'MENU'; this._buildMenu(); }
                break;
            case 'VICTORY':
                if (this.input.enter) { this.state = 'MENU'; this._buildMenu(); }
                break;
            case 'QUEEN_RESCUED':
                if (this.input.enter) this._advanceLevel();
                break;
        }
        this.input.update();
    }

    _updateMenu() {
        const items = this.menuItems.filter(i => i.type !== 'header');
        const realIdx = this._menuSelToReal();

        if (this.input.isDown('ArrowUp') || this.input.isDown('KeyW')) {
            if (!this._menuHeld) {
                this._menuHeld = true;
                this.menuSel = (this.menuSel - 1 + items.length) % items.length;
            }
        } else if (this.input.isDown('ArrowDown') || this.input.isDown('KeyS')) {
            if (!this._menuHeld) {
                this._menuHeld = true;
                this.menuSel = (this.menuSel + 1) % items.length;
            }
        } else {
            this._menuHeld = false;
        }

        if (this.input.enter) {
            const item = items[this.menuSel];
            if (item && item.action) item.action();
        }
    }

    _menuSelToReal() {
        let count = 0;
        for (let i = 0; i < this.menuItems.length; i++) {
            if (this.menuItems[i].type !== 'header') {
                if (count === this.menuSel) return i;
                count++;
            }
        }
        return 0;
    }

    _updatePause() {
        const pauseItems = ['Resume', 'Exit to Menu'];
        if (this.input.escape) { this.state = 'PLAYING'; this.pauseHeld = true; return; }
        if (this.pauseHeld) { if (!this.input.isDown('Escape')) this.pauseHeld = false; return; }
        const up = this.input.isDown('ArrowUp') || this.input.isDown('KeyW');
        const down = this.input.isDown('ArrowDown') || this.input.isDown('KeyS');
        if (up || down) {
            if (!this._pauseHeld) {
                this._pauseHeld = true;
                this.pauseSel = (this.pauseSel + (down ? 1 : -1) + pauseItems.length) % pauseItems.length;
            }
        } else { this._pauseHeld = false; }
        if (this.input.enter) {
            if (this.pauseSel === 0) { this.state = 'PLAYING'; }
            else { this.state = 'MENU'; this._buildMenu(); }
        }
    }

    _startNewGame() {
        this.score = 0;
        this.levelIdx = 0;
        this.customMode = false;
        this.introLine = 0;
        this.introTimer = 0;
        this.state = 'INTRO';
    }

    _startAfterIntro() {
        this._loadLevel(0);
    }

    _startCustomLevel(name) {
        const level = getCustomLevel(name);
        if (!level) return;
        this.score = 0;
        this.customMode = true;
        this.level = level;
        this.level.name = name;
        this.level.index = 0;
        this.level.totalLevels = 1;
        this.triggeredSprings = new Map();
        this.activatedCheckpoints = new Set();
        const sx = level.spawn.tx * Sprites.RENDER_TILE;
        const sy = level.spawn.ty * Sprites.RENDER_TILE;
        this.player = new Player(sx, sy);
        this.enemies = [];
        this.hitSet.clear();
        this.particles = [];
        this.camX = 0;
        this.camY = 0;
        this.state = 'PLAYING';
    }

    _loadLevel(idx) {
        const level = getLevel(idx);
        if (!level) { this.state = 'VICTORY'; return; }
        this.level = level;
        this.levelIdx = idx;
        if (!level.solidMap) {
            level.solidMap = level.map.map(row => row.map(id => isSolid(id)));
        }
        this.triggeredSprings = new Map();
        this.activatedCheckpoints = new Set();

        const sx = level.spawn.tx * Sprites.RENDER_TILE;
        const sy = level.spawn.ty * Sprites.RENDER_TILE;
        this.player = new Player(sx, sy);

        this.enemies = level.entities.map(e => {
            return new Enemy(e.type, e.tx, e.ty, e.patrolL, e.patrolR, Sprites.RENDER_TILE, Sprites.RENDER_TILE);
        });

        this.boss = null;
        this.bossDefeated = false;
        this.bossArenaActive = false;
        this.bossArenaLeft = 0;
        if (isBossLevel(idx)) {
            const bDef = getBossDef(idx);
            const exitTx = level.exit ? level.exit.tx : level.width - 2;
            const exitTy = level.exit ? level.exit.ty : level.height - 2;
            const bossTx = Math.max(0, exitTx - 3);
            const bossTy = exitTy;
            this.bossArenaLeft = Math.max(0, bossTx - 6) * Sprites.RENDER_TILE;
            this.boss = new Boss(
                Math.floor(idx / 5), bossTx, bossTy,
                Math.max(0, bossTx - 6), Math.min(level.width - 1, bossTx + 3),
                Sprites.RENDER_TILE, Sprites.RENDER_TILE
            );
        }

        this.hitSet.clear();
        this.hasKey = false;
        this.particles = [];
        this.camX = 0;
        this.camY = 0;
        this.state = 'PLAYING';
    }

    _advanceLevel() {
        if (this.customMode) {
            this.state = 'VICTORY';
            return;
        }
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
            this.checkpointAnimId = this.checkpointAnimId === 139 ? 140 : 139;
            this.waterAnimFrame = (this.waterAnimFrame + 1) % 3;
        }

        this._checkSpringBounce();

        this.player.update(this.input, this.level.map, Sprites.RENDER_TILE, Sprites.RENDER_TILE, this.level.solidMap);

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

        if (this.hasKey) {
            const RT = Sprites.RENDER_TILE;
            const map = this.level.map;
            const mh = map.length, mw = map[0].length;
            const pc = Math.floor((this.player.x + this.player.w / 2) / RT);
            const pr = Math.floor((this.player.y + this.player.h / 2) / RT);
            let found = false;
            for (let dr = -2; dr <= 2 && !found; dr++) {
                for (let dc = -2; dc <= 2 && !found; dc++) {
                    const r = pr + dr, c = pc + dc;
                    if (r >= 0 && r < mh && c >= 0 && c < mw && LOCK_IDS.has(map[r][c])) {
                        found = true;
                        this.hasKey = false;
                        this.audio.coin();
                        const stack = [[r, c]];
                        const visited = new Set();
                        while (stack.length > 0) {
                            const [cr, cc] = stack.pop();
                            const vk = cr * mw + cc;
                            if (visited.has(vk)) continue;
                            if (cr < 0 || cr >= mh || cc < 0 || cc >= mw) continue;
                            if (!LOCK_IDS.has(map[cr][cc])) continue;
                            visited.add(vk);
                            map[cr][cc] = 0;
                            if (this.level.solidMap) this.level.solidMap[cr][cc] = false;
                            this._emitParticles(cc * RT + RT / 2, cr * RT + RT / 2, '#ff6b6b', 4, 2, -2);
                            stack.push([cr - 1, cc], [cr + 1, cc], [cr, cc - 1], [cr, cc + 1]);
                        }
                    }
                }
            }
        }

        this.enemies.forEach(e => {
            e.update(
                this.level.map, Sprites.RENDER_TILE, Sprites.RENDER_TILE,
                this.player.getCenterX(), this.player.getCenterY(), !this.player.dead,
                this.level.solidMap
            );
        });

        if (this.boss && this.boss.alive) {
            this.boss.update(
                this.level.map, Sprites.RENDER_TILE, Sprites.RENDER_TILE,
                this.player.getCenterX(), this.player.getCenterY(), !this.player.dead,
                this.level.solidMap
            );

            if (!this.bossArenaActive && this.player.x + this.player.w > this.bossArenaLeft) {
                this.bossArenaActive = true;
            }
            if (this.bossArenaActive) {
                if (this.player.x < this.bossArenaLeft) {
                    this.player.x = this.bossArenaLeft;
                    this.player.vx = 0;
                }
            }

            if (this.boss.checkAxeHit(this.player)) {
                if (this.player.takeDamage(15)) {
                    this.player.knockback(this.boss.x + this.boss.w / 2);
                    this.audio.hit();
                    this._emitParticles(this.player.getCenterX(), this.player.getCenterY(), '#ff4444', 8, 3, -2);
                }
            }
        }

        this._checkPlayerAttack();
        this._checkEnemyContact();
        this._updateParticles();
        this._updateCamera();

        for (const [key, frames] of this.triggeredSprings) {
            if (frames <= 1) this.triggeredSprings.delete(key);
            else this.triggeredSprings.set(key, frames - 1);
        }

        if (this.player.dead) {
            this.audio.gameOver();
            this._emitParticles(this.player.getCenterX(), this.player.getCenterY(), '#e74c3c', 20, 3, -3);
            this.state = 'GAME_OVER';
        }
    }

    _checkSpringBounce() {
        const p = this.player;
        const tileW = Sprites.RENDER_TILE;
        const feetCol = Math.floor((p.x + p.w / 2) / tileW);
        const feetRow = Math.floor((p.y + p.h) / tileW);
        const tile = getTileAt(this.level.map, feetCol, feetRow);
        if (SPRING_IDS.has(tile) && p.vy >= 0) {
            const springTop = feetRow * tileW;
            if (p.y + p.h >= springTop && p.y + p.h <= springTop + tileW * 0.6) {
                p.vy = SPRING_FORCE;
                p.onGround = false;
                p.y = springTop - p.h;
                this.triggeredSprings.set(`${feetRow},${feetCol}`, 12);
                this.audio.spring();
                this._emitParticles(p.getCenterX(), springTop, '#ff6', 8, 2, -3);
            }
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
                    this.player.knockback(this.player.x + this.w / 2);
                    this.audio.spike();
                    this._emitParticles(this.player.getCenterX(), this.player.getCenterY(), '#ff4444', 8, 3, -2);
                }
            } else if (EXIT_IDS.has(t.tileId)) {
                if (this.boss && this.boss.alive) return;
                this.score += 200;
                this.audio.levelComplete();
                this._emitParticles(t.x + Sprites.RENDER_TILE / 2, t.y + Sprites.RENDER_TILE / 2, '#4caf50', 15, 3, -4);
                if (this.bossDefeated) {
                    this.state = 'QUEEN_RESCUED';
                } else {
                    this.state = 'LEVEL_COMPLETE';
                }
                return;
            } else if (CHECKPOINT_IDS.has(t.tileId)) {
                const key = `${t.col},${t.row}`;
                if (!this.activatedCheckpoints.has(key)) {
                    this.activatedCheckpoints.add(key);
                    this.player.spawnX = t.col * Sprites.RENDER_TILE + (Sprites.RENDER_TILE - this.player.w) / 2;
                    this.player.spawnY = t.row * Sprites.RENDER_TILE;
                    this._emitParticles(t.x + Sprites.RENDER_TILE / 2, t.y + Sprites.RENDER_TILE / 2, '#4fc3f7', 10, 2, -3);
                }
            } else if (KEY_IDS.has(t.tileId)) {
                this.level.map[t.row][t.col] = 0;
                this.hasKey = true;
                this.audio.coin();
                this._emitParticles(t.x + Sprites.RENDER_TILE / 2, t.y + Sprites.RENDER_TILE / 2, '#ffd700', 8, 2, -3);
            }
        }
    }

    _checkPlayerAttack() {
        if (!this.player.attacking) { this.hitSet.clear(); this.bossHit = false; return; }
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
        if (this.boss && this.boss.alive && !this.bossHit && rectOverlap(box, this.boss)) {
            this.boss.takeDamage(this.player.getCenterX());
            this.bossHit = true;
            this._emitParticles(this.boss.x + this.boss.w / 2, this.boss.y + this.boss.h / 2, '#ff6b6b', 8, 3, -3);
            this.audio.enemyDeath();
            if (!this.boss.alive) {
                this.bossDefeated = true;
                this.score += this.boss.config.score;
                this._emitParticles(this.boss.x + this.boss.w / 2, this.boss.y + this.boss.h / 2, '#ffd700', 25, 4, -4);
            }
        }
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
        if (this.boss && this.boss.alive && this.boss.canDamagePlayer() && rectOverlap(this.player, this.boss)) {
            if (this.player.takeDamage(20)) {
                this.player.knockback(this.boss.x + this.boss.w / 2);
                this.boss.onPlayerHit();
                this.audio.hit();
                this._emitParticles(this.player.getCenterX(), this.player.getCenterY(), '#ff4444', 12, 4, -3);
            }
        }
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
        const targetY = this.player.getCenterY() - this.H / 2;
        const maxX = this.level.width * Sprites.RENDER_TILE - this.W;
        const maxY = this.level.height * Sprites.RENDER_TILE - this.H;
        const cx = Math.max(0, Math.min(targetX, maxX));
        const cy = Math.max(0, Math.min(targetY, maxY));
        this.camX += (cx - this.camX) * 0.12;
        this.camY += (cy - this.camY) * 0.12;
    }

    _render() {
        const ctx = this.ctx;
        ctx.clearRect(0, 0, this.W, this.H);

        switch (this.state) {
            case 'LOADING':
                this.ui.renderLoading();
                break;
            case 'INTRO':
                this.ui.renderIntro(this.introLine, this.introTimer);
                break;
            case 'MENU':
                this.ui.renderMenu(this.menuSel, this.menuItems);
                break;
            case 'PLAYING':
            case 'PAUSED':
                this._renderWorld();
                this._renderParticles();
                this.ui.renderHUD(this.player, this.score, this.level.name, this.levelIdx + 1, getTotalLevels(), this.boss, this.hasKey);
                if (this.state === 'PAUSED') this.ui.renderPause(this.score, this.level.name, this.pauseSel);
                break;
            case 'LEVEL_COMPLETE':
                this._renderWorld();
                this._renderParticles();
                this.ui.renderHUD(this.player, this.score, this.level.name, this.levelIdx + 1, getTotalLevels(), this.boss, this.hasKey);
                this.ui.renderLevelComplete(this.level.name, this.score, 200);
                break;
            case 'GAME_OVER':
                this._renderWorld();
                this.ui.renderGameOver(this.score, this.level.name, this.levelIdx);
                break;
            case 'VICTORY':
                this.ui.renderVictory(this.score);
                break;
            case 'QUEEN_RESCUED':
                this._renderWorld();
                this.ui.renderQueenRescued(this.score, this.level.name, Math.floor(this.levelIdx / 5));
                break;
        }
    }

    _renderWorld() {
        const ctx = this.ctx;
        const lvl = this.level;
        const cx = Math.round(this.camX);
        const cy = Math.round(this.camY);

        Sprites.drawBgParallax(ctx, this.W, this.H, this.camX, this.camY, lvl.bgColor);

        const startCol = Math.max(0, Math.floor(cx / Sprites.RENDER_TILE));
        const endCol = Math.min(lvl.width - 1, Math.ceil((cx + this.W) / Sprites.RENDER_TILE));
        const startRow = Math.max(0, Math.floor(cy / Sprites.RENDER_TILE));
        const endRow = Math.min(lvl.height - 1, Math.ceil((cy + this.H) / Sprites.RENDER_TILE));

        for (let row = startRow; row <= endRow; row++) {
            for (let col = startCol; col <= endCol; col++) {
                let id = lvl.map[row][col];
                if (id === 179 || id === 180) id = this.coinAnimId;
                if (id === 139 || id === 140) {
                    const key = `${row},${col}`;
                    id = this.activatedCheckpoints.has(key) ? 140 : this.checkpointAnimId;
                }
                if (id === 135 || id === 136) {
                    const key = `${row},${col}`;
                    id = this.triggeredSprings.has(key) ? 136 : 135;
                }
                if (id === 62 || id === 102 || id === 103) {
                    id = this.waterAnimFrame === 0 ? 102 : 103;
                }
                if (id === 61 || id === 81) {
                    id = this.waterAnimFrame === 0 ? 61 : 81;
                }
                if (id > 0) {
                    Sprites.drawTile(ctx, id, col * Sprites.RENDER_TILE - cx, row * Sprites.RENDER_TILE - cy);
                }
            }
        }

        if (lvl.decorations) {
            for (const d of lvl.decorations) {
                const dx = d.tx * Sprites.RENDER_TILE - cx;
                const dy = d.ty * Sprites.RENDER_TILE - cy;
                if (dx > -Sprites.RENDER_TILE && dx < this.W + Sprites.RENDER_TILE &&
                    dy > -Sprites.RENDER_TILE && dy < this.H + Sprites.RENDER_TILE) {
                    Sprites.drawTile(ctx, d.id, dx, dy);
                }
            }
        }

        this.enemies.forEach(e => e.render(ctx, cx, cy, Sprites.drawChar));
        if (this.boss) this.boss.render(ctx, cx, cy);
        this.player.render(ctx, cx, cy, Sprites.drawChar);
    }

    _renderParticles() {
        const ctx = this.ctx;
        const cx = Math.round(this.camX);
        const cy = Math.round(this.camY);
        for (const p of this.particles) {
            ctx.globalAlpha = Math.max(0, p.life / p.maxLife);
            ctx.fillStyle = p.color;
            ctx.fillRect(p.x - cx - p.size / 2, p.y - cy - p.size / 2, p.size, p.size);
        }
        ctx.globalAlpha = 1;
    }
}
