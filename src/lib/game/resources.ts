import { ImageSource, Loader } from 'excalibur';

export const resources = {
	arena: new ImageSource('/background(dungeon).png'),
	playerIdle: new ImageSource('/mage idle left_no_bg.png'),
	playerCast: new ImageSource('/mage wand cast_no_bg.png'),
	playerMediumProjectile: new ImageSource('/Mage medium att_no_bg.png'),
	enemyIdle: new ImageSource('/enemy idle_no_bg.png'),
};

export type BattleResources = typeof resources;

export function createLoader() {
	return new Loader(Object.values(resources));
}
