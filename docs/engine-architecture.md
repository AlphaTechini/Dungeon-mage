# Engine Architecture

## Purpose

This document defines the runtime boundary for the first Excalibur.js game implementation. It is designed for a browser game mounted inside SvelteKit, with future Magic, ZeroDev, and Arbitrum integrations kept outside the engine.

## Ownership

| Layer        | Owns                                                                                                | Does not own                                               |
| ------------ | --------------------------------------------------------------------------------------------------- | ---------------------------------------------------------- |
| SvelteKit    | Routes, page shell, HTML controls, accessibility, login, session approval, report UI, Web3 adapters | Canvas rendering and combat animation                      |
| Excalibur    | Canvas, scene graph, actors, camera, actions, particles, local presentation state, game input       | Wallet prompts, contract calls, persistent player identity |
| Web3 adapter | Magic, external wallet connection, ZeroDev operations, contract calls, explorer URLs                | Scene timing, animation, combat calculations               |
| Contracts    | Match authorization, consumable purchase, settlement, reward record                                 | Per-frame simulation and visual state                      |

## Runtime Flow

```text
Svelte route mounts
  -> create Excalibur Engine
  -> load visual scene resources
  -> activate BattleScene
  -> scene emits typed gameplay intent
  -> Svelte application decides whether to call Web3
  -> Svelte application returns a result event
  -> scene plays only the required local visual response
```

The initial visual slice ends before the Web3 adapter is introduced. This avoids making art, animation, and camera iteration depend on wallet configuration or testnet availability.

## Current Source Layout

```text
src/
  lib/
    game/
      resources.ts
      createGame.ts
      BattleScene.ts
      README.md
  routes/
    +page.svelte
assets/
  README.md
  background(dungeon).png
  mage idle left_no_bg.png
  mage wand cast_no_bg.png
  Mage medium att_no_bg.png
  enemy idle_no_bg.png
```

The first runtime keeps the presentation in one `BattleScene` because the player medium attack is the only implemented scene feature. Separate actor and effect modules should be introduced only when the second attack sequence creates a reusable boundary.

## Module Responsibilities

### `createGame.ts`

Creates the single Excalibur `Engine` instance after the browser mount lifecycle begins. It configures canvas sizing, the initial scene, and engine cleanup.

Requirements:

- Create the engine only in the browser, never during SvelteKit server-side rendering.
- Accept a canvas element or canvas ID owned by the route component.
- Stop and dispose the engine when the route unmounts.
- Do not create a second engine while one is mounted.
- Keep the logical arena fixed at 1672x941, cap rendering at 60 FPS, and use a 1x pixel ratio to avoid high-DPI render amplification.

### `BattleScene.ts`

Owns the current battle presentation:

- Arena background.
- Player and enemy mage actors.
- Ground shadows, spell tints, casting glow, impact glow, damage label, and sparks.
- Player cast, projectile, impact, and recovery sequence.
- Demon charge, meteor fall, impact, and recovery sequence.

It must not create wallet clients or call contracts.

### `resources.ts`

Maps the current supplied assets to semantic resource keys and creates the Excalibur loader. The source files remain in the SvelteKit `assets/` directory, which SvelteKit serves from the application root.

## Excalibur Patterns

### Actors

Use `Actor` instances for visible or spatial game elements:

- Player mage.
- Enemy mage.
- Medium projectile.
- Cast and ground glow.
- Impact flash and sparks.
- Damage label.

Use a dedicated actor when the element needs a position, lifecycle, action queue, collision, or independent draw order. Use a scene graphic or full-screen overlay when it does not.

### Actions

Version 1 uses a small elapsed-time presentation state machine because its visual beats have fixed timing and no gameplay rules. The player medium sequence explicitly transitions to the demon meteor turn, which keeps player input locked until the demon recovery returns to idle. Future combat resolution should select these named transitions rather than entangling rule checks with rendering code.

### Parallel Effects

The elapsed-time state machine updates related effects in the same visual beat. During the charge it scales the player, cast glow, ground glow, arena tint, and camera together. During impact it updates enemy recoil, flash, sparks, damage label, tint, and shake together.

### Camera

The scene camera supports focus position, zoom, timed zoom, and shake. The first slice uses cinematic reframing rather than a true orbiting 3D camera.

Do not add a camera-follow strategy for the fixed-arena slice. `BattleScene` owns the small cast-side reframe and the recovery back to the arena center.

### HTML UI

Svelte renders game UI in HTML above the Excalibur canvas. This includes later session controls, wallet controls, health and mana panels, and report screens. Excalibur's UI documentation explicitly supports this overlay approach.

Keep the overlay container separate from the canvas. Configure pointer scope so HTML controls receive their own input and the canvas receives only gameplay input.

## Deferred Web3 Boundary

When Web3 work begins, add an application service with commands such as:

```text
startMatch()
buyAndUsePotion()
completeMatch()
```

The scene should call none of these directly. The route or store coordinates the service and dispatches one of these display-level results to the scene:

```text
potionPurchaseAccepted
potionPurchaseRejected
matchSettlementRecorded
```

This preserves the requirement that no wallet or blockchain latency blocks the animation loop.

## Sources

- [Excalibur engine fundamentals](https://excaliburjs.com/docs/engine)
- [Excalibur actors](https://excaliburjs.com/docs/actors)
- [Excalibur Actions primer](https://excaliburjs.com/docs/actions-primer/)
- [Excalibur Actions](https://excaliburjs.com/docs/actions/)
- [Excalibur parallel actions](https://excaliburjs.com/docs/sequences-and-parallel)
- [Excalibur cameras](https://excaliburjs.com/docs/cameras)
- [Excalibur UI](https://excaliburjs.com/docs/ui)
