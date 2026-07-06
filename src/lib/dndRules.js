// Advanced Dungeons & Dragons 1st Edition rules tables
// Core rules data referenced by the AI Dungeon Master and character creation.

export const RACES = {
  Human: {
    abilityAdjustments: {},
    classes: ["Fighter", "Paladin", "Ranger", "Cleric", "Druid", "Magic-User", "Illusionist", "Thief", "Assassin", "Monk"],
    description: "Versatile and ambitious, humans may pursue any class without level limits."
  },
  Elf: {
    abilityAdjustments: { dex: 1, con: -1 },
    classes: ["Fighter", "Magic-User", "Thief", "Assassin", "Ranger"],
    description: "Graceful and long-lived, elves gain +1 DEX and -1 CON. They see in twilight and resist charm."
  },
  Dwarf: {
    abilityAdjustments: { con: 1, cha: -1 },
    classes: ["Fighter", "Thief", "Assassin", "Cleric"],
    description: "Sturdy mountain-folk, dwarves gain +1 CON and -1 CHA. They resist magic and poison."
  },
  Halfling: {
    abilityAdjustments: { dex: 1, str: -1 },
    classes: ["Fighter", "Thief"],
    description: "Small and nimble, halflings gain +1 DEX and -1 STR. They resist magic and fear."
  },
  Gnome: {
    abilityAdjustments: { int: 1, wis: -1 },
    classes: ["Fighter", "Thief", "Illusionist", "Cleric"],
    description: "Clever and curious, gnomes gain +1 INT and -1 WIS. They resist magic."
  },
  "Half-Elf": {
    abilityAdjustments: {},
    classes: ["Fighter", "Magic-User", "Thief", "Assassin", "Cleric", "Ranger"],
    description: "Children of two worlds, half-elves may pursue many paths and see in twilight."
  },
  "Half-Orc": {
    abilityAdjustments: { str: 1, con: 1, int: -1, cha: -2 },
    classes: ["Fighter", "Thief", "Assassin", "Cleric"],
    description: "Strong and fierce, half-orcs gain +1 STR, +1 CON, -1 INT, and -2 CHA."
  }
};

export const CLASSES = {
  Fighter: {
    hitDie: 10,
    thacoProgression: [20, 19, 18, 17, 16, 15, 14, 13, 12, 11, 10, 10, 9, 9, 8, 8, 7, 7, 6, 6],
    xpTable: [0, 2000, 4000, 8000, 16000, 35000, 70000, 125000, 250000, 500000],
    savingThrows: {
      poison_death: [14, 13, 12, 11, 10, 9, 8, 7, 6, 5],
      wand: [16, 15, 14, 13, 12, 11, 10, 9, 8, 7],
      petrification: [15, 14, 13, 12, 11, 10, 9, 8, 7, 6],
      breath: [17, 16, 15, 14, 13, 12, 11, 10, 9, 8],
      spell: [17, 16, 15, 14, 13, 12, 11, 10, 9, 8]
    },
    description: "Masters of arms and armor. Fighters wield any weapon and wear any armor, and gain multiple attacks at higher levels."
  },
  Paladin: {
    hitDie: 10,
    thacoProgression: [20, 19, 18, 17, 16, 15, 14, 13, 12, 11, 10, 10, 9, 9, 8, 8, 7, 7, 6, 6],
    xpTable: [0, 2750, 5500, 12000, 25000, 50000, 100000, 175000, 350000, 600000],
    savingThrows: {
      poison_death: [14, 13, 12, 11, 10, 9, 8, 7, 6, 5],
      wand: [15, 14, 13, 12, 11, 10, 9, 8, 7, 6],
      petrification: [12, 11, 10, 9, 8, 7, 6, 5, 4, 3],
      breath: [16, 15, 14, 13, 12, 11, 10, 9, 8, 7],
      spell: [15, 14, 13, 12, 11, 10, 9, 8, 7, 6]
    },
    description: "Holy warriors of Lawful Good. Paladins have aura of protection, detect evil, lay on hands, and a bonded mount. Requires CHA 17, STR 12, WIS 13."
  },
  Ranger: {
    hitDie: 10,
    thacoProgression: [20, 19, 18, 17, 16, 15, 14, 13, 12, 11, 10, 10, 9, 9, 8, 8, 7, 7, 6, 6],
    xpTable: [0, 2250, 4500, 9500, 20000, 40000, 90000, 150000, 225000, 375000],
    savingThrows: {
      poison_death: [14, 13, 12, 11, 10, 9, 8, 7, 6, 5],
      wand: [16, 15, 14, 13, 12, 11, 10, 9, 8, 7],
      petrification: [15, 14, 13, 12, 11, 10, 9, 8, 7, 6],
      breath: [17, 16, 15, 14, 13, 12, 11, 10, 9, 8],
      spell: [17, 16, 15, 14, 13, 12, 11, 10, 9, 8]
    },
    description: "Wilderness trackers and scouts. Rangers gain tracking, surprise bonuses, and later minor magic. Requires STR 13, INT 13, WIS 14, CON 14."
  },
  Cleric: {
    hitDie: 8,
    thacoProgression: [20, 20, 20, 18, 18, 18, 16, 16, 16, 14, 14, 14, 12, 12, 12, 10, 10, 10, 8, 8],
    xpTable: [0, 1500, 3000, 6000, 13000, 27500, 55000, 110000, 225000, 450000],
    savingThrows: {
      poison_death: [10, 10, 10, 9, 9, 7, 7, 6, 6, 5],
      wand: [14, 14, 13, 12, 11, 10, 9, 8, 7, 6],
      petrification: [13, 13, 12, 11, 10, 9, 8, 7, 6, 5],
      breath: [16, 16, 15, 14, 13, 12, 11, 10, 9, 8],
      spell: [15, 15, 14, 13, 12, 11, 10, 9, 8, 7]
    },
    description: "Divine spellcasters and healers. Clerics turn undead, cast divine spells from level 2, and may not use edged weapons (by most faiths). Requires WIS 9."
  },
  Druid: {
    hitDie: 8,
    thacoProgression: [20, 20, 20, 18, 18, 18, 16, 16, 16, 14, 14, 14, 12, 12, 12],
    xpTable: [0, 2000, 4000, 7500, 12500, 20000, 35000, 60000, 90000, 125000],
    savingThrows: {
      poison_death: [10, 10, 10, 9, 9, 7, 7, 6, 6, 5],
      wand: [14, 14, 13, 12, 11, 10, 9, 8, 7, 6],
      petrification: [13, 13, 12, 11, 10, 9, 8, 7, 6, 5],
      breath: [16, 16, 15, 14, 13, 12, 11, 10, 9, 8],
      spell: [15, 15, 14, 13, 12, 11, 10, 9, 8, 7]
    },
    description: "Nature priests of the True Neutral way. Druids cast nature spells, shape-shift at higher levels, and may wear only leather armor. Requires WIS 12, CHA 15."
  },
  "Magic-User": {
    hitDie: 4,
    thacoProgression: [20, 20, 20, 20, 19, 19, 19, 19, 17, 17, 17, 17, 15, 15, 15, 15, 13, 13, 13, 13],
    xpTable: [0, 2500, 5000, 10000, 22500, 40000, 60000, 90000, 135000, 250000],
    savingThrows: {
      poison_death: [14, 14, 13, 13, 12, 12, 11, 11, 10, 10],
      wand: [11, 11, 10, 10, 9, 9, 8, 8, 7, 7],
      petrification: [13, 13, 12, 12, 11, 11, 10, 10, 9, 9],
      breath: [15, 15, 14, 14, 13, 13, 12, 12, 11, 11],
      spell: [12, 12, 11, 11, 10, 10, 9, 9, 8, 8]
    },
    description: "Wielders of arcane power through study. Magic-Users cast powerful spells but cannot wear armor and have few hit points. Requires INT 9."
  },
  Illusionist: {
    hitDie: 4,
    thacoProgression: [20, 20, 20, 20, 19, 19, 19, 19, 17, 17, 17, 17, 15, 15, 15, 15, 13, 13, 13, 13],
    xpTable: [0, 2250, 4500, 9500, 20000, 40000, 60000, 95000, 145000, 220000],
    savingThrows: {
      poison_death: [14, 14, 13, 13, 12, 12, 11, 11, 10, 10],
      wand: [11, 11, 10, 10, 9, 9, 8, 8, 7, 7],
      petrification: [13, 13, 12, 12, 11, 11, 10, 10, 9, 9],
      breath: [15, 15, 14, 14, 13, 13, 12, 12, 11, 11],
      spell: [12, 12, 11, 11, 10, 10, 9, 9, 8, 8]
    },
    description: "Specialist mages of phantasm and deception. Illusionists cast illusion spells, detect illusion, and have a unique spell list. Requires INT 9, DEX 16."
  },
  Thief: {
    hitDie: 6,
    thacoProgression: [20, 20, 20, 19, 19, 19, 17, 17, 17, 15, 15, 15, 13, 13, 13, 11, 11, 11, 9, 9],
    xpTable: [0, 1250, 2500, 5000, 10000, 20000, 40000, 70000, 110000, 160000],
    savingThrows: {
      poison_death: [13, 13, 12, 12, 11, 10, 9, 8, 7, 6],
      wand: [14, 14, 13, 13, 12, 11, 10, 9, 8, 7],
      petrification: [12, 12, 11, 11, 10, 9, 8, 7, 6, 5],
      breath: [16, 16, 15, 14, 13, 12, 11, 10, 9, 8],
      spell: [15, 15, 14, 14, 13, 12, 11, 10, 9, 8]
    },
    description: "Rogues and skulkers. Thieves pick locks, find traps, move silently, hide in shadows, pick pockets, backstab, and read languages. Requires DEX 9."
  },
  Assassin: {
    hitDie: 6,
    thacoProgression: [20, 20, 20, 19, 19, 19, 17, 17, 17, 15, 15, 15, 13, 13, 13, 11, 11, 11, 9, 9],
    xpTable: [0, 1500, 3000, 6000, 12000, 25000, 50000, 100000, 200000, 425000],
    savingThrows: {
      poison_death: [13, 13, 12, 12, 11, 10, 9, 8, 7, 6],
      wand: [14, 14, 13, 13, 12, 11, 10, 9, 8, 7],
      petrification: [12, 12, 11, 11, 10, 9, 8, 7, 6, 5],
      breath: [16, 16, 15, 14, 13, 12, 11, 10, 9, 8],
      spell: [15, 15, 14, 14, 13, 12, 11, 10, 9, 8]
    },
    description: "Killers for hire and masters of poison. Assassins have thief skills, backstab, use poison, and may disguise themselves. Any non-Good alignment. Requires STR 12, INT 11, DEX 12."
  },
  Monk: {
    hitDie: 6,
    thacoProgression: [20, 20, 19, 19, 18, 18, 17, 17, 16, 16, 15, 15, 14, 14, 13, 13, 12, 12, 11, 11],
    xpTable: [0, 2250, 4750, 10000, 22500, 47500, 97550, 175000, 350000, 650000],
    savingThrows: {
      poison_death: [13, 13, 12, 12, 11, 10, 9, 8, 7, 6],
      wand: [14, 14, 13, 13, 12, 11, 10, 9, 8, 7],
      petrification: [12, 12, 11, 11, 10, 9, 8, 7, 6, 5],
      breath: [16, 16, 15, 14, 13, 12, 11, 10, 9, 8],
      spell: [15, 15, 14, 14, 13, 12, 11, 10, 9, 8]
    },
    description: "Mystical martial artists of monastic orders. Monks fight bare-handed, gain acrobatic abilities, mind and body resistance, and stunning strikes. Requires STR 15, WIS 15, DEX 15, CON 11. Lawful only."
  }
};

export const ALIGNMENTS = [
  "Lawful Good", "Neutral Good", "Chaotic Good",
  "Lawful Neutral", "True Neutral", "Chaotic Neutral",
  "Lawful Evil", "Neutral Evil", "Chaotic Evil"
];

// Spell slots per level for spellcasting classes [level 1..10][spell level 1..9]
export const SPELL_SLOTS = {
  "Magic-User": [
    [1], [2], [2,1], [2,2], [2,2,1], [3,2,2], [3,2,2,1], [3,3,2,2], [3,3,2,2,1], [4,3,3,2,2,1]
  ],
  "Illusionist": [
    [1], [2], [2,1], [2,2], [2,2,1], [3,2,2], [3,2,2,1], [3,3,2,2], [3,3,2,2,1], [4,3,3,2,2]
  ],
  "Cleric": [
    [], [1], [2], [2,1], [2,2], [2,2,1], [2,2,2], [3,2,2,1], [3,3,2,2], [3,3,3,2]
  ],
  "Druid": [
    [], [1], [2], [2,1], [2,2], [2,2,1], [2,2,2], [3,2,2,1], [3,3,2,2], [3,3,3,2]
  ]
};

// Starting equipment packages by class
export const STARTING_EQUIPMENT = {
  Fighter: [
    { name: "Chain mail", qty: 1, notes: "AC 5" },
    { name: "Long sword", qty: 1, notes: "d8 damage" },
    { name: "Shield", qty: 1, notes: "AC +1" },
    { name: "Short bow", qty: 1, notes: "20 arrows" },
    { name: "Backpack", qty: 1 },
    { name: "Waterskin", qty: 1 },
    { name: "Torches", qty: 6 },
    { name: "Rations (1 week)", qty: 1 }
  ],
  Paladin: [
    { name: "Chain mail", qty: 1, notes: "AC 5" },
    { name: "Long sword", qty: 1, notes: "d8 damage" },
    { name: "Shield", qty: 1, notes: "AC +1" },
    { name: "Lance", qty: 1 },
    { name: "Holy symbol", qty: 1 },
    { name: "Backpack", qty: 1 },
    { name: "Rations (1 week)", qty: 1 }
  ],
  Ranger: [
    { name: "Leather armor", qty: 1, notes: "AC 7" },
    { name: "Long sword", qty: 1, notes: "d8 damage" },
    { name: "Short bow", qty: 1, notes: "20 arrows" },
    { name: "Dagger", qty: 2, notes: "d4 damage" },
    { name: "Backpack", qty: 1 },
    { name: "Rations (1 week)", qty: 1 }
  ],
  Cleric: [
    { name: "Chain mail", qty: 1, notes: "AC 5" },
    { name: "Mace", qty: 1, notes: "d6 damage" },
    { name: "Shield", qty: 1, notes: "AC +1" },
    { name: "Holy symbol", qty: 1 },
    { name: "Backpack", qty: 1 },
    { name: "Waterskin", qty: 1 },
    { name: "Rations (1 week)", qty: 1 }
  ],
  Druid: [
    { name: "Leather armor", qty: 1, notes: "AC 7" },
    { name: "Sickle", qty: 1, notes: "d4 damage" },
    { name: "Shield", qty: 1, notes: "AC +1" },
    { name: "Mistletoe", qty: 1, notes: "druidic focus" },
    { name: "Backpack", qty: 1 },
    { name: "Rations (1 week)", qty: 1 }
  ],
  "Magic-User": [
    { name: "Dagger", qty: 1, notes: "d4 damage" },
    { name: "Spellbook", qty: 1, notes: "contains 3 starting spells" },
    { name: "Component pouch", qty: 1 },
    { name: "Backpack", qty: 1 },
    { name: "Rations (1 week)", qty: 1 }
  ],
  Illusionist: [
    { name: "Dagger", qty: 1, notes: "d4 damage" },
    { name: "Spellbook", qty: 1, notes: "contains 3 starting illusions" },
    { name: "Component pouch", qty: 1 },
    { name: "Backpack", qty: 1 },
    { name: "Rations (1 week)", qty: 1 }
  ],
  Thief: [
    { name: "Leather armor", qty: 1, notes: "AC 7" },
    { name: "Short sword", qty: 1, notes: "d6 damage" },
    { name: "Dagger", qty: 2, notes: "d4 damage" },
    { name: "Thieves' tools", qty: 1 },
    { name: "Backpack", qty: 1 },
    { name: "Rations (1 week)", qty: 1 }
  ],
  Assassin: [
    { name: "Leather armor", qty: 1, notes: "AC 7" },
    { name: "Short sword", qty: 1, notes: "d6 damage" },
    { name: "Dagger", qty: 3, notes: "d4 damage, may be poisoned" },
    { name: "Thieves' tools", qty: 1 },
    { name: "Disguise kit", qty: 1 },
    { name: "Backpack", qty: 1 }
  ],
  Monk: [
    { name: "Robes", qty: 1 },
    { name: "Staff", qty: 1, notes: "d6 damage, parries" },
    { name: "Dagger", qty: 1, notes: "d4 damage" },
    { name: "Backpack", qty: 1 },
    { name: "Rations (1 week)", qty: 1 }
  ]
};

export const STARTING_GOLD = {
  Fighter: 120, Paladin: 150, Ranger: 100, Cleric: 120, Druid: 80,
  "Magic-User": 60, Illusionist: 60, Thief: 90, Assassin: 110, Monk: 25
};

// AC from armor + shield
export const ARMOR_AC = {
  "None": 10, "Robes": 10, "Leather armor": 8, "Chain mail": 5, "Plate mail": 3
};

export const SHIELD_AC_BONUS = 1;

// Class ability score requirements (minimum)
export const CLASS_REQUIREMENTS = {
  Paladin: { str: 12, wis: 13, cha: 17 },
  Ranger: { str: 13, int: 13, wis: 14, con: 14 },
  Cleric: { wis: 9 },
  Druid: { wis: 12, cha: 15 },
  "Magic-User": { int: 9 },
  Illusionist: { int: 9, dex: 16 },
  Thief: { dex: 9 },
  Assassin: { str: 12, int: 11, dex: 12 },
  Monk: { str: 15, wis: 15, dex: 15, con: 11 },
  Fighter: {}
};

// Class alignment restrictions
export const CLASS_ALIGNMENTS = {
  Paladin: ["Lawful Good"],
  Ranger: ["Neutral Good", "Chaotic Good", "Lawful Neutral", "Neutral Evil"],
  Druid: ["True Neutral"],
  Assassin: ["Lawful Evil", "Neutral Evil", "Chaotic Evil", "Neutral"],
  Monk: ["Lawful Good", "Lawful Neutral", "Lawful Evil"]
};

// Compute AC from equipment list
export function computeAC(equipment) {
  if (!equipment || !equipment.length) return 10;
  let bestArmorAC = 10;
  let hasShield = false;
  equipment.forEach(item => {
    if (ARMOR_AC[item.name] !== undefined) {
      bestArmorAC = Math.min(bestArmorAC, ARMOR_AC[item.name]);
    }
    if (item.name === "Shield") hasShield = true;
  });
  let ac = bestArmorAC;
  if (hasShield) ac -= SHIELD_AC_BONUS;
  return ac;
}

// Get THAC0 for a class at a given level (1-indexed)
export function getTHAC0(className, level) {
  const cls = CLASSES[className];
  if (!cls) return 20;
  const idx = Math.min(Math.max(level, 1), cls.thacoProgression.length) - 1;
  return cls.thacoProgression[idx];
}

// Get saving throws for a class at a level
export function getSavingThrows(className, level) {
  const cls = CLASSES[className];
  if (!cls) return { poison_death: 20, wand: 20, petrification: 20, breath: 20, spell: 20 };
  const idx = Math.min(Math.max(level, 1), cls.savingThrows.poison_death.length) - 1;
  return {
    poison_death: cls.savingThrows.poison_death[idx],
    wand: cls.savingThrows.wand[idx],
    petrification: cls.savingThrows.petrification[idx],
    breath: cls.savingThrows.breath[idx],
    spell: cls.savingThrows.spell[idx]
  };
}

// Get XP threshold for next level
export function getNextLevelXP(className, level) {
  const cls = CLASSES[className];
  if (!cls) return 2000;
  const idx = Math.min(Math.max(level, 1), cls.xpTable.length - 1);
  return cls.xpTable[idx];
}

// Get HP die roll (max at level 1) — returns the die to roll
export function getHPDie(className) {
  const cls = CLASSES[className];
  return cls ? cls.hitDie : 6;
}

// Roll a die (or dice) — returns total
export function rollDice(sides, count = 1) {
  let total = 0;
  for (let i = 0; i < count; i++) {
    total += Math.floor(Math.random() * sides) + 1;
  }
  return total;
}

// Roll 3d6 in order for ability scores
export function rollAbilityScores() {
  return {
    str: rollDice(6, 3),
    int: rollDice(6, 3),
    wis: rollDice(6, 3),
    dex: rollDice(6, 3),
    con: rollDice(6, 3),
    cha: rollDice(6, 3)
  };
}

// Apply racial adjustments to ability scores
export function applyRacialAdjustments(scores, race) {
  const raceData = RACES[race];
  if (!raceData) return { ...scores };
  const adjusted = { ...scores };
  Object.entries(raceData.abilityAdjustments).forEach(([ability, mod]) => {
    adjusted[ability] = Math.max(3, adjusted[ability] + mod);
  });
  return adjusted;
}

// Check if a class is available to a race
export function classAvailableToRace(className, race) {
  const raceData = RACES[race];
  if (!raceData) return false;
  return raceData.classes.includes(className);
}

// Check if character meets class ability requirements
export function meetsClassRequirements(className, scores) {
  const reqs = CLASS_REQUIREMENTS[className] || {};
  return Object.entries(reqs).every(([ability, min]) => (scores[ability] || 0) >= min);
}

// Check alignment validity for class
export function validAlignmentForClass(className, alignment) {
  const allowed = CLASS_ALIGNMENTS[className];
  if (!allowed) return true;
  return allowed.includes(alignment);
}

// Generate a random invite code
export function generateInviteCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}