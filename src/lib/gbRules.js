// Ghostbusters (West End Games, 1986) — the original D6 System.
// Dice-pool resolution: roll attribute dice + skill dice, sum, beat a Target Number.
// Brownie Points are currency, hero points, and the damage track.

export const ABILITIES = [
  { key: 'brain', name: 'Brain', short: 'BRAIN', desc: 'Intellect, knowledge, logic, and book-learning. Science, electronics, research.' },
  { key: 'muscle', name: 'Muscle', short: 'MUSCLE', desc: 'Physical power and brawn. Lifting, fighting, enduring, throwing.' },
  { key: 'moves', name: 'Moves', short: 'MOVES', desc: 'Agility, reflexes, and coordination. Dodging, driving, sneaking, acrobatics.' },
  { key: 'cool', name: 'Cool', short: 'COOL', desc: 'Composure, willpower, and social grace. Charm, intimidation, lying, nerve under fire.' }
];

export const SKILLS_BY_ATTR = {
  brain: ['Science', 'Occult Lore', 'Electronics', 'Repair', 'Bureaucracy', 'Research', 'Computers', 'Parapsychology'],
  muscle: ['Fight', 'Lift', 'Endure', 'Throw'],
  moves: ['Dodge', 'Drive', 'Sneak', 'Acrobatics', 'Run', 'Pilot'],
  cool: ['Charm', 'Intimidate', 'Lie', 'Willpower', 'Leadership', 'Streetwise']
};

export const ALL_SKILLS = Object.values(SKILLS_BY_ATTR).flat();

export const ARCHETYPES = {
  "Scientist": {
    description: "A parapsychologist with a Ph.D. and a proton pack. Believes everything has a rational explanation — until it doesn't.",
    attributes: { brain: 4, muscle: 2, moves: 2, cool: 3 },
    tagSkills: ['Parapsychology', 'Science'],
    bp: 20,
    equipment: [
      { name: 'Proton Pack', qty: 1 },
      { name: 'PKE Meter', qty: 1 },
      { name: 'Ecto-Goggles', qty: 1 },
      { name: 'Lab Coat', qty: 1 },
      { name: 'Ghost Trap', qty: 1 }
    ]
  },
  "Technician": {
    description: "The gear-head who keeps the proton packs firing and Ecto-1 running. Can MacGyver a trap from a toaster.",
    attributes: { brain: 3, muscle: 3, moves: 2, cool: 3 },
    tagSkills: ['Repair', 'Electronics'],
    bp: 20,
    equipment: [
      { name: 'Proton Pack', qty: 1 },
      { name: 'Slime Blower', qty: 1 },
      { name: 'Tool Kit', qty: 1 },
      { name: 'Ghost Trap', qty: 1 },
      { name: 'Coveralls', qty: 1 }
    ]
  },
  "Blue-Collar Buster": {
    description: "A working stiff who answered a want ad and now wrangles spooks for a living. Grounded, practical, unflappable.",
    attributes: { brain: 2, muscle: 4, moves: 3, cool: 2 },
    tagSkills: ['Fight', 'Endure'],
    bp: 25,
    equipment: [
      { name: 'Proton Pack', qty: 1 },
      { name: 'Ghost Trap', qty: 2 },
      { name: 'Slime Repellent Coveralls', qty: 1 },
      { name: 'Crowbar', qty: 1 }
    ]
  },
  "Civil Servant": {
    description: "A fire marshal, EPA inspector, or city official who stumbled into the supernatural. Bureaucracy meets the bizarre.",
    attributes: { brain: 3, muscle: 2, moves: 2, cool: 4 },
    tagSkills: ['Bureaucracy', 'Leadership'],
    bp: 20,
    equipment: [
      { name: 'Proton Pack', qty: 1 },
      { name: 'Ghost Trap', qty: 1 },
      { name: 'City ID Badge', qty: 1 },
      { name: 'Clipboard', qty: 1 }
    ]
  },
  "Occultist": {
    description: "A student of the arcane and the esoteric — rituals, tomes, and the names of things that should not be named.",
    attributes: { brain: 4, muscle: 2, moves: 2, cool: 3 },
    tagSkills: ['Occult Lore', 'Willpower'],
    bp: 18,
    equipment: [
      { name: 'Proton Pack', qty: 1 },
      { name: 'Tome of Gozer', qty: 1 },
      { name: 'Ghost Trap', qty: 1 },
      { name: 'Crystals & Talismans', qty: 1 },
      { name: 'PKE Meter', qty: 1 }
    ]
  },
  "Journalist": {
    description: "A reporter chasing the story of the century — ghosts are real, and it's front-page news. Nosey, quick, persuasive.",
    attributes: { brain: 3, muscle: 2, moves: 3, cool: 3 },
    tagSkills: ['Research', 'Streetwise'],
    bp: 18,
    equipment: [
      { name: 'Proton Pack', qty: 1 },
      { name: 'Camera', qty: 1 },
      { name: 'Ghost Trap', qty: 1 },
      { name: 'Press Pass', qty: 1 },
      { name: 'Recorder', qty: 1 }
    ]
  },
  "Maverick": {
    description: "A fast-talking con-artist, hustler, or disgraced ex-cop who talks fast and shoots faster. Slime? No problem.",
    attributes: { brain: 2, muscle: 3, moves: 3, cool: 3 },
    tagSkills: ['Lie', 'Drive'],
    bp: 20,
    equipment: [
      { name: 'Proton Pack', qty: 1 },
      { name: 'Ghost Trap', qty: 1 },
      { name: 'Business Cards', qty: 1 },
      { name: 'Sunglasses', qty: 1 }
    ]
  }
};

export const TARGET_NUMBERS = [
  { tn: 5, label: 'Easy', desc: 'Routine — wrangling a Class 1 free-floating vapor' },
  { tn: 10, label: 'Moderate', desc: 'Tricky — trapping a Class 4 full-torso apparition' },
  { tn: 15, label: 'Hard', desc: 'Dangerous — containing a Class 5 slime-spewing mutator' },
  { tn: 20, label: 'Very Hard', desc: 'Heroic — crossing the streams, facing Gozer' },
  { tn: 25, label: 'Legendary', desc: 'Nearly impossible — banishing a demigod' }
];

function rollDie(sides) { return Math.floor(Math.random() * sides) + 1; }

// Roll the Ghost Die: 1d6. A 6 = Ghost (counts as 0 and summons a complication).
export function rollGhostDie() {
  const roll = rollDie(6);
  return { roll, isGhost: roll === 6, value: roll === 6 ? 0 : roll };
}

// Roll a trait pool: (attribute + skill + bonus) d6, one of which is the Ghost Die.
export function rollTraitPool(attrDice, skillDice, bonusDice = 0) {
  const totalCount = Math.max(1, attrDice + skillDice + bonusDice);
  const dice = [];
  for (let i = 0; i < totalCount; i++) dice.push(rollDie(6));
  const ghost = rollGhostDie();
  // Replace the first die with the ghost die's numeric value (ghost = 0)
  dice[0] = ghost.value;
  const total = dice.reduce((s, v) => s + v, 0);
  return { dice, ghost, total };
}

export function startingBP(archetype) {
  return ARCHETYPES[archetype]?.bp || 20;
}

export function attrForSkill(skillName) {
  for (const [attr, skills] of Object.entries(SKILLS_BY_ATTR)) {
    if (skills.includes(skillName)) return attr;
  }
  return null;
}