import { drawTile, drawExtra, hasExtra, RENDER_TILE } from './renderer.js';
import * as PA1Assets from './pa1-assets.js';
import * as PA1Sprites from './pa1-sprites.js';

let menuBgCache = null;
let menuBgCacheKey = null;

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
        const cx = W / 2;
        const RT = RENDER_TILE;

        // Draw the visual background level map
        this._drawMenuLevelBg(W, H, RT);

        // Dark transparent overlay for the whole screen
        ctx.save();
        ctx.fillStyle = 'rgba(0,0,0,0.2)';
        ctx.fillRect(0, 0, W, H);
        ctx.restore();

        const footerH = 60;

        // Draw 3D logo "PIXELY BLOCK"
        this._draw3DText('PIXELY', cx, 46, 32);
        this._draw3DText('BLOCK', cx, 86, 32);

        // Subtitles with shadows
        ctx.save();
        ctx.font = '9px "Press Start 2P"';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        ctx.fillStyle = '#000000';
        ctx.fillText("A Knight's Journey to Save the Queen", cx + 1, 126);
        ctx.fillStyle = '#ffffff';
        ctx.fillText("A Knight's Journey to Save the Queen", cx, 125);
        
        ctx.fillStyle = '#000000';
        ctx.fillText('Defeat the bosses every 5 levels!', cx + 1, 142);
        ctx.fillStyle = '#e2ecf7';
        ctx.fillText('Defeat the bosses every 5 levels!', cx, 141);
        ctx.restore();

        // Spacings and positions
        const contentTop = 160;
        const leftW = 220;
        const rightW = 320;
        const gap = 30;
        const totalW = leftW + gap + rightW;
        const leftX = cx - totalW / 2;
        const rightX = leftX + leftW + gap;

        // Draw center-left grassy platform mound and the active character
        this._drawMenuCharPanel(leftX, contentTop, leftW);

        // Draw wooden menu board
        const boardX = rightX;
        const boardY = contentTop + 16;
        const boardW = rightW;
        const boardH = 224;

        ctx.save();
        // Left post shadow
        ctx.fillStyle = 'rgba(0,0,0,0.3)';
        ctx.fillRect(boardX + 4, boardY - 6 + 4, 14, 230);
        // Right post shadow
        ctx.fillRect(boardX + boardW - 14 + 4, boardY - 6 + 4, 14, 230);
        
        // Left post fill
        ctx.fillStyle = '#5d3a1a'; // Medium wood brown
        ctx.fillRect(boardX, boardY - 6, 14, 230);
        ctx.strokeStyle = '#2b1b10'; // Dark border
        ctx.lineWidth = 3;
        ctx.strokeRect(boardX, boardY - 6, 14, 230);
        
        // Right post fill
        ctx.fillStyle = '#5d3a1a';
        ctx.fillRect(boardX + boardW - 14, boardY - 6, 14, 230);
        ctx.strokeRect(boardX + boardW - 14, boardY - 6, 14, 230);
        
        // Top log
        ctx.fillStyle = '#6e4424';
        ctx.fillRect(boardX - 8, boardY - 6, boardW + 16, 16);
        ctx.strokeRect(boardX - 8, boardY - 6, boardW + 16, 16);
        
        // Bottom log
        ctx.fillStyle = '#6e4424';
        ctx.fillRect(boardX - 8, boardY + boardH - 24, boardW + 16, 16);
        ctx.strokeRect(boardX - 8, boardY + boardH - 24, boardW + 16, 16);
        
        // Inner board fill
        ctx.fillStyle = '#3a2214'; // Dark wood interior
        ctx.fillRect(boardX + 14, boardY + 10, boardW - 28, boardH - 34);
        ctx.strokeStyle = '#2b1b10';
        ctx.lineWidth = 2;
        ctx.strokeRect(boardX + 14, boardY + 10, boardW - 28, boardH - 34);
        
        // Wooden grain highlights
        ctx.strokeStyle = 'rgba(255,255,255,0.03)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(boardX + 14, boardY + 40); ctx.lineTo(boardX + boardW - 14, boardY + 40);
        ctx.moveTo(boardX + 14, boardY + 80); ctx.lineTo(boardX + boardW - 14, boardY + 80);
        ctx.moveTo(boardX + 14, boardY + 120); ctx.lineTo(boardX + boardW - 14, boardY + 120);
        ctx.moveTo(boardX + 14, boardY + 160); ctx.lineTo(boardX + boardW - 14, boardY + 160);
        ctx.stroke();
        
        // Draw the small wooden sign hanging on the bottom-left of the board
        ctx.fillStyle = '#5d3a1a';
        ctx.fillRect(boardX - 16, boardY + boardH - 50, 32, 16);
        ctx.strokeStyle = '#2b1b10';
        ctx.lineWidth = 2;
        ctx.strokeRect(boardX - 16, boardY + boardH - 50, 32, 16);
        ctx.strokeStyle = '#2b1b10';
        ctx.beginPath();
        ctx.moveTo(boardX, boardY + boardH - 50); ctx.lineTo(boardX, boardY + boardH - 60);
        ctx.stroke();
        
        // Flag on top right of the board
        ctx.strokeStyle = '#8b5a2b';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(boardX + boardW - 24, boardY - 6); ctx.lineTo(boardX + boardW - 24, boardY - 46);
        ctx.stroke();
        
        ctx.fillStyle = '#ff3838';
        ctx.beginPath();
        ctx.moveTo(boardX + boardW - 24, boardY - 46);
        ctx.lineTo(boardX + boardW + 6, boardY - 36);
        ctx.lineTo(boardX + boardW - 24, boardY - 26);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.restore();

        // Draw buttons inside the frame
        this.menuItems = menuItems;
        const btnW = boardW - 48;
        const btnX = boardX + 24;
        const btnH = 30;
        const btnGap = 8;
        const btnStartY = boardY + 20;

        for (let i = 0; i < menuItems.length; i++) {
            const item = menuItems[i];
            const by = btnStartY + i * (btnH + btnGap);
            if (item.type === 'header') {
                this._text(item.label, boardX + boardW / 2, by + btnH / 2, '9px "Press Start 2P"', '#f7d038');
                continue;
            }
            this._menuBtnNew(btnX, by, btnW, btnH, item.label, i === menuSel);
        }

        // Draw the bottom footer panel
        ctx.fillStyle = '#4a301f';
        ctx.fillRect(0, H - footerH, W, footerH);
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(0, H - footerH);
        ctx.lineTo(W, H - footerH);
        ctx.stroke();

        // Draw footer keyboard and controller icons
        this._drawKeyboardIcon(24, H - footerH + 18);
        this._drawGamepadIcon(64, H - footerH + 18);
        this._drawSparkleIcon(W - 40, H - footerH + 28);

        ctx.save();
        ctx.font = '8px "Press Start 2P"';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = '#d7b594';
        ctx.fillText('Up/Down - Select, Enter - Confirm', cx, H - footerH + 22);
        ctx.fillText('WASD/Arrows - Move, Space/J - Jump/Attack', cx, H - footerH + 40);
        ctx.restore();
    }

    _draw3DText(text, cx, cy, size) {
        const ctx = this.ctx;
        ctx.save();
        ctx.font = `bold ${size}px "Press Start 2P"`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        const charW = ctx.measureText('A').width;
        const gap = 6;
        const totalW = text.length * charW + (text.length - 1) * gap;
        let startX = cx - totalW / 2 + charW / 2;

        const LOGO_COLORS = {
            'P': { main: '#ff4757', dark: '#c0392b' },
            'I': { main: '#2979ff', dark: '#0d47a1' },
            'X': { main: '#ffd600', dark: '#ff8f00' },
            'E': { main: '#00e676', dark: '#00c853' },
            'L': { main: '#3d5afe', dark: '#1a237e' },
            'Y': { main: '#00c853', dark: '#007e33' },
            'B': { main: '#ff3d00', dark: '#b33600' },
            'O': { main: '#76ff03', dark: '#52b300' },
            'C': { main: '#00e5ff', dark: '#00a3b3' },
            'K': { main: '#00c853', dark: '#007e33' },
            'A': { main: '#ff9100', dark: '#b36600' },
            'U': { main: '#ffd600', dark: '#ff8f00' },
            'S': { main: '#2979ff', dark: '#0d47a1' },
            'D': { main: '#ff3d00', dark: '#b33600' }
        };
        
        for (let i = 0; i < text.length; i++) {
            const char = text[i];
            const config = LOGO_COLORS[char] || { main: '#ffffff', dark: '#888888' };
            const x = startX + i * (charW + gap);
            const depth = 8;
            
            ctx.strokeStyle = '#000000';
            ctx.lineWidth = 8;
            ctx.lineJoin = 'miter';
            ctx.miterLimit = 2;
            for (let d = depth; d >= 0; d--) {
                ctx.strokeText(char, x, cy + d);
            }
            
            ctx.fillStyle = config.dark;
            for (let d = depth; d > 0; d--) {
                ctx.fillText(char, x, cy + d);
            }
            
            ctx.fillStyle = config.main;
            ctx.fillText(char, x, cy);
        }
        ctx.restore();
    }

    _drawKeyboardIcon(x, y) {
        const ctx = this.ctx;
        ctx.save();
        ctx.fillStyle = '#d7b594';
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2;
        
        ctx.beginPath();
        ctx.roundRect(x, y, 32, 20, 3);
        ctx.fill();
        ctx.stroke();
        
        ctx.fillStyle = '#000000';
        ctx.fillRect(x + 4, y + 4, 3, 2);
        ctx.fillRect(x + 9, y + 4, 3, 2);
        ctx.fillRect(x + 14, y + 4, 3, 2);
        ctx.fillRect(x + 19, y + 4, 3, 2);
        ctx.fillRect(x + 24, y + 4, 4, 2);
        
        ctx.fillRect(x + 4, y + 8, 4, 2);
        ctx.fillRect(x + 10, y + 8, 3, 2);
        ctx.fillRect(x + 15, y + 8, 3, 2);
        ctx.fillRect(x + 20, y + 8, 3, 2);
        ctx.fillRect(x + 25, y + 8, 3, 2);
        
        ctx.fillRect(x + 4, y + 12, 3, 2);
        ctx.fillRect(x + 9, y + 13, 14, 2);
        ctx.fillRect(x + 25, y + 12, 3, 2);
        ctx.restore();
    }

    _drawGamepadIcon(x, y) {
        const ctx = this.ctx;
        ctx.save();
        ctx.fillStyle = '#d7b594';
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2;
        
        ctx.beginPath();
        ctx.roundRect(x, y, 32, 20, 5);
        ctx.fill();
        ctx.stroke();
        
        ctx.fillStyle = '#000000';
        ctx.fillRect(x + 5, y + 9, 6, 2);
        ctx.fillRect(x + 7, y + 7, 2, 6);
        
        ctx.fillStyle = '#ff4757';
        ctx.fillRect(x + 21, y + 9, 2, 2);
        ctx.fillStyle = '#2979ff';
        ctx.fillRect(x + 25, y + 9, 2, 2);
        ctx.restore();
    }

    _drawSparkleIcon(x, y) {
        const ctx = this.ctx;
        ctx.save();
        ctx.fillStyle = '#d7b594';
        ctx.beginPath();
        ctx.moveTo(x, y - 8);
        ctx.lineTo(x + 5, y);
        ctx.lineTo(x, y + 8);
        ctx.lineTo(x - 5, y);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
    }

    _drawMenuLevelBg(W, H, RT) {
        const ctx = this.ctx;
        
        // 1. Sky Gradient
        const skyGrad = ctx.createLinearGradient(0, 0, 0, H);
        skyGrad.addColorStop(0, '#5da1e1');
        skyGrad.addColorStop(1, '#a1caff');
        ctx.fillStyle = skyGrad;
        ctx.fillRect(0, 0, W, H);
        

        // 4. Custom Fluffy Pixel-Art Matrix Clouds
        this._drawPixelCloud(ctx, 160, 90, 1.8);
        this._drawPixelCloud(ctx, 420, 70, 1.2);
        this._drawPixelCloud(ctx, 700, 100, 2.0);

        // 5. Grass top floor row (y = 432)
        ctx.fillStyle = '#4caf50'; // Bright grass green
        ctx.fillRect(0, 432, W, 10);
        ctx.fillStyle = '#509b24'; // Darker grass bottom
        ctx.fillRect(0, 442, W, 6);
        
        // Dirt floor row below (y = 448)
        ctx.fillStyle = '#9b613c'; // soil brown
        ctx.fillRect(0, 448, W, H - 448);

        // Draw outline of grass floor
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(0, 432);
        ctx.lineTo(W, 432);
        ctx.stroke();

        // 6. Corner Block Configurations (Yellow & Brick blocks)
        // Top-Left corner:
        this._drawPixelYellowBlock(ctx, 0, 0, RT);
        this._drawPixelBrick(ctx, RT, 0, RT);
        this._drawPixelBrick(ctx, 0, RT, RT);
        
        // Bottom-Left corner:
        this._drawPixelBrick(ctx, 0, 324, RT);
        this._drawPixelBrick(ctx, 0, 378, RT);
        this._drawPixelYellowBlock(ctx, RT, 378, RT);

        // Top-Right corner:
        this._drawPixelBrick(ctx, W - RT * 2, 0, RT);
        this._drawPixelYellowBlock(ctx, W - RT, 0, RT);
        this._drawPixelBrick(ctx, W - RT, RT, RT);
        
        // Bottom-Right corner:
        this._drawPixelBrick(ctx, W - RT, 324, RT);
        this._drawPixelBrick(ctx, W - RT, 378, RT);
        this._drawPixelBrick(ctx, W - RT * 2, 378, RT);

        // 7. Custom Pixel Flowers on the ground
        this._drawPixelFlower(ctx, 130, 432, '#ff3838'); // Red flower
        this._drawPixelFlower(ctx, 360, 432, '#ffffff'); // White flower
        this._drawPixelFlower(ctx, 770, 432, '#ff3838'); // Red flower

        // 8. Custom Animated Spinning Pixel Coin
        this._drawPixelCoin(ctx, W - 90, 390);
    }


    _drawPixelCloud(ctx, x, y, scale) {
        ctx.save();
        ctx.translate(x, y);
        ctx.scale(scale, scale);
        
        const px = 3.5; 
        const cloudMatrix = [
            [0,0,0,0,1,1,1,1,0,0,0,0,0,0,0],
            [0,0,1,1,1,1,1,1,1,1,0,0,0,0,0],
            [0,1,1,1,1,1,1,1,1,1,1,1,0,0,0],
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
            [2,2,1,1,1,1,1,1,1,1,1,1,1,2,2],
            [0,2,2,2,2,2,2,2,2,2,2,2,2,2,0]
        ];
        
        const R = cloudMatrix.length;
        const C = cloudMatrix[0].length;
        const startX = -(C * px) / 2;
        const startY = -(R * px) / 2;
        
        // Draw black outline
        ctx.fillStyle = '#000000';
        for (let r = 0; r < R; r++) {
            for (let c = 0; c < C; c++) {
                if (cloudMatrix[r][c] > 0) {
                    ctx.fillRect(startX + c * px - 1.5, startY + r * px - 1.5, px + 3, px + 3);
                }
            }
        }
        
        // Fill colors
        for (let r = 0; r < R; r++) {
            for (let c = 0; c < C; c++) {
                const code = cloudMatrix[r][c];
                if (code === 1) {
                    ctx.fillStyle = '#ffffff';
                    ctx.fillRect(startX + c * px, startY + r * px, px, px);
                } else if (code === 2) {
                    ctx.fillStyle = '#b0cbe8'; // shadow
                    ctx.fillRect(startX + c * px, startY + r * px, px, px);
                }
            }
        }
        ctx.restore();
    }

    _drawPixelBrick(ctx, x, y, size) {
        ctx.save();
        ctx.fillStyle = '#b05030'; // Brick red
        ctx.fillRect(x, y, size, size);
        
        ctx.strokeStyle = '#4a2010';
        ctx.lineWidth = 2.5;
        ctx.strokeRect(x, y, size, size);
        
        ctx.beginPath();
        ctx.moveTo(x, y + size / 2); ctx.lineTo(x + size, y + size / 2);
        ctx.moveTo(x + size / 2, y); ctx.lineTo(x + size / 2, y + size / 2);
        ctx.moveTo(x + size / 4, y + size / 2); ctx.lineTo(x + size / 4, y + size);
        ctx.moveTo(x + 3 * size / 4, y + size / 2); ctx.lineTo(x + 3 * size / 4, y + size);
        ctx.stroke();
        
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 3.5;
        ctx.strokeRect(x, y, size, size);
        ctx.restore();
    }

    _drawPixelYellowBlock(ctx, x, y, size) {
        ctx.save();
        ctx.fillStyle = '#ffc048'; // Shiny gold
        ctx.fillRect(x, y, size, size);
        
        ctx.fillStyle = '#e1b12c'; // Shadow edge
        ctx.fillRect(x, y + size - 6, size, 6);
        ctx.fillRect(x + size - 6, y, 6, size);
        
        ctx.fillStyle = '#ffffff'; // Shine
        ctx.fillRect(x + 4, y + 4, 4, 4);
        
        ctx.strokeStyle = '#2b1b10';
        ctx.lineWidth = 2.5;
        ctx.strokeRect(x + 2, y + 2, size - 4, size - 4);
        
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 3.5;
        ctx.strokeRect(x, y, size, size);
        ctx.restore();
    }

    _drawPixelFlower(ctx, x, y, flowerColor) {
        ctx.save();
        ctx.translate(x, y);
        
        const px = 2.5; 
        const flowerMatrix = [
            [0,2,2,0],
            [2,3,3,2],
            [2,3,3,2],
            [0,2,2,0],
            [0,1,0,0],
            [1,1,0,0],
            [0,1,1,0],
            [0,1,0,0],
            [0,1,0,0]
        ];
        
        const R = flowerMatrix.length;
        const C = flowerMatrix[0].length;
        const startX = -(C * px) / 2;
        const startY = -R * px;
        
        // Outline
        ctx.fillStyle = '#000000';
        for (let r = 0; r < R; r++) {
            for (let c = 0; c < C; c++) {
                if (flowerMatrix[r][c] > 0) {
                    ctx.fillRect(startX + c * px - 1, startY + r * px - 1, px + 2, px + 2);
                }
            }
        }
        
        // Fills
        for (let r = 0; r < R; r++) {
            for (let c = 0; c < C; c++) {
                const code = flowerMatrix[r][c];
                if (code === 1) {
                    ctx.fillStyle = '#2ecc71'; // Green stem
                    ctx.fillRect(startX + c * px, startY + r * px, px, px);
                } else if (code === 2) {
                    ctx.fillStyle = flowerColor; // Petals
                    ctx.fillRect(startX + c * px, startY + r * px, px, px);
                } else if (code === 3) {
                    ctx.fillStyle = '#ffd32a'; // Center
                    ctx.fillRect(startX + c * px, startY + r * px, px, px);
                }
            }
        }
        ctx.restore();
    }

    _drawPixelCoin(ctx, x, y) {
        ctx.save();
        ctx.translate(x, y);
        
        const scaleX = Math.abs(Math.sin(Date.now() / 180));
        ctx.scale(scaleX, 1);
        
        const px = 3;
        const coinMatrix = [
            [0,0,1,1,1,0,0],
            [0,1,1,2,1,1,0],
            [1,1,2,2,2,1,1],
            [1,2,2,2,2,2,1],
            [1,1,2,2,2,1,1],
            [0,1,1,2,1,1,0],
            [0,0,1,1,1,0,0]
        ];
        
        const R = coinMatrix.length;
        const C = coinMatrix[0].length;
        const startX = -(C * px) / 2;
        const startY = -(R * px) / 2;
        
        // Outline
        ctx.fillStyle = '#000000';
        for (let r = 0; r < R; r++) {
            for (let c = 0; c < C; c++) {
                if (coinMatrix[r][c] > 0) {
                    ctx.fillRect(startX + c * px - 1, startY + r * px - 1, px + 2, px + 2);
                }
            }
        }
        
        // Fill
        for (let r = 0; r < R; r++) {
            for (let c = 0; c < C; c++) {
                const code = coinMatrix[r][c];
                if (code === 1) {
                    ctx.fillStyle = '#ffd32a'; // Bright gold
                    ctx.fillRect(startX + c * px, startY + r * px, px, px);
                } else if (code === 2) {
                    ctx.fillStyle = '#e1b12c'; // Dark gold
                    ctx.fillRect(startX + c * px, startY + r * px, px, px);
                }
            }
        }
        ctx.restore();
    }

    _drawMenuCharPanel(x, y, w) {
        const ctx = this.ctx;
        const RT = RENDER_TILE;

        // Draw custom blocky pine trees behind the mound pedestal
        this._drawPixelPineTree(ctx, 172, 324, 52);
        this._drawPixelPineTree(ctx, 298, 324, 64);
        
        // Custom wood/grass platform pedestal mound
        ctx.save();
        
        // Grassy tops of pedestal blocks
        ctx.fillStyle = '#4caf50'; // Bright grass green
        ctx.fillRect(162, 324, 162, 10);
        ctx.fillStyle = '#509b24'; // Darker green
        ctx.fillRect(162, 334, 162, 6);
        
        // Earth core under
        ctx.fillStyle = '#9b613c'; // Earth brown
        ctx.fillRect(162, 340, 162, 24);
        ctx.fillStyle = '#6d4424'; // Darker core
        ctx.fillRect(172, 348, 142, 16);
        
        // Raised center pedestal block
        ctx.fillStyle = '#4caf50';
        ctx.fillRect(210, 270, 66, 10);
        ctx.fillStyle = '#509b24';
        ctx.fillRect(210, 280, 66, 6);
        ctx.fillStyle = '#9b613c';
        ctx.fillRect(210, 286, 66, 38);
        ctx.fillStyle = '#6d4424';
        ctx.fillRect(218, 296, 50, 20);
        
        // Black outlines
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 3.5;
        ctx.strokeRect(162, 324, 162, 40);
        ctx.strokeRect(210, 270, 66, 54);
        
        ctx.restore();

        // Custom pixel Closed Treasure Chest sitting on the right edge block
        this._drawPixelChest(ctx, 293, 324);

        // Draw the selected main character playing idle animations on the top grass block
        const selChar = PA1Assets.getCharacter(localStorage.getItem('pa1_char') || 'ninja_frog');
        if (selChar && selChar.idle && selChar.idle.width > 0) {
            const srcSz = 32;
            const dstSz = 96;
            const charX = 210 + (66 - dstSz) / 2; // centered perfectly on the 66px center pedestal
            const charY = 270 - dstSz + 6;
            ctx.save();
            ctx.imageSmoothingEnabled = false;
            const frameCount = PA1Assets.getStripFrameCount(selChar.idle, srcSz);
            if (frameCount > 0) {
                const frame = Math.floor(Date.now() / 150) % frameCount;
                ctx.drawImage(selChar.idle, frame * srcSz, 0, srcSz, srcSz, charX, charY, dstSz, dstSz);
            }
            ctx.restore();
        }

        // Draw the wooden nameplate label centered underneath the platform
        const labelW = 150;
        const labelH = 32;
        const labelX = 243 - labelW / 2;
        const labelY = 380;

        ctx.save();
        ctx.fillStyle = 'rgba(0,0,0,0.4)';
        ctx.fillRect(labelX + 4, labelY + 4, labelW, labelH);

        ctx.fillStyle = '#3a2214';
        ctx.fillRect(labelX, labelY, labelW, labelH);

        ctx.strokeStyle = '#5d3a1a';
        ctx.lineWidth = 3;
        ctx.strokeRect(labelX, labelY, labelW, labelH);

        const charIds = PA1Assets.getCharacterIds();
        const charNames = PA1Assets.getCharNames();
        const cIdx = charIds.indexOf(localStorage.getItem('pa1_char') || 'ninja_frog');
        const cName = cIdx >= 0 ? charNames[cIdx] : 'Ninja Frog';

        ctx.font = 'bold 9px "Press Start 2P"';
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(cName, 243, labelY + labelH / 2 + 1);
        ctx.restore();
    }

    _drawPixelPineTree(ctx, x, y, height) {
        ctx.save();
        ctx.translate(x, y);
        
        // Draw wood trunk
        ctx.fillStyle = '#5d3a1a';
        ctx.fillRect(-6, -height, 12, height);
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 3;
        ctx.strokeRect(-6, -height, 12, height);
        
        // Layered blocky pine triangles
        const layers = [
            { bottomY: -height * 0.35, w: 42, h: 12 },
            { bottomY: -height * 0.6,  w: 30, h: 12 },
            { bottomY: -height * 0.85, w: 18, h: 12 }
        ];
        
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 3.5;
        
        for (const layer of layers) {
            ctx.strokeRect(-layer.w / 2, layer.bottomY - layer.h, layer.w, layer.h);
        }
        
        ctx.fillStyle = '#2ecc71';
        for (const layer of layers) {
            ctx.fillRect(-layer.w / 2, layer.bottomY - layer.h, layer.w, layer.h);
            ctx.fillStyle = '#27ae60'; // layer bottom shadow
            ctx.fillRect(-layer.w / 2, layer.bottomY - 3, layer.w, 3);
            ctx.fillStyle = '#2ecc71';
        }
        ctx.restore();
    }

    _drawPixelChest(ctx, x, y) {
        ctx.save();
        ctx.translate(x, y);
        
        // Wood chest base
        ctx.fillStyle = '#a0522d';
        ctx.fillRect(-12, -18, 24, 18);
        
        // Gold bands on corners
        ctx.fillStyle = '#ffd700';
        ctx.fillRect(-10, -18, 3, 18);
        ctx.fillRect(7, -18, 3, 18);
        
        // Lid top rim
        ctx.fillStyle = '#8b4513';
        ctx.fillRect(-12, -26, 24, 8);
        ctx.fillStyle = '#ffd700';
        ctx.fillRect(-10, -26, 3, 8);
        ctx.fillRect(7, -26, 3, 8);
        
        // Keyhole lock
        ctx.fillStyle = '#ffd700';
        ctx.fillRect(-3, -13, 6, 6);
        ctx.fillStyle = '#000000';
        ctx.fillRect(-1, -11, 2, 3);
        
        // Black outline
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 3;
        ctx.strokeRect(-12, -26, 24, 26);
        
        ctx.restore();
    }

    _menuBtnNew(x, y, w, h, label, isSel) {
        const ctx = this.ctx;
        ctx.save();

        if (isSel) {
            // Draw glowing yellow outer border shadow
            ctx.shadowColor = 'rgba(255, 200, 50, 0.8)';
            ctx.shadowBlur = 12;
            
            // Outer golden-yellow outline
            ctx.fillStyle = '#ffc048';
            ctx.fillRect(x, y, w, h);
            ctx.shadowBlur = 0; // disable shadow for interior

            // Inner dark-blue gradient fill
            const btnGrad = ctx.createLinearGradient(x, y, x, y + h);
            btnGrad.addColorStop(0, '#4b6584');
            btnGrad.addColorStop(1, '#2d3748');
            ctx.fillStyle = btnGrad;
            ctx.fillRect(x + 3, y + 3, w - 6, h - 6);

            // Inner cyan highlight stroke
            ctx.strokeStyle = '#70a1ff';
            ctx.lineWidth = 1;
            ctx.strokeRect(x + 3, y + 3, w - 6, h - 6);

            // Display sparkles flanked text
            ctx.font = 'bold 9px "Press Start 2P"';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            
            ctx.fillStyle = '#000000';
            ctx.fillText(`+ ${label} +`, x + w / 2 + 1, y + h / 2 + 1);
            ctx.fillStyle = '#ffffff';
            ctx.fillText(`+ ${label} +`, x + w / 2, y + h / 2);

            // Draw floating gems on the sides of the button
            this._drawPixelGem(x - 22, y + h / 2);
            this._drawPixelGem(x + w + 22, y + h / 2);
        } else {
            // Blue-grey vertical gradient body
            const btnGrad = ctx.createLinearGradient(x, y, x, y + h);
            btnGrad.addColorStop(0, '#4b6584');
            btnGrad.addColorStop(1, '#2d3748');
            ctx.fillStyle = btnGrad;
            ctx.fillRect(x, y, w, h);

            // Outer dark-blue border
            ctx.strokeStyle = '#1a202c';
            ctx.lineWidth = 3;
            ctx.strokeRect(x, y, w, h);

            // Light highlight border inside
            ctx.strokeStyle = '#57606f';
            ctx.lineWidth = 1;
            ctx.strokeRect(x + 2, y + 2, w - 4, h - 4);

            ctx.font = '9px "Press Start 2P"';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            
            ctx.fillStyle = '#000000';
            ctx.fillText(label, x + w / 2 + 1, y + h / 2 + 1);
            ctx.fillStyle = '#d1d8e0';
            ctx.fillText(label, x + w / 2, y + h / 2);
        }
        ctx.restore();
    }

    _drawPixelGem(gx, gy) {
        const ctx = this.ctx;
        ctx.save();
        ctx.imageSmoothingEnabled = false;
        const px = 2.5; 
        const colors = [
            [0,0, 1, 0,0],
            [0,2, 2, 3,0],
            [2,2, 4, 3,3],
            [0,2, 2, 3,0],
            [0,0, 1, 0,0]
        ];
        const palette = {
            1: '#ffd32a', // Yellow
            2: '#ff3f34', // Red
            3: '#3c40c6', // Blue
            4: '#0fbcf9'  // Light Blue
        };
        const startX = gx - (5 * px) / 2;
        const startY = gy - (5 * px) / 2;
        for (let r = 0; r < 5; r++) {
            for (let c = 0; c < 5; c++) {
                const colorCode = colors[r][c];
                if (colorCode > 0) {
                    ctx.fillStyle = palette[colorCode];
                    ctx.fillRect(startX + c * px, startY + r * px, px, px);
                }
            }
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
        const ctx = this.ctx;
        const cx = this.w / 2, cy = this.h / 2;
        
        // Dark transparent background overlay
        ctx.save();
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(0, 0, this.w, this.h);
        ctx.restore();

        const boardW = 360;
        const boardH = 260;
        const boardX = cx - boardW / 2;
        const boardY = cy - boardH / 2;

        ctx.save();
        // Left post shadow
        ctx.fillStyle = 'rgba(0,0,0,0.3)';
        ctx.fillRect(boardX + 4, boardY - 6 + 4, 14, boardH + 12);
        // Right post shadow
        ctx.fillRect(boardX + boardW - 14 + 4, boardY - 6 + 4, 14, boardH + 12);
        
        // Left post fill
        ctx.fillStyle = '#5d3a1a'; // Medium wood brown
        ctx.fillRect(boardX, boardY - 6, 14, boardH + 12);
        ctx.strokeStyle = '#2b1b10'; // Dark border
        ctx.lineWidth = 3;
        ctx.strokeRect(boardX, boardY - 6, 14, boardH + 12);
        
        // Right post fill
        ctx.fillStyle = '#5d3a1a';
        ctx.fillRect(boardX + boardW - 14, boardY - 6, 14, boardH + 12);
        ctx.strokeRect(boardX + boardW - 14, boardY - 6, 14, boardH + 12);
        
        // Top log
        ctx.fillStyle = '#6e4424';
        ctx.fillRect(boardX - 8, boardY - 6, boardW + 16, 16);
        ctx.strokeRect(boardX - 8, boardY - 6, boardW + 16, 16);
        
        // Bottom log
        ctx.fillStyle = '#6e4424';
        ctx.fillRect(boardX - 8, boardY + boardH - 24, boardW + 16, 16);
        ctx.strokeRect(boardX - 8, boardY + boardH - 24, boardW + 16, 16);
        
        // Inner board fill
        ctx.fillStyle = '#3a2214'; // Dark wood interior
        ctx.fillRect(boardX + 14, boardY + 10, boardW - 28, boardH - 34);
        ctx.strokeStyle = '#2b1b10';
        ctx.lineWidth = 2;
        ctx.strokeRect(boardX + 14, boardY + 10, boardW - 28, boardH - 34);
        
        // Wooden grain highlights
        ctx.strokeStyle = 'rgba(255,255,255,0.03)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(boardX + 14, boardY + 40); ctx.lineTo(boardX + boardW - 14, boardY + 40);
        ctx.moveTo(boardX + 14, boardY + 80); ctx.lineTo(boardX + boardW - 14, boardY + 80);
        ctx.moveTo(boardX + 14, boardY + 120); ctx.lineTo(boardX + boardW - 14, boardY + 120);
        ctx.moveTo(boardX + 14, boardY + 160); ctx.lineTo(boardX + boardW - 14, boardY + 160);
        ctx.stroke();
        ctx.restore();

        // 3D Logo Title 'PAUSED' above the board
        this._draw3DText('PAUSED', cx, boardY - 26, 26);

        // Level name and score inside the board
        ctx.save();
        ctx.font = '8px "Press Start 2P"';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        ctx.fillStyle = '#000000';
        ctx.fillText(levelName, cx + 1, boardY + 29);
        ctx.fillStyle = '#70a1ff'; // Cyan
        ctx.fillText(levelName, cx, boardY + 28);
        
        ctx.fillStyle = '#000000';
        ctx.fillText(`Score: ${score}`, cx + 1, boardY + 45);
        ctx.fillStyle = '#ffd32a'; // Gold
        ctx.fillText(`Score: ${score}`, cx, boardY + 44);
        ctx.restore();

        // Pause buttons
        const items = ['Resume', 'Exit to Menu'];
        const btnW = boardW - 48;
        const btnX = boardX + 24;
        const btnH = 32;
        const btnGap = 10;
        const btnStartY = boardY + 68;

        for (let i = 0; i < items.length; i++) {
            const by = btnStartY + i * (btnH + btnGap);
            this._menuBtnNew(btnX, by, btnW, btnH, items[i], i === (pauseSel || 0));
        }

        // Subtext reminder inside board
        ctx.save();
        ctx.font = '7px "Press Start 2P"';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        this.menuBlink += 0.04;
        const alpha = 0.4 + 0.4 * Math.sin(this.menuBlink * 4);
        ctx.fillStyle = `rgba(215, 181, 148, ${alpha})`;
        ctx.fillText('Up/Down - Select    Enter - Confirm', cx, boardY + boardH - 45);
        ctx.restore();
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
