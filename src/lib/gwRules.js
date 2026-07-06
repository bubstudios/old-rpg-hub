// Gamma World (1st/2nd Edition TSR) rules — genotypes, attributes, mutations, weapons, and helpers.
// Mirrors the role of dndRules.js / sfRules.js but for GW post-apocalyptic campaigns.

export const GENOTYPES = {
  "Pure Strain Human": {
    description: "Unmutated descendants of pre-cataclysm humanity. Free of mutation's curse — and its gifts. Resistant to radiation and adept with ancient artifacts.",
    physicalMutations: 0,
    mentalMutations: 0,
    special: "Artifact Affinity: +2 to operate ancient technology; resistant to radiation."
  },
  "Altered Human": {
    description: "Humanoid survivors reshaped by the biogenetic storms. Wield both physical and mental mutations, walking the line between brilliance and aberration.",
    physicalMutations: 2,
    mentalMutations: 2,
    special: "Balanced Mutant: rolls 2 physical + 2 mental mutations."
  },
  "Mutated Animal": {
    description: "Sentient, evolved beasts — hawks, bears, wolves, serpents — risen to intelligence. Retain natural abilities and deadly instincts.",
    physicalMutations: 3,
    mentalMutations: 1,
    special: "Beast Heritage: natural attacks (claws/bite) and heightened senses."
  },
  "Sentient Plant": {
    description: "Mobile, thinking flora — carnivorous vines, mycelial wanderers. Alien in mind and resilient in form.",
    physicalMutations: 3,
    mentalMutations: 2,
    special: "Plant Physiology: immune to many mental effects; photosynthesizes in sunlight."
  }
};

export const ABILITIES = [
  { key: 'ps', name: 'Physical Strength', short: 'PS', desc: 'Raw muscle, melee damage, breaking things.' },
  { key: 'ms', name: 'Mental Strength', short: 'MS', desc: 'Willpower, mental combat, mutation potency.' },
  { key: 'dx', name: 'Dexterity', short: 'DX', desc: 'Coordination, aim, reflexes, initiative.' },
  { key: 'cn', name: 'Constitution', short: 'CN', desc: 'Health and hardiness — equals your hit points.' },
  { key: 'in', name: 'Intelligence', short: 'IN', desc: 'Reasoning, recall, and artifact use.' },
  { key: 'ch', name: 'Charisma', short: 'CH', desc: 'Presence, leadership, and reactions.' },
  { key: 'sn', name: 'Senses', short: 'SN', desc: 'Perception, awareness, and detection.' }
];

export const PHYSICAL_MUTATIONS = [
  { name: 'Chitinous Armor', description: 'A hardened exoskeleton grants natural armor. AC improves by 3.' },
  { name: 'Wings', description: 'Functional wings allow powered flight.' },
  { name: 'Claws', description: 'Razor-sharp natural weapons. 1d6 damage in melee.' },
  { name: 'Quills', description: 'Defensive spikes cover the body. Attackers take 1d4 damage in melee.' },
  { name: 'Regeneration', description: 'Heals 1 hit point per turn of rest. Severed limbs regrow over days.' },
  { name: 'Energy Absorption', description: 'Absorbs energy attacks, converting damage to healed hit points.' },
  { name: 'Physical Reflection', description: 'Reflects energy attacks back at their source.' },
  { name: 'Multiple Limbs', description: 'One extra functional limb, granting an additional attack per round.' },
  { name: 'Heightened Strength', description: 'Massive musculature. +2 PS and +1d4 melee damage.' },
  { name: 'Heightened Precision', description: 'Exceptional coordination. +2 DX.' },
  { name: 'Heightened Constitution', description: 'Robust vitality. +2 CN and +2 hit points.' },
  { name: 'Sonic Blast', description: 'Generates a focused sound wave. Ranged attack, 2d6 damage.' },
  { name: 'Gas Generation', description: 'Exudes a noxious cloud. Those within 5m save or be incapacitated.' },
  { name: 'Toxic Weapon', description: 'Natural poison delivered by claw or bite. Target saves or takes extra damage.' },
  { name: 'Infravision', description: 'Sees heat patterns in darkness as if daylight.' },
  { name: 'Photogeneration', description: 'Emits a blinding flash of light. Blinds foes within 10m.' },
  { name: 'Contractile Tendons', description: 'Coiled leg tendons allow leaps of up to 15 meters.' },
  { name: 'Dermal Slime', description: 'Slippery skin coating. Grappling attempts automatically fail.' }
];

export const PHYSICAL_DEFECTS = [
  { name: 'Photodependent', description: 'Suffers -2 to all attributes in darkness; recovers in sunlight.' },
  { name: 'Albino', description: 'Pigmentless skin. Suffers -2 to all attributes in bright sunlight.' },
  { name: 'Poor Respiration', description: 'Diminished lung capacity. Halved movement and stamina recovery.' },
  { name: 'Reduced Strength', description: 'Frail frame. -2 PS.' },
  { name: 'Reduced Dexterity', description: 'Clumsy and uncoordinated. -2 DX.' },
  { name: 'Neural Failure', description: 'Occasional seizures. 5% chance per hour of activity to be incapacitated 1d4 rounds.' }
];

export const MENTAL_MUTATIONS = [
  { name: 'Telepathy', description: 'Reads surface thoughts and communicates mind-to-mind within 100m.' },
  { name: 'Telekinesis', description: 'Moves objects up to 50kg with thought alone.' },
  { name: 'Precognition', description: 'Glimpses seconds into the future. Advantage on one roll per encounter.' },
  { name: 'Empathy', description: 'Senses emotions and intentions of nearby beings.' },
  { name: 'Mental Blast', description: 'A focused psychic assault. Mental attack, 3d6 damage. Targets MS to resist.' },
  { name: 'Force Field', description: 'Generates a mental barrier absorbing 2d6 damage per round.' },
  { name: 'Hypnosis', description: 'Mental control over weak-willed beings. Target saves vs MS or obeys.' },
  { name: 'Illusion Generation', description: 'Creates convincing visual and auditory illusions within 30m.' },
  { name: 'Levitation', description: 'Floats up to 10m above the ground at will.' },
  { name: 'Lightwave Manipulation', description: 'Bends light around the body. Can become invisible.' },
  { name: 'Repulsion Field', description: 'Pushes creatures back 5m. Those who save vs MS resist.' },
  { name: 'Molecular Disruption', description: 'Disintegrates a 1m cube of inanimate matter by touch.' },
  { name: 'Intuition', description: 'Danger sense warns of ambushes and traps before they trigger.' },
  { name: 'Will Force', description: 'Indomitable mind. +2 MS and +2 to all mental defense.' }
];

export const MENTAL_DEFECTS = [
  { name: 'Mental Instability', description: 'Unpredictable behavior under stress. The GM may impose erratic reactions.' },
  { name: 'Dual Brain', description: 'Two minds in one body. Occasional conflicts cause hesitation (5% chance to lose a turn).' },
  { name: 'Seizures', description: 'Periodic psychic storms. 5% chance per hour to be incapacitated 1d6 rounds.' },
  { name: 'Hostility Field', description: 'An aura of menace. NPCs react at -3 CH and may attack unprovoked.' },
  { name: 'Reduced Mental Strength', description: 'Weak will. -2 MS.' }
];

export const STARTING_KITS = {
  "Pure Strain Human": {
    domars: 50,
    equipment: [
      { name: 'Short Sword', qty: 1 },
      { name: 'Crossbow', qty: 1 },
      { name: 'Padded Armor', qty: 1 },
      { name: 'Backpack', qty: 1 },
      { name: 'Water Purifier (artifact)', qty: 1 }
    ]
  },
  "Altered Human": {
    domars: 30,
    equipment: [
      { name: 'Spear', qty: 1 },
      { name: 'Dagger', qty: 1 },
      { name: 'Leather Armor', qty: 1 },
      { name: 'Backpack', qty: 1 }
    ]
  },
  "Mutated Animal": {
    domars: 15,
    equipment: [
      { name: 'Club', qty: 1 },
      { name: 'Backpack', qty: 1 }
    ]
  },
  "Sentient Plant": {
    domars: 10,
    equipment: [
      { name: 'Sling', qty: 1 },
      { name: 'Backpack', qty: 1 }
    ]
  }
};

export const WEAPONS = {
  'Club': { damage: '1d4', type: 'melee', notes: 'Primitive blunt weapon' },
  'Dagger': { damage: '1d4', type: 'melee', notes: 'Ancient blade, quick' },
  'Spear': { damage: '1d6', type: 'melee', notes: 'Primitive thrusting weapon' },
  'Short Sword': { damage: '1d6', type: 'melee', notes: 'Ancient blade, rusted but keen' },
  'Sling': { damage: '1d4', type: 'ranged', notes: 'Stones, plentiful ammo' },
  'Crossbow': { damage: '1d6', type: 'ranged', notes: 'Ancient reloadable weapon' },
  'Slug Thrower': { damage: '1d6+1', type: 'ranged', notes: 'Ancient firearm, scarce ammo' },
  'Laser Pistol': { damage: '2d6', type: 'energy', notes: 'Ancient energy weapon' },
  'Grenade': { damage: '3d6', type: 'thrown', notes: 'Ancient explosive, single use' }
};

function rollDie(sides) { return Math.floor(Math.random() * sides) + 1; }

export function roll3d6DropLowest() {
  const rolls = [rollDie(6), rollDie(6), rollDie(6), rollDie(6)];
  rolls.sort((a, b) => a - b);
  return rolls[1] + rolls[2] + rolls[3];
}

export function rollAbilityScores() {
  const scores = {};
  ABILITIES.forEach((a) => { scores[a.key] = roll3d6DropLowest(); });
  return scores;
}

export function abilityMod(score) {
  return Math.floor(((score || 10) - 10) / 2);
}

// Hit points = Constitution score.
export function computeHP(scores) {
  return Math.max(1, Math.round(scores.cn || 10));
}

// Initiative modifier from Dexterity.
export function getInitiativeMod(scores) {
  return abilityMod(scores.dx);
}

// Armor class starts at 10 (unarmored, descending — lower is better).
// Chitinous Armor mutation and equipped armor reduce it.
export function computeAC(mutations, equipment) {
  let ac = 10;
  const armorMap = { 'Padded Armor': 1, 'Leather Armor': 2, 'Chain Mail': 5, 'Plate Mail': 7 };
  (equipment || []).forEach(item => {
    if (armorMap[item.name]) ac -= armorMap[item.name];
  });
  const hasChitin = (mutations || []).some(m => m.name === 'Chitinous Armor');
  if (hasChitin) ac -= 3;
  return Math.max(1, ac);
}

// Apply ability-score modifiers from mutations (Heightened/Reduced traits).
export function applyMutationModifiers(scores, mutations) {
  const out = { ...scores };
  (mutations || []).forEach(m => {
    switch (m.name) {
      case 'Heightened Strength': out.ps = (out.ps || 10) + 2; break;
      case 'Heightened Precision': out.dx = (out.dx || 10) + 2; break;
      case 'Heightened Constitution': out.cn = (out.cn || 10) + 2; break;
      case 'Will Force': out.ms = (out.ms || 10) + 2; break;
      case 'Reduced Strength': out.ps = Math.max(3, (out.ps || 10) - 2); break;
      case 'Reduced Dexterity': out.dx = Math.max(3, (out.dx || 10) - 2); break;
      case 'Reduced Mental Strength': out.ms = Math.max(3, (out.ms || 10) - 2); break;
      default: break;
    }
  });
  return out;
}

// Roll mutations for a genotype. Returns array of {name, type, defect, description}.
export function rollMutations(genotype) {
  const geno = GENOTYPES[genotype];
  if (!geno || (geno.physicalMutations === 0 && geno.mentalMutations === 0)) return [];

  const result = [];
  const usedNames = new Set();
  const pickRandom = (arr) => {
    const available = arr.filter(m => !usedNames.has(m.name));
    if (!available.length) return null;
    return available[Math.floor(Math.random() * available.length)];
  };

  // Physical mutations: each has a 1-in-4 chance of being a defect
  for (let i = 0; i < geno.physicalMutations; i++) {
    const isDefect = rollDie(4) === 1;
    const pool = isDefect ? PHYSICAL_DEFECTS : PHYSICAL_MUTATIONS;
    const m = pickRandom(pool);
    if (m) {
      usedNames.add(m.name);
      result.push({ ...m, type: 'physical', defect: isDefect });
    }
  }

  // Mental mutations: each has a 1-in-4 chance of being a defect
  for (let i = 0; i < geno.mentalMutations; i++) {
    const isDefect = rollDie(4) === 1;
    const pool = isDefect ? MENTAL_DEFECTS : MENTAL_MUTATIONS;
    const m = pickRandom(pool);
    if (m) {
      usedNames.add(m.name);
      result.push({ ...m, type: 'mental', defect: isDefect });
    }
  }

  return result;
}