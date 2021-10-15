// Title of the game
title = "Reload";

// Instruction to play the game
description = `
[Hold] Reload
`;

// Sprites in the game
characters = [
	`
 rrrr
rr  rr
rr  rr
 rrrr
`,
	`
 llll
ll l l
llllll
`,
	`
 lll
l l l
lllll
`,
	`
     r
bbbbbr
bbbbbr
bbbbbr
     r
`,
];

// Game Constant
const GAME = {
	WIDTH: 100,
	HEIGHT: 100,
	AMMO_UI_POS_X: 50,
	AMMO_UI_POS_Y: 90,
	AMMO_CD: 40
}

// Different option in the game
options = {
	viewSize: { x: GAME.WIDTH, y: GAME.HEIGHT },
	isPlayingBgm: true,
	isReplayEnabled: true,
	seed: 11,
	theme: "shapeDark"
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
let use;
let load;


// Where game update
function update() {
	// Initialize varaibles
	if (!ticks) {
		enemies = [];
		ammo = [];
		ammonRemain = 5;
		addAmmoCD = GAME.AMMO_CD;
		reloadDuration = 0;
		shooting = new Boolean(true);
		use = new Boolean(true);
		load = new Boolean(false);
		nextEnemyTicks = 0;
		player = { pos: vec(50, 50), angle: -PI / 2 };
	}

	// Add Ammo Remain UI and Particle effects
	if (ammonRemain < 1) {
		if (use && ammonRemain == 0) {
			color("yellow");
			particle(vec(GAME.AMMO_UI_POS_X - 20, GAME.AMMO_UI_POS_Y));
			use = false;
		}
		color("transparent");
	} else {
		if (load && ammonRemain == 1) {
			color("black");
			particle(vec(GAME.AMMO_UI_POS_X - 20, GAME.AMMO_UI_POS_Y));
			load = false;
		}
		color("black");
	}
	char("d", vec(GAME.AMMO_UI_POS_X - 20, GAME.AMMO_UI_POS_Y));
	if (ammonRemain < 2) {
		if (use && ammonRemain == 1) {
			color("yellow");
			particle(vec(GAME.AMMO_UI_POS_X - 10, GAME.AMMO_UI_POS_Y));
			use = false;
		}
		color("transparent");
	} else {
		if (load && ammonRemain == 2) {
			color("black");
			particle(vec(GAME.AMMO_UI_POS_X - 10, GAME.AMMO_UI_POS_Y));
			load = false;
		}
		color("black");
	}
	char("d", vec(GAME.AMMO_UI_POS_X - 10, GAME.AMMO_UI_POS_Y));
	if (ammonRemain < 3) {
		if (use && ammonRemain == 2) {
			color("yellow");
			particle(vec(GAME.AMMO_UI_POS_X, GAME.AMMO_UI_POS_Y));
			use = false;
		}
		color("transparent");
	} else {
		if (load && ammonRemain == 3) {
			color("black");
			particle(vec(GAME.AMMO_UI_POS_X, GAME.AMMO_UI_POS_Y));
			load = false;
		}
		color("black");
	}
	char("d", vec(GAME.AMMO_UI_POS_X, GAME.AMMO_UI_POS_Y));
	if (ammonRemain < 4) {
		if (use && ammonRemain == 3) {
			color("yellow");
			particle(vec(GAME.AMMO_UI_POS_X + 10, GAME.AMMO_UI_POS_Y));
			use = false;
		}
		color("transparent");
	} else {
		if (load && ammonRemain == 4) {
			color("black");
			particle(vec(GAME.AMMO_UI_POS_X + 10, GAME.AMMO_UI_POS_Y));
			load = false;
		}
		color("black");
	}
	char("d", vec(GAME.AMMO_UI_POS_X + 10, GAME.AMMO_UI_POS_Y));
	if (ammonRemain < 5) {
		if (use && ammonRemain == 4) {
			color("yellow");
			particle(vec(GAME.AMMO_UI_POS_X + 20, GAME.AMMO_UI_POS_Y));
			use = false;
		}
		color("transparent");
	} else {
		if (load && ammonRemain == 5) {
			color("black");
			particle(vec(GAME.AMMO_UI_POS_X + 20, GAME.AMMO_UI_POS_Y));
			load = false;
		}
		color("black");
	}
	char("d", vec(GAME.AMMO_UI_POS_X + 20, GAME.AMMO_UI_POS_Y));

	// Reload Function
	if (input.isPressed && ammonRemain < 5) {
		shooting = false;
		shotRange = 0;
		addAmmoCD--
		reloadDuration++;
		if (addAmmoCD < 0) {
			load = true;
			play("coin");
			ammonRemain++;
			if (reloadDuration < 61) {
				addAmmoCD = GAME.AMMO_CD - sqrt(difficulty);
			} else if (reloadDuration > 61 && reloadDuration < 121) {
				addAmmoCD = GAME.AMMO_CD - 20 - sqrt(difficulty);
			} else if (reloadDuration > 121 && reloadDuration < 181) {
				addAmmoCD = GAME.AMMO_CD - 40 - sqrt(difficulty);
			} else {
				addAmmoCD = GAME.AMMO_CD - 50 - sqrt(difficulty);
			}
		}
	}
	if (input.isJustReleased) {
		shotRange = 30;
		addAmmoCD = GAME.AMMO_CD - sqrt(difficulty);
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
		const av = 0.1 * sqrt(difficulty);
		if (abs(oa) < av) {
			player.angle = ta;
		} else {
			player.angle += oa < 0 ? -av : av;
		}
	}

	// Create Fire Line into the game
	color("white");
	bar(player.pos, shotRange * 1.1, 2, player.angle, 0);

	// Create player sprite into the game
	color("blue");
	char("a", player.pos);

	// Create Player Gun into the game
	color("cyan");
	bar(player.pos, 5, 2, player.angle, 0);

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

		// Enemy Collider
		color("black");
		const c3 = char(addWithCharCode("b", floor(ticks / 30) % 2), e.pos, {
			mirror: { x: abs(wrap(player.angle, -PI, PI)) < PI / 2 ? 1 : -1 },
		}).isColliding;

		// End Condition
		if (c3.char.a || c3.char.a) {
			play("lucky");
			end();
		}

		// When enemy enter player fire range
		if (c3.rect.white) {
			if (ammonRemain > 0 && shooting) {
				ammonRemain--;
				use = true;
				play("laser");
				color("cyan");
				bar(player.pos, shotRange, 4, player.angle, 0);
				particle(player.pos, 20, 3, player.angle, 0);
				color("red");
				particle(e.pos);
				addScore(1, e.pos);
				return true;
			}
		}
	});
}
