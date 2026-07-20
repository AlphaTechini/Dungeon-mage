import { encodeFunctionData, type Hex } from 'viem';
import { sessionZeroGameAbi } from './contract';
import { arbiscanBaseUrl, getWeb3Config } from './config';

async function submit(client: any, data: Hex, value = 0n) {
	const { gameAddress } = getWeb3Config();
	const userOpHash = await client.sendUserOperation({
		callData: await client.account.encodeCalls([{ to: gameAddress, data, value }]),
	});
	const receipt = await client.waitForUserOperationReceipt({ hash: userOpHash });
	const transactionHash = receipt.receipt.transactionHash as Hex | undefined;

	return {
		userOpHash,
		transactionHash,
		explorerUrl: transactionHash ? `${arbiscanBaseUrl}/tx/${transactionHash}` : undefined,
	};
}

export function startMatch(client: any, matchId: Hex, spendCap: bigint, expiresAt: number) {
	return submit(
		client,
		encodeFunctionData({
			abi: sessionZeroGameAbi,
			functionName: 'startMatch',
			args: [matchId, spendCap, expiresAt],
		}),
	);
}

export async function buyAndUsePotion(client: any, matchId: Hex) {
	const { gameAddress } = getWeb3Config();
	const potionPrice = (await client.client.readContract({
		address: gameAddress,
		abi: sessionZeroGameAbi,
		functionName: 'potionPrice',
	})) as bigint;

	return submit(
		client,
		encodeFunctionData({
			abi: sessionZeroGameAbi,
			functionName: 'buyAndUsePotion',
			args: [matchId],
		}),
		potionPrice,
	);
}

export function completeMatch(client: any, matchId: Hex, actionDigest: Hex) {
	return submit(
		client,
		encodeFunctionData({
			abi: sessionZeroGameAbi,
			functionName: 'completeMatch',
			args: [matchId, actionDigest],
		}),
	);
}
