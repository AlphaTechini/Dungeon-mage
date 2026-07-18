# Local Battle Runtime

This directory contains the Version 1 Excalibur scene. It has no wallet, server, or blockchain dependency.

## Decisions

The engine renders at the arena image's native 1672x941 resolution. CSS scales the canvas into an aspect-ratio-preserving full-browser frame. The engine is fixed at 60 FPS and a 1x pixel ratio so high-DPI displays do not multiply the render workload. The battle scene uses a deterministic visual-state sequence: player medium attack, then demon meteor counterattack, then input unlock. Future combat rules can select a sequence without entering the render loop.

## Logic Map

To find asset loading and semantic asset names visit [resources.ts](file:///C:/game-hackathons/Expedition%2033-DN/src/lib/game/resources.ts).

To find the player cast, projectile, impact, and input sequence visit [BattleScene.ts](file:///C:/game-hackathons/Expedition%2033-DN/src/lib/game/BattleScene.ts).

To find engine mounting and cleanup visit [createGame.ts](file:///C:/game-hackathons/Expedition%2033-DN/src/lib/game/createGame.ts).

The Excalibur canvas connection can be found in [createGame.ts](file:///C:/game-hackathons/Expedition%2033-DN/src/lib/game/createGame.ts).
