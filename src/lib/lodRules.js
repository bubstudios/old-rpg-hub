// Legion of Doom — an original d20 roll-under supervillain RPG.
// Players are supervillains in a cabal, pulling heists and battling heroes.

export const ABILITIES = [
  { key: 'mgt', name: 'Might', short: 'MGT', desc: 'Physical strength, raw power, and melee prowess. The force behind your blows and how much you can lift or break.' },
  { key: 'cun', name: 'Cunning', short: 'CUN', desc: 'Intellect, strategy, technology, and scheming. The mind that plans the heist and builds the doomsday device.' },
  { key: 'agi', name: 'Agility', short: 'AGI', desc: 'Speed, reflexes, coordination, and dodging. How fast you draw, how nimbly you move, and your aim with ranged attacks.' },
  { key: 'tgh', name: 'Toughness', short: 'TGH', desc: 'Durability, endurance, and damage resistance. How much punishment you can take — it is your Vitality and your armor.' },
  { key: 'wil', name: 'Will', short: 'WIL', desc: 'Mental fortitude, ego, and willpower. Resists mental attacks, mind control, and fear. Equals your Ego pool.' },
  { key: 'cha', name: 'Charisma', short: 'CHA', desc: 'Presence, intimidation, persuasion, and leadership. The force of personality that commands minions and monologues villains.' }
];

export const ARCHETYPES = {
  "The Mastermind": {
    description: "A super-genius strategist who orchestrates schemes from the shadows. Battles with technology, force fields, and a plan within a plan within a plan.",
    powers: ['Genius Intellect', 'Force Field', 'Power Armor'],
    resources: 500,
    equipment: [
      { name: 'Power Armor (basic)', qty: 1 },
      { name: 'Energy Pistol', qty: 1 },
      { name: 'Lair Access Key', qty: 1 },
      { name: 'Holographic Disguise', qty: 1 }
    ]
  },
  "The Powerhouse": {
    description: "A mountain of muscle who solves every problem with overwhelming force. When the plan fails, you are the plan.",
    powers: ['Super Strength', 'Invulnerability', 'Ground Pound'],
    resources: 100,
    equipment: [
      { name: 'Reinforced Suit', qty: 1 },
      { name: 'Steel Chain', qty: 1 },
      { name: 'Brawler Gauntlets', qty: 1 }
    ]
  },
  "The Trickster": {
    description: "A chaotic agent of anarchy who sows madness, mayhem, and monologues. You fight with fear, illusion, and a punchline that always lands.",
    powers: ['Illusion', 'Fear Toxin', 'Laughing Gas'],
    resources: 150,
    equipment: [
      { name: 'Throwing Knives', qty: 6 },
      { name: 'Gas Grenades', qty: 3 },
      { name: 'Trick Cards', qty: 1 },
      { name: 'Gag Flower', qty: 1 }
    ]
  },
  "The Speedster": {
    description: "A blur of motion who strikes before the eye can follow and vanishes before the blow lands. The world moves in slow motion around you.",
    powers: ['Super Speed', 'Phasing', 'Lightning Strike'],
    resources: 120,
    equipment: [
      { name: 'Friction Suit', qty: 1 },
      { name: 'Taser Gloves', qty: 1 }
    ]
  },
  "The Sorcerer": {
    description: "A wielder of dark arts who commands forces beyond mortal ken. Demons answer your summons and the dead rise at your word.",
    powers: ['Dark Magic', 'Summoning', 'Necromancy'],
    resources: 80,
    equipment: [
      { name: 'Grimoire', qty: 1 },
      { name: 'Ritual Dagger', qty: 1 },
      { name: 'Amulet of Warding', qty: 1 }
    ]
  },
  "The Shapeshifter": {
    description: "A being of mutable form who can become anyone or anything. Spy, infiltrator, and chameleon — no vault is sealed against you.",
    powers: ['Transformation', 'Regeneration', 'Mimicry'],
    resources: 90,
    equipment: [
      { name: 'Morphsuit', qty: 1 },
      { name: 'Memory Recorder', qty: 1 }
    ]
  },
  "The Gadgeteer": {
    description: "A technological virtuoso armed with an arsenal of custom weapons. Freeze rays, traps, and a gadget for every occasion.",
    powers: ['Freeze Ray', 'Gadgets', 'Traps'],
    resources: 300,
    equipment: [
      { name: 'Freeze Ray', qty: 1 },
      { name: 'Tool Kit', qty: 1 },
      { name: 'Smoke Bombs', qty: 4 },
      { name: 'Grapple Gun', qty: 1 }
    ]
  },
  "The Mentalist": {
    description: "A psychic who reaches into minds and moves matter with thought alone. You know what the hero will do before they do.",
    powers: ['Telepathy', 'Telekinesis', 'Mind Control'],
    resources: 100,
    equipment: [
      { name: 'Psionic Focus Amulet', qty: 1 },
      { name: 'Mind-Shield Headband', qty: 1 }
    ]
  }
};

export const POWERS = [
  'Energy Projection', 'Flight', 'Super Strength', 'Invulnerability', 'Force Field',
  'Regeneration', 'Telepathy', 'Telekinesis', 'Mind Control', 'Illusion',
  'Invisibility', 'Shapeshifting', 'Super Speed', 'Phasing', 'Lightning Strike',
  'Dark Magic', 'Summoning', 'Necromancy', 'Freeze Ray', 'Gadgets',
  'Traps', 'Intimidation', 'Stealth', 'Acrobatics', 'Tech Mastery',
  'Hypnosis', 'Precognition', 'Teleportation', 'Energy Absorption', 'Gravity Control',
  'Sonic Scream', 'Fire Breath'
];

function rollDie(sides) { return Math.floor(Math.random() * sides) + 1; }

export function rollAttribute() {
  // 4d6 drop lowest, range 3-18
  const rolls = [rollDie(6), rollDie(6), rollDie(6), rollDie(6)].sort((a, b) => a - b);
  return rolls[1] + rolls[2] + rolls[3];
}

export function rollAbilityScores() {
  const scores = {};
  ABILITIES.forEach((a) => { scores[a.key] = rollAttribute(); });
  return scores;
}

export function abilityMod(score) { return Math.floor(((score || 10) - 10) / 2); }

// Bonus powers granted based on attribute total — the powerful need fewer crutches.
export function powerCountFor(scores) {
  const total = ABILITIES.reduce((sum, a) => sum + (scores[a.key] || 10), 0);
  if (total < 60) return 3;
  if (total < 72) return 2;
  return 1;
}

// Vitality (hit points) = Toughness + level.
export function computeHP(scores, level = 1) {
  return Math.max(1, Math.round((scores.tgh || 10)) + Math.max(1, level));
}

// Defense = 10 + Toughness modifier (toughness as natural armor).
export function computeDefense(scores) {
  return 10 + abilityMod(scores.tgh || 10);
}

export function getInitiativeMod(scores) {
  return abilityMod(scores.agi || 10);
}

// Ego pool = Will score. Spent to power abilities and gained through villainous drama.
export function getEgo(scores) {
  return Math.round(scores.wil || 10);
}

export function bestPowerRank(skills) {
  const ranks = (skills || []).map(s => Number(s.level) || 0);
  return ranks.length ? Math.max(...ranks) : 0;
}