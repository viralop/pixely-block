import { drawTile, drawExtra, hasExtra, RENDER_TILE } from './renderer.js';
import * as PA1Assets from './pa1-assets.js';
import * as PA1Sprites from './pa1-sprites.js';

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

const C = {
    bg: '#080810',
    panelBg: 'rgba(10,8,20,0.94)',
    border: '#2a1a3a',
    borderLight: '#4a2a6a',
    gold: '#ffc840',
    goldDim: '#a07820',
    red: '#e94560',
    redGlow: 'rgba(233,69,96,0.3)',
    cyan: '#5ee8d0',
    cyanDim: '#2a8a7a',
    text: '#e8e0f0',
    textDim: '#7a6a8a',
    textMuted: '#4a3a5a',
    green: '#4caf50',
    greenGlow: 'rgba(76,175,80,0.25)',
    darkPanel: 'rgba(6,4,14,0.92)',
};

export class UI {
    constructor(ctx, canvasW, canvasH) {
        this.ctx = ctx;
        this.w = canvasW;
        this.h = canvasH;
        this.font = '12px "Press Start 2P", monospace';
        this.fontLarge = '20px "Press Start 2P", monospace';
        this.fontTitle = '32px "MedievalSharp", cursive';
        this.fontSub = '14px "MedievalSharp", cursive';
        this.fontSmall = '8px "Press Start 2P", monospace';
        this.menuBlink = 0;
        this.menuSel = 0;
        this.menuItems = [];
    }

    _text(text, x, y, font, color, align) {
        const ctx = this.ctx;
        ctx.save();
        ctx.font = font || this.font;
        ctx.fillStyle = color || C.text;
        ctx.textAlign = align || 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(text, x, y);
        ctx.restore();
    }

    _glowText(text, x, y, font, color, glowColor, align) {
        const ctx = this.ctx;
        ctx.save();
        ctx.font = font || this.font;
        ctx.textAlign = align || 'center';
        ctx.textBaseline = 'middle';
        ctx.shadowColor = glowColor || color;
        ctx.shadowBlur = 12;
        ctx.fillStyle = color;
        ctx.fillText(text, x, y);
        ctx.shadowBlur = 6;
        ctx.fillText(text, x, y);
        ctx.restore();
    }

    _box(x, y, w, h, bgColor, borderColor) {
        const ctx = this.ctx;
        ctx.save();
        if (bgColor) {
            ctx.fillStyle = bgColor;
            ctx.fillRect(x, y, w, h);
        }
        if (borderColor) {
            ctx.strokeStyle = borderColor;
            ctx.lineWidth = 2;
            ctx.strokeRect(x + 1, y + 1, w - 2, h - 2);
            ctx.strokeStyle = 'rgba(255,255,255,0.04)';
            ctx.lineWidth = 1;
            ctx.strokeRect(x, y, w, h);
        }
        ctx.restore();
    }

    _gradientBg(x, y, w, h, c1, c2, vertical) {
        const ctx = this.ctx;
        const grad = vertical !== false
            ? ctx.createLinearGradient(x, y, x, y + h)
            : ctx.createLinearGradient(x, y, x + w, y);
        grad.addColorStop(0, c1);
        grad.addColorStop(1, c2);
        ctx.fillStyle = grad;
        ctx.fillRect(x, y, w, h);
    }

    _menuBtn(x, y, w, h, label, isSel) {
        const ctx = this.ctx;
        ctx.save();
        if (isSel) {
            ctx.shadowColor = C.redGlow;
            ctx.shadowBlur = 16;
            this._gradientBg(x, y, w, h, 'rgba(233,69,96,0.18)', 'rgba(180,30,60,0.08)');
            ctx.shadowBlur = 0;
            ctx.strokeStyle = C.red;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.roundRect(x + 2, y + 2, w - 4, h - 4, 6);
            ctx.stroke();
            this._glowText('\u25B6', x + 24, y + h / 2, '12px "Press Start 2P"', C.red, C.red);
            this._text(label, x + w / 2 + 8, y + h / 2, '13px "Press Start 2P"', '#fff');
        } else {
            this._gradientBg(x, y, w, h, 'rgba(20,15,35,0.6)', 'rgba(15,10,28,0.4)');
            ctx.strokeStyle = C.border;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.roundRect(x + 2, y + 2, w - 4, h - 4, 6);
            ctx.stroke();
            this._text(label, x + w / 2, y + h / 2, '12px "Press Start 2P"', C.textDim);
        }
        ctx.restore();
    }

    _ornament(cx, y) {
        const ctx = this.ctx;
        ctx.save();
        ctx.strokeStyle = C.goldDim;
        ctx.lineWidth = 1;
        ctx.globalAlpha = 0.4;
        const lineW = 120;
        ctx.beginPath();
        ctx.moveTo(cx - lineW, y);
        ctx.lineTo(cx - 20, y);
        ctx.moveTo(cx + 20, y);
        ctx.lineTo(cx + lineW, y);
        ctx.stroke();
        ctx.globalAlpha = 0.7;
        ctx.fillStyle = C.goldDim;
        ctx.beginPath();
        ctx.moveTo(cx - 8, y - 4);
        ctx.lineTo(cx, y + 4);
        ctx.lineTo(cx + 8, y - 4);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
    }

    renderHUD(player, score, levelName, levelNum, totalLevels, boss, hasKey, currentLives, fruitCount) {
        if (!player) return;
        const ctx = this.ctx;
        const pad = 12;
        const maxHearts = 5;
        const hpPct = Math.max(0, player.health / player.maxHealth);
        const fullHearts = Math.floor(hpPct * maxHearts);
        const hasHalf = (hpPct * maxHearts) - fullHearts >= 0.5;
        const lives = currentLives !== undefined ? currentLives : 3;

        ctx.save();
        ctx.shadowColor = 'rgba(0,0,0,0.8)';
        ctx.shadowBlur = 4;
        for (let i = 0; i < maxHearts; i++) {
            const hx = pad + 8 + i * 22;
            const hy = pad + 8;
            if (i < fullHearts) {
                drawTile(ctx, 72, hx, hy);
            } else if (i === fullHearts && hasHalf) {
                drawTile(ctx, 73, hx, hy);
            } else {
                drawTile(ctx, 74, hx, hy);
            }
        }

        const livesY = pad + 50;
        for (let i = 0; i < lives; i++) {
            if (hasExtra('knight_idle')) drawExtra(ctx, 'knight_idle', pad + 4 + i * 28, livesY, 26);
        }
        ctx.restore();

        const infoX = this.w - pad;
        ctx.save();
        ctx.shadowColor = 'rgba(0,0,0,0.8)';
        ctx.shadowBlur = 4;
        this._text(`SCORE: ${score}`, infoX - 110, pad + 14, this.fontSmall, C.gold);
        this._text(`${levelName}`, infoX - 110, pad + 36, this.fontSmall, C.cyan);
        ctx.restore();

        const levelBadge = PA1Assets.getMenuLevel(levelNum);
        if (levelBadge) {
            ctx.save();
            ctx.imageSmoothingEnabled = false;
            const bx = infoX - 180, by = pad + 48;
            ctx.drawImage(levelBadge, 0, 0, levelBadge.width, levelBadge.height, bx, by, levelBadge.width * 2.5, levelBadge.height * 2.5);
            ctx.restore();
        }

        if (fruitCount !== undefined && fruitCount > 0) {
            const fruitSheet = PA1Assets.getFruit('apple');
            if (fruitSheet) {
                ctx.save();
                ctx.imageSmoothingEnabled = false;
                const fx = pad + maxHearts * 22 + 40;
                const fy = pad + 8;
                ctx.drawImage(fruitSheet, 0, 0, 32, 32, fx, fy, 20, 20);
                ctx.restore();
            }
            ctx.save();
            ctx.shadowColor = 'rgba(0,0,0,0.8)';
            ctx.shadowBlur = 4;
            this._text(`x${fruitCount}`, pad + maxHearts * 22 + 64, pad + 18, this.fontSmall, '#ff6b9d');
            ctx.restore();
        }

        if (boss && boss.alive) {
            this.menuBlink += 0.04;
            const alpha = 0.6 + 0.4 * Math.sin(this.menuBlink * 6);
            ctx.save();
            ctx.globalAlpha = alpha;
            ctx.shadowColor = C.redGlow;
            ctx.shadowBlur = 10;
            this._text('BOSS LEVEL', this.w / 2, pad + 14, '12px "Press Start 2P"', C.red);
            ctx.restore();
        }

        if (hasKey) {
            drawTile(ctx, 55, pad + maxHearts * 22 + 40, pad + 8);
            ctx.save();
            ctx.shadowColor = 'rgba(255,200,64,0.4)';
            ctx.shadowBlur = 6;
            this._text('KEY', pad + maxHearts * 22 + 72, pad + 18, this.fontSmall, C.gold);
            ctx.restore();
        }
    }

    renderMenu(menuSel, menuItems) {
        const ctx = this.ctx;
        const W = this.w, H = this.h;
        const RT = RENDER_TILE;
        const cx = W / 2;

        const skyGrad = ctx.createLinearGradient(0, 0, 0, H);
        skyGrad.addColorStop(0, '#87ceeb');
        skyGrad.addColorStop(0.55, '#5da1e1');
        skyGrad.addColorStop(0.7, '#4a8cc8');
        skyGrad.addColorStop(1, '#3a6a9a');
        ctx.fillStyle = skyGrad;
        ctx.fillRect(0, 0, W, H);

        this._drawMenuClouds();

        const groundTop = H - RT * 3;
        for (let col = 0; col < Math.ceil(W / RT) + 1; col++) {
            drawTile(ctx, 33, col * RT, groundTop);
        }
        for (let row = 1; row < 3; row++) {
            for (let col = 0; col < Math.ceil(W / RT) + 1; col++) {
                drawTile(ctx, 49, col * RT, groundTop + row * RT);
            }
        }

        this._drawMenuDecorations(groundTop);

        const panelY = 80;
        const panelH = groundTop - panelY - 20;
        const leftW = 240;
        const rightW = 360;
        const gap = 30;
        const totalW = leftW + gap + rightW;
        const leftX = cx - totalW / 2;
        const rightX = leftX + leftW + gap;

        this._drawMenuCharacterPanel(leftX, panelY, leftW, panelH, groundTop);

        this._drawMenuBoard(rightX, panelY, rightW, panelH, menuSel, menuItems);

        this._drawMenuTitle(cx);

        const footerY = H - RT - 10;
        ctx.fillStyle = 'rgba(60,40,20,0.85)';
        ctx.fillRect(0, footerY, W, RT + 10);
        ctx.strokeStyle = '#8b6914';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, footerY);
        ctx.lineTo(W, footerY);
        ctx.stroke();
        this._text('Up/Down: Select    Enter: Confirm    Esc: Back', cx, footerY + 16, '8px "Press Start 2P"', '#c8a832');
        this._text('WASD/Arrows: Move    Space/J: Jump/Attack', cx, footerY + 34, '8px "Press Start 2P"', 'rgba(160,130,90,0.6)');
    }

    _drawMenuClouds() {
        const ctx = this.ctx;
        const t = Date.now() / 8000;
        const cloudRows = [
            { y: 30, scale: 0.7, speed: 1, count: 3 },
            { y: 70, scale: 0.5, speed: 0.6, count: 4 },
            { y: 15, scale: 0.4, speed: 1.3, count: 2 }
        ];
        ctx.save();
        for (const row of cloudRows) {
            for (let i = 0; i < row.count; i++) {
                const baseX = ((i / row.count + t * row.speed) % 1.4 - 0.2) * this.w;
                const cw = 120 * row.scale;
                const ch = 40 * row.scale;
                ctx.fillStyle = 'rgba(255,255,255,0.35)';
                ctx.beginPath();
                ctx.ellipse(baseX, row.y, cw / 2, ch / 2, 0, 0, Math.PI * 2);
                ctx.fill();
                ctx.beginPath();
                ctx.ellipse(baseX - cw * 0.3, row.y + ch * 0.1, cw * 0.35, ch * 0.35, 0, 0, Math.PI * 2);
                ctx.fill();
                ctx.beginPath();
                ctx.ellipse(baseX + cw * 0.3, row.y + ch * 0.05, cw * 0.3, ch * 0.3, 0, 0, Math.PI * 2);
                ctx.fill();
            }
        }
        ctx.restore();
    }

    _drawMenuDecorations(groundTop) {
        const ctx = this.ctx;
        const RT = RENDER_TILE;
        const positions = [
            { tx: 1, ids: [169, 170, 33] },
            { tx: 3, ids: [169, 49, 33] },
            { tx: 11, ids: [169, 49, 33] },
            { tx: 14, ids: [169, 170, 33] }
        ];
        for (const deco of positions) {
            const x = deco.tx * RT;
            for (let i = 0; i < deco.ids.length; i++) {
                drawTile(ctx, deco.ids[i], x, groundTop - (deco.ids.length - i) * RT);
            }
        }

        drawTile(ctx, 179, 2.5 * RT, groundTop - RT);
        drawTile(ctx, 180, 13 * RT, groundTop - RT);
    }

    _drawMenuCharacterPanel(x, y, w, h, groundTop) {
        const ctx = this.ctx;
        const RT = RENDER_TILE;

        ctx.save();
        ctx.fillStyle = 'rgba(60,40,20,0.75)';
        ctx.beginPath();
        ctx.roundRect(x, y, w, h, 8);
        ctx.fill();
        ctx.strokeStyle = '#8b6914';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.roundRect(x + 3, y + 3, w - 6, h - 6, 6);
        ctx.stroke();
        ctx.restore();

        const pedestalY = y + h - RT * 3;
        const pedCx = x + w / 2;
        drawTile(ctx, 33, pedCx - RT, pedestalY);
        drawTile(ctx, 33, pedCx, pedestalY);
        drawTile(ctx, 49, pedCx - RT, pedestalY + RT);
        drawTile(ctx, 49, pedCx, pedestalY + RT);

        const selChar = PA1Assets.getCharacter(localStorage.getItem('pa1_char') || 'ninja_frog');
        if (selChar && selChar.idle) {
            const srcSz = 32;
            const dstSz = 96;
            const charX = pedCx - dstSz / 2;
            const charY = pedestalY - dstSz + 12;
            ctx.imageSmoothingEnabled = false;
            const frame = Math.floor(Date.now() / 150) % PA1Assets.getStripFrameCount(selChar.idle, srcSz);
            ctx.drawImage(selChar.idle, frame * srcSz, 0, srcSz, srcSz, charX, charY, dstSz, dstSz);
        }

        const charIds = PA1Assets.getCharacterIds();
        const charNames = PA1Assets.getCharNames();
        const cIdx = charIds.indexOf(localStorage.getItem('pa1_char') || 'ninja_frog');
        const cName = cIdx >= 0 ? charNames[cIdx] : 'Ninja Frog';

        const nameY = pedestalY + RT * 2 + 8;
        ctx.save();
        ctx.fillStyle = 'rgba(60,40,20,0.85)';
        const nameW = 160;
        ctx.beginPath();
        ctx.roundRect(pedCx - nameW / 2, nameY, nameW, 28, 4);
        ctx.fill();
        ctx.strokeStyle = '#8b6914';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.roundRect(pedCx - nameW / 2 + 1, nameY + 1, nameW - 2, 26, 3);
        ctx.stroke();
        ctx.restore();
        this._text(cName, pedCx, nameY + 14, '9px "Press Start 2P"', '#f0d860');
    }

    _drawMenuBoard(x, y, w, h, menuSel, menuItems) {
        const ctx = this.ctx;

        ctx.save();
        ctx.fillStyle = 'rgba(90,60,30,0.8)';
        ctx.beginPath();
        ctx.roundRect(x, y, w, h, 6);
        ctx.fill();
        ctx.strokeStyle = '#6b4a1e';
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.roundRect(x + 3, y + 3, w - 6, h - 6, 4);
        ctx.stroke();
        ctx.strokeStyle = '#a07828';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(x + 8, y + 8, w - 16, h - 16, 3);
        ctx.stroke();

        const pegSz = 10;
        ctx.fillStyle = '#8b6914';
        [[x + 6, y + 6], [x + w - 6 - pegSz, y + 6],
         [x + 6, y + h - 6 - pegSz], [x + w - 6 - pegSz, y + h - 6 - pegSz]].forEach(([px, py]) => {
            ctx.fillRect(px, py, pegSz, pegSz);
        });
        ctx.restore();

        const innerX = x + 24;
        const innerW = w - 48;
        const startY = y + 50;
        const itemH = 46;
        const btnW = innerW;

        this.menuItems = menuItems;

        for (let i = 0; i < menuItems.length; i++) {
            const item = menuItems[i];
            const by = startY + i * itemH;
            this._menuBoardBtn(innerX, by, btnW, itemH - 8, item.label, i === menuSel);
        }
    }

    _menuBoardBtn(x, y, w, h, label, isSel) {
        const ctx = this.ctx;
        ctx.save();
        if (isSel) {
            ctx.fillStyle = 'rgba(200,168,50,0.25)';
            ctx.beginPath();
            ctx.roundRect(x, y, w, h, 4);
            ctx.fill();
            ctx.strokeStyle = '#f0d860';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.roundRect(x + 1, y + 1, w - 2, h - 2, 4);
            ctx.stroke();

            ctx.save();
            ctx.shadowColor = 'rgba(255,200,50,0.6)';
            ctx.shadowBlur = 8;
            ctx.fillStyle = '#f0d860';
            ctx.font = '10px "Press Start 2P"';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('\u25C6', x + 22, y + h / 2);
            ctx.fillText('\u25C6', x + w - 22, y + h / 2);
            ctx.restore();

            this._text(label, x + w / 2, y + h / 2, '12px "Press Start 2P"', '#f0e8c0');
        } else {
            ctx.fillStyle = 'rgba(180,140,60,0.12)';
            ctx.beginPath();
            ctx.roundRect(x, y, w, h, 4);
            ctx.fill();
            ctx.strokeStyle = 'rgba(139,105,20,0.4)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.roundRect(x + 1, y + 1, w - 2, h - 2, 4);
            ctx.stroke();
            this._text(label, x + w / 2, y + h / 2, '11px "Press Start 2P"', 'rgba(200,168,130,0.75)');
        }
        ctx.restore();
    }

    _drawMenuTitle(cx) {
        const ctx = this.ctx;
        const ty = 35;

        ctx.save();
        ctx.font = '28px "Press Start 2P"';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        ctx.fillStyle = '#2a1a0a';
        ctx.fillText('PIXELY BLOCK', cx + 3, ty + 3);
        ctx.fillStyle = '#5a3a10';
        ctx.fillText('PIXELY BLOCK', cx + 2, ty + 2);
        ctx.fillStyle = '#a07828';
        ctx.fillText('PIXELY BLOCK', cx + 1, ty + 1);

        ctx.shadowColor = 'rgba(255,220,80,0.5)';
        ctx.shadowBlur = 16;
        ctx.fillStyle = '#f0d860';
        ctx.fillText('PIXELY BLOCK', cx, ty);
        ctx.shadowBlur = 8;
        ctx.fillText('PIXELY BLOCK', cx, ty);
        ctx.restore();

        this._text("A Knight's Journey to Save the Queen", cx, ty + 28, '7px "Press Start 2P"', 'rgba(255,248,220,0.8)');
        this._text('Defeat the bosses every 5 levels!', cx, ty + 43, '7px "Press Start 2P"', 'rgba(255,248,220,0.5)');
    }

    _parchmentBtn(x, y, w, h, label, isSel) {
        const ctx = this.ctx;
        ctx.save();
        if (isSel) {
            ctx.shadowColor = 'rgba(200,168,50,0.4)';
            ctx.shadowBlur = 14;
            ctx.fillStyle = 'rgba(139,105,20,0.35)';
            ctx.beginPath();
            ctx.roundRect(x, y, w, h, 5);
            ctx.fill();
            ctx.shadowBlur = 0;
            ctx.strokeStyle = '#c8a832';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.roundRect(x + 1, y + 1, w - 2, h - 2, 5);
            ctx.stroke();
            ctx.fillStyle = '#f0d860';
            ctx.font = '10px "Press Start 2P"';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('\u2724', x + 18, y + h / 2);
            this._text(label, x + w / 2 + 6, y + h / 2, '13px "Press Start 2P"', '#f0e0a0');
        } else {
            ctx.fillStyle = 'rgba(50,35,20,0.4)';
            ctx.beginPath();
            ctx.roundRect(x, y, w, h, 5);
            ctx.fill();
            ctx.strokeStyle = '#5a3a10';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.roundRect(x + 1, y + 1, w - 2, h - 2, 5);
            ctx.stroke();
            this._text(label, x + w / 2, y + h / 2, '12px "Press Start 2P"', 'rgba(180,150,110,0.8)');
        }
        ctx.restore();
    }

    renderOptions(optSel, masterVol, sfxVol, musicVol) {
        const ctx = this.ctx;
        this._gradientBg(0, 0, this.w, this.h, '#080810', '#0e0818', true);

        const cx = this.w / 2;
        this._ornament(cx, 35);
        this._glowText('OPTIONS', cx, 55, this.fontTitle, C.gold, 'rgba(255,180,0,0.5)');

        const startY = 105;
        const itemH = 42;
        const btnW = 320;
        const btnX = cx - btnW / 2;
        const items = ['Controls', 'Sound Settings', 'Back'];

        for (let i = 0; i < items.length; i++) {
            const y = startY + i * itemH;
            this._menuBtn(btnX, y, btnW, itemH - 2, items[i], i === optSel);
        }

        if (optSel === 0) {
            const cy = startY + items.length * itemH + 25;
            ctx.save();
            ctx.shadowColor = 'rgba(0,0,0,0.5)';
            ctx.shadowBlur = 10;
            this._gradientBg(cx - 245, cy - 12, 490, 160, C.darkPanel, 'rgba(14,8,24,0.85)');
            ctx.shadowBlur = 0;
            ctx.strokeStyle = C.cyanDim;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.roundRect(cx - 244, cy - 11, 488, 158, 6);
            ctx.stroke();
            ctx.restore();
            this._glowText('CONTROLS', cx, cy + 10, this.fontSub, C.cyan, 'rgba(94,232,208,0.3)');
            this._text('WASD / Arrow Keys  -  Move', cx, cy + 38, this.fontSmall, C.text);
            this._text('Space / J           -  Jump', cx, cy + 58, this.fontSmall, C.text);
            this._text('J / Z               -  Attack', cx, cy + 78, this.fontSmall, C.text);
            this._text('Escape              -  Pause', cx, cy + 98, this.fontSmall, C.text);
            this._text('Up / W              -  Climb Ladders', cx, cy + 118, this.fontSmall, C.text);
        }

        if (optSel === 1) {
            const cy = startY + items.length * itemH + 25;
            ctx.save();
            ctx.shadowColor = 'rgba(0,0,0,0.5)';
            ctx.shadowBlur = 10;
            this._gradientBg(cx - 245, cy - 12, 490, 140, C.darkPanel, 'rgba(14,8,24,0.85)');
            ctx.shadowBlur = 0;
            ctx.strokeStyle = C.cyanDim;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.roundRect(cx - 244, cy - 11, 488, 138, 6);
            ctx.stroke();
            ctx.restore();
            this._glowText('SOUND SETTINGS', cx, cy + 10, this.fontSub, C.cyan, 'rgba(94,232,208,0.3)');
            const bars = [
                { label: 'Master', val: masterVol },
                { label: 'SFX', val: sfxVol },
                { label: 'Music', val: musicVol }
            ];
            bars.forEach((b, i) => {
                const by = cy + 42 + i * 28;
                this._text(b.label, cx - 100, by + 8, this.fontSmall, C.text);
                ctx.save();
                ctx.strokeStyle = C.border;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.roundRect(cx - 1, by - 1, 162, 14, 4);
                ctx.stroke();
                ctx.restore();
                this._gradientBg(cx, by, 160, 12, 'rgba(20,15,30,0.8)', 'rgba(10,8,20,0.8)');
                if (b.val > 0) {
                    ctx.save();
                    ctx.shadowColor = C.greenGlow;
                    ctx.shadowBlur = 6;
                    this._gradientBg(cx + 1, by + 1, (160 - 2) * b.val, 10, '#4caf50', '#2d8a3e');
                    ctx.restore();
                }
            });
        }

        this._text('Escape - Back', cx, this.h - 25, this.fontSmall, C.textMuted);
    }

    renderPause(score, levelName, pauseSel) {
        const cx = this.w / 2, cy = this.h / 2;
        const pw = 360, ph = 240;
        const px = cx - pw / 2, py = cy - ph / 2;

        this.ctx.save();
        this.ctx.fillStyle = 'rgba(4,2,10,0.75)';
        this.ctx.fillRect(0, 0, this.w, this.h);
        this.ctx.shadowColor = 'rgba(100,50,200,0.2)';
        this.ctx.shadowBlur = 30;
        this._gradientBg(px, py, pw, ph, C.panelBg, 'rgba(14,8,28,0.95)');
        this.ctx.shadowBlur = 0;
        this.ctx.strokeStyle = C.borderLight;
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.roundRect(px + 2, py + 2, pw - 4, ph - 4, 8);
        this.ctx.stroke();
        this.ctx.restore();

        this._ornament(cx, py + 30);
        this._glowText('PAUSED', cx, py + 50, this.fontTitle, '#fff', 'rgba(200,180,255,0.4)');
        this._text(levelName, cx, py + 80, this.fontSmall, C.cyan);
        this._text(`Score: ${score}`, cx, py + 100, this.fontSmall, C.gold);

        const items = ['Resume', 'Exit to Menu'];
        const startY = py + 120;
        const itemH = 42;
        const btnW = 260;
        for (let i = 0; i < items.length; i++) {
            this._menuBtn(cx - btnW / 2, startY + i * itemH, btnW, itemH - 2, items[i], i === (pauseSel || 0));
        }

        this.menuBlink += 0.04;
        const alpha = 0.4 + 0.4 * Math.sin(this.menuBlink * 4);
        this.ctx.globalAlpha = alpha;
        this._text('Up/Down - Select    Enter - Confirm', cx, py + ph - 20, this.fontSmall, C.textMuted);
        this.ctx.globalAlpha = 1;
    }

    renderLevelComplete(levelName, score, bonus) {
        const cx = this.w / 2, cy = this.h / 2;
        const pw = 420, ph = 220;
        const px = cx - pw / 2, py = cy - ph / 2;

        this.ctx.save();
        this.ctx.fillStyle = 'rgba(4,2,10,0.7)';
        this.ctx.fillRect(0, 0, this.w, this.h);
        this.ctx.shadowColor = C.greenGlow;
        this.ctx.shadowBlur = 30;
        this._gradientBg(px, py, pw, ph, C.panelBg, 'rgba(8,20,12,0.95)');
        this.ctx.shadowBlur = 0;
        this.ctx.strokeStyle = C.green;
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.roundRect(px + 2, py + 2, pw - 4, ph - 4, 8);
        this.ctx.stroke();
        this.ctx.restore();

        this._glowText('LEVEL COMPLETE!', cx, py + 40, this.fontLarge, C.green, 'rgba(76,175,80,0.5)');
        this._ornament(cx, py + 60);
        this._text(levelName, cx, py + 82, this.fontSmall, C.cyan);
        this._text(`Score: ${score}`, cx, py + 105, this.fontSmall, C.gold);
        this._text(`Level Bonus: +${bonus}`, cx, py + 130, this.fontSmall, '#6fdb6f');

        this.menuBlink += 0.04;
        const alpha = 0.4 + 0.4 * Math.sin(this.menuBlink * 4);
        this.ctx.globalAlpha = alpha;
        this._text('Press ENTER to Continue', cx, py + ph - 30, this.fontSmall, '#fff');
        this.ctx.globalAlpha = 1;
    }

    renderGameOver(score, levelName, levelNum, currentLives) {
        const cx = this.w / 2, cy = this.h / 2;
        const pw = 420, ph = 240;
        const px = cx - pw / 2, py = cy - ph / 2;

        this.ctx.save();
        this.ctx.fillStyle = 'rgba(4,2,10,0.7)';
        this.ctx.fillRect(0, 0, this.w, this.h);
        this.ctx.shadowColor = C.redGlow;
        this.ctx.shadowBlur = 30;
        this._gradientBg(px, py, pw, ph, C.panelBg, 'rgba(20,6,10,0.95)');
        this.ctx.shadowBlur = 0;
        this.ctx.strokeStyle = C.red;
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.roundRect(px + 2, py + 2, pw - 4, ph - 4, 8);
        this.ctx.stroke();
        this.ctx.restore();

        this._glowText('GAME OVER', cx, py + 40, this.fontLarge, C.red, 'rgba(233,69,96,0.5)');
        this._ornament(cx, py + 60);
        this._text(levelName, cx, py + 82, this.fontSmall, C.cyan);
        this._text(`Final Score: ${score}`, cx, py + 108, this.fontSmall, C.gold);
        this._text(`Level Reached: ${levelNum + 1}`, cx, py + 135, this.fontSmall, C.text);

        this.menuBlink += 0.04;
        const alpha = 0.4 + 0.4 * Math.sin(this.menuBlink * 4);
        this.ctx.globalAlpha = alpha;
        this._text('Press ENTER to Restart', cx, py + ph - 30, this.fontSmall, '#fff');
        this.ctx.globalAlpha = 1;
    }

    renderVictory(score) {
        const cx = this.w / 2, cy = this.h / 2;
        const pw = 480, ph = 270;
        const px = cx - pw / 2, py = cy - ph / 2;

        this.ctx.save();
        this.ctx.fillStyle = 'rgba(4,2,10,0.7)';
        this.ctx.fillRect(0, 0, this.w, this.h);
        this.ctx.shadowColor = 'rgba(255,180,0,0.3)';
        this.ctx.shadowBlur = 40;
        this._gradientBg(px, py, pw, ph, C.panelBg, 'rgba(20,14,6,0.95)');
        this.ctx.shadowBlur = 0;
        this.ctx.strokeStyle = C.gold;
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.roundRect(px + 2, py + 2, pw - 4, ph - 4, 8);
        this.ctx.stroke();
        this.ctx.restore();

        this._ornament(cx, py + 25);
        this._glowText('THE END', cx, py + 48, this.fontTitle, C.gold, 'rgba(255,180,0,0.5)');
        this._ornament(cx, py + 70);

        this._text('The darkness has been broken.', cx, py + 95, this.fontSmall, C.green);
        this._text('The Queen is free at last.', cx, py + 118, this.fontSmall, C.text);
        this._text('The knight sheathes his blade.', cx, py + 141, this.fontSmall, C.text);
        this._text('And walks into the dawn.', cx, py + 164, this.fontSmall, C.cyan);
        this._text(`Final Score: ${score}`, cx, py + 198, this.font, '#fff');

        this.menuBlink += 0.04;
        const alpha = 0.4 + 0.4 * Math.sin(this.menuBlink * 4);
        this.ctx.globalAlpha = alpha;
        this._text('Press ENTER to Play Again', cx, py + ph - 30, this.fontSmall, C.red);
        this.ctx.globalAlpha = 1;
    }

    renderQueenRescued(score, levelName, bossNum) {
        const cx = this.w / 2, cy = this.h / 2;
        const pw = 520, ph = 300;
        const px = cx - pw / 2, py = cy - ph / 2;

        this.ctx.save();
        this.ctx.fillStyle = 'rgba(4,2,10,0.7)';
        this.ctx.fillRect(0, 0, this.w, this.h);
        this.ctx.shadowColor = 'rgba(255,180,0,0.3)';
        this.ctx.shadowBlur = 40;
        this._gradientBg(px, py, pw, ph, C.panelBg, 'rgba(20,14,6,0.95)');
        this.ctx.shadowBlur = 0;
        this.ctx.strokeStyle = C.gold;
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.roundRect(px + 2, py + 2, pw - 4, ph - 4, 8);
        this.ctx.stroke();
        this.ctx.restore();

        this.menuBlink += 0.04;

        this._ornament(cx, py + 25);
        this._glowText('THE QUEEN IS FOUND', cx, py + 48, '14px "Press Start 2P"', C.gold, 'rgba(255,180,0,0.5)');

        const lines = BOSS_STORY[bossNum % BOSS_STORY.length];
        const startY = py + 85;
        for (let i = 0; i < lines.length; i++) {
            this._text(lines[i], cx, startY + i * 28, this.fontSmall, C.text);
        }

        this._text(`Score: ${score}`, cx, py + ph - 70, this.font, '#fff');

        const alpha = 0.4 + 0.4 * Math.sin(this.menuBlink * 4);
        this.ctx.globalAlpha = alpha;
        this._text('Press ENTER to Continue', cx, py + ph - 30, this.fontSmall, '#fff');
        this.ctx.globalAlpha = 1;
    }

    renderIntro(lineIdx, timer) {
        const ctx = this.ctx;
        const cx = this.w / 2, cy = this.h / 2;
        this._gradientBg(0, 0, this.w, this.h, '#040208', '#0a0414', true);

        const visibleLines = Math.min(lineIdx, INTRO_LINES.length);

        for (let i = 0; i < INTRO_LINES.length; i++) {
            const line = INTRO_LINES[i];
            if (!line) continue;
            if (i > visibleLines) break;
            let alpha = 1;
            if (i === visibleLines && lineIdx < INTRO_LINES.length) {
                alpha = Math.min(1, (timer % 60) / 30);
            }
            ctx.save();
            ctx.globalAlpha = alpha;
            if (i >= 7) {
                this._glowText(line, cx, cy - 80 + i * 24, this.fontSmall, C.gold, 'rgba(255,180,0,0.3)');
            } else {
                this._text(line, cx, cy - 80 + i * 24, this.fontSmall, C.text);
            }
            ctx.restore();
        }

        if (lineIdx >= INTRO_LINES.length) {
            this.menuBlink += 0.04;
            const alpha = 0.4 + 0.4 * Math.sin(this.menuBlink * 4);
            ctx.globalAlpha = alpha;
            this._glowText('Press ENTER to Begin', cx, cy + 100, this.fontSmall, C.red, 'rgba(233,69,96,0.3)');
            ctx.globalAlpha = 1;
        }
    }

    renderLoading() {
        this._gradientBg(0, 0, this.w, this.h, '#080810', '#0e0818', true);
        this._glowText('Loading...', this.w / 2, this.h / 2, this.fontLarge, '#fff', 'rgba(200,180,255,0.3)');
    }

    renderLifePopup(timer) {
        const ctx = this.ctx;
        const cx = this.w / 2;
        const maxTimer = 120;
        const t = 1 - timer / maxTimer;
        let alpha = 1;
        if (t < 0.1) alpha = t / 0.1;
        else if (t > 0.7) alpha = 1 - (t - 0.7) / 0.3;
        const y = this.h * 0.3 - t * 20;

        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.shadowColor = 'rgba(76,175,80,0.6)';
        ctx.shadowBlur = 15;
        this._gradientBg(cx - 80, y - 18, 160, 36, 'rgba(10,30,10,0.9)', 'rgba(20,50,20,0.85)');
        ctx.shadowBlur = 0;
        ctx.strokeStyle = '#4caf50';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(cx - 79, y - 17, 158, 34, 6);
        ctx.stroke();
        if (hasExtra('knight_idle')) drawExtra(ctx, 'knight_idle', cx - 65, y - 10, 22);
        this._text('+1 LIFE!', cx + 10, y + 4, '12px "Press Start 2P"', '#4caf50');
        ctx.restore();
    }

    renderBossIntro(boss, timer) {
        const ctx = this.ctx;
        const cx = this.w / 2, cy = this.h / 2;
        const maxTimer = 120;
        const t = 1 - timer / maxTimer;

        ctx.save();
        ctx.fillStyle = `rgba(4,2,10,${0.6 * Math.min(1, t * 4)})`;
        ctx.fillRect(0, 0, this.w, this.h);

        if (t < 0.1) {
            ctx.globalAlpha = t / 0.1;
        } else if (t > 0.85) {
            ctx.globalAlpha = 1 - (t - 0.85) / 0.15;
        }

        this._ornament(cx, cy - 60);
        ctx.shadowColor = C.redGlow;
        ctx.shadowBlur = 30;
        this._text('BOSS FIGHT', cx, cy - 35, '36px "Press Start 2P"', C.red, 'center');
        ctx.shadowBlur = 0;

        if (boss) {
            this._ornament(cx, cy - 5);
            ctx.shadowColor = 'rgba(255,180,0,0.4)';
            ctx.shadowBlur = 16;
            this._text(boss.name, cx, cy + 22, this.fontTitle, C.gold, 'center');
            ctx.shadowBlur = 0;
            this._ornament(cx, cy + 50);
        }

        ctx.restore();
    }
}
