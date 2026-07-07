// Dark Sun: AD&D 2nd Edition (TSR, 1991) — the dying world of Athas.
// Mechanics mirror AD&D 2e (THAC0, saving throws, 3-18 ability scores, spells).
// This file supplies the Athas-specific races; standard fantasy races come from
// dndRules.js and are shown alongside these when the campaign is Dark Sun.

export const DS_RACES = {
  Mul: {
    abilityAdjustments: { str: 1, con: 2, int: -1, cha: -1 },
    classes: ['Fighter', 'Ranger', 'Thief', 'Cleric', 'Druid'],
    description: 'A sterile human-dwarf hybrid bred for the arena. Tireless, fearless, and relentless — a born survivor of the blood pits.'
  },
  'Half-Giant': {
    abilityAdjustments: { str: 4, con: 3, int: -2, wis: -2 },
    classes: ['Fighter', 'Ranger', 'Cleric', 'Druid'],
    description: 'A towering human-giant cross, immensely strong but simple of mind. Loyal, impressionable, and devastating in a fight.'
  },
  'Thri-kreen': {
    abilityAdjustments: { dex: 2, int: 1, con: -1, cha: -2 },
    classes: ['Fighter', 'Thief', 'Ranger', 'Cleric', 'Magic-User'],
    description: 'A mantis-folk of the wastes — four-armed, swift, and gifted with natural psionics. They do not sleep and wield the chatkcha throwing wedge.'
  },
  'Athasian Human': {
    abilityAdjustments: {},
    classes: ['Fighter', 'Paladin', 'Ranger', 'Cleric', 'Druid', 'Magic-User', 'Illusionist', 'Thief', 'Assassin', 'Monk'],
    description: 'Hardened children of a dying world. Athasian humans are adaptable, cunning, and tougher than their cousins on gentler worlds.'
  },
  'Athasian Elf': {
    abilityAdjustments: { dex: 1, con: -1, cha: 1, int: -1 },
    classes: ['Fighter', 'Ranger', 'Thief', 'Magic-User', 'Assassin'],
    description: 'A seven-foot desert nomad, fleet of foot and slow to trust. Athasian elves run the wastes in tight-knit tribes and trade on reputation.'
  },
  'Athasian Dwarf': {
    abilityAdjustments: { str: 1, con: 1, cha: -1 },
    classes: ['Fighter', 'Thief', 'Cleric', 'Assassin'],
    description: 'A hairless, focused dwarf devoted body and soul to a single life-purpose (Focus). Nothing — not death, not debt — stays a dwarf from their Focus.'
  },
  'Athasian Halfling': {
    abilityAdjustments: { dex: 2, str: -1 },
    classes: ['Fighter', 'Thief', 'Ranger'],
    description: 'A small jungle-dwelling tribal hunter of the Forest Ridge. Fierce, territorial, and rumored to feast on their fallen foes.'
  },
  'Half-Elf': {
    abilityAdjustments: {},
    classes: ['Fighter', 'Ranger', 'Thief', 'Cleric', 'Magic-User', 'Assassin'],
    description: 'An outcast of both peoples — too human for the elves, too elven for the humans. They survive on the margins of Athasian society.'
  }
};

// City-states and regions of the Tablelands.
export const DS_WORLDS = [
  'Tyr (the free city)',
  'Urik',
  'Balic',
  'Gulg',
  'Nibenay',
  'The Tablelands',
  'The Sea of Silt',
  'A custom Athasian city-state of my own'
];