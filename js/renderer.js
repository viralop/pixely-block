export const TILE_SIZE = 18;
export const CHAR_SIZE = 24;
export const BG_TILE_SIZE = 24;
export const SCALE = 3;
export const RENDER_TILE = TILE_SIZE * SCALE;
export const RENDER_CHAR = CHAR_SIZE * SCALE;

const TILE_COLS = 20;
const CHAR_COLS = 9;

const EXPANSION_TILESETS = [
    { gid0: 1000, cols: 16, count: 112, path: 'kenney_pixel-platformer-farm-expansion/Tilemap/tilemap.png' },
    { gid0: 2000, cols: 16, count: 112, path: 'kenney_pixel-platformer-food-expansion/Tilemap/tilemap.png' },
    { gid0: 3000, cols: 16, count: 112, path: 'kenney_pixel-platformer-industrial-expansion/Tilemap/tilemap.png' },
];

let expansionSheets = {};

const ASSET_PATHS = {
    tiles: 'kenney_pixel-platformer/Tilemap/tilemap.png',
    characters: 'kenney_pixel-platformer/Tilemap/tilemap-characters.png',
    backgrounds: 'kenney_pixel-platformer/Tilemap/tilemap-backgrounds.png'
};

let sheets = {};
let bgCanvas = null;
let extraSprites = {};

export function isLoaded() {
    return sheets.tiles && sheets.characters && sheets.backgrounds;
}

export function loadAll() {
    const expPromises = EXPANSION_TILESETS.map(ts =>
        loadImage(ts.path).then(img => { expansionSheets[ts.gid0] = img; }).catch(e => { console.warn('Failed to load expansion tiles:', ts.path); })
    );
    return Promise.all([
        loadImage(ASSET_PATHS.tiles).then(img => sheets.tiles = img),
        loadImage(ASSET_PATHS.characters).then(img => sheets.characters = img),
        loadImage(ASSET_PATHS.backgrounds).then(img => sheets.backgrounds = img),
        loadExtraSprites(),
        ...expPromises
    ]);
}

function loadExtraSprites() {
    const paths = {
        knight_idle: 'kenney_pixel-platformer/human chars/tile_10094.png',
        knight_run: 'kenney_pixel-platformer/human chars/tile_10091.png',
        knight_atk1: 'kenney_pixel-platformer/human chars/tile_10088.png',
        knight_atk2: 'kenney_pixel-platformer/human chars/tile_10089.png',
        sword: 'kenney_pixel-platformer/human chars/tile_01066.png',
        queen: 'kenney_pixel-platformer/human chars/tile_10092.png',
        boss1: 'kenney_pixel-platformer/bosses/tile_10085.png',
        boss2: 'kenney_pixel-platformer/bosses/tile_10086.png',
        boss3: 'kenney_pixel-platformer/bosses/tile_10093.png',
        boss4: 'kenney_pixel-platformer/bosses/tile_10095.png',
        boss_lvl: 'kenney_pixel-platformer/human chars/tile_10090.png',
        axe: 'kenney_pixel-platformer/bosses/weapons bosses/axe_silver.png',
        weapon2: 'kenney_pixel-platformer/bosses/weapons bosses/tile_0103.png',
        weapon3: 'kenney_pixel-platformer/bosses/weapons bosses/tile_0104.png',
        weapon4: 'kenney_pixel-platformer/bosses/weapons bosses/tile_0105.png',
        weapon5: 'kenney_pixel-platformer/bosses/weapons bosses/tile_0106.png'
    };
    const promises = [];
    for (const [key, path] of Object.entries(paths)) {
        promises.push(loadImage(path).then(img => { extraSprites[key] = img; console.log('Loaded extra: ' + key); }).catch(e => { console.warn('Failed to load extra: ' + key, path); }));
    }
    return Promise.all(promises);
}

export function drawExtra(ctx, key, screenX, screenY, size, flipH = false, srcRect = null) {
    const img = extraSprites[key];
    if (!img) return;
    ctx.imageSmoothingEnabled = false;
    if (srcRect) {
        if (flipH) {
            ctx.save();
            ctx.translate(Math.round(screenX) + size, Math.round(screenY));
            ctx.scale(-1, 1);
            ctx.drawImage(img, srcRect.x, srcRect.y, srcRect.w, srcRect.h, 0, 0, size, size);
            ctx.restore();
        } else {
            ctx.drawImage(img, srcRect.x, srcRect.y, srcRect.w, srcRect.h, Math.round(screenX), Math.round(screenY), size, size);
        }
    } else if (flipH) {
        ctx.save();
        ctx.translate(Math.round(screenX) + size, Math.round(screenY));
        ctx.scale(-1, 1);
        ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, size, size);
        ctx.restore();
    } else {
        ctx.drawImage(img, 0, 0, img.width, img.height, Math.round(screenX), Math.round(screenY), size, size);
    }
}

export function hasExtra(key) {
    return !!extraSprites[key];
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
    let sheet = sheets.tiles, cols = TILE_COLS, gid0 = 28;
    for (const ts of EXPANSION_TILESETS) {
        if (tileId >= ts.gid0 && tileId < ts.gid0 + ts.count) {
            sheet = expansionSheets[ts.gid0];
            cols = ts.cols;
            gid0 = ts.gid0;
            break;
        }
    }
    if (!sheet) return;
    const index = tileId - gid0;
    const col = index % cols;
    const row = Math.floor(index / cols);
    const sx = col * (TILE_SIZE + 1);
    const sy = row * (TILE_SIZE + 1);
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(
        sheet,
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

export function drawCharSmall(ctx, charId, screenX, screenY, size) {
    if (charId <= 0 || !sheets.characters) return;
    const index = charId - 1;
    const col = index % CHAR_COLS;
    const row = Math.floor(index / CHAR_COLS);
    const sx = col * (CHAR_SIZE + 1);
    const sy = row * (CHAR_SIZE + 1);
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(
        sheets.characters,
        sx, sy, CHAR_SIZE, CHAR_SIZE,
        Math.round(screenX), Math.round(screenY), size, size
    );
}

export function drawBgParallax(ctx, canvasW, canvasH, cameraX, cameraY, bgColor) {
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvasW, canvasH);
    if (!sheets.backgrounds) return;

    const bg = sheets.backgrounds;
    const bgTileSize = BG_TILE_SIZE;
    const bgSrcStep = bgTileSize + 1;
    const bgCols = 8;
    const s = SCALE;
    const tw = bgTileSize * s;
    const hCount = Math.ceil(canvasW / tw) + 3;

    const midRow = Math.floor(canvasH * 0.4 / tw);
    const groundRow = Math.floor(canvasH * 0.65 / tw);
    const totalRows = Math.ceil(canvasH / tw) + 2;

    if (!bgCanvas || bgCanvas.width !== canvasW || bgCanvas.height !== canvasH) {
        bgCanvas = document.createElement('canvas');
        bgCanvas.width = canvasW;
        bgCanvas.height = canvasH;
    }

    const bctx = bgCanvas.getContext('2d');
    bctx.clearRect(0, 0, canvasW, canvasH);
    bctx.imageSmoothingEnabled = false;

    for (let r = -1; r < totalRows; r++) {
        const y = r * tw;
        for (let c = -2; c < hCount; c++) {
            const parallax = r < midRow ? 0.03 : r < groundRow ? 0.06 : 0.1;
            const rawOff = cameraX * parallax;
            const off = ((rawOff % tw) + tw) % tw;
            const x = Math.floor(c * tw - off);
            let tileIdx;
            if (r === midRow) {
                tileIdx = 8 + ((c % 4) + 400) % 4;
            } else if (r >= groundRow) {
                tileIdx = 16 + ((c % 4) + 400) % 4;
            } else {
                tileIdx = ((c % 4) + 400) % 4;
            }
            const sx = (tileIdx % bgCols) * bgSrcStep;
            const sy = Math.floor(tileIdx / bgCols) * bgSrcStep;
            bctx.drawImage(bg, sx, sy, bgTileSize, bgTileSize, x, y, tw + 1, tw + 1);
        }
    }

    ctx.globalAlpha = 0.5;
    ctx.drawImage(bgCanvas, 0, 0);
    ctx.globalAlpha = 1;
}
