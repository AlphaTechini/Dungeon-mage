import { readFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import solc from 'solc';
import { createPublicClient, createWalletClient, http, parseEther } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { arbitrumSepolia } from 'viem/chains';

const required = (name) => {
	const value = process.env[name];
	if (!value) throw new Error(`${name} must be set in .env`);
	return value;
};

const contractPath = path.join(process.cwd(), 'contracts', 'SessionZeroGame.sol');
const source = await readFile(contractPath, 'utf8');
const result = JSON.parse(
	solc.compile(
		JSON.stringify({
			language: 'Solidity',
			sources: { 'SessionZeroGame.sol': { content: source } },
			settings: {
				optimizer: { enabled: true, runs: 200 },
				outputSelection: { '*': { '*': ['abi', 'evm.bytecode.object'] } },
			},
		}),
	),
);

const errors = result.errors?.filter((diagnostic) => diagnostic.severity === 'error') ?? [];
if (errors.length > 0)
	throw new Error(errors.map((diagnostic) => diagnostic.formattedMessage).join('\n'));

const artifact = result.contracts['SessionZeroGame.sol'].SessionZeroGame;
const account = privateKeyToAccount(required('ARBITRUM_SEPOLIA_DEPLOYER_PRIVATE_KEY'));
const transport = http('https://sepolia-rollup.arbitrum.io/rpc');
const walletClient = createWalletClient({ account, chain: arbitrumSepolia, transport });
const publicClient = createPublicClient({ chain: arbitrumSepolia, transport });
const hash = await walletClient.deployContract({
	abi: artifact.abi,
	bytecode: `0x${artifact.evm.bytecode.object}`,
	args: [required('ARBITRUM_SEPOLIA_TREASURY_ADDRESS'), parseEther('0.0001')],
});
const receipt = await publicClient.waitForTransactionReceipt({ hash });

console.log(`SessionZeroGame deployed: ${receipt.contractAddress}`);
console.log(`Set PUBLIC_SESSION_ZERO_GAME_ADDRESS=${receipt.contractAddress} in .env`);
console.log(`Explorer: https://sepolia.arbiscan.io/address/${receipt.contractAddress}`);
