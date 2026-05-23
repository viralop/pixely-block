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

export function moveEntity(entity, dx, dy, solidMap, tileW, tileH, customSolidMap) {
    let grounded = false;

    entity.x += dx;
    const tilesX = getTilesInRegion(solidMap, entity.x, entity.y, entity.w, entity.h, tileW, tileH);
    for (const tile of tilesX) {
        if (isSolid(tile.tileId, customSolidMap, tile.row, tile.col) && rectOverlap(entity, tile)) {
            if (dx > 0) entity.x = tile.x - entity.w;
            else if (dx < 0) entity.x = tile.x + tile.w;
        }
    }

    entity.y += dy;
    const tilesY = getTilesInRegion(solidMap, entity.x, entity.y, entity.w, entity.h, tileW, tileH);
    for (const tile of tilesY) {
        if (isSolid(tile.tileId, customSolidMap, tile.row, tile.col) && rectOverlap(entity, tile)) {
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
    181, 182, 183,
    56
]);

export function isSolid(tileId, customSolidMap, row, col) {
    if (KEY_IDS.has(tileId) || COIN_IDS.has(tileId) || HEART_IDS.has(tileId) || EXIT_IDS.has(tileId) || HAZARD_IDS.has(tileId) || SPRING_IDS.has(tileId) || LADDER_IDS.has(tileId) || ROPE_IDS.has(tileId) || HOOK_IDS.has(tileId) || CHECKPOINT_IDS.has(tileId)) return false;
    if (FRUIT_IDS.has(tileId) || BOX_IDS.has(tileId) || PA1_CHECKPOINT_IDS.has(tileId) || TRAP_HAZARD_IDS.has(tileId)) return false;
    if (customSolidMap) {
        return !!(customSolidMap[row] && customSolidMap[row][col]);
    }
    return SOLID_SET.has(tileId);
}

export const HAZARD_IDS = new Set([96]);
export const COIN_IDS = new Set([179, 180]);
export const HEART_IDS = new Set([72]);
export const EXIT_IDS = new Set([178]);
export const LADDER_IDS = new Set([79, 99]);
export const ROPE_IDS = new Set([118, 119, 120, 97, 117, 137]);
export const HOOK_IDS = new Set([3039, 3040]);
export const SPRING_IDS = new Set([135, 136]);
export const CHECKPOINT_IDS = new Set([139, 140]);
export const KEY_IDS = new Set([55]);
export const LOCK_IDS = new Set([56]);

export function isLadder(tileId) { return LADDER_IDS.has(tileId); }
export function isRope(tileId) { return ROPE_IDS.has(tileId) || HOOK_IDS.has(tileId); }
export function isHook(tileId) { return HOOK_IDS.has(tileId); }
export function isSpring(tileId) { return SPRING_IDS.has(tileId); }

export const FRUIT_IDS = new Set([5001, 5002, 5003, 5004, 5005, 5006, 5007, 5008]);
export const BOX_IDS = new Set([
    5020, 5021, 5022,
    5030, 5031, 5032,
    5040, 5041, 5042
]);
export const PA1_CHECKPOINT_IDS = new Set([5050]);
export const TRAP_HAZARD_IDS = new Set([4100, 4101, 4102, 4110, 96]);
export const TRAP_IDS = new Set([4100, 4101, 4102, 4103, 4110, 4111, 4120, 4121]);

export const PA1_TERRAIN_SOLID = new Set([
    4000, 4001, 4002, 4003, 4004, 4005, 4006,
    4020, 4021, 4022, 4023, 4024, 4025, 4026,
    4040, 4041, 4042, 4043, 4044, 4045, 4046,
    4007, 4008, 4009, 4010, 4011, 4012, 4013,
    4027, 4028, 4029, 4030, 4031, 4032, 4033,
    4047, 4048, 4049, 4050, 4051, 4052, 4053
]);

export function getTileAt(map, col, row) {
    if (row >= 0 && row < map.length && col >= 0 && col < map[0].length) {
        return map[row][col];
    }
    return 0;
}
