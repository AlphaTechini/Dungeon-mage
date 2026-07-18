# Session Zero Guide Review

## Source

[Session Zero Build Guide](file:///C:/game-hackathons/Expedition%2033-DN/session_zero_tools_guide.pdf)

## Product Shape

The guide describes a browser-based mage-only, turn-based combat demo. Its UX proof is:

1. Sign in with Google.
2. Approve one limited match session.
3. Play without wallet interruptions.
4. Buy a consumable inside combat.
5. Inspect labeled Arbitrum testnet activity afterward.

## Tool Responsibilities

| Tool | Responsibility |
| --- | --- |
| SvelteKit | App shell, routes, login, session approval, game shell, report |
| Phaser 3 | Combat canvas, sprites, effects, attack timing, shield windows |
| Magic | Google login, embedded wallet, provider |
| ZeroDev | Kernel smart account, permissions, paymaster, batching |
| Arbitrum Sepolia | Testnet contracts and transaction proof |
| Solidity and Hardhat | Game contracts and deployment |
| viem | EVM reads, UserOperations, and explorer links |
| Tailwind CSS | Non-game interface styling |

## Runtime Flow

```text
Google login
  -> Magic embedded EOA
  -> ZeroDev Kernel account
  -> one match session permission
  -> Phaser battle
  -> Arbitrum Sepolia transactions
  -> labeled report
```

## Build Order

1. Build the battle with mocked Web3 state: health, mana, attacks, shields, potions, and victory summary.
2. Deploy a test gUSDC faucet and `SessionZeroGame` contract with `startMatch`, `buyAndUsePotion`, and `completeMatch`.
3. Add Magic Google login and obtain the embedded wallet provider.
4. Add ZeroDev and sponsor one simple transaction.
5. Add one permissions configuration with an allowed contract, allowed functions, cap, and expiry.
6. Replace the mocked purchase with the real contract call while keeping gameplay optimistic.
7. Add settlement batching for match completion, digest, reward, and session close.
8. Add the report with human labels, hashes, and explorer links.

## Session Permission Model

The player sees only:

- Maximum spend for the match.
- Match expiry.
- Sponsored gas.
- Approved consumables.

The system enforces:

- `SessionZeroGame` as the allowed contract.
- `buyAndUsePotion` and settlement functions as allowed calls.
- gUSDC as the allowed token.
- The selected spend cap.
- Match end or fallback expiry.
- No arbitrary transfers, withdrawals, NFT transfers, or random `transferFrom` calls.

## Blockchain Boundary

The guide correctly keeps attacks, blocks, hit calculations, and animations offchain. Onchain actions are limited to match start, consumable purchase/use, final result, rewards, and an action-log digest.

This is the critical scope decision. Putting every fireball onchain would make the game slower, more expensive, and much harder to demonstrate. The chain should prove ownership, authorization, purchase, and settlement rather than simulate every frame.

## Guide Corrections And Clarifications

- The guide says JavaScript tooling, not Python, for the game and Web3 runtime.
- The guide uses `.js` examples, but TypeScript is a reasonable modernization because Phaser, viem, and SvelteKit support it and the project crosses typed boundaries.
- The guide's Magic plus ZeroDev flow can produce an embedded EOA address and a separate Kernel smart-account address. This should be hidden behind one player-facing identity.
- EIP-7702 should remain a future path until the complete wallet, provider, and account flow is proven.
- Fiat on-ramp should remain outside the critical testnet demo path.

## Related Research

- [JavaScript game libraries](javascript-game-libraries.md)
- [JavaScript versus Python](javascript-versus-python.md)
- [Game assets and environment](game-assets-and-environment.md)
- [Provider resources](resources.md)
- [Testnet review](testnetreview.md)
