# Project Resources

Research collected from the links embedded in `../pitch.pdf` and from official provider documentation. The pitch-only evidence sources are separated from implementation references.

## ZeroDev Authentication Answer

ZeroDev does not require users to connect to a proprietary ZeroDev wallet.

ZeroDev provides smart-account infrastructure. A Kernel smart account uses a validator, and that validator can be backed by different signer or wallet providers. The official documentation shows support for:

- Existing EOA wallets through EIP-1193 providers, including browser wallets and hardware wallets.
- WalletConnect-compatible wallets.
- Viem accounts and local signers.
- Embedded and authentication providers such as Magic, Privy, Dynamic, Web3Auth, Capsule, Portal, and Turnkey.
- Alternative validators such as passkeys and multisig.

For this project, existing Web3 gamers can therefore use an external-wallet login path instead of creating a Magic wallet. The connected wallet can sign for a ZeroDev Kernel smart account, allowing ZeroDev to provide batching, gas sponsorship, permissions, and other account-abstraction features. This is not an unlimited guarantee for every wallet brand: the provider must expose a compatible EIP-1193, Viem, WalletConnect, or supported adapter interface.

The main identity caveat is important: a standard Kernel smart account is normally a separate smart-account address controlled by the user's existing wallet signer. It is not automatically the same address as the player's existing EOA, and its balances are not automatically the EOA's balances. An EOA generally retains the same address across EVM-compatible chains, but token balances remain chain-specific. The application must explicitly decide how to link the user's existing wallet identity to the game's smart account and how assets move into or are used by that account.

EIP-7702 is a separate route that can upgrade an EOA into a smart account while retaining the EOA address. It may be useful when preserving the player's existing address is a hard requirement, but it has different security and wallet-support considerations than a normal Kernel smart account.

ZeroDev chain abstraction can present supported token balances across chains as a unified balance and spend them without a traditional bridge. This does not mean every asset or every chain is automatically supported. Supported networks, tokens, validators, and the account model still need to be configured and verified for the final integration.

Recommended product model:

- New players: Magic email or social login, with a Magic embedded wallet used as the ZeroDev signer.
- Existing Web3 players: external wallet login through EIP-1193 or WalletConnect, with that wallet used as the ZeroDev signer.
- Account identity: maintain an application-level player record that can link a Magic identity, an external EOA, and the resulting ZeroDev smart-account address where appropriate.
- Session spending: apply ZeroDev permissions to the smart account, not directly to an unconfigured external EOA balance.

## Arbitrum

### Primary documentation

- [Arbitrum documentation](https://docs.arbitrum.io/) - Main index for building decentralized applications, chain information, deployment, bridging, and Arbitrum platform concepts.
- [Solidity quickstart with Remix](https://docs.arbitrum.io/build-decentralized-apps/quickstart-solidity-remix) - End-to-end example for building and deploying an EVM smart contract to Arbitrum Sepolia and production networks.
- [Development frameworks](https://docs.arbitrum.io/arbitrum-essentials/reference/development-frameworks) - Framework reference covering Hardhat, Foundry, and other EVM development tools.
- [Solidity references](https://docs.arbitrum.io/arbitrum-essentials/reference/solidity-references) - Arbitrum guidance for Solidity, EVM-compatible contracts, tools, and references.
- [Chain parameters](https://docs.arbitrum.io/arbitrum-essentials/reference/chain-params) - Chain configuration and gas-related reference data.
- [RPC endpoints and providers](https://docs.arbitrum.io/arbitrum-essentials/reference/rpc-endpoints-and-providers) - RPC and provider reference for connecting applications to Arbitrum networks.

### Language and deployment choices

- [Create a token with Foundry](https://docs.arbitrum.io/build-decentralized-apps/quickstart-create-a-token) - Foundry-based Solidity deployment workflow for Arbitrum One.
- [Stylus Rust quickstart](https://docs.arbitrum.io/stylus/quickstart) - Deploy EVM-compatible contracts written in Rust through Arbitrum Stylus.
- [Arbitrum glossary](https://docs.arbitrum.io/intro/glossary) - Explains the EVM and Stylus multi-VM model, including Rust, C, and C++ support through WebAssembly.

Arbitrum contracts can be written in Solidity using the normal EVM toolchain. Stylus is an alternative for Rust, C, or C++ contracts compiled to WebAssembly. For the pitch architecture, Solidity is the most direct fit because the settlement contracts are EVM contracts and the surrounding ZeroDev, Viem, and wallet tooling is EVM-oriented.

## Phaser

- [Phaser download and getting started](https://phaser.io/download) - Official entry point for installing Phaser, reading the getting-started material, and finding examples and API documentation.
- [Phaser API documentation](https://docs.phaser.io) - API reference for the game framework.
- [Create Phaser Game app](https://phaser.io/tutorials/create-game-app) - Official project generator with JavaScript and TypeScript templates and bundler options including Vite.
- [First Phaser 3 game](https://phaser.io/tutorials/making-your-first-phaser-3-game/part1) - Introductory walkthrough covering game configuration, scenes, rendering, and the basic update loop.
- [Phaser TypeScript and Vite template](https://phaser.io/news/2024/01/phaser-vite-typescript-template) - Official template direction for Phaser 3 with TypeScript and Vite.
- [Phaser TypeScript and Vite template repository](https://github.com/phaserjs/template-vite-ts) - Source template for a Phaser 3, TypeScript, and Vite project.

Phaser is a browser game framework using JavaScript or TypeScript. The official templates make TypeScript and Vite a practical starting point for this project, while the game can remain separate from the wallet and settlement integration at the application boundary.

## ZeroDev

### Core account abstraction

- [ZeroDev introduction](https://docs.zerodev.app/) - Overview of Kernel smart accounts, ERC-4337, EIP-7702, key abstraction, gas abstraction, transaction abstraction, and chain abstraction.
- [Create a smart account](https://docs.zerodev.app/onboarding/create-a-smart-account) - Shows how a signer becomes a validator, how a Kernel account is created, and how a client sends UserOperations.
- [Use an EOA with ZeroDev](https://docs.zerodev.app/sdk/signers/eoa) - Direct answer for existing wallets: ZeroDev accepts EIP-1193 providers, Viem WalletClients, and local accounts.
- [Use WalletConnect with ZeroDev](https://docs.zerodev.app/sdk/v5_3_x/advanced/wallet-connect) - Connects WalletConnect-compatible wallets through a Kernel EIP-1193 provider.
- [Using Kernel plugins](https://docs.zerodev.app/smart-accounts/use-plugins/overview) - Explains sudo validators, regular validators, passkeys, multisig, guardians, and session-key access.

### Magic integration

- [Use Magic with ZeroDev](https://docs.zerodev.app/sdk/v5_3_x/signers/magic) - Official ZeroDev integration that converts Magic's provider into a smart-account signer.
- [Magic recipe for ZeroDev account abstraction](https://docs.magic.link/recipes/embedded-wallets/zerodev-account-abstraction) - Magic's implementation recipe for using a Magic provider with a ZeroDev Kernel client and sponsored transactions.
- [ZeroDev account-abstraction capabilities](https://docs.zerodev.app/blog/7702-for-dapps) - Discusses batching, gas sponsorship, permissions, chain abstraction, and EIP-7702 from a dApp developer perspective.

### External and third-party wallet providers

- [Use Dynamic with ZeroDev](https://docs.zerodev.app/onboarding/dynamic) - Uses Dynamic's WalletClient as a ZeroDev smart-account signer.
- [Use Privy with ZeroDev](https://docs.zerodev.app/onboarding/privy) - Uses Privy embedded or external wallet providers with ZeroDev.
- [Use Web3Auth with ZeroDev](https://docs.zerodev.app/sdk/v5_3_x/signers/web3auth) - Uses a Web3Auth EOA provider as the signer for a Kernel account.
- [Use Capsule with ZeroDev](https://docs.zerodev.app/sdk/v5_3_x/signers/capsule) - Uses Capsule's embedded MPC wallet as a smart-account signer.
- [Use Portal with ZeroDev](https://docs.zerodev.app/sdk/signers/portal) - Shows native and custom Portal integrations, including Portal's EOA as a signer.
- [Use Turnkey with ZeroDev](https://docs.zerodev.app/sdk/signers/turnkey) - Uses a Turnkey EOA wallet as the Kernel signer.

### Permissions and session spending

- [Permissions and session keys](https://docs.zerodev.app/smart-accounts/permissions/intro) - Defines the who, when, and what of delegated access.
- [Session keys](https://docs.zerodev.app/sdk/advanced/session-keys) - Older EntryPoint 0.6 session-key material and examples of scoped limits. Use the newer permissions documentation for EntryPoint 0.7 and Kernel v3.
- [Gas policy](https://docs.zerodev.app/sdk/permissions/policies/gas) - Limits gas spending or requires a paymaster for a permissioned signer.
- [Rate-limit policy](https://docs.zerodev.app/sdk/permissions/policies/rate-limit) - Limits UserOperation frequency and supports recurring allowances.
- [Transaction automation tutorial](https://docs.zerodev.app/smart-wallet/permissions/transaction-automation) - Shows how an owner authorizes a session key for server or agent execution without sharing the private key.
- [Session keys as JWTs of Web3](https://docs.zerodev.app/blog/session-keys-are-the-jwts-of-web3) - Conceptual comparison of temporary, scoped permissions and conventional Web2 sessions.

### Chain abstraction and balances

- [Chain abstraction overview](https://docs.zerodev.app/smart-accounts/chain-abstraction/overview) - Current overview of cross-chain transactions, chain-abstracted balances, supported tokens, and intent-based execution.
- [Legacy chain-abstracted balance overview](https://docs.zerodev.app/sdk/v5_3_x/advanced/chain-abstraction) - Older v5.3.x terminology and examples for treating supported token balances across chains as one balance.

Chain abstraction should be treated as an integration capability with explicit support requirements, not as a blanket promise for every token and chain. The pitch's unified-balance language should be narrowed to the supported assets and networks configured for the application.

### Testnet references

- [ZeroDev supported networks](https://docs.zerodev.app/sdk/v5_3_x/faqs/chains) - Lists Arbitrum One and Arbitrum Sepolia as supported networks.
- [ZeroDev React setup](https://docs.zerodev.app/react/getting-started) - Shows separate Arbitrum and Sepolia ZeroDev project configuration.
- [ZeroDev gas sponsorship](https://docs.zerodev.app/sdk/core-api/sponsor-gas) - Bundler and paymaster setup for sponsored UserOperations.
- [ZeroDev EIP-7702 quickstart](https://docs.zerodev.app/sdk/getting-started/quickstart-7702) - Testnet setup for upgrading an EOA into a smart account.
- [ZeroDev chain abstraction testnet notes](https://docs.zerodev.app/sdk/advanced/chain-abstraction) - Supported testnet assets and the warning that testnet bridges can be unreliable.

## Magic

### Authentication and wallets

- [Magic embedded-wallet introduction](https://docs.magic.link/embedded-wallets/introduction) - Overview of passwordless authentication, embedded wallets, non-custodial key management, and multi-chain support.
- [Magic authentication overview](https://docs.magic.link/embedded-wallets/authentication/overview) - Authentication methods including email OTP, SMS, Farcaster, and OAuth providers.
- [Email OTP login](https://docs.magic.link/embedded-wallets/authentication/login/email-otp) - Email one-time-passcode login flow.
- [OAuth login implementation](https://docs.magic.link/embedded-wallets/authentication/login/oauth/implementation) - Social login implementation and result handling.
- [Magic wallet overview](https://docs.magic.link/embedded-wallets/wallets/overview) - Explains that Magic provisions a non-custodial embedded wallet when a user authenticates.
- [Wallet Kit](https://docs.magic.link/embedded-wallets/authentication/login/wallet-kit) - React login UI supporting email, OAuth, Farcaster, and external wallet login.

Wallet Kit is the key reference for the existing-player requirement. It supports external wallet login, including MetaMask, Coinbase, Phantom, Rabby, and WalletConnect, while Magic's standard email and OAuth paths create or resolve Magic embedded wallets.

### Wallet UI and funding

- [Magic wallet widget UI](https://docs.magic.link/embedded-wallets/wallets/customization/widget-ui) - Embedded wallet UI for balances, NFTs, sending assets, wallet connection, and supported chain display. The documented widget supports Ethereum, Polygon, Base, Arbitrum, and Optimism.
- [Magic fiat on-ramps](https://docs.magic.link/embedded-wallets/wallets/features/fiat-on-ramps) - On-ramp options and limitations. The page documents support for Ethereum and Polygon for the fiat on-ramp feature, so this should not be assumed to fund Arbitrum directly.
- [Magic wallet security](https://docs.magic.link/home/security/product-security) - Magic's explanation of authentication, key protection, and security model.
- [Magic Arbitrum configuration](https://docs.magic.link/embedded-wallets/blockchains/evm/arbitrum) - Testnet chain ID `421614` and mainnet chain ID `42161` configuration.
- [Magic Login UI](https://docs.magic.link/embedded-wallets/authentication/customization/login-ui) - Testnet authentication and existing-account behavior.

## Pitch-Only Evidence

These sources were embedded in `pitch.pdf` for claims and context. They are not provider integration documentation.

- [Blockchain Game Alliance 2024 State of the Industry material](https://blockchaingamealliance.net/wp-content/uploads/2025/06/12-Christmas-magazine-2024-2.pdf) - Pitch evidence concerning industry-reported Web3 gaming challenges. Treat the cited percentage as a survey of industry professionals, not a direct gamer-abandonment study.
- [Stealing Trust: Unraveling Blind Message Attacks in Web3 Authentication](https://arxiv.org/abs/2406.00523) - Academic security evidence about blind-message attack patterns. Use it to support reducing repeated opaque signing, not as a universal claim about all Web3 authentication systems.

## Pitch Link Inventory

The following links were present in the PDF. The first and second-to-last entries are classified above as pitch-only evidence; the remaining entries are implementation references.

- BGA evidence: `https://blockchaingamealliance.net/wp-content/uploads/2025/06/12-Christmas-magazine-2024-2.pdf`
- ZeroDev and Magic integration: `https://docs.zerodev.app/sdk/v5_3_x/signers/magic`
- Magic ZeroDev recipe: `https://docs.magic.link/recipes/embedded-wallets/zerodev-account-abstraction`
- ZeroDev permissions and session keys: `https://docs.zerodev.app/smart-accounts/permissions/intro`
- ZeroDev chain-abstracted balance: `https://docs.zerodev.app/smart-accounts/chain-abstraction/overview`
- ZeroDev account-abstraction capabilities: `https://docs.zerodev.app/blog/7702-for-dapps`
- Magic fiat on-ramp: `https://docs.magic.link/embedded-wallets/wallets/features/fiat-on-ramps`
- Magic wallet widget: `https://docs.magic.link/embedded-wallets/wallets/customization/widget-ui`
- Blind-message attacks paper: `https://arxiv.org/abs/2406.00523`
- Arbitrum documentation: `https://docs.arbitrum.io/`
