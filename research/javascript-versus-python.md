# JavaScript Versus Python

## Finding

The game should use JavaScript or TypeScript in the browser. Python is not required for the game runtime and is not specified by `session_zero_tools_guide.pdf`.

The attached guide specifies Phaser 3, SvelteKit, Magic, ZeroDev, Solidity, Hardhat, viem, and Arbitrum Sepolia. Phaser itself is designed for JavaScript and TypeScript browser development.

## Why JavaScript or TypeScript Fits

- Phaser runs directly in the browser's JavaScript runtime.
- SvelteKit is already the application shell.
- Magic and ZeroDev expose JavaScript and TypeScript SDKs.
- viem is a TypeScript interface for Ethereum.
- Browser wallet providers use JavaScript APIs such as EIP-1193.
- No language bridge is required between the game, UI, wallet, and contract layers.
- The game can share types for combat commands, player sessions, contract addresses, and report entries.

TypeScript is the preferred runtime language for new code because the project crosses several boundaries: SvelteKit, Phaser, wallet providers, contract ABIs, and session state. Plain JavaScript remains possible and matches many Phaser examples, but it provides less protection against mismatched event payloads and contract data.

## What Python Would Add

Python would be useful if the project required a separate backend, data-generation process, computer-vision pipeline, procedural art tool, or offline image-processing workflow. None of those is required by the current pitch.

Using Python as the browser game runtime would require an additional execution strategy such as Pyodide or a separate WebAssembly target. That would add:

- A second runtime and larger initial download.
- A boundary between Python game state and JavaScript UI code.
- More complex wallet-provider integration.
- More complicated debugging and deployment.
- No direct benefit for Phaser's JavaScript API.

Using a Python game library such as Pygame would produce a different application model. Pygame is designed for desktop or Python-controlled environments, while the pitch requires a browser game embedded in SvelteKit with browser wallet access.

## Appropriate Uses for Python

Python can remain optional and offline:

- Convert source art to consistent RGBA PNG files.
- Validate image dimensions and transparent padding.
- Generate sprite sheets or asset manifests.
- Produce deterministic mock combat data for development.
- Run offline balance-analysis scripts later.

Those tools should live outside the browser application, for example under `tools/assets/` or `tools/data/`. They should emit static files consumed by the TypeScript application.

## Runtime Alternatives

| Approach                                | Benefit                                                 | Cost                                             | Recommendation                    |
| --------------------------------------- | ------------------------------------------------------- | ------------------------------------------------ | --------------------------------- |
| TypeScript plus Phaser                  | One browser runtime, typed Web3 boundary, matches guide | Requires learning TypeScript types               | Recommended                       |
| JavaScript plus Phaser                  | Fastest start and matches examples                      | More runtime mistakes at integration boundaries  | Acceptable fallback               |
| Python through Pyodide                  | Reuses Python skills in the browser                     | Large integration and runtime complexity         | Do not use for this demo          |
| Python backend plus JavaScript client   | Good for authoritative server systems                   | Requires server, API, state sync, and deployment | Not needed for single-player demo |
| Pygame or another desktop Python engine | Familiar Python game programming                        | Does not match browser and wallet architecture   | Not suitable                      |

## Recommended Language Boundary

- SvelteKit UI: TypeScript and Svelte.
- Phaser game: TypeScript.
- Wallet and provider adapters: TypeScript.
- Contracts: Solidity.
- Contract deployment: Hardhat and TypeScript.
- Offline asset tooling: optional Python or Node.js scripts.

The result is one runtime for the user-facing product and optional tooling languages only where they provide a concrete benefit.

## Sources

- [What is Phaser?](https://docs.phaser.io/phaser/getting-started/what-is-phaser) - Phaser's JavaScript and TypeScript browser model.
- [SvelteKit introduction](https://svelte.dev/docs/kit/introduction) - Application framework and routing model.
- [Viem getting started](https://viem.sh/docs/getting-started) - TypeScript Ethereum client model.
- [Pillow documentation](https://pillow.readthedocs.io/en/stable/) - Optional offline image-processing tool.
