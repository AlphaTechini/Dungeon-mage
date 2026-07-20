# Smart Contracts

This directory holds the Arbitrum Sepolia settlement contract. It intentionally proves only match authorization, capped native-ETH consumable spending, and a final action digest. Combat simulation remains offchain.

## Decisions

- `SessionZeroGame` uses Arbitrum Sepolia ETH so the demo account can be funded directly through an Arbitrum faucet. This removes mock-token minting and ERC-20 approval steps.
- The contract records the aggregate spend cap and match expiry. ZeroDev session permissions duplicate the contract and function constraints client-side, so an authorized session key has two independent boundaries.
- Potion revenue transfers immediately to an immutable treasury. This keeps no pooled balance or admin withdrawal capability in the game contract.

To find match authorization and potion settlement logic visit [SessionZeroGame.sol](file:///C:/game-hackathons/Expedition%2033-DN/contracts/SessionZeroGame.sol).

The Arbitrum Sepolia deployment connection can be found in [../scripts/deploy.mjs](file:///C:/game-hackathons/Expedition%2033-DN/scripts/deploy.mjs).
