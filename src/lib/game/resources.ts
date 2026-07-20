import { ImageSource, Loader } from 'excalibur';

export const resources = {
	arena: new ImageSource('/background(dungeon).png'),
	playerIdle: new ImageSource('/mage idle left_no_bg.png'),
	playerDamaged: new ImageSource('/mage damaged by att.png'),
	playerDefeated: new ImageSource('/Mage defeated_no_bg.png'),
	playerCast: new ImageSource('/mage wand cast_no_bg.png'),
	playerMediumProjectile: new ImageSource('/Mage medium att_no_bg.png'),
	enemyIdle: new ImageSource('/enemy idle_no_bg.png'),
	enemyDefeated: new ImageSource('/enemy defeated-remove-bg-io.png'),
	enemyLargeCharge: new ImageSource('/enemy large att charge_no_bg.png'),
	enemyLargeRelease: new ImageSource('/enemy release large att-no-bg.png'),
	meteor: new ImageSource('/transparent meteor.png'),
};

export type BattleResources = typeof resources;

export function createLoader() {
	return new Loader(Object.values(resources));
}
