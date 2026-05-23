import * as PA1 from './pa1-assets.js';
import { SCALE, RENDER_TILE } from './renderer.js';

const TERRAIN_SRC = 16;
const TERRAIN_COLS = 22;
const TERRAIN_ROWS = 11;
const TERRAIN_RENDER = TERRAIN_SRC * SCALE;

const FRUIT_SRC = 32;
const FRUIT_RENDER = FRUIT_SRC * SCALE;
const FRUIT_ANIM_SPEED = 8;

const BOX_SRC_W = 28;
const BOX_SRC_H = 24;
const BOX_RENDER_W = BOX_SRC_W * SCALE;
const BOX_RENDER_H = BOX_SRC_H * SCALE;

const CP_SRC = 64;
const CP_RENDER = CP_SRC * SCALE;

const TRAP_SCALE = SCALE;

let fruitAnimTimer = 0;
let trapAnimTimers = {};

export function updateAnimations() {
    fruitAnimTimer++;
}

export function getFruitFrame() {
    return Math.floor(fruitAnimTimer / FRUIT_ANIM_SPEED) % 17;
}

export function getTrapAnimFrame(key, speed) {
    if (!trapAnimTimers[key]) trapAnimTimers[key] = 0;
    trapAnimTimers[key]++;
    return Math.floor(trapAnimTimers[key] / (speed || 8));
}

export function resetTrapAnims() {
    trapAnimTimers = {};
}

export function drawTerrainTile(ctx, tileCol, tileRow, screenX, screenY) {
    PA1.drawGridTile(ctx, PA1.getTerrainSheet(), tileCol, tileRow, TERRAIN_SRC, TERRAIN_SRC, screenX, screenY, TERRAIN_RENDER, TERRAIN_RENDER);
}

export function drawFruit(ctx, fruitName, screenX, screenY) {
    const sheet = PA1.getFruit(fruitName);
    if (!sheet) return;
    const frame = getFruitFrame();
    PA1.drawStripFrame(ctx, sheet, frame, FRUIT_SRC, FRUIT_SRC, screenX, screenY, FRUIT_RENDER, FRUIT_RENDER, false);
}

export function drawFruitCollected(ctx, screenX, screenY, frame) {
    const sheet = PA1.getFruitCollected();
    if (!sheet) return;
    frame = Math.min(frame, 5);
    PA1.drawStripFrame(ctx, sheet, frame, FRUIT_SRC, FRUIT_SRC, screenX, screenY, FRUIT_RENDER, FRUIT_RENDER, false);
}

export function drawBox(ctx, boxId, state, screenX, screenY, frame) {
    const box = PA1.getBox(boxId);
    if (!box) return;
    let sheet, fw, fh;
    if (state === 'hit' && box.hit) {
        sheet = box.hit;
        fw = BOX_SRC_W;
        fh = BOX_SRC_H;
    } else if (state === 'break' && box.breakAnim) {
        sheet = box.breakAnim;
        fw = BOX_SRC_W;
        fh = BOX_SRC_H;
    } else {
        sheet = box.idle;
        fw = BOX_SRC_W;
        fh = BOX_SRC_H;
    }
    if (!sheet) return;
    const totalFrames = PA1.getStripFrameCount(sheet, fw);
    frame = Math.min(frame || 0, totalFrames - 1);
    PA1.drawStripFrame(ctx, sheet, frame, fw, fh, screenX, screenY, BOX_RENDER_W, BOX_RENDER_H, false);
}

export function drawCheckpoint(ctx, type, active, screenX, screenY, animFrame) {
    const cp = PA1.getCheckpoint();
    if (!cp) return;
    if (type === 'start') {
        const sheet = active ? cp.startMoving : cp.startIdle;
        if (!sheet) return;
        const fw = CP_SRC;
        const total = PA1.getStripFrameCount(sheet, fw);
        const frame = active ? animFrame % total : 0;
        PA1.drawStripFrame(ctx, sheet, frame, fw, CP_SRC, screenX, screenY, CP_RENDER, CP_RENDER, false);
    } else if (type === 'end') {
        const sheet = active ? cp.endPressed : cp.endIdle;
        if (!sheet) return;
        const fw = CP_SRC;
        const total = PA1.getStripFrameCount(sheet, fw);
        const frame = active ? animFrame % total : 0;
        PA1.drawStripFrame(ctx, sheet, frame, fw, CP_SRC, screenX, screenY, CP_RENDER, CP_RENDER, false);
    } else {
        if (!active) {
            if (cp.noFlag) {
                PA1.drawStripFrame(ctx, cp.noFlag, 0, CP_SRC, CP_SRC, screenX, screenY, CP_RENDER, CP_RENDER, false);
            }
        } else {
            const sheet = cp.flagIdle;
            if (!sheet) return;
            const total = PA1.getStripFrameCount(sheet, CP_SRC);
            const frame = animFrame % total;
            PA1.drawStripFrame(ctx, sheet, frame, CP_SRC, CP_SRC, screenX, screenY, CP_RENDER, CP_RENDER, false);
        }
    }
}

export function drawTrapFire(ctx, screenX, screenY) {
    const sheet = PA1.getTrap('fire_on');
    if (!sheet) return;
    const fw = 16, fh = 32;
    const frame = getTrapAnimFrame('fire', 8) % PA1.getStripFrameCount(sheet, fw);
    PA1.drawStripFrame(ctx, sheet, frame, fw, fh, screenX, screenY, fw * TRAP_SCALE, fh * TRAP_SCALE, false);
}

export function drawTrapSaw(ctx, screenX, screenY) {
    const sheet = PA1.getTrap('saw_on');
    if (!sheet) return;
    const fw = 38, fh = 38;
    const frame = getTrapAnimFrame('saw', 4) % PA1.getStripFrameCount(sheet, fw);
    PA1.drawStripFrame(ctx, sheet, frame, fw, fh, screenX, screenY, fw * TRAP_SCALE, fh * TRAP_SCALE, false);
}

export function drawTrampoline(ctx, screenX, screenY) {
    const sheet = PA1.getTrap('trampoline_idle');
    if (!sheet) return;
    const fw = 28, fh = 28;
    PA1.drawStripFrame(ctx, sheet, 0, fw, fh, screenX, screenY, fw * TRAP_SCALE, fh * TRAP_SCALE, false);
}

export function drawTrapSpikes(ctx, screenX, screenY) {
    const sheet = PA1.getTrap('spikes');
    if (!sheet) return;
    const fw = sheet.width, fh = sheet.height;
    PA1.drawStripFrame(ctx, sheet, getTrapAnimFrame('spikes', 12) % PA1.getStripFrameCount(sheet, fw), fw, fh, screenX, screenY, fw * TRAP_SCALE, fh * TRAP_SCALE, false);
}

export function drawTrapArrow(ctx, screenX, screenY) {
    const sheet = PA1.getTrap('arrow_idle');
    if (!sheet) return;
    const fw = 18, fh = 18;
    PA1.drawStripFrame(ctx, sheet, getTrapAnimFrame('arrow', 12) % PA1.getStripFrameCount(sheet, fw), fw, fh, screenX, screenY, fw * TRAP_SCALE, fh * TRAP_SCALE, false);
}

export function drawTrapFallingPlatform(ctx, screenX, screenY) {
    const sheet = PA1.getTrap('falling_on');
    if (!sheet) return;
    const fw = 32, fh = 10;
    PA1.drawStripFrame(ctx, sheet, 0, fw, fh, screenX, screenY, fw * TRAP_SCALE, fh * TRAP_SCALE, false);
}

export function drawTrapFan(ctx, screenX, screenY) {
    const sheet = PA1.getTrap('fan_on');
    if (!sheet) return;
    const fw = 24, fh = 8;
    const frame = getTrapAnimFrame('fan', 6) % PA1.getStripFrameCount(sheet, fw);
    PA1.drawStripFrame(ctx, sheet, frame, fw, fh, screenX, screenY, fw * TRAP_SCALE, fh * TRAP_SCALE, false);
}

export function drawTrapSpikedBall(ctx, screenX, screenY) {
    const sheet = PA1.getTrap('spikedBall');
    if (!sheet) return;
    const s = 16;
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(sheet, 0, 0, sheet.width, sheet.height, Math.round(screenX), Math.round(screenY), sheet.width * TRAP_SCALE, sheet.height * TRAP_SCALE);
}

export function drawTrapRockHead(ctx, screenX, screenY) {
    const sheet = PA1.getTrap('rockhead_idle');
    if (!sheet) return;
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(sheet, 0, 0, sheet.width, sheet.height, Math.round(screenX), Math.round(screenY), sheet.width * TRAP_SCALE, sheet.height * TRAP_SCALE);
}

export function drawTrapSpikeHead(ctx, screenX, screenY) {
    const sheet = PA1.getTrap('spikehead_idle');
    if (!sheet) return;
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(sheet, 0, 0, sheet.width, sheet.height, Math.round(screenX), Math.round(screenY), sheet.width * TRAP_SCALE, sheet.height * TRAP_SCALE);
}

export function drawTrapBlocks(ctx, screenX, screenY) {
    const sheet = PA1.getTrap('block_idle');
    if (!sheet) return;
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(sheet, 0, 0, sheet.width, sheet.height, Math.round(screenX), Math.round(screenY), sheet.width * TRAP_SCALE, sheet.height * TRAP_SCALE);
}

export function drawTrapPlatform(ctx, screenX, screenY, type) {
    const key = type === 'grey' ? 'platGreyOn' : 'platBrownOn';
    const sheet = PA1.getTrap(key);
    if (!sheet) return;
    const fw = 32, fh = 8;
    PA1.drawStripFrame(ctx, sheet, 0, fw, fh, screenX, screenY, fw * TRAP_SCALE, fh * TRAP_SCALE, false);
}

export function drawTrapSandMudIce(ctx, screenX, screenY) {
    const sheet = PA1.getTrap('sandmudice');
    if (!sheet) return;
    const fw = 16, fh = 6;
    PA1.drawStripFrame(ctx, sheet, 0, fw, fh, screenX, screenY, fw * TRAP_SCALE, fh * TRAP_SCALE, false);
}

export function drawBackground(ctx, color, canvasW, canvasH, camX, camY) {
    const bg = PA1.getBg(color);
    if (!bg) return false;
    const tw = 64 * SCALE;
    const th = 64 * SCALE;
    const offX = ((camX * 0.15) % tw + tw) % tw;
    const offY = ((camY * 0.15) % th + th) % th;
    const cols = Math.ceil(canvasW / tw) + 2;
    const rows = Math.ceil(canvasH / th) + 2;
    ctx.imageSmoothingEnabled = false;
    for (let r = -1; r < rows; r++) {
        for (let c = -1; c < cols; c++) {
            ctx.drawImage(bg, Math.floor(c * tw - offX), Math.floor(r * th - offY), tw, th);
        }
    }
    return true;
}

export function drawMenuButton(ctx, name, x, y, scale) {
    const img = PA1.getMenuButton(name);
    if (!img) return;
    ctx.imageSmoothingEnabled = false;
    const s = scale || 3;
    ctx.drawImage(img, 0, 0, img.width, img.height, Math.round(x), Math.round(y), img.width * s, img.height * s);
}

export function drawLevelBadge(ctx, num, x, y, scale) {
    const img = PA1.getMenuLevel(num);
    if (!img) return;
    ctx.imageSmoothingEnabled = false;
    const s = scale || 3;
    ctx.drawImage(img, 0, 0, img.width, img.height, Math.round(x), Math.round(y), img.width * s, img.height * s);
}

export function drawDust(ctx, x, y, scale) {
    const img = PA1.getOther('dust');
    if (!img) return;
    ctx.imageSmoothingEnabled = false;
    const s = scale || 3;
    ctx.drawImage(img, 0, 0, img.width, img.height, Math.round(x), Math.round(y), img.width * s, img.height * s);
}

export function drawShadow(ctx, x, y, w) {
    const img = PA1.getOther('shadow');
    if (!img) return;
    ctx.save();
    ctx.globalAlpha = 0.4;
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(img, 0, 0, img.width, img.height, Math.round(x + (w - 48) / 2), Math.round(y), 48, 16);
    ctx.restore();
}

export { TERRAIN_SRC, TERRAIN_COLS, TERRAIN_ROWS, TERRAIN_RENDER, FRUIT_SRC, FRUIT_RENDER, BOX_SRC_W, BOX_SRC_H, BOX_RENDER_W, BOX_RENDER_H, CP_SRC, CP_RENDER };
