# Game Assets And Environment Research

## Target Scope

The attached build guide deliberately chooses a mage-only combat game with 2.5D transparent character poses. This is an asset-scope decision: it gives the game readable characters and effects without requiring a full 3D character-production pipeline.

## Character Production

The first demo needs two actors:

- Player mage.
- Enemy mage or creature.

Each actor needs five visual states:

- `idle`
- `cast`
- `hit`
- `defend`
- `victory` or `defeated`

This is ten primary poses before effects, UI portraits, or alternate skins. Each pose should use the same canvas dimensions, baseline, scale, facing direction, and anchor point. Consistency matters more than the number of frames.

## Asset Options

| Option                                    | Output                              | Complexity                                 | Recommendation                                  |
| ----------------------------------------- | ----------------------------------- | ------------------------------------------ | ----------------------------------------------- |
| Authored transparent illustrations        | PNG/WebP poses                      | Low                                        | Recommended for the demo                        |
| Generated concept art plus manual cleanup | PNG/WebP poses                      | Low to moderate                            | Good if visual consistency is maintained        |
| 2D skeletal animation                     | Rig plus mesh or sprite attachments | Moderate to high                           | Defer until more motion is needed               |
| Blender-rendered 3D poses                 | Rendered transparent PNGs           | High                                       | Useful only if a 3D art pipeline already exists |
| Runtime procedural characters             | Vector or generated shapes          | Moderate engineering, weak visual identity | Use only for placeholders                       |

The recommended output is a small set of transparent raster images. The game does not need a character creator, runtime mesh deformation, or a 3D rig for the pitch.

## Asset Preparation

The asset preparation pipeline should:

1. Store original source files outside the browser bundle.
2. Convert final images to RGBA.
3. Normalize the image dimensions.
4. Remove inconsistent transparent margins.
5. Preserve a shared feet or body anchor.
6. Export PNG first for predictable browser transparency.
7. Optionally produce WebP after browser testing.
8. Pack poses into texture atlases or sprite sheets.
9. Generate a manifest that names each animation and its frames.
10. Validate that no required frame is missing.

Python with Pillow can perform these steps, but Node.js tooling can perform them as well. Python is an optional content tool, not a runtime dependency.

Possible tooling layout:

```text
tools/
  assets/
    source/
    generated/
    validate_assets.py
    build_spritesheets.py
    manifest.json
```

## Phaser Animation Model

Phaser uses frame-based animations. A sprite sheet or texture atlas contains frames, and an animation names a sequence of those frames with a frame rate and repeat policy.

The game should define animations by state rather than by blockchain event:

```text
combat state -> animation
idle         -> idle
casting      -> cast
taking hit   -> hit
blocking     -> defend
match won    -> victory
match lost   -> defeated
```

Spell effects should be separate assets. The character does not need a unique full animation for every spell. Reusable particles and projectile sprites can be placed at the cast point and target point.

## Environment Design

### Recommended first environment

Use a single fixed combat arena composed of:

- Background illustration.
- Floor or platform layer.
- Player spawn point.
- Enemy spawn point.
- Character shadows.
- Effect layer.
- Optional foreground vignette.

Phaser can render this as ordinary images and containers. A tilemap is not required because the current battle has no navigation, walls, rooms, or collision-heavy movement.

### When to use Tiled

Use Tiled and Phaser Tilemaps only when the environment requires reusable maps, collision shapes, object markers, multiple layers, or designer-authored geometry. Tiled exports JSON that is convenient to load in browser JavaScript, and Phaser supports Tiled JSON maps and object layers.

Tiled adds a useful content workflow but also adds:

- Tile size and tileset conventions.
- Map export compatibility.
- Layer ordering.
- Collision-object handling.
- Camera and map coordinate rules.
- Additional asset versioning.

For one fixed combat scene, these costs are not justified yet.

## Environment Options

| Environment approach                            | Complexity      | Best use                       |
| ----------------------------------------------- | --------------- | ------------------------------ |
| One background image and fixed spawn points     | Low             | Pitch demo                     |
| Layered background images and Phaser containers | Low to moderate | Parallax and visual depth      |
| Tiled JSON map                                  | Moderate        | Reusable arenas and collision  |
| Procedural environment generation               | High            | Many maps or repeatable worlds |
| 3D Blender or PlayCanvas environment            | Very high       | Deliberate 3D game direction   |

## Game Chassis Complexity

### Low complexity

- One Phaser scene.
- Two actors.
- Fixed positions.
- No pathfinding.
- No collision system beyond timed combat windows.
- Five pose states per actor.
- Reusable spell and shield effects.

### Moderate complexity

- Multiple arenas.
- Tiled maps.
- Collision objects.
- Camera movement.
- More enemy types.
- Asset streaming or lazy loading.
- Reusable actor classes and content manifests.

### High complexity

- 3D models or skeletal rigs.
- Procedural world generation.
- Networked multiplayer.
- Server-authoritative simulation.
- Replays that must exactly reproduce combat.
- Onchain recording of every combat action.

The pitch only requires the low-complexity chassis with a moderate-quality presentation layer.

## Separation Of Responsibilities

- SvelteKit owns routes, wallet UI, session approval, reports, and application state.
- Phaser owns combat rendering, input timing, effects, and local battle state.
- Asset tooling owns image normalization and packaging.
- Contracts own match start, consumables, settlement, reward recording, and action digest storage.
- ZeroDev owns smart-account execution and scoped permissions.

Do not let character rendering or combat animation call the blockchain directly. Instead, emit an application event such as `potionRequested` and let the Web3 adapter submit the authorized operation.

## Sources

- [Phaser animations](https://docs.phaser.io/phaser/concepts/animations) - Sprite sheets, texture atlases, frame sequences, and animation managers.
- [Phaser tilemaps](https://docs.phaser.io/api-documentation/function/tilemaps) - Tilemap formats and map creation.
- [Phaser Tiled object parsing](https://docs.phaser.io/api-documentation/namespace/tilemaps-parsers-tiled) - Object-layer parsing from Tiled JSON.
- [Tiled introduction](https://doc.mapeditor.org/manual/introduction) - Map and tileset workflow.
- [Tiled JSON format](https://doc.mapeditor.org/en/stable/reference/json-map-format) - JSON map structure and object properties.
- [Pillow image concepts](https://pillow.readthedocs.io/en/stable/handbook/concepts.html) - RGBA bands and transparency.
- [Pillow image file formats](https://pillow.readthedocs.io/en/stable/handbook/image-file-formats.html) - PNG transparency and output behavior.
