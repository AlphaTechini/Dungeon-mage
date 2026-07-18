# Application Source

This directory contains the SvelteKit shell and the browser-only game runtime.

## Architecture

Svelte owns the route shell and accessible HUD. Excalibur owns the fixed-size battle canvas and all visual choreography. This keeps eventual wallet or API work outside the frame loop.

## Logic Map

To find the game route and HUD logic visit [+page.svelte](file:///C:/game-hackathons/Expedition%2033-DN/src/routes/+page.svelte).

To find the Excalibur setup and battle presentation visit [lib/game/README.md](file:///C:/game-hackathons/Expedition%2033-DN/src/lib/game/README.md).
