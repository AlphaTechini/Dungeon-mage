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
const CAMERA_ZOOM = 0.9;
const BACKDROP_SCALE = 1.12;
const PLAYER_POSITION = vec(330, 780);
const ENEMY_POSITION = vec(1340, 789);
const PLAYER_CAST_POINT = vec(445, 459);
const ENEMY_HIT_POINT = vec(1340, 506);
const PLAYER_SCALE = 0.3;
const ENEMY_SCALE = 0.36;
// These 600px exports are scaled to match the visible height of the original battle poses.
const ENEMY_RELEASE_SCALE = 0.69;
const DAMAGED_PLAYER_SCALE = 0.73;
const ENEMY_CHARGE_OFFSET = vec(0, -13);
const ENEMY_RELEASE_OFFSET = vec(0, -20);
const DAMAGED_PLAYER_OFFSET = vec(0, 0);
const DAMAGE_HOLD_DURATION = 750;
const DAMAGE_FADE_DURATION = 1200;
const MEDIUM_ATTACK_COST = 25;
const METEOR_ATTACK_COST = 50;
const DEFEAT_DISPLAY_DURATION = 1500;
const PROJECTILE_SCALE = 0.28;
const PROJECTILE_CORE_OFFSET = vec(72, 0);
const METEOR_SCALE = 0.52;
const METEOR_START_POSITION = vec(PLAYER_POSITION.x, -340);
const METEOR_LAND_POSITION = vec(PLAYER_POSITION.x, 918);
const PLAYER_METEOR_IMPACT_POINT = vec(PLAYER_POSITION.x, 765);

type BattlePhase =
	| 'idle'
	| 'charge'
	| 'flight'
	| 'impact'
	| 'recover'
	| 'enemyCharge'
	| 'enemyRelease'
	| 'meteorFall'
	| 'meteorImpact'
	| 'enemyRecover'
	| 'defeat';

export interface BattleBars {
	playerHealth: number;
	playerMana: number;
	enemyHealth: number;
	enemyMana: number;
}

export type BattleResult = 'victory' | 'defeat';

export class BattleScene extends Scene {
	private readonly resources: BattleResources;
	private readonly setStatus: (status: string) => void;
	private readonly setBars: (bars: BattleBars) => void;
	private readonly concludeBattle: (result: BattleResult) => void;
	private phase: BattlePhase = 'idle';
	private phaseElapsed = 0;
	private playerHealth = 100;
	private playerMana = 100;
	private enemyHealth = 100;
	private enemyMana = 100;
	private pendingDefeat: BattleResult | undefined;
	private defeatResult: BattleResult | undefined;
	private conclusionSent = false;
	private player!: Actor;
	private damagedPlayer!: Actor;
	private playerDefeated!: Actor;
	private enemy!: Actor;
	private enemyDefeated!: Actor;
	private projectile!: Actor;
	private meteor!: Actor;
	private castGlow!: Actor;
	private castAura!: Actor;
	private groundGlow!: Actor;
	private impactGlow!: Actor;
	private impactCore!: Actor;
	private damageLabel!: Label;
	private defeatLabel!: Label;
	private sceneTint!: Actor;
	private enemyGroundGlow!: Actor;
	private enemyCastAura!: Actor;
	private enemyCastGlow!: Actor;
	private meteorGroundGlow!: Actor;
	private meteorImpactGlow!: Actor;
	private meteorImpactCore!: Actor;
	private meteorTint!: Actor;
	private blastOuter!: Actor;
	private blastInner!: Actor;
	private blastMotes: Actor[] = [];
	private sparks: Actor[] = [];
	private meteorSparks: Actor[] = [];

	public constructor(
		resources: BattleResources,
		setStatus: (status: string) => void,
		setBars: (bars: BattleBars) => void,
		concludeBattle: (result: BattleResult) => void,
	) {
		super();
		this.resources = resources;
		this.setStatus = setStatus;
		this.setBars = setBars;
		this.concludeBattle = concludeBattle;
	}

	public handleKey(code: string) {
		if (this.phase !== 'idle') {
			this.setStatus(this.isDemonTurn() ? 'Demon turn in progress' : 'Attack sequence in progress');
			return;
		}

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
		engine.currentScene.camera.zoom = CAMERA_ZOOM;
		this.publishBars();

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
			case 'enemyCharge':
				this.updateEnemyCharge();
				break;
			case 'enemyRelease':
				this.updateEnemyRelease();
				break;
			case 'meteorFall':
				this.updateMeteorFall();
				break;
			case 'meteorImpact':
				this.updateMeteorImpact(engine);
				break;
			case 'enemyRecover':
				this.updateEnemyRecovery();
				break;
			case 'defeat':
				this.updateDefeat();
				break;
		}
	}

	private addArena() {
		const arena = new Actor({ pos: BATTLE_CENTER, anchor: vec(0.5, 0.5), z: 0 });
		arena.graphics.use(this.resources.arena.toSprite());
		arena.scale = vec(BACKDROP_SCALE, BACKDROP_SCALE);
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
		this.sceneTint.scale = vec(BACKDROP_SCALE, BACKDROP_SCALE);
		this.add(this.sceneTint);
	}

	private addActors() {
		this.player = new Actor({ pos: PLAYER_POSITION, anchor: vec(0.5, 1), z: 10 });
		this.player.graphics.add('idle', this.resources.playerIdle.toSprite());
		this.player.graphics.add('cast', this.resources.playerCast.toSprite());
		this.player.graphics.use('idle');
		this.player.scale = vec(PLAYER_SCALE, PLAYER_SCALE);
		this.add(this.player);

		this.damagedPlayer = new Actor({ pos: PLAYER_POSITION, anchor: vec(0.5, 1), z: 11 });
		this.damagedPlayer.graphics.use(this.resources.playerDamaged.toSprite());
		this.damagedPlayer.scale = vec(DAMAGED_PLAYER_SCALE, DAMAGED_PLAYER_SCALE);
		this.damagedPlayer.graphics.opacity = 0;
		this.add(this.damagedPlayer);

		this.playerDefeated = new Actor({ pos: PLAYER_POSITION, anchor: vec(0.5, 1), z: 12 });
		this.playerDefeated.graphics.use(this.resources.playerDefeated.toSprite());
		this.playerDefeated.scale = vec(0.35, 0.35);
		this.playerDefeated.graphics.opacity = 0;
		this.add(this.playerDefeated);

		this.enemy = new Actor({ pos: ENEMY_POSITION, anchor: vec(0.5, 1), z: 9 });
		this.enemy.graphics.add('idle', this.resources.enemyIdle.toSprite());
		this.enemy.graphics.add('charge', this.resources.enemyLargeCharge.toSprite());
		this.enemy.graphics.add('release', this.resources.enemyLargeRelease.toSprite());
		this.enemy.graphics.use('idle');
		this.enemy.scale = vec(ENEMY_SCALE, ENEMY_SCALE);
		this.add(this.enemy);

		this.enemyDefeated = new Actor({ pos: ENEMY_POSITION, anchor: vec(0.5, 1), z: 12 });
		this.enemyDefeated.graphics.use(this.resources.enemyDefeated.toSprite());
		this.enemyDefeated.scale = vec(0.44, 0.44);
		this.enemyDefeated.graphics.opacity = 0;
		this.add(this.enemyDefeated);

		this.projectile = new Actor({ pos: PLAYER_CAST_POINT, anchor: vec(0.5, 0.5), z: 18 });
		this.projectile.graphics.use(this.resources.playerMediumProjectile.toSprite());
		this.projectile.scale = vec(PROJECTILE_SCALE, PROJECTILE_SCALE);
		this.projectile.graphics.opacity = 0;
		this.add(this.projectile);

		this.meteor = new Actor({ pos: METEOR_START_POSITION, anchor: vec(0.5, 1), z: 18 });
		this.meteor.graphics.use(this.resources.meteor.toSprite());
		this.meteor.scale = vec(METEOR_SCALE, METEOR_SCALE);
		this.meteor.graphics.opacity = 0;
		this.add(this.meteor);
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

		this.enemyGroundGlow = this.createCircle(
			ENEMY_POSITION.add(vec(-45, -24)),
			165,
			new Color(231, 45, 24, 0.38),
			5,
		);
		this.enemyGroundGlow.scale = vec(1.5, 0.18);
		this.enemyGroundGlow.graphics.opacity = 0;
		this.add(this.enemyGroundGlow);

		this.enemyCastAura = this.createCircle(
			ENEMY_POSITION.add(vec(-175, -315)),
			125,
			new Color(232, 44, 24, 0.23),
			12,
		);
		this.enemyCastAura.graphics.opacity = 0;
		this.add(this.enemyCastAura);

		this.enemyCastGlow = this.createCircle(
			ENEMY_POSITION.add(vec(-175, -315)),
			42,
			new Color(255, 235, 207, 0.95),
			13,
		);
		this.enemyCastGlow.graphics.opacity = 0;
		this.add(this.enemyCastGlow);

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

		this.meteorGroundGlow = this.createCircle(
			PLAYER_METEOR_IMPACT_POINT,
			180,
			new Color(255, 78, 23, 0.6),
			20,
		);
		this.meteorGroundGlow.scale = vec(1.8, 0.2);
		this.meteorGroundGlow.graphics.opacity = 0;
		this.add(this.meteorGroundGlow);

		this.meteorImpactGlow = this.createCircle(
			PLAYER_METEOR_IMPACT_POINT,
			260,
			new Color(255, 78, 23, 0.72),
			22,
		);
		this.meteorImpactGlow.graphics.opacity = 0;
		this.add(this.meteorImpactGlow);

		this.meteorImpactCore = this.createCircle(
			PLAYER_METEOR_IMPACT_POINT,
			80,
			new Color(255, 240, 198, 1),
			23,
		);
		this.meteorImpactCore.graphics.opacity = 0;
		this.add(this.meteorImpactCore);

		this.meteorTint = new Actor({
			pos: BATTLE_CENTER,
			width: ARENA_WIDTH,
			height: ARENA_HEIGHT,
			color: new Color(227, 49, 18, 0.2),
			anchor: vec(0.5, 0.5),
			z: 4,
		});
		this.meteorTint.scale = vec(BACKDROP_SCALE, BACKDROP_SCALE);
		this.meteorTint.graphics.opacity = 0;
		this.add(this.meteorTint);

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

		this.defeatLabel = new Label({
			text: 'DEFEATED',
			pos: BATTLE_CENTER,
			color: Color.fromHex('#fff2e7'),
			font: new Font({
				family: 'Georgia',
				size: 104,
				unit: FontUnit.Px,
				textAlign: TextAlign.Center,
				bold: true,
			}),
			z: 30,
		});
		this.defeatLabel.opacity = 0;
		this.add(this.defeatLabel);

		for (let index = 0; index < 8; index += 1) {
			const spark = this.createCircle(ENEMY_HIT_POINT, 8, new Color(224, 187, 255, 0.9), 19);
			spark.graphics.opacity = 0;
			this.sparks.push(spark);
			this.add(spark);
		}

		for (let index = 0; index < 16; index += 1) {
			const spark = this.createCircle(
				PLAYER_METEOR_IMPACT_POINT,
				11,
				new Color(255, 182, 70, 0.95),
				21,
			);
			spark.graphics.opacity = 0;
			this.meteorSparks.push(spark);
			this.add(spark);
		}
	}

	private startMediumAttack() {
		if (this.phase !== 'idle' || !this.player) {
			this.setStatus('Medium Attack is already in motion');
			return;
		}
		if (this.playerMana < MEDIUM_ATTACK_COST) {
			this.setStatus('Not enough mana for Medium Attack');
			return;
		}

		this.phase = 'charge';
		this.phaseElapsed = 0;
		this.playerMana -= MEDIUM_ATTACK_COST;
		this.publishBars();
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
		this.damageLabel.text = '25';
		this.damageLabel.pos = ENEMY_HIT_POINT.add(vec(0, -35));
		this.damageLabel.opacity = 1;
		this.enemyHealth = Math.max(0, this.enemyHealth - MEDIUM_ATTACK_COST);
		this.publishBars();
		if (this.enemyHealth === 0) {
			this.pendingDefeat = 'victory';
		}
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
			if (this.pendingDefeat) {
				this.startDefeat(this.pendingDefeat);
			} else {
				this.phase = 'recover';
				this.phaseElapsed = 0;
			}
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
			this.player.graphics.use('idle');
			this.startDemonTurn();
		}
	}

	private startDemonTurn() {
		this.phase = 'enemyCharge';
		this.phaseElapsed = 0;
		this.enemy.graphics.use('charge');
		this.enemy.pos = ENEMY_POSITION.add(ENEMY_CHARGE_OFFSET);
		this.setStatus('Demon turn: summoning meteor');
	}

	private updateEnemyCharge() {
		const progress = clamp(this.phaseElapsed / 780, 0, 1);
		const pulse = 1 + Math.sin(this.phaseElapsed / 58) * 0.09;
		this.enemy.scale = vec(ENEMY_SCALE * (1 + progress * 0.1), ENEMY_SCALE * (1 + progress * 0.1));
		this.enemy.pos = ENEMY_POSITION.add(ENEMY_CHARGE_OFFSET);
		this.enemyGroundGlow.graphics.opacity = progress * 0.9;
		this.enemyCastAura.scale = vec(pulse * (0.5 + progress * 1.1), pulse * (0.5 + progress * 1.1));
		this.enemyCastAura.graphics.opacity = progress * 0.85;
		this.enemyCastGlow.scale = vec(pulse * (0.6 + progress * 0.8), pulse * (0.6 + progress * 0.8));
		this.enemyCastGlow.graphics.opacity = 0.75 + Math.sin(this.phaseElapsed / 48) * 0.2;
		this.meteorTint.graphics.opacity = progress * 0.34;

		if (progress === 1) {
			this.phase = 'enemyRelease';
			this.phaseElapsed = 0;
			this.enemy.graphics.use('release');
			this.enemy.pos = ENEMY_POSITION.add(ENEMY_RELEASE_OFFSET);
			this.enemy.scale = vec(ENEMY_RELEASE_SCALE, ENEMY_RELEASE_SCALE);
			this.enemyMana = Math.max(0, this.enemyMana - METEOR_ATTACK_COST);
			this.publishBars();
			this.setStatus('Demon releases the meteor');
		}
	}

	private updateEnemyRelease() {
		const progress = clamp(this.phaseElapsed / 900, 0, 1);
		const pulse = 1 + Math.sin(this.phaseElapsed / 42) * 0.08;
		this.enemy.scale = vec(ENEMY_RELEASE_SCALE * pulse, ENEMY_RELEASE_SCALE * pulse);
		this.enemy.pos = ENEMY_POSITION.add(ENEMY_RELEASE_OFFSET);
		this.enemyCastAura.scale = vec(1.1 + pulse * 0.2, 1.1 + pulse * 0.2);
		this.enemyCastAura.graphics.opacity = 0.8 - progress * 0.35;
		this.enemyCastGlow.graphics.opacity = 0.88 - progress * 0.35;
		this.enemyGroundGlow.graphics.opacity = 0.85 - progress * 0.45;
		this.meteorTint.graphics.opacity = 0.34 + progress * 0.08;

		if (progress === 1) {
			this.phase = 'meteorFall';
			this.phaseElapsed = 0;
			this.enemy.graphics.use('idle');
			this.enemy.pos = ENEMY_POSITION;
			this.enemy.scale = vec(ENEMY_SCALE, ENEMY_SCALE);
			this.meteor.pos = METEOR_START_POSITION;
			this.meteor.graphics.opacity = 1;
			this.setStatus('Meteor incoming');
		}
	}

	private updateMeteorFall() {
		const progress = clamp(this.phaseElapsed / 1300, 0, 1);
		const fallProgress = progress * progress;
		this.meteor.pos = lerpVector(METEOR_START_POSITION, METEOR_LAND_POSITION, fallProgress);
		this.meteor.scale = vec(
			METEOR_SCALE * (0.72 + progress * 0.28),
			METEOR_SCALE * (0.72 + progress * 0.28),
		);
		this.enemyGroundGlow.graphics.opacity = (1 - progress) * 0.85;
		this.enemyCastAura.graphics.opacity = (1 - progress) * 0.8;
		this.enemyCastGlow.graphics.opacity = (1 - progress) * 0.9;
		this.meteorTint.graphics.opacity = 0.34 + progress * 0.16;

		if (progress === 1) {
			this.beginMeteorImpact();
		}
	}

	private beginMeteorImpact() {
		this.phase = 'meteorImpact';
		this.phaseElapsed = 0;
		this.meteor.graphics.opacity = 0;
		this.meteorGroundGlow.graphics.opacity = 1;
		this.meteorImpactGlow.graphics.opacity = 1;
		this.meteorImpactCore.graphics.opacity = 1;
		this.damagedPlayer.pos = PLAYER_POSITION.add(DAMAGED_PLAYER_OFFSET);
		this.damagedPlayer.scale = vec(DAMAGED_PLAYER_SCALE, DAMAGED_PLAYER_SCALE);
		this.damagedPlayer.graphics.opacity = 1;
		this.damageLabel.text = '50';
		this.damageLabel.pos = PLAYER_METEOR_IMPACT_POINT.add(vec(0, -80));
		this.damageLabel.opacity = 1;
		this.playerHealth = Math.max(0, this.playerHealth - METEOR_ATTACK_COST);
		this.publishBars();
		if (this.playerHealth === 0) {
			this.pendingDefeat = 'defeat';
		}
		this.setStatus('Meteor impact for 50');

		this.meteorSparks.forEach((spark, index) => {
			const angle = (Math.PI * 2 * index) / this.meteorSparks.length;
			const speed = 280 + (index % 4) * 55;
			spark.pos = PLAYER_METEOR_IMPACT_POINT;
			spark.vel = vec(Math.cos(angle) * speed, Math.sin(angle) * speed - 90);
			spark.graphics.opacity = 1;
		});
	}

	private updateMeteorImpact(engine: Engine) {
		const progress = clamp(this.phaseElapsed / 680, 0, 1);
		this.meteorGroundGlow.scale = vec(1.2 + progress * 2.1, 0.16 + progress * 0.16);
		this.meteorGroundGlow.graphics.opacity = 1 - progress;
		this.meteorImpactGlow.scale = vec(0.35 + progress * 1.8, 0.35 + progress * 1.8);
		this.meteorImpactGlow.graphics.opacity = 1 - progress;
		this.meteorImpactCore.scale = vec(0.8 + progress * 2.3, 0.8 + progress * 2.3);
		this.meteorImpactCore.graphics.opacity = 1 - progress;
		this.player.pos = PLAYER_POSITION.add(vec(30 * (1 - progress), 0));
		this.player.graphics.opacity = progress < 0.25 ? 0.34 : 1;
		this.damagedPlayer.pos = this.player.pos.add(DAMAGED_PLAYER_OFFSET);
		this.damagedPlayer.graphics.opacity = 1;
		this.damageLabel.pos = PLAYER_METEOR_IMPACT_POINT.add(vec(0, -80 - progress * 100));
		this.damageLabel.opacity = 1 - progress;
		this.meteorSparks.forEach((spark) => {
			spark.graphics.opacity = Math.max(0, 1 - progress * 1.3);
		});
		this.meteorTint.graphics.opacity = (1 - progress) * 0.5;

		if (this.phaseElapsed < 25) {
			engine.currentScene.camera.shake(34, 24, 520);
		}

		if (progress === 1) {
			this.meteorSparks.forEach((spark) => {
				spark.vel = Vector.Zero;
				spark.graphics.opacity = 0;
			});
			if (this.pendingDefeat) {
				this.startDefeat(this.pendingDefeat);
			} else {
				this.phase = 'enemyRecover';
				this.phaseElapsed = 0;
			}
		}
	}

	private updateEnemyRecovery() {
		const recoveryElapsed = Math.max(0, this.phaseElapsed - DAMAGE_HOLD_DURATION);
		const progress = clamp(recoveryElapsed / DAMAGE_FADE_DURATION, 0, 1);
		this.enemy.scale = vec(
			ENEMY_SCALE * (1.1 - progress * 0.1),
			ENEMY_SCALE * (1.1 - progress * 0.1),
		);
		this.player.pos = lerpVector(PLAYER_POSITION.add(vec(4, 0)), PLAYER_POSITION, progress);
		this.damagedPlayer.pos = this.player.pos.add(DAMAGED_PLAYER_OFFSET);
		this.damagedPlayer.graphics.opacity = 1 - progress;

		if (progress === 1) {
			this.enemy.graphics.use('idle');
			this.player.scale = vec(PLAYER_SCALE, PLAYER_SCALE);
			this.player.graphics.opacity = 1;
			this.damagedPlayer.graphics.opacity = 0;
			this.phase = 'idle';
			this.phaseElapsed = 0;
			this.setStatus('Ready: press Right Arrow to cast Medium Attack');
		}
	}

	private publishBars() {
		this.setBars({
			playerHealth: this.playerHealth,
			playerMana: this.playerMana,
			enemyHealth: this.enemyHealth,
			enemyMana: this.enemyMana,
		});
	}

	private startDefeat(result: BattleResult) {
		this.phase = 'defeat';
		this.phaseElapsed = 0;
		this.pendingDefeat = undefined;
		this.defeatResult = result;
		this.player.graphics.opacity = result === 'defeat' ? 0 : 1;
		this.enemy.graphics.opacity = result === 'victory' ? 0 : 1;
		this.damagedPlayer.graphics.opacity = 0;
		this.playerDefeated.graphics.opacity = result === 'defeat' ? 1 : 0;
		this.enemyDefeated.graphics.opacity = result === 'victory' ? 1 : 0;
		this.defeatLabel.text = result === 'victory' ? 'DEMON DEFEATED' : 'MAGE DEFEATED';
		this.defeatLabel.color =
			result === 'victory' ? Color.fromHex('#f4d5ff') : Color.fromHex('#ffd7c2');
		this.defeatLabel.opacity = 1;
		this.setStatus(result === 'victory' ? 'Demon defeated' : 'Mage defeated');
	}

	private updateDefeat() {
		if (this.phaseElapsed >= DEFEAT_DISPLAY_DURATION && this.defeatResult && !this.conclusionSent) {
			this.conclusionSent = true;
			this.concludeBattle(this.defeatResult);
		}
	}

	private isDemonTurn() {
		return ['enemyCharge', 'enemyRelease', 'meteorFall', 'meteorImpact', 'enemyRecover'].includes(
			this.phase,
		);
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
