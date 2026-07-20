import { browser } from '$app/environment';
import { Magic } from 'magic-sdk';
import { gameChain, getWeb3Config } from './config';

let magic: Magic | undefined;

function getMagic() {
	if (!browser) throw new Error('Magic can only run in the browser.');

	if (!magic) {
		const { magicPublishableKey } = getWeb3Config();
		magic = new Magic(magicPublishableKey, {
			network: {
				chainId: gameChain.id,
				rpcUrl: gameChain.rpcUrls.default.http[0],
			},
		});
	}

	return magic;
}

export async function loginWithMagic(email: string) {
	if (!email.trim()) throw new Error('Enter an email address.');

	const instance = getMagic();
	await instance.auth.loginWithEmailOTP({ email: email.trim() });
	return instance.user.getInfo();
}

export async function getMagicProvider() {
	return getMagic().rpcProvider;
}
