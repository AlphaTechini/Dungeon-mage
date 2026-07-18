<script lang="ts">
	import { onMount } from 'svelte';

	let canvas: HTMLCanvasElement;
	let status = 'Press Right Arrow to cast Medium Attack';

	onMount(() => {
		let game: { destroy: () => void; handleKey: (code: string) => void } | undefined;
		let destroyed = false;
		const handleKeydown = (event: KeyboardEvent) => {
			if (!['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.code)) {
				return;
			}

			event.preventDefault();
			game?.handleKey(event.code);
		};

		void import('$lib/game/createGame').then(({ createGame }) => {
			if (destroyed) {
				return;
			}

			game = createGame(canvas, (nextStatus) => {
				status = nextStatus;
			});
		});
		window.addEventListener('keydown', handleKeydown);

		return () => {
			destroyed = true;
			window.removeEventListener('keydown', handleKeydown);
			game?.destroy();
		};
	});
</script>

<svelte:head>
	<title>Expedition 33-DN | Battle Preview</title>
	<meta
		name="description"
		content="Local visual prototype for a cinematic turn-based mage battle."
	/>
</svelte:head>

<main>
	<section class="battle-shell" aria-label="Mage battle preview">
		<canvas bind:this={canvas} aria-label="Animated mage battle canvas"></canvas>
		<div class="hud" aria-live="polite">
			<p class="eyebrow">LOCAL BATTLE TEST</p>
			<p class="status">{status}</p>
			<div class="controls" aria-label="Keyboard controls">
				<span><kbd>Left</kbd> Small <em>Coming Soon</em></span>
				<span><kbd>Down</kbd> Shield <em>Coming Soon</em></span>
				<span><kbd>Right</kbd> Medium Attack</span>
				<span><kbd>Up</kbd> Big Attack <em>Coming Soon</em></span>
			</div>
		</div>
	</section>
</main>

<style>
	:global(*) {
		box-sizing: border-box;
	}

	:global(body) {
		margin: 0;
		min-width: 320px;
		background: #080711;
		color: #f8f1ff;
		font-family: Inter, ui-sans-serif, system-ui, sans-serif;
	}

	main {
		--page-padding: clamp(0.75rem, 2vw, 2rem);
		height: 100svh;
		display: grid;
		place-items: center;
		padding: var(--page-padding);
		background:
			radial-gradient(circle at 50% 20%, rgb(95 46 141 / 25%), transparent 42rem),
			linear-gradient(145deg, #100a1f, #05040b 70%);
	}

	.battle-shell {
		position: relative;
		aspect-ratio: 16 / 9;
		overflow: hidden;
		background: #14101a;
		box-shadow: 0 1.5rem 5rem rgb(0 0 0 / 55%);
	}

	@media (max-aspect-ratio: 16 / 9) {
		.battle-shell {
			width: 100%;
			max-width: 1672px;
			height: auto;
		}
	}

	@media (min-aspect-ratio: 16 / 9) {
		.battle-shell {
			width: auto;
			max-width: 100%;
			height: min(941px, calc(100svh - var(--page-padding) - var(--page-padding)));
		}
	}

	canvas {
		display: block;
		width: 100%;
		height: 100%;
	}

	.hud {
		position: absolute;
		inset: 0;
		pointer-events: none;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		padding: clamp(0.8rem, 2vw, 1.6rem);
		text-shadow: 0 0.125rem 0.4rem rgb(0 0 0 / 80%);
	}

	.eyebrow,
	.status {
		margin: 0;
		width: fit-content;
		padding: 0.45rem 0.7rem;
		border: 1px solid rgb(226 194 255 / 40%);
		background: rgb(12 7 24 / 68%);
		backdrop-filter: blur(0.4rem);
	}

	.eyebrow {
		font-size: clamp(0.58rem, 1vw, 0.75rem);
		font-weight: 800;
		letter-spacing: 0.16em;
		color: #dec7ff;
	}

	.status {
		align-self: center;
		font-size: clamp(0.7rem, 1.2vw, 0.95rem);
		font-weight: 700;
		color: #ffffff;
	}

	.controls {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 0.35rem 0.7rem;
		font-size: clamp(0.58rem, 1vw, 0.78rem);
		font-weight: 700;
	}

	.controls span {
		padding: 0.35rem 0.55rem;
		background: rgb(12 7 24 / 68%);
		border: 1px solid rgb(226 194 255 / 28%);
	}

	kbd {
		font: inherit;
		color: #fff;
	}

	em {
		margin-left: 0.2rem;
		font-style: normal;
		font-weight: 600;
		color: #b7aac7;
	}
</style>
