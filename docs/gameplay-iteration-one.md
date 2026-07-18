# Gameplay Iteration One

## Current Scope

The first implementation phase is a visual vertical slice. It is deliberately narrower than the original Session Zero combat proposal.

The purpose is to approve the rendering direction locally before adding game rules, wallet integration, or testnet actions.

## Confirmed Decisions

- Engine: Excalibur.js.
- Presentation: 2.5D using 2D layered assets.
- Arena: one fixed combat scene.
- Actors: one player mage and one enemy mage.
- Primary cinematic event: player medium cast, left-to-right projectile, enemy recoil, 25 damage display, then an automatic demon meteor counterattack for 50 damage.
- UI boundary: SvelteKit HTML UI above the game canvas.
- Blockchain boundary: no blockchain work in this iteration.
- Canvas: responsive 16:9 presentation with a native 1672x941 arena render size.
- Input: ArrowRight activates medium attack. ArrowUp, ArrowDown, and ArrowLeft report unavailable moves.
- Re-entry: the scene ignores casts while either the player or demon sequence is active.

## Not Yet Defined

These inputs are required before the project can build the actual first gameplay loop:

- Turn order and timing.
- Health, mana, and shield values.
- Exact attack list and defense rules.
- Whether separate close-up angle assets will be available.

The implementation must not invent these rules. Until they are supplied, the local scene remains a replayable presentation sequence.

## Implementation Order

1. Scaffold the TypeScript, SvelteKit, and Excalibur runtime.
2. Mount an Excalibur canvas inside the root route.
3. Implement the normal battle composition.
4. Load placeholder or supplied layered assets.
5. Implement parallax and named camera transitions.
6. Implement player medium cast, projectile, impact, and recovery.
7. Add reserved keyboard feedback for unavailable moves.
8. Run locally and collect visual feedback.
9. Adjust composition, assets, camera beats, and effects.
10. Add the minimal combat state only after visual approval.

## Definition Of Done

Iteration one is complete when the local browser scene meets every acceptance criterion in [Visual vertical slice](visual-vertical-slice.md) and feedback has identified the approved visual direction.

## Later Iterations

### Gameplay iteration two

- Add health, mana, attack tiers, shield windows, and turn flow.
- Keep simulation offchain.
- Use deterministic local state so presentation can react to results.

### Gameplay iteration three

- Add test gUSDC, item purchase, session limits, and optimistic UI.
- Connect SvelteKit application services to Magic and ZeroDev.
- Keep the Excalibur scene independent of provider SDKs.

### Gameplay iteration four

- Add match settlement, labeled report entries, and Arbitrum Sepolia explorer links.

## Related Documents

- [Engine architecture](engine-architecture.md)
- [2.5D presentation](two-point-five-d-presentation.md)
- [Visual vertical slice](visual-vertical-slice.md)
- [Asset contract](asset-contract.md)
