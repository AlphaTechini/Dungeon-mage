# Frontend Components

This directory contains Svelte components that compose the integrated frontend flow around the browser game.

## Decisions

The introduction is rendered as an overlay on the existing game route instead of replacing or duplicating the battle implementation. This lets the game initialize immediately behind the landing content and keeps the start action instant.

The `view=game` query state is used only by the standalone static landing page. It hides the introduction when that page preloads the root route in an iframe, preventing a recursive landing-page frame.

## Logic Map

To find the integrated landing experience and start-game interaction visit [LandingIntro.svelte](file:///C:/game-hackathons/Expedition%2033-DN/src/lib/frontend/LandingIntro.svelte).

To find the game route that mounts the overlay and starts the battle runtime visit [+page.svelte](file:///C:/game-hackathons/Expedition%2033-DN/src/routes/+page.svelte).

The shared visual connection can be found in [assets/frontend/styles.css](file:///C:/game-hackathons/Expedition%2033-DN/assets/frontend/styles.css).
