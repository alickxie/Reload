// Title of the game
title = "Reload";

// Instruction to play the game
description = `
[Hold] Reload
`;

// Sprites in the game
characters = [
	`
llllll
ll l l
ll l l
llllll
 l  l
 l  l
`,
	`
llllll
ll l l
ll l l
llllll
ll  ll
`,
	`
  lll
ll l l
 llll
 l  l
ll  ll
`,
	`
  lll
ll l l
 llll
  ll
 l  l
 l  l
`,
	`
	 r
bbbbbr
bbbbbr
bbbbbr
	 r
`,
];

// Different option in the game
options = {
	isPlayingBgm: true,
	isReplayEnabled: true,
	seed: 9,
};

// Create different Jsdoc for different elements in the game
/** @type {{pos: Vector, vel: Vector}[]} */
let enemies;
let nextEnemyTicks;
/** @type {{pos: Vector, angle: number}} */
let player;
let shotRange = 30;
/** @type {{pos: Vector}[]} */
let ammo;
let ammonRemain;
let addAmmoCD;
let reloadDuration;
let shooting;

// Where game update
function update() {
	// Initialize varaibles
	if (!ticks) {
		enemies = [];
		ammo = [];
		ammonRemain = 5;
		addAmmoCD = 60;
		reloadDuration = 0;
		shooting = new Boolean(true);
		nextEnemyTicks = 0;
		player = { pos: vec(50, 50), angle: -PI / 2 };
	}
	text(ammonRemain.toString(), 3, 10);
	text(addAmmoCD.toString(), 3, 40);

	if (input.isPressed && ammonRemain < 5) {
		shooting = false;
		shotRange = 0;
		addAmmoCD--
		reloadDuration++;
		if (addAmmoCD <= 0) {
			play("coin");
			ammonRemain++;
			if (reloadDuration < 61) {
				addAmmoCD = 60;
			} else if (reloadDuration > 61 && reloadDuration < 121) {
				addAmmoCD = 40;
			} else if (reloadDuration > 121 && reloadDuration < 181){
				addAmmoCD = 20;
			} else {
				addAmmoCD = 10;
			}
		}
	}
	if (input.isJustReleased) {
		shotRange = 30;
		addAmmoCD = 60;
		reloadDuration = 0;
		shooting = true;
	}

	// Enemy movespeed towards player
	const scr = sqrt(difficulty);

	// Push the enemy into the enemy array with different properties
	if (enemies.length === 0) {
		nextEnemyTicks = 0;
	}
	nextEnemyTicks--;
	if (nextEnemyTicks < 0) {
		const pos = vec(rnd(99), rnd() < 0.5 ? -3 : 3);
		if (rnd() < 0.5) {
			pos.swapXy();
		}
		enemies.push({ pos, vel: vec(rnds(scr) * 0.3, rnds(scr) * 0.3) });
		nextEnemyTicks = rnd(60, 99) / difficulty;
	}

	// Player fire line that will auto aim enemies
	let te;
	let minDist = 99;
	color("transparent");
	enemies.forEach((e) => {
		const d = player.pos.distanceTo(e.pos);
		if (d < minDist) {
			minDist = d;
			te = e;
		}
	});
	if (te != null) {
		// @ts-ignore
		const ta = player.pos.angleTo(te.pos);
		const oa = wrap(ta - player.angle, -PI, PI);
		const av = 0.035 * sqrt(difficulty);
		if (abs(oa) < av) {
			player.angle = ta;
		} else {
			player.angle += oa < 0 ? -av : av;
		}
	}

	// Create Fire Line into the game
	color("light_cyan");
	bar(player.pos, shotRange * 1.1, 2, player.angle, 0);
	// Create player sprite into the game
	color("blue");
	char(addWithCharCode("a", floor(ticks / 20) % 2), player.pos, {
		mirror: { x: abs(wrap(player.angle, -PI, PI)) < PI / 2 ? 1 : -1 },
	});

	// Conditions to remove the enemies from the world,
	// and game over.
	remove(enemies, (e) => {

		// Create and move enemy toward player in the center
		color("black");
		if (e.pos.distanceTo(50, 50) > 30) {
			e.vel.addWithAngle(e.pos.angleTo(50, 50), scr * 0.005);
			e.vel.mul(0.99);
		}
		e.pos.add(e.vel);

		color("transparent");
		const isCollidingWithPlayer = box(e.pos, 2).isColliding.char.a;
		if (isCollidingWithPlayer) {
			play("lucky");
			end();
		}

		color("black");
		const c3 = char(addWithCharCode("c", floor(ticks / 30) % 2), e.pos, {
			mirror: { x: abs(wrap(player.angle, -PI, PI)) < PI / 2 ? 1 : -1 },
		}).isColliding.rect;
		if (c3.light_cyan) {
			if (ammonRemain > 0 && shooting) {
				ammonRemain--;
				play("laser");
				color("cyan");
				bar(player.pos, shotRange, 4, player.angle, 0);
				particle(player.pos, 20, 3, player.angle, 0);
				color("red");
				particle(e.pos);
				addScore(1);
				return true;
			}
		}
	});
}
