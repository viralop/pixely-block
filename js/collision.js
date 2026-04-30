import { RENDER_TILE, TILE_SIZE, SCALE } from './renderer.js';

export function rectOverlap(a, b) {
    return a.x < b.x + b.w && a.x + a.w > b.x &&
           a.y < b.y + b.h && a.y + a.h > b.y;
}

export function getTilesInRegion(map, x, y, w, h, tileW, tileH) {
    const results = [];
    const startCol = Math.floor(x / tileW);
    const startRow = Math.floor(y / tileH);
    const endCol = Math.floor((x + w - 1) / tileW);
    const endRow = Math.floor((y + h - 1) / tileH);
    for (let row = startRow; row <= endRow; row++) {
        for (let col = startCol; col <= endCol; col++) {
            if (row >= 0 && row < map.length && col >= 0 && col < map[0].length) {
                const tileId = map[row][col];
                if (tileId > 0) {
                    results.push({
                        tileId,
                        col, row,
                        x: col * tileW,
                        y: row * tileH,
                        w: tileW,
                        h: tileH
                    });
                }
            }
        }
    }
    return results;
}

export function moveEntity(entity, dx, dy, solidMap, tileW, tileH) {
    let grounded = false;

    entity.x += dx;
    const tilesX = getTilesInRegion(solidMap, entity.x, entity.y, entity.w, entity.h, tileW, tileH);
    for (const tile of tilesX) {
        if (isSolid(tile.tileId) && rectOverlap(entity, tile)) {
            if (dx > 0) entity.x = tile.x - entity.w;
            else if (dx < 0) entity.x = tile.x + tile.w;
        }
    }

    entity.y += dy;
    const tilesY = getTilesInRegion(solidMap, entity.x, entity.y, entity.w, entity.h, tileW, tileH);
    for (const tile of tilesY) {
        if (isSolid(tile.tileId) && rectOverlap(entity, tile)) {
            if (dy > 0) {
                entity.y = tile.y - entity.h;
                entity.vy = 0;
                grounded = true;
            } else if (dy < 0) {
                entity.y = tile.y + tile.h;
                entity.vy = 0;
            }
        }
    }

    return grounded;
}

const SOLID_SET = new Set([
    33, 52, 53,
    169, 170, 171,
    109, 110, 111,
    49, 50, 51,
    60, 80, 100,
    76, 78,
    181, 182, 183
]);

export function isSolid(tileId) {
    return SOLID_SET.has(tileId);
}

export const HAZARD_IDS = new Set([96]);
export const COIN_IDS = new Set([179, 180]);
export const HEART_IDS = new Set([72]);
export const EXIT_IDS = new Set([178]);
