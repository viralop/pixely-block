import { drawTile } from './renderer.js';

export class UI {
    constructor(ctx, canvasW, canvasH) {
        this.ctx = ctx;
        this.w = canvasW;
        this.h = canvasH;
        this.font = '12px "Press Start 2P", monospace';
        this.fontLarge = '20px "Press Start 2P", monospace';
        this.fontTitle = '28px "Press Start 2P", monospace';
        this.menuBlink = 0;
    }

    _text(text, x, y, font, color, align) {
        this.ctx.save();
        this.ctx.font = font || this.font;
        this.ctx.fillStyle = color || '#fff';
        this.ctx.textAlign = align || 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(text, x, y);
        this.ctx.restore();
    }

    _box(x, y, w, h, bgColor, borderColor) {
        const ctx = this.ctx;
        ctx.fillStyle = bgColor || 'rgba(0,0,0,0.85)';
        ctx.fillRect(x, y, w, h);
        if (borderColor) {
            ctx.strokeStyle = borderColor;
            ctx.lineWidth = 2;
            ctx.strokeRect(x, y, w, h);
        }
    }

    renderHUD(player, score, levelName, levelNum, totalLevels) {
        if (!player) return;
        const ctx = this.ctx;
        const pad = 12;
        const maxHearts = 5;
        const hpPct = Math.max(0, player.health / player.maxHealth);
        const fullHearts = Math.floor(hpPct * maxHearts);
        const hasHalf = (hpPct * maxHearts) - fullHearts >= 0.5;

        this._box(pad, pad, maxHearts * 22 + 20, 36, 'rgba(0,0,0,0.7)', '#4a4a6a');

        for (let i = 0; i < maxHearts; i++) {
            const hx = pad + 10 + i * 22;
            const hy = pad + 8;
            if (i < fullHearts) {
                drawTile(ctx, 72, hx, hy);
            } else if (i === fullHearts && hasHalf) {
                drawTile(ctx, 73, hx, hy);
            } else {
                drawTile(ctx, 74, hx, hy);
            }
        }

        const infoX = this.w - pad;
        this._box(infoX - 220, pad, 220, 50, 'rgba(0,0,0,0.7)', '#4a4a6a');
        this._text(`SCORE: ${score}`, infoX - 110, pad + 14, '8px "Press Start 2P"', '#ffd700', 'center');
        this._text(`${levelName}`, infoX - 110, pad + 36, '8px "Press Start 2P"', '#88ccff', 'center');
    }

    renderMenu() {
        const ctx = this.ctx;
        ctx.fillStyle = '#0f0f23';
        ctx.fillRect(0, 0, this.w, this.h);

        const cx = this.w / 2;
        this._text('PIXEL QUEST', cx, 120, this.fontTitle, '#ffd700');
        this._text('A Platformer Adventure', cx, 165, '10px "Press Start 2P"', '#888');

        const chars = [1, 2, 3, 5];
        ctx.globalAlpha = 0.6;
        chars.forEach((_, i) => {
            ctx.fillStyle = i % 2 === 0 ? '#4caf50' : '#2196f3';
            ctx.fillRect(cx - 140 + i * 80, 210, 50, 50);
        });
        ctx.globalAlpha = 1;

        this._box(cx - 180, 290, 360, 140, 'rgba(0,0,0,0.6)', '#4a4a6a');
        this._text('CONTROLS', cx, 310, '10px "Press Start 2P"', '#aaa');
        this._text('Arrow Keys / WASD - Move', cx, 335, '8px "Press Start 2P"', '#ccc');
        this._text('Space / W / Up - Jump', cx, 355, '8px "Press Start 2P"', '#ccc');
        this._text('J / Z - Attack', cx, 375, '8px "Press Start 2P"', '#ccc');
        this._text('ESC - Pause', cx, 395, '8px "Press Start 2P"', '#ccc');

        this.menuBlink += 0.04;
        const alpha = 0.5 + 0.5 * Math.sin(this.menuBlink * 4);
        ctx.globalAlpha = alpha;
        this._text('Press ENTER to Start', cx, 480, '14px "Press Start 2P"', '#6f6');
        ctx.globalAlpha = 1;
    }

    renderPause(score, levelName) {
        const cx = this.w / 2, cy = this.h / 2;
        this._box(cx - 150, cy - 70, 300, 140, 'rgba(0,0,0,0.9)', '#6a6a8a');
        this._text('PAUSED', cx, cy - 35, this.fontLarge, '#fff');
        this._text(`${levelName}`, cx, cy, this.font, '#88ccff');
        this._text(`Score: ${score}`, cx, cy + 25, this.font, '#ffd700');
        this._text('ESC to Resume', cx, cy + 55, '8px "Press Start 2P"', '#aaa');
    }

    renderLevelComplete(levelName, score, bonus) {
        const cx = this.w / 2, cy = this.h / 2;
        this._box(cx - 200, cy - 100, 400, 200, 'rgba(0,0,0,0.9)', '#4caf50');
        this._text('LEVEL COMPLETE!', cx, cy - 65, this.fontLarge, '#4caf50');
        this._text(levelName, cx, cy - 30, this.font, '#88ccff');
        this._text(`Score: ${score}`, cx, cy + 5, this.font, '#ffd700');
        this._text(`Level Bonus: +${bonus}`, cx, cy + 35, '10px "Press Start 2P"', '#6f6');

        this.menuBlink += 0.04;
        const alpha = 0.5 + 0.5 * Math.sin(this.menuBlink * 4);
        this.ctx.globalAlpha = alpha;
        this._text('Press ENTER to Continue', cx, cy + 75, '10px "Press Start 2P"', '#fff');
        this.ctx.globalAlpha = 1;
    }

    renderGameOver(score, levelName, levelNum) {
        const cx = this.w / 2, cy = this.h / 2;
        this._box(cx - 200, cy - 110, 400, 220, 'rgba(0,0,0,0.9)', '#e74c3c');
        this._text('GAME OVER', cx, cy - 75, this.fontLarge, '#e74c3c');
        this._text(`${levelName}`, cx, cy - 35, this.font, '#88ccff');
        this._text(`Final Score: ${score}`, cx, cy, this.font, '#ffd700');
        this._text(`Level Reached: ${levelNum + 1}`, cx, cy + 30, '10px "Press Start 2P"', '#ccc');

        this.menuBlink += 0.04;
        const alpha = 0.5 + 0.5 * Math.sin(this.menuBlink * 4);
        this.ctx.globalAlpha = alpha;
        this._text('Press ENTER to Restart', cx, cy + 80, '10px "Press Start 2P"', '#fff');
        this.ctx.globalAlpha = 1;
    }

    renderVictory(score) {
        const cx = this.w / 2, cy = this.h / 2;
        this._box(cx - 220, cy - 100, 440, 200, 'rgba(0,0,0,0.9)', '#ffd700');
        this._text('CONGRATULATIONS!', cx, cy - 65, this.fontLarge, '#ffd700');
        this._text('You completed all levels!', cx, cy - 25, this.font, '#4caf50');
        this._text(`Final Score: ${score}`, cx, cy + 15, '14px "Press Start 2P"', '#fff');

        this.menuBlink += 0.04;
        const alpha = 0.5 + 0.5 * Math.sin(this.menuBlink * 4);
        this.ctx.globalAlpha = alpha;
        this._text('Press ENTER to Play Again', cx, cy + 65, '10px "Press Start 2P"', '#fff');
        this.ctx.globalAlpha = 1;
    }

    renderLoading() {
        this.ctx.fillStyle = '#0f0f23';
        this.ctx.fillRect(0, 0, this.w, this.h);
        this._text('Loading...', this.w / 2, this.h / 2, this.fontLarge, '#fff');
    }
}
