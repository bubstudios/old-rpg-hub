// Hyborian Age sword-and-sorcery (Conan / Red Sonja).
// d100 roll-under attribute system, dark sorcery, gritty combat.
// Shared by game_system 'conan' and 'redsonja'.

export const ABILITIES = [
  { key: 'str', name: 'Strength', short: 'STR', desc: 'Physical power and melee prowess. Fuels the might of your blows.' },
  { key: 'dex', name: 'Dexterity', short: 'DEX', desc: 'Precision and hand-eye coordination. The base chance to strike with ranged or finesse weapons.' },
  { key: 'agi', name: 'Agility', short: 'AGI', desc: 'Quickness, reflexes, and initiative. The swift act first.' },
  { key: 'end', name: 'Endurance', short: 'END', desc: 'Stamina and damage capacity. Equals your Vitality — how much punishment you can take before you fall.' },
  { key: 'sta', name: 'Stature', short: 'STA', desc: 'Presence, charisma, and the force of personality. Command, intimidate, and sway.' },
  { key: 'int', name: 'Intelligence', short: 'INT', desc: 'Cunning, knowledge, and learning. Lore, languages, and strategy.' },
  { key: 'men', name: 'Mentation', short: 'MEN', desc: 'Willpower and mental fortitude. Resists sorcery, fear, and corruption — steadies your nerve in battle.' },
  { key: 'lck', name: 'Luck', short: 'LCK', desc: 'Fate, fortune, and the favor of the gods. Turns the critical blow aside and finds the gold.' }
];

export const ARCHETYPES = {
  "Barbarian": {
    description: "A savage warrior from the wild hills who trusts steel over sorcery. Mighty thews, iron will, and a blade for every throat.",
    weaponSkills: ["Broadsword", "Brawling"],
    workSkills: ["Survival", "Tracking"],
    gold: 10,
    equipment: [
      { name: 'Broadsword', qty: 1 },
      { name: 'Fur Cloak', qty: 1 },
      { name: 'Dagger', qty: 1 },
      { name: 'Hide Armor', qty: 1 },
      { name: 'Waterskin', qty: 1 }
    ]
  },
  "Mercenary": {
    description: "A sword for hire who has fought in a dozen border wars across the Hyborian kingdoms. Hard, professional, and lethal.",
    weaponSkills: ["Broadsword", "Spear"],
    workSkills: ["Leadership", "Stealth"],
    gold: 30,
    equipment: [
      { name: 'Broadsword', qty: 1 },
      { name: 'Spear', qty: 1 },
      { name: 'Chain Mail', qty: 1 },
      { name: 'Shield', qty: 1 },
      { name: 'Dagger', qty: 1 }
    ]
  },
  "Thief": {
    description: "A nimble cutpurse and second-story worker from the maze-like streets of the great cities. Quick fingers, quicker feet.",
    weaponSkills: ["Dagger", "Bow"],
    workSkills: ["Thievery", "Stealth"],
    gold: 25,
    equipment: [
      { name: 'Dagger', qty: 2 },
      { name: 'Short Bow', qty: 1 },
      { name: 'Arrows (20)', qty: 1 },
      { name: 'Thieves Tools', qty: 1 },
      { name: 'Leather Armor', qty: 1 },
      { name: 'Grappling Hook', qty: 1 }
    ]
  },
  "Pirate": {
    description: "A reaver of the Vilayet Sea and the Western Ocean. Lives by the cutlass, dies by the noose, and takes what gold the tides bring.",
    weaponSkills: ["Broadsword", "Brawling"],
    workSkills: ["Swimming", "Navigation"],
    gold: 20,
    equipment: [
      { name: 'Cutlass', qty: 1 },
      { name: 'Dagger', qty: 1 },
      { name: 'Leather Armor', qty: 1 },
      { name: 'Rope (50 ft)', qty: 1 },
      { name: 'Spyglass', qty: 1 }
    ]
  },
  "Hunter": {
    description: "A tracker of beasts and men who knows every game trail from Cimmeria to Kush. Patient, precise, and ruthless.",
    weaponSkills: ["Bow", "Spear"],
    workSkills: ["Tracking", "Survival"],
    gold: 15,
    equipment: [
      { name: 'Hunting Bow', qty: 1 },
      { name: 'Arrows (20)', qty: 1 },
      { name: 'Spear', qty: 1 },
      { name: 'Hunting Knife', qty: 1 },
      { name: 'Leather Armor', qty: 1 }
    ]
  },
  "Nomad": {
    description: "A horse-lord of the eastern steppes — Hyrkanian, Zamoran, or Turanian. Rides like the wind, fights like the storm.",
    weaponSkills: ["Bow", "Broadsword"],
    workSkills: ["Riding", "Survival"],
    gold: 20,
    equipment: [
      { name: 'Composite Bow', qty: 1 },
      { name: 'Arrows (30)', qty: 1 },
      { name: 'Scimitar', qty: 1 },
      { name: 'Leather Armor', qty: 1 },
      { name: 'Riding Horse', qty: 1 }
    ]
  },
  "Soldier": {
    description: "A rank-and-file infantryman of a Hyborian king's host. Disciplined, drilled, and has seen things no man should.",
    weaponSkills: ["Spear", "Broadsword"],
    workSkills: ["Leadership", "Climbing"],
    gold: 15,
    equipment: [
      { name: 'Spear', qty: 1 },
      { name: 'Short Sword', qty: 1 },
      { name: 'Chain Mail', qty: 1 },
      { name: 'Shield', qty: 1 },
      { name: 'Rations', qty: 1 }
    ]
  },
  "Sorcerer": {
    description: "A dabbler in the dark arts — a student of forbidden tomes and the whispered names of things older than the gods. Sorcery is corruption, but power is power.",
    weaponSkills: ["Dagger", "Brawling"],
    workSkills: ["Arcane Lore", "Appraisal"],
    gold: 20,
    equipment: [
      { name: 'Dagger', qty: 1 },
      { name: 'Robes', qty: 1 },
      { name: 'Spell Components', qty: 1 },
      { name: 'Grimoire', qty: 1 },
      { name: 'Candle & Incense', qty: 1 }
    ]
  },
  "Noble": {
    description: "Born to a house of blood and gold — exiled heir, disgraced lord, or scheming patrician. Commands with a word, kills with a blade.",
    weaponSkills: ["Broadsword", "Dagger"],
    workSkills: ["Leadership", "Appraisal"],
    gold: 50,
    equipment: [
      { name: 'Broadsword', qty: 1 },
      { name: 'Dagger', qty: 1 },
      { name: 'Fine Clothing', qty: 1 },
      { name: 'Chain Mail', qty: 1 },
      { name: 'Signet Ring', qty: 1 }
    ]
  },
  "Scholar": {
    description: "A scribe, poet, or historian who knows the old kingdoms and the older dead. Not helpless — just preferentially armed with knowledge.",
    weaponSkills: ["Dagger", "Bow"],
    workSkills: ["Arcane Lore", "Navigation"],
    gold: 15,
    equipment: [
      { name: 'Dagger', qty: 1 },
      { name: 'Short Bow', qty: 1 },
      { name: 'Arrows (10)', qty: 1 },
      { name: 'Scrolls', qty: 1 },
      { name: 'Robes', qty: 1 }
    ]
  }
};

export const WEAPON_SKILLS = ['Broadsword', 'Dagger', 'Bow', 'Spear', 'Shield', 'Brawling'];

export const WORK_SKILLS = [
  'Climbing', 'Stealth', 'Survival', 'Tracking', 'Riding', 'Swimming',
  'Arcane Lore', 'Thievery', 'Leadership', 'Healing', 'Navigation', 'Appraisal'
];

export const WEAPONS = {
  'Broadsword': { damage: '1d8+1', type: 'melee', range: 'melee', notes: 'Heavy blade of the Hyborian age' },
  'Scimitar': { damage: '1d8', type: 'melee', range: 'melee', notes: 'Curved eastern blade' },
  'Short Sword': { damage: '1d6', type: 'melee', range: 'melee', notes: 'Common soldier blade' },
  'Dagger': { damage: '1d4', type: 'melee', range: 'melee', notes: 'Last-resort blade' },
  'Spear': { damage: '1d6', type: 'melee', range: 'melee', notes: 'Versatile, can be thrown' },
  'Hunting Bow': { damage: '1d6', type: 'bow', range: 'long', notes: 'Wooden self-bow' },
  'Composite Bow': { damage: '1d6+1', type: 'bow', range: 'long', notes: 'Horn and sinew, powerful' },
  'Cutlass': { damage: '1d8', type: 'melee', range: 'melee', notes: "Pirate's blade" }
};

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

export const WOUND_SEVERITY = [
  { min: 1, max: 25, severity: 'Slight', damage: 1, effect: 'A graze. Barely a scratch.' },
  { min: 26, max: 50, severity: 'Light', damage: 2, effect: 'A flesh wound. Stings, but you fight on.' },
  { min: 51, max: 70, severity: 'Medium', damage: 4, effect: 'A painful hit. -10% to actions until treated.' },
  { min: 71, max: 85, severity: 'Serious', damage: 8, effect: 'A grave wound. Bleeding badly; -20% to all actions.' },
  { min: 86, max: 95, severity: 'Critical', damage: 16, effect: 'Critical! Incapacitated and dying without aid.' },
  { min: 96, max: 100, severity: 'Mortal', damage: 999, effect: 'A mortal wound. The warrior falls and dies.' }
];

function rollDie(sides) { return Math.floor(Math.random() * sides) + 1; }

export function rollAttribute() {
  return Math.min(100, rollDie(100) + 5);
}

export function rollAbilityScores() {
  const scores = {};
  ABILITIES.forEach((a) => { scores[a.key] = rollAttribute(); });
  return scores;
}

export function skillCountFor(scores) {
  const total = ABILITIES.reduce((sum, a) => sum + (scores[a.key] || 50), 0);
  if (total < 300) return 6;
  if (total < 400) return 5;
  if (total < 500) return 4;
  return 3;
}

export function computeHP(scores) {
  return Math.max(1, Math.round(scores.end || 50));
}

export function getInitiativeMod(scores) {
  return Math.floor((scores.agi || 50) / 10);
}

export function getMentationMod(scores) {
  return Math.floor((scores.men || 50) / 20) - 5;
}

export function bestWeaponSkillLevel(skills) {
  const weaponLevels = (skills || [])
    .filter(s => WEAPON_SKILLS.includes(s.name))
    .map(s => Number(s.level) || 0);
  return weaponLevels.length ? Math.max(...weaponLevels) : 0;
}

export function rollWoundLocation() {
  const roll = rollDie(100);
  const loc = WOUND_LOCATIONS.find(l => roll >= l.min && roll <= l.max) || WOUND_LOCATIONS[0];
  return { roll, ...loc };
}

export function rollWoundSeverity(mortalLocation) {
  const roll = rollDie(100);
  let sev = WOUND_SEVERITY.find(s => roll >= s.min && roll <= s.max) || WOUND_SEVERITY[0];
  if (mortalLocation && sev.severity !== 'Mortal' && roll >= 86) {
    sev = WOUND_SEVERITY[WOUND_SEVERITY.length - 1];
  }
  return { roll, ...sev };
}