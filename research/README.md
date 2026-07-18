# Research

This directory contains separate research documents for the game, asset pipeline, provider architecture, and testnet feasibility. The documents intentionally remain separate so each topic can be reviewed without merging unrelated decisions.

## Documents

- [JavaScript game libraries](javascript-game-libraries.md) - Comparison of Phaser, Excalibur, PixiJS, KAPLAY, melonJS, Three.js, PlayCanvas, and GDevelop.
- [JavaScript versus Python](javascript-versus-python.md) - Runtime-language decision and appropriate uses for Python.
- [Game assets and environment](game-assets-and-environment.md) - Character creation, effects, arena construction, animation, and asset packaging.
- [Session Zero guide review](session-zero-guide-review.md) - Extracted architecture and build order from the attached PDF.
- [Provider resources](resources.md) - Arbitrum, Phaser, ZeroDev, Magic, and related documentation.
- [Testnet review](testnetreview.md) - Testnet feasibility and mainnet boundaries.

## Architectural Decisions

- The browser game runtime should use JavaScript or TypeScript, not Python.
- Phaser remains the default engine because the supplied Session Zero guide already targets Phaser 3 and SvelteKit.
- Python is optional for offline asset processing only, not for gameplay execution.
- Blockchain calls should remain at the application boundary. Combat simulation and rendering stay offchain.

To find the game library comparison visit [javascript-game-libraries.md](file:///C:/game-hackathons/Expedition%2033-DN/research/javascript-game-libraries.md).

To find the language decision visit [javascript-versus-python.md](file:///C:/game-hackathons/Expedition%2033-DN/research/javascript-versus-python.md).

To find the character and environment pipeline visit [game-assets-and-environment.md](file:///C:/game-hackathons/Expedition%2033-DN/research/game-assets-and-environment.md).

The provider and blockchain connections can be found in [resources.md](file:///C:/game-hackathons/Expedition%2033-DN/research/resources.md).
