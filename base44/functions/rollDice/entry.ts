import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

function rollDie(sides) { return Math.floor(Math.random() * sides) + 1; }
function rollDice(sides, count) { let t = 0; for (let i = 0; i < count; i++) t += rollDie(sides); return t; }
function abilityMod(score) { return Math.floor(((score || 10) - 10) / 2); }

const SAVE_LABELS = {
  poison_death: 'Poison/Death',
  wand: 'Rod/Staff/Wand',
  petrification: 'Petrification/Polymorph',
  breath: 'Breath Weapon',
  spell: 'Spell'
};
const ABILITY_LABELS = { str: 'STR', int: 'INT', wis: 'WIS', dex: 'DEX', con: 'CON', cha: 'CHA' };
const SF_ABILITY_LABELS = { str: 'STR', int: 'INT', log: 'LOG', dex: 'DEX', rs: 'RS', per: 'PER', ldr: 'LDR', sta: 'STA' };
const MILITARY_SKILLS = ['Beam Weapons', 'Projectile Weapons', 'Gyrojet Weapons', 'Melee Weapons', 'Thrown Weapons', 'Demolitions'];

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const { campaign_id, character_id, roll_type, chapter } = body;
    if (!campaign_id || !character_id || !roll_type) {
      return Response.json({ error: 'campaign_id, character_id, roll_type required' }, { status: 400 });
    }

    const char = await base44.asServiceRole.entities.Character.get(character_id);
    if (!char) return Response.json({ error: 'Character not found' }, { status: 404 });
    if (char.campaign_id !== campaign_id) {
      return Response.json({ error: 'Character not in this campaign' }, { status: 403 });
    }

    const scores = char.ability_scores || {};
    const rolls = [];
    let summary = '';
    const isSF = body.game_system === 'starfrontiers';
    const isGW = body.game_system === 'gammaworld';
    const isBH = body.game_system === 'boothill';
    const isIJ = body.game_system === 'indianajones';
    const isTS = body.game_system === 'topsecret';
    const isHY = body.game_system === 'conan' || body.game_system === 'redsonja';
    const isGB = body.game_system === 'ghostbusters';
    const isGang = body.game_system === 'gangbusters';
    const isLOD = body.game_system === 'legionofdoom';
    const isPJ = body.game_system === 'pathfinder';

    const GW_ABILITY_LABELS = { ps: 'PS', ms: 'MS', dx: 'DX', cn: 'CN', in: 'IN', ch: 'CH', sn: 'SN' };
    const BH_ABILITY_LABELS = { spd: 'SPD', gacc: 'GACC', tacc: 'TACC', str: 'STR', brv: 'BRV', exp: 'EXP' };
    const BH_WEAPON_SKILLS = ['Brawling', 'Fast Draw', 'Pistol', 'Rifle', 'Shotgun'];
    const IJ_ABILITY_LABELS = { str: 'STR', mov: 'MOV', prw: 'PRW', bck: 'BCK', ins: 'INS', app: 'APP' };
    const IJ_WEAPON_SKILLS = ['Brawling', 'Pistol', 'Rifle', 'Whip', 'Thrown', 'Melee'];
    const TS_ABILITY_LABELS = { str: 'PSTR', pbea: 'PBEA', char: 'CHAR', cour: 'COUR', know: 'KNOW', judg: 'JUDG', coor: 'COOR' };
    const TS_WEAPON_SKILLS = ['Brawling', 'Pistol', 'Rifle', 'Submachine Gun', 'Thrown', 'Melee'];
    const HY_ABILITY_LABELS = { str: 'STR', dex: 'DEX', agi: 'AGI', end: 'END', sta: 'STA', int: 'INT', men: 'MEN', lck: 'LCK' };
    const HY_WEAPON_SKILLS = ['Broadsword', 'Dagger', 'Bow', 'Spear', 'Shield', 'Brawling'];
    const GANG_ABILITY_LABELS = { mus: 'MUS', agi: 'AGI', aim: 'AIM', sav: 'SAV', ner: 'NER', pan: 'PAN' };
    const GANG_WEAPON_SKILLS = ['Pistol', 'Rifle', 'Shotgun', 'Submachine Gun', 'Brawling', 'Melee', 'Thrown'];
    const LOD_ABILITY_LABELS = { mgt: 'MGT', cun: 'CUN', agi: 'AGI', tgh: 'TGH', wil: 'WIL', cha: 'CHA' };
    const PJ_ABILITY_LABELS = { cbt: 'CBT', pil: 'PIL', eng: 'ENG', sci: 'SCI', sec: 'SEC', cmd: 'CMD', com: 'COM', ath: 'ATH' };
    const PJ_COMBAT_SKILLS = ['Combat', 'Weapons Training', 'Infiltration'];

    // --- Star Frontiers roll types (percentile, roll-under) ---
    if (isSF && roll_type === 'attack') {
      const ranged = !!body.ranged;
      const ability = ranged ? (scores.dex || 50) : (scores.str || 50);
      const charSkills = (char.skills || []).filter(s => MILITARY_SKILLS.includes(s.name));
      const skillLvl = charSkills.length ? Math.max(...charSkills.map(s => s.level || 0)) : 0;
      const hit = Math.min(95, Math.max(5, Math.floor(ability / 2) + skillLvl * 10));
      const d100 = rollDie(100);
      const success = d100 <= hit;
      rolls.push({
        description: ranged ? 'Ranged attack' : 'Melee attack',
        die: 'd100', roll: d100, modifier: skillLvl * 10, total: d100,
        result: success ? 'Hit' : 'Miss', target: `need ≤ ${hit}%`
      });
      summary = `${char.name} attacks (${ranged ? 'ranged' : 'melee'}): d100 = ${d100} vs ${hit}% — ${success ? 'HIT' : 'MISS'}.`;
    }
    else if (isSF && roll_type === 'ability') {
      const ability = body.ability;
      if (!SF_ABILITY_LABELS[ability]) return Response.json({ error: 'Invalid ability' }, { status: 400 });
      const score = scores[ability] || 50;
      const d100 = rollDie(100);
      const success = d100 <= score;
      rolls.push({
        description: `${SF_ABILITY_LABELS[ability]} check`,
        die: 'd100', roll: d100, modifier: 0, total: d100,
        result: success ? 'Success' : 'Failure',
        target: `need ≤ ${score}`
      });
      summary = `${char.name} ${SF_ABILITY_LABELS[ability]} check: d100 = ${d100} vs ${score} — ${success ? 'SUCCESS' : 'FAILURE'}.`;
    }
    else if (isSF && roll_type === 'initiative') {
      const rs = scores.rs || 50;
      const initMod = Math.floor(rs / 10);
      const d10 = rollDie(10);
      const total = d10 + initMod;
      rolls.push({
        description: 'Initiative',
        die: 'd10', roll: d10, modifier: initMod, total,
        target: `RS/10 = ${initMod}`
      });
      summary = `${char.name} initiative: RS/10 ${initMod} + d10 ${d10} = ${total}.`;
    }
    // --- Pathfinder Journeys roll types (d100 roll-under) ---
    else if (isPJ && roll_type === 'attack') {
      const cbt = scores.cbt || 50;
      const charSkills = (char.skills || []).filter(s => PJ_COMBAT_SKILLS.includes(s.name));
      const skillLvl = charSkills.length ? Math.max(...charSkills.map(s => Number(s.level) || 0)) : 0;
      const hit = Math.min(95, Math.max(5, Math.floor(cbt / 2) + skillLvl * 10));
      const d100 = rollDie(100);
      const success = d100 <= hit;
      rolls.push({
        description: 'Attack',
        die: 'd100', roll: d100, modifier: skillLvl * 10, total: d100,
        result: success ? 'Hit' : 'Miss', target: `need <= ${hit}%`
      });
      summary = `${char.name} attacks: d100 = ${d100} vs ${hit}% — ${success ? 'HIT' : 'MISS'}.`;
    }
    else if (isPJ && roll_type === 'ability') {
      const ability = body.ability;
      if (!PJ_ABILITY_LABELS[ability]) return Response.json({ error: 'Invalid ability' }, { status: 400 });
      const score = scores[ability] || 50;
      const diffMod = Number(body.difficulty_mod) || 0;
      const target = Math.min(95, Math.max(5, score + diffMod));
      const useAdv = !!body.advantage;
      const useDis = !!body.disadvantage;
      let d100, rollDesc;
      if (useAdv) {
        const r1 = rollDie(100); const r2 = rollDie(100);
        d100 = Math.min(r1, r2);
        rollDesc = `2d100 (${r1}, ${r2}) take ${d100}`;
      } else if (useDis) {
        const r1 = rollDie(100); const r2 = rollDie(100);
        d100 = Math.max(r1, r2);
        rollDesc = `2d100 (${r1}, ${r2}) take ${d100}`;
      } else {
        d100 = rollDie(100);
        rollDesc = `d100`;
      }
      const success = d100 <= target;
      rolls.push({
        description: `${PJ_ABILITY_LABELS[ability]} check`,
        die: 'd100', roll: d100, modifier: diffMod, total: d100,
        result: success ? 'Success' : 'Failure', target: `need <= ${target}${diffMod !== 0 ? ` (ability ${score} ${diffMod > 0 ? '+' : ''}${diffMod})` : ''}`
      });
      summary = `${char.name} ${PJ_ABILITY_LABELS[ability]} check: ${rollDesc} = ${d100} vs ${target} — ${success ? 'SUCCESS' : 'FAILURE'}.`;
    }
    else if (isPJ && roll_type === 'initiative') {
      const ath = scores.ath || 50;
      const initMod = Math.floor(ath / 10);
      const d10 = rollDie(10);
      const total = d10 + initMod;
      rolls.push({
        description: 'Initiative',
        die: 'd10', roll: d10, modifier: initMod, total,
        target: `ATH/10 = ${initMod}`
      });
      summary = `${char.name} initiative: ATH/10 ${initMod} + d10 ${d10} = ${total}.`;
    }
    // --- Gamma World roll types (d20 system) ---
    else if (isGW && roll_type === 'attack') {
      const ranged = !!body.ranged;
      const ability = ranged ? (scores.dx || 10) : (scores.ps || 10);
      const mod = abilityMod(ability);
      const d20 = rollDie(20);
      const total = d20 + mod;
      rolls.push({
        description: ranged ? 'Ranged attack' : 'Melee attack',
        die: 'd20', roll: d20, modifier: mod, total,
        target: `${ranged ? 'DX' : 'PS'} mod ${mod >= 0 ? '+' : ''}${mod}`
      });
      summary = `${char.name} attacks (${ranged ? 'ranged' : 'melee'}): d20${mod >= 0 ? '+' : ''}${mod} = ${total}.`;
    }
    else if (isGW && roll_type === 'ability') {
      const ability = body.ability;
      if (!GW_ABILITY_LABELS[ability]) return Response.json({ error: 'Invalid ability' }, { status: 400 });
      const score = scores[ability] || 10;
      const d20 = rollDie(20);
      const success = d20 <= score;
      rolls.push({
        description: `${GW_ABILITY_LABELS[ability]} check`,
        die: 'd20', roll: d20, modifier: 0, total: d20,
        result: success ? 'Success' : 'Failure',
        target: `need ≤ ${score}`
      });
      summary = `${char.name} ${GW_ABILITY_LABELS[ability]} check: d20 = ${d20} vs ${score} — ${success ? 'SUCCESS' : 'FAILURE'}.`;
    }
    else if (isGW && roll_type === 'initiative') {
      const dx = scores.dx || 10;
      const initMod = abilityMod(dx);
      const d10 = rollDie(10);
      const total = d10 + initMod;
      rolls.push({
        description: 'Initiative',
        die: 'd10', roll: d10, modifier: initMod, total,
        target: `DX mod ${initMod >= 0 ? '+' : ''}${initMod}`
      });
      summary = `${char.name} initiative: DX ${initMod >= 0 ? '+' : ''}${initMod} + d10 ${d10} = ${total}.`;
    }
    else if (isGW && roll_type === 'morale') {
      const ch = scores.ch || 10;
      const moraleMod = abilityMod(ch);
      const d10 = rollDie(10);
      const total = d10 + moraleMod;
      rolls.push({
        description: 'Morale check',
        die: 'd10', roll: d10, modifier: moraleMod, total,
        target: `CH mod ${moraleMod >= 0 ? '+' : ''}${moraleMod}`
      });
      summary = `${char.name} morale check: d10${moraleMod >= 0 ? '+' : ''}${moraleMod} = ${total}.`;
    }
    // --- Boot Hill roll types (percentile d100) ---
    else if (isBH && roll_type === 'attack') {
      const firearm = body.firearm !== false;
      const base = firearm ? (scores.gacc || 50) : (scores.tacc || 50);
      const brv = Math.floor((scores.brv || 50) / 20) - 5;
      const charWeaponSkills = (char.skills || []).filter(s => BH_WEAPON_SKILLS.includes(s.name));
      const weaponBonus = charWeaponSkills.length ? Math.max(...charWeaponSkills.map(s => Number(s.level) || 0)) * 10 : 0;
      const modifier = Number(body.modifier) || 0;
      const hitNumber = Math.min(95, Math.max(5, base + brv + weaponBonus + modifier));
      const d100 = rollDie(100);
      const success = d100 <= hitNumber;
      rolls.push({
        description: firearm ? 'Firearm attack' : 'Thrown weapon attack',
        die: 'd100', roll: d100, modifier: brv + weaponBonus + modifier, total: d100,
        result: success ? 'Hit' : 'Miss', target: `need ≤ ${hitNumber}%`
      });
      summary = `${char.name} ${firearm ? 'fires' : 'throws'}: d100 = ${d100} vs ${hitNumber}% — ${success ? 'HIT' : 'MISS'}.`;
    }
    else if (isBH && roll_type === 'wound') {
      const WOUND_LOCATIONS = [
        { min: 1, max: 5, part: 'Head', mortal: true },
        { min: 6, max: 10, part: 'Right Shoulder', mortal: false },
        { min: 11, max: 15, part: 'Left Shoulder', mortal: false },
        { min: 16, max: 20, part: 'Right Arm', mortal: false },
        { min: 21, max: 25, part: 'Left Arm', mortal: false },
        { min: 26, max: 40, part: 'Chest', mortal: true },
        { min: 41, max: 55, part: 'Abdomen', mortal: false },
        { min: 56, max: 70, part: 'Right Leg', mortal: false },
        { min: 71, max: 85, part: 'Left Leg', mortal: false },
        { min: 86, max: 100, part: 'Hand / Groin', mortal: false }
      ];
      const WOUND_SEVERITY = [
        { min: 1, max: 25, severity: 'Slight', damage: 1 },
        { min: 26, max: 50, severity: 'Light', damage: 2 },
        { min: 51, max: 70, severity: 'Medium', damage: 4 },
        { min: 71, max: 85, severity: 'Serious', damage: 8 },
        { min: 86, max: 95, severity: 'Critical', damage: 16 },
        { min: 96, max: 100, severity: 'Mortal', damage: 999 }
      ];
      const locRoll = rollDie(100);
      const loc = WOUND_LOCATIONS.find(l => locRoll >= l.min && locRoll <= l.max) || WOUND_LOCATIONS[0];
      const sevRoll = rollDie(100);
      let sev = WOUND_SEVERITY.find(s => sevRoll >= s.min && sevRoll <= s.max) || WOUND_SEVERITY[0];
      if (loc.mortal && sev.severity !== 'Mortal' && sevRoll >= 86) sev = WOUND_SEVERITY[5];
      rolls.push({
        description: 'Wound location',
        die: 'd100', roll: locRoll, modifier: 0, total: locRoll,
        result: loc.part + (loc.mortal ? ' (vital)' : '')
      });
      rolls.push({
        description: `Wound severity — ${loc.part}`,
        die: 'd100', roll: sevRoll, modifier: 0, total: sevRoll,
        result: sev.severity, target: sev.damage === 999 ? 'Mortal wound' : `-${sev.damage} Grit`
      });
      summary = `Wound: ${loc.part} — ${sev.severity} (${sev.damage === 999 ? 'mortal wound' : '-' + sev.damage + ' Grit'}).`;
    }
    else if (isBH && roll_type === 'ability') {
      const ability = body.ability;
      if (!BH_ABILITY_LABELS[ability]) return Response.json({ error: 'Invalid ability' }, { status: 400 });
      const score = scores[ability] || 50;
      const d100 = rollDie(100);
      const success = d100 <= score;
      rolls.push({
        description: `${BH_ABILITY_LABELS[ability]} check`,
        die: 'd100', roll: d100, modifier: 0, total: d100,
        result: success ? 'Success' : 'Failure',
        target: `need ≤ ${score}`
      });
      summary = `${char.name} ${BH_ABILITY_LABELS[ability]} check: d100 = ${d100} vs ${score} — ${success ? 'SUCCESS' : 'FAILURE'}.`;
    }
    else if (isBH && roll_type === 'initiative') {
      const spd = scores.spd || 50;
      const initMod = Math.floor(spd / 10);
      const d10 = rollDie(10);
      const total = d10 + initMod;
      rolls.push({
        description: 'Initiative',
        die: 'd10', roll: d10, modifier: initMod, total,
        target: `SPD/10 = ${initMod}`
      });
      summary = `${char.name} initiative: SPD/10 ${initMod} + d10 ${d10} = ${total}.`;
    }
    else if (isBH && roll_type === 'quickdraw') {
      const spd = scores.spd || 50;
      const d100 = rollDie(100);
      const success = d100 <= spd;
      rolls.push({
        description: 'Quick draw',
        die: 'd100', roll: d100, modifier: 0, total: d100,
        result: success ? 'Fast' : 'Slow',
        target: `need ≤ ${spd} (Speed)`
      });
      summary = `${char.name} quick draw: d100 = ${d100} vs Speed ${spd} — ${success ? 'FAST (won the draw)' : 'SLOW (lost the draw)'}.`;
    }
    // --- Indiana Jones roll types (percentile d100) ---
    else if (isIJ && roll_type === 'attack') {
      const prw = scores.prw || 50;
      const bck = Math.floor((scores.bck || 50) / 20) - 5;
      const charWeaponSkills = (char.skills || []).filter(s => IJ_WEAPON_SKILLS.includes(s.name));
      const weaponBonus = charWeaponSkills.length ? Math.max(...charWeaponSkills.map(s => Number(s.level) || 0)) * 10 : 0;
      const modifier = Number(body.modifier) || 0;
      const hitNumber = Math.min(95, Math.max(5, prw + bck + weaponBonus + modifier));
      const d100 = rollDie(100);
      const success = d100 <= hitNumber;
      rolls.push({
        description: 'Attack',
        die: 'd100', roll: d100, modifier: bck + weaponBonus + modifier, total: d100,
        result: success ? 'Hit' : 'Miss', target: `need ≤ ${hitNumber}%`
      });
      summary = `${char.name} attacks: d100 = ${d100} vs ${hitNumber}% — ${success ? 'HIT' : 'MISS'}.`;
    }
    else if (isIJ && roll_type === 'wound') {
      const WOUND_LOCATIONS = [
        { min: 1, max: 5, part: 'Head', mortal: true },
        { min: 6, max: 10, part: 'Right Shoulder', mortal: false },
        { min: 11, max: 15, part: 'Left Shoulder', mortal: false },
        { min: 16, max: 20, part: 'Right Arm', mortal: false },
        { min: 21, max: 25, part: 'Left Arm', mortal: false },
        { min: 26, max: 40, part: 'Chest', mortal: true },
        { min: 41, max: 55, part: 'Abdomen', mortal: false },
        { min: 56, max: 70, part: 'Right Leg', mortal: false },
        { min: 71, max: 85, part: 'Left Leg', mortal: false },
        { min: 86, max: 100, part: 'Hand / Groin', mortal: false }
      ];
      const WOUND_SEVERITY = [
        { min: 1, max: 25, severity: 'Slight', damage: 1 },
        { min: 26, max: 50, severity: 'Light', damage: 2 },
        { min: 51, max: 70, severity: 'Medium', damage: 4 },
        { min: 71, max: 85, severity: 'Serious', damage: 8 },
        { min: 86, max: 95, severity: 'Critical', damage: 16 },
        { min: 96, max: 100, severity: 'Mortal', damage: 999 }
      ];
      const locRoll = rollDie(100);
      const loc = WOUND_LOCATIONS.find(l => locRoll >= l.min && locRoll <= l.max) || WOUND_LOCATIONS[0];
      const sevRoll = rollDie(100);
      let sev = WOUND_SEVERITY.find(s => sevRoll >= s.min && sevRoll <= s.max) || WOUND_SEVERITY[0];
      if (loc.mortal && sev.severity !== 'Mortal' && sevRoll >= 86) sev = WOUND_SEVERITY[5];
      rolls.push({
        description: 'Wound location',
        die: 'd100', roll: locRoll, modifier: 0, total: locRoll,
        result: loc.part + (loc.mortal ? ' (vital)' : '')
      });
      rolls.push({
        description: `Wound severity — ${loc.part}`,
        die: 'd100', roll: sevRoll, modifier: 0, total: sevRoll,
        result: sev.severity, target: sev.damage === 999 ? 'Mortal wound' : `-${sev.damage} Vitality`
      });
      summary = `Wound: ${loc.part} — ${sev.severity} (${sev.damage === 999 ? 'mortal wound' : '-' + sev.damage + ' Vitality'}).`;
    }
    else if (isIJ && roll_type === 'ability') {
      const ability = body.ability;
      if (!IJ_ABILITY_LABELS[ability]) return Response.json({ error: 'Invalid ability' }, { status: 400 });
      const score = scores[ability] || 50;
      const d100 = rollDie(100);
      const success = d100 <= score;
      rolls.push({
        description: `${IJ_ABILITY_LABELS[ability]} check`,
        die: 'd100', roll: d100, modifier: 0, total: d100,
        result: success ? 'Success' : 'Failure',
        target: `need ≤ ${score}`
      });
      summary = `${char.name} ${IJ_ABILITY_LABELS[ability]} check: d100 = ${d100} vs ${score} — ${success ? 'SUCCESS' : 'FAILURE'}.`;
    }
    else if (isIJ && roll_type === 'initiative') {
      const mov = scores.mov || 50;
      const initMod = Math.floor(mov / 10);
      const d10 = rollDie(10);
      const total = d10 + initMod;
      rolls.push({
        description: 'Initiative',
        die: 'd10', roll: d10, modifier: initMod, total,
        target: `MOV/10 = ${initMod}`
      });
      summary = `${char.name} initiative: MOV/10 ${initMod} + d10 ${d10} = ${total}.`;
    }
    else if (isIJ && roll_type === 'reaction') {
      const mov = scores.mov || 50;
      const d100 = rollDie(100);
      const success = d100 <= mov;
      rolls.push({
        description: 'Reaction',
        die: 'd100', roll: d100, modifier: 0, total: d100,
        result: success ? 'Quick' : 'Slow',
        target: `need ≤ ${mov} (Movement)`
      });
      summary = `${char.name} reaction: d100 = ${d100} vs Movement ${mov} — ${success ? 'QUICK' : 'SLOW'}.`;
    }
    // --- Top Secret roll types (percentile d100) ---
    else if (isTS && roll_type === 'attack') {
      const coor = scores.coor || 50;
      const cour = Math.floor((scores.cour || 50) / 20) - 5;
      const charWeaponSkills = (char.skills || []).filter(s => TS_WEAPON_SKILLS.includes(s.name));
      const weaponBonus = charWeaponSkills.length ? Math.max(...charWeaponSkills.map(s => Number(s.level) || 0)) * 10 : 0;
      const modifier = Number(body.modifier) || 0;
      const hitNumber = Math.min(95, Math.max(5, coor + cour + weaponBonus + modifier));
      const d100 = rollDie(100);
      const success = d100 <= hitNumber;
      rolls.push({
        description: 'Attack',
        die: 'd100', roll: d100, modifier: cour + weaponBonus + modifier, total: d100,
        result: success ? 'Hit' : 'Miss', target: `need ≤ ${hitNumber}%`
      });
      summary = `${char.name} attacks: d100 = ${d100} vs ${hitNumber}% — ${success ? 'HIT' : 'MISS'}.`;
    }
    else if (isTS && roll_type === 'wound') {
      const WOUND_LOCATIONS = [
        { min: 1, max: 5, part: 'Head', mortal: true },
        { min: 6, max: 10, part: 'Right Shoulder', mortal: false },
        { min: 11, max: 15, part: 'Left Shoulder', mortal: false },
        { min: 16, max: 20, part: 'Right Arm', mortal: false },
        { min: 21, max: 25, part: 'Left Arm', mortal: false },
        { min: 26, max: 40, part: 'Chest', mortal: true },
        { min: 41, max: 55, part: 'Abdomen', mortal: false },
        { min: 56, max: 70, part: 'Right Leg', mortal: false },
        { min: 71, max: 85, part: 'Left Leg', mortal: false },
        { min: 86, max: 100, part: 'Hand / Groin', mortal: false }
      ];
      const WOUND_SEVERITY = [
        { min: 1, max: 25, severity: 'Slight', damage: 1 },
        { min: 26, max: 50, severity: 'Light', damage: 2 },
        { min: 51, max: 70, severity: 'Medium', damage: 4 },
        { min: 71, max: 85, severity: 'Serious', damage: 8 },
        { min: 86, max: 95, severity: 'Critical', damage: 16 },
        { min: 96, max: 100, severity: 'Mortal', damage: 999 }
      ];
      const locRoll = rollDie(100);
      const loc = WOUND_LOCATIONS.find(l => locRoll >= l.min && locRoll <= l.max) || WOUND_LOCATIONS[0];
      const sevRoll = rollDie(100);
      let sev = WOUND_SEVERITY.find(s => sevRoll >= s.min && sevRoll <= s.max) || WOUND_SEVERITY[0];
      if (loc.mortal && sev.severity !== 'Mortal' && sevRoll >= 86) sev = WOUND_SEVERITY[5];
      rolls.push({
        description: 'Wound location',
        die: 'd100', roll: locRoll, modifier: 0, total: locRoll,
        result: loc.part + (loc.mortal ? ' (vital)' : '')
      });
      rolls.push({
        description: `Wound severity — ${loc.part}`,
        die: 'd100', roll: sevRoll, modifier: 0, total: sevRoll,
        result: sev.severity, target: sev.damage === 999 ? 'Mortal wound' : `-${sev.damage} Vitality`
      });
      summary = `Wound: ${loc.part} — ${sev.severity} (${sev.damage === 999 ? 'mortal wound' : '-' + sev.damage + ' Vitality'}).`;
    }
    else if (isTS && roll_type === 'ability') {
      const ability = body.ability;
      if (!TS_ABILITY_LABELS[ability]) return Response.json({ error: 'Invalid ability' }, { status: 400 });
      const score = scores[ability] || 50;
      const d100 = rollDie(100);
      const success = d100 <= score;
      rolls.push({
        description: `${TS_ABILITY_LABELS[ability]} check`,
        die: 'd100', roll: d100, modifier: 0, total: d100,
        result: success ? 'Success' : 'Failure',
        target: `need ≤ ${score}`
      });
      summary = `${char.name} ${TS_ABILITY_LABELS[ability]} check: d100 = ${d100} vs ${score} — ${success ? 'SUCCESS' : 'FAILURE'}.`;
    }
    else if (isTS && roll_type === 'initiative') {
      const coor = scores.coor || 50;
      const initMod = Math.floor(coor / 10);
      const d10 = rollDie(10);
      const total = d10 + initMod;
      rolls.push({
        description: 'Initiative',
        die: 'd10', roll: d10, modifier: initMod, total,
        target: `COOR/10 = ${initMod}`
      });
      summary = `${char.name} initiative: COOR/10 ${initMod} + d10 ${d10} = ${total}.`;
    }
    else if (isTS && roll_type === 'reaction') {
      const coor = scores.coor || 50;
      const d100 = rollDie(100);
      const success = d100 <= coor;
      rolls.push({
        description: 'Reaction',
        die: 'd100', roll: d100, modifier: 0, total: d100,
        result: success ? 'Quick' : 'Slow',
        target: `need ≤ ${coor} (Coordination)`
      });
      summary = `${char.name} reaction: d100 = ${d100} vs Coordination ${coor} — ${success ? 'QUICK' : 'SLOW'}.`;
    }
    // --- Hyborian roll types (percentile d100 — Conan / Red Sonja) ---
    else if (isHY && roll_type === 'attack') {
      const dex = scores.dex || 50;
      const men = Math.floor((scores.men || 50) / 20) - 5;
      const charWeaponSkills = (char.skills || []).filter(s => HY_WEAPON_SKILLS.includes(s.name));
      const weaponBonus = charWeaponSkills.length ? Math.max(...charWeaponSkills.map(s => Number(s.level) || 0)) * 10 : 0;
      const modifier = Number(body.modifier) || 0;
      const hitNumber = Math.min(95, Math.max(5, dex + men + weaponBonus + modifier));
      const d100 = rollDie(100);
      const success = d100 <= hitNumber;
      rolls.push({
        description: 'Attack',
        die: 'd100', roll: d100, modifier: men + weaponBonus + modifier, total: d100,
        result: success ? 'Hit' : 'Miss', target: `need ≤ ${hitNumber}%`
      });
      summary = `${char.name} attacks: d100 = ${d100} vs ${hitNumber}% — ${success ? 'HIT' : 'MISS'}.`;
    }
    else if (isHY && roll_type === 'wound') {
      const WOUND_LOCATIONS = [
        { min: 1, max: 5, part: 'Head', mortal: true },
        { min: 6, max: 10, part: 'Right Shoulder', mortal: false },
        { min: 11, max: 15, part: 'Left Shoulder', mortal: false },
        { min: 16, max: 20, part: 'Right Arm', mortal: false },
        { min: 21, max: 25, part: 'Left Arm', mortal: false },
        { min: 26, max: 40, part: 'Chest', mortal: true },
        { min: 41, max: 55, part: 'Abdomen', mortal: false },
        { min: 56, max: 70, part: 'Right Leg', mortal: false },
        { min: 71, max: 85, part: 'Left Leg', mortal: false },
        { min: 86, max: 100, part: 'Hand / Groin', mortal: false }
      ];
      const WOUND_SEVERITY = [
        { min: 1, max: 25, severity: 'Slight', damage: 1 },
        { min: 26, max: 50, severity: 'Light', damage: 2 },
        { min: 51, max: 70, severity: 'Medium', damage: 4 },
        { min: 71, max: 85, severity: 'Serious', damage: 8 },
        { min: 86, max: 95, severity: 'Critical', damage: 16 },
        { min: 96, max: 100, severity: 'Mortal', damage: 999 }
      ];
      const locRoll = rollDie(100);
      const loc = WOUND_LOCATIONS.find(l => locRoll >= l.min && locRoll <= l.max) || WOUND_LOCATIONS[0];
      const sevRoll = rollDie(100);
      let sev = WOUND_SEVERITY.find(s => sevRoll >= s.min && sevRoll <= s.max) || WOUND_SEVERITY[0];
      if (loc.mortal && sev.severity !== 'Mortal' && sevRoll >= 86) sev = WOUND_SEVERITY[5];
      rolls.push({ description: 'Wound location', die: 'd100', roll: locRoll, modifier: 0, total: locRoll, result: loc.part + (loc.mortal ? ' (vital)' : '') });
      rolls.push({ description: `Wound severity — ${loc.part}`, die: 'd100', roll: sevRoll, modifier: 0, total: sevRoll, result: sev.severity, target: sev.damage === 999 ? 'Mortal wound' : `-${sev.damage} Vitality` });
      summary = `Wound: ${loc.part} — ${sev.severity} (${sev.damage === 999 ? 'mortal wound' : '-' + sev.damage + ' Vitality'}).`;
    }
    else if (isHY && roll_type === 'ability') {
      const ability = body.ability;
      if (!HY_ABILITY_LABELS[ability]) return Response.json({ error: 'Invalid ability' }, { status: 400 });
      const score = scores[ability] || 50;
      const d100 = rollDie(100);
      const success = d100 <= score;
      rolls.push({ description: `${HY_ABILITY_LABELS[ability]} check`, die: 'd100', roll: d100, modifier: 0, total: d100, result: success ? 'Success' : 'Failure', target: `need ≤ ${score}` });
      summary = `${char.name} ${HY_ABILITY_LABELS[ability]} check: d100 = ${d100} vs ${score} — ${success ? 'SUCCESS' : 'FAILURE'}.`;
    }
    else if (isHY && roll_type === 'initiative') {
      const agi = scores.agi || 50;
      const initMod = Math.floor(agi / 10);
      const d10 = rollDie(10);
      const total = d10 + initMod;
      rolls.push({ description: 'Initiative', die: 'd10', roll: d10, modifier: initMod, total, target: `AGI/10 = ${initMod}` });
      summary = `${char.name} initiative: AGI/10 ${initMod} + d10 ${d10} = ${total}.`;
    }
    else if (isHY && roll_type === 'reaction') {
      const agi = scores.agi || 50;
      const d100 = rollDie(100);
      const success = d100 <= agi;
      rolls.push({ description: 'Reaction', die: 'd100', roll: d100, modifier: 0, total: d100, result: success ? 'Quick' : 'Slow', target: `need ≤ ${agi} (Agility)` });
      summary = `${char.name} reaction: d100 = ${d100} vs Agility ${agi} — ${success ? 'QUICK' : 'SLOW'}.`;
    }
    // --- Ghostbusters roll types (D6 dice pool) ---
    else if (isGB && roll_type === 'trait') {
      const attrKey = body.attribute || 'brain';
      const attrDice = Math.max(1, Number(scores[attrKey]) || 3);
      const skillDice = Math.max(0, Number(body.skill_dice) || 0);
      const bonusDice = Math.max(0, Number(body.bonus_dice) || 0);
      const tn = Number(body.target_number) || 10;
      const totalCount = attrDice + skillDice + bonusDice;
      const dice = [];
      for (let i = 0; i < totalCount; i++) dice.push(rollDie(6));
      const ghostRoll = rollDie(6);
      const isGhost = ghostRoll === 6;
      const ghostValue = isGhost ? 0 : ghostRoll;
      dice[0] = ghostValue;
      const total = dice.reduce((s, v) => s + v, 0);
      const success = total >= tn;
      rolls.push({
        description: `${attrKey.toUpperCase()} trait roll`,
        die: `${totalCount}d6`, roll: total, modifier: skillDice + bonusDice, total,
        result: success ? 'Success' : 'Failure',
        target: `TN ${tn}` + (isGhost ? ' — GHOST!' : '')
      });
      summary = `${char.name} rolls ${totalCount}d6 = ${total} vs TN ${tn} — ${success ? 'SUCCESS' : 'FAILURE'}${isGhost ? ' (Ghost Die triggered!)' : ''}.`;
    }
    else if (isGB && roll_type === 'ghost') {
      const ghostRoll = rollDie(6);
      const isGhost = ghostRoll === 6;
      rolls.push({
        description: 'Ghost Die',
        die: 'd6', roll: ghostRoll, modifier: 0, total: isGhost ? 0 : ghostRoll,
        result: isGhost ? 'GHOST!' : 'No ghost',
        target: '6 = Ghost'
      });
      summary = `Ghost Die: ${ghostRoll} — ${isGhost ? 'A GHOST APPEARS!' : 'No ghost.'}.`;
    }
    // --- Gangbusters roll types (percentile d100 — Prohibition crime) ---
    else if (isGang && roll_type === 'attack') {
      const aim = scores.aim || 50;
      const ner = Math.floor((scores.ner || 50) / 20) - 5;
      const charWeaponSkills = (char.skills || []).filter(s => GANG_WEAPON_SKILLS.includes(s.name));
      const weaponBonus = charWeaponSkills.length ? Math.max(...charWeaponSkills.map(s => Number(s.level) || 0)) * 10 : 0;
      const modifier = Number(body.modifier) || 0;
      const hitNumber = Math.min(95, Math.max(5, aim + ner + weaponBonus + modifier));
      const d100 = rollDie(100);
      const success = d100 <= hitNumber;
      rolls.push({
        description: 'Attack',
        die: 'd100', roll: d100, modifier: ner + weaponBonus + modifier, total: d100,
        result: success ? 'Hit' : 'Miss', target: `need ≤ ${hitNumber}%`
      });
      summary = `${char.name} attacks: d100 = ${d100} vs ${hitNumber}% — ${success ? 'HIT' : 'MISS'}.`;
    }
    else if (isGang && roll_type === 'wound') {
      const WOUND_LOCATIONS = [
        { min: 1, max: 5, part: 'Head', mortal: true },
        { min: 6, max: 10, part: 'Right Shoulder', mortal: false },
        { min: 11, max: 15, part: 'Left Shoulder', mortal: false },
        { min: 16, max: 20, part: 'Right Arm', mortal: false },
        { min: 21, max: 25, part: 'Left Arm', mortal: false },
        { min: 26, max: 40, part: 'Chest', mortal: true },
        { min: 41, max: 55, part: 'Abdomen', mortal: false },
        { min: 56, max: 70, part: 'Right Leg', mortal: false },
        { min: 71, max: 85, part: 'Left Leg', mortal: false },
        { min: 86, max: 100, part: 'Hand / Groin', mortal: false }
      ];
      const WOUND_SEVERITY = [
        { min: 1, max: 25, severity: 'Slight', damage: 1 },
        { min: 26, max: 50, severity: 'Light', damage: 2 },
        { min: 51, max: 70, severity: 'Medium', damage: 4 },
        { min: 71, max: 85, severity: 'Serious', damage: 8 },
        { min: 86, max: 95, severity: 'Critical', damage: 16 },
        { min: 96, max: 100, severity: 'Mortal', damage: 999 }
      ];
      const locRoll = rollDie(100);
      const loc = WOUND_LOCATIONS.find(l => locRoll >= l.min && locRoll <= l.max) || WOUND_LOCATIONS[0];
      const sevRoll = rollDie(100);
      let sev = WOUND_SEVERITY.find(s => sevRoll >= s.min && sevRoll <= s.max) || WOUND_SEVERITY[0];
      if (loc.mortal && sev.severity !== 'Mortal' && sevRoll >= 86) sev = WOUND_SEVERITY[5];
      rolls.push({ description: 'Wound location', die: 'd100', roll: locRoll, modifier: 0, total: locRoll, result: loc.part + (loc.mortal ? ' (vital)' : '') });
      rolls.push({ description: `Wound severity — ${loc.part}`, die: 'd100', roll: sevRoll, modifier: 0, total: sevRoll, result: sev.severity, target: sev.damage === 999 ? 'Mortal wound' : `-${sev.damage} Grit` });
      summary = `Wound: ${loc.part} — ${sev.severity} (${sev.damage === 999 ? 'mortal wound' : '-' + sev.damage + ' Grit'}).`;
    }
    else if (isGang && roll_type === 'ability') {
      const ability = body.ability;
      if (!GANG_ABILITY_LABELS[ability]) return Response.json({ error: 'Invalid ability' }, { status: 400 });
      const score = scores[ability] || 50;
      const d100 = rollDie(100);
      const success = d100 <= score;
      rolls.push({ description: `${GANG_ABILITY_LABELS[ability]} check`, die: 'd100', roll: d100, modifier: 0, total: d100, result: success ? 'Success' : 'Failure', target: `need ≤ ${score}` });
      summary = `${char.name} ${GANG_ABILITY_LABELS[ability]} check: d100 = ${d100} vs ${score} — ${success ? 'SUCCESS' : 'FAILURE'}.`;
    }
    else if (isGang && roll_type === 'initiative') {
      const agi = scores.agi || 50;
      const initMod = Math.floor(agi / 10);
      const d10 = rollDie(10);
      const total = d10 + initMod;
      rolls.push({ description: 'Initiative', die: 'd10', roll: d10, modifier: initMod, total, target: `AGI/10 = ${initMod}` });
      summary = `${char.name} initiative: AGI/10 ${initMod} + d10 ${d10} = ${total}.`;
    }
    else if (isGang && roll_type === 'reaction') {
      const agi = scores.agi || 50;
      const d100 = rollDie(100);
      const success = d100 <= agi;
      rolls.push({ description: 'Reaction', die: 'd100', roll: d100, modifier: 0, total: d100, result: success ? 'Quick' : 'Slow', target: `need ≤ ${agi} (Agility)` });
      summary = `${char.name} reaction: d100 = ${d100} vs Agility ${agi} — ${success ? 'QUICK' : 'SLOW'}.`;
    }
    // --- Legion of Doom roll types (d20 roll-under) ---
    else if (isLOD && roll_type === 'attack') {
      const melee = body.melee !== false;
      const baseAttr = melee ? (scores.mgt || 10) : (scores.agi || 10);
      const bestRank = (char.skills || []).length ? Math.max(...(char.skills || []).map(s => Number(s.level) || 0)) : 0;
      const modifier = Number(body.modifier) || 0;
      const hitNumber = Math.min(18, Math.max(3, baseAttr + bestRank + modifier));
      const d20 = rollDie(20);
      const success = d20 <= hitNumber;
      rolls.push({
        description: melee ? 'Melee attack' : 'Ranged attack',
        die: 'd20', roll: d20, modifier: bestRank + modifier, total: d20,
        result: success ? 'Hit' : 'Miss', target: `need ≤ ${hitNumber}`
      });
      summary = `${char.name} attacks (${melee ? 'melee' : 'ranged'}): d20 = ${d20} vs ${hitNumber} — ${success ? 'HIT' : 'MISS'}.`;
    }
    else if (isLOD && roll_type === 'ability') {
      const ability = body.ability;
      if (!LOD_ABILITY_LABELS[ability]) return Response.json({ error: 'Invalid ability' }, { status: 400 });
      const score = scores[ability] || 10;
      const d20 = rollDie(20);
      const success = d20 <= score;
      rolls.push({
        description: `${LOD_ABILITY_LABELS[ability]} check`,
        die: 'd20', roll: d20, modifier: 0, total: d20,
        result: success ? 'Success' : 'Failure',
        target: `need ≤ ${score}`
      });
      summary = `${char.name} ${LOD_ABILITY_LABELS[ability]} check: d20 = ${d20} vs ${score} — ${success ? 'SUCCESS' : 'FAILURE'}.`;
    }
    else if (isLOD && roll_type === 'initiative') {
      const agi = scores.agi || 10;
      const initMod = Math.floor((agi - 10) / 2);
      const d20 = rollDie(20);
      const total = d20 + initMod;
      rolls.push({
        description: 'Initiative',
        die: 'd20', roll: d20, modifier: initMod, total,
        target: `AGI mod ${initMod >= 0 ? '+' : ''}${initMod}`
      });
      summary = `${char.name} initiative: AGI ${initMod >= 0 ? '+' : ''}${initMod} + d20 ${d20} = ${total}.`;
    }
    // --- AD&D roll types ---
    else if (roll_type === 'attack') {
      const ranged = !!body.ranged;
      const targetAc = body.target_ac != null && body.target_ac !== '' ? Number(body.target_ac) : null;
      const mod = abilityMod(ranged ? scores.dex : scores.str);
      const d20 = rollDie(20);
      const total = d20 + mod;
      const thaco = char.thaco || 20;
      let result = null, target = `THAC0 ${thaco}`;
      if (targetAc !== null && !isNaN(targetAc)) {
        const needed = thaco - targetAc;
        target = `needed ${needed}+ to hit AC ${targetAc}`;
        result = total >= needed ? 'Hit' : 'Miss';
      }
      rolls.push({
        description: ranged ? 'Ranged attack' : 'Melee attack',
        die: 'd20', roll: d20, modifier: mod, total, result, target
      });
      summary = `${char.name} attacks (${ranged ? 'ranged' : 'melee'}): d20${mod >= 0 ? '+' : ''}${mod} = ${total}${result ? ` — ${result}` : ''}.`;
    }

    else if (roll_type === 'save') {
      const category = body.category;
      if (!SAVE_LABELS[category]) return Response.json({ error: 'Invalid save category' }, { status: 400 });
      const saves = char.saving_throws || {};
      const targetNum = saves[category] || 20;
      const d20 = rollDie(20);
      const success = d20 >= targetNum;
      rolls.push({
        description: `Save vs ${SAVE_LABELS[category]}`,
        die: 'd20', roll: d20, modifier: 0, total: d20,
        result: success ? 'Pass' : 'Fail',
        target: `needed ${targetNum}+`
      });
      summary = `${char.name} saves vs ${SAVE_LABELS[category]}: d20 = ${d20} — ${success ? 'PASS' : 'FAIL'}.`;
    }

    else if (roll_type === 'ability') {
      const ability = body.ability;
      if (!ABILITY_LABELS[ability]) return Response.json({ error: 'Invalid ability' }, { status: 400 });
      const score = scores[ability] || 10;
      const mod = abilityMod(score);
      const d20 = rollDie(20);
      const total = d20 + mod;
      rolls.push({
        description: `${ABILITY_LABELS[ability]} check`,
        die: 'd20', roll: d20, modifier: mod, total,
        target: `score ${score}`
      });
      summary = `${char.name} ${ABILITY_LABELS[ability]} check: d20${mod >= 0 ? '+' : ''}${mod} = ${total}.`;
    }

    else if (roll_type === 'damage') {
      const die = Number(body.die) || 6;
      const count = Math.max(1, Number(body.count) || 1);
      const bonus = Number(body.bonus) || 0;
      const base = rollDice(die, count);
      const total = base + bonus;
      rolls.push({
        description: body.label || `Damage ${count}d${die}`,
        die: `${count}d${die}`, roll: base, modifier: bonus, total
      });
      summary = `${char.name} rolls damage: ${count}d${die}${bonus >= 0 ? '+' : ''}${bonus} = ${total}.`;
    }

    else if (roll_type === 'freeform') {
      const sides = Number(body.sides) || 20;
      const count = Math.max(1, Number(body.count) || 1);
      const modifier = Number(body.modifier) || 0;
      const base = rollDice(sides, count);
      const total = base + modifier;
      rolls.push({
        description: body.label || `${count}d${sides}`,
        die: `${count}d${sides}`, roll: base, modifier, total
      });
      summary = `${char.name} rolls ${count}d${sides}${modifier >= 0 ? '+' : ''}${modifier} = ${total}.`;
    }

    else {
      return Response.json({ error: 'Unknown roll_type: ' + roll_type }, { status: 400 });
    }

    await base44.asServiceRole.entities.JournalEntry.create({
      campaign_id,
      entry_type: 'dice_roll',
      acting_character_name: char.name,
      dice_rolls: rolls,
      narration: summary,
      chapter: chapter || 1
    });

    return Response.json({ rolls, summary });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});