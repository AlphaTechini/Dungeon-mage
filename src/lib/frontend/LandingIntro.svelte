<script lang="ts">
	import { onMount } from 'svelte';

	let isOpen = true;

	onMount(() => {
		isOpen = new URLSearchParams(window.location.search).get('view') !== 'game';
	});
</script>

<section class="landing-overlay" hidden={!isOpen} aria-label="Expedition 33-DN introduction">
	<div class="site-shell" id="landing-top">
		<header class="topbar">
			<a class="brand" href="#landing-top" aria-label="Expedition 33-DN home">
				<span class="brand-mark" aria-hidden="true"><span>33</span></span>
				<span>Expedition 33-DN</span>
			</a>
			<a class="topbar-meta" href="/web3">
				<span class="signal" aria-hidden="true"></span> Prepare a run
			</a>
		</header>

		<div class="hero">
			<div>
				<p class="kicker">A dungeon run for the chain-native era</p>
				<h1 id="hero-title">Fight the <em>rift.</em></h1>
				<p class="hero-copy">
					Expedition 33-DN is a cinematic, turn-based mage duel where your decisions stay fast,
					readable, and yours. Enter the arena, outplay the demon, and let the blockchain remember
					what mattered.
				</p>
				<div class="hero-actions">
					<button class="button" type="button" onclick={() => (isOpen = false)}
						>Start the game</button
					>
					<a class="button secondary" href="/web3">Prepare a run</a>
					<a class="button secondary" href="#difference">Why this game</a>
				</div>
				<p class="hero-note">
					<span class="signal" aria-hidden="true"></span> Battle engine preheating in the background
				</p>
			</div>

			<div class="hero-art" role="img" aria-label="Mage facing the dungeon rift">
				<p class="hero-art-label">The broken sanctum / sector 33</p>
				<img class="hero-mage" src="/Mage%20medium%20att_no_bg.png" alt="Mage casting a spell" />
				<p class="hero-art-caption">One turn.<br />One read.<br />No wallet maze.</p>
			</div>
		</div>

		<section class="section" id="difference" aria-labelledby="difference-title">
			<div class="section-heading">
				<h2 id="difference-title">Web3 games made the lobby the boss.</h2>
				<p class="section-intro">
					Too many on-chain games ask players to bridge, sign, wait, and decipher before they ever
					get to play. Expedition 33-DN reverses that order.
				</p>
			</div>

			<div class="story-grid">
				<article class="story-card">
					<span class="card-index">01</span>
					<h3>The old friction</h3>
					<p>
						Wallet prompts interrupt the first minute. Gas becomes a strategy tax. A failed
						transaction feels like losing to infrastructure instead of an opponent.
					</p>
				</article>
				<article class="story-card solution">
					<span class="card-index">02</span>
					<h3>Our different order</h3>
					<p>
						The battle is local, immediate, and legible. You make the call first. Once the run means
						something, provider and contract layers can settle the result behind the scenes.
					</p>
				</article>
			</div>
		</section>

		<section class="section" aria-labelledby="principles-title">
			<div class="section-heading">
				<h2 id="principles-title">A better run loop.</h2>
				<p class="section-intro">
					Designed around the feeling of a good duel, not the ceremony of a transaction.
				</p>
			</div>
			<div class="principles">
				<article class="principle">
					<strong>01 / Read</strong>
					<p>See the arena, the threat, and the available move before committing to a turn.</p>
				</article>
				<article class="principle">
					<strong>02 / Risk</strong>
					<p>
						Choose whether to press the attack, spend a shield, or hold the line for a better
						opening.
					</p>
				</article>
				<article class="principle">
					<strong>03 / Remember</strong>
					<p>When integrations arrive, the meaningful outcome becomes portable proof of the run.</p>
				</article>
			</div>
		</section>

		<section class="section" aria-label="Start the expedition">
			<div class="cta-band">
				<div>
					<p class="kicker">The gate is open</p>
					<h2>Make your first decision count.</h2>
				</div>
				<button class="button" type="button" onclick={() => (isOpen = false)}
					>Enter the arena</button
				>
			</div>
		</section>

		<footer class="footer">
			<span>Expedition 33-DN / battle preview</span>
			<a href="/frontend/conclusion.html?result=pending">View conclusion placeholder</a>
		</footer>
	</div>
</section>
