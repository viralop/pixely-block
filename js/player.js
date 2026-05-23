import { RENDER_CHAR, RENDER_TILE, SCALE, CHAR_SIZE, drawExtra, hasExtra } from './renderer.js';
import { moveEntity, isSolid, isLadder, isRope, isHook, getTileAt, HAZARD_IDS, COIN_IDS, HEART_IDS, getTilesInRegion, rectOverlap } from './collision.js';
import * as PA1Assets from './pa1-assets.js';

const GRAVITY = 0.48;
const JUMP_FORCE = -14;
const MOVE_ACCEL = 0.7;
const MOVE_DECEL = 0.35;
const MAX_SPEED = 4.5;
const ATTACK_DURATION = 16;
const ATTACK_RANGE = 65;
const IFRAME_DURATION = 45;
const KNOCKBACK_X = 6;
const KNOCKBACK_Y = -6;
const JUMP_BUFFER = 8;
const COYOTE_TIME = 6;
const CLIMB_SPEED = 2.5;
const ROPE_SPEED = 3;

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
    constructor(spawnX, spawnY, characterId) {
        this.spawnX = spawnX;
        this.spawnY = spawnY;
        this.characterId = characterId || 'ninja_frog';
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
        this.idleAnimFrame = 0;
        this.idleAnimTimer = 0;
        this.runFrames = [CHAR_IDS.run1, CHAR_IDS.run2, CHAR_IDS.run3];
        this.didJump = false;
        this.didAttack = false;
        this.jumpBuffer = 0;
        this.coyoteTimer = 0;
        this.climbing = false;
        this.onRope = false;
        this.ropeY = 0;
        this.hookCooldown = 0;
    }

    update(input, solidMap, tileW, tileH, customSolidMap) {
        if (this.dead) return;
        if (this.climbing) { this._updateClimbing(input, solidMap, tileW, tileH, customSolidMap); return; }
        if (this.onRope) { this._updateRope(input, solidMap, tileW, tileH, customSolidMap); return; }
        this._updateNormal(input, solidMap, tileW, tileH, customSolidMap);
    }

    _updateNormal(input, solidMap, tileW, tileH, customSolidMap) {
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
        if (this.jumpBuffer > 0) this.jumpBuffer--;
        if (this.onGround) this.coyoteTimer = COYOTE_TIME;
        else if (this.coyoteTimer > 0) this.coyoteTimer--;
        if (input.jumpPressed) this.jumpBuffer = JUMP_BUFFER;
        if (this.jumpBuffer > 0 && this.coyoteTimer > 0) {
            this.vy = JUMP_FORCE;
            this.onGround = false;
            this.coyoteTimer = 0;
            this.jumpBuffer = 0;
            this.didJump = true;
        }
        if (!input.jump && this.vy < -3) this.vy *= 0.6;
        this.vy += GRAVITY;
        if (this.vy > 12) this.vy = 12;
        this.onGround = moveEntity(this, this.vx, this.vy, solidMap, tileW, tileH, customSolidMap);
        const worldW = solidMap[0].length * tileW;
        if (this.x < 0) { this.x = 0; this.vx = 0; }
        if (this.x + this.w > worldW) { this.x = worldW - this.w; this.vx = 0; }
        if (input.attack && !this.attacking) {
            this.attacking = true;
            this.attackTimer = ATTACK_DURATION;
            this.didAttack = true;
        }
        if (this.attacking) { this.attackTimer--; if (this.attackTimer <= 0) this.attacking = false; }
        if (this.iframes > 0) this.iframes--;
        if (Math.abs(this.vx) > 0.5 && this.onGround) {
            this.animTimer++;
            if (this.animTimer >= 6) { this.animTimer = 0; this.animFrame = (this.animFrame + 1) % this.runFrames.length; }
        } else { this.animTimer = 0; this.animFrame = 0; }
        if (Math.abs(this.vx) < 0.5 && this.onGround) {
            this.idleAnimTimer++;
            if (this.idleAnimTimer >= 20) { this.idleAnimTimer = 0; this.idleAnimFrame = (this.idleAnimFrame + 1) % 11; }
        }
        this._checkGrabLadder(input, solidMap, tileW, tileH);
        this._checkGrabRope(input, solidMap, tileW, tileH);
        if (this.y > solidMap.length * tileH + 100) {
            this.takeDamage(30);
            if (!this.dead) { this.x = this.spawnX; this.y = this.spawnY - tileH * 2; this.vx = 0; this.vy = 0; }
        }
    }

    _checkGrabLadder(input, solidMap, tileW, tileH) {
        if (!input.up && !input.down) return;
        const centerX = this.x + this.w / 2;
        const col = Math.floor(centerX / tileW);
        const topRow = Math.floor(this.y / tileH);
        const botRow = Math.floor((this.y + this.h - 1) / tileH);
        for (let row = topRow; row <= botRow; row++) {
            if (isLadder(getTileAt(solidMap, col, row))) {
                this.climbing = true;
                this.vx = 0; this.vy = 0; this.onGround = false;
                this.x = col * tileW + (tileW - this.w) / 2;
                return;
            }
        }
    }

    _checkGrabRope(input, solidMap, tileW, tileH) {
        if (this.hookCooldown > 0) {
            this.hookCooldown--;
            return;
        }
        const centerX = this.x + this.w / 2;
        const col = Math.floor(centerX / tileW);
        const topRow = Math.floor(this.y / tileH);
        const botRow = Math.floor((this.y + this.h - 1) / tileH);
        for (let row = topRow; row <= botRow; row++) {
            const tile = getTileAt(solidMap, col, row);
            if (isHook(tile)) {
                this.onRope = true;
                this.vx = 0; this.vy = 0;
                this.ropeY = row * tileH;
                this.y = this.ropeY + tileH - this.h;
                return;
            }
            if (isRope(tile) && input.up && this.vy < 0) {
                this.onRope = true;
                this.vx = 0; this.vy = 0;
                this.ropeY = row * tileH;
                this.y = this.ropeY + tileH - this.h;
                return;
            }
        }
    }

    _updateClimbing(input, solidMap, tileW, tileH, customSolidMap) {
        if (input.jumpPressed) {
            this.climbing = false;
            this.vy = JUMP_FORCE;
            if (input.left) this.vx = -MAX_SPEED;
            else if (input.right) this.vx = MAX_SPEED;
            else this.vx = 0;
            return;
        }
        this.vx = 0; this.vy = 0;
        if (input.up) this.y -= CLIMB_SPEED;
        if (input.down) this.y += CLIMB_SPEED;
        if (this.y < 0) this.y = 0;
        if (input.left) this.facing = -1;
        if (input.right) this.facing = 1;
        const centerX = this.x + this.w / 2;
        const col = Math.floor(centerX / tileW);
        const row = Math.floor((this.y + this.h / 2) / tileH);
        if (!isLadder(getTileAt(solidMap, col, row))) { this.climbing = false; return; }
        const topRow = Math.floor(this.y / tileH);
        if (isSolid(getTileAt(solidMap, col, topRow))) {
            this.y = (topRow + 1) * tileH;
            this.climbing = false;
            this.onGround = true;
        }
        if (this.iframes > 0) this.iframes--;
        if (input.attack && !this.attacking) { this.attacking = true; this.attackTimer = ATTACK_DURATION; this.didAttack = true; }
        if (this.attacking) { this.attackTimer--; if (this.attackTimer <= 0) this.attacking = false; }
        this.animTimer++;
        if (this.animTimer >= 10) { this.animTimer = 0; this.animFrame = (this.animFrame + 1) % 2; }
    }

    _updateRope(input, solidMap, tileW, tileH, customSolidMap) {
        if (input.jumpPressed) { this.onRope = false; this.vy = JUMP_FORCE; this.hookCooldown = 10; return; }
        this.vy = 0;
        if (input.left) { this.x -= ROPE_SPEED; this.facing = -1; }
        if (input.right) { this.x += ROPE_SPEED; this.facing = 1; }
        const worldW = solidMap[0].length * tileW;
        if (this.x < 0) this.x = 0;
        if (this.x + this.w > worldW) this.x = worldW - this.w;
        const centerX = this.x + this.w / 2;
        const col = Math.floor(centerX / tileW);
        const row = Math.floor(this.ropeY / tileH);
        if (!isRope(getTileAt(solidMap, col, row))) { this.onRope = false; return; }
        this.y = this.ropeY + tileH - this.h;
        if (this.iframes > 0) this.iframes--;
        if (input.attack && !this.attacking) { this.attacking = true; this.attackTimer = ATTACK_DURATION; this.didAttack = true; }
        if (this.attacking) { this.attackTimer--; if (this.attackTimer <= 0) this.attacking = false; }
    }

    takeDamage(amount) {
        if (this.iframes > 0 || this.dead) return false;
        this.health -= amount;
        this.iframes = IFRAME_DURATION;
        this.climbing = false;
        this.onRope = false;
        if (this.health <= 0) { this.health = 0; this.dead = true; }
        return true;
    }

    knockback(fromX) {
        const dir = this.x < fromX ? -1 : 1;
        this.vx = KNOCKBACK_X * dir;
        this.vy = KNOCKBACK_Y;
        this.onGround = false;
    }

    getAttackBox() {
        if (!this.attacking || this.attackTimer < ATTACK_DURATION - 14) return null;
        return { x: this.facing > 0 ? this.x + this.w : this.x - ATTACK_RANGE, y: this.y + 10, w: ATTACK_RANGE, h: this.h - 20 };
    }

    getCenterX() { return this.x + this.w / 2; }
    getCenterY() { return this.y + this.h / 2; }

    _getSwingAngle() {
        const t = 1 - this.attackTimer / ATTACK_DURATION;
        const eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
        return (-Math.PI / 3) + (Math.PI / 2) * eased;
    }

    _renderWeapon(ctx, drawX, drawY, sz) {
        const angle = this._getSwingAngle();
        const offX = this.facing > 0 ? sz * 0.6 : -sz * 0.8;
        const offY = -sz * 0.15;
        const swordSz = sz * 0.9;

        ctx.save();
        ctx.translate(drawX + offX + swordSz / 2, drawY + offY + swordSz / 2);
        if (this.facing < 0) {
            ctx.scale(-1, 1);
        }
        ctx.rotate(angle);
        drawExtra(ctx, 'sword', -swordSz / 2, -swordSz / 2, swordSz, false);
        ctx.restore();
    }

    render(ctx, camX, camY, drawCharFn) {
        if (this.dead) return;
        if (this.iframes > 0 && Math.floor(this.iframes / 3) % 2 === 0) return;
        const drawX = this.x - camX - (RENDER_CHAR - this.w) / 2;
        const drawY = this.y - camY - (RENDER_CHAR - this.h);
        const sz = RENDER_CHAR + 1;
        const flip = this.facing < 0;
        const isAttacking = this.attacking;

        const charId = this.characterId || 'ninja_frog';
        const charData = PA1Assets.getCharacter(charId);

        if (charData && (charData.idle || charData.run)) {
            let sheet, frameW = 32, frameH = 32;
            let frame = 0;

            if (this.climbing || this.onRope) {
                sheet = charData.idle;
                frame = Math.floor(this.animTimer / 10) % PA1Assets.getStripFrameCount(sheet, frameW);
            } else if (!this.onGround) {
                if (this.vy < -3) {
                    sheet = charData.jump;
                    frame = 0;
                } else {
                    sheet = charData.fall;
                    frame = 0;
                }
            } else if (Math.abs(this.vx) > 0.5) {
                sheet = charData.run;
                const total = PA1Assets.getStripFrameCount(sheet, frameW);
                frame = this.animFrame % total;
            } else {
                sheet = charData.idle;
                const total = PA1Assets.getStripFrameCount(sheet, frameW);
                frame = this.idleAnimFrame % total;
            }

            if (sheet) {
                PA1Assets.drawStripFrame(ctx, sheet, frame, frameW, frameH, drawX, drawY, sz, sz, flip);
            }

            if (isAttacking) {
                this._renderWeapon(ctx, drawX, drawY, sz);
            }
        } else if (hasExtra('knight_idle')) {
            let key = 'knight_idle';
            if (this.climbing) key = 'knight_idle';
            else if (this.onRope) key = 'knight_idle';
            else if (!this.onGround) key = this.vy < 0 ? 'knight_run' : 'knight_idle';
            else if (Math.abs(this.vx) > 0.5) key = this.animFrame % 2 === 0 ? 'knight_run' : 'knight_idle';
            drawExtra(ctx, key, drawX, drawY, sz, flip);
            if (isAttacking) {
                this._renderWeapon(ctx, drawX, drawY, sz);
            }
        } else {
            let charId2;
            if (this.climbing) charId2 = CHAR_IDS.jump;
            else if (this.onRope) charId2 = CHAR_IDS.idle;
            else if (!this.onGround) charId2 = this.vy < 0 ? CHAR_IDS.jump : CHAR_IDS.fall;
            else if (Math.abs(this.vx) > 0.5) charId2 = this.runFrames[this.animFrame];
            else charId2 = CHAR_IDS.idle;
            drawCharFn(ctx, charId2, drawX, drawY, flip);
            if (isAttacking) {
                this._renderWeapon(ctx, drawX, drawY, sz);
            }
        }
    }
}
