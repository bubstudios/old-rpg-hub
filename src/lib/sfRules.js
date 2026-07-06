// Star Frontiers (Alpha Dawn) rules — species, abilities, skills, weapons, and helpers.
// Mirrors the role of dndRules.js but for SF sci-fi campaigns.

export const SPECIES = {
  Human: {
    description: "Versatile and adaptable, the most common species on the Frontier. Humans channel their drive into any pursuit.",
    adjustment: { chosen: 10 },
    fixedAdjustment: false,
    special: "Adaptable: +10 to any one ability of your choice."
  },
  Dralasite: {
    description: "Amoeba-like, philosophical beings. Tough and strong, dralasites are hardy survivors who can sense deception.",
    adjustment: { str: 10 },
    fixedAdjustment: true,
    special: "Lie Detection: dralasites sense lies (75% base chance) and are resilient to mental influence."
  },
  Vrusk: {
    description: "Insectoid beings driven by logic and intuition. Vrusk make excellent technicians and negotiators.",
    adjustment: { log: 10 },
    fixedAdjustment: true,
    special: "Comprehension: vrusk quickly grasp complex situations, patterns, and machinery."
  },
  Yazirian: {
    description: "Ape-like, aggressive beings. Yazirians are fast and fierce, capable of fearsome battle rage.",
    adjustment: { rs: 10 },
    fixedAdjustment: true,
    special: "Battle Rage: once per encounter a yazirian may rage, gaining +20 to melee damage."
  }
};

export const ABILITIES = [
  { key: 'str', name: 'Strength', desc: 'Physical power, melee damage, lifting.' },
  { key: 'int', name: 'Intelligence', desc: 'Reasoning, recall, learning rate.' },
  { key: 'log', name: 'Logic', desc: 'Deductive reasoning and analysis.' },
  { key: 'dex', name: 'Dexterity', desc: 'Hand-eye coordination and aim.' },
  { key: 'rs', name: 'Reaction Speed', desc: 'Quickness, reflexes, and initiative.' },
  { key: 'per', name: 'Personality', desc: 'Charisma, presence, and rapport.' },
  { key: 'ldr', name: 'Leadership', desc: 'Command, influence, and morale.' },
  { key: 'sta', name: 'Stamina', desc: 'Endurance and health — your damage capacity (hit points).' }
];

export const SKILL_AREAS = {
  Military: {
    desc: 'Combat proficiency with weapons and demolitions.',
    skills: ['Beam Weapons', 'Projectile Weapons', 'Gyrojet Weapons', 'Melee Weapons', 'Thrown Weapons', 'Demolitions']
  },
  Technological: {
    desc: 'Mastery of computers, robotics, and machinery.',
    skills: ['Computer', 'Robotics', 'Technician', 'Medical']
  },
  Biosocial: {
    desc: 'Sciences, survival, and understanding of minds and worlds.',
    skills: ['Environmental', 'Psycho-Social', 'Analyze']
  }
};

export const STARTING_KITS = {
  Military: {
    credits: 400,
    equipment: [
      { name: 'Laser Pistol', qty: 1 },
      { name: 'Fragmentation Grenade', qty: 2 },
      { name: 'Machintosh Vest (Standard Armor)', qty: 1 },
      { name: 'Chronocom', qty: 1 }
    ]
  },
  Technological: {
    credits: 700,
    equipment: [
      { name: 'Laser Pistol', qty: 1 },
      { name: 'Tech Toolkit', qty: 1 },
      { name: 'Machintosh Vest (Standard Armor)', qty: 1 },
      { name: 'Chronocom', qty: 1 }
    ]
  },
  Biosocial: {
    credits: 600,
    equipment: [
      { name: 'Stunstick', qty: 1 },
      { name: 'Medkit', qty: 1 },
      { name: 'Environment Suit', qty: 1 },
      { name: 'Chronocom', qty: 1 }
    ]
  }
};

export const WEAPONS = {
  'Laser Pistol': { damage: '1d10', type: 'beam', notes: 'Sidearm, energy clip' },
  'Laser Rifle': { damage: '2d10', type: 'beam', notes: 'Long arm, energy clip' },
  'Recoilless Pistol': { damage: '1d10', type: 'projectile', notes: 'Slug thrower' },
  'Recoilless Rifle': { damage: '2d10', type: 'projectile', notes: 'Slug thrower' },
  'Gyrojet Pistol': { damage: '2d10', type: 'gyrojet', notes: 'Rocket rounds' },
  'Stunstick': { damage: '1d6', type: 'melee', notes: 'Stunning melee weapon' },
  'Fragmentation Grenade': { damage: '3d10', type: 'thrown', notes: 'Area blast' }
};

export function rollD100() {
  return Math.floor(Math.random() * 100) + 1;
}

export function rollAbilityScores() {
  const scores = {};
  ABILITIES.forEach((a) => { scores[a.key] = rollD100(); });
  return scores;
}

// Apply species adjustments. For Humans, chosenAbility is the key receiving +10.
export function applySpeciesAdjustments(scores, species, chosenAbility) {
  const adj = SPECIES[species]?.adjustment || {};
  const out = { ...scores };
  if (SPECIES[species]?.fixedAdjustment) {
    Object.entries(adj).forEach(([k, v]) => { if (k !== 'chosen') out[k] = Math.min(100, (out[k] || 50) + v); });
  } else if (chosenAbility && out[chosenAbility] !== undefined) {
    out[chosenAbility] = Math.min(100, out[chosenAbility] + (adj.chosen || 10));
  }
  return out;
}

// Stamina = STA ability score (damage capacity / hit points).
export function computeStamina(scores) {
  return Math.max(1, Math.round(scores.sta || 50));
}

// Initiative = RS / 10 (rounded down).
export function getInitiative(rs) {
  return Math.floor((rs || 50) / 10);
}

// To-hit chance (percentile, roll-under): ability/2 + 10% per skill level.
export function hitChance(abilityScore, skillLevel) {
  return Math.min(95, Math.max(5, Math.floor((abilityScore || 50) / 2) + (skillLevel || 0) * 10));
}