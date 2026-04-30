import { RENDER_CHAR, RENDER_TILE, SCALE, CHAR_SIZE } from './renderer.js';
import { moveEntity, isSolid, HAZARD_IDS, COIN_IDS, HEART_IDS, getTilesInRegion, rectOverlap } from './collision.js';

const GRAVITY = 0.48;
const JUMP_FORCE = -12.5;
const MOVE_ACCEL = 0.7;
const MOVE_DECEL = 0.35;
const MAX_SPEED = 4.5;
const ATTACK_DURATION = 16;
const ATTACK_RANGE = 55;
const IFRAME_DURATION = 45;
const KNOCKBACK_X = 6;
const KNOCKBACK_Y = -6;

const CHAR_IDS = {
    idle: 1,
    run1: 2, run2: 3, run3: 4,
    jump: 5,
    fall: 6,
    attack: 7,
    hurt: 8,
    dead: 9
};

export class Player {
    constructor(spawnX, spawnY) {
        this.spawnX = spawnX;
        this.spawnY = spawnY;
        this.reset();
    }

    reset() {
        const pw = CHAR_SIZE * SCALE * 0.65;
        const ph = CHAR_SIZE * SCALE * 0.85;
        this.x = this.spawnX;
        this.y = this.spawnY;
        this.w = pw;
        this.h = ph;
        this.vx = 0;
        this.vy = 0;
        this.facing = 1;
        this.onGround = false;
        this.health = 100;
        this.maxHealth = 100;
        this.lives = 3;
        this.attacking = false;
        this.attackTimer = 0;
        this.iframes = 0;
        this.dead = false;
        this.animFrame = 0;
        this.animTimer = 0;
        this.runFrames = [CHAR_IDS.run1, CHAR_IDS.run2, CHAR_IDS.run3];
        this.didJump = false;
        this.didAttack = false;
    }

    update(input, solidMap, tileW, tileH) {
        if (this.dead) return;

        let targetVx = 0;
        if (input.left) { targetVx = -MAX_SPEED; this.facing = -1; }
        if (input.right) { targetVx = MAX_SPEED; this.facing = 1; }

        if (targetVx !== 0) {
            this.vx += (targetVx - this.vx) * MOVE_ACCEL * 0.3;
            this.vx = Math.sign(this.vx) * Math.min(Math.abs(this.vx), MAX_SPEED);
        } else {
            this.vx *= (1 - MOVE_DECEL);
            if (Math.abs(this.vx) < 0.1) this.vx = 0;
        }

        if (input.jumpPressed && this.onGround) {
            this.vy = JUMP_FORCE;
            this.onGround = false;
            this.didJump = true;
        }
        if (!input.jump && this.vy < -3) {
            this.vy *= 0.6;
        }

        this.vy += GRAVITY;
        if (this.vy > 12) this.vy = 12;

        this.onGround = moveEntity(this, this.vx, this.vy, solidMap, tileW, tileH);

        if (input.attack && !this.attacking) {
            this.attacking = true;
            this.attackTimer = ATTACK_DURATION;
            this.didAttack = true;
        }
        if (this.attacking) {
            this.attackTimer--;
            if (this.attackTimer <= 0) this.attacking = false;
        }

        if (this.iframes > 0) this.iframes--;

        if (Math.abs(this.vx) > 0.5 && this.onGround) {
            this.animTimer++;
            if (this.animTimer >= 6) {
                this.animTimer = 0;
                this.animFrame = (this.animFrame + 1) % this.runFrames.length;
            }
        } else {
            this.animTimer = 0;
            this.animFrame = 0;
        }

        if (this.y > solidMap.length * tileH + 100) {
            this.takeDamage(30);
            if (!this.dead) {
                this.x = this.spawnX;
                this.y = this.spawnY - tileH * 2;
                this.vx = 0;
                this.vy = 0;
            }
        }
    }

    takeDamage(amount) {
        if (this.iframes > 0 || this.dead) return false;
        this.health -= amount;
        this.iframes = IFRAME_DURATION;
        if (this.health <= 0) {
            this.health = 0;
            this.dead = true;
        }
        return true;
    }

    knockback(fromX) {
        const dir = this.x < fromX ? -1 : 1;
        this.vx = KNOCKBACK_X * dir;
        this.vy = KNOCKBACK_Y;
        this.onGround = false;
    }

    getAttackBox() {
        if (!this.attacking || this.attackTimer < ATTACK_DURATION - 8) return null;
        return {
            x: this.facing > 0 ? this.x + this.w : this.x - ATTACK_RANGE,
            y: this.y + 5,
            w: ATTACK_RANGE,
            h: this.h - 10
        };
    }

    getCenterX() { return this.x + this.w / 2; }
    getCenterY() { return this.y + this.h / 2; }

    render(ctx, camX, camY, drawCharFn) {
        if (this.dead) return;

        if (this.iframes > 0 && Math.floor(this.iframes / 3) % 2 === 0) return;

        let charId;
        if (this.attacking) {
            charId = CHAR_IDS.attack;
        } else if (!this.onGround) {
            charId = this.vy < 0 ? CHAR_IDS.jump : CHAR_IDS.fall;
        } else if (Math.abs(this.vx) > 0.5) {
            charId = this.runFrames[this.animFrame];
        } else {
            charId = CHAR_IDS.idle;
        }

        const drawX = this.x - camX - (RENDER_CHAR - this.w) / 2;
        const drawY = this.y - camY - (RENDER_CHAR - this.h);
        drawCharFn(ctx, charId, drawX, drawY, this.facing < 0);
    }
}
