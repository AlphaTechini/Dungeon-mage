# Web3 Service Layer

This directory is the browser-only boundary for Magic, ZeroDev, and Arbitrum Sepolia. It is separate from `src/lib/game/`, so authentication and UserOperation latency cannot enter the Excalibur frame loop.

## Decisions

- Magic Email OTP supplies the embedded EOA. The derived Kernel address is the address that must receive Arbitrum Sepolia ETH from a faucet.
- The Kernel client uses the configured ZeroDev RPC for bundling and gas sponsorship, while reads use Arbitrum's public Sepolia RPC.
- The session key permits only the deployed game contract, the active match ID, the potion value cap, completion, and the approved expiry.

To find public provider configuration visit [config.ts](file:///C:/game-hackathons/Expedition%2033-DN/src/lib/web3/config.ts).

To find Magic Email OTP logic visit [magic.ts](file:///C:/game-hackathons/Expedition%2033-DN/src/lib/web3/magic.ts).

To find Kernel creation and sponsored UserOperation configuration visit [kernel.ts](file:///C:/game-hackathons/Expedition%2033-DN/src/lib/web3/kernel.ts).

To find session-key permission logic visit [session.ts](file:///C:/game-hackathons/Expedition%2033-DN/src/lib/web3/session.ts).

The Arbitrum contract-call connection can be found in [actions.ts](file:///C:/game-hackathons/Expedition%2033-DN/src/lib/web3/actions.ts).
