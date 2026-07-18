# JavaScript Game Library Research

## Scope

The target is a browser-based, mage-only, turn-based combat demo embedded in SvelteKit. It needs a 2D canvas, sprite animations, effects, input timing, scene lifecycle, asset loading, and a clean boundary for Magic, ZeroDev, and Arbitrum calls.

The game does not currently need 3D rendering, multiplayer synchronization, large-world streaming, or per-frame blockchain operations.

## Summary

Phaser is the best fit for the current project. The attached Session Zero guide already specifies Phaser 3, and Phaser provides the 2D game features required by the demo without requiring a second engine layer.

## Comparison

| Library | Category | Strength | Cost for this project | Assessment |
| --- | --- | --- | --- | --- |
| Phaser 3 | Full 2D game framework | Scenes, animation, input, cameras, particles, tilemaps, Canvas/WebGL | Low | Recommended |
| Excalibur.js | TypeScript-first 2D engine | Strong typed API, actors, scenes, events, physics | Moderate migration cost | Strong alternative |
| PixiJS | 2D rendering engine | Fast sprites, filters, scene graph, WebGL/WebGPU | Must add game lifecycle, physics, scene rules, and many systems | Not preferred |
| KAPLAY | Lightweight 2D game library | Fast prototyping and simple component-style game objects | Smaller ecosystem and different architecture from the guide | Good prototype alternative |
| melonJS | Full 2D/2.5D engine | Tiled maps, cameras, physics, WebGL/Canvas fallback | Replaces the existing Phaser plan | Viable but unnecessary |
| Three.js | 3D rendering library | 3D scenes, cameras, materials, loaders, post-processing | Requires building most game systems; wrong visual target | Not preferred |
| PlayCanvas | Browser-first 3D engine and editor | 3D scene authoring, asset management, physics, publishing | Substantially larger 3D pipeline | Only for a deliberate 3D pivot |
| GDevelop | Visual 2D/3D engine | Fast editor workflow, behaviors, templates, JavaScript extensions | Splits the game workflow from the SvelteKit application | Not preferred for this integration |

## Phaser 3

Phaser is a 2D framework written for browser development. It supports JavaScript and TypeScript, Canvas and WebGL rendering, scenes, texture atlases, frame-based animations, input, cameras, particles, and tilemaps.

### Version note

The supplied guide explicitly says Phaser 3, while current Phaser materials also advertise Phaser 4. Do not mix Phaser 3 and Phaser 4 examples or package assumptions. Before implementation, pin the selected major version and use its matching Svelte or SvelteKit template, API documentation, and asset conventions. Staying on Phaser 3 is the lower-risk choice for following the supplied guide; upgrading to Phaser 4 should be a deliberate decision rather than an accidental dependency update.

Why it fits:

- It is already specified by `session_zero_tools_guide.pdf`.
- The combat arena is a 2D scene, not a 3D world.
- Sprite-based mage poses map directly to Phaser animations.
- Spell effects can use sprites, particles, tweens, and shaders without introducing another renderer.
- Phaser can mount inside a Svelte route while Svelte owns the surrounding UI.
- SvelteKit can keep wallet buttons, session approval, reports, and navigation outside the canvas.

Recommended Phaser boundary:

- SvelteKit creates and destroys the Phaser game instance.
- Phaser owns the canvas, combat state, sprites, effects, timing, and input.
- A small typed event interface communicates between Phaser and Svelte.
- Web3 modules expose commands such as `startMatch`, `buyPotion`, and `completeMatch`.
- Phaser does not import Magic or ZeroDev directly.

Sources:

- [What is Phaser?](https://docs.phaser.io/phaser/getting-started/what-is-phaser) - Phaser's 2D focus and JavaScript/TypeScript runtime.
- [Phaser animations](https://docs.phaser.io/phaser/concepts/animations) - Frame-based sprite and texture-atlas animation.
- [Phaser scenes](https://docs.phaser.io/api-documentation/class/scene) - Scene lifecycle and access to input, textures, time, tweens, and animation managers.
- [Phaser tilemaps](https://docs.phaser.io/api-documentation/function/tilemaps) - Tiled JSON, CSV, and array-backed map loading.
- [Official Phaser Svelte template](https://phaser.io/news/2024/03/official-phaser-3-and-svelte-template) - Svelte, TypeScript, Vite, hot reload, and event-bus integration.

## Excalibur.js

Excalibur is a TypeScript-first 2D engine for the web. It has actors, scenes, animation, physics, events, and a typed development model.

Why it is attractive:

- Strong TypeScript support.
- A more opinionated actor and event model than a low-level renderer.
- Could represent the mage, enemy, projectiles, and shield effects cleanly.

Why it is not the default:

- The provided guide and existing research already target Phaser.
- Switching engines would require replacing the planned Phaser scene and asset integration.
- The project has no current Excalibur implementation to justify migration risk.

Use Excalibur only if the team prefers its TypeScript actor model before any Phaser code is written.

Source: [Excalibur.js](https://excaliburjs.com)

## PixiJS

PixiJS is primarily a high-performance 2D rendering engine, not a complete game framework. It is excellent for drawing sprites, containers, filters, and interactive visual content, but the project would need to supply more of the game architecture itself.

Additional systems would be needed for:

- Scene lifecycle.
- Combat state transitions.
- Fixed update or timing rules.
- Input abstractions.
- Audio management.
- Tilemap and level workflow.
- Collision and physics if later required.
- Game-specific asset conventions.

PixiJS is a good choice for a custom visual engine or a UI-heavy interactive scene. It is not the minimal choice for this game because Phaser already includes the missing game-layer systems.

Sources:

- [PixiJS introduction](https://pixijs.com/8.x/guides/getting-started/intro) - 2D rendering engine capabilities.
- [PixiJS FAQ](https://pixijs.com/7.x/faq) - Explicit distinction between PixiJS and a full game engine.
- [PixiJS asset tooling](https://pixijs.com/blog/pixi-universe) - AssetPack and scene tooling.

## KAPLAY and Kaboom.js

Kaboom.js is no longer maintained. KAPLAY is the current JavaScript/TypeScript project in that family and provides a fun-first 2D game library with simple component-style game objects and a web editor.

KAPLAY could make a small combat prototype quickly. The tradeoff is that the project would be departing from the supplied Phaser guide, and the team would need to verify its SvelteKit mounting, asset conventions, and Web3 boundary independently.

Source: [KAPLAY](https://github.com/kaplayjs/kaplay)

## melonJS

melonJS is a lightweight JavaScript and TypeScript 2D/2.5D engine with WebGL and Canvas fallback, Tiled support, cameras, physics, and plugin support. It is technically suitable for an arena game.

The reason not to select it is not capability. It is that the project already has a Phaser-oriented guide and provider plan. A new engine would create migration work without solving a current problem.

Source: [melonJS](https://melonjs.org)

## Three.js and PlayCanvas

Three.js is a 3D rendering library. PlayCanvas is a browser-first 3D engine with an editor and runtime. Both are valid if the project changes from 2.5D mage poses to a real 3D game.

That change would add:

- 3D models and materials.
- Camera and lighting design.
- Rigging and skeletal animation.
- 3D asset export and compression.
- More complex performance testing.
- A larger art and environment pipeline.

Neither is justified for the current pitch, which explicitly uses transparent 2.5D character poses and a fixed combat view.

Sources:

- [Three.js manual](https://threejs.org/manual) - 3D scene, animation, camera, material, loader, and optimization concepts.
- [PlayCanvas standalone engine](https://developer.playcanvas.com/user-manual/engine/standalone) - JavaScript and TypeScript browser engine setup.

## GDevelop

GDevelop offers a visual event system, reusable behaviors, templates, web export, and JavaScript extensions. It can reduce the amount of low-level game code for a prototype.

The integration cost is architectural:

- The game would be authored in GDevelop while the application shell remains SvelteKit.
- Wallet and session state would need a custom bridge into the exported game.
- The team would have two development models to debug.
- Phaser-specific source guidance would no longer apply.

GDevelop is a reasonable option for a team prioritizing visual authoring over a unified TypeScript codebase. It is not the best fit for this repository's existing architecture.

Source: [GDevelop](https://gdevelop.io)

## Decision

Keep Phaser as the default. Consider Excalibur only before implementation begins if a TypeScript-first actor model is more valuable than staying aligned with the supplied guide. Do not switch to PixiJS unless the team is intentionally building the game framework layer. Do not use Three.js or PlayCanvas unless the visual target becomes genuinely 3D.
