// Gangbusters (TSR, 1982, by Rick Barton) — Prohibition-era organized crime.
// d100 roll-under percentile system. A close cousin of Boot Hill and Top Secret.

export const ABILITIES = [
  { key: 'mus', name: 'Muscle', short: 'MUS', desc: 'Physical strength, brawling prowess, and intimidation. Equals your Grit — how much lead you can take before you drop.' },
  { key: 'agi', name: 'Agility', short: 'AGI', desc: 'Quickness, reflexes, and coordination. Determines initiative and how fast you draw or dodge.' },
  { key: 'aim', name: 'Aim', short: 'AIM', desc: 'Shooting accuracy — the most important stat when the lead starts flying. The base chance to land a shot.' },
  { key: 'sav', name: 'Savvy', short: 'SAV', desc: 'Street smarts, perception, and investigation. Reading a room, spotting a tail, finding the hidden door in a speakeasy.' },
  { key: 'ner', name: 'Nerve', short: 'NER', desc: 'Courage under fire and willpower. Steadies your aim when the bullets fly and the stakes turn lethal.' },
  { key: 'pan', name: 'Panache', short: 'PAN', desc: 'Charm, persuasion, deception, and fast-talking. Talking your way past a cop, running a con, or working a room.' }
];

export const ARCHETYPES = {
  "Gangster": {
    description: "A made man in the organization — runs rackets, collects debts, and carries a piece. Lives by the code and dies by it too.",
    weaponSkills: ["Pistol", "Brawling"],
    workSkills: ["Intimidation", "Streetwise"],
    dollars: 100,
    equipment: [
      { name: '.38 Revolver', qty: 1 },
      { name: 'Ammunition (.38)', qty: 12 },
      { name: 'Pinstripe Suit', qty: 1 },
      { name: 'Felt Fedora', qty: 1 },
      { name: 'Switchblade', qty: 1 }
    ]
  },
  "Hit Man": {
    description: "A professional killer on the outfit's payroll. Patient, precise, and utterly without conscience. The man nobody sees coming.",
    weaponSkills: ["Pistol", "Rifle"],
    workSkills: ["Stealth", "Investigation"],
    dollars: 150,
    equipment: [
      { name: '.45 Automatic', qty: 1 },
      { name: 'Ammunition (.45)', qty: 14 },
      { name: 'Suppressor', qty: 1 },
      { name: 'Garrote Wire', qty: 1 },
      { name: 'Dark Overcoat', qty: 1 }
    ]
  },
  "Bootlegger": {
    description: "A smuggler who moves cases of Canadian whisky past the Revenue agents and into the city's thirsty speakeasies. Knows every back road and bribeable cop.",
    weaponSkills: ["Pistol", "Brawling"],
    workSkills: ["Driving", "Streetwise"],
    dollars: 120,
    equipment: [
      { name: '.38 Revolver', qty: 1 },
      { name: 'Ammunition (.38)', qty: 12 },
      { name: 'Touring Car', qty: 1 },
      { name: 'Cases of Whisky', qty: 4 },
      { name: 'Road Map', qty: 1 }
    ]
  },
  "Safecracker": {
    description: "A second-story worker and vault man who can open any lock with time and the right tools. Fingers like a surgeon, nerves like a cat.",
    weaponSkills: ["Pistol"],
    workSkills: ["Pick Lock", "Stealth"],
    dollars: 90,
    equipment: [
      { name: '.32 Revolver', qty: 1 },
      { name: 'Ammunition (.32)', qty: 8 },
      { name: 'Lockpicks', qty: 1 },
      { name: 'Stethoscope', qty: 1 },
      { name: 'Glass Cutter', qty: 1 }
    ]
  },
  "Police Officer": {
    description: "A beat cop or plainclothes detective on the right side of the law — or trying to be, in a city where everyone's on the take.",
    weaponSkills: ["Pistol", "Brawling"],
    workSkills: ["Investigation", "Intimidation"],
    dollars: 80,
    equipment: [
      { name: '.38 Service Revolver', qty: 1 },
      { name: 'Ammunition (.38)', qty: 18 },
      { name: 'Badge', qty: 1 },
      { name: 'Nightstick', qty: 1 },
      { name: 'Handcuffs', qty: 1 }
    ]
  },
  "Federal Agent": {
    description: "A G-man or Prohibition Bureau agent working for the federal government. Untouchable — on paper, anyway. Al Capone's worst nightmare, or his next asset.",
    weaponSkills: ["Pistol", "Rifle"],
    workSkills: ["Investigation", "Interrogation"],
    dollars: 100,
    equipment: [
      { name: '.45 Automatic', qty: 1 },
      { name: 'Ammunition (.45)', qty: 21 },
      { name: 'Federal Badge', qty: 1 },
      { name: 'Notebook', qty: 1 },
      { name: 'Overcoat', qty: 1 }
    ]
  },
  "Private Investigator": {
    description: "A shamus with a dingy office, a bottle in the drawer, and a knack for finding trouble. Works divorce cases by day, stumbles into murder by night.",
    weaponSkills: ["Pistol", "Brawling"],
    workSkills: ["Investigation", "Streetwise"],
    dollars: 70,
    equipment: [
      { name: '.38 Revolver', qty: 1 },
      { name: 'Ammunition (.38)', qty: 12 },
      { name: 'Camera', qty: 1 },
      { name: 'Field Notebook', qty: 1 },
      { name: 'Trench Coat', qty: 1 }
    ]
  },
  "Racketeer": {
    description: "A boss who runs protection rackets, gambling dens, and vice operations. Doesn't pull the trigger — has it pulled for him. The money and the muscle answer to him.",
    weaponSkills: ["Pistol"],
    workSkills: ["Intimidation", "Persuasion"],
    dollars: 200,
    equipment: [
      { name: '.38 Revolver', qty: 1 },
      { name: 'Ammunition (.38)', qty: 12 },
      { name: 'Fine Suit', qty: 1 },
      { name: 'Cigar Case', qty: 1 },
      { name: 'Roll of Cash', qty: 1 }
    ]
  },
  "Wheelman": {
    description: "A getaway driver and transport specialist who can bend any machine to the job. The man behind the wheel when the heist goes sideways.",
    weaponSkills: ["Pistol", "Brawling"],
    workSkills: ["Driving", "Mechanics"],
    dollars: 85,
    equipment: [
      { name: '.32 Revolver', qty: 1 },
      { name: 'Ammunition (.32)', qty: 8 },
      { name: 'Fast Coupe', qty: 1 },
      { name: 'Tool Kit', qty: 1 },
      { name: 'Road Flares', qty: 3 }
    ]
  },
  "Con Artist": {
    description: "A grifter who lives by the long con — smooth talk, false promises, and a new name in every city. Has a silver tongue and light fingers.",
    weaponSkills: ["Pistol"],
    workSkills: ["Persuasion", "Disguise"],
    dollars: 110,
    equipment: [
      { name: '.25 Automatic', qty: 1 },
      { name: 'Ammunition (.25)', qty: 8 },
      { name: 'Set of Fake IDs', qty: 3 },
      { name: 'Marked Cards', qty: 1 },
      { name: 'Fine Suit', qty: 1 }
    ]
  }
};

export const WEAPON_SKILLS = ['Pistol', 'Rifle', 'Shotgun', 'Submachine Gun', 'Brawling', 'Melee', 'Thrown'];

export const WORK_SKILLS = [
  'Driving', 'Stealth', 'Pick Lock', 'Forgery', 'Intimidation', 'Interrogation',
  'Investigation', 'Streetwise', 'Appraisal', 'Disguise', 'Demolitions', 'Mechanics'
];

export const WEAPONS = {
  '.38 Revolver': { damage: '1d8', type: 'pistol', range: 'medium', notes: 'Standard sidearm' },
  '.45 Automatic': { damage: '1d8+1', type: 'pistol', range: 'medium', notes: 'Hard-hitting semi-auto' },
  '.32 Revolver': { damage: '1d6', type: 'pistol', range: 'short', notes: 'Concealable pocket gun' },
  '.25 Automatic': { damage: '1d4', type: 'pistol', range: 'short', notes: 'Ladies\' / hideout gun' },
  'Submachine Gun': { damage: '2d6', type: 'automatic', range: 'medium', notes: 'Tommy Gun — full-auto mayhem' },
  'Shotgun': { damage: '1d10', type: 'shotgun', range: 'short', notes: 'Devastating up close' },
  'Rifle': { damage: '1d8', type: 'rifle', range: 'long', notes: 'Hunting or military' },
  'Switchblade': { damage: '1d4', type: 'melee', range: 'melee', notes: 'Folding knife' },
  'Nightstick': { damage: '1d6', type: 'melee', range: 'melee', notes: 'Police baton' },
  'Garrote Wire': { damage: '1d4', type: 'melee', range: 'melee', notes: 'Silent and lethal' }
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
  { min: 26, max: 50, severity: 'Light', damage: 2, effect: 'A flesh wound. Fights on.' },
  { min: 51, max: 70, severity: 'Medium', damage: 4, effect: 'A painful hit. -10% to actions until treated.' },
  { min: 71, max: 85, severity: 'Serious', damage: 8, effect: 'A grave wound. Bleeding badly; -20% to all actions.' },
  { min: 86, max: 95, severity: 'Critical', damage: 16, effect: 'Critical! Incapacitated and dying without aid.' },
  { min: 96, max: 100, severity: 'Mortal', damage: 999, effect: 'A mortal wound. The character falls and dies.' }
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

// Grit (hit points) = Muscle score.
export function computeHP(scores) {
  return Math.max(1, Math.round(scores.mus || 50));
}

export function getInitiativeMod(scores) {
  return Math.floor((scores.agi || 50) / 10);
}

export function getNerveMod(scores) {
  return Math.floor((scores.ner || 50) / 20) - 5;
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