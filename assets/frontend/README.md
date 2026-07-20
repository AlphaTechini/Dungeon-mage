# Static Frontend Pages

This directory contains isolated browser entry points for the public-facing game shell. The pages are static HTML and CSS with small inline scripts for opening the preloaded game iframe and selecting a conclusion state from the URL query string.

## Decisions

The landing page does not modify the Svelte game route. It eager-loads the existing `/` route inside an iframe, allowing the battle engine to initialize while the player reads the introduction. The game is revealed only after the player chooses a start action.

The conclusion page is one reusable layout. Provider and contract work can later replace the placeholder copy without requiring separate victory and defeat layouts.

The visual language uses the dungeon background, purple rift lighting, high-contrast serif display type, and compact uppercase labels already present in the game HUD. Tailwind was not added because this isolated package needs no build-time utility layer or dependency change.

## Logic Map

To find the landing page, game preload, and start interaction visit [landing.html](file:///C:/game-hackathons/Expedition%2033-DN/assets/frontend/landing.html).

To find the reusable victory, defeat, and pending result states visit [conclusion.html](file:///C:/game-hackathons/Expedition%2033-DN/assets/frontend/conclusion.html).

To find shared layout, responsive behavior, contrast, and visual tokens visit [styles.css](file:///C:/game-hackathons/Expedition%2033-DN/assets/frontend/styles.css).

The game iframe connection can be found in [landing.html](file:///C:/game-hackathons/Expedition%2033-DN/assets/frontend/landing.html), and the source game route can be found in [src/routes/+page.svelte](file:///C:/game-hackathons/Expedition%2033-DN/src/routes/+page.svelte).

## Entry Points

- `/frontend/landing.html`
- `/frontend/conclusion.html?result=pending`
- `/frontend/conclusion.html?result=victory`
- `/frontend/conclusion.html?result=defeat`
