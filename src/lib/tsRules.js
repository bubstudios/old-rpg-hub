// Top Secret (TSR, 1980, by Merle Rasmussen) — Cold War espionage.
// d100 roll-under percentile system. Mirrors the role of ijRules.js / bhRules.js.

export const ABILITIES = [
  { key: 'str', name: 'Physical Strength', short: 'PSTR', desc: 'Raw physical power and damage capacity. Equals your Vitality — how much punishment you can take before you fall.' },
  { key: 'pbea', name: 'Physical Beauty', short: 'PBEA', desc: 'Appearance and presence. Blending into a crowd, disguise, cover identities, first impressions.' },
  { key: 'char', name: 'Charm', short: 'CHAR', desc: 'Persuasion, seduction, social manipulation, and turning assets. Talking your way past a checkpoint.' },
  { key: 'cour', name: 'Courage', short: 'COUR', desc: 'Nerve under fire. Steadies your aim when the bullets fly and the stakes turn lethal.' },
  { key: 'know', name: 'Knowledge', short: 'KNOW', desc: 'Education, languages, technical know-how, and tradecraft facts. The well-trained agent\'s edge.' },
  { key: 'judg', name: 'Judgment', short: 'JUDG', desc: 'Perception, decision-making, reading situations, tactics. Knowing when to shoot, talk, or run.' },
  { key: 'coor', name: 'Coordination', short: 'COOR', desc: 'Reflexes, dexterity, and hand-eye coordination. The base chance to land a shot and the speed to react first.' }
];

export const ARCHETYPES = {
  "Field Agent": {
    description: "A case officer who runs assets and operations in hostile territory. Talks smooth, thinks fast, shoots straight.",
    weaponSkills: ["Pistol"],
    workSkills: ["Surveillance", "Persuasion"],
    dollars: 100,
    equipment: [
      { name: 'Suppressed Pistol', qty: 1 },
      { name: 'Ammunition (9mm)', qty: 16 },
      { name: 'Passport (Cover)', qty: 1 },
      { name: 'Cigarette Lighter (Camera)', qty: 1 },
      { name: 'Currency Pouch', qty: 1 }
    ]
  },
  "Assassin": {
    description: "A lethal eliminator who finishes contracts with cold precision. Silent, patient, and remorseless.",
    weaponSkills: ["Pistol", "Melee"],
    workSkills: ["Stealth", "Disguise"],
    dollars: 80,
    equipment: [
      { name: 'Suppressed Pistol', qty: 1 },
      { name: 'Ammunition (9mm)', qty: 16 },
      { name: 'Garrote Wire', qty: 1 },
      { name: 'Combat Knife', qty: 1 },
      { name: 'Lockpicks', qty: 1 }
    ]
  },
  "Commando": {
    description: "A military special-forces operator trained for direct action, sabotage, and raids behind enemy lines.",
    weaponSkills: ["Submachine Gun", "Brawling"],
    workSkills: ["Demolitions", "Climbing"],
    dollars: 60,
    equipment: [
      { name: 'Submachine Gun', qty: 1 },
      { name: 'Ammunition', qty: 90 },
      { name: 'Combat Knife', qty: 1 },
      { name: 'Frag Grenade', qty: 2 },
      { name: 'Rappelling Rope', qty: 1 }
    ]
  },
  "Demolitions Expert": {
    description: "A sapper who reshapes terrain with shaped charges and brings down anything that needs falling.",
    weaponSkills: ["Pistol", "Thrown"],
    workSkills: ["Demolitions", "Electronics"],
    dollars: 70,
    equipment: [
      { name: 'Pistol', qty: 1 },
      { name: 'Ammunition', qty: 16 },
      { name: 'Detonators', qty: 6 },
      { name: 'C-4 Charges', qty: 3 },
      { name: 'Multitool', qty: 1 }
    ]
  },
  "Electronics Tech": {
    description: "A specialist in bugs, wiretaps, alarm bypass, and the invisible architecture of surveillance.",
    weaponSkills: ["Pistol"],
    workSkills: ["Electronics", "Lockpicking"],
    dollars: 90,
    equipment: [
      { name: 'Pistol', qty: 1 },
      { name: 'Ammunition', qty: 16 },
      { name: 'Wiretap Kit', qty: 1 },
      { name: 'Lockpicks', qty: 1 },
      { name: 'Frequency Scanner', qty: 1 }
    ]
  },
  "Wheelman": {
    description: "A getaway driver and pursuit specialist who can bend any machine to the mission's tempo.",
    weaponSkills: ["Pistol", "Brawling"],
    workSkills: ["Driving", "Mechanics"],
    dollars: 75,
    equipment: [
      { name: 'Pistol', qty: 1 },
      { name: 'Ammunition', qty: 16 },
      { name: 'Spare Keys', qty: 1 },
      { name: 'Road Flares', qty: 4 },
      { name: 'Toolkit', qty: 1 }
    ]
  },
  "Interrogator": {
    description: "An agent who extracts information by any means — rapport, pressure, or the quiet edge of threat.",
    weaponSkills: ["Brawling", "Melee"],
    workSkills: ["Interrogation", "Persuasion"],
    dollars: 65,
    equipment: [
      { name: 'Pistol', qty: 1 },
      { name: 'Ammunition', qty: 16 },
      { name: 'Combat Knife', qty: 1 },
      { name: 'Truth Serum', qty: 2 },
      { name: 'Notebook', qty: 1 }
    ]
  },
  "Martial Artist": {
    description: "A hand-to-hand specialist trained in the lethal arts of the body. Disarms, disables, and strikes without a weapon.",
    weaponSkills: ["Brawling", "Melee"],
    workSkills: ["Stealth", "First Aid"],
    dollars: 50,
    equipment: [
      { name: 'Combat Knife', qty: 1 },
      { name: 'Brass Knuckles', qty: 1 },
      { name: 'Throwing Knives', qty: 3 },
      { name: 'Medical Kit', qty: 1 }
    ]
  },
  "Sniper": {
    description: "A long-range marksman who ends missions from a distance the target never sees coming.",
    weaponSkills: ["Rifle", "Pistol"],
    workSkills: ["Stealth", "Surveillance"],
    dollars: 70,
    equipment: [
      { name: 'Sniper Rifle', qty: 1 },
      { name: 'Ammunition', qty: 20 },
      { name: 'Pistol', qty: 1 },
      { name: 'Scope', qty: 1 },
      { name: 'Camouflage Netting', qty: 1 }
    ]
  },
  "Forgery Specialist": {
    description: "A crafter of false papers, signatures, and identities that open doors no key can.",
    weaponSkills: ["Pistol"],
    workSkills: ["Forgery", "Disguise"],
    dollars: 85,
    equipment: [
      { name: 'Pistol', qty: 1 },
      { name: 'Ammunition', qty: 16 },
      { name: 'Forgery Kit', qty: 1 },
      { name: 'Blank Passports', qty: 3 },
      { name: 'Ink & Stamps', qty: 1 }
    ]
  }
};

export const WEAPON_SKILLS = ['Brawling', 'Pistol', 'Rifle', 'Submachine Gun', 'Thrown', 'Melee'];

export const WORK_SKILLS = [
  'Disguise', 'Forgery', 'Electronics', 'Demolitions', 'Driving', 'Stealth',
  'Surveillance', 'Interrogation', 'Persuasion', 'Photography', 'Lockpicking',
  'Climbing', 'Swimming', 'First Aid', 'Languages', 'Tracking', 'Mechanics'
];

export const WEAPONS = {
  'Suppressed Pistol': { damage: '1d6', type: 'pistol', range: 'short', rof: 2, notes: 'Concealable, near-silent' },
  'Pistol': { damage: '1d8', type: 'pistol', range: 'medium', rof: 2, notes: 'Standard sidearm' },
  'Submachine Gun': { damage: '2d6', type: 'automatic', range: 'medium', rof: 3, notes: 'Full-auto spray' },
  'Sniper Rifle': { damage: '1d10', type: 'rifle', range: 'very long', rof: 1, notes: 'Precision, scoped' },
  'Combat Knife': { damage: '1d6', type: 'melee', range: 'melee', rof: 1, notes: 'Fighting knife' },
  'Garrote Wire': { damage: '1d4', type: 'melee', range: 'melee', rof: 1, notes: 'Silent, lethal' },
  'Frag Grenade': { damage: '3d6', type: 'thrown', range: 'short', rof: 1, notes: 'Area blast' },
  'Throwing Knife': { damage: '1d4', type: 'thrown', range: 'short', rof: 1, notes: 'Silent ranged' },
  'Brass Knuckles': { damage: '1d4', type: 'melee', range: 'melee', rof: 1, notes: 'Brawling assist' }
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

// Wound severity (d100). Damage is subtracted from Vitality (Physical Strength).
export const WOUND_SEVERITY = [
  { min: 1, max: 25, severity: 'Slight', damage: 1, effect: 'A graze. Barely a scratch.' },
  { min: 26, max: 50, severity: 'Light', damage: 2, effect: 'A flesh wound. Fights on.' },
  { min: 51, max: 70, severity: 'Medium', damage: 4, effect: 'A painful hit. -10% to actions until treated.' },
  { min: 71, max: 85, severity: 'Serious', damage: 8, effect: 'A grave wound. Bleeding badly; -20% to all actions.' },
  { min: 86, max: 95, severity: 'Critical', damage: 16, effect: 'Critical! Incapacitated and dying without aid.' },
  { min: 96, max: 100, severity: 'Mortal', damage: 999, effect: 'A mortal wound. The agent falls and dies.' }
];

function rollDie(sides) { return Math.floor(Math.random() * sides) + 1; }

// Roll a percentile attribute (d100). Agents get a small professional bonus.
export function rollAttribute() {
  return Math.min(100, rollDie(100) + 5);
}

export function rollAbilityScores() {
  const scores = {};
  ABILITIES.forEach((a) => { scores[a.key] = rollAttribute(); });
  return scores;
}

// Bonus skills scale inversely with raw attribute totals — the resourceful compensate for weakness.
export function skillCountFor(scores) {
  const total = ABILITIES.reduce((sum, a) => sum + (scores[a.key] || 50), 0);
  if (total < 350) return 6;
  if (total < 450) return 5;
  if (total < 550) return 4;
  return 3;
}

// Vitality (hit points) = Physical Strength score.
export function computeHP(scores) {
  return Math.max(1, Math.round(scores.str || 50));
}

// Initiative modifier from Coordination (COOR/10, rounded down).
export function getInitiativeMod(scores) {
  return Math.floor((scores.coor || 50) / 10);
}

// Courage modifier to Coordination under pressure.
export function getCourageMod(scores) {
  return Math.floor((scores.cour || 50) / 20) - 5;
}

// Best weapon skill level the agent holds (hit-number bonus, ×10%).
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