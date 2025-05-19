/**
 * Renderer/EntityAction.js
 *
 * Manage entity action
 *
 * This file is part of ROBrowser, (http://www.robrowser.com/).
 *
 * @author Vincent Thibault
 */
define(['Renderer/Renderer', 'DB/DBManager'], function( Renderer, DB )
{
	'use strict';


	/**
	 * Action frames
	 */
	function Action()
	{
		this.IDLE       =  0;
		this.ATTACK     = -2;

		this.WALK       = -1;
		this.SIT        = -1;
		this.PICKUP     = -1;
		this.READYFIGHT = -1;
		this.FREEZE     = -1;
		this.HURT       = -1;
		this.DIE        = -1;
		this.FREEZE2    = -1;
		this.ATTACK1    = -1;
		this.ATTACK2    = -1;
		this.ATTACK3    = -1;
		this.SKILL      = -1;
		this.ACTION     = -1;

		this.SPECIAL    = -1;
		this.PERF1      = -1;
		this.PERF2      = -1;
		this.PERF3      = -1;
	}


	/**
	 * Animation object
	 */
	function Animation()
	{
		this.tick    = 0;
		this.frame   = 0;
		this.repeat  = true;
		this.play    = true;
		this.next    = false;
		this.delay   = 0;
		this.save    = false;
	}


	/**
	 * Modify action, reinitialize animation
	 *
	 * @param {object} option
	 */
	 

function setAction(option) {
	var anim = this.animation;

	//this.lastSkillId = this.lastSkillId || 0; // ? fallback
	
const Session = require('Engine/SessionStorage');

// ? ห้ามใช้ท่า SKILL ถ้า flag skip ถูกเปิดไว้
if (option.action === this.ACTION.SKILL && Session.skipNextSkillAnimation) {
	console.log('[SKILL] ?? ปิดท่าใช้สกิลทันที เพราะ skipNextSkillAnimation = true');
	option.action = this.ACTION.IDLE;
	option.play = false;

	// ? เคลียร์ walk path ถ้ามี เพื่อป้องกันค้างจาก Snap
	if (this.walk && this.walk.total > 0) {
		if (typeof this.resetRoute === 'function') {
			this.resetRoute();
			console.log('[SNAP] ?? resetRoute() เรียบร้อย');
		}
		this.walk.total = 0;
		this.walk.index = 0;
	}

	Session.skipNextSkillAnimation = false;
}




	if (option.delay) {
		anim.delay = option.delay + 0;
		option.delay = 0;
		anim.save = option;
	} else {
		// ?? ATTACK: แปลงจาก weapon type
		if (option.action === this.ACTION.ATTACK) {
			if (this.objecttype === this.constructor.TYPE_PC) {
				var attack = DB.getWeaponAction(this.weapon, this._job, this._sex);
				option.action = [this.ACTION.ATTACK1, this.ACTION.ATTACK2, this.ACTION.ATTACK3][attack];
			}
			if (option.action === -2) {
				option.action = this.ACTION.ATTACK1;
			}
		}

		this.action = option.action === -1 || typeof option.action === 'undefined'
			? this.ACTION.IDLE
			: option.action;

	

		anim.tick = Renderer.tick + 0;
		anim.delay = 0;
		anim.frame = option.frame || 0;
		anim.speed = option.speed || false;
		anim.length = option.length || false;
		anim.repeat = option.repeat || false;
		anim.play = typeof option.play !== 'undefined' ? option.play : true;
		anim.next = option.next || false;
		anim.save = false;

		this.sound.free();

		// ? ถ้าเป็นสกิล: รอ 400ms แล้วค่อย setAction
		if (this.action === this.ACTION.SKILL) {
			const self = this;
			if (self.__settingActionSkill) return;

			self.__settingActionSkill = true;

		

setTimeout(() => {
	if (!self || !self.setAction) return;

	const skillId = self.lastSkillId || 0;

	// ? ถ้าใช้ skill ล้มเหลว  ห้ามตั้งท่าใด ๆ
	if (Session.skipNextSkillAnimation && Session.skipNextSkillId === skillId) {
					console.log('[SKILL] ? SKIP delayed animation (fail):', skillId);
					self.lastSkillId = 0;
					Session.skipNextSkillAnimation = false;
					Session.skipNextSkillId = 0;
					self.__settingActionSkill = false;
					
					if (self.resetRoute) {
		self.resetRoute();
		console.log('[SKILL] ?? resetRoute() เพราะ skill ล้มเหลว');
	}
					return;
				}

				// ? กลุ่มที่ 2: ไม่ต้อง setAction เลย
				const skipSetActionSkills = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 24, 25, 26, 28, 29, 31, 32, 33, 34, 45, 51, 60, 66, 67,
  74, 75, 80, 81, 83, 84, 85, 86, 87, 88, 90, 91, 92, 93, 111, 112, 113, 114, 129, 135, 139, 142, 143, 146,
  147, 150, 151, 154, 155, 157, 161, 162, 163, 164, 165, 166, 167, 168, 169, 173, 175, 193, 194, 195, 196,
  197, 198, 201, 204, 205, 208, 209, 214, 228, 243, 244, 247, 249, 252, 254, 257, 258, 264, 268, 269, 272, 273, 274, 275, 276, 277, 278, 279, 280, 281, 282, 283, 284, 285, 286, 287, 288, 289, 290, 291, 292,
  293, 294, 295, 296, 297, 298, 299, 300, 301, 302, 303, 304, 305, 306, 307, 308, 309, 310, 311, 312, 313,
  317, 318, 319, 320, 321, 322, 325, 326, 327, 328, 329, 330, 331, 332, 333, 334, 335, 336, 339, 349, 350,
  352, 354, 355, 356, 357, 358, 359, 360, 362, 364, 365, 366, 368, 369, 371, 372, 373, 378, 380, 383, 384,
  385, 386, 387, 389, 390, 392, 393, 395, 400, 401, 403, 406, 407, 408, 409, 410, 411, 412, 413, 414, 415,
  416, 417, 418, 419, 420, 425, 426, 427, 428, 429, 430, 431, 432, 433, 444, 459, 473, 474, 475, 477, 482,
  483, 484, 486, 488, 492, 493, 495, 496, 497, 498, 500, 504, 505, 506, 507, 516, 517, 527, 531, 532, 535,
  539, 543, 653, 659, 661, 662, 663, 664, 665, 666, 667, 668, 669, 671, 672, 675, 676, 677, 678, 679, 680,
  682, 684, 685, 686, 687, 689, 690, 691, 693, 697, 698, 706, 709, 711, 716, 718, 719, 720, 740, 743, 744,
  745, 1002, 1006, 1007, 1008, 1013, 1014, 1017, 1018, 1019, 2001, 2003, 2005, 2006, 2009, 2011, 2012, 2013,
  2014, 2015, 2016, 2017, 2018, 2019, 2025, 2027, 2028, 2029, 2030, 2033, 2034, 2035, 2036, 2039, 2041, 2042,
  2043, 2045, 2046, 2047, 2048, 2050, 2054, 2057, 2201, 2202, 2203, 2204, 2205, 2206, 2207, 2208, 2209, 2210,
  2211, 2212, 2213, 2214, 2215, 2216, 2217, 2218, 2219, 2220, 2221, 2222, 2223, 2224, 2225, 2226, 2227, 2228,
  2229, 2230, 2231, 2232, 2234, 2240, 2241, 2242, 2246, 2247, 2262, 2263, 2264, 2265, 2267, 2268, 2269, 2270,
  2272, 2273, 2274, 2280, 2285, 2286, 2289, 2290, 2291, 2304, 2309, 2311, 2313, 2315, 2316, 2317, 2318, 2319,
  2320, 2321, 2323, 2325, 2327, 2328, 2329, 2330, 2332, 2333, 2334, 2335, 2337, 2338, 2340, 2346, 2347, 2348,
  2350, 2351, 2352, 2381, 2382, 2420, 2423, 2427, 2428, 2429, 2430, 2431, 2432, 2433, 2434, 2443, 2444, 2445,
  2446, 2447, 2448, 2449, 2450, 2451, 2452, 2453, 2454, 2455, 2456, 2457, 2458, 2459, 2460, 2461, 2462, 2463,
  2464, 2465, 2466, 2467, 2468, 2476, 2478, 2490, 2492, 2494, 2495, 2496, 2497, 2517, 2533, 2534, 2535, 2536,
  2544, 2552, 2556, 2558, 2559, 2561, 2563, 2565, 2568, 2574, 2575, 2576, 2577, 2578, 2579, 2581, 2583, 2584,
  2586, 2588, 2590, 2591, 2592, 2594, 2605, 2607, 2609, 3001, 3007, 3010, 3011, 3012, 3015, 3016, 3017, 3018,
  3022, 3023, 3028, 3035, 3042, 5002, 5005, 5007, 5008, 5010, 5011, 5012, 5013, 5014, 5020, 5022, 5040, 5045,
  5047, 5049, 5050, 5051, 5053, 5055, 5063, 5065, 5067, 5068, 5073, 5076, 5078, 8001, 8002, 8004, 8005, 8006,
  8008, 8010, 8011, 8014, 8016, 8018, 8022, 8023, 8027, 8029, 8030, 8032, 8033, 8035, 8037, 8038, 8039, 8040,
  8042, 8202, 8204, 8205, 8206, 8219, 8220, 8222, 8223, 8224, 8233, 8235, 8401, 8402, 8403, 8404, 8405, 8406,
  8407, 8408, 8409, 8410, 8411, 8412, 8413, 8414, 8415, 8416, 8417, 8418, 8419, 8420, 8421, 8422, 8423, 8424,
  10010, 10011, 10012, 10013, 10015, 10017, 10018, 10019]; // Blitz Beat, Reflect ฯลฯ
				if (skipSetActionSkills.includes(skillId)) {
					console.log('[SKILL] ? SKIP setAction  skillId:', skillId);
					self.lastSkillId = 0;
					self.__settingActionSkill = false;
					return;
				}

				// ? กลุ่มที่ 3: ให้ค้าง IDLE (repeat)
				const forceIdleSkills = [
					40, 41
				];

				let nextAction = self.ACTION.READYFIGHT;
				let repeat = true;

				if (forceIdleSkills.includes(skillId)) {
					nextAction = self.ACTION.IDLE;
					repeat = true;
				}
				
				
		const naturalSkills = [89, 1006]; // เช่น Storm Gust, Heal ฯลฯ
				// ? กลุ่มที่ 3: ปล่อยให้ระบบแสดงเอง (ไม่ setAction)
	if (naturalSkills.includes(skillId)) {
  console.log('[SKILL] ?? Natural skill  ไม่แตะ animation:', skillId);
  self.lastSkillId = 0;
  self.__settingActionSkill = false;
  return; // ? ไม่เข้าเงื่อนไข READYFIGHT หรือ IDLE
}

				console.log('[SKILL]',
					nextAction === self.ACTION.IDLE ? '?? IDLE' : '?? READYFIGHT',
					'?? skillId:', skillId);

				self.setAction({
					action: nextAction,
					frame: 0,
					repeat: repeat,
					play: true,
					speed: false,
					length: false
				});

				self.lastSkillId = 0;
				self.__settingActionSkill = false;
			}, 400);
		}
	}
}











	/**
	 * Initialize Entity action
	 */
	return function Init()
	{
		this.ACTION    = new Action();
		this.animation = new Animation();
		this.setAction = setAction;
		var Entity     = this.constructor;

		switch (this.objecttype) {

			// Define action, base on type
			case Entity.TYPE_PC:
			case Entity.TYPE_DISGUISED:
				this.ACTION.IDLE       = 0;
				this.ACTION.WALK       = 1;
				this.ACTION.SIT        = 2;
				this.ACTION.PICKUP     = 3;
				this.ACTION.READYFIGHT = 4;
				this.ACTION.ATTACK1    = 5;
				this.ACTION.HURT       = 6;
				this.ACTION.FREEZE     = 7;
				this.ACTION.DIE        = 8;
				this.ACTION.FREEZE2    = 9;
				this.ACTION.ATTACK2    = 10;
				this.ACTION.ATTACK3    = 11;
				this.ACTION.SKILL      = 12;
				break;

			// Mob action
			case Entity.TYPE_MOB:
			case Entity.TYPE_NPC_ABR:
			case Entity.TYPE_NPC_BIONIC:
			case Entity.TYPE_WUG:
				this.ACTION.IDLE   = 0;
				this.ACTION.WALK   = 1;
				this.ACTION.ATTACK = 2;
				this.ACTION.HURT   = 3;
				this.ACTION.DIE    = 4;
				break;

			case Entity.TYPE_PET:
				this.ACTION.IDLE     = 0;
				this.ACTION.WALK     = 1;
				this.ACTION.ATTACK   = 2;
				this.ACTION.HURT     = 3;
				this.ACTION.DIE      = 4;
				this.ACTION.SPECIAL  = 5;
				this.ACTION.PERF1    = 6;
				this.ACTION.PERF2    = 7;
				this.ACTION.PERF3    = 8;
				break;

			// NPC action
			case Entity.TYPE_NPC:
			case Entity.TYPE_NPC2:
				this.ACTION.IDLE   = 0;
				// For those NPC that move with unitwalk scriptcommand
				this.ACTION.WALK   = 1;
				break;

			// When you see a warp with /effect, it's 3 times bigger.
			// TODO: put it somewhere else
			case Entity.TYPE_WARP:
				this.xSize       = 20;
				this.ySize       = 20;
				break;

			// Homunculus
			case Entity.TYPE_HOM:
			case Entity.TYPE_MERC:
			case Entity.TYPE_ELEM:
				this.ACTION.IDLE    = 0;
				this.ACTION.WALK    = 1;
				this.ACTION.ATTACK  = 2;
				this.ACTION.HURT    = 3;
				this.ACTION.DIE     = 4;
				this.ACTION.ATTACK2 = 5;
				this.ACTION.ATTACK3 = 6;
				this.ACTION.ACTION  = 7;
				break;
			
			case Entity.TYPE_FALCON:
				this.ACTION.IDLE    = 0;
				this.ACTION.WALK    = 1;
				break;

			//TODO: define others Entities ACTION
			case Entity.TYPE_ELEM:
				break;
		}
	};
});
