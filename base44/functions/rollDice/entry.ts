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

    if (roll_type === 'attack') {
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