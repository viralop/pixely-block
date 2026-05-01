import { RENDER_TILE, RENDER_CHAR, SCALE, CHAR_SIZE, drawExtra, hasExtra } from './renderer.js';
import { moveEntity, isSolid, getTileAt, getTilesInRegion, rectOverlap } from './collision.js';

const GRAVITY = 0.45;

const BOSS_DEFS = [
    { name: 'Dark Orc', hp: 20, speed: 1.0, chaseSpeed: 2.0, chaseRange: 300, score: 500, sprites: ['boss1', 'boss2'], width: 1.0, height: 1.0 },
    { name: 'Shadow Knight', hp: 30, speed: 1.2, chaseSpeed: 2.5, chaseRange: 350, score: 800, sprites: ['boss3', 'boss4'], width: 1.0, height: 1.0 },
    { name: 'Demon Lord', hp: 50, speed: 1.5, chaseSpeed: 3.0, chaseRange: 400, score: 1500, sprites: ['boss5', 'boss1'], width: 1.2, height: 1.2 }
];

export class Boss {
    constructor(bossIdx, tileX, tileY, patrolLeft, patrolRight, tileW, tileH) {
        const def = BOSS_DEFS[bossIdx % BOSS_DEFS.length];
        this.name = def.name;
        this.config = def;
        this.w = CHAR_SIZE * SCALE * def.width;
        this.h = CHAR_SIZE * SCALE * def.height;
        this.x = tileX * tileW + (tileW - this.w) / 2;
        this.y = tileY * tileH + (tileH - this.h);
        this.vx = 0;
        this.vy = 0;
        this.maxHp = def.hp;
        this.hp = def.hp;
        this.alive = true;
        this.facing = -1;
        this.patrolLeft = patrolLeft * tileW;
        this.patrolRight = patrolRight * tileW;
        this.patrolDir = 1;
        this.hitTimer = 0;
        this.attackCooldown = 0;
        this.animFrame = 0;
        this.animTimer = 0;
        this.phase = 0;
    }

    update(solidMap, tileW, tileH, playerX, playerY, playerAlive, customSolidMap) {
        if (!this.alive) return;
        if (this.hitTimer > 0) this.hitTimer--;
        if (this.attackCooldown > 0) this.attackCooldown--;

        if (this.hp <= this.maxHp / 2 && this.phase === 0) {
            this.phase = 1;
            this.config.speed *= 1.3;
            this.config.chaseSpeed *= 1.3;
        }

        const dx = playerX - (this.x + this.w / 2);
        const dist = Math.abs(dx);
        const shouldChase = playerAlive && dist < this.config.chaseRange;

        if (shouldChase) {
            this.vx = (dx > 0 ? 1 : -1) * this.config.chaseSpeed;
            this.facing = dx > 0 ? 1 : -1;
        } else {
            this.vx = this.config.speed * this.patrolDir;
            this.facing = this.patrolDir;
            if (this.x <= this.patrolLeft) this.patrolDir = 1;
            if (this.x + this.w >= this.patrolRight) this.patrolDir = -1;
        }

        this.vy += GRAVITY;
        if (this.vy > 10) this.vy = 10;
        const grounded = moveEntity(this, this.vx, this.vy, solidMap, tileW, tileH, customSolidMap);
        if (grounded) this.vy = 0;

        this.animTimer++;
        if (this.animTimer >= 12) {
            this.animTimer = 0;
            this.animFrame = (this.animFrame + 1) % this.config.sprites.length;
        }
    }

    takeDamage(fromX) {
        this.hp -= 2;
        this.hitTimer = 10;
        const dir = this.x + this.w / 2 < fromX ? -1 : 1;
        this.vx = dir * 3;
        this.vy = -3;
        if (this.hp <= 0) {
            this.hp = 0;
            this.alive = false;
        }
    }

    canDamagePlayer() {
        return this.alive && this.attackCooldown <= 0;
    }

    onPlayerHit() {
        this.attackCooldown = 40;
    }

    render(ctx, camX, camY) {
        if (!this.alive) return;
        if (this.hitTimer > 0 && Math.floor(this.hitTimer / 2) % 2 === 0) return;

        const spriteKey = this.config.sprites[this.animFrame];
        const drawX = this.x - camX - (RENDER_CHAR - this.w) / 2;
        const drawY = this.y - camY - (RENDER_CHAR - this.h);

        if (hasExtra(spriteKey)) {
            drawExtra(ctx, spriteKey, drawX, drawY, RENDER_CHAR + 1, this.facing < 0);
        }

        this._renderHpBar(ctx, camX, camY);
    }

    _renderHpBar(ctx, camX, camY) {
        const barW = this.w + 20;
        const barH = 8;
        const barX = this.x - camX + (this.w - barW) / 2;
        const barY = this.y - camY - 20;
        const pct = Math.max(0, this.hp / this.maxHp);

        ctx.fillStyle = '#111';
        ctx.fillRect(barX - 1, barY - 1, barW + 2, barH + 2);

        const color = pct > 0.5 ? '#e74c3c' : pct > 0.25 ? '#ff6600' : '#ff0000';
        ctx.fillStyle = '#333';
        ctx.fillRect(barX, barY, barW, barH);
        ctx.fillStyle = color;
        ctx.fillRect(barX, barY, barW * pct, barH);

        ctx.fillStyle = '#fff';
        ctx.font = '8px "Press Start 2P", monospace';
        ctx.textAlign = 'center';
        ctx.fillText(this.name, barX + barW / 2, barY - 4);
        ctx.textAlign = 'start';
    }
}

export function getBossDef(levelIdx) {
    const bossCount = Math.floor(levelIdx / 5);
    return BOSS_DEFS[bossCount % BOSS_DEFS.length];
}

export function isBossLevel(levelIdx) {
    return (levelIdx + 1) % 5 === 0;
}
