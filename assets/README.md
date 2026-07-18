# Game Assets

This directory is the SvelteKit public asset root. Files in this directory are available at the application root and are copied into production builds.

## Decisions

The current files are browser-ready PNGs. Character and spell files use RGBA transparency; the arena background remains an opaque 1672x941 image. Runtime code reads these files only and never modifies them.

## Logic Map

To find the semantic mapping from these filenames to the game scene visit [resources.ts](file:///C:/game-hackathons/Expedition%2033-DN/src/lib/game/resources.ts).

The SvelteKit asset connection can be found in [svelte.config.js](file:///C:/game-hackathons/Expedition%2033-DN/svelte.config.js).
