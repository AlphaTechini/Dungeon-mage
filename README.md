# Expedition 33-DN

This repository currently contains the project pitch and implementation research for the Web3 game experience.

## Run Locally

```powershell
pnpm install
pnpm dev
```

Open the local URL printed by Vite, then press the Right Arrow to play the Version 1 medium attack. The other arrow keys currently show their reserved move status.

## Documentation

- [Project structure](structure.md) - Folder and documentation map.
- [Game implementation docs](docs/README.md) - Code-level game architecture, visual slice, and asset contract.
- [Research index](research/README.md) - Separate research documents and architectural decisions.
- [Provider resources](research/resources.md) - Official Arbitrum, Phaser, ZeroDev, and Magic documentation plus the ZeroDev authentication findings.
- [Testnet review](research/testnetreview.md) - Capability-by-capability assessment of what can run on Arbitrum Sepolia and what needs mainnet.
- [JavaScript game libraries](research/javascript-game-libraries.md) - Comparison of browser game-engine options.
- [Game assets and environment](research/game-assets-and-environment.md) - Character and arena production pipeline.
- [Application source](src/README.md) - SvelteKit route and local Excalibur battle scene.
- [Web3 session demo](src/routes/web3/README.md) - Isolated Magic, ZeroDev, and Arbitrum Sepolia flow.
- [Arbitrum contracts](contracts/README.md) - Native test-ETH match spending and settlement contract.
- [Static frontend pages](assets/frontend/README.md) - Isolated landing and reusable conclusion pages.
- [Game assets](assets/README.md) - Browser-ready arena, mage, and spell files.
- [Project constraints](.agents/README.md) - Confirmed implementation and dependency decisions.
- [Pitch PDF](pitch.pdf) - Product narrative, sponsor positioning, and source links.
- [Session Zero build guide](session_zero_tools_guide.pdf) - Supplied tool, architecture, and build-order guide.
