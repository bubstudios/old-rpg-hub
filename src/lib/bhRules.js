// Boot Hill (2nd Edition, TSR 1979) rules — percentile Wild West gunfighting.
// Mirrors the role of dndRules.js / sfRules.js / gwRules.js but for BH western campaigns.

export const ABILITIES = [
  { key: 'spd', name: 'Speed', short: 'SPD', desc: 'Reaction time, quick-draw, and initiative. Roll under this to win a fast-draw.' },
  { key: 'gacc', name: 'Gun Accuracy', short: 'GACC', desc: 'Base percentile chance to hit with a firearm. Modified by range, movement, and cover.' },
  { key: 'tacc', name: 'Throwing Accuracy', short: 'TACC', desc: 'Base percentile chance to hit with thrown weapons (knives, lariats, dynamite).' },
  { key: 'str', name: 'Strength', short: 'STR', desc: 'Physical power and damage capacity. Equals your hit points — how much lead you can take before you fall.' },
  { key: 'brv', name: 'Bravery', short: 'BRV', desc: 'Nerve under fire. High Bravery keeps your aim steady when the bullets fly.' },
  { key: 'exp', name: 'Experience', short: 'EXP', desc: 'Worldliness and know-how. Determines how many skills you start with.' }
];

export const BACKGROUNDS = {
  "Gunfighter": {
    description: "A hired gun who lives by the speed of his draw. Fast, deadly, and short on patience.",
    weaponSkills: ["Fast Draw", "Pistol"],
    workSkills: ["Gambling", "Persuasion"],
    dollars: 25,
    equipment: [
      { name: 'Colt Peacemaker (Revolver)', qty: 1 },
      { name: 'Ammunition (.45)', qty: 24 },
      { name: 'Bowie Knife', qty: 1 },
      { name: 'Holster', qty: 1 },
      { name: 'Horse', qty: 1 }
    ]
  },
  "Lawman": {
    description: "A badge and a steady nerve. You keep the peace — or try to — in a lawless land.",
    weaponSkills: ["Pistol", "Rifle"],
    workSkills: ["Persuasion", "Tracking"],
    dollars: 40,
    equipment: [
      { name: 'Colt Peacemaker (Revolver)', qty: 1 },
      { name: 'Winchester Rifle', qty: 1 },
      { name: 'Ammunition', qty: 40 },
      { name: "Sheriff's Badge", qty: 1 },
      { name: 'Horse', qty: 1 }
    ]
  },
  "Cowboy": {
    description: "A weathered hand of the open range. Hardy, skilled with rope and rifle, no stranger to trouble.",
    weaponSkills: ["Rifle", "Brawling"],
    workSkills: ["Riding", "Lassoing"],
    dollars: 30,
    equipment: [
      { name: 'Winchester Rifle', qty: 1 },
      { name: 'Ammunition', qty: 30 },
      { name: 'Lasso', qty: 1 },
      { name: 'Bowie Knife', qty: 1 },
      { name: 'Horse', qty: 1 }
    ]
  },
  "Gambler": {
    description: "A card sharp with a quick wit and a quicker blade. Lives by luck and silver words.",
    weaponSkills: ["Pistol", "Fast Draw"],
    workSkills: ["Gambling", "Persuasion"],
    dollars: 60,
    equipment: [
      { name: 'Derringer', qty: 1 },
      { name: 'Bowie Knife', qty: 1 },
      { name: 'Deck of Cards', qty: 1 },
      { name: 'Fancy Clothes', qty: 1 }
    ]
  },
  "Outlaw": {
    description: "Wanted and desperate, with a price on your head and a gun in your hand. Mean as a rattlesnake.",
    weaponSkills: ["Pistol", "Shotgun"],
    workSkills: ["Stealth", "Tracking"],
    dollars: 15,
    equipment: [
      { name: 'Colt Peacemaker (Revolver)', qty: 1 },
      { name: 'Sawed-off Shotgun', qty: 1 },
      { name: 'Ammunition', qty: 20 },
      { name: 'Bowie Knife', qty: 1 },
      { name: 'Horse', qty: 1 }
    ]
  },
  "Scout": {
    description: "A tracker and frontiersman who reads the land like a book. The wilderness is your home.",
    weaponSkills: ["Rifle", "Brawling"],
    workSkills: ["Tracking", "Survival"],
    dollars: 20,
    equipment: [
      { name: 'Sharps Rifle', qty: 1 },
      { name: 'Ammunition', qty: 30 },
      { name: 'Bowie Knife', qty: 1 },
      { name: 'Horse', qty: 1 }
    ]
  }
};

export const WEAPON_SKILLS = ['Brawling', 'Fast Draw', 'Pistol', 'Rifle', 'Shotgun'];

export const WORK_SKILLS = [
  'Tracking', 'Riding', 'Gambling', 'Persuasion', 'Stealth', 'Survival',
  'Medicine', 'Mechanics', 'Prospecting', 'Lassoing', 'Forgery', 'Disguise',
  'Climbing', 'Swimming', 'Cooking'
];

export const WEAPONS = {
  'Colt Peacemaker (Revolver)': { damage: '1d8', type: 'pistol', range: 'medium', rof: 2, notes: 'Reliable six-shooter' },
  'Derringer': { damage: '1d6', type: 'pistol', range: 'short', rof: 1, notes: 'Tiny, concealable' },
  'Winchester Rifle': { damage: '1d10', type: 'rifle', range: 'long', rof: 1, notes: 'Lever-action repeater' },
  'Sharps Rifle': { damage: '2d6', type: 'rifle', range: 'very long', rof: 1, notes: 'Big-bore single shot' },
  'Sawed-off Shotgun': { damage: '3d6', type: 'shotgun', range: 'short', rof: 1, notes: 'Devastating up close' },
  'Shotgun': { damage: '3d6', type: 'shotgun', range: 'short', rof: 1, notes: 'Devastating up close' },
  'Bowie Knife': { damage: '1d6', type: 'melee', range: 'melee', rof: 1, notes: 'Heavy fighting knife' },
  'Lasso': { damage: '0', type: 'thrown', range: 'short', rof: 1, notes: 'Ropes a target' }
};

// Wound location table (d100). mortal locations have a higher fatality risk.
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

// Wound severity chart (d100). damage = Strength (HP) lost.
export const WOUND_SEVERITY = [
  { min: 1, max: 25, severity: 'Slight', damage: 1, effect: 'A graze. Barely a scratch.' },
  { min: 26, max: 50, severity: 'Light', damage: 2, effect: 'A flesh wound. Stings, but you can fight on.' },
  { min: 51, max: 70, severity: 'Medium', damage: 4, effect: 'A painful hit. -10% to actions until treated.' },
  { min: 71, max: 85, severity: 'Serious', damage: 8, effect: 'A grave wound. Bleeding badly; -20% to all actions.' },
  { min: 86, max: 95, severity: 'Critical', damage: 16, effect: 'Critical! Incapacitated and dying without aid.' },
  { min: 96, max: 100, severity: 'Mortal', damage: 999, effect: 'A mortal wound. The character falls and dies.' }
];

function rollDie(sides) { return Math.floor(Math.random() * sides) + 1; }

// Roll a percentile attribute (d100). PCs get a small bonus to be playable heroes.
export function rollAttribute() {
  return Math.min(100, rollDie(100) + 5);
}

export function rollAbilityScores() {
  const scores = {};
  ABILITIES.forEach((a) => { scores[a.key] = rollAttribute(); });
  return scores;
}

// Number of starting skills based on the inverse balancing mechanism:
// stronger attributes mean fewer skills (the weak are compensated with cunning).
export function skillCountFor(scores) {
  const total = ABILITIES.reduce((sum, a) => sum + (scores[a.key] || 50), 0);
  if (total < 250) return 6;
  if (total < 350) return 5;
  if (total < 450) return 4;
  return 3;
}

// Hit points = Strength score (damage capacity).
export function computeHP(scores) {
  return Math.max(1, Math.round(scores.str || 50));
}

// Initiative modifier from Speed (SPD/10, rounded down).
export function getInitiativeMod(scores) {
  return Math.floor((scores.spd || 50) / 10);
}

// Bravery modifier to Gun Accuracy under pressure.
export function getBraveryMod(scores) {
  return Math.floor((scores.brv || 50) / 20) - 5;
}

// Best weapon skill level the character holds (for hit-number bonuses).
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

// Roll wound severity (d100). Mortal locations (Head/Chest) bump high rolls to Mortal.
export function rollWoundSeverity(mortalLocation) {
  const roll = rollDie(100);
  let sev = WOUND_SEVERITY.find(s => roll >= s.min && roll <= s.max) || WOUND_SEVERITY[0];
  if (mortalLocation && sev.severity !== 'Mortal' && roll >= 86) {
    sev = WOUND_SEVERITY[WOUND_SEVERITY.length - 1];
  }
  return { roll, ...sev };
}