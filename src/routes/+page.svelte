<script lang="ts">
	import { onMount } from 'svelte';

	let canvas: HTMLCanvasElement;
	let battleShell: HTMLElement;
	let status = 'Press Right Arrow to cast Medium Attack';
	let isFullscreen = false;

	async function toggleFullscreen() {
		if (document.fullscreenElement) {
			await document.exitFullscreen();
			return;
		}

		await battleShell.requestFullscreen();
	}

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
		const handleFullscreenChange = () => {
			isFullscreen = document.fullscreenElement === battleShell;
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
		document.addEventListener('fullscreenchange', handleFullscreenChange);

		return () => {
			destroyed = true;
			window.removeEventListener('keydown', handleKeydown);
			document.removeEventListener('fullscreenchange', handleFullscreenChange);
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
	<link rel="preload" as="image" href="/background(dungeon).png" />
	<link rel="preload" as="image" href="/mage%20idle%20left_no_bg.png" />
	<link rel="preload" as="image" href="/mage%20wand%20cast_no_bg.png" />
	<link rel="preload" as="image" href="/Mage%20medium%20att_no_bg.png" />
	<link rel="preload" as="image" href="/enemy%20idle_no_bg.png" />
</svelte:head>

<main>
	<section bind:this={battleShell} class="battle-shell" aria-label="Mage battle preview">
		<div class="game-frame">
			<canvas bind:this={canvas} aria-label="Animated mage battle canvas"></canvas>
			<div class="hud" aria-live="polite">
				<div class="hud-top">
					<p class="eyebrow">LOCAL BATTLE TEST</p>
					<button class="fullscreen" type="button" onclick={toggleFullscreen}>
						{isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
					</button>
				</div>
				<p class="status">{status}</p>
				<div class="controls" aria-label="Keyboard controls">
					<span><kbd>Left</kbd> Small <em>Coming Soon</em></span>
					<span><kbd>Down</kbd> Shield <em>Coming Soon</em></span>
					<span><kbd>Right</kbd> Medium Attack</span>
					<span><kbd>Up</kbd> Big Attack <em>Coming Soon</em></span>
				</div>
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
		overflow: hidden;
		background: #080711;
		color: #f8f1ff;
		font-family: Inter, ui-sans-serif, system-ui, sans-serif;
	}

	main {
		height: 100svh;
		background: #05040b;
	}

	.battle-shell {
		position: relative;
		width: 100vw;
		height: 100svh;
		display: grid;
		place-items: center;
		background: radial-gradient(circle at 50% 20%, rgb(95 46 141 / 22%), transparent 42rem);
	}

	@media (max-aspect-ratio: 16 / 9) {
		.game-frame {
			width: 100%;
			height: auto;
		}
	}

	@media (min-aspect-ratio: 16 / 9) {
		.game-frame {
			width: auto;
			height: 100%;
		}
	}

	.game-frame {
		position: relative;
		aspect-ratio: 16 / 9;
		overflow: hidden;
		background: #14101a;
	}

	canvas {
		display: block;
		width: 100% !important;
		height: 100% !important;
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

	.hud-top {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		gap: 0.75rem;
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

	.fullscreen {
		pointer-events: auto;
		padding: 0.45rem 0.7rem;
		border: 1px solid rgb(226 194 255 / 48%);
		background: rgb(12 7 24 / 78%);
		color: #f8f1ff;
		font: inherit;
		font-size: clamp(0.58rem, 1vw, 0.75rem);
		font-weight: 800;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		cursor: pointer;
	}

	.fullscreen:hover,
	.fullscreen:focus-visible {
		border-color: #e2c2ff;
		background: rgb(58 29 93 / 88%);
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
