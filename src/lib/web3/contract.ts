export const sessionZeroGameAbi = [
	{
		type: 'function',
		name: 'startMatch',
		stateMutability: 'nonpayable',
		inputs: [
			{ name: 'matchId', type: 'bytes32' },
			{ name: 'spendCap', type: 'uint96' },
			{ name: 'expiresAt', type: 'uint48' },
		],
		outputs: [],
	},
	{
		type: 'function',
		name: 'buyAndUsePotion',
		stateMutability: 'payable',
		inputs: [{ name: 'matchId', type: 'bytes32' }],
		outputs: [],
	},
	{
		type: 'function',
		name: 'completeMatch',
		stateMutability: 'nonpayable',
		inputs: [
			{ name: 'matchId', type: 'bytes32' },
			{ name: 'actionDigest', type: 'bytes32' },
		],
		outputs: [],
	},
	{
		type: 'function',
		name: 'potionPrice',
		stateMutability: 'view',
		inputs: [],
		outputs: [{ name: '', type: 'uint96' }],
	},
] as const;
