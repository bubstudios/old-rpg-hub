// Spelljammer: AD&D 2nd Edition Adventures in Space (TSR, 1989).
// Mechanics mirror AD&D 1e (THAC0, saving throws, 3-18 ability scores, spells, gold).
// This file supplies the spacefaring races unique to the Spelljammer setting;
// standard fantasy races (Human, Elf, Dwarf, etc.) come from dndRules.js and
// are shown alongside these when the campaign is Spelljammer.

export const SJ_RACES = {
  Giff: {
    abilityAdjustments: { str: 2, con: 1, int: -1 },
    classes: ['Fighter', 'Ranger', 'Thief', 'Assassin'],
    description: 'Hippopotamus-like mercenaries who live for battle and firearms. Strong, tough, and fond of explosions.'
  },
  Dracon: {
    abilityAdjustments: { wis: 1, cha: 1 },
    classes: ['Fighter', 'Cleric', 'Magic-User', 'Thief'],
    description: 'Honorable dragon-centaur philosophers who value community and tradition above all.'
  },
  Scro: {
    abilityAdjustments: { str: 1, int: 1, cha: -1 },
    classes: ['Fighter', 'Thief', 'Assassin', 'Cleric', 'Magic-User'],
    description: 'Disciplined, civilized orcs who rejected savagery for martial order and scholarship.'
  },
  Hadozee: {
    abilityAdjustments: { dex: 2, cha: -1 },
    classes: ['Fighter', 'Thief', 'Ranger'],
    description: 'Agile ape-folk with gliding membranes, natural climbers at home in the rigging of any ship.'
  },
  Xixchil: {
    abilityAdjustments: { dex: 1, int: 1, cha: -2 },
    classes: ['Fighter', 'Thief', 'Magic-User', 'Illusionist'],
    description: 'Insectoid artisans who reshape living flesh — including their own — as both craft and art.'
  },
  Centaur: {
    abilityAdjustments: { str: 2, con: 1, dex: -2 },
    classes: ['Fighter', 'Ranger', 'Cleric'],
    description: 'Classic centaur folk of the plains who have taken to the stars, fierce lancers and scouts.'
  },
  Lizardman: {
    abilityAdjustments: { str: 1, con: 1, int: -1, cha: -1 },
    classes: ['Fighter', 'Thief', 'Cleric', 'Ranger'],
    description: 'Scaly swamp-dwellers turned spacers, tough and patient, at home in the damp holds of any ship.'
  },
  Rastipede: {
    abilityAdjustments: { int: 1, cha: 1, wis: -1 },
    classes: ['Fighter', 'Thief', 'Magic-User', 'Cleric'],
    description: 'Insectoid traders and tinkers with a gift for haggling and a nose for a profitable route.'
  },
  Grommam: {
    abilityAdjustments: { str: 2, con: 1, int: -1 },
    classes: ['Fighter', 'Thief', 'Ranger'],
    description: 'Gorilla-like spacers, powerful and loyal crewmates who swing through the rigging with ease.'
  }
};

// Crystal spheres and notable locales of the Spelljammer setting.
export const SJ_SPHERES = [
  'Realmspace',
  'Krynnspace',
  'Greyspace',
  'The Rock of Bral',
  'The Tears of Selûne',
  'A custom sphere of my own'
];