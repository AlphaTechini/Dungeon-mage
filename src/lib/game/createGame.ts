import { Color, Engine } from 'excalibur';
import { BattleScene } from './BattleScene';
import { createLoader, resources } from './resources';

const ARENA_WIDTH = 1672;
const ARENA_HEIGHT = 941;

export interface GameController {
	destroy: () => void;
	handleKey: (code: string) => void;
}

export function createGame(
	canvas: HTMLCanvasElement,
	setStatus: (status: string) => void,
): GameController {
	const engine = new Engine({
		canvasElement: canvas,
		width: ARENA_WIDTH,
		height: ARENA_HEIGHT,
		backgroundColor: Color.fromHex('#120c1e'),
		antialiasing: true,
		physics: false,
	});
	const scene = new BattleScene(resources, setStatus);
	let destroyed = false;

	engine.addScene('battle', scene);
	void engine.goToScene('battle');
	void engine.start(createLoader()).catch(() => {
		if (!destroyed) {
			setStatus('Unable to load the battle assets');
		}
	});

	return {
		destroy() {
			destroyed = true;
			engine.stop();
		},
		handleKey(code) {
			scene.handleKey(code);
		},
	};
}
