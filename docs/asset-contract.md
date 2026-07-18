# Asset Contract

## Purpose

This document defines the art handoff required for the first visual vertical slice. Assets that follow this contract can be loaded and positioned predictably in Excalibur.

## Source Of Truth

The game consumes final browser-ready assets. Source files, generation prompts, and editable project files remain outside the browser bundle.

Use PNG for transparent final assets first. WebP may be added after image quality and browser behavior are reviewed.

## Current Version 1 Asset Map

| Runtime key              | Current file                | Purpose                        |
| ------------------------ | --------------------------- | ------------------------------ |
| `arena`                  | `background(dungeon).png`   | Fixed opaque arena background  |
| `playerIdle`             | `mage idle left_no_bg.png`  | Purple player resting pose     |
| `playerCast`             | `mage wand cast_no_bg.png`  | Purple player medium-cast pose |
| `playerMediumProjectile` | `Mage medium att_no_bg.png` | Left-to-right purple spell     |
| `enemyIdle`              | `enemy idle_no_bg.png`      | Red enemy resting pose         |

All character and spell files in the current map are 32-bit RGBA PNGs. The arena background is 24-bit RGB because it fills the whole canvas.

## Required Assets

### Future Character Assets

| Asset key              | Required for slice | Notes                                      |
| ---------------------- | ------------------ | ------------------------------------------ |
| `player-idle-battle`   | Yes                | Normal battle-view player pose             |
| `player-defend-battle` | Yes                | Shielding pose or compatible idle fallback |
| `enemy-idle-battle`    | Yes                | Normal battle-view enemy pose              |
| `enemy-cast-battle`    | Yes                | Casting pose or compatible idle fallback   |

The first slice does not require full frame animations. One still pose per named state is enough because engine-driven scale, glow, particles, and camera motion provide the initial movement.

### Future Spell Assets

| Asset key                | Required for slice | Notes                                  |
| ------------------------ | ------------------ | -------------------------------------- |
| `spell-projectile-core`  | Yes                | Transparent core graphic               |
| `spell-projectile-trail` | Yes                | Transparent streak or particle texture |
| `spell-cast-glow`        | Yes                | Radial or hand-positioned glow         |
| `spell-ground-glow`      | Yes                | Transparent ground light overlay       |
| `shield-ward`            | Yes                | Player defense ring or ward            |
| `impact-flash`           | Yes                | Short white or spell-color burst       |
| `impact-particle`        | Preferred          | Spark, dust, or debris texture         |
| `shield-crack`           | Optional           | Temporary impact overlay               |
| `scorch-mark`            | Optional           | Fading post-impact ground decal        |

### Future Environment Assets

| Layer key         | Required for slice | Notes                                       |
| ----------------- | ------------------ | ------------------------------------------- |
| `sky`             | Yes                | Furthest visual layer                       |
| `distant-ruins`   | Yes                | Horizon depth layer                         |
| `arena`           | Yes                | Main combat floor or platform               |
| `foreground`      | Yes                | Near rocks, foliage, or debris for parallax |
| `fog`             | Preferred          | Semi-transparent atmospheric layer          |
| `debris-particle` | Optional           | Foreground motion during impact             |

## Composition Rules

### Characters

- Render both mages from a matching three-quarter perspective.
- Use a consistent facing direction: player faces toward enemy, enemy faces toward player.
- Keep the visual feet on a shared baseline within each pose canvas.
- Keep the silhouette readable against the intended arena color palette.
- Leave enough transparent margin for casting effects without clipping.
- Do not bake screen-space HUD, health bars, or spell trails into character art.

### Environment

- The arena must contain a clear floor plane where both mage anchors can sit.
- The image perspective must match the mage perspective.
- The foreground layer must have transparency so it can partially cross the scene without covering the full arena.
- Distant layers should contain fewer sharp details and lower contrast than the arena.
- The sky should tolerate small parallax movement without exposing empty edges.

## Anchor Metadata

Every character should eventually expose named local anchor coordinates, expressed relative to the final asset canvas:

```text
feetAnchor
castAnchor
shieldAnchor
```

The implementation does not use an image center as a hand or feet anchor. Version 1 keeps its scene-level cast and hit coordinates in `BattleScene.ts`; a manifest is the next maintainable step once more moves share the same anchors.

Example manifest shape:

```json
{
	"enemy-cast-battle": {
		"feetAnchor": { "x": "pending", "y": "pending" },
		"castAnchor": { "x": "pending", "y": "pending" }
	}
}
```

Do not add more hardcoded anchors after Version 1. Move shared anchor data into a manifest when a second attack or enemy move is implemented.

## Naming And Export Rules

- Use lowercase kebab-case keys.
- Keep related assets in the same family prefix: `player-`, `enemy-`, `spell-`, `shield-`, `impact-`, `arena-`.
- Export transparent files as RGBA.
- Avoid large transparent margins that vary unpredictably between related character poses.
- Keep final generated files immutable during runtime. The game never writes asset files.
- Version replacements by file revision or manifest update, not by changing an asset's semantic key.

## Future Asset Expansion

Add only after the first slice is approved:

- Additional player and enemy poses.
- Separate attack and defense camera-angle assets.
- Sprite-sheet frames.
- Animated Aseprite exports.
- Additional spell schools and shield variants.
- Multiple arena themes.
- Tiled map assets.

## Validation Checklist

- Character images have matching perspective and scale.
- Character feet anchors sit on the arena floor plane.
- Casting hands do not point away from the enemy.
- Spell core and trail share a compatible visual palette.
- Shield is visible against both the arena and impact flash.
- Foreground layer creates depth without hiding critical combat action.
- Assets are readable at the final logical canvas size.
