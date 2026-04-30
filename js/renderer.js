export const TILE_SIZE = 18;
export const CHAR_SIZE = 24;
export const BG_TILE_SIZE = 24;
export const SCALE = 3;
export const RENDER_TILE = TILE_SIZE * SCALE;
export const RENDER_CHAR = CHAR_SIZE * SCALE;

const TILE_COLS = 20;
const CHAR_COLS = 9;

const ASSET_PATHS = {
    tiles: 'kenney_pixel-platformer/Tilemap/tilemap.png',
    characters: 'kenney_pixel-platformer/Tilemap/tilemap-characters.png',
    backgrounds: 'kenney_pixel-platformer/Tilemap/tilemap-backgrounds.png'
};

let sheets = {};

export function isLoaded() {
    return sheets.tiles && sheets.characters && sheets.backgrounds;
}

export function loadAll() {
    return Promise.all([
        loadImage(ASSET_PATHS.tiles).then(img => sheets.tiles = img),
        loadImage(ASSET_PATHS.characters).then(img => sheets.characters = img),
        loadImage(ASSET_PATHS.backgrounds).then(img => sheets.backgrounds = img)
    ]);
}

function loadImage(src) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error(`Failed to load: ${src}`));
        img.src = src;
    });
}

export function drawTile(ctx, tileId, screenX, screenY) {
    if (tileId <= 0) return;
    const index = tileId - 28;
    const col = index % TILE_COLS;
    const row = Math.floor(index / TILE_COLS);
    const sx = col * (TILE_SIZE + 1);
    const sy = row * (TILE_SIZE + 1);
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(
        sheets.tiles,
        sx, sy, TILE_SIZE, TILE_SIZE,
        Math.round(screenX), Math.round(screenY), RENDER_TILE + 1, RENDER_TILE + 1
    );
}

export function drawChar(ctx, charId, screenX, screenY, flipH = false) {
    if (charId <= 0) return;
    const index = charId - 1;
    const col = index % CHAR_COLS;
    const row = Math.floor(index / CHAR_COLS);
    const sx = col * (CHAR_SIZE + 1);
    const sy = row * (CHAR_SIZE + 1);
    ctx.imageSmoothingEnabled = false;
    if (flipH) {
        ctx.save();
        ctx.translate(Math.round(screenX) + RENDER_CHAR + 1, Math.round(screenY));
        ctx.scale(-1, 1);
        ctx.drawImage(sheets.characters, sx, sy, CHAR_SIZE, CHAR_SIZE, 0, 0, RENDER_CHAR + 1, RENDER_CHAR + 1);
        ctx.restore();
    } else {
        ctx.drawImage(
            sheets.characters,
            sx, sy, CHAR_SIZE, CHAR_SIZE,
            Math.round(screenX), Math.round(screenY), RENDER_CHAR + 1, RENDER_CHAR + 1
        );
    }
}

export function drawBgParallax(ctx, canvasW, canvasH, cameraX, cameraY, bgColor) {
    if (!sheets.backgrounds) {
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, canvasW, canvasH);
        return;
    }

    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvasW, canvasH);

    const bg = sheets.backgrounds;
    const bw = bg.width;
    const bh = bg.height;
    const scale = SCALE * 2;
    const totalW = bw * scale;
    const totalH = bh * scale;
    const offX = -(cameraX * 0.1) % totalW;
    const offY = -(cameraY * 0.05) % totalH;

    ctx.globalAlpha = 0.6;
    ctx.imageSmoothingEnabled = false;
    const cols = Math.ceil(canvasW / totalW) + 2;
    const rows = Math.ceil(canvasH / totalH) + 2;

    for (let r = -1; r < rows; r++) {
        for (let c = -1; c < cols; c++) {
            ctx.drawImage(
                bg,
                0, 0, bw, bh,
                Math.round(c * totalW + offX),
                Math.round(r * totalH + offY),
                totalW + 2, totalH + 2
            );
        }
    }
    ctx.globalAlpha = 1;
}
