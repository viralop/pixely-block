import { RENDER_TILE, RENDER_CHAR, SCALE, CHAR_SIZE, drawExtra, hasExtra } from './renderer.js';
import { moveEntity, isSolid, getTileAt, getTilesInRegion, rectOverlap } from './collision.js';

const GRAVITY = 0.45;
const PROJECTILE_SPEED = 5;
const ATTACK_COOLDOWN = 80;

const BOSS_DEFS = [
    { name: 'Dark Orc', hp: 20, speed: 1.0, chaseSpeed: 2.0, chaseRange: 300, score: 500, sprite: 'boss1', weapon: 'axe', attackType: 'throw', width: 1.0, height: 1.0 },
    { name: 'Shadow Knight', hp: 30, speed: 1.2, chaseSpeed: 2.5, chaseRange: 350, score: 800, sprite: 'boss3', weapon: 'weapon3', attackType: 'charge', width: 1.0, height: 1.0 },
    { name: 'Demon Lord', hp: 50, speed: 1.5, chaseSpeed: 3.0, chaseRange: 400, score: 1500, sprite: 'boss4', weapon: 'weapon5', attackType: 'radial', width: 1.2, height: 1.2 }
];

export class Boss {
    constructor(bossIdx, tileX, tileY, arenaLeft, arenaRight, tileW, tileH) {
        const def = BOSS_DEFS[bossIdx % BOSS_DEFS.length];
        this.name = def.name;
        this.config = def;
        this.weapon = def.weapon || 'axe';
        this.attackType = def.attackType || 'throw';
        this.bossIdx = bossIdx;
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
        this.arenaLeft = arenaLeft * tileW;
        this.arenaRight = arenaRight * tileW;
        this.patrolDir = 1;
        this.hitTimer = 0;
        this.attackCooldown = 60;
        this.animTimer = 0;
        this.phase = 0;
        this.projectiles = [];
        this.charging = false;
        this.chargeTimer = 0;
        this.chargeDir = 0;
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

        if (this.charging) {
            this._updateCharge(solidMap, tileW, tileH, customSolidMap);
        } else {
            if (shouldChase) {
                this.vx = (dx > 0 ? 1 : -1) * this.config.chaseSpeed;
                this.facing = dx > 0 ? 1 : -1;
            } else {
                this.vx = this.config.speed * this.patrolDir;
                this.facing = this.patrolDir;
                if (this.x <= this.arenaLeft) this.patrolDir = 1;
                if (this.x + this.w >= this.arenaRight) this.patrolDir = -1;
            }

            this.vy += GRAVITY;
            if (this.vy > 10) this.vy = 10;
            const grounded = moveEntity(this, this.vx, this.vy, solidMap, tileW, tileH, customSolidMap);
            if (grounded) this.vy = 0;

            if (this.attackCooldown <= 0 && playerAlive) {
                this._doAttack(playerX, playerY);
            }
        }

        this._updateProjectiles();
        this.animTimer++;
    }

    _doAttack(playerX, playerY) {
        switch (this.attackType) {
            case 'throw': this._throwProjectile(playerX, playerY); break;
            case 'charge': this._startCharge(playerX); break;
            case 'radial': this._radialBurst(); break;
        }
        const cd = this.phase === 1 ? ATTACK_COOLDOWN * 0.6 : ATTACK_COOLDOWN;
        this.attackCooldown = this.attackType === 'radial' ? cd * 1.2 : cd;
    }

    _throwProjectile(playerX, playerY) {
        const cx = this.x + this.w / 2;
        const cy = this.y + this.h / 2;
        const dx = playerX - cx;
        const dy = playerY - cy;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist === 0) return;
        const sz = 28;
        this.projectiles.push({
            x: cx - sz / 2, y: cy - sz / 2, w: sz, h: sz,
            vx: (dx / dist) * PROJECTILE_SPEED,
            vy: (dy / dist) * PROJECTILE_SPEED,
            life: 120, rotation: 0, type: 'spin'
        });
    }

    _startCharge(playerX) {
        this.charging = true;
        this.chargeTimer = 40;
        this.chargeDir = (this.x + this.w / 2) < playerX ? 1 : -1;
        this.facing = this.chargeDir;
        this.vx = 0;
    }

    _updateCharge(solidMap, tileW, tileH, customSolidMap) {
        this.chargeTimer--;
        if (this.chargeTimer > 20) {
            this.vx = 0;
            return;
        }
        const speed = this.phase === 1 ? 8 : 6;
        this.vx = this.chargeDir * speed;
        this.vy += GRAVITY;
        if (this.vy > 10) this.vy = 10;
        const grounded = moveEntity(this, this.vx, this.vy, solidMap, tileW, tileH, customSolidMap);
        if (grounded) this.vy = 0;
        if (this.chargeTimer <= 0 || this.x <= this.arenaLeft || this.x + this.w >= this.arenaRight) {
            this.charging = false;
            this.vx = 0;
        }
    }

    _radialBurst() {
        const cx = this.x + this.w / 2;
        const cy = this.y + this.h / 2;
        const count = this.phase === 1 ? 12 : 8;
        for (let i = 0; i < count; i++) {
            const angle = (Math.PI * 2 / count) * i;
            const sz = 22;
            this.projectiles.push({
                x: cx - sz / 2, y: cy - sz / 2, w: sz, h: sz,
                vx: Math.cos(angle) * PROJECTILE_SPEED * 0.8,
                vy: Math.sin(angle) * PROJECTILE_SPEED * 0.8,
                life: 90, rotation: angle, type: 'spin'
            });
        }
    }

    _updateProjectiles() {
        for (let i = this.projectiles.length - 1; i >= 0; i--) {
            const p = this.projectiles[i];
            p.x += p.vx;
            p.y += p.vy;
            p.rotation += 0.2;
            p.life--;
            if (p.life <= 0) { this.projectiles.splice(i, 1); }
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
        if (!this.alive) return false;
        if (this.charging && this.chargeTimer <= 20) return true;
        return false;
    }

    onPlayerHit() {
        this.attackCooldown = 40;
    }

    checkProjectileHit(player) {
        for (let i = this.projectiles.length - 1; i >= 0; i--) {
            if (rectOverlap(player, this.projectiles[i])) {
                this.projectiles.splice(i, 1);
                return true;
            }
        }
        return false;
    }

    render(ctx, camX, camY) {
        if (!this.alive) return;
        if (this.hitTimer > 0 && Math.floor(this.hitTimer / 2) % 2 === 0) return;

        const spriteKey = this.config.sprite;
        const drawX = this.x - camX - (RENDER_CHAR - this.w) / 2;
        const drawY = this.y - camY - (RENDER_CHAR - this.h);

        if (this.charging && this.chargeTimer > 20) {
            ctx.save();
            ctx.globalAlpha = 0.5 + 0.5 * Math.sin(this.animTimer * 0.5);
            if (hasExtra(spriteKey)) drawExtra(ctx, spriteKey, drawX, drawY, RENDER_CHAR + 1, this.facing < 0);
            ctx.restore();
        } else {
            if (hasExtra(spriteKey)) drawExtra(ctx, spriteKey, drawX, drawY, RENDER_CHAR + 1, this.facing < 0);
        }

        if (this.charging && this.chargeTimer <= 20 && hasExtra(this.weapon)) {
            ctx.save();
            const wx = this.x + this.w / 2 - camX;
            const wy = this.y + this.h / 2 - camY;
            ctx.translate(wx, wy);
            ctx.rotate(this.animTimer * 0.3);
            ctx.imageSmoothingEnabled = false;
            drawExtra(ctx, this.weapon, -24, -24, 48, false);
            ctx.restore();
        }

        for (const p of this.projectiles) {
            if (hasExtra(this.weapon)) {
                ctx.save();
                const px = Math.round(p.x - camX + p.w / 2);
                const py = Math.round(p.y - camY + p.h / 2);
                ctx.translate(px, py);
                ctx.rotate(p.rotation);
                ctx.imageSmoothingEnabled = false;
                drawExtra(ctx, this.weapon, -p.w / 2, -p.h / 2, p.w, false);
                ctx.restore();
            }
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
