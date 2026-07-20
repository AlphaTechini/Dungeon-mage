# Contract Scripts

This directory compiles and deploys the contract without Hardhat because Hardhat's native dependency repeatedly timed out from the registry in this environment. `solc-js` and Viem preserve reproducible compilation and deployment while keeping the submission path small.

## Compiler Security Scope

`pnpm audit` reports `tmp@0.0.33` through `solc@0.8.34`. The reported path traversal applies when caller-controlled `prefix`, `postfix`, or `dir` values reach `tmp`. These scripts use Solc's in-memory `solc.compile` API with a fixed local source path and no import callback; they do not import the Solc CLI or optional SMT solver module where `tmp` is loaded. The dev-only finding is accepted for this constrained workflow to preserve fast local compilation. Reassess it before adding custom imports or switching to `solcjs`.

To find Solidity compilation logic visit [compile-contract.mjs](file:///C:/game-hackathons/Expedition%2033-DN/scripts/compile-contract.mjs).

To find the Arbitrum Sepolia deployment connection visit [deploy.mjs](file:///C:/game-hackathons/Expedition%2033-DN/scripts/deploy.mjs).

The accepted Solidity compiler risk and project-wide constraint record can be found in [GUIDE.md](file:///C:/game-hackathons/Expedition%2033-DN/.agents/GUIDE.md).
