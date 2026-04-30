import { RENDER_TILE } from './renderer.js';

const GS = { tl: 49, tm: 50, tr: 51, fill: [169, 170, 171] };
const SS = { tl: 109, tm: 110, tr: 111, fill: [109, 110, 111] };
const WS = { tl: 60, tm: 80, tr: 100, fill: [80] };

function mk(w, h) {
    return { map: Array.from({ length: h }, () => new Array(w).fill(0)), entities: [] };
}

function plat(map, x, y, w, s) {
    if (x < 0 || y < 0 || w < 1) return;
    const mw = map[0].length, mh = map.length;
    const ex = Math.min(x + w, mw);
    map[y][x] = s.tl;
    for (let i = x + 1; i < ex - 1; i++) map[y][i] = s.tm;
    if (w > 1) map[y][ex - 1] = s.tr;
    else map[y][x] = s.tm;
    for (let r = y + 1; r < mh; r++) {
        map[r][x] = 169;
        for (let i = x + 1; i < ex - 1; i++) map[r][i] = 170;
        if (w > 1) map[r][ex - 1] = 171;
        else map[r][x] = 170;
    }
}

function flt(map, x, y, w) {
    if (w <= 2) {
        map[y][x] = 76;
        if (w > 1) map[y][x + 1] = 78;
    } else {
        map[y][x] = 181;
        for (let i = 1; i < w - 1; i++) map[y][x + i] = 182;
        map[y][x + w - 1] = 183;
    }
}

function cn(map, x, y, n) {
    const ids = [179, 180];
    for (let i = 0; i < n; i++) if (map[y]) map[y][x + i] = ids[i % 2];
}

function sp(map, x, y, n = 1) { for (let i = 0; i < n; i++) if (map[y]) map[y][x + i] = 96; }
function hr(map, x, y) { if (map[y]) map[y][x] = 72; }
function ext(map, x, y) { if (map[y]) map[y][x] = 178; }
function dco(map, x, y) {
    if (!map[y]) return;
    const ids = [154, 155, 156, 157];
    map[y][x] = ids[x % ids.length];
}
function tree(map, x, y) {
    if (map[y + 6]) {
        map[y][x] = 45; map[y + 1][x] = 46; map[y + 2][x] = 47;
        map[y + 3][x] = 65; map[y + 4][x] = 66; map[y + 5][x] = 67;
        map[y + 6][x] = 85; map[y + 7][x] = 86; map[y + 8][x] = 87;
    }
}

function ladder(map, x, y, h) {
    for (let i = 0; i < h; i++) {
        const row = y - i;
        if (row < 0 || !map[row]) continue;
        map[row][x] = i === 0 ? 79 : 99;
    }
}

function rope(map, x, y, len) {
    if (!map[y]) return;
    const cx = Math.floor(len / 2);
    for (let i = 0; i < len; i++) {
        const col = x + i;
        if (col >= map[0].length) continue;
        if (i === 0) map[y][col] = 118;
        else if (i === len - 1) map[y][col] = 120;
        else map[y][col] = 119;
    }
}

function spr(map, x, y) { if (map[y]) map[y][x] = 135; }

function slime(tx, ty, l, r) { return { type: 'slime', tx, ty, patrolL: l, patrolR: r }; }
function bat(tx, ty, l, r) { return { type: 'bat', tx, ty, patrolL: l, patrolR: r }; }
function skel(tx, ty, l, r) { return { type: 'skeleton', tx, ty, patrolL: l, patrolR: r }; }

function buildLevel1() {
    const W = 45, H = 10;
    const { map, entities } = mk(W, H);

    plat(map, 0, 8, 12, GS);
    plat(map, 15, 8, 8, GS);
    plat(map, 25, 8, 6, GS);
    plat(map, 33, 8, 12, GS);

    sp(map, 23, 8);

    flt(map, 5, 6, 3);
    flt(map, 11, 5, 3);
    flt(map, 17, 6, 3);
    flt(map, 21, 5, 2);
    flt(map, 27, 6, 3);
    flt(map, 31, 5, 2);
    flt(map, 35, 4, 3);
    flt(map, 39, 6, 3);

    cn(map, 6, 5, 3);
    cn(map, 12, 4, 2);
    cn(map, 18, 5, 3);
    cn(map, 28, 5, 3);
    cn(map, 36, 3, 2);

    hr(map, 31, 4);

    ladder(map, 13, 8, 2);

    spr(map, 30, 7);

    tree(map, 1, 5);
    tree(map, 3, 4);
    dco(map, 8, 7);
    dco(map, 16, 7);
    dco(map, 26, 7);

    ext(map, 43, 7);

    entities.push(slime(16, 7, 15, 22));
    entities.push(slime(34, 7, 33, 39));

    return {
        name: 'Green Meadows', width: W, height: H, theme: 'grass',
        bgColor: '#1a2a1a', spawn: { tx: 1, ty: 7 }, exit: { tx: 43, ty: 7 },
        map, entities
    };
}

function buildLevel2() {
    const W = 50, H = 10;
    const { map, entities } = mk(W, H);

    plat(map, 0, 8, 9, SS);
    plat(map, 12, 8, 7, SS);
    plat(map, 21, 8, 5, SS);
    plat(map, 28, 8, 6, SS);
    plat(map, 36, 8, 5, SS);
    plat(map, 43, 8, 7, SS);

    sp(map, 19, 8);
    sp(map, 20, 8);
    sp(map, 34, 8);
    sp(map, 35, 8);

    flt(map, 4, 6, 3);
    flt(map, 9, 4, 3);
    flt(map, 14, 6, 3);
    flt(map, 18, 5, 2);
    flt(map, 23, 5, 3);
    flt(map, 27, 3, 3);
    flt(map, 30, 6, 2);
    flt(map, 34, 4, 2);
    flt(map, 38, 6, 3);
    flt(map, 42, 5, 3);
    flt(map, 46, 4, 2);

    cn(map, 5, 5, 3);
    cn(map, 10, 3, 2);
    cn(map, 15, 5, 3);
    cn(map, 24, 4, 3);
    cn(map, 28, 2, 2);
    cn(map, 39, 5, 3);
    cn(map, 47, 3, 2);

    hr(map, 27, 2);
    hr(map, 42, 4);

    ladder(map, 10, 8, 3);
    rope(map, 32, 2, 5);

    spr(map, 37, 7);

    dco(map, 2, 7);
    dco(map, 13, 7);
    dco(map, 29, 7);

    ext(map, 48, 7);

    entities.push(slime(13, 7, 12, 18));
    entities.push(slime(29, 7, 28, 33));
    entities.push(bat(22, 3, 18, 26));
    entities.push(skel(44, 7, 43, 49));

    return {
        name: 'Rocky Caves', width: W, height: H, theme: 'stone',
        bgColor: '#1a1a2a', spawn: { tx: 1, ty: 7 }, exit: { tx: 48, ty: 7 },
        map, entities
    };
}

function buildLevel3() {
    const W = 55, H = 10;
    const { map, entities } = mk(W, H);

    plat(map, 0, 8, 8, WS);
    plat(map, 11, 8, 6, WS);
    plat(map, 19, 8, 5, WS);
    plat(map, 26, 8, 6, WS);
    plat(map, 34, 8, 4, WS);
    plat(map, 40, 8, 5, WS);
    plat(map, 47, 8, 8, WS);

    sp(map, 9, 8);
    sp(map, 10, 8);
    sp(map, 17, 8);
    sp(map, 18, 8);
    sp(map, 24, 8);
    sp(map, 25, 8);
    sp(map, 32, 8);
    sp(map, 33, 8);
    sp(map, 38, 8);
    sp(map, 39, 8);

    flt(map, 3, 6, 2);
    flt(map, 7, 4, 3);
    flt(map, 12, 6, 3);
    flt(map, 16, 5, 2);
    flt(map, 20, 6, 3);
    flt(map, 25, 4, 2);
    flt(map, 28, 6, 3);
    flt(map, 32, 5, 3);
    flt(map, 36, 6, 2);
    flt(map, 39, 3, 3);
    flt(map, 43, 5, 3);
    flt(map, 48, 6, 3);
    flt(map, 52, 4, 2);

    cn(map, 4, 5, 2);
    cn(map, 8, 3, 3);
    cn(map, 13, 5, 3);
    cn(map, 21, 5, 3);
    cn(map, 29, 5, 3);
    cn(map, 40, 2, 3);
    cn(map, 44, 4, 2);
    cn(map, 49, 5, 3);

    hr(map, 7, 3);
    hr(map, 25, 3);
    hr(map, 39, 2);

    ladder(map, 14, 8, 3);
    ladder(map, 30, 8, 2);
    rope(map, 21, 3, 5);

    spr(map, 37, 7);
    spr(map, 48, 7);

    tree(map, 1, 5);
    tree(map, 4, 4);
    dco(map, 12, 7);
    dco(map, 20, 7);
    dco(map, 27, 7);
    dco(map, 41, 7);
    dco(map, 48, 7);

    ext(map, 53, 7);

    entities.push(slime(12, 7, 11, 16));
    entities.push(slime(35, 7, 34, 37));
    entities.push(bat(8, 2, 5, 12));
    entities.push(bat(28, 3, 25, 33));
    entities.push(skel(41, 7, 40, 44));

    return {
        name: 'Haunted Woods', width: W, height: H, theme: 'wood',
        bgColor: '#0f1a0f', spawn: { tx: 1, ty: 7 }, exit: { tx: 53, ty: 7 },
        map, entities
    };
}

function buildLevel4() {
    const W = 60, H = 10;
    const { map, entities } = mk(W, H);

    plat(map, 0, 8, 7, SS);
    plat(map, 10, 8, 5, SS);
    plat(map, 17, 8, 4, SS);
    plat(map, 23, 8, 5, SS);
    plat(map, 30, 8, 4, SS);
    plat(map, 36, 8, 5, SS);
    plat(map, 43, 8, 4, SS);
    plat(map, 49, 8, 11, SS);

    sp(map, 7, 8);
    sp(map, 8, 8);
    sp(map, 15, 8);
    sp(map, 16, 8);
    sp(map, 21, 8);
    sp(map, 22, 8);
    sp(map, 28, 8);
    sp(map, 29, 8);
    sp(map, 34, 8);
    sp(map, 35, 8);
    sp(map, 41, 8);
    sp(map, 42, 8);
    sp(map, 47, 8);
    sp(map, 48, 8);

    flt(map, 3, 6, 3);
    flt(map, 7, 4, 2);
    flt(map, 11, 6, 3);
    flt(map, 15, 5, 2);
    flt(map, 19, 6, 3);
    flt(map, 23, 4, 2);
    flt(map, 26, 6, 3);
    flt(map, 30, 5, 3);
    flt(map, 34, 3, 2);
    flt(map, 38, 6, 3);
    flt(map, 42, 5, 2);
    flt(map, 45, 6, 3);
    flt(map, 49, 4, 3);
    flt(map, 53, 6, 3);
    flt(map, 57, 5, 2);

    cn(map, 4, 5, 3);
    cn(map, 8, 3, 2);
    cn(map, 12, 5, 3);
    cn(map, 20, 5, 3);
    cn(map, 27, 5, 3);
    cn(map, 31, 4, 3);
    cn(map, 35, 2, 2);
    cn(map, 39, 5, 3);
    cn(map, 50, 3, 3);
    cn(map, 54, 5, 3);

    hr(map, 7, 3);
    hr(map, 23, 3);
    hr(map, 34, 2);
    hr(map, 49, 3);

    ladder(map, 16, 8, 3);
    ladder(map, 42, 8, 2);
    rope(map, 26, 3, 5);
    rope(map, 45, 2, 4);

    spr(map, 29, 7);
    spr(map, 53, 7);

    dco(map, 2, 7);
    dco(map, 11, 7);
    dco(map, 19, 7);
    dco(map, 26, 7);
    dco(map, 38, 7);
    dco(map, 45, 7);
    dco(map, 53, 7);

    ext(map, 58, 7);

    entities.push(slime(11, 7, 10, 14));
    entities.push(slime(37, 7, 36, 40));
    entities.push(bat(15, 3, 12, 20));
    entities.push(bat(35, 2, 30, 40));
    entities.push(skel(24, 7, 23, 27));
    entities.push(skel(50, 7, 49, 55));

    return {
        name: 'Dark Caves', width: W, height: H, theme: 'stone',
        bgColor: '#1a0f1a', spawn: { tx: 1, ty: 7 }, exit: { tx: 58, ty: 7 },
        map, entities
    };
}

function buildLevel5() {
    const W = 66, H = 10;
    const { map, entities } = mk(W, H);

    plat(map, 0, 8, 6, GS);
    plat(map, 9, 8, 5, SS);
    plat(map, 16, 8, 4, WS);
    plat(map, 22, 8, 5, SS);
    plat(map, 29, 8, 4, GS);
    plat(map, 35, 8, 4, WS);
    plat(map, 41, 8, 5, SS);
    plat(map, 48, 8, 4, GS);
    plat(map, 54, 8, 12, GS);

    sp(map, 6, 8);
    sp(map, 7, 8);
    sp(map, 14, 8);
    sp(map, 15, 8);
    sp(map, 20, 8);
    sp(map, 21, 8);
    sp(map, 27, 8);
    sp(map, 28, 8);
    sp(map, 33, 8);
    sp(map, 34, 8);
    sp(map, 39, 8);
    sp(map, 40, 8);
    sp(map, 46, 8);
    sp(map, 47, 8);
    sp(map, 52, 8);
    sp(map, 53, 8);

    flt(map, 2, 6, 2);
    flt(map, 5, 4, 3);
    flt(map, 9, 6, 3);
    flt(map, 13, 5, 2);
    flt(map, 17, 6, 2);
    flt(map, 20, 4, 3);
    flt(map, 24, 6, 3);
    flt(map, 28, 5, 2);
    flt(map, 31, 6, 2);
    flt(map, 34, 4, 2);
    flt(map, 37, 6, 3);
    flt(map, 41, 5, 3);
    flt(map, 45, 3, 2);
    flt(map, 48, 6, 3);
    flt(map, 52, 5, 2);
    flt(map, 55, 4, 3);
    flt(map, 59, 6, 3);
    flt(map, 63, 5, 2);

    cn(map, 3, 5, 2);
    cn(map, 6, 3, 3);
    cn(map, 10, 5, 3);
    cn(map, 18, 5, 2);
    cn(map, 21, 3, 3);
    cn(map, 25, 5, 3);
    cn(map, 32, 5, 2);
    cn(map, 38, 5, 3);
    cn(map, 42, 4, 3);
    cn(map, 49, 5, 3);
    cn(map, 56, 3, 3);
    cn(map, 60, 5, 3);

    hr(map, 5, 3);
    hr(map, 20, 3);
    hr(map, 34, 3);
    hr(map, 45, 2);
    hr(map, 55, 3);

    ladder(map, 8, 8, 3);
    ladder(map, 28, 8, 2);
    ladder(map, 47, 8, 3);
    rope(map, 14, 3, 5);
    rope(map, 38, 2, 5);
    rope(map, 56, 3, 4);

    spr(map, 21, 7);
    spr(map, 41, 7);
    spr(map, 59, 7);

    tree(map, 1, 5);
    dco(map, 10, 7);
    dco(map, 17, 7);
    dco(map, 24, 7);
    dco(map, 31, 7);
    dco(map, 38, 7);
    dco(map, 42, 7);
    dco(map, 49, 7);
    dco(map, 56, 7);

    ext(map, 64, 7);

    entities.push(slime(10, 7, 9, 13));
    entities.push(slime(36, 7, 35, 39));
    entities.push(slime(49, 7, 48, 51));
    entities.push(slime(56, 7, 55, 59));
    entities.push(bat(6, 2, 3, 10));
    entities.push(bat(25, 3, 20, 30));
    entities.push(bat(42, 2, 38, 46));
    entities.push(skel(22, 7, 22, 26));
    entities.push(skel(48, 7, 48, 51));
    entities.push(skel(59, 7, 57, 63));

    return {
        name: 'Final Quest', width: W, height: H, theme: 'mixed',
        bgColor: '#0f0f1a', spawn: { tx: 1, ty: 7 }, exit: { tx: 64, ty: 7 },
        map, entities
    };
}

const levelNames = ['Green Meadows', 'Rocky Caves', 'Haunted Woods', 'Dark Caves', 'Final Quest'];
const builders = [buildLevel1, buildLevel2, buildLevel3, buildLevel4, buildLevel5];

export function getLevel(index) {
    if (index < 0 || index >= builders.length) return null;
    const name = levelNames[index];
    const custom = getCustomLevel(name);
    if (custom) {
        custom.index = index;
        custom.totalLevels = builders.length;
        return custom;
    }
    const level = builders[index]();
    level.index = index;
    level.totalLevels = builders.length;
    return level;
}

export function getTotalLevels() { return builders.length; }

export function seedBuiltInLevels() {
    const existing = getCustomLevels();
    for (let i = 0; i < builders.length; i++) {
        const name = levelNames[i];
        if (existing.find(l => l.name === name)) continue;
        const lvl = builders[i]();
        existing.push({ name, w: lvl.width, h: lvl.height, map: lvl.map, builtin: true, created: 0 });
    }
    localStorage.setItem('pqCustomLevels', JSON.stringify(existing));
}

export function getCustomLevels() {
    try {
        const raw = localStorage.getItem('pqCustomLevels');
        if (!raw) return [];
        return JSON.parse(raw);
    } catch (e) { return []; }
}

export function saveCustomLevel(name, w, h, mapData) {
    const levels = getCustomLevels();
    const existing = levels.findIndex(l => l.name === name);
    const entry = { name, w, h, map: mapData, created: Date.now() };
    if (existing >= 0) levels[existing] = entry;
    else levels.push(entry);
    localStorage.setItem('pqCustomLevels', JSON.stringify(levels));
}

export function deleteCustomLevel(name) {
    const levels = getCustomLevels().filter(l => l.name !== name);
    localStorage.setItem('pqCustomLevels', JSON.stringify(levels));
}

export function getCustomLevel(name) {
    const levels = getCustomLevels();
    const entry = levels.find(l => l.name === name);
    if (!entry) return null;
    return {
        name: entry.name,
        width: entry.w,
        height: entry.h,
        theme: 'grass',
        bgColor: '#1a2a1a',
        spawn: { tx: 1, ty: entry.h - 2 },
        exit: { tx: entry.w - 2, ty: entry.h - 2 },
        map: entry.map.map(r => r.slice()),
        entities: [],
        decorations: []
    };
}
