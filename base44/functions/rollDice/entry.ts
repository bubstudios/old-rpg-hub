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
    const GW_ABILITY_LABELS = { ps: 'PS', ms: 'MS', dx: 'DX', cn: 'CN', in: 'IN', ch: 'CH', sn: 'SN' };
    const BH_ABILITY_LABELS = { spd: 'SPD', gacc: 'GACC', tacc: 'TACC', str: 'STR', brv: 'BRV', exp: 'EXP' };
    const BH_WEAPON_SKILLS = ['Brawling', 'Fast Draw', 'Pistol', 'Rifle', 'Shotgun'];

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