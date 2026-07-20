import { readFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import solc from 'solc';

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
if (errors.length > 0) {
	throw new Error(errors.map((diagnostic) => diagnostic.formattedMessage).join('\n'));
}

const contract = result.contracts['SessionZeroGame.sol'].SessionZeroGame;
console.log(
	JSON.stringify({ abi: contract.abi, bytecode: `0x${contract.evm.bytecode.object}` }, null, 2),
);
