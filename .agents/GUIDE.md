# Project Guide

## Confirmed Constraints

- Preserve supplied PNG source files. Normalize their on-screen size only through runtime scaling.
- Keep the Excalibur battle canvas at the 1672x941 arena resolution, with aspect-ratio-preserving full-browser presentation.
- Health and mana begin at 100 for both combatants. The implemented medium attack costs 25 player mana and deals 25 damage; the meteor costs 50 demon mana and deals 50 damage.
- Zero health shows the relevant defeated art and result label, then opens the supplied conclusion page with a victory or defeat result query.

## Dependency Decisions

- Retain `solc@0.8.34` for fast local contract compilation. Both project scripts call its in-memory `solc.compile` API with a fixed local source path and no import callback.
- `pnpm audit` reports `tmp@0.0.33` through `solc`. The vulnerable temporary-file path is loaded only by Solc's optional SMT solver module, which these scripts do not import or execute. This dev-only finding is accepted for the current workflow.
- Do not add a custom Solc import callback or switch to the `solcjs` CLI without reassessing this advisory. Do not use an unsupported `tmp` major-version override.
- Leave the low-severity SvelteKit `cookie@0.6.0` advisory unchanged for now.

To find the accepted Solidity compiler risk and usage constraints visit [scripts/README.md](file:///C:/game-hackathons/Expedition%2033-DN/scripts/README.md).
