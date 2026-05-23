import * as Sprites from './renderer.js';
import { Input } from './input.js';
import { Audio } from './audio.js';
import { UI, INTRO_LINES } from './ui.js';
import { Player } from './player.js';
import { Enemy } from './enemy.js';
import { Boss, getBossDef, isBossLevel } from './boss.js';
import { getLevel, getTotalLevels, loadCustomLevels } from './levels.js';
import { rectOverlap, HAZARD_IDS, COIN_IDS, HEART_IDS, EXIT_IDS, SPRING_IDS, CHECKPOINT_IDS, KEY_IDS, LOCK_IDS, FRUIT_IDS, BOX_IDS, TRAP_IDS, PA1_CHECKPOINT_IDS, getTilesInRegion, getTileAt, isSolid } from './collision.js';
import * as PA1Sprites from './pa1-sprites.js';
import * as PA1Assets from './pa1-assets.js';

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
        this.currentLives = 3;
        this.maxLives = 9;
        this.nextLifeScore = 5000;
        this.lifePopupTimer = 0;
        this.level = null;
        this.player = null;
        this.enemies = [];
        this.movingPlatforms = [];
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
        this.optSel = 0;
        this.optHeld = false;
        this.masterVol = 0.7;
        this.sfxVol = 0.8;
        this.musicVol = 0.6;

        this.selectedCharacter = localStorage.getItem('pa1_char') || 'ninja_frog';
        this.fruitCollections = [];
        this.boxStates = {};
        this.pa1CheckpointAnims = {};
        this.trapAnimTimer = 0;
        this.dustParticles = [];
    }

    _buildMenu() {
        this.menuItems = [
            { type: 'play', label: 'Start Game', action: () => this._startNewGame() },
            { type: 'chars', label: 'Character Select', action: () => { this.state = 'CHAR_SELECT'; this.charSelIdx = this._getCharIdx(); this._charHeld = true; } },
            { type: 'editor', label: 'Editor', action: () => { window.location.href = 'editor.html'; } },
            { type: 'options', label: 'Options', action: () => { this.state = 'OPTIONS'; this.optSel = 0; } },
            { type: 'quit', label: 'Quit Game', action: () => { window.close(); } }
        ];
        if (this.menuSel >= this.menuItems.length) this.menuSel = 0;
    }

    _getCharIdx() {
        const ids = PA1Assets.getCharacterIds();
        const idx = ids.indexOf(this.selectedCharacter);
        return idx >= 0 ? idx : 0;
    }

    async start() {
        this.ui.renderLoading();
        try {
            await Sprites.loadAll();
            await Sprites.loadPA1Assets();
            await loadCustomLevels();
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
        this._buildMenu();
        this._menuHeld = true;
        const params = new URLSearchParams(window.location.search);
        if (params.has('test')) {
            const testRaw = localStorage.getItem('testLevel');
            if (testRaw) {
                localStorage.removeItem('testLevel');
                try {
                    const tl = JSON.parse(testRaw);
                    tl.isTest = true;
                    this._loadTestLevel(tl);
                    this._loop = this._loop.bind(this);
                    requestAnimationFrame(this._loop);
                    return;
                } catch(e) { console.warn('Failed to load test level', e); }
            }
        }
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
        this.input.update();
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
            case 'OPTIONS':
                this._updateOptions();
                break;
            case 'CHAR_SELECT':
                this._updateCharSelect();
                break;
            case 'PLAYING':
                if (this.input.escape) { this.state = 'PAUSED'; this.pauseSel = 0; this.pauseHeld = true; break; }
                this._updatePlay();
                break;
            case 'BOSS_INTRO':
                this.bossIntroTimer--;
                if (this.bossIntroTimer <= 0 || this.input.enter || this.input.jumpPressed) {
                    this.bossIntroTimer = 0;
                    this.state = 'PLAYING';
                }
                break;
            case 'PAUSED':
                this._updatePause();
                break;
            case 'LEVEL_COMPLETE':
                if (this.input.enter) this._advanceLevel();
                break;
            case 'GAME_OVER':
                if (this.input.enter) { this.state = 'MENU'; this._buildMenu(); this._menuHeld = true; }
                break;
            case 'VICTORY':
                if (this.input.enter) { this.state = 'MENU'; this._buildMenu(); this._menuHeld = true; }
                break;
            case 'QUEEN_RESCUED':
                if (this.input.enter) this._advanceLevel();
                break;
        }
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
        }

        if (this.input.enter) {
            if (!this._menuHeld) {
                const item = items[this.menuSel];
                if (item && item.action) item.action();
                this._menuHeld = true;
            }
        }
        if (!this.input.enter && !this.input.isDown('ArrowUp') && !this.input.isDown('ArrowDown') && !this.input.isDown('KeyW') && !this.input.isDown('KeyS') && !this.input.isDown('Escape')) {
            this._menuHeld = false;
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
            else { this.state = 'MENU'; this._buildMenu(); this._menuHeld = true; }
        }
        if (this.input.click) {
            const cx = this.canvas.width / 2;
            const cy = this.canvas.height / 2;
            const pw = 360, ph = 240;
            const py = cy - ph / 2;
            const btnW = 260, itemH = 42;
            const startY = py + 120;
            const bx = cx - btnW / 2;
            const mx = this.input.mouseX, my = this.input.mouseY;
            for (let i = 0; i < 2; i++) {
                const by = startY + i * itemH;
                if (mx >= bx && mx <= bx + btnW && my >= by && my <= by + itemH) {
                    this.pauseSel = i;
                    if (i === 0) { this.state = 'PLAYING'; }
                    else { this.state = 'MENU'; this._buildMenu(); this._menuHeld = true; }
                    break;
                }
            }
        }
    }

    _updateOptions() {
        const optItems = ['Controls', 'Sound Settings', 'Back'];
        if (this.optHeld) {
            if (!this.input.isDown('ArrowUp') && !this.input.isDown('ArrowDown') && !this.input.isDown('KeyW') && !this.input.isDown('KeyS') && !this.input.enter && !this.input.escape) {
                this.optHeld = false;
            }
            return;
        }
        const up = this.input.isDown('ArrowUp') || this.input.isDown('KeyW');
        const down = this.input.isDown('ArrowDown') || this.input.isDown('KeyS');
        if (up || down) {
            this.optHeld = true;
            this.optSel = (this.optSel + (down ? 1 : -1) + optItems.length) % optItems.length;
        }
        if (this.input.enter) {
            this.optHeld = true;
            if (this.optSel === 0) { /* controls view */ }
            else if (this.optSel === 1) { /* sound settings view */ }
            else { this.state = 'MENU'; this._buildMenu(); this._menuHeld = true; }
        }
        if (this.input.escape) {
            this.optHeld = true;
            this.state = 'MENU';
            this._buildMenu();
        }
    }

    _updateCharSelect() {
        const ids = PA1Assets.getCharacterIds();
        if (this._charHeld) {
            if (!this.input.isDown('ArrowLeft') && !this.input.isDown('ArrowRight') && !this.input.isDown('KeyA') && !this.input.isDown('KeyD') && !this.input.enter && !this.input.escape) {
                this._charHeld = false;
            }
            return;
        }
        const left = this.input.isDown('ArrowLeft') || this.input.isDown('KeyA');
        const right = this.input.isDown('ArrowRight') || this.input.isDown('KeyD');
        if (left || right) {
            this._charHeld = true;
            this.charSelIdx = (this.charSelIdx + (right ? 1 : -1) + ids.length) % ids.length;
        }
        if (this.input.enter) {
            this._charHeld = true;
            this.selectedCharacter = ids[this.charSelIdx];
            localStorage.setItem('pa1_char', this.selectedCharacter);
            this.state = 'MENU';
            this._buildMenu();
            this._menuHeld = true;
        }
        if (this.input.escape) {
            this._charHeld = true;
            this.state = 'MENU';
            this._buildMenu();
            this._menuHeld = true;
        }
    }

    _startNewGame() {
        this.score = 0;
        this.currentLives = 3;
        this.nextLifeScore = 5000;
        this.levelIdx = 0;
        this.customMode = false;
        this.introLine = 0;
        this.introTimer = 0;
        this.state = 'INTRO';
    }

    _startAfterIntro() {
        this._loadLevel(0);
    }

    _loadTestLevel(level) {
        const h = level.map.length, w = level.map[0].length;
        level.width = w;
        level.height = h;
        if (!level.solidMap) {
            level.solidMap = level.map.map(row => row.map(id => isSolid(id)));
        }
        this.level = level;
        this.levelIdx = 0;
        this.triggeredSprings = new Map();
        this.activatedCheckpoints = new Set();

        this.fruitCollections = [];
        this.fruitCollectionTimers = {};
        this.boxStates = {};
        this.pa1CheckpointAnims = {};
        PA1Sprites.resetTrapAnims();

        const sx = level.spawn.tx * Sprites.RENDER_TILE;
        const sy = level.spawn.ty * Sprites.RENDER_TILE;
        this.player = new Player(sx, sy, this.selectedCharacter);

        this.enemies = (level.entities || []).filter(e => !e.type.startsWith('boss_')).map(e => {
            return new Enemy(e.type, e.tx, e.ty, e.patrolL, e.patrolR, Sprites.RENDER_TILE, Sprites.RENDER_TILE);
        });

        const bossEntities = (level.entities || []).filter(e => e.type.startsWith('boss_'));
        const bossMap = { boss_orc: 0, boss_knight: 1, boss_demon: 2 };
        if (bossEntities.length > 0) {
            const be = bossEntities[0];
            const bossIdx = bossMap[be.type] || 0;
            const arenaL = Math.max(0, be.tx - 6);
            const arenaR = Math.min(w - 1, be.tx + 3);
            this.boss = new Boss(bossIdx, be.tx, be.ty, arenaL, arenaR, Sprites.RENDER_TILE, Sprites.RENDER_TILE);
            this.bossIntroTimer = 120;
        } else {
            this.boss = null;
        }
        this.bossDefeated = false;
        this.bossArenaActive = false;
        this.bossArenaLeft = 0;
        this.bossIntroTimer = 0;
        this.hitSet = new Set();
        this.hasKey = false;
        this.score = 0;
        this.currentLives = 3;
        this.nextLifeScore = 5000;
        this.particles = [];
        this.camX = 0;
        this.camY = 0;
        this.movingPlatforms = (level.platforms || []).map(p => this._createMovingPlatform(p));
        this.state = this.boss ? 'BOSS_INTRO' : 'PLAYING';
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

        this.fruitCollections = [];
        this.fruitCollectionTimers = {};
        this.boxStates = {};
        this.pa1CheckpointAnims = {};
        PA1Sprites.resetTrapAnims();

        const sx = level.spawn.tx * Sprites.RENDER_TILE;
        const sy = level.spawn.ty * Sprites.RENDER_TILE;
        this.player = new Player(sx, sy, this.selectedCharacter);

        this.enemies = level.entities.map(e => {
            return new Enemy(e.type, e.tx, e.ty, e.patrolL, e.patrolR, Sprites.RENDER_TILE, Sprites.RENDER_TILE);
        });

        this.boss = null;
        this.bossDefeated = false;
        this.bossArenaActive = false;
        this.bossArenaLeft = 0;
        this.bossIntroTimer = 0;
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

        if (this.boss) {
            this.bossIntroTimer = 120;
        }

        this.hitSet.clear();
        this.hasKey = false;
        this.particles = [];
        this.camX = 0;
        this.camY = 0;

        this.movingPlatforms = (level.platforms || []).map(p => this._createMovingPlatform(p));

        this.state = this.boss ? 'BOSS_INTRO' : 'PLAYING';
    }

    _createMovingPlatform(p) {
        const RT = Sprites.RENDER_TILE;
        const tiles = p.tiles || [];
        const minX = tiles.length > 0 ? Math.min(...tiles.map(t => t.tx)) : p.tx;
        const minY = tiles.length > 0 ? Math.min(...tiles.map(t => t.ty)) : p.ty;
        return {
            tiles: tiles,
            baseX: minX * RT,
            baseY: minY * RT,
            x: minX * RT,
            y: minY * RT,
            moveX: (p.moveX || 0) * RT,
            moveY: (p.moveY || 0) * RT,
            speed: 1,
            t: 0,
            dir: 1,
            prevX: minX * RT,
            prevY: minY * RT,
            w: (tiles.length > 0 ? (Math.max(...tiles.map(t => t.tx)) - minX + 1) : 1) * RT,
            h: (tiles.length > 0 ? (Math.max(...tiles.map(t => t.ty)) - minY + 1) : 1) * RT
        };
    }

    _loseLife() {
        this.currentLives--;
        if (this.currentLives <= 0) {
            this.currentLives = 0;
            this._triggerGameOver();
        } else {
            this._respawnPlayer();
        }
    }

    _addLife() {
        if (this.currentLives < this.maxLives) {
            this.currentLives++;
            this.lifePopupTimer = 120;
            this._emitParticles(this.player.getCenterX(), this.player.getCenterY() - 30, '#4caf50', 15, 2, -3);
        }
    }

    _checkExtraLife(scoreBefore, scoreAfter) {
        const milestoneBefore = Math.floor(scoreBefore / this.nextLifeScore);
        const milestoneAfter = Math.floor(scoreAfter / this.nextLifeScore);
        if (milestoneAfter > milestoneBefore) {
            const milestones = milestoneAfter - milestoneBefore;
            for (let i = 0; i < milestones; i++) {
                this._addLife();
            }
        }
    }

    _triggerGameOver() {
        this.audio.gameOver();
        this._emitParticles(this.player.getCenterX(), this.player.getCenterY(), '#e74c3c', 30, 3, -3);
        this.state = 'GAME_OVER';
    }

    _respawnPlayer() {
        this.player.health = this.player.maxHealth;
        this.player.dead = false;
        this.player.vx = 0;
        this.player.vy = 0;
        this.player.iframes = 90;
        this.player.x = this.player.spawnX;
        this.player.y = this.player.spawnY;
        this.hasKey = false;
        this._emitParticles(this.player.spawnX + this.player.w / 2, this.player.spawnY + this.player.h / 2, '#4caf50', 12, 2, -2);
    }

    _addScore(amount) {
        const before = this.score;
        this.score += amount;
        this._checkExtraLife(before, this.score);
    }

    _advanceLevel() {
        if (this.customMode || this.level.isTest) {
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

        PA1Sprites.updateAnimations();

        this.trapAnimTimer++;

        for (const key of Object.keys(this.pa1CheckpointAnims)) {
            this.pa1CheckpointAnims[key] = (this.pa1CheckpointAnims[key] + 1) % 1000;
        }

        if (this.fruitCollectionTimers) {
            for (const key of Object.keys(this.fruitCollectionTimers)) {
                this.fruitCollectionTimers[key]--;
                if (this.fruitCollectionTimers[key] <= 0) {
                    delete this.fruitCollectionTimers[key];
                    const idx = this.fruitCollections.indexOf(key);
                    if (idx >= 0) this.fruitCollections.splice(idx, 1);
                }
            }
        }

        for (const key of Object.keys(this.boxStates)) {
            const bs = this.boxStates[key];
            if (bs.state === 'hit' || bs.state === 'break') {
                bs.frame++;
                if (bs.state === 'hit' && bs.frame > 4) {
                    bs.state = 'break';
                    bs.frame = 0;
                } else if (bs.state === 'break' && bs.frame > 5) {
                    const parts = key.split(',');
                    const r = parseInt(parts[0]), c = parseInt(parts[1]);
                    if (this.level.map[r]) this.level.map[r][c] = 0;
                    delete this.boxStates[key];
                }
            }
        }

        this._checkSpringBounce();

        if (this.lifePopupTimer > 0) this.lifePopupTimer--;

        this.player.update(this.input, this.level.map, Sprites.RENDER_TILE, Sprites.RENDER_TILE, this.level.solidMap);

        this._updatePlatforms();
        this._platformCollision();

        if (this.player.onGround) {
            const feetCol = Math.floor((this.player.x + this.player.w / 2) / Sprites.RENDER_TILE);
            const feetRow = Math.floor((this.player.y + this.player.h) / Sprites.RENDER_TILE);
            const underTile = this.level.map[feetRow] && this.level.map[feetRow][feetCol];
            if (underTile >= 3100 && underTile <= 3102) {
                this.player.vx -= this.player.facing * 1.5;
            }
        }

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

                const bCols = getTilesInRegion(this.level.map, this.boss, Sprites.RENDER_TILE, Sprites.RENDER_TILE);
                for (const t of bCols) {
                    if (HAZARD_IDS.has(t.tileId)) {
                        this.boss.alive = false;
                        this.boss.hp = 0;
                        this._emitParticles(this.boss.x + this.boss.w / 2, this.boss.y + this.boss.h / 2, '#ff4444', 20, 3, -3);
                        break;
                    }
                }

            if (!this.bossArenaActive && this.player.x + this.player.w > this.bossArenaLeft) {
                this.bossArenaActive = true;
            }
            if (this.bossArenaActive) {
                if (this.player.x < this.bossArenaLeft) {
                    this.player.x = this.bossArenaLeft;
                    this.player.vx = 0;
                }
            }

            if (this.boss.checkProjectileHit(this.player)) {
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
            this._loseLife();
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

    _updatePlatforms() {
        const RT = Sprites.RENDER_TILE;
        for (const mp of this.movingPlatforms) {
            mp.prevX = mp.x;
            mp.prevY = mp.y;
            mp.t += 0.008 * mp.speed * mp.dir;
            if (mp.t >= 1) { mp.t = 1; mp.dir = -1; }
            if (mp.t <= 0) { mp.t = 0; mp.dir = 1; }
            const eased = mp.t < 0.5 ? 2 * mp.t * mp.t : 1 - Math.pow(-2 * mp.t + 2, 2) / 2;
            mp.x = mp.baseX + mp.moveX * eased;
            mp.y = mp.baseY + mp.moveY * eased;
            const dx = mp.x - mp.prevX;
            const dy = mp.y - mp.prevY;
            const p = this.player;
            if (dx === 0 && dy === 0) continue;
            const platTop = mp.y;
            const platBot = mp.y + mp.h;
            const platLeft = mp.x;
            const platRight = mp.x + mp.w;
            const pBot = p.y + p.h;
            const pCenterX = p.x + p.w / 2;
            if (pBot >= platTop - 4 && pBot <= platTop + 8 &&
                pCenterX >= platLeft - 2 && pCenterX <= platRight + 2 &&
                p.vy >= 0 && dy <= 0) {
                p.x += dx;
                p.y += dy;
            }
        }
    }

    _platformCollision() {
        const p = this.player;
        for (const mp of this.movingPlatforms) {
            if (mp.tiles.length === 0) continue;
            const RT = Sprites.RENDER_TILE;
            const pBot = p.y + p.h;
            const pRight = p.x + p.w;
            const pCenterX = p.x + p.w / 2;
            if (pRight > mp.x + 2 && p.x < mp.x + mp.w - 2) {
                if (pBot >= mp.y && pBot <= mp.y + 10 && p.vy >= 0) {
                    p.y = mp.y - p.h;
                    p.vy = 0;
                    p.onGround = true;
                }
            }
            for (const t of mp.tiles) {
                const tx = mp.x + (t.tx - Math.min(...mp.tiles.map(tt => tt.tx))) * RT;
                const ty = mp.y + (t.ty - Math.min(...mp.tiles.map(tt => tt.ty))) * RT;
                if (pRight > tx && p.x < tx + RT && p.y + p.h > ty + 4 && p.y < ty + RT) {
                    const overlapL = pRight - tx;
                    const overlapR = (tx + RT) - p.x;
                    const overlapT = (p.y + p.h) - ty;
                    const overlapB = (ty + RT) - p.y;
                    if (pCenterX < tx + RT / 2 && overlapL < RT * 0.5) { p.x = tx - p.w; p.vx = 0; }
                    else if (overlapR < RT * 0.5) { p.x = tx + RT; p.vx = 0; }
                }
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
                this._addScore(10);
                this.audio.coin();
                this._emitParticles(t.x + Sprites.RENDER_TILE / 2, t.y + Sprites.RENDER_TILE / 2, '#ffd700', 6, 2, -2);
            } else if (HEART_IDS.has(t.tileId)) {
                this.level.map[t.row][t.col] = 0;
                this.player.health = Math.min(this.player.maxHealth, this.player.health + 25);
                this._addScore(25);
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
                this._addScore(200);
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
            } else if (FRUIT_IDS && FRUIT_IDS.has(t.tileId)) {
                const key = `${t.row},${t.col}`;
                if (!this.fruitCollections.includes(key)) {
                    this.fruitCollections.push(key);
                    if (!this.fruitCollectionTimers) this.fruitCollectionTimers = {};
                    this.fruitCollectionTimers[key] = 24;
                    this._addScore(15);
                    this.audio.coin();
                    this._emitParticles(t.x + Sprites.RENDER_TILE / 2, t.y + Sprites.RENDER_TILE / 2, '#ff6b9d', 8, 2, -3);
                }
            } else if (BOX_IDS && BOX_IDS.has(t.tileId)) {
                const key = `${t.row},${t.col}`;
                if (!this.boxStates[key]) {
                    this.boxStates[key] = { state: 'hit', frame: 0 };
                    this.audio.hit();
                    this._emitParticles(t.x + Sprites.RENDER_TILE / 2, t.y + Sprites.RENDER_TILE / 2, '#c8a832', 6, 2, -2);
                }
            } else if (PA1_CHECKPOINT_IDS && PA1_CHECKPOINT_IDS.has(t.tileId)) {
                const key = `${t.col},${t.row}`;
                if (!this.activatedCheckpoints.has(key)) {
                    this.activatedCheckpoints.add(key);
                    this.pa1CheckpointAnims[key] = 0;
                    this.player.spawnX = t.col * Sprites.RENDER_TILE + (Sprites.RENDER_TILE - this.player.w) / 2;
                    this.player.spawnY = t.row * Sprites.RENDER_TILE;
                    this.audio.coin();
                    this._emitParticles(t.x + Sprites.RENDER_TILE / 2, t.y + Sprites.RENDER_TILE / 2, '#4fc3f7', 10, 2, -3);
                }
            } else if (TRAP_IDS && TRAP_IDS.has(t.tileId)) {
                if (this.player.takeDamage(12)) {
                    this.player.knockback(this.player.x + this.player.w / 2);
                    this.audio.spike();
                    this._emitParticles(this.player.getCenterX(), this.player.getCenterY(), '#ff4444', 8, 3, -2);
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
                    this._addScore(e.config.score);
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
                this._addScore(this.boss.config.score);
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
            case 'OPTIONS':
                this.ui.renderOptions(this.optSel, this.masterVol, this.sfxVol, this.musicVol);
                break;
            case 'CHAR_SELECT':
                this._renderCharSelect();
                break;
            case 'PLAYING':
            case 'PAUSED':
            case 'BOSS_INTRO':
                this._renderWorld();
                this._renderParticles();
                this.ui.renderHUD(this.player, this.score, this.level.name, this.levelIdx + 1, getTotalLevels(), this.boss, this.hasKey, this.currentLives, this.fruitCollections.length);
                if (this.state === 'PAUSED') this.ui.renderPause(this.score, this.level.name, this.pauseSel);
                if (this.state === 'BOSS_INTRO') this.ui.renderBossIntro(this.boss, this.bossIntroTimer);
                if (this.lifePopupTimer > 0) this.ui.renderLifePopup(this.lifePopupTimer);
                break;
            case 'LEVEL_COMPLETE':
                this._renderWorld();
                this._renderParticles();
                this.ui.renderHUD(this.player, this.score, this.level.name, this.levelIdx + 1, getTotalLevels(), this.boss, this.hasKey, this.currentLives, this.fruitCollections.length);
                this.ui.renderLevelComplete(this.level.name, this.score, 200);
                break;
            case 'GAME_OVER':
                this._renderWorld();
                this.ui.renderGameOver(this.score, this.level.name, this.levelIdx, this.currentLives);
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
        const RT = Sprites.RENDER_TILE;

        const bgDrawn = lvl.bgImage ? PA1Sprites.drawBackground(ctx, lvl.bgImage, this.W, this.H, this.camX, this.camY) : false;
        if (!bgDrawn) {
            Sprites.drawBgParallax(ctx, this.W, this.H, this.camX, this.camY, lvl.bgColor);
        }

        const startCol = Math.max(0, Math.floor(cx / RT));
        const endCol = Math.min(lvl.width - 1, Math.ceil((cx + this.W) / RT));
        const startRow = Math.max(0, Math.floor(cy / RT));
        const endRow = Math.min(lvl.height - 1, Math.ceil((cy + this.H) / RT));

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

                if (FRUIT_IDS && FRUIT_IDS.has(id)) {
                    const fruitName = this._fruitIdToName(id);
                    if (fruitName) {
                        const collectKey = `${row},${col}`;
                        if (!this.fruitCollections.includes(collectKey)) {
                            PA1Sprites.drawFruit(ctx, fruitName, col * RT - cx, row * RT - cy);
                        }
                    }
                } else if (BOX_IDS && BOX_IDS.has(id)) {
                    const boxKey = `${row},${col}`;
                    const bState = this.boxStates[boxKey] || { state: 'idle', frame: 0 };
                    const boxType = this._boxIdToType(id);
                    PA1Sprites.drawBox(ctx, boxType, bState.state, col * RT - cx, row * RT - cy, bState.frame);
                } else if (PA1_CHECKPOINT_IDS && PA1_CHECKPOINT_IDS.has(id)) {
                    const cpKey = `${row},${col}`;
                    const active = this.activatedCheckpoints.has(cpKey);
                    const cpAnim = this.pa1CheckpointAnims[cpKey] || 0;
                    PA1Sprites.drawCheckpoint(ctx, 'checkpoint', active, col * RT - cx, row * RT - cy, cpAnim);
                } else if (TRAP_IDS && TRAP_IDS.has(id)) {
                    this._renderTrap(ctx, id, col * RT - cx, row * RT - cy);
                } else if (id > 0) {
                    Sprites.drawTile(ctx, id, col * RT - cx, row * RT - cy);
                }
            }
        }

        if (lvl.decorations) {
            for (const d of lvl.decorations) {
                const dx = d.tx * RT - cx;
                const dy = d.ty * RT - cy;
                if (dx > -RT && dx < this.W + RT && dy > -RT && dy < this.H + RT) {
                    Sprites.drawTile(ctx, d.id, dx, dy);
                }
            }
        }

        this.enemies.forEach(e => e.render(ctx, cx, cy, Sprites.drawChar));
        if (this.boss) this.boss.render(ctx, cx, cy);
        this.player.render(ctx, cx, cy, Sprites.drawChar);

        for (const mp of this.movingPlatforms) {
            for (const t of mp.tiles) {
                const tx = t.tx * RT - mp.baseX + mp.x - cx;
                const ty = t.ty * RT - mp.baseY + mp.y - cy;
                if (tx > -RT && tx < this.W + RT && ty > -RT && ty < this.H + RT) {
                    Sprites.drawTile(ctx, t.id, tx, ty);
                }
            }
        }

        for (const fc of this.fruitCollections) {
            const parts = fc.split(',');
            const fr = parseInt(parts[0]), fcol = parseInt(parts[1]);
            const fx = fcol * RT - cx;
            const fy = fr * RT - cy;
            const fTimer = this.fruitCollectionTimers ? this.fruitCollectionTimers[fc] : 0;
            if (fTimer > 0) {
                PA1Sprites.drawFruitCollected(ctx, fx, fy, Math.min(5, 6 - Math.ceil(fTimer / 4)));
            }
        }
    }

    _renderTrap(ctx, id, screenX, screenY) {
        if (id >= 4100 && id <= 4102) {
            PA1Sprites.drawTrapFire(ctx, true, screenX, screenY);
        } else if (id === 4103) {
            PA1Sprites.drawTrapFire(ctx, false, screenX, screenY);
        } else if (id === 4110) {
            PA1Sprites.drawTrapSaw(ctx, true, screenX, screenY);
        } else if (id === 4111) {
            PA1Sprites.drawTrapSaw(ctx, false, screenX, screenY);
        } else if (id === 4120) {
            PA1Sprites.drawTrampoline(ctx, false, screenX, screenY, 0);
        } else if (id === 4121) {
            const frame = PA1Sprites.getTrapAnimFrame('trampoline', 4) % 8;
            PA1Sprites.drawTrampoline(ctx, true, screenX, screenY, frame);
        }
    }

    _fruitIdToName(id) {
        const map = { 5001: 'apple', 5002: 'bananas', 5003: 'cherries', 5004: 'kiwi', 5005: 'melon', 5006: 'orange', 5007: 'pineapple', 5008: 'strawberry' };
        return map[id] || null;
    }

    _fruitNameToId(name) {
        const map = { apple: 5001, bananas: 5002, cherries: 5003, kiwi: 5004, melon: 5005, orange: 5006, pineapple: 5007, strawberry: 5008 };
        return map[name] || 0;
    }

    _boxIdToType(id) {
        if (id >= 5020 && id <= 5029) return 'box1';
        if (id >= 5030 && id <= 5039) return 'box2';
        if (id >= 5040 && id <= 5049) return 'box3';
        return 'box1';
    }

    _renderCharSelect() {
        const ctx = this.ctx;
        const cx = this.W / 2, cy = this.H / 2;

        const bgGrad = ctx.createLinearGradient(0, 0, 0, this.H);
        bgGrad.addColorStop(0, '#0a0814');
        bgGrad.addColorStop(1, '#141028');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, this.W, this.H);

        ctx.save();
        ctx.shadowColor = 'rgba(200,168,50,0.5)';
        ctx.shadowBlur = 12;
        ctx.fillStyle = '#f0d860';
        ctx.font = '18px "Press Start 2P"';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('SELECT CHARACTER', cx, 60);
        ctx.shadowBlur = 0;
        ctx.restore();

        const ids = PA1Assets.getCharacterIds();
        const names = PA1Assets.getCharNames();
        const total = ids.length;
        const cardW = 150, cardH = 200, gap = 30;
        const totalW = total * cardW + (total - 1) * gap;
        const startX = cx - totalW / 2;
        const cardY = cy - cardH / 2;

        for (let i = 0; i < total; i++) {
            const x = startX + i * (cardW + gap);
            const isSel = i === this.charSelIdx;

            ctx.save();
            if (isSel) {
                ctx.shadowColor = 'rgba(255,200,50,0.6)';
                ctx.shadowBlur = 20;
                ctx.fillStyle = 'rgba(60,40,20,0.9)';
                ctx.strokeStyle = '#ffc840';
                ctx.lineWidth = 3;
            } else {
                ctx.fillStyle = 'rgba(20,15,30,0.8)';
                ctx.strokeStyle = '#3a2a4a';
                ctx.lineWidth = 1;
            }
            ctx.beginPath();
            ctx.roundRect(x, cardY, cardW, cardH, 8);
            ctx.fill();
            ctx.stroke();
            ctx.shadowBlur = 0;
            ctx.restore();

            const charData = PA1Assets.getCharacter(ids[i]);
            if (charData && charData.idle) {
                const sheet = charData.idle;
                const frameW = 32;
                const frame = Math.floor(this.frameCount / 10) % PA1Assets.getStripFrameCount(sheet, frameW);
                const renderSz = cardW * 0.7;
                PA1Assets.drawStripFrame(ctx, sheet, frame, frameW, 32, x + (cardW - renderSz) / 2, cardY + 30, renderSz, renderSz, false);
            }

            ctx.fillStyle = isSel ? '#f0d860' : '#7a6a8a';
            ctx.font = '8px "Press Start 2P"';
            ctx.textAlign = 'center';
            ctx.fillText(names[i], x + cardW / 2, cardY + cardH - 25);

            if (isSel) {
                ctx.fillStyle = '#4caf50';
                ctx.font = '8px "Press Start 2P"';
                ctx.fillText('SELECTED', x + cardW / 2, cardY + cardH - 8);
            }
        }

        ctx.fillStyle = 'rgba(196,168,130,0.5)';
        ctx.font = '8px "Press Start 2P"';
        ctx.textAlign = 'center';
        ctx.fillText('Left/Right - Select    Enter - Confirm    Escape - Back', cx, this.H - 30);
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
