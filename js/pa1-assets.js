const PA1_BASE = 'Pixel Adventure 1/Free/';

const loadImage = (src) => new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Failed: ' + src));
    img.src = src;
});

let loaded = false;
const assets = {
    backgrounds: {},
    fruits: {},
    fruitCollected: null,
    boxes: {},
    checkpoints: {},
    characters: {},
    spawnFx: {},
    terrain: null,
    traps: {},
    menu: { buttons: {}, levels: {}, text: {} },
    other: {}
};

const CHAR_NAMES = ['Mask Dude', 'Ninja Frog', 'Pink Man', 'Virtual Guy'];

export function getCharNames() { return CHAR_NAMES; }

export function isLoaded() { return loaded; }

export async function loadAll() {
    const promises = [];

    promises.push(...loadBackgrounds());
    promises.push(...loadFruits());
    promises.push(...loadBoxes());
    promises.push(...loadCheckpoints());
    promises.push(...loadCharacters());
    promises.push(...loadSpawnFx());
    promises.push(loadTerrain());
    promises.push(...loadTraps());
    promises.push(...loadMenu());
    promises.push(...loadOther());

    await Promise.allSettled(promises);
    loaded = true;
    console.log('[PA1] All assets loaded');
}

function loadBackgrounds() {
    const colors = ['Blue', 'Brown', 'Gray', 'Green', 'Pink', 'Purple', 'Yellow'];
    return colors.map(c =>
        loadImage(PA1_BASE + 'Background/' + c + '.png')
            .then(img => { assets.backgrounds[c.toLowerCase()] = img; })
            .catch(() => {})
    );
}

function loadFruits() {
    const names = ['Apple', 'Bananas', 'Cherries', 'Kiwi', 'Melon', 'Orange', 'Pineapple', 'Strawberry'];
    const p = names.map(n =>
        loadImage(PA1_BASE + 'Items/Fruits/' + n + '.png')
            .then(img => { assets.fruits[n.toLowerCase()] = img; })
            .catch(() => {})
    );
    p.push(
        loadImage(PA1_BASE + 'Items/Fruits/Collected.png')
            .then(img => { assets.fruitCollected = img; })
            .catch(() => {})
    );
    return p;
}

function loadBoxes() {
    const p = [];
    ['Box1', 'Box2', 'Box3'].forEach(box => {
        const states = {};
        p.push(
            loadImage(PA1_BASE + 'Items/Boxes/' + box + '/Idle.png')
                .then(img => { states.idle = img; })
                .catch(() => {}),
            loadImage(PA1_BASE + 'Items/Boxes/' + box + '/Hit (28x24).png')
                .then(img => { states.hit = img; })
                .catch(() => {}),
            loadImage(PA1_BASE + 'Items/Boxes/' + box + '/Break.png')
                .then(img => { states.breakAnim = img; })
                .catch(() => {})
        );
        assets.boxes[box.toLowerCase()] = states;
    });
    return p;
}

function loadCheckpoints() {
    const p = [];
    const cp = {};

    p.push(
        loadImage(PA1_BASE + 'Items/Checkpoints/Start/Start (Idle).png')
            .then(img => { cp.startIdle = img; }).catch(() => {}),
        loadImage(PA1_BASE + 'Items/Checkpoints/Start/Start (Moving) (64x64).png')
            .then(img => { cp.startMoving = img; }).catch(() => {}),
        loadImage(PA1_BASE + 'Items/Checkpoints/End/End (Idle).png')
            .then(img => { cp.endIdle = img; }).catch(() => {}),
        loadImage(PA1_BASE + 'Items/Checkpoints/End/End (Pressed) (64x64).png')
            .then(img => { cp.endPressed = img; }).catch(() => {}),
        loadImage(PA1_BASE + 'Items/Checkpoints/Checkpoint/Checkpoint (No Flag).png')
            .then(img => { cp.noFlag = img; }).catch(() => {}),
        loadImage(PA1_BASE + 'Items/Checkpoints/Checkpoint/Checkpoint (Flag Idle)(64x64).png')
            .then(img => { cp.flagIdle = img; }).catch(() => {}),
        loadImage(PA1_BASE + 'Items/Checkpoints/Checkpoint/Checkpoint (Flag Out) (64x64).png')
            .then(img => { cp.flagOut = img; }).catch(() => {})
    );
    assets.checkpoints = cp;
    return p;
}

function loadCharacters() {
    const p = [];
    CHAR_NAMES.forEach(name => {
        const anims = {};
        const base = PA1_BASE + 'Main Characters/' + name + '/';
        const files = [
            ['idle', 'Idle (32x32).png'],
            ['run', 'Run (32x32).png'],
            ['jump', 'Jump (32x32).png'],
            ['fall', 'Fall (32x32).png'],
            ['doubleJump', 'Double Jump (32x32).png'],
            ['wallJump', 'Wall Jump (32x32).png'],
            ['hit', 'Hit (32x32).png']
        ];
        files.forEach(([key, file]) => {
            p.push(
                loadImage(base + file)
                    .then(img => { anims[key] = img; })
                    .catch(() => {})
            );
        });
        assets.characters[name.toLowerCase().replace(/\s+/g, '_')] = anims;
    });
    return p;
}

function loadSpawnFx() {
    const p = [];
    p.push(
        loadImage(PA1_BASE + 'Main Characters/Appearing (96x96).png')
            .then(img => { assets.spawnFx.appear = img; }).catch(() => {}),
        loadImage(PA1_BASE + 'Main Characters/Desappearing (96x96).png')
            .then(img => { assets.spawnFx.disappear = img; }).catch(() => {})
    );
    return p;
}

function loadTerrain() {
    return loadImage(PA1_BASE + 'Terrain/Terrain (16x16).png')
        .then(img => { assets.terrain = img; })
        .catch(() => {});
}

function loadTraps() {
    const p = [];
    const t = {};

    const spikeBase = PA1_BASE + 'Traps/Spikes/';
    p.push(loadImage(spikeBase + 'Idle.png').then(img => { t.spikes = img; }).catch(() => {}));

    const fireBase = PA1_BASE + 'Traps/Fire/';
    p.push(loadImage(fireBase + 'On (16x32).png').then(img => { t.fire_on = img; }).catch(() => {}));
    p.push(loadImage(fireBase + 'Off.png').then(img => { t.fire_off = img; }).catch(() => {}));
    p.push(loadImage(fireBase + 'Hit (16x32).png').then(img => { t.fire_hit = img; }).catch(() => {}));

    const sawBase = PA1_BASE + 'Traps/Saw/';
    p.push(loadImage(sawBase + 'On (38x38).png').then(img => { t.saw_on = img; }).catch(() => {}));
    p.push(loadImage(sawBase + 'Off.png').then(img => { t.saw_off = img; }).catch(() => {}));
    p.push(loadImage(sawBase + 'Chain.png').then(img => { t.chain = img; }).catch(() => {}));

    const arrowBase = PA1_BASE + 'Traps/Arrow/';
    p.push(loadImage(arrowBase + 'Idle (18x18).png').then(img => { t.arrow_idle = img; }).catch(() => {}));
    p.push(loadImage(arrowBase + 'Hit (18x18).png').then(img => { t.arrow_hit = img; }).catch(() => {}));

    const fpBase = PA1_BASE + 'Traps/Falling Platforms/';
    p.push(loadImage(fpBase + 'On (32x10).png').then(img => { t.falling_on = img; }).catch(() => {}));
    p.push(loadImage(fpBase + 'Off.png').then(img => { t.falling_off = img; }).catch(() => {}));

    const fanBase = PA1_BASE + 'Traps/Fan/';
    p.push(loadImage(fanBase + 'On (24x8).png').then(img => { t.fan_on = img; }).catch(() => {}));
    p.push(loadImage(fanBase + 'Off.png').then(img => { t.fan_off = img; }).catch(() => {}));

    const sbBase = PA1_BASE + 'Traps/Spiked Ball/';
    p.push(loadImage(sbBase + 'Spiked Ball.png').then(img => { t.spikedBall = img; }).catch(() => {}));
    p.push(loadImage(sbBase + 'Chain.png').then(img => { t.sbChain = img; }).catch(() => {}));

    const rhBase = PA1_BASE + 'Traps/Rock Head/';
    p.push(loadImage(rhBase + 'Idle.png').then(img => { t.rockhead_idle = img; }).catch(() => {}));
    p.push(loadImage(rhBase + 'Blink (42x42).png').then(img => { t.rockhead_blink = img; }).catch(() => {}));
    p.push(loadImage(rhBase + 'Bottom Hit (42x42).png').then(img => { t.rockhead_bottom = img; }).catch(() => {}));
    p.push(loadImage(rhBase + 'Left Hit (42x42).png').then(img => { t.rockhead_left = img; }).catch(() => {}));
    p.push(loadImage(rhBase + 'Right Hit (42x42).png').then(img => { t.rockhead_right = img; }).catch(() => {}));
    p.push(loadImage(rhBase + 'Top Hit (42x42).png').then(img => { t.rockhead_top = img; }).catch(() => {}));

    const shBase = PA1_BASE + 'Traps/Spike Head/';
    p.push(loadImage(shBase + 'Idle.png').then(img => { t.spikehead_idle = img; }).catch(() => {}));
    p.push(loadImage(shBase + 'Blink (54x52).png').then(img => { t.spikehead_blink = img; }).catch(() => {}));
    p.push(loadImage(shBase + 'Bottom Hit (54x52).png').then(img => { t.spikehead_bottom = img; }).catch(() => {}));
    p.push(loadImage(shBase + 'Left Hit (54x52).png').then(img => { t.spikehead_left = img; }).catch(() => {}));
    p.push(loadImage(shBase + 'Right Hit (54x52).png').then(img => { t.spikehead_right = img; }).catch(() => {}));
    p.push(loadImage(shBase + 'Top Hit (54x52).png').then(img => { t.spikehead_top = img; }).catch(() => {}));

    const blockBase = PA1_BASE + 'Traps/Blocks/';
    p.push(loadImage(blockBase + 'Idle.png').then(img => { t.block_idle = img; }).catch(() => {}));
    p.push(loadImage(blockBase + 'HitTop (22x22).png').then(img => { t.block_hittop = img; }).catch(() => {}));
    p.push(loadImage(blockBase + 'HitSide (22x22).png').then(img => { t.block_hitside = img; }).catch(() => {}));

    const platBase = PA1_BASE + 'Traps/Platforms/';
    p.push(loadImage(platBase + 'Brown On (32x8).png').then(img => { t.platBrownOn = img; }).catch(() => {}));
    p.push(loadImage(platBase + 'Brown Off.png').then(img => { t.platBrownOff = img; }).catch(() => {}));
    p.push(loadImage(platBase + 'Grey On (32x8).png').then(img => { t.platGreyOn = img; }).catch(() => {}));
    p.push(loadImage(platBase + 'Grey Off.png').then(img => { t.platGreyOff = img; }).catch(() => {}));
    p.push(loadImage(platBase + 'Chain.png').then(img => { t.platChain = img; }).catch(() => {}));

    const smiBase = PA1_BASE + 'Traps/Sand Mud Ice/';
    p.push(loadImage(smiBase + 'Sand Mud Ice (16x6).png').then(img => { t.sandmudice = img; }).catch(() => {}));

    const trampBase = PA1_BASE + 'Traps/Trampoline/';
    p.push(loadImage(trampBase + 'Idle.png').then(img => { t.trampoline_idle = img; }).catch(() => {}));
    p.push(loadImage(trampBase + 'Jump (28x28).png').then(img => { t.trampoline_jump = img; }).catch(() => {}));

    assets.traps = t;
    return p;
}

function loadMenu() {
    const p = [];
    const btnNames = ['Play', 'Restart', 'Settings', 'Volume', 'Next', 'Previous', 'Levels', 'Achievements', 'Leaderboard', 'Back', 'Close'];
    btnNames.forEach(name => {
        p.push(loadImage(PA1_BASE + 'Menu/Buttons/' + name + '.png')
            .then(img => { assets.menu.buttons[name.toLowerCase()] = img; })
            .catch(() => {}));
    });
    for (let i = 1; i <= 50; i++) {
        const n = i < 10 ? '0' + i : '' + i;
        p.push(loadImage(PA1_BASE + 'Menu/Levels/' + n + '.png')
            .then(img => { assets.menu.levels[i] = img; })
            .catch(() => {}));
    }
    ['Black', 'White'].forEach(c => {
        p.push(loadImage(PA1_BASE + 'Menu/Text/Text (' + c + ') (8x10).png')
            .then(img => { assets.menu.text[c.toLowerCase()] = img; })
            .catch(() => {}));
    });
    return p;
}

function loadOther() {
    const p = [];
    const base = PA1_BASE + 'Other/';
    ['Shadow.png', 'Transition.png', 'Confetti (16x16).png', 'Dust Particle.png'].forEach((f, i) => {
        const keys = ['shadow', 'transition', 'confetti', 'dust'];
        p.push(loadImage(base + f).then(img => { assets.other[keys[i]] = img; }).catch(() => {}));
    });
    return p;
}

export function getBg(color) { return assets.backgrounds[color] || null; }
export function getBgColors() { return Object.keys(assets.backgrounds); }
export function getFruit(name) { return assets.fruits[name] || null; }
export function getFruitNames() { return Object.keys(assets.fruits).filter(n => n !== 'collected'); }
export function getFruitCollected() { return assets.fruitCollected; }
export function getBox(id) { return assets.boxes[id] || null; }
export function getCheckpoint() { return assets.checkpoints; }
export function getCharacter(id) { return assets.characters[id] || null; }
export function getCharacterIds() { return Object.keys(assets.characters); }
export function getSpawnFx() { return assets.spawnFx; }
export function getTerrainSheet() { return assets.terrain; }
export function getTrap(key) { return assets.traps[key] || null; }
export function getTraps() { return assets.traps; }
export function getMenuButton(name) { return assets.menu.buttons[name] || null; }
export function getMenuLevel(num) { return assets.menu.levels[num] || null; }
export function getMenuText(color) { return assets.menu.text[color] || assets.menu.text['white'] || null; }
export function getOther(key) { return assets.other[key] || null; }

export function drawStripFrame(ctx, sheet, frame, frameW, frameH, x, y, destW, destH, flipH) {
    if (!sheet) return;
    ctx.imageSmoothingEnabled = false;
    if (flipH) {
        ctx.save();
        ctx.translate(Math.round(x + destW), Math.round(y));
        ctx.scale(-1, 1);
        ctx.drawImage(sheet, frame * frameW, 0, frameW, frameH, 0, 0, destW, destH);
        ctx.restore();
    } else {
        ctx.drawImage(sheet, frame * frameW, 0, frameW, frameH, Math.round(x), Math.round(y), destW, destH);
    }
}

export function drawGridTile(ctx, sheet, col, row, srcW, srcH, x, y, destW, destH) {
    if (!sheet) return;
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(sheet, col * srcW, row * srcH, srcW, srcH, Math.round(x), Math.round(y), destW, destH);
}

export function getStripFrameCount(sheet, frameW) {
    if (!sheet) return 0;
    return Math.floor(sheet.width / frameW);
}
