const MAX_LEVELS = 30;

let fileLevels = [];

export async function loadCustomLevels() {
    fileLevels = [];
    const cb = '?t=' + Date.now();
    for (let i = 1; i <= MAX_LEVELS; i++) {
        try {
            const mod = await import('./levels/level-' + i + '.js' + cb);
            if (mod && mod.default && mod.default.name && mod.default.map) {
                fileLevels.push(mod.default);
                console.log(`Loaded level-${i}.js (${mod.default.name})`);
            }
        } catch (e) {}
    }
}

function _buildLevel(data) {
    if (!data || !data.map) return null;
    const map = data.map.map(r => r.slice());
    const h = map.length, w = map[0].length;
    const ap = data.actionPoints || {};
    let spawn = ap.start ? { tx: ap.start.tx, ty: ap.start.ty } : data.spawn || { tx: 1, ty: h - 2 };
    let exit = ap.end ? { tx: ap.end.tx, ty: ap.end.ty } : data.exit || { tx: w - 2, ty: h - 2 };
    if (exit && map[exit.ty] && map[exit.ty][exit.tx] !== 178) map[exit.ty][exit.tx] = 178;
    return {
        name: data.name, width: w, height: h, theme: data.theme || 'grass',
        bgColor: data.bgColor || '#1a2a1a',
        bgImage: data.bgImage || null,
        spawn, exit, map,
        solidMap: data.solidMap ? data.solidMap.map(r => r.slice()) : null,
        entities: (data.entities || []).map(e => ({...e})),
        platforms: (data.platforms || []).map(p => ({...p, tiles: (p.tiles || []).map(t => ({...t}))})),
        decorations: []
    };
}

export function getLevel(index) {
    if (index < 0 || index >= fileLevels.length) return null;
    const source = fileLevels[index];
    const level = _buildLevel(source);
    if (level) {
        level.index = index;
        level.totalLevels = getTotalLevels();
        level.sourceType = 'FILE';
    }
    return level;
}

export function getTotalLevels() {
    return fileLevels.length;
}
