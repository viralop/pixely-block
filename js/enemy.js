import { RENDER_CHAR, RENDER_TILE, SCALE, CHAR_SIZE } from './renderer.js';
import { moveEntity, isSolid, rectOverlap } from './collision.js';

const GRAVITY = 0.45;
const ENEMY_TYPES = {
    slime: {
        hp: 2, speed: 1.2, chaseSpeed: 2.2, chaseRange: 180, score: 50,
        frames: [10, 11], width: 0.55, height: 0.55, groundOnly: true
    },
    bat: {
        hp: 1, speed: 1.5, chaseSpeed: 2.8, chaseRange: 220, score: 75,
        frames: [19, 20], width: 0.5, height: 0.5, groundOnly: false
    },
    skeleton: {
        hp: 3, speed: 1.0, chaseSpeed: 2.5, chaseRange: 200, score: 100,
        frames: [14, 15], width: 0.6, height: 0.8, groundOnly: true
    }
};

export class Enemy {
    constructor(type, tileX, tileY, patrolLeft, patrolRight, tileW, tileH) {
        const cfg = ENEMY_TYPES[type];
        this.type = type;
        this.config = cfg;
        this.w = CHAR_SIZE * SCALE * cfg.width;
        this.h = CHAR_SIZE * SCALE * cfg.height;
        this.x = tileX * tileW + (tileW - this.w) / 2;
        this.y = tileY * tileH + (tileH - this.h);
        this.vx = 0;
        this.vy = 0;
        this.hp = cfg.hp;
        this.alive = true;
        this.facing = 1;
        this.patrolLeft = patrolLeft * tileW;
        this.patrolRight = patrolRight * tileW;
        this.patrolDir = 1;
        this.hitTimer = 0;
        this.attackCooldown = 0;
        this.animFrame = 0;
        this.animTimer = 0;
        this.baseY = this.y;
        this.floatOffset = 0;
    }

    update(solidMap, tileW, tileH, playerX, playerY, playerAlive) {
        if (!this.alive) return;

        if (this.hitTimer > 0) this.hitTimer--;
        if (this.attackCooldown > 0) this.attackCooldown--;

        const dx = playerX - (this.x + this.w / 2);
        const dy = playerY - (this.y + this.h / 2);
        const dist = Math.sqrt(dx * dx + dy * dy);
        const shouldChase = playerAlive && dist < this.config.chaseRange && Math.abs(dy) < RENDER_TILE * 5;

        if (this.config.groundOnly) {
            if (shouldChase) {
                this.vx = (dx > 0 ? 1 : -1) * this.config.chaseSpeed;
                this.facing = dx > 0 ? 1 : -1;
            } else {
                this.vx = this.config.speed * this.patrolDir;
                this.facing = this.patrolDir;
                if (this.x <= this.patrolLeft) { this.patrolDir = 1; }
                if (this.x + this.w >= this.patrolRight) { this.patrolDir = -1; }
            }
            this.vy += GRAVITY;
            if (this.vy > 10) this.vy = 10;
            const grounded = moveEntity(this, this.vx, this.vy, solidMap, tileW, tileH);
            if (grounded) this.vy = 0;
        } else {
            if (shouldChase) {
                this.vx += (dx > 0 ? 0.15 : -0.15);
                this.vy += (dy > 0 ? 0.1 : -0.1);
                this.facing = dx > 0 ? 1 : -1;
            } else {
                this.floatOffset += 0.04;
                this.vy = Math.sin(this.floatOffset) * 0.8;
                this.vx = this.config.speed * this.patrolDir * 0.5;
                if (this.x <= this.patrolLeft) this.patrolDir = 1;
                if (this.x + this.w >= this.patrolRight) this.patrolDir = -1;
            }
            const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
            if (speed > this.config.chaseSpeed) {
                this.vx = (this.vx / speed) * this.config.chaseSpeed;
                this.vy = (this.vy / speed) * this.config.chaseSpeed;
            }
            this.x += this.vx;
            this.y += this.vy;
        }

        this.animTimer++;
        if (this.animTimer >= 15) {
            this.animTimer = 0;
            this.animFrame = (this.animFrame + 1) % 2;
        }
    }

    takeDamage(fromX) {
        this.hp--;
        this.hitTimer = 10;
        const dir = this.x + this.w / 2 < fromX ? -1 : 1;
        this.vx = dir * 4;
        if (this.config.groundOnly) this.vy = -4;
        if (this.hp <= 0) {
            this.alive = false;
        }
    }

    canDamagePlayer() {
        return this.alive && this.attackCooldown <= 0;
    }

    onPlayerHit() {
        this.attackCooldown = 50;
    }

    render(ctx, camX, camY, drawCharFn) {
        if (!this.alive) return;

        if (this.hitTimer > 0 && Math.floor(this.hitTimer / 2) % 2 === 0) return;

        const charId = this.config.frames[this.animFrame];
        const drawX = this.x - camX - (RENDER_CHAR - this.w) / 2;
        const drawY = this.y - camY - (RENDER_CHAR - this.h);

        drawCharFn(ctx, charId, drawX, drawY, this.facing < 0);
    }
}
