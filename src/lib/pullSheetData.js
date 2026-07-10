// THE PULL — Character Sheet Data & Helpers
// Body zones, instincts, shard powers, guilt entries, memory labels

// ─── Body Zones ───
export const BODY_ZONES = [
  { key: 'head', label: 'Head', default: 'clear', states: ['clear', 'dizzy', 'bleeding', 'vision distorted'] },
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
  rust_venom: { zone: 'left_arm', state: 'venom-scarred' }
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
  if ((clocks?.hunter_proximity || 0) > 0 || (clocks?.seeker_frustration || 0) > 0) labels.push('Hunted');
  labels.push('Pull-bound');
  return labels.join(' / ');
}

// ─── Instincts ───
export const INSTINCT_LABELS = {
  combat: ['Dormant', 'Faint', 'Present', 'Strong', 'Extreme', 'Sovereign'],
  endurance: ['Broken', 'Faltering', 'Steady', 'Strong', 'Extreme', 'Indomitable'],
  awareness: ['Blind', 'Drowsy', 'Alert', 'Sharp', 'Piercing', 'Omniscient'],
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

// ─── Shard Powers ───
export const SHARD_POWERS = [
  { key: 'passive', label: 'Passive Stabilization', province: 618, desc: 'Keeps Bullet alive longer than he should survive. Passive warmth, minor healing, scar synchronization.' },
  { key: 'venom', label: 'Venom Resistance', province: 108, desc: 'Counters rust venom and other corruption effects. The etched shard can counteract hardening.' },
  { key: 'resonance', label: 'Resonance', province: 998, desc: 'Allows pipe, scar, shard, and Province structures to vibrate together. Sonic weapon vs Shardswarms.' },
  { key: 'focus', label: 'Focus Etched Shard', province: 391, desc: 'Reveals hidden seams, false doors, and concealed truth. Cost: scar pain, mental strain, resonance trail.' },
  { key: 'barrier', label: 'Barrier Break', province: 1, desc: "The shard can break the castle's force field and restore Michael's divine memories." }
];

// ─── Inventory Details ───
export const INVENTORY_DETAILS = {
  'Etched Shard': {
    type: 'Divine Beacon', condition: 'Warm to the touch',
    uses: ['Passive healing', 'Scar resonance', 'Venom resistance', 'Hidden truth detection', 'Rift interference', 'Barrier breaking'],
    meaning: 'Father shaped it from His own light. A beacon through amnesia.'
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
  'Torn Clothing': {
    type: 'Clothing', condition: 'barely functional',
    uses: ['Minimal coverage'],
    meaning: 'Barely covering. Barefoot.'
  }
};

// ─── Guilt Entries ───
export const GUILT_ENTRIES = [
  { name: 'Patch', bond: 'Unresolved', province: 618, note: 'A healer who gave Bullet a cloak. Left behind.' },
  { name: 'Spark', bond: 'Debt carried', province: 618, note: 'A young inventor whose unetched shard Bullet carries.' },
  { name: 'Shard', bond: 'Abandonment', province: 618, note: 'The camp leader. Left behind when the Pull dragged Bullet away.' },
  { name: 'Cowboy', bond: 'Witness Guilt', province: 618, note: 'Death memory from the camp.' },
  { name: 'Glow', bond: 'Rescue', province: 269, note: 'Stayed behind to save dreamers in the Dream Jungle.' },
  { name: 'Thorn', bond: 'Regret', province: 512, note: 'False hope in the Sky-Mist Ascents.' },
  { name: 'Frosthawk', bond: 'Trust', province: 713, note: 'Trust and failure in the Frozen Tundra.' },
  { name: 'Silt', bond: 'Uncertain Fate', province: 108, note: 'Respect in the Rust Swamp. Uncertain fate.' },
  { name: 'Scorch', bond: 'Trust', province: 429, note: 'Kindness accepted on the Scorched Plain.' },
  { name: 'Blade', bond: 'Rescue', province: 927, note: 'Helped Bullet escape the Obsidian City.' },
  { name: 'Amphitheater Victims', bond: 'Witness Guilt', province: 14, note: 'Witnessed and left behind in the Park.' },
  { name: 'Way-Station Operatives', bond: 'Witness Guilt', province: 0, note: 'Killed by Bullet during blackout.' },
  { name: 'Meadow Husks', bond: 'Witness Guilt', province: 140, note: 'Blackout slaughter. Bullet woke surrounded by dead husks.' }
];

export function isGuiltVisible(entry, flags) {
  const history = flags.province_history || [];
  return history.includes(entry.province) || flags.current_province === entry.province;
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

export const STARTING_FRAGMENTS = [
  'Scar over heart', 'Phrase: "to end its torment"', 'Steel-gray eyes',
  'Sword symbol', 'Golden city', 'Garden myth',
  'Blade of Dawn', 'Star-Crowned Ember', 'Silent Pulse'
];

// ─── Scar Effects ───
export const SCAR_EFFECTS = [
  'Warns of danger', 'Reacts to Province boundaries', 'Syncs with the etched shard',
  'Resists some illusions', 'Anchors Bullet during despair', 'May trigger memory flashes'
];

// ─── Pull Behaviors ───
export function derivePullBehavior(intensity) {
  const behaviors = ['steady', 'steady', 'pulsing', 'painful', 'painful', 'roaring', 'roaring'];
  return behaviors[Math.max(0, Math.min(6, Math.round(intensity || 0)))] || 'steady';
}

export function deriveResistanceCost(intensity) {
  const costs = ['none', 'minor pain', 'minor pain', 'severe pain', 'severe pain', 'blackout risk', 'blackout risk'];
  return costs[Math.max(0, Math.min(6, Math.round(intensity || 0)))] || 'minor pain';
}