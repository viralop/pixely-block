import { drawTile } from './renderer.js';

export const INTRO_LINES = [
    'The kingdom has fallen silent.',
    'The Queen has been kidnapped.',
    'A dark force drags her deeper',
    'into the shadows with every step.',
    '',
    'You are the last knight.',
    'Your blade is all that remains.',
    '',
    'Find her. Save her. No matter the cost.'
];

const BOSS_STORY = [
    [
        'The Queen is safe... for now.',
        'But shadows curl around her.',
        'She vanishes into the dark once more.',
        'The journey is far from over.'
    ],
    [
        'Again you reach her side.',
        'Her eyes filled with fear and sorrow.',
        '"Something is controlling this..."',
        'Then she is gone... pulled into the void.'
    ],
    [
        'You fought through hell to find her.',
        'She touches your hand for a moment.',
        '"I can feel it watching us..."',
        'The shadows swallow her again.'
    ],
    [
        'She looks at you with tired eyes.',
        '"You keep coming for me."',
        '"Why won\'t they let me go?"',
        'Before you can answer... she fades away.'
    ],
    [
        'This time she doesn\'t scream.',
        'She just smiles... and points ahead.',
        '"End this. Break the cycle."',
        'The darkness pulls her one final time.'
    ]
];

export class UI {
    constructor(ctx, canvasW, canvasH) {
        this.ctx = ctx;
        this.w = canvasW;
        this.h = canvasH;
        this.font = '12px "Press Start 2P", monospace';
        this.fontLarge = '20px "Press Start 2P", monospace';
        this.fontTitle = '28px "Press Start 2P", monospace';
        this.menuBlink = 0;
        this.menuSel = 0;
        this.menuItems = [];
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

    renderHUD(player, score, levelName, levelNum, totalLevels, boss, hasKey) {
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

        if (boss && boss.alive) {
            this.menuBlink += 0.04;
            const alpha = 0.6 + 0.4 * Math.sin(this.menuBlink * 6);
            ctx.globalAlpha = alpha;
            this._text('BOSS LEVEL', this.w / 2, pad + 14, '12px "Press Start 2P"', '#e74c3c');
            ctx.globalAlpha = 1;
        }

        if (hasKey) {
            drawTile(ctx, 55, pad + maxHearts * 22 + 40, pad + 8);
            this._text('KEY', pad + maxHearts * 22 + 72, pad + 18, '8px "Press Start 2P"', '#ffd700');
        }
    }

    renderMenu(menuSel, menuItems) {
        const ctx = this.ctx;
        ctx.fillStyle = '#0f0f23';
        ctx.fillRect(0, 0, this.w, this.h);

        const cx = this.w / 2;
        this._text('PIXEL QUEST', cx, 40, this.fontTitle, '#ffd700');
        this._text('A Knight\'s Journey to Save the Queen', cx, 75, '8px "Press Start 2P"', '#8be9fd');
        this._text('Defeat the bosses every 5 levels!', cx, 95, '8px "Press Start 2P"', '#666');

        const startY = 130;
        const itemH = 36;

        this.menuItems = menuItems;

        for (let i = 0; i < menuItems.length; i++) {
            const item = menuItems[i];
            const y = startY + i * itemH;
            const isSel = i === menuSel;

            if (item.type === 'header') {
                this._text(item.label, cx, y + 14, '10px "Press Start 2P"', '#8be9fd');
                continue;
            }

            if (isSel) {
                this._box(cx - 200, y, 400, itemH - 4, 'rgba(233,69,96,0.15)', '#e94560');
                this._text('\u25B6', cx - 180, y + 16, '12px "Press Start 2P"', '#e94560');
            }

            let color = isSel ? '#fff' : '#aaa';
            if (item.type === 'editor') color = isSel ? '#fff' : '#6f6';
            if (item.type === 'custom') color = isSel ? '#fff' : '#ffd700';
            this._text(item.label, cx, y + 16, '12px "Press Start 2P"', color);
        }

        const controlsY = this.h - 80;
        this._box(cx - 220, controlsY - 10, 440, 60, 'rgba(0,0,0,0.5)', '#2a2a4a');
        this._text('Up/Down - Select    Enter - Confirm', cx, controlsY + 6, '8px "Press Start 2P"', '#888');
        this._text('WASD/Arrows - Move   Space/J - Jump/Attack', cx, controlsY + 28, '8px "Press Start 2P"', '#666');
    }

    renderPause(score, levelName, pauseSel) {
        const cx = this.w / 2, cy = this.h / 2;
        this._box(cx - 170, cy - 110, 340, 220, 'rgba(0,0,0,0.92)', '#6a6a8a');
        this._text('PAUSED', cx, cy - 75, this.fontLarge, '#fff');
        this._text(`${levelName}`, cx, cy - 40, this.font, '#88ccff');
        this._text(`Score: ${score}`, cx, cy - 15, this.font, '#ffd700');

        const items = ['Resume', 'Exit to Menu'];
        const startY = cy + 15;
        const itemH = 36;
        for (let i = 0; i < items.length; i++) {
            const y = startY + i * itemH;
            const isSel = i === (pauseSel || 0);
            if (isSel) {
                this._box(cx - 140, y, 280, itemH - 4, 'rgba(233,69,96,0.15)', '#e94560');
                this._text('\u25B6', cx - 120, y + 16, '12px "Press Start 2P"', '#e94560');
            }
            this._text(items[i], cx, y + 16, '12px "Press Start 2P"', isSel ? '#fff' : '#aaa');
        }

        this.menuBlink += 0.04;
        const alpha = 0.5 + 0.5 * Math.sin(this.menuBlink * 4);
        this.ctx.globalAlpha = alpha;
        this._text('Up/Down - Select    Enter - Confirm', cx, cy + 95, '8px "Press Start 2P"', '#666');
        this.ctx.globalAlpha = 1;
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
        this._box(cx - 240, cy - 120, 480, 240, 'rgba(0,0,0,0.92)', '#ffd700');
        this._text('THE END', cx, cy - 85, this.fontLarge, '#ffd700');
        this._text('The darkness has been broken.', cx, cy - 45, '10px "Press Start 2P"', '#4caf50');
        this._text('The Queen is free at last.', cx, cy - 20, '10px "Press Start 2P"', '#ccc');
        this._text('The knight sheathes his blade.', cx, cy + 5, '10px "Press Start 2P"', '#ccc');
        this._text('And walks into the dawn.', cx, cy + 30, '10px "Press Start 2P"', '#88ccff');
        this._text(`Final Score: ${score}`, cx, cy + 65, '12px "Press Start 2P"', '#fff');

        this.menuBlink += 0.04;
        const alpha = 0.5 + 0.5 * Math.sin(this.menuBlink * 4);
        this.ctx.globalAlpha = alpha;
        this._text('Press ENTER to Play Again', cx, cy + 100, '10px "Press Start 2P"', '#e94560');
        this.ctx.globalAlpha = 1;
    }

    renderQueenRescued(score, levelName, bossNum) {
        const cx = this.w / 2, cy = this.h / 2;
        this._box(cx - 260, cy - 140, 520, 280, 'rgba(0,0,0,0.92)', '#ffd700');

        this.menuBlink += 0.04;

        this._text('THE QUEEN IS FOUND', cx, cy - 110, '14px "Press Start 2P"', '#ffd700');

        const lines = BOSS_STORY[bossNum % BOSS_STORY.length];
        const startY = cy - 60;
        for (let i = 0; i < lines.length; i++) {
            this._text(lines[i], cx, startY + i * 28, '10px "Press Start 2P"', '#ccc');
        }

        this._text(`Score: ${score}`, cx, cy + 70, '12px "Press Start 2P"', '#fff');

        const alpha = 0.5 + 0.5 * Math.sin(this.menuBlink * 4);
        this.ctx.globalAlpha = alpha;
        this._text('Press ENTER to Continue', cx, cy + 110, '10px "Press Start 2P"', '#fff');
        this.ctx.globalAlpha = 1;
    }

    renderIntro(lineIdx, timer) {
        const ctx = this.ctx;
        const cx = this.w / 2, cy = this.h / 2;
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, this.w, this.h);

        const visibleLines = Math.min(lineIdx, INTRO_LINES.length);

        for (let i = 0; i < INTRO_LINES.length; i++) {
            const line = INTRO_LINES[i];
            if (!line) continue;
            if (i > visibleLines) break;
            let alpha = 1;
            if (i === visibleLines && lineIdx < INTRO_LINES.length) {
                alpha = Math.min(1, (timer % 60) / 30);
            }
            ctx.globalAlpha = alpha;
            this._text(line, cx, cy - 80 + i * 24, '10px "Press Start 2P"', i >= 7 ? '#ffd700' : '#ccc');
            ctx.globalAlpha = 1;
        }

        if (lineIdx >= INTRO_LINES.length) {
            this.menuBlink += 0.04;
            const alpha = 0.5 + 0.5 * Math.sin(this.menuBlink * 4);
            ctx.globalAlpha = alpha;
            this._text('Press ENTER to Begin', cx, cy + 100, '10px "Press Start 2P"', '#e94560');
            ctx.globalAlpha = 1;
        }
    }

    renderLoading() {
        this.ctx.fillStyle = '#0f0f23';
        this.ctx.fillRect(0, 0, this.w, this.h);
        this._text('Loading...', this.w / 2, this.h / 2, this.fontLarge, '#fff');
    }
}
