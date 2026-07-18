# Game Implementation Docs

This directory is the implementation source of truth for the game. It defines the code boundaries, visual slice, assets, and first gameplay iteration. Research documents explain why tools were chosen; these documents explain how the selected Excalibur.js implementation is built.

## Documents

- [Engine architecture](engine-architecture.md) - TypeScript module boundaries, Excalibur ownership, SvelteKit ownership, and future Web3 boundary.
- [2.5D presentation](two-point-five-d-presentation.md) - Layering, parallax, camera framing, lighting, and depth techniques.
- [Visual vertical slice](visual-vertical-slice.md) - First local runnable scene and acceptance criteria.
- [Asset contract](asset-contract.md) - Required source assets, naming, anchors, layers, and export rules.
- [Gameplay iteration one](gameplay-iteration-one.md) - Confirmed scope, deferred systems, and details required before implementation.

## Decisions

- Excalibur.js is the browser game engine.
- SvelteKit owns the page shell and HTML UI above the canvas.
- Excalibur owns the canvas, actors, camera, local scene state, visual effects, and input passed into the scene.
- The first runnable version is a visual vertical slice, not the full combat game.
- The first scene is 2.5D presentation only. It does not use runtime 3D meshes or a real 3D camera.
- Version 1 stages the purple mage in the left foreground and the red mage in the right background.
- `ArrowRight` plays the player medium attack and displays 25 damage. Other arrow inputs display a temporary status.
- Wallet, ZeroDev, Arbitrum, items, turns, health, mana, and settlement are deferred until the visual direction is approved locally.

To find the runtime module plan visit [engine-architecture.md](file:///C:/game-hackathons/Expedition%2033-DN/docs/engine-architecture.md).

To find the first local scene requirements visit [visual-vertical-slice.md](file:///C:/game-hackathons/Expedition%2033-DN/docs/visual-vertical-slice.md).

To find the required art handoff visit [asset-contract.md](file:///C:/game-hackathons/Expedition%2033-DN/docs/asset-contract.md).
