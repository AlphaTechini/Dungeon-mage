import { createKernelAccount } from '@zerodev/sdk/accounts';
import { createKernelAccountClient, createZeroDevPaymasterClient } from '@zerodev/sdk/clients';
import { KERNEL_V3_3, getEntryPoint } from '@zerodev/sdk/constants';
import { signerToEcdsaValidator } from '@zerodev/ecdsa-validator';
import { createPublicClient, http } from 'viem';
import { getWeb3Config, gameChain } from './config';
import { getMagicProvider } from './magic';

export type KernelContext = {
	accountAddress: `0x${string}`;
	client: any;
	ownerValidator: any;
	publicClient: any;
};

export async function createMagicKernelContext(): Promise<KernelContext> {
	const { zeroDevRpcUrl } = getWeb3Config();
	const provider = await getMagicProvider();
	const publicClient = createPublicClient({
		chain: gameChain,
		transport: http(gameChain.rpcUrls.default.http[0]),
	});
	const entryPoint = getEntryPoint('0.7');
	const ownerValidator = await signerToEcdsaValidator(publicClient, {
		signer: provider,
		entryPoint,
		kernelVersion: KERNEL_V3_3,
	});
	const account = await createKernelAccount(publicClient, {
		plugins: { sudo: ownerValidator },
		entryPoint,
		kernelVersion: KERNEL_V3_3,
	});
	const paymaster = createZeroDevPaymasterClient({
		chain: gameChain,
		transport: http(zeroDevRpcUrl),
	});
	const client = createKernelAccountClient({
		account,
		chain: gameChain,
		bundlerTransport: http(zeroDevRpcUrl),
		client: publicClient,
		paymaster: {
			getPaymasterData: paymaster.getPaymasterData,
			getPaymasterStubData: paymaster.getPaymasterStubData,
		},
	});

	return { accountAddress: account.address, client, ownerValidator, publicClient };
}
