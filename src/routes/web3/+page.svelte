<script lang="ts">
	import { onMount } from 'svelte';
	import { buyAndUsePotion, completeMatch, startMatch } from '$lib/web3/actions';
	import { getWeb3Config } from '$lib/web3/config';
	import { createMagicKernelContext, type KernelContext } from '$lib/web3/kernel';
	import { loginWithMagic } from '$lib/web3/magic';
	import { createMatchSession } from '$lib/web3/session';
	import { keccak256, parseEther, toHex, type Hex } from 'viem';

	const matchSpendCap = parseEther('0.0005');
	let email = '';
	let accountAddress = '';
	let matchId: Hex | undefined;
	let expiresAt = 0;
	let kernel: KernelContext | undefined;
	let sessionClient: any;
	let message = 'Configure the public provider values, then sign in.';
	let explorerUrl: string | undefined;
	let busy = false;
	let configReady = false;

	onMount(() => {
		try {
			getWeb3Config();
			configReady = true;
			message = 'Sign in with Magic Email OTP to create your game smart account.';
		} catch (error) {
			message = error instanceof Error ? error.message : 'Web3 configuration is unavailable.';
		}
	});

	async function signIn() {
		busy = true;
		try {
			await loginWithMagic(email);
			kernel = await createMagicKernelContext();
			accountAddress = kernel.accountAddress;
			message = 'Smart account ready. Start a match to reserve the run.';
		} catch (error) {
			message = error instanceof Error ? error.message : 'Magic login failed.';
		} finally {
			busy = false;
		}
	}

	async function beginMatch() {
		if (!kernel) return;
		busy = true;
		try {
			matchId = keccak256(toHex(`${kernel.accountAddress}:${Date.now()}`));
			expiresAt = Math.floor(Date.now() / 1000) + 15 * 60;
			const result = await startMatch(kernel.client, matchId, matchSpendCap, expiresAt);
			explorerUrl = result.explorerUrl;
			message = 'Match recorded. Approve the scoped session key to enable in-game actions.';
		} catch (error) {
			message = error instanceof Error ? error.message : 'Could not start the match.';
		} finally {
			busy = false;
		}
	}

	async function approveSession() {
		if (!kernel || !matchId) return;
		busy = true;
		try {
			sessionClient = await createMatchSession(kernel, matchId, matchSpendCap, expiresAt);
			message =
				'Session key is ready: only this match, potion purchase, and completion are allowed.';
		} catch (error) {
			message = error instanceof Error ? error.message : 'Could not create the session key.';
		} finally {
			busy = false;
		}
	}

	async function usePotion() {
		if (!sessionClient || !matchId) return;
		busy = true;
		try {
			const result = await buyAndUsePotion(sessionClient, matchId);
			explorerUrl = result.explorerUrl;
			message = 'Potion purchased and used through the scoped session key.';
		} catch (error) {
			message = error instanceof Error ? error.message : 'Potion purchase failed.';
		} finally {
			busy = false;
		}
	}

	async function finishMatch() {
		if (!sessionClient || !matchId) return;
		busy = true;
		try {
			const result = await completeMatch(
				sessionClient,
				matchId,
				keccak256(toHex('expedition-33-match-complete')),
			);
			explorerUrl = result.explorerUrl;
			message = 'Match completion recorded on Arbitrum Sepolia.';
		} catch (error) {
			message = error instanceof Error ? error.message : 'Match completion failed.';
		} finally {
			busy = false;
		}
	}
</script>

<svelte:head>
	<title>Expedition 33-DN | Prepare the run</title>
	<meta
		name="description"
		content="Set up a bounded Expedition 33-DN session with Magic and ZeroDev on Arbitrum Sepolia."
	/>
	<link rel="stylesheet" href="/frontend/styles.css" />
</svelte:head>

<main class="web3-page">
	<div class="web3-shell">
		<header class="web3-topbar">
			<a class="brand" href="/" aria-label="Return to Expedition 33-DN home">
				<span class="brand-mark" aria-hidden="true"><span>33</span></span>
				<span>Expedition 33-DN</span>
			</a>
			<a class="return-link" href="/">Return to briefing</a>
		</header>

		<div class="web3-layout">
			<section class="web3-intro" aria-labelledby="web3-title">
				<p class="kicker">Run preparation / Arbitrum Sepolia</p>
				<h1 id="web3-title">Set the chain aside until it matters.</h1>
				<p class="web3-lede">
					Prepare the account and permissions once. The battle remains fast and local; the chain
					only keeps the meaningful record.
				</p>
				<div class="web3-note">
					<span class="signal" aria-hidden="true"></span>
					<span>Wallet setup is separate from the battle loop.</span>
				</div>
			</section>

			<section class="web3-panel" aria-labelledby="setup-title">
				<div class="panel-heading">
					<div>
						<p class="panel-kicker">Session zero</p>
						<h2 id="setup-title">Prepare your run</h2>
					</div>
					<span class:ready={configReady} class="connection-state">
						<span class="state-dot" aria-hidden="true"></span>
						{configReady ? 'Provider ready' : 'Needs setup'}
					</span>
				</div>

				<ol class="step-list" aria-label="Run preparation steps">
					<li class:done={Boolean(accountAddress)} class:active={!accountAddress}>
						<span>01</span><strong>Identity</strong><small>Magic email</small>
					</li>
					<li class:done={Boolean(matchId)} class:active={Boolean(accountAddress) && !matchId}>
						<span>02</span><strong>Match</strong><small>15-minute record</small>
					</li>
					<li class:done={Boolean(sessionClient)} class:active={Boolean(matchId) && !sessionClient}>
						<span>03</span><strong>Permission</strong><small>Bounded session</small>
					</li>
					<li class:active={Boolean(sessionClient)}>
						<span>04</span><strong>Record</strong><small>Arbitrum Sepolia</small>
					</li>
				</ol>

				{#if !configReady}
					<div class="config-alert" role="alert">
						<strong>Provider values are missing.</strong>
						<span
							>Set the required PUBLIC_ values in your local environment before using this flow.</span
						>
					</div>
				{:else if !accountAddress}
					<div class="setup-block">
						<div class="block-copy">
							<span class="block-index">01</span>
							<div>
								<h3>Bring your identity</h3>
								<p>
									Magic handles the email sign-in. No browser wallet extension is required for this
									demo.
								</p>
							</div>
						</div>
						<label class="field-label" for="email">Email address</label>
						<input
							id="email"
							bind:value={email}
							type="email"
							autocomplete="email"
							placeholder="mage@example.com"
							disabled={busy}
						/>
						<button class="web3-button" onclick={signIn} disabled={busy || !email.trim()}>
							{busy ? 'Waiting for Magic...' : 'Sign in with email'}
						</button>
					</div>
				{:else}
					<div class="setup-block">
						<div class="block-copy">
							<span class="block-index">02</span>
							<div>
								<h3>Reserve the match</h3>
								<p>Your smart account is ready. The match record expires after 15 minutes.</p>
							</div>
						</div>
						<div class="data-card">
							<small>Smart account</small>
							<code>{accountAddress}</code>
						</div>
						<button class="web3-button" onclick={beginMatch} disabled={busy || Boolean(matchId)}>
							{busy ? 'Recording match...' : matchId ? 'Match recorded' : 'Start a 15-minute match'}
						</button>
					</div>
				{/if}

				{#if matchId}
					<div class="setup-block compact-block">
						<div class="block-copy">
							<span class="block-index">03</span>
							<div>
								<h3>Limit the permissions</h3>
								<p>Only this match, potion purchases, and completion can use the session key.</p>
							</div>
						</div>
						<div class="data-card">
							<small>Match ID</small>
							<code>{matchId}</code>
						</div>
						<button
							class="web3-button"
							onclick={approveSession}
							disabled={busy || Boolean(sessionClient)}
						>
							{busy
								? 'Creating session...'
								: sessionClient
									? 'Session approved'
									: 'Approve limited session'}
						</button>
					</div>
				{/if}

				{#if sessionClient}
					<div class="setup-block compact-block">
						<div class="block-copy">
							<span class="block-index">04</span>
							<div>
								<h3>Keep the record</h3>
								<p>
									The scoped session is ready. These actions are placeholders for the live game
									loop.
								</p>
							</div>
						</div>
						<div class="action-grid">
							<button class="web3-button" onclick={usePotion} disabled={busy}>
								{busy ? 'Working...' : 'Buy and use potion'}
							</button>
							<button class="web3-button secondary" onclick={finishMatch} disabled={busy}>
								Complete match
							</button>
						</div>
					</div>
				{/if}

				<div class="status-panel" aria-live="polite">
					<span class="status-label">System message</span>
					<p>{message}</p>
				</div>
				{#if explorerUrl}
					<a class="explorer-link" href={explorerUrl} target="_blank" rel="noreferrer">
						Inspect the confirmed transaction on Arbiscan <span aria-hidden="true">></span>
					</a>
				{/if}
			</section>
		</div>

		<footer class="web3-footer">
			<span>Magic / ZeroDev / Arbitrum Sepolia</span>
			<a href="/frontend/conclusion.html?result=pending">View conclusion placeholder</a>
		</footer>
	</div>
</main>

<style>
	:global(body) {
		margin: 0;
		min-width: 320px;
		background: #080611;
		color: #f7f2ff;
		font-family: Inter, ui-sans-serif, system-ui, sans-serif;
	}

	.web3-page {
		min-height: 100svh;
		background: rgb(8 6 17 / 56%);
	}

	.web3-shell {
		width: min(100% - 2rem, 76rem);
		margin: 0 auto;
	}

	.web3-topbar {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		padding: 1.4rem 0;
		border-bottom: 1px solid rgb(211 190 255 / 22%);
	}

	.return-link,
	.web3-footer a {
		color: #b9b2cf;
		font-size: 0.7rem;
		font-weight: 800;
		letter-spacing: 0.12em;
		text-transform: uppercase;
	}

	.return-link:hover,
	.return-link:focus-visible,
	.web3-footer a:hover,
	.web3-footer a:focus-visible,
	.explorer-link:hover,
	.explorer-link:focus-visible {
		color: #dbc4ff;
	}

	.web3-layout {
		display: grid;
		grid-template-columns: minmax(0, 0.82fr) minmax(22rem, 1.18fr);
		gap: clamp(2rem, 7vw, 7rem);
		align-items: start;
		padding: clamp(4rem, 10vh, 7rem) 0;
	}

	.web3-intro {
		padding-top: clamp(0rem, 7vw, 4rem);
	}

	.web3-intro h1 {
		max-width: 10ch;
		margin-bottom: 1.5rem;
		font-family: Georgia, 'Times New Roman', serif;
		font-size: clamp(3.2rem, 7vw, 6.2rem);
		font-weight: 400;
		line-height: 0.91;
		letter-spacing: -0.06em;
	}

	.web3-lede {
		max-width: 29rem;
		margin: 0;
		color: #b9b2cf;
		font-size: clamp(1rem, 1.5vw, 1.15rem);
		line-height: 1.7;
	}

	.web3-note {
		display: flex;
		align-items: center;
		gap: 0.65rem;
		margin-top: 2rem;
		color: #81799c;
		font-size: 0.7rem;
		font-weight: 700;
		letter-spacing: 0.08em;
		text-transform: uppercase;
	}

	.web3-panel {
		border: 1px solid rgb(211 190 255 / 48%);
		background: rgb(11 8 24 / 92%);
		box-shadow: 0 2rem 6rem rgb(4 2 12 / 45%);
	}

	.panel-heading {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: 1rem;
		padding: clamp(1.4rem, 4vw, 2.2rem);
		border-bottom: 1px solid rgb(211 190 255 / 22%);
	}

	.panel-kicker,
	.status-label {
		margin: 0 0 0.55rem;
		color: #b78cff;
		font-size: 0.65rem;
		font-weight: 900;
		letter-spacing: 0.16em;
		text-transform: uppercase;
	}

	.panel-heading h2 {
		margin: 0;
		font-family: Georgia, 'Times New Roman', serif;
		font-size: clamp(2rem, 4vw, 3.4rem);
		font-weight: 400;
		line-height: 0.95;
		letter-spacing: -0.05em;
	}

	.connection-state {
		display: inline-flex;
		align-items: center;
		gap: 0.45rem;
		padding: 0.45rem 0.6rem;
		border: 1px solid rgb(255 156 110 / 42%);
		color: #ff9c6e;
		font-size: 0.62rem;
		font-weight: 800;
		letter-spacing: 0.09em;
		text-transform: uppercase;
		white-space: nowrap;
	}

	.connection-state.ready {
		border-color: rgb(141 228 220 / 42%);
		color: #8de4dc;
	}

	.state-dot {
		width: 0.42rem;
		height: 0.42rem;
		border-radius: 50%;
		background: currentColor;
		box-shadow: 0 0 0.8rem currentColor;
	}

	.step-list {
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		gap: 1px;
		margin: 0;
		padding: 0;
		border-bottom: 1px solid rgb(211 190 255 / 22%);
		background: rgb(211 190 255 / 22%);
		list-style: none;
	}

	.step-list li {
		display: grid;
		gap: 0.25rem;
		min-height: 6rem;
		padding: 0.85rem;
		background: rgb(16 12 31 / 96%);
		color: #81799c;
	}

	.step-list li.active {
		background: rgb(40 25 74 / 92%);
		color: #dbc4ff;
	}

	.step-list li.done {
		color: #8de4dc;
	}

	.step-list span {
		font-size: 0.62rem;
		font-weight: 900;
		letter-spacing: 0.08em;
	}

	.step-list strong {
		font-size: 0.75rem;
		font-weight: 800;
		letter-spacing: 0.04em;
		text-transform: uppercase;
	}

	.step-list small {
		font-size: 0.65rem;
	}

	.setup-block {
		padding: clamp(1.4rem, 4vw, 2.2rem);
		border-bottom: 1px solid rgb(211 190 255 / 22%);
	}

	.compact-block {
		background: rgb(18 13 35 / 68%);
	}

	.block-copy {
		display: grid;
		grid-template-columns: auto 1fr;
		gap: 0.85rem;
		align-items: start;
		margin-bottom: 1.3rem;
	}

	.block-index {
		display: grid;
		width: 1.85rem;
		height: 1.85rem;
		place-items: center;
		border: 1px solid rgb(211 190 255 / 48%);
		color: #dbc4ff;
		font-size: 0.65rem;
		font-weight: 900;
	}

	.block-copy h3 {
		margin: 0 0 0.45rem;
		font-family: Georgia, 'Times New Roman', serif;
		font-size: 1.6rem;
		font-weight: 400;
		line-height: 1;
	}

	.block-copy p {
		margin: 0;
		color: #b9b2cf;
		font-size: 0.85rem;
		line-height: 1.55;
	}

	.field-label {
		display: block;
		margin-bottom: 0.45rem;
		color: #b9b2cf;
		font-size: 0.72rem;
		font-weight: 800;
		letter-spacing: 0.08em;
		text-transform: uppercase;
	}

	input {
		width: 100%;
		min-height: 3rem;
		padding: 0 0.85rem;
		border: 1px solid rgb(211 190 255 / 48%);
		border-radius: 0;
		background: #080611;
		color: #f7f2ff;
		font: inherit;
	}

	input::placeholder {
		color: #81799c;
	}

	input:focus-visible,
	button:focus-visible,
	a:focus-visible {
		outline: 2px solid #8de4dc;
		outline-offset: 3px;
	}

	.web3-button {
		width: 100%;
		min-height: 3rem;
		margin-top: 0.85rem;
		padding: 0.8rem 1rem;
		border: 1px solid #dbc4ff;
		border-radius: 0;
		background: #dbc4ff;
		color: #170d2b;
		font-size: 0.72rem;
		font-weight: 900;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		cursor: pointer;
		transition:
			transform 180ms ease,
			background 180ms ease;
	}

	.web3-button:hover:not(:disabled) {
		background: #fff;
		transform: translateY(-2px);
	}

	.web3-button.secondary {
		border-color: rgb(211 190 255 / 48%);
		background: transparent;
		color: #f7f2ff;
	}

	.web3-button:disabled {
		cursor: not-allowed;
		opacity: 0.52;
	}

	.data-card {
		display: grid;
		gap: 0.4rem;
		padding: 0.8rem;
		border: 1px solid rgb(211 190 255 / 22%);
		background: rgb(8 6 17 / 72%);
	}

	.data-card small {
		color: #81799c;
		font-size: 0.62rem;
		font-weight: 800;
		letter-spacing: 0.1em;
		text-transform: uppercase;
	}

	code {
		overflow-wrap: anywhere;
		color: #dbc4ff;
		font-size: 0.72rem;
	}

	.action-grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 0.65rem;
	}

	.action-grid .web3-button {
		margin-top: 0;
	}

	.config-alert {
		display: grid;
		gap: 0.45rem;
		padding: 1.4rem;
		border-bottom: 1px solid rgb(255 156 110 / 42%);
		background: rgb(75 33 29 / 42%);
		color: #ffcfbc;
		font-size: 0.85rem;
		line-height: 1.5;
	}

	.config-alert strong {
		color: #ff9c6e;
		font-size: 0.75rem;
		letter-spacing: 0.08em;
		text-transform: uppercase;
	}

	.status-panel {
		padding: 1.2rem clamp(1.4rem, 4vw, 2.2rem);
		background: rgb(8 6 17 / 72%);
	}

	.status-panel p {
		margin: 0;
		color: #b9b2cf;
		font-size: 0.85rem;
		line-height: 1.55;
	}

	.explorer-link {
		display: block;
		padding: 0 2.2rem 1.4rem;
		color: #8de4dc;
		font-size: 0.75rem;
		font-weight: 800;
		letter-spacing: 0.05em;
	}

	.web3-footer {
		display: flex;
		justify-content: space-between;
		gap: 1rem;
		padding: 0 0 2.5rem;
		color: #81799c;
		font-size: 0.68rem;
		letter-spacing: 0.1em;
		text-transform: uppercase;
	}

	@media (max-width: 820px) {
		.web3-layout {
			grid-template-columns: 1fr;
			gap: 2.5rem;
			padding-top: 4rem;
		}

		.web3-intro {
			padding-top: 0;
		}

		.web3-intro h1 {
			max-width: 12ch;
		}
	}

	@media (max-width: 520px) {
		.web3-shell {
			width: min(100% - 1.25rem, 76rem);
		}

		.web3-topbar,
		.web3-footer {
			align-items: flex-start;
			flex-direction: column;
		}

		.panel-heading {
			flex-direction: column;
		}

		.step-list li {
			min-height: 5.6rem;
			padding: 0.65rem;
		}

		.step-list small {
			font-size: 0.58rem;
		}

		.action-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
