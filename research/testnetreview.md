# Testnet Review

## Executive Summary

The core product demo can be built and demonstrated without mainnet funds.

Use Arbitrum Sepolia as the execution network, with test ETH and test ERC-20 assets. Arbitrum documents Sepolia as a Nitro testnet that replicates Arbitrum One's capabilities, with chain ID `421614` and no real-world value. Solidity deployment, smart-account creation, sponsored UserOperations, permissions, in-game purchases, batching, settlement, and explorer receipts can all be exercised there.

Mainnet is likely required only when the product needs real economic value or production service guarantees. That includes real player funds, real marketplace liquidity, production on-ramp flows, production chain-abstraction reliability, and launch-scale infrastructure.

## Capability Matrix

| Capability | Testnet-only status | Mainnet requirement |
| --- | --- | --- |
| Phaser gameplay and UI | Fully testable locally and in a web build | None for the game itself |
| Magic email or social login | Testable with Magic configured for Arbitrum Sepolia | Production API configuration is needed for launch, not for the flow demo |
| Existing wallet login | Testable with EIP-1193 or WalletConnect on Arbitrum Sepolia | Production wallet support and account-linking validation remain |
| Kernel smart-account creation | Testable on supported ZeroDev testnet projects | Production project and network configuration for launch |
| Gas sponsorship | Testable if the ZeroDev testnet project has a usable paymaster policy | Production paymaster funding, policy, quotas, and monitoring |
| Session permissions and spending limits | Fully testable with test assets and scoped policies | Production security review and real-value policy limits |
| In-game purchases | Fully testable with a test ERC-20 and local marketplace contracts | Mainnet only for real items, real balances, and real liquidity |
| Batched settlement | Fully testable through UserOperations on Arbitrum Sepolia | Mainnet only for production settlement and final economic value |
| Post-session transaction labels and explorer links | Fully testable with Arbitrum Sepolia receipts | Mainnet explorer links for live users |
| Chain-abstracted balances | Technically testable only on supported ZeroDev testnet routes; reliability is not guaranteed | Recommended for credible production cross-chain behavior |
| Fiat on-ramp | Not a dependable testnet-only requirement | Real payment rails and supported production networks are required |
| Real marketplace or reward economy | Not meaningfully testable with real value | Mainnet liquidity and production asset contracts are required |

## What Can Be Done on Testnet

### 1. Game and player flow

The Phaser game does not require a blockchain network for its core loop. The following can be built and demonstrated locally or against a web deployment:

- Start a session.
- Set a maximum session allocation.
- Display a mock or test balance.
- Buy an in-game item without leaving the game UI.
- Show a finalizing or calculating-rewards state.
- Display a readable activity summary after the session.

The blockchain calls can be connected incrementally without changing the game loop.

### 2. Arbitrum contract deployment

Deploy the settlement, marketplace, item, and reward contracts to Arbitrum Sepolia. The official Arbitrum Solidity quickstart uses the same EVM deployment model for Sepolia and production networks.

Recommended testnet configuration:

- Network: Arbitrum Sepolia.
- Chain ID: `421614`.
- Currency: SepoliaETH.
- Contracts: Solidity using the normal EVM toolchain.
- Assets: test ERC-20 and test ERC-721 or ERC-1155 contracts as required by the demo.
- Verification: verify contracts on the testnet explorer so the post-session proof is inspectable.

Testnet ETH can come from a faucet or from Ethereum Sepolia through the official bridge. It has no real-world value, and faucet availability should not be treated as a production funding model.

### 3. Magic authentication

Magic documents explicit Arbitrum testnet configuration using chain ID `421614`. This allows the following to be tested without mainnet assets:

- Email OTP login.
- Social login where enabled for the Magic project.
- Embedded wallet creation and wallet address retrieval.
- Magic provider handoff to ZeroDev.
- Wallet and transaction provider behavior against Arbitrum Sepolia.

The existing-wallet path can also be tested separately through Magic Wallet Kit or a direct EIP-1193 or WalletConnect integration. The test wallet must be switched to Arbitrum Sepolia, and the test account should not be treated as a production identity.

### 4. ZeroDev smart accounts and permissions

ZeroDev documents Arbitrum Sepolia support and examples using separate testnet project IDs. The following can be exercised on testnet:

- Derive a Kernel smart account from a Magic signer.
- Derive a Kernel smart account from an existing EOA wallet.
- Send UserOperations through a ZeroDev bundler.
- Sponsor gas through a testnet paymaster policy.
- Create a session key or permissions validator.
- Restrict calls to specific contracts and functions.
- Apply gas, timestamp, rate-limit, and value policies.
- Execute multiple allowed actions without repeated wallet popups.

Testnet validation should deliberately include rejected calls. A useful demo proves that a purchase inside the allowed contract and spend limit succeeds, while an out-of-scope contract call or over-limit purchase is rejected.

### 5. Marketplace and deferred settlement

The pitch's marketplace flow does not need a live marketplace or valuable tokens to demonstrate the UX. Deploy a small test marketplace contract on Arbitrum Sepolia and use test assets to prove:

- The player purchases from inside the game.
- The session policy authorizes only the intended purchase.
- Multiple purchases can be batched.
- Settlement occurs at the end of the session.
- The final UI maps each transaction or UserOperation to a readable label.

This proves the interaction model, not market demand, asset liquidity, or the value of rewards.

## Testnet Limitations

### Test assets do not prove economic safety

Testnet tokens have no real value. A successful testnet session proves that the contracts and policies execute, but it does not prove that a production policy protects valuable assets under adversarial conditions. Production needs an independent contract review, realistic abuse testing, spend-limit review, and monitoring.

### Testnet infrastructure is not production infrastructure

Public RPC endpoints, faucets, bundlers, and paymasters may have rate limits, intermittent availability, or changing policies. A successful demo should record the exact chain, provider project, SDK versions, and contract addresses used. Production needs dedicated service configuration, fallback behavior, logging, rate limits, and alerting.

### Chain abstraction is the largest testnet risk

ZeroDev documents testnet support for selected assets and networks but recommends testing chain abstraction on mainnet because bridges and testnet routes can be unreliable. A testnet implementation may prove the API wiring and a supported route, but it should not be used to promise reliable cross-chain settlement in the pitch unless that exact route has been validated.

For the demo, the safest choices are:

- Keep the main settlement flow on Arbitrum Sepolia.
- Treat chain abstraction as an optional technical preview.
- Use a clearly labeled test balance if a unified-balance screen is shown.
- Do not make the demo depend on a cross-chain bridge or solver completing on time.

### Fiat on-ramp is not a testnet prerequisite

Magic's documented embedded-wallet fiat on-ramp supports Ethereum and Polygon, not Arbitrum. It also represents a real payment flow rather than a useful source of free test assets. The game should use faucets or pre-funded test accounts on testnet. A production on-ramp decision belongs in a later launch plan and may require a provider that supports the target network.

## What Likely Requires Mainnet

Mainnet is needed when the system must do any of the following:

- Hold or transfer assets with real monetary value.
- Let players purchase real items or claim real rewards.
- Depend on existing player balances rather than test balances.
- Rely on real marketplace liquidity, token listings, or external protocol integrations.
- Provide a production fiat on-ramp and charge real payment methods.
- Make chain abstraction reliable enough to be a core user promise.
- Validate production quotas, paymaster funding, service-level behavior, and abuse controls.
- Use production contracts and permanent explorer links.

Mainnet is not required merely to show the login, game, session-limit, batching, settlement, or labeled-proof experience.

## Recommended Demo Boundary

Build the first complete demo around this boundary:

1. Phaser game client with the session and marketplace UI.
2. Magic email or social login for new players.
3. External-wallet login for existing players.
4. ZeroDev Kernel smart account on Arbitrum Sepolia.
5. One session allocation enforced by ZeroDev permissions.
6. Test ERC-20 or ERC-1155 marketplace purchase.
7. Batched end-of-session settlement.
8. Human-readable summary with Arbitrum Sepolia explorer links.

Keep these items outside the critical demo path:

- Fiat on-ramp.
- Real-money rewards.
- Production marketplace liquidity.
- Cross-chain chain abstraction.
- Mainnet-only asset ownership claims.

This boundary demonstrates the pitch's central UX claim while avoiding dependencies on real funds, unreliable testnet bridges, and production payment infrastructure.

## Sources

- [Arbitrum chains overview](https://docs.arbitrum.io/arbitrum-essentials/public-chains) - Sepolia capabilities, Nitro parity, and test ETH limitations.
- [Arbitrum chain information](https://docs.arbitrum.io/for-devs/dev-tools-and-resources/chain-info) - Chain IDs, network metadata, and contract references.
- [Arbitrum Solidity quickstart](https://docs.arbitrum.io/build-decentralized-apps/quickstart-solidity-remix) - Testnet deployment workflow and production transition.
- [Arbitrum dApp troubleshooting](https://docs.arbitrum.io/for-devs/troubleshooting-building) - Testnet feature-set and bridge guidance.
- [ZeroDev supported networks](https://docs.zerodev.app/sdk/v5_3_x/faqs/chains) - Arbitrum One and Arbitrum Sepolia support listing.
- [ZeroDev React setup](https://docs.zerodev.app/react/getting-started) - Separate Arbitrum and Sepolia project configuration.
- [ZeroDev EIP-7702 quickstart](https://docs.zerodev.app/sdk/getting-started/quickstart-7702) - Testnet setup and EOA upgrade flow.
- [ZeroDev gas sponsorship](https://docs.zerodev.app/sdk/core-api/sponsor-gas) - Bundler and paymaster configuration.
- [ZeroDev chain abstraction](https://docs.zerodev.app/sdk/advanced/chain-abstraction) - Supported testnet assets and warning about testnet bridge reliability.
- [Magic Arbitrum configuration](https://docs.magic.link/embedded-wallets/blockchains/evm/arbitrum) - Arbitrum Sepolia chain ID and Magic network configuration.
- [Magic Login UI](https://docs.magic.link/embedded-wallets/authentication/customization/login-ui) - Testnet authentication and existing-account behavior.
- [Magic ZeroDev recipe](https://docs.magic.link/recipes/embedded-wallets/zerodev-account-abstraction) - Testnet Magic and ZeroDev integration example.
- [Magic fiat on-ramps](https://docs.magic.link/embedded-wallets/wallets/features/fiat-on-ramps) - Supported networks for fiat funding.
