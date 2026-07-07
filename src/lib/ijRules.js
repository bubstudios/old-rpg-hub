// The Adventures of Indiana Jones (TSR, 1984) — pulp 1930s action-adventure.
// d100 roll-under attribute system. Mirrors the role of bhRules.js / sfRules.js.

export const ABILITIES = [
  { key: 'str', name: 'Strength', short: 'STR', desc: 'Physical power and damage capacity. Equals your Vitality — how much punishment you can take before you fall.' },
  { key: 'mov', name: 'Movement', short: 'MOV', desc: 'Action speed, reflexes, and initiative. The quick draw first.' },
  { key: 'prw', name: 'Prowess', short: 'PRW', desc: 'Manual dexterity and coordination. The base chance to land a blow or a shot in a fight.' },
  { key: 'bck', name: 'Backbone', short: 'BCK', desc: 'Courage, determination, and willpower. Steadies your aim when the lead and fists fly.' },
  { key: 'ins', name: 'Instinct', short: 'INS', desc: 'Perception, intuition, and a sixth sense for danger, traps, and hidden things.' },
  { key: 'app', name: 'Appeal', short: 'APP', desc: 'Personality and physical presence. Charm, bluff, and the force of character.' }
];

export const ARCHETYPES = {
  "Archaeologist": {
    description: "A scholar of the ancient world who gets his hands dirty in the field. Reads dead languages, dodges rolling boulders.",
    weaponSkills: ["Whip", "Pistol"],
    workSkills: ["Archaeology", "Languages"],
    dollars: 50,
    equipment: [
      { name: 'Bullwhip', qty: 1 },
      { name: 'Revolver', qty: 1 },
      { name: 'Ammunition (.38)', qty: 18 },
      { name: 'Fedora', qty: 1 },
      { name: 'Leather Jacket', qty: 1 },
      { name: 'Field Notebook', qty: 1 },
      { name: 'Compass', qty: 1 }
    ]
  },
  "Soldier": {
    description: "A veteran of the Great War who never quite left the fighting behind. Disciplined, deadly, and hard to rattle.",
    weaponSkills: ["Rifle", "Brawling"],
    workSkills: ["Survival", "Tracking"],
    dollars: 30,
    equipment: [
      { name: 'Rifle', qty: 1 },
      { name: 'Ammunition', qty: 40 },
      { name: 'Combat Knife', qty: 1 },
      { name: 'Dog Tags', qty: 1 },
      { name: 'Canteen', qty: 1 }
    ]
  },
  "Mercenary": {
    description: "A hired gun who fights for coin, cause, or the thrill of it. Good in a scrap and better in a getaway.",
    weaponSkills: ["Pistol", "Rifle"],
    workSkills: ["Persuasion", "Stealth"],
    dollars: 80,
    equipment: [
      { name: 'Automatic Pistol', qty: 1 },
      { name: 'Rifle', qty: 1 },
      { name: 'Ammunition', qty: 50 },
      { name: 'Combat Knife', qty: 1 },
      { name: 'Webbing', qty: 1 }
    ]
  },
  "Aviator": {
    description: "A barnstorming flyboy who lives for the sky. Can land a crate on a dime and talk his way out of the crash.",
    weaponSkills: ["Pistol", "Brawling"],
    workSkills: ["Piloting", "Driving"],
    dollars: 40,
    equipment: [
      { name: 'Automatic Pistol', qty: 1 },
      { name: 'Ammunition', qty: 24 },
      { name: 'Flight Jacket', qty: 1 },
      { name: 'Goggles', qty: 1 },
      { name: 'Map Case', qty: 1 }
    ]
  },
  "Explorer": {
    description: "A trailblazer who charts the blank corners of the map. At home in the jungle, the desert, and the mountains.",
    weaponSkills: ["Rifle", "Brawling"],
    workSkills: ["Survival", "Climbing"],
    dollars: 35,
    equipment: [
      { name: 'Rifle', qty: 1 },
      { name: 'Ammunition', qty: 30 },
      { name: 'Machete', qty: 1 },
      { name: 'Rope (50 ft)', qty: 1 },
      { name: 'Pith Helmet', qty: 1 },
      { name: 'Compass', qty: 1 }
    ]
  },
  "Scholar": {
    description: "A bookish academic who knows the old ways, the old gods, and the old curses. Not helpless — just preferentially armed with knowledge.",
    weaponSkills: ["Pistol", "Thrown"],
    workSkills: ["Languages", "Occult Lore"],
    dollars: 25,
    equipment: [
      { name: 'Revolver', qty: 1 },
      { name: 'Ammunition', qty: 18 },
      { name: 'Notebook', qty: 1 },
      { name: 'Magnifying Glass', qty: 1 },
      { name: 'Translation Texts', qty: 1 }
    ]
  },
  "Big Game Hunter": {
    description: "A tracker of beasts and men who has stalked prey across three continents. Patient, precise, and ruthless.",
    weaponSkills: ["Rifle", "Thrown"],
    workSkills: ["Tracking", "Survival"],
    dollars: 45,
    equipment: [
      { name: 'Rifle', qty: 1 },
      { name: 'Ammunition', qty: 30 },
      { name: 'Hunting Knife', qty: 1 },
      { name: 'Hunting Gear', qty: 1 },
      { name: 'Rope (50 ft)', qty: 1 }
    ]
  },
  "Federal Agent": {
    description: "A man with a badge and a quiet mandate. Chases spies, smugglers, and things the government won't put in the papers.",
    weaponSkills: ["Pistol", "Brawling"],
    workSkills: ["Persuasion", "Stealth"],
    dollars: 40,
    equipment: [
      { name: 'Automatic Pistol', qty: 1 },
      { name: 'Ammunition', qty: 24 },
      { name: 'Badge', qty: 1 },
      { name: 'Notebook', qty: 1 }
    ]
  }
};

export const WEAPON_SKILLS = ['Brawling', 'Pistol', 'Rifle', 'Whip', 'Thrown', 'Melee'];

export const WORK_SKILLS = [
  'Archaeology', 'Driving', 'Languages', 'Piloting', 'Stealth', 'Survival',
  'Persuasion', 'Medicine', 'Repair', 'Tracking', 'Climbing', 'Swimming',
  'Forgery', 'Disguise', 'Occult Lore'
];

export const WEAPONS = {
  'Revolver': { damage: '1d8', type: 'pistol', range: 'medium', rof: 2, notes: 'Reliable six-shooter' },
  'Automatic Pistol': { damage: '1d8', type: 'pistol', range: 'medium', rof: 2, notes: 'Semi-auto, fast' },
  'Rifle': { damage: '1d10', type: 'rifle', range: 'long', rof: 1, notes: 'Bolt-action, accurate' },
  'Shotgun': { damage: '3d6', type: 'shotgun', range: 'short', rof: 1, notes: 'Devastating up close' },
  'Submachine Gun': { damage: '2d6', type: 'automatic', range: 'medium', rof: 3, notes: 'Spray of lead' },
  'Bullwhip': { damage: '1d4', type: 'whip', range: 'short', rof: 1, notes: 'Entangles, disarms, swings' },
  'Combat Knife': { damage: '1d6', type: 'melee', range: 'melee', rof: 1, notes: 'Fighting knife' },
  'Machete': { damage: '1d8', type: 'melee', range: 'melee', rof: 1, notes: 'Heavy blade' },
  'Hunting Knife': { damage: '1d6', type: 'melee', range: 'melee', rof: 1, notes: 'Field blade' }
};

// Wound location table (d100). Vital locations carry a higher fatality risk.
export const WOUND_LOCATIONS = [
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

// Wound severity (d100). Damage is subtracted from Vitality (Strength).
export const WOUND_SEVERITY = [
  { min: 1, max: 25, severity: 'Slight', damage: 1, effect: 'A graze. Barely a scratch.' },
  { min: 26, max: 50, severity: 'Light', damage: 2, effect: 'A flesh wound. Stings, but you can fight on.' },
  { min: 51, max: 70, severity: 'Medium', damage: 4, effect: 'A painful hit. -10% to actions until treated.' },
  { min: 71, max: 85, severity: 'Serious', damage: 8, effect: 'A grave wound. Bleeding badly; -20% to all actions.' },
  { min: 86, max: 95, severity: 'Critical', damage: 16, effect: 'Critical! Incapacitated and dying without aid.' },
  { min: 96, max: 100, severity: 'Mortal', damage: 999, effect: 'A mortal wound. The character falls and dies.' }
];

function rollDie(sides) { return Math.floor(Math.random() * sides) + 1; }

// Roll a percentile attribute (d100). Adventurers get a small hero bonus.
export function rollAttribute() {
  return Math.min(100, rollDie(100) + 5);
}

export function rollAbilityScores() {
  const scores = {};
  ABILITIES.forEach((a) => { scores[a.key] = rollAttribute(); });
  return scores;
}

// Bonus skills scale inversely with raw attribute totals — the wily compensate for weakness.
export function skillCountFor(scores) {
  const total = ABILITIES.reduce((sum, a) => sum + (scores[a.key] || 50), 0);
  if (total < 250) return 6;
  if (total < 350) return 5;
  if (total < 450) return 4;
  return 3;
}

// Vitality (hit points) = Strength score.
export function computeHP(scores) {
  return Math.max(1, Math.round(scores.str || 50));
}

// Initiative modifier from Movement (MOV/10, rounded down).
export function getInitiativeMod(scores) {
  return Math.floor((scores.mov || 50) / 10);
}

// Backbone modifier to Prowess under pressure.
export function getBackboneMod(scores) {
  return Math.floor((scores.bck || 50) / 20) - 5;
}

// Best weapon skill level the character holds (hit-number bonus, ×10%).
export function bestWeaponSkillLevel(skills) {
  const weaponLevels = (skills || [])
    .filter(s => WEAPON_SKILLS.includes(s.name))
    .map(s => Number(s.level) || 0);
  return weaponLevels.length ? Math.max(...weaponLevels) : 0;
}

// Roll wound location (d100) → location object.
export function rollWoundLocation() {
  const roll = rollDie(100);
  const loc = WOUND_LOCATIONS.find(l => roll >= l.min && roll <= l.max) || WOUND_LOCATIONS[0];
  return { roll, ...loc };
}

// Roll wound severity (d100). Vital locations (Head/Chest) bump high rolls to Mortal.
export function rollWoundSeverity(mortalLocation) {
  const roll = rollDie(100);
  let sev = WOUND_SEVERITY.find(s => roll >= s.min && roll <= s.max) || WOUND_SEVERITY[0];
  if (mortalLocation && sev.severity !== 'Mortal' && roll >= 86) {
    sev = WOUND_SEVERITY[WOUND_SEVERITY.length - 1];
  }
  return { roll, ...sev };
}