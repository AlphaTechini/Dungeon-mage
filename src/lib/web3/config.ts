import { env } from '$env/dynamic/public';
import { arbitrumSepolia } from 'viem/chains';

export const gameChain = arbitrumSepolia;
export const arbiscanBaseUrl = 'https://sepolia.arbiscan.io';

export function getWeb3Config() {
	const magicPublishableKey = env.PUBLIC_MAGIC_PUBLISHABLE_KEY;
	const zeroDevRpcUrl = env.PUBLIC_ZERODEV_RPC_URL;
	const gameAddress = env.PUBLIC_SESSION_ZERO_GAME_ADDRESS;

	if (!magicPublishableKey || !zeroDevRpcUrl || !gameAddress) {
		throw new Error('Set the required PUBLIC_ values in .env before using the Web3 demo.');
	}

	return { magicPublishableKey, zeroDevRpcUrl, gameAddress: gameAddress as `0x${string}` };
}
