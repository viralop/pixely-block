# Pixely Block — Agent Instructions

## Dev Server

```bash
node server.js          # starts on http://localhost:8080
```

- No `package.json`, no npm, no build step
- `server.js` handles static files + `PUT /save-level/level-*.js` for editor saves
- Routes `/` to `index.html`
- `Cache-Control: no-cache` on all responses (uses `decodeURIComponent` for paths with spaces)

## Entry Points

- **Game**: `index.html` → `js/main.js` → `js/engine.js` (Game class)
- **Editor**: `editor.html` — single-file SPA, all JS inline (~1187 lines), no ES modules

## Tile System

| Constant | Value |
|---|---|
| TILE_SIZE | 18px (source) |
| SCALE | 3x |
| RENDER_TILE | 54px (18×3) |
| CHAR_SIZE | 24px |
| RENDER_CHAR | 72px (24×3) |
| Spacing | 1px between tiles in spritesheets |

### GID Ranges

| Tileset | gid0 | Cols | Count | Source Size |
|---|---|---|---|---|
| Base | 28 | 20 | 180 | 18px |
| Farm | 1000 | 16 | 112 | 18px |
| Food | 2000 | 16 | 112 | 18px |
| Industrial | 3000 | 16 | 112 | 18px |
| PA1 Terrain | 4000 | 22 | 242 | 16px (no spacing) |

Source rect: `index = id - gid0`, `sx = (index % cols) * (srcSize + spacing)`, `sy = floor(index / cols) * (srcSize + spacing)`

### Key Tile Categories

- **Solid**: 33,49-53,60,76,78,80,96,100,109-111,135,136,139,140,169-171,179-183
- **PA1 Terrain Solid**: 4000-4013, 4020-4033, 4040-4053
- **Hazard**: 96 (spikes)
- **Coins**: 179,180 (animated via `coinAnimId`)
- **Fruits**: 5001-5008 (apple, bananas, cherries, kiwi, melon, orange, pineapple, strawberry)
- **Item Boxes**: 5020-5022 (Box1), 5030-5032 (Box2), 5040-5042 (Box3)
- **PA1 Checkpoints**: 5050
- **Traps**: 4100-4102 (fire), 4103 (fire off), 4110-4111 (saw), 4120-4121 (trampoline)
- **Key**: 55, **Lock**: 56
- **Exit**: 178
- **Springs**: 135,136
- **Ladders**: 79,99 | **Ropes**: 97,117,118-120,137 | **Hooks**: 3039,3040
- **Checkpoints**: 139,140
- **Moving platform tiles**: 181,182,183
- **Conveyor**: 3100-3102 (push player backward)

## PA1 Asset System

Two new modules handle Pixel Adventure 1 assets:

- `js/pa1-assets.js` — Loads all PA1 PNGs (backgrounds, fruits, boxes, checkpoints, characters, traps, terrain, menu, other). Access via getters: `getFruit()`, `getCharacter()`, etc.
- `js/pa1-sprites.js` — Animated rendering functions: `drawFruit()`, `drawBox()`, `drawCheckpoint()`, `drawTrapFire()`, `drawBackground()`, etc.

### Character System

4 selectable characters: Mask Dude, Ninja Frog, Pink Man, Virtual Guy
- Selected via `CHAR_SELECT` game state (new menu item)
- Stored in `localStorage` as `pa1_char`
- Each character has: idle (11f), run (12f), jump (1f), fall (1f), doubleJump (6f), wallJump (5f), hit (7f)
- Frame size: 32x32px, rendered at RENDER_CHAR (72px)
- OLD sword/combat system preserved — only visuals replaced

### Background System

- 7 background colors: blue, brown, gray, green, pink, purple, yellow (64x64 tileable)
- Level data now supports `bgImage` field (color name string)
- Falls back to old parallax system if `bgImage` is null/empty
- Editor has BG Image dropdown selector

## Level Files

Location: `js/levels/level-N.js` (ES modules, N=1..30)

```js
export default {
  name, w, h, bgColor, bgImage, theme,
  spawn: { tx, ty },        // player start
  exit: { tx, ty },          // auto-placed as tile 178
  map: [],                   // [row][col] of tile IDs
  solidMap: [],              // [row][col] boolean (overrides built-in solid check)
  entities: [{ type, tx, ty, patrolL, patrolR }],
  platforms: [{ tx, ty, moveX, moveY, tiles: [{ tx, ty, id }] }],
};
```

- `levels.js` dynamically imports all level-N.js files
- `_buildLevel()` in levels.js passes through `bgImage` field
- Editor saves via File System Access API or PUT to server

## Game Architecture

- **Canvas**: 864×540, `imageSmoothingEnabled = false`
- **Fixed timestep**: 1000/60ms accumulator loop
- **States**: LOADING, INTRO, MENU, CHAR_SELECT, OPTIONS, PLAYING, PAUSED, BOSS_INTRO, LEVEL_COMPLETE, GAME_OVER, VICTORY, QUEEN_RESCUED
- **`input.update()`** called once per frame in `_loop()`, NOT inside the fixed-step while loop
- Boss levels: `(levelIdx + 1) % 5 === 0` → boss type = `Math.floor(idx / 5) % 3`
- Lives: start 3, max 9, extra life every 5000 score via `_addScore()` (not raw `this.score +=`)

## Editor Modes

Build (solid) / Paint (deco) / Erase / Entity / Action (start/end) / Platform

- Platform mode: click any tile + drag to set movement path; original tiles removed from map
- `solidMap` = collision, `paintMap` = decoration overlay; Erase clears both
- Test Level button saves to `localStorage`, opens `index.html?test=1`
- `loadFolderLevels()` uses `encodeURIComponent(src)` for unicode-safe dynamic import
- PA1 Terrain tileset (GID 4000+) available in palette
- Background image selector in sidebar

## Gotchas

- New tile categories must be added to BOTH `editor.html` SOLID_TILES and `js/collision.js`
- PA1 tile IDs (4000+, 5000+) are handled separately from the tile-based rendering in `_renderWorld()`
- Animated tiles (coins, checkpoints, water) override ID in `_renderWorld()` render loop
- Fruits use animation timer from `pa1-sprites.js`, not the old `coinAnimId` system
- Item boxes have multi-state animation (idle→hit→break→destroy) tracked in `boxStates` map
- `_buildLevel()` in `levels.js` must explicitly include any new fields or they get stripped
- `_menuHeld` / `_escHeld` guards prevent key repeat from OS on state transitions
- Extra sprites (knight, bosses, sword) loaded via `loadExtraSprites()` in renderer.js, accessed via `drawExtra()`/`hasExtra()`
- PA1 assets loaded via `loadPA1Assets()` (dynamic import of `pa1-assets.js`) called in `start()`
- Character selection stored in localStorage key `pa1_char`, passed to `Player` constructor
- Sword: `tile_01066.png`, base rotation 270° (PI*1.5), swing arc with `scale(-1,1)` for left facing
- Boss defs: Dark Orc (throw), Shadow Knight (charge), Demon Lord (radial burst); phase 2 at 50% HP
