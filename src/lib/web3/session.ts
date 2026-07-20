import { createKernelAccount } from '@zerodev/sdk/accounts';
import { createKernelAccountClient, createZeroDevPaymasterClient } from '@zerodev/sdk/clients';
import { KERNEL_V3_3, getEntryPoint } from '@zerodev/sdk/constants';
import { anyPaymaster, ParamOperator, signerToSessionKeyValidator } from '@zerodev/session-key';
import { generatePrivateKey, privateKeyToAccount } from 'viem/accounts';
import { http } from 'viem';
import { sessionZeroGameAbi } from './contract';
import { getWeb3Config, gameChain } from './config';
import type { KernelContext } from './kernel';

export async function createMatchSession(
	context: KernelContext,
	matchId: `0x${string}`,
	spendCap: bigint,
	expiresAt: number,
) {
	const { gameAddress, zeroDevRpcUrl } = getWeb3Config();
	const sessionSigner = privateKeyToAccount(generatePrivateKey());
	const entryPoint = getEntryPoint('0.7');
	const sessionValidator = await signerToSessionKeyValidator(context.publicClient, {
		signer: sessionSigner,
		entryPoint,
		kernelVersion: KERNEL_V3_3,
		validatorData: {
			validUntil: expiresAt,
			paymaster: anyPaymaster,
			permissions: [
				{
					target: gameAddress,
					valueLimit: spendCap,
					abi: sessionZeroGameAbi,
					functionName: 'buyAndUsePotion',
					args: [{ operator: ParamOperator.EQUAL, value: matchId }],
				},
				{
					target: gameAddress,
					valueLimit: 0n,
					abi: sessionZeroGameAbi,
					functionName: 'completeMatch',
					args: [{ operator: ParamOperator.EQUAL, value: matchId }, null],
				},
			],
		},
	});
	const account = await createKernelAccount(context.publicClient, {
		plugins: { sudo: context.ownerValidator, regular: sessionValidator },
		entryPoint,
		kernelVersion: KERNEL_V3_3,
	});
	const paymaster = createZeroDevPaymasterClient({
		chain: gameChain,
		transport: http(zeroDevRpcUrl),
	});

	return createKernelAccountClient({
		account,
		chain: gameChain,
		bundlerTransport: http(zeroDevRpcUrl),
		client: context.publicClient,
		paymaster: {
			getPaymasterData: paymaster.getPaymasterData,
			getPaymasterStubData: paymaster.getPaymasterStubData,
		},
	});
}
