import {
	Actor,
	Color,
	Engine,
	Font,
	FontUnit,
	Label,
	Scene,
	TextAlign,
	Vector,
	vec,
} from 'excalibur';
import type { BattleResources } from './resources';

const ARENA_WIDTH = 1672;
const ARENA_HEIGHT = 941;
const BATTLE_CENTER = vec(ARENA_WIDTH / 2, ARENA_HEIGHT / 2);
const PLAYER_POSITION = vec(500, 790);
const ENEMY_POSITION = vec(1120, 804);
const PLAYER_CAST_POINT = vec(660, 340);
const ENEMY_HIT_POINT = vec(1120, 410);
const PLAYER_SCALE = 0.42;
const ENEMY_SCALE = 0.5;
const PROJECTILE_SCALE = 0.28;
const PROJECTILE_CORE_OFFSET = vec(72, 0);

type BattlePhase = 'idle' | 'charge' | 'flight' | 'impact' | 'recover';

export class BattleScene extends Scene {
	private readonly resources: BattleResources;
	private readonly setStatus: (status: string) => void;
	private phase: BattlePhase = 'idle';
	private phaseElapsed = 0;
	private player!: Actor;
	private enemy!: Actor;
	private projectile!: Actor;
	private castGlow!: Actor;
	private castAura!: Actor;
	private groundGlow!: Actor;
	private impactGlow!: Actor;
	private impactCore!: Actor;
	private damageLabel!: Label;
	private sceneTint!: Actor;
	private blastOuter!: Actor;
	private blastInner!: Actor;
	private blastMotes: Actor[] = [];
	private sparks: Actor[] = [];

	public constructor(resources: BattleResources, setStatus: (status: string) => void) {
		super();
		this.resources = resources;
		this.setStatus = setStatus;
	}

	public handleKey(code: string) {
		if (code === 'ArrowRight') {
			this.startMediumAttack();
			return;
		}

		const moveName =
			code === 'ArrowLeft'
				? 'Small Attack'
				: code === 'ArrowDown'
					? 'Shield'
					: code === 'ArrowUp'
						? 'Big Attack'
						: undefined;

		if (moveName) {
			this.setStatus(`${moveName} is coming soon`);
		}
	}

	public onInitialize(engine: Engine) {
		engine.currentScene.camera.pos = BATTLE_CENTER;
		engine.currentScene.camera.zoom = 1;

		this.addArena();
		this.addActors();
		this.addEffects();
	}

	public onPreUpdate(engine: Engine, elapsed: number) {
		this.phaseElapsed += elapsed;
		this.updateIdleMotion();

		switch (this.phase) {
			case 'charge':
				this.updateCharge();
				break;
			case 'flight':
				this.updateProjectile();
				break;
			case 'impact':
				this.updateImpact(engine);
				break;
			case 'recover':
				this.updateRecovery();
				break;
		}
	}

	private addArena() {
		const arena = new Actor({ pos: BATTLE_CENTER, anchor: vec(0.5, 0.5), z: 0 });
		arena.graphics.use(this.resources.arena.toSprite());
		this.add(arena);

		const playerShadow = this.createCircle(
			PLAYER_POSITION.add(vec(20, -19)),
			120,
			new Color(11, 5, 21, 0.5),
			2,
		);
		playerShadow.scale = vec(1.35, 0.22);
		this.add(playerShadow);

		const enemyShadow = this.createCircle(
			ENEMY_POSITION.add(vec(0, -32)),
			105,
			new Color(14, 4, 12, 0.48),
			2,
		);
		enemyShadow.scale = vec(1.2, 0.2);
		this.add(enemyShadow);

		this.sceneTint = new Actor({
			pos: BATTLE_CENTER,
			width: ARENA_WIDTH,
			height: ARENA_HEIGHT,
			color: new Color(91, 35, 180, 0.16),
			anchor: vec(0.5, 0.5),
			z: 3,
		});
		this.sceneTint.graphics.opacity = 0;
		this.add(this.sceneTint);
	}

	private addActors() {
		this.player = new Actor({ pos: PLAYER_POSITION, anchor: vec(0.5, 1), z: 10 });
		this.player.graphics.add('idle', this.resources.playerIdle.toSprite());
		this.player.graphics.add('cast', this.resources.playerCast.toSprite());
		this.player.graphics.use('idle');
		this.player.scale = vec(PLAYER_SCALE, PLAYER_SCALE);
		this.add(this.player);

		this.enemy = new Actor({ pos: ENEMY_POSITION, anchor: vec(0.5, 1), z: 9 });
		this.enemy.graphics.use(this.resources.enemyIdle.toSprite());
		this.enemy.scale = vec(ENEMY_SCALE, ENEMY_SCALE);
		this.add(this.enemy);

		this.projectile = new Actor({ pos: PLAYER_CAST_POINT, anchor: vec(0.5, 0.5), z: 18 });
		this.projectile.graphics.use(this.resources.playerMediumProjectile.toSprite());
		this.projectile.scale = vec(PROJECTILE_SCALE, PROJECTILE_SCALE);
		this.projectile.graphics.opacity = 0;
		this.add(this.projectile);
	}

	private addEffects() {
		this.groundGlow = this.createCircle(
			PLAYER_POSITION.add(vec(75, -15)),
			145,
			new Color(115, 38, 255, 0.36),
			5,
		);
		this.groundGlow.scale = vec(1.5, 0.18);
		this.groundGlow.graphics.opacity = 0;
		this.add(this.groundGlow);

		this.castAura = this.createCircle(PLAYER_CAST_POINT, 110, new Color(136, 67, 255, 0.18), 12);
		this.castAura.graphics.opacity = 0;
		this.add(this.castAura);

		this.castGlow = this.createCircle(PLAYER_CAST_POINT, 38, new Color(238, 216, 255, 0.95), 13);
		this.castGlow.graphics.opacity = 0;
		this.add(this.castGlow);

		this.blastOuter = this.createCircle(PLAYER_CAST_POINT, 72, new Color(123, 55, 255, 0.45), 15);
		this.blastOuter.graphics.opacity = 0;
		this.add(this.blastOuter);

		this.blastInner = this.createCircle(PLAYER_CAST_POINT, 34, new Color(236, 203, 255, 0.85), 16);
		this.blastInner.graphics.opacity = 0;
		this.add(this.blastInner);

		for (let index = 0; index < 4; index += 1) {
			const mote = this.createCircle(PLAYER_CAST_POINT, 14, new Color(205, 149, 255, 0.9), 17);
			mote.graphics.opacity = 0;
			this.blastMotes.push(mote);
			this.add(mote);
		}

		this.impactGlow = this.createCircle(ENEMY_HIT_POINT, 170, new Color(156, 75, 255, 0.55), 20);
		this.impactGlow.graphics.opacity = 0;
		this.add(this.impactGlow);

		this.impactCore = this.createCircle(ENEMY_HIT_POINT, 55, new Color(255, 243, 255, 1), 21);
		this.impactCore.graphics.opacity = 0;
		this.add(this.impactCore);

		this.damageLabel = new Label({
			text: '25',
			pos: ENEMY_HIT_POINT.add(vec(0, -35)),
			color: Color.fromHex('#fff3ff'),
			font: new Font({
				family: 'system-ui',
				size: 68,
				unit: FontUnit.Px,
				textAlign: TextAlign.Center,
				bold: true,
			}),
			z: 22,
		});
		this.damageLabel.opacity = 0;
		this.add(this.damageLabel);

		for (let index = 0; index < 8; index += 1) {
			const spark = this.createCircle(ENEMY_HIT_POINT, 8, new Color(224, 187, 255, 0.9), 19);
			spark.graphics.opacity = 0;
			this.sparks.push(spark);
			this.add(spark);
		}
	}

	private startMediumAttack() {
		if (this.phase !== 'idle' || !this.player) {
			this.setStatus('Medium Attack is already in motion');
			return;
		}

		this.phase = 'charge';
		this.phaseElapsed = 0;
		this.player.graphics.use('cast');
		this.setStatus('Medium Attack: channeling arcane energy');
	}

	private updateIdleMotion() {
		const time = performance.now() / 1000;
		if (this.phase === 'idle') {
			const playerBreath = 1 + Math.sin(time * 2.2) * 0.008;
			const enemyBreath = 1 + Math.sin(time * 1.8 + 0.7) * 0.008;
			this.player.pos = PLAYER_POSITION;
			this.enemy.pos = ENEMY_POSITION;
			this.player.scale = vec(PLAYER_SCALE * playerBreath, PLAYER_SCALE * playerBreath);
			this.enemy.scale = vec(ENEMY_SCALE * enemyBreath, ENEMY_SCALE * enemyBreath);
			this.player.graphics.use('idle');
		}
	}

	private updateCharge() {
		const progress = clamp(this.phaseElapsed / 720, 0, 1);
		const pulse = 1 + Math.sin(this.phaseElapsed / 65) * 0.07;
		this.player.scale = vec(
			PLAYER_SCALE * (1 + progress * 0.08),
			PLAYER_SCALE * (1 + progress * 0.08),
		);
		this.castAura.scale = vec(pulse * (0.45 + progress * 1.2), pulse * (0.45 + progress * 1.2));
		this.castAura.graphics.opacity = progress * 0.88;
		this.castGlow.scale = vec(pulse * (0.55 + progress * 0.8), pulse * (0.55 + progress * 0.8));
		this.castGlow.graphics.opacity = 0.72 + Math.sin(this.phaseElapsed / 55) * 0.18;
		this.groundGlow.graphics.opacity = progress * 0.9;
		this.sceneTint.graphics.opacity = progress * 0.26;

		if (progress === 1) {
			this.phase = 'flight';
			this.phaseElapsed = 0;
			this.projectile.graphics.opacity = 1;
			this.setStatus('Medium Attack released');
		}
	}

	private updateProjectile() {
		const progress = clamp(this.phaseElapsed / 560, 0, 1);
		const projectilePosition = lerpVector(
			PLAYER_CAST_POINT.sub(PROJECTILE_CORE_OFFSET),
			ENEMY_HIT_POINT.sub(PROJECTILE_CORE_OFFSET),
			progress,
		);
		this.projectile.pos = projectilePosition.add(vec(0, -Math.sin(progress * Math.PI) * 42));
		this.projectile.scale = vec(
			PROJECTILE_SCALE + progress * 0.045,
			PROJECTILE_SCALE + progress * 0.045,
		);
		this.updateBlast(progress, this.projectile.pos.add(PROJECTILE_CORE_OFFSET));
		this.castAura.graphics.opacity = (1 - progress) * 0.85;
		this.castGlow.graphics.opacity = (1 - progress) * 0.9;
		this.groundGlow.graphics.opacity = (1 - progress) * 0.8;
		this.sceneTint.graphics.opacity = (1 - progress) * 0.2;

		if (progress === 1) {
			this.beginImpact();
		}
	}

	private beginImpact() {
		this.phase = 'impact';
		this.phaseElapsed = 0;
		this.projectile.graphics.opacity = 0;
		this.hideBlast();
		this.impactGlow.graphics.opacity = 1;
		this.impactCore.graphics.opacity = 1;
		this.damageLabel.pos = ENEMY_HIT_POINT.add(vec(0, -35));
		this.damageLabel.opacity = 1;
		this.setStatus('Medium Attack hit for 25');

		this.sparks.forEach((spark, index) => {
			const angle = (Math.PI * 2 * index) / this.sparks.length;
			spark.pos = ENEMY_HIT_POINT;
			spark.vel = vec(Math.cos(angle) * 260, Math.sin(angle) * 220);
			spark.graphics.opacity = 1;
		});
	}

	private updateImpact(engine: Engine) {
		const progress = clamp(this.phaseElapsed / 480, 0, 1);
		this.impactGlow.scale = vec(0.45 + progress * 1.55, 0.45 + progress * 1.55);
		this.impactGlow.graphics.opacity = 1 - progress;
		this.impactCore.scale = vec(1 + progress * 1.7, 1 + progress * 1.7);
		this.impactCore.graphics.opacity = 1 - progress;
		this.enemy.pos = ENEMY_POSITION.add(vec(-20 * (1 - progress), 0));
		this.enemy.graphics.opacity = progress < 0.22 ? 0.42 : 1;
		this.damageLabel.pos = ENEMY_HIT_POINT.add(vec(0, -35 - progress * 92));
		this.damageLabel.opacity = 1 - progress;
		this.sparks.forEach((spark) => {
			spark.graphics.opacity = Math.max(0, 1 - progress * 1.5);
		});
		this.sceneTint.graphics.opacity = (1 - progress) * 0.22;

		if (this.phaseElapsed < 25) {
			engine.currentScene.camera.shake(15, 10, 220);
		}

		if (progress === 1) {
			this.sparks.forEach((spark) => {
				spark.vel = Vector.Zero;
				spark.graphics.opacity = 0;
			});
			this.phase = 'recover';
			this.phaseElapsed = 0;
		}
	}

	private updateRecovery() {
		const progress = clamp(this.phaseElapsed / 440, 0, 1);
		this.player.scale = vec(
			PLAYER_SCALE * (1.08 - progress * 0.08),
			PLAYER_SCALE * (1.08 - progress * 0.08),
		);
		this.enemy.pos = lerpVector(ENEMY_POSITION.add(vec(-4, 0)), ENEMY_POSITION, progress);

		if (progress === 1) {
			this.phase = 'idle';
			this.phaseElapsed = 0;
			this.player.graphics.use('idle');
			this.setStatus('Ready: press Right Arrow to cast Medium Attack');
		}
	}

	private createCircle(position: Vector, radius: number, color: Color, z: number) {
		return new Actor({ pos: position, radius, color, anchor: vec(0.5, 0.5), z });
	}

	private updateBlast(progress: number, corePosition: Vector) {
		const delta = corePosition.sub(PLAYER_CAST_POINT);
		const distance = Math.hypot(delta.x, delta.y);
		const pulse = 1 + Math.sin(this.phaseElapsed / 42) * 0.12;
		const midpoint = PLAYER_CAST_POINT.add(delta.scale(0.5));
		const angle = Math.atan2(delta.y, delta.x);

		this.blastOuter.pos = midpoint;
		this.blastOuter.rotation = angle;
		this.blastOuter.scale = vec(distance / 144, 0.42 * pulse);
		this.blastOuter.graphics.opacity = 0.3 + Math.sin(this.phaseElapsed / 48) * 0.08;

		this.blastInner.pos = midpoint;
		this.blastInner.rotation = angle;
		this.blastInner.scale = vec(distance / 68, 0.28 * pulse);
		this.blastInner.graphics.opacity = 0.72;

		this.blastMotes.forEach((mote, index) => {
			const trailProgress = Math.max(0, progress - (index + 1) * 0.11);
			const trailPoint = lerpVector(
				PLAYER_CAST_POINT,
				corePosition,
				trailProgress / Math.max(progress, 0.01),
			);
			mote.pos = trailPoint;
			mote.scale = vec(0.45 + index * 0.08, 0.45 + index * 0.08);
			mote.graphics.opacity = progress > (index + 1) * 0.08 ? 0.75 - index * 0.1 : 0;
		});
	}

	private hideBlast() {
		this.blastOuter.graphics.opacity = 0;
		this.blastInner.graphics.opacity = 0;
		this.blastMotes.forEach((mote) => {
			mote.graphics.opacity = 0;
		});
	}
}

function clamp(value: number, minimum: number, maximum: number) {
	return Math.min(Math.max(value, minimum), maximum);
}

function lerpVector(start: Vector, end: Vector, progress: number) {
	return vec(start.x + (end.x - start.x) * progress, start.y + (end.y - start.y) * progress);
}
