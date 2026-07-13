// THE PULL — Character Sheet Data & Helpers
// Player-facing: only shows what Bullet currently knows. GM lore stays hidden until unlocked.
// Body zones, instincts, shard powers, guilt entries, memory labels, player codex

// ─── Stage Unlock Helper ───
// Central function that checks whether a story stage/condition has been reached.
export function isStageUnlocked(condition, flags) {
  if (!condition || condition === 'always') return true;

  const history = flags.province_history || [];
  const currentProvince = flags.current_province || 618;
  const codexUnlocks = flags.codex_unlocks || [];
  const isMichael = flags.phase === 'Final Revelation' || flags.phase === 'Cleanup' || currentProvince === 1 || currentProvince === -1;

  // Province-based conditions
  if (condition.startsWith('province_')) {
    const provNum = parseInt(condition.replace('province_', ''));
    return history.includes(provNum) || currentProvince === provNum || isMichael;
  }

  switch (condition) {
    case 'revealed_michael':
    case 'revealed_father':
    case 'cleanup_mode':
      return isMichael;
    case 'shard_focus_unlocked':
      return !!flags.shard_focus_unlocked || isMichael;
    case 'spark_shard':
      return !!flags.spark_shard || isMichael;
    case 'dome_discovered':
      return !!((flags.npc_relationships || {}).ember) || isMichael;
    case 'dreadwraith':
      return !!((flags.knowledge_flags || {}).knowsDreadwraith) || codexUnlocks.includes('dreadwraith') || isMichael;
    case 'met_camp':
      return Object.keys(flags.npc_relationships || {}).length > 0 || history.length > 0 || currentProvince !== 618 || isMichael;
    case 'pipe_found':
      return (flags.pipe_state && flags.pipe_state !== 'unfound') || isMichael;
    case 'first_healing':
      return codexUnlocks.includes('first_healing') || history.length > 0 || currentProvince !== 618 || isMichael;
    case 'heard_to_end_its_torment':
      return codexUnlocks.includes('the_greatest_task') || codexUnlocks.includes('heard_to_end_its_torment') || isMichael;
    case 'saw_steel_gray_eyes':
      return codexUnlocks.includes('steel_gray_eyes') || history.includes(998) || isMichael;
    case 'learned_blade_of_dawn':
      return codexUnlocks.includes('blade_of_dawn') || history.includes(140) || isMichael;
    case 'learned_star_crowned_ember':
      return codexUnlocks.includes('architect_fall') || history.includes(140) || isMichael;
    case 'learned_silent_pulse':
      return codexUnlocks.includes('father_garden') || history.includes(140) || isMichael;
    case 'learned_golden_city':
      return history.includes(391) || history.includes(998) || isMichael;
    case 'father_garden':
      return codexUnlocks.includes('father_garden') || history.includes(14) || isMichael;
    default:
      return codexUnlocks.includes(condition);
  }
}

// ─── Body Zones ───
export const BODY_ZONES = [
  { key: 'head', label: 'Head', default: 'clear', states: ['clear', 'bruised', 'dizzy', 'bleeding', 'vision distorted'] },
  { key: 'chest', label: 'Chest', default: 'scar active', states: ['scar active', 'bruised ribs', 'broken ribs', 'burned', 'constricted'] },
  { key: 'left_arm', label: 'Left Arm', default: 'functional', states: ['functional', 'injured', 'venom-scarred', 'fractured', 'numb'] },
  { key: 'right_arm', label: 'Right Arm', default: 'functional', states: ['functional', 'injured', 'burned', 'strained'] },
  { key: 'leg', label: 'Leg / Thigh', default: 'functional', states: ['functional', 'gashed', 'bleeding', 'venom-damaged', 'unstable'] },
  { key: 'feet', label: 'Feet', default: 'bare', states: ['bare', 'cut', 'blistered', 'frostbitten', 'burned', 'infected'] }
];

export const CONDITION_ZONE_MAP = {
  blood_loss: { zone: 'chest', state: 'bleeding' },
  broken_ribs: { zone: 'chest', state: 'broken ribs' },
  shoulder_wound: { zone: 'right_arm', state: 'injured' },
  leg_wound: { zone: 'leg', state: 'gashed' },
  frostbite: { zone: 'feet', state: 'frostbitten' },
  burns: { zone: 'chest', state: 'burned' },
  rust_venom: { zone: 'left_arm', state: 'venom-scarred' },
  jaw_bruise: { zone: 'head', state: 'bruised' },
  head_wound: { zone: 'head', state: 'bleeding' },
  concussion: { zone: 'head', state: 'dizzy' },
  arm_wound: { zone: 'left_arm', state: 'injured' }
};

export function deriveBodyZones(conditions) {
  const zones = {};
  BODY_ZONES.forEach(z => { zones[z.key] = z.default; });
  (conditions || []).forEach(c => {
    const key = (c.type || c.label || '').toLowerCase().replace(/\s/g, '_');
    const m = CONDITION_ZONE_MAP[key];
    if (m) zones[m.zone] = m.state;
  });
  return zones;
}

export function deriveOverallState(hpCurrent, hpMax, conditions) {
  const pct = hpMax > 0 ? (hpCurrent / hpMax) * 100 : 100;
  const injuries = (conditions || []).filter(c => {
    const key = (c.type || c.label || '').toLowerCase().replace(/\s/g, '_');
    return CONDITION_ZONE_MAP[key] !== undefined;
  }).length;
  if (pct <= 10 || injuries >= 4) return { label: 'Near Collapse', color: 'text-red-500' };
  if (pct <= 30 || injuries >= 3) return { label: 'Critical', color: 'text-red-400' };
  if (pct <= 60 || injuries >= 1) return { label: 'Wounded', color: 'text-amber-400' };
  if (pct <= 85) return { label: 'Hurt', color: 'text-amber-500' };
  return { label: 'Stable', color: 'text-emerald-400' };
}

export function derivePain(conditions) {
  const count = (conditions || []).filter(c => {
    const key = (c.type || c.label || '').toLowerCase().replace(/\s/g, '_');
    return CONDITION_ZONE_MAP[key] || ['despair_pressure', 'fear_of_self'].includes(key);
  }).length;
  return Math.min(10, count * 2);
}

export function deriveBloodLoss(conditions) {
  const has = (conditions || []).some(c => ['blood_loss', 'shoulder_wound', 'leg_wound'].includes((c.type || c.label || '').toLowerCase().replace(/\s/g, '_')));
  return has ? 5 : 0;
}

export function deriveFatigue(conditions) {
  const count = (conditions || []).filter(c => ['fatigue', 'dehydration', 'hunger'].includes((c.type || c.label || '').toLowerCase().replace(/\s/g, '_'))).length;
  return Math.min(10, count * 3);
}

export function deriveMobility(conditions) {
  const has = k => (conditions || []).some(c => (c.type || c.label || '').toLowerCase().replace(/\s/g, '_') === k);
  if (has('leg_wound') && has('frostbite')) return { label: 'Crawling', color: 'text-red-400' };
  if (has('leg_wound')) return { label: 'Limping', color: 'text-amber-400' };
  if (has('frostbite')) return { label: 'Staggering', color: 'text-amber-400' };
  return { label: 'Normal', color: 'text-emerald-400' };
}

export function deriveBreathing(conditions) {
  const has = k => (conditions || []).some(c => (c.type || c.label || '').toLowerCase().replace(/\s/g, '_') === k);
  if (has('smoke_inhalation')) return { label: 'Smoke-Damaged', color: 'text-amber-400' };
  if (has('toxic_exposure')) return { label: 'Poisoned', color: 'text-purple-400' };
  return { label: 'Normal', color: 'text-emerald-400' };
}

export function deriveConsciousness(conditions, pullIntensity, soulFracture) {
  const has = k => (conditions || []).some(c => (c.type || c.label || '').toLowerCase().replace(/\s/g, '_') === k);
  if (pullIntensity >= 6 || (soulFracture || 0) >= 80) return { label: 'Blackout', color: 'text-red-500' };
  if (pullIntensity >= 5 || has('soul_fracture') || (soulFracture || 0) >= 60) return { label: 'Blackout Risk', color: 'text-red-400' };
  if (pullIntensity >= 4 || has('despair_pressure')) return { label: 'Fading', color: 'text-amber-400' };
  if (pullIntensity >= 2 || has('fear_of_self')) return { label: 'Shaken', color: 'text-amber-500' };
  return { label: 'Clear', color: 'text-emerald-400' };
}

export function deriveCurrentState(hpCurrent, hpMax, conditions, clocks) {
  const labels = [];
  const pct = hpMax > 0 ? (hpCurrent / hpMax) * 100 : 100;
  const has = k => (conditions || []).some(c => (c.type || c.label || '').toLowerCase().replace(/\s/g, '_') === k);
  if (pct < 100 || has('blood_loss') || has('broken_ribs')) labels.push('Wounded');
  if (has('fatigue') || has('dehydration') || has('hunger')) labels.push('Exhausted');
  labels.push('Pull-bound');
  return labels.join(' / ');
}

// ─── Instincts ───
export const INSTINCT_LABELS = {
  combat: ['Dormant', 'Faint', 'Present', 'Strong', 'Extreme', 'Instinctive'],
  endurance: ['Broken', 'Faltering', 'Steady', 'Strong', 'Extreme', 'Relentless'],
  awareness: ['Blind', 'Drowsy', 'Alert', 'Watchful', 'Piercing', 'Omniscient'],
  mercy: ['Merciless', 'Cold', 'Conflicted', 'Compassionate', 'Merciful', 'Saint'],
  connection: ['Isolated', 'Fractured', 'Reaching', 'Bonded', 'Anchored', 'Unified'],
  memory: ['Empty', 'Echoes', 'Fragments', 'Surfacing', 'Partial', 'Restored'],
  fear_of_self: ['At Peace', 'Uneasy', 'Afraid', 'Dreadful', 'Horrified', 'Consumed'],
  guilt_burden: ['Unburdened', 'Weighted', 'Heavy', 'Crushing', 'Suffocating', 'Drowned']
};

export const INSTINCTS = [
  { key: 'combat', label: 'Combat Instinct', start: 5, max: 5, color: 'bg-red-500', desc: "Bullet's body knows how to fight even when his mind does not. Better improvised weapon use, brutal counters, survival reactions.", risk: 'May contribute to blackout violence.' },
  { key: 'endurance', label: 'Endurance', start: 5, max: 5, color: 'bg-amber-500', desc: 'Bullet keeps moving long after a normal person would collapse. Resists pain, delays collapse, keeps walking while wounded.', risk: 'Wounds worsen if ignored.' },
  { key: 'awareness', label: 'Awareness', start: 3, max: 5, color: 'bg-sky-500', desc: 'Bullet notices danger, wrongness, and hidden movement. Improves with scar flares, shard focus, and experience.', risk: 'None.' },
  { key: 'mercy', label: 'Mercy', start: 2, max: 5, color: 'bg-emerald-500', desc: 'Tracks whether Bullet chooses restraint, rescue, compassion, or survival-first decisions. Not a morality score. Affects relationships, guilt, and final Cleanup Mode.', risk: 'Mercy has a cost.' },
  { key: 'connection', label: 'Connection', start: 1, max: 5, color: 'bg-violet-500', desc: 'How strongly Bullet can accept help and use bonds as anchors. Connection can resist despair, illusion, and Province systems.', risk: 'Bonds can be weaponized against Bullet.' },
  { key: 'memory', label: 'Memory', start: 0, max: 5, color: 'bg-indigo-500', desc: "How much of Bullet's past has surfaced. Memory fragments may be true, distorted, false, or Province-planted.", risk: 'Not all memories are true.' },
  { key: 'fear_of_self', label: 'Fear of Self', start: 0, max: 5, color: 'bg-red-600', desc: "Bullet's fear that the Pull, scar, or shard may take control. Hidden at first, visible after blackout combat.", risk: 'High fear can paralyze or trigger blackouts.' },
  { key: 'guilt_burden', label: 'Guilt Burden', start: 1, max: 5, color: 'bg-purple-500', desc: 'The accumulated weight of guilt. People failed, left behind, killed. Witnessed horrors. This burden carries through to Cleanup Mode.', risk: 'Heavy guilt can trigger despair and blackout.' }
];

export function calcInstinctValue(key, flags, isMichael) {
  const clocks = flags.campaign_clocks || {};
  const history = flags.province_history || [];
  const visited = history.length + 1;
  const npcCount = Object.keys(flags.npc_relationships || {}).length;
  const memCount = (flags.memories || []).length;

  if (isMichael) {
    if (key === 'memory') return 5;
    if (key === 'fear_of_self') return 0;
  }

  switch (key) {
    case 'combat': return 5;
    case 'endurance': return 5;
    case 'awareness': return Math.min(5, 3 + Math.floor(visited / 4));
    case 'mercy': return 2;
    case 'connection': return Math.min(5, 1 + Math.floor(npcCount / 2));
    case 'memory': return Math.min(5, Math.floor(memCount / 2));
    case 'fear_of_self': return Math.min(5, Math.round((clocks.fear_of_self || 0) / 20));
    case 'guilt_burden': return Math.min(5, Math.round((clocks.guilt_burden || 0) / 20));
    default: return 0;
  }
}

// ─── Shard Powers (player-facing — locked powers show as "??? Undiscovered") ───
export const SHARD_POWERS = [
  { key: 'warmth', label: 'Warmth', desc: 'The shard is warm to the touch.', condition: 'always' },
  { key: 'pulse', label: 'Pulse', desc: 'The shard pulses faintly near the scar.', condition: 'always' },
  { key: 'venom', label: 'Venom Resistance', desc: 'The shard resisted rust venom.', condition: 'province_108' },
  { key: 'resonance', label: 'Resonance', desc: 'The shard can resonate with crystal structures.', condition: 'province_998' },
  { key: 'focus', label: 'Focus Etched Shard', desc: 'The shard can reveal hidden truth when focused.', condition: 'shard_focus_unlocked' },
  { key: 'barrier', label: 'Barrier Break', desc: 'The shard shatters the castle barrier and restores divine memories.', condition: 'revealed_michael' }
];

// ─── Inventory Details ───
export const INVENTORY_DETAILS = {
  'Etched Shard': {
    early: {
      type: 'Unknown Shard', condition: 'Warm to the touch',
      uses: ['Passive warmth'],
      meaning: 'A shard of metal or glass. Warm to the touch. You do not know what it is — only that it feels important.'
    },
    late: {
      type: 'Divine Beacon', condition: 'Warm to the touch',
      uses: ['Passive healing', 'Scar resonance', 'Venom resistance', 'Hidden truth detection', 'Rift interference', 'Barrier breaking'],
      meaning: 'Father shaped it from His own light. A beacon through amnesia.'
    }
  },
  'Battered Metal Pipe': {
    type: 'Weapon / Anchor', condition: 'battered',
    uses: ['Melee combat', 'Brace against terrain', 'Strike resonance', 'Break locks', 'Emotional grounding'],
    meaning: 'The only object that has been with Bullet from the first fight.'
  },
  "Spark's Unetched Shard": {
    type: 'Debt Anchor', condition: 'Cool',
    uses: ['Emotional grounding', 'Cool light', 'Ferryman payment'],
    meaning: 'A reminder of Province 618 and the people Bullet left behind.'
  },
  "Patch's Cloak": {
    type: 'Protection / Anchor', condition: 'patched',
    uses: ['Warmth', 'Disguise', 'Emotional anchor'],
    meaning: 'Proof someone once cared whether Bullet survived.'
  },
  "Thread's Algae-Wrapped Blade": {
    type: 'Weapon', condition: 'algae-wrapped',
    uses: ['Melee combat', 'Underwater use'],
    meaning: 'A blade from Thread in the underwater dome.'
  },
  "Shard's Breathing Apparatus": {
    type: 'Survival Gear', condition: 'salvaged',
    uses: ['Breathe underwater', 'Survive liquid Provinces'],
    meaning: 'Salvaged breathing gear for Province 472.'
  },
  'Torn Clothing': {
    type: 'Clothing', condition: 'barely functional',
    uses: ['Minimal coverage'],
    meaning: 'Barely covering. Worn thin.'
  }
};

// ─── Guilt Entries (only visible when NPC has been met) ───
export const GUILT_ENTRIES = [
  { name: 'Patch', bond: 'Unresolved', province: 618, npcKey: 'patch', note: 'A healer who gave Bullet a cloak. Left behind.', trigger: (f, ctx) => ctx.leftCamp || !!f.patch_cloak },
  { name: 'Spark', bond: 'Debt carried', province: 618, npcKey: 'spark', note: 'A young inventor whose unetched shard Bullet carries.', trigger: (f) => !!f.spark_shard },
  { name: 'Shard', bond: 'Abandonment', province: 618, npcKey: 'shard', note: 'The camp leader. Left behind when the Pull dragged Bullet away.', trigger: (f, ctx) => ctx.leftCamp },
  { name: 'Cowboy', bond: 'Witness Guilt', province: 618, npcKey: 'cowboy', note: 'Taken by the sand maw during the purifier run.', trigger: (f) => !!f.cowboy_death },
  { name: 'Rivet', bond: 'Abandonment', province: 618, npcKey: 'rivet', note: 'A fighter of Red Sand Camp. Left behind when the Pull dragged Bullet away.', trigger: (f, ctx) => ctx.leftCamp },
  { name: 'Ember', bond: 'Abandonment', province: 472, npcKey: 'ember', note: 'The dome leader. Left behind when the Pull dragged Bullet onward.', trigger: (f, ctx) => ctx.leftDome },
  { name: 'Thread', bond: 'Debt carried', province: 472, npcKey: 'thread', note: 'A gentle weaver whose algae-wrapped blade Bullet carries.', trigger: (f) => !!f.thread_blade },
  { name: 'The Underwater Dome', bond: 'Witness Guilt', province: 472, npcKey: null, note: 'A fragile refuge Bullet could not stay to protect.' },
  { name: 'Glow', bond: 'Rescue', province: 269, npcKey: 'glow', note: 'Stayed behind to save dreamers in the Dream Jungle.' },
  { name: 'Thorn', bond: 'Regret', province: 512, npcKey: 'thorn', note: 'False hope in the Sky-Mist Ascents.' },
  { name: 'Frosthawk', bond: 'Trust', province: 713, npcKey: 'frosthawk', note: 'Trust and failure in the Frozen Tundra.' },
  { name: 'Silt', bond: 'Uncertain Fate', province: 108, npcKey: 'silt', note: 'Respect in the Rust Swamp. Uncertain fate.' },
  { name: 'Scorch', bond: 'Trust', province: 429, npcKey: 'scorch', note: 'Kindness accepted on the Scorched Plain.' },
  { name: 'Blade', bond: 'Rescue', province: 927, npcKey: 'blade', note: 'Helped Bullet escape the Obsidian City.' },
  { name: 'Amphitheater Victims', bond: 'Witness Guilt', province: 14, npcKey: null, note: 'Witnessed and left behind in the Park.' },
  { name: 'Way-Station Operatives', bond: 'Witness Guilt', province: 0, npcKey: null, note: 'Killed by Bullet during blackout.' },
  { name: 'Meadow Husks', bond: 'Witness Guilt', province: 140, npcKey: null, note: 'Blackout slaughter. Bullet woke surrounded by dead husks.' }
];

export function isGuiltVisible(entry, flags) {
  const npcRels = flags.npc_relationships || {};
  const history = flags.province_history || [];
  const currentProvince = flags.current_province || 618;
  const isMichael = flags.phase === 'Final Revelation' || flags.phase === 'Cleanup' || currentProvince === 1 || currentProvince === -1;
  const leftCamp = history.some(p => p !== 618) || currentProvince !== 618;
  const leftDome = history.includes(837) || (history.includes(472) && currentProvince !== 472);
  const ctx = { leftCamp, leftDome, isMichael };

  if (isMichael) return true;

  // For NPC-based entries: must have met the NPC AND the emotional trigger must have fired.
  // Meeting someone adds them to People Met — it does NOT create a guilt entry.
  // Guilt is created by loss, failure, abandonment, violence, receiving a debt object, or being helped in a major way.
  if (entry.npcKey) {
    if (!npcRels[entry.npcKey]) return false;
    if (entry.trigger && !entry.trigger(flags, ctx)) return false;
    return true;
  }

  // For event-based entries (Amphitheater, Way-Station, Meadow), check province visited
  return history.includes(entry.province) || currentProvince === entry.province;
}

// ─── Memory Labels ───
export const MEMORY_LABELS = {
  verified: { label: 'Verified Memory', color: 'text-emerald-400', badge: 'bg-emerald-950/40 border-emerald-800/40' },
  unverified: { label: 'Unverified Memory', color: 'text-amber-400', badge: 'bg-amber-950/40 border-amber-800/40' },
  false_guilt: { label: 'False Guilt Echo', color: 'text-red-400', badge: 'bg-red-950/40 border-red-800/40' },
  province_planted: { label: 'Province-Planted Vision', color: 'text-purple-400', badge: 'bg-purple-950/40 border-purple-800/40' },
  myth: { label: 'Myth Fragment', color: 'text-sky-400', badge: 'bg-sky-950/40 border-sky-800/40' },
  shard: { label: 'Shard Memory', color: 'text-amber-300', badge: 'bg-amber-950/30 border-amber-700/30' }
};

// ─── Observed Facts (always visible — physical observations, not memories) ───
export const OBSERVED_FACTS = [
  'Circular scar on chest',
  'Warm shard of unknown material'
];

// ─── Memory Fragments (only visible when unlocked via story progression) ───
export const MEMORY_FRAGMENTS = [
  { text: '"to end its torment"', condition: 'heard_to_end_its_torment', type: 'unverified' },
  { text: 'Steel-gray eyes watching through a rift', condition: 'saw_steel_gray_eyes', type: 'unverified' },
  { text: 'A golden city', condition: 'learned_golden_city', type: 'unverified' },
  { text: 'The Garden', condition: 'father_garden', type: 'myth' },
  { text: 'Blade of Dawn', condition: 'learned_blade_of_dawn', type: 'myth' },
  { text: 'Star-Crowned Ember', condition: 'learned_star_crowned_ember', type: 'myth' },
  { text: 'Silent Pulse', condition: 'learned_silent_pulse', type: 'myth' },
  { text: 'Michael — your true name', condition: 'revealed_michael', type: 'verified' },
  { text: 'Father — the one who sent you', condition: 'revealed_father', type: 'verified' }
];

// ─── Scar Effects (progressive — only show what's been discovered) ───
export const SCAR_EFFECTS_STAGES = [
  { effects: ['Pulses near the shard', 'Reacts when the Pull grows stronger'], condition: 'always' },
  { effects: ['Warns of danger'], condition: 'first_healing' },
  { effects: ['Reacts to Province boundaries'], condition: 'province_472' },
  { effects: ['Resists some illusions', 'Anchors Bullet during despair'], condition: 'shard_focus_unlocked' },
  { effects: ['May trigger memory flashes'], condition: 'heard_to_end_its_torment' }
];

export function getScarEffects(flags) {
  const effects = [];
  for (const stage of SCAR_EFFECTS_STAGES) {
    if (isStageUnlocked(stage.condition, flags)) {
      effects.push(...stage.effects);
    }
  }
  return effects;
}

// ─── Player-Facing Codex (separate from GM lore) ───
// Each entry has stages that unlock progressively. At Chapter 1, only minimal
// "what Bullet knows" content is shown. Final truth unlocks only at Province 1.
export const PLAYER_CODEX = {
  story: {
    title: 'The Tale So Far',
    category: 'story',
    stages: [{ content: 'Bullet woke face-down in red sand with no memory.\n\nHe found a circular scar over his heart and a strange warm shard in his pocket.\n\nSomething inside his chest pulls him forward.', condition: 'always' }]
  },
  objective: {
    title: 'Current Objective',
    category: 'objective',
    stages: [
      { content: 'Survive.\n\nFind water.\n\nUnderstand where the Pull is leading.', condition: 'always' },
      { content: 'Follow the Pull. Survive the Provinces. Discover the truth about the scar, the shard, and what waits at the end.', condition: 'first_healing' }
    ]
  },
  bullet: {
    title: 'Bullet',
    category: 'bullet',
    stages: [
      { content: 'Bullet is not his real name.\n\nHe does not remember his past.\n\nFor now, he is simply an injured man in a hostile Province with a scar over his heart and no idea why he is here.', condition: 'always' },
      { content: 'Bullet is Michael. A divine being sent by Father to end the Provinces\' torment. To cross the veil, Michael shot himself in the heart at Father\'s command — the scar that named him Bullet. He forgot everything: his name, his purpose, his divinity. The etched shard (Father\'s own light) guided him through amnesia. The Pull was Father\'s will, driving him forward. He survived every province not because he knew he was divine, but because he chose righteousness even without memory. Both identities are true: Michael (divine mission) and Bullet (the scarred wanderer). After Cleanup, Michael ascends home to Father.', condition: 'revealed_michael' }
    ]
  },
  pull: {
    title: 'The Pull',
    category: 'pull',
    stages: [
      { content: 'A force in Bullet\'s chest that points forward.\n\nIt is not a voice.\n\nIt is not a thought.\n\nIt is a direction.\n\nPurpose unknown.', condition: 'always' },
      { content: 'The Pull intensifies when resisted — from a gentle tug to an ache, a burn, a commanding force that can trigger blackouts. At low intensity, Bullet can delay and explore. At high intensity, the scar burns, visions appear, and forced movement becomes a risk. The Pull never explains itself.', condition: 'first_healing' },
      { content: 'The Pull was Father\'s will — a shadow of His mission pressure filtered through amnesia. It drove Michael forward through every Province. After the final battle, the Pull vanishes.', condition: 'revealed_father' }
    ]
  },
  scar: {
    title: 'The Scar',
    category: 'scar',
    stages: [
      { content: 'A circular scar over Bullet\'s heart.\n\nIt looks old, clean, and unnatural.\n\nIt sometimes pulses with heat.\n\nIt reacts to the strange shard.\n\nOrigin unknown.', condition: 'always' },
      { content: 'The scar may be connected to the phrase "to end its torment."', condition: 'heard_to_end_its_torment' },
      { content: 'The scar may be more than an injury. It may be an anchor — it warns of danger, reacts to Province boundaries, syncs with the shard, resists some illusions, and anchors Bullet during despair.', condition: 'shard_focus_unlocked' },
      { content: 'The scar is Michael\'s entry wound into the realm. To cross the veil, Michael shot himself in the heart at Father\'s command. Not true suicide born of despair, but sacrifice born of mission.', condition: 'revealed_michael' }
    ]
  },
  etched_shard: {
    title: 'The Etched Shard',
    category: 'shard',
    stages: [
      { content: 'A small shard of metal or glass, warm to the touch.\n\nIt is marked with a circle split by a jagged uneven line.\n\nIt pulses faintly near Bullet\'s scar.\n\nPurpose unknown.', condition: 'always' },
      { content: 'The shard may be helping Bullet survive wounds that should have killed him.', condition: 'first_healing' },
      { content: 'The shard resisted rust venom.', condition: 'province_108' },
      { content: 'The shard can resonate with crystal structures.', condition: 'province_998' },
      { content: 'The shard can reveal hidden truth when focused. But hidden truth can see you back.', condition: 'shard_focus_unlocked' },
      { content: 'Father shaped the etched shard from His own light as a beacon through amnesia. In Province 1, it shatters the barrier and awakens Michael\'s divine memories. After the final battle, Michael gives it to his brother — the Leader takes it home to Father.', condition: 'revealed_michael' }
    ]
  },
  pipe: {
    title: 'The Pipe',
    category: 'pipe',
    stages: [
      { content: 'Bullet does not start with a weapon. The first time he faces a physical threat, he instinctively snatches up a battered metal pipe from the environment — his body remembering what his mind has forgotten. From that moment, it becomes his main weapon, walking stick, and emotional anchor.', condition: 'pipe_found' },
      { content: 'In Province 1, after Michael awakens, the pipe briefly transforms into a radiant sword of white fire. After the final battle, it becomes the pipe again. The pipe is Bullet\'s survival. The sword is Michael\'s mission. Both are true.', condition: 'revealed_michael' }
    ]
  },
  spark_shard: {
    title: 'Spark\'s Unetched Shard',
    category: 'shard',
    stages: [{ content: 'A cool, unetched shard given to Bullet by Spark in Province 618. It represents debt, hope, connection, and a reminder of the people left behind.', condition: 'spark_shard' }]
  },
  shard_focus: {
    title: 'Shard Focus',
    category: 'shard',
    stages: [{ content: 'A permanent player action: Focus Etched Shard. Reveals hidden seams, detects false exits, resists illusions, reads hidden Province machinery. Cost: scar pain, mental strain, resonance trail, Hunter Proximity increase. Warning: the shard shows hidden truth. But hidden truth can see you back.', condition: 'shard_focus_unlocked' }]
  },
  province_618: {
    title: 'Province 618: Red Sand Camp',
    earlyTitle: 'Current Province',
    category: 'provinces',
    stages: [
      { content: 'Red Sand — A hostile desert of red dunes, heat, thirst, and unknown danger. Bullet does not yet know its official name.', condition: 'always' },
      { content: 'Province 618: Red Sand Camp — Red dunes under a harsh sun. A camp of survivors. Water is scarce. This is where Bullet woke, was named, and first felt the Pull.', condition: 'met_camp' }
    ]
  },
  province_472: {
    title: 'Province 472: The Water Block',
    category: 'provinces',
    stages: [
      { content: 'A massive suspended block of liquid — not normal water, but thick and alive. The breathing apparatus is necessary to enter it. Strange ocean-like life moves inside. The Pull leads deeper.', condition: 'province_472' },
      { content: 'Deep in the murk, an underwater dome settlement. Ember leads it. Thread, Veil, Glint, and Flicker live inside. The dome is cracking.', condition: 'dome_discovered' },
      { content: 'The Dreadwraith — an adaptive material hunter — appeared here. It is not natural. An exposed core is its weakness; Bullet shattered it with the pipe.', condition: 'dreadwraith' }
    ]
  },
  province_837: {
    title: 'Province 837: Digger/Borer Tunnels',
    category: 'provinces',
    stages: [{ content: 'Underground tunnels with root gardens and farms. Two factions war over scarce resources. The First Sowing altar reveals the Provinces were seeded.', condition: 'province_837' }]
  },
  province_269: {
    title: 'Province 269: Dream Jungle',
    category: 'provinces',
    stages: [{ content: 'A bioluminescent fungal jungle. Spores whisper rest, stay, join. Dreamers are trapped in false peace.', condition: 'province_269' }]
  },
  province_391: {
    title: 'Province 391: Mirrorheart Plain',
    category: 'provinces',
    stages: [{ content: 'An endless mirror plain. Glass trees and mirror spires. False versions of Bullet show tyrant, thief, and monster possibilities.', condition: 'province_391' }]
  },
  province_512: {
    title: 'Province 512: Sky-Mist Ascents',
    category: 'provinces',
    stages: [{ content: 'Floating moss islands connected by rope bridges. A vortex promises home but leads to another Province. Hope is a weapon here.', condition: 'province_512' }]
  },
  province_713: {
    title: 'Province 713: Frozen Tundra',
    category: 'provinces',
    stages: [{ content: 'Ice fields and crystal storms. An igloo camp. The three-headed Ice Hound guards the exit. Static crystals can kill it.', condition: 'province_713' }]
  },
  province_927: {
    title: 'Province 927: Obsidian City',
    category: 'provinces',
    stages: [{ content: 'A black glass city with magma fissures and toxic air. Scrying walls show fear and desire visions.', condition: 'province_927' }]
  },
  province_108: {
    title: 'Province 108: Rust Swamp',
    category: 'provinces',
    stages: [{ content: 'An oily iron swamp with metal trees and rust vines. Rust venom hardens the body. The etched shard can counter it.', condition: 'province_108' }]
  },
  province_429: {
    title: 'Province 429: Scorched Plain',
    category: 'provinces',
    stages: [{ content: 'Burning ground, ash storms, and molten fissures. A Fire Elemental boss. Hearth attacks Bullet.', condition: 'province_429' }]
  },
  province_998: {
    title: 'Province 998: Prism Expanse',
    category: 'provinces',
    stages: [{ content: 'Floating crystal fragments over a void. An obelisk rift opens and steel-gray eyes see Bullet. The etched shard slams the rift shut.', condition: 'province_998' }]
  },
  province_14: {
    title: 'Province 14: The Park / Meadow',
    category: 'provinces',
    stages: [{ content: 'A beautiful false park hiding an amphitheater where humans are tortured as puppets. The Storyteller tells the myth of the Star and the Wanderer.', condition: 'province_14' }]
  },
  province_1: {
    title: 'Province 1: Final Castle',
    category: 'provinces',
    stages: [{ content: 'A black shore. A ferryman demands payment — Bullet pays with Spark\'s unetched shard. A violet-green barrier blocks the castle; the etched shard shatters it, awakening Michael\'s divine memories. The Leader is Michael\'s fallen brother. The Pull vanishes. Cleanup begins.', condition: 'province_1' }]
  },
  seeker: {
    title: 'The Seeker',
    category: 'seeker',
    stages: [{ content: 'Province 1\'s hunter. Calm, precise, relentless, and increasingly frustrated. He begins by relying on guardians and interrogation. After the Ice Hound dies, he becomes more direct.', condition: 'seeker' }]
  },
  dreadwraith: {
    title: 'The Dreadwraith',
    category: 'dreadwraith',
    stages: [{ content: 'A recurring adaptive monster. It adapts to materials — crystal, stone, liquid, metal, bone, shadow.', condition: 'dreadwraith' }]
  },
  genesis: {
    title: 'Genesis (Unverified)',
    category: 'lore',
    stages: [{ content: 'Fragmentary visions suggest the realm was shaped from chaos. This is unverified — it may be true memory, distorted memory, or Province-planted myth.', condition: 'genesis' }]
  },
  architect_fall: {
    title: 'The Leader\'s Fall',
    category: 'lore',
    stages: [{ content: 'The Leader is the Star-Crowned Ember from creation myths — a divine being who defied Father and fell. He built the Provinces as his corrupted kingdom. He is Michael\'s fallen brother.', condition: 'architect_fall' }]
  },
  blade_of_dawn: {
    title: 'Blade of Dawn',
    category: 'myths',
    stages: [{ content: 'The myth of a radiant sword of white fire that ends torment.', condition: 'learned_blade_of_dawn' }]
  },
  star_wanderer: {
    title: 'The Star and the Wanderer (Myth)',
    category: 'myths',
    stages: [{ content: 'A story told by the Storyteller in Province 14. It may describe the Architect\'s fall.', condition: 'star_wanderer' }]
  },
  father_garden: {
    title: 'Father and the Garden',
    category: 'lore',
    stages: [{ content: 'Father is the supreme being. The Garden is the original home. The Leader tried to replicate the Garden and failed. "Only One can make the Garden."', condition: 'father_garden' }]
  },
  steel_gray_eyes: {
    title: 'Steel-Gray Eyes',
    category: 'bullet',
    stages: [{ content: 'Bullet has steel-gray eyes. In Province 998, steel-gray eyes see him through an obelisk rift. In Province 1, the Leader has steel-gray eyes. They are brothers.', condition: 'saw_steel_gray_eyes' }]
  },
  the_greatest_task: {
    title: 'The Greatest Task',
    category: 'lore',
    stages: [{ content: 'Father gave Michael the greatest task: enter the realm of torment, forget himself, suffer as the trapped souls suffer, and end the Provinces\' torment. The amnesia was intentional: to choose righteousness, not divinity.', condition: 'province_1' }]
  },
  cleanup_mode: {
    title: 'Cleanup Mode',
    category: 'cleanup',
    stages: [{ content: 'After Province 1, Michael walks back through every province in reverse, touching each soul. The irredeemably bad dissolve into nothing. The good ascend home to the Garden.', condition: 'cleanup_mode' }]
  }
};

export function getPlayerCodexContent(entry, flags) {
  if (!entry.stages) return entry.content || '';
  let content = '';
  for (const stage of entry.stages) {
    if (isStageUnlocked(stage.condition, flags)) {
      content = stage.content;
    }
  }
  return content;
}

export function isPlayerCodexEntryVisible(entry, flags) {
  if (!entry.stages) return false;
  return entry.stages.some(stage => isStageUnlocked(stage.condition, flags));
}

export function getPlayerCodexTitle(entry, flags) {
  if (!entry.earlyTitle) return entry.title;
  if (entry.stages.length > 1) {
    for (let i = 1; i < entry.stages.length; i++) {
      if (isStageUnlocked(entry.stages[i].condition, flags)) return entry.title;
    }
  }
  return entry.earlyTitle;
}

// ─── Pull Behavior & Resistance Cost ───
export function derivePullBehavior(intensity) {
  const behaviors = ['steady', 'steady', 'pulsing', 'painful', 'painful', 'roaring', 'roaring'];
  return behaviors[Math.max(0, Math.min(6, Math.round(intensity || 0)))] || 'steady';
}

export function deriveResistanceCost(intensity) {
  const costs = ['none', 'minor pain', 'minor pain', 'severe pain', 'severe pain', 'blackout risk', 'blackout risk'];
  return costs[Math.max(0, Math.min(6, Math.round(intensity || 0)))] || 'minor pain';
}

// ─── Current Objective (state-driven, updated by GM) ───
export function getCurrentObjective(flags) {
  const co = flags.current_objective;
  if (co && co.description) return co.description;
  // Fall back to stage-based objective if GM hasn't set one yet
  return getPlayerCodexContent(PLAYER_CODEX.objective, flags);
}