// Pathfinder Journeys — Solo Sandbox RPG
// Core rules, data, and configuration for the frontend

// === CORE ABILITIES (d100 roll-under) ===
export const PJ_ABILITIES = [
  { key: 'cbt', label: 'Combat', desc: 'Weapons, hand-to-hand, tactical firefights' },
  { key: 'pil', label: 'Piloting', desc: 'Flying ships, navigation, maneuvering, evasion' },
  { key: 'eng', label: 'Engineering', desc: 'Repair, modify, hack systems and technology' },
  { key: 'sci', label: 'Science', desc: 'Research, analysis, medicine, xenobiology' },
  { key: 'sec', label: 'Security', desc: 'Stealth, infiltration, locks, security systems' },
  { key: 'cmd', label: 'Command', desc: 'Leadership, tactics, fleet coordination, willpower' },
  { key: 'com', label: 'Communications', desc: 'Broadcasting, signals, encryption, diplomacy' },
  { key: 'ath', label: 'Athletics', desc: 'Running, climbing, endurance; equals Vitality' }
];

export const PJ_ABILITY_LABELS = {
  cbt: 'CBT', pil: 'PIL', eng: 'ENG', sci: 'SCI',
  sec: 'SEC', cmd: 'CMD', com: 'COM', ath: 'ATH'
};

export const PJ_COMBAT_SKILLS = ['Combat', 'Weapons Training', 'Infiltration'];

// === DIFFICULTY MODIFIERS ===
export const PJ_DIFFICULTY = [
  { label: 'Trivial', mod: 20 },
  { label: 'Easy', mod: 10 },
  { label: 'Routine', mod: 0 },
  { label: 'Challenging', mod: -10 },
  { label: 'Difficult', mod: -20 },
  { label: 'Very Difficult', mod: -30 },
  { label: 'Formidable', mod: -40 },
  { label: 'Near Impossible', mod: -60 }
];

// === WEAPONS ===
export const PJ_WEAPONS = {
  'Laser Pistol': { die: 10, count: 1, bonus: 0 },
  'Laser Rifle': { die: 10, count: 2, bonus: 0 },
  'Pulse Carbine': { die: 8, count: 2, bonus: 0 },
  'Plasma Grenade': { die: 10, count: 3, bonus: 0 },
  'Combat Knife': { die: 6, count: 1, bonus: 0 },
  'Stun Baton': { die: 6, count: 1, bonus: 0 }
};

// === CHARACTER ORIGINS ===
export const PJ_ORIGINS = [
  { name: 'Earth Naval Academy', desc: 'Trained at Earth Command Naval Academy. Disciplined, connected, conventional.', adjustments: { cmd: 10, com: 5, pil: 5 } },
  { name: 'Outer Colony Survivor', desc: 'Grew up on a frontier world. Scrappy, resourceful, suspicious of authority.', adjustments: { sec: 10, ath: 5, eng: 5 } },
  { name: 'Sanctuary Refugee', desc: 'Raised among the displaced species of the Sanctuary fleet. Cosmopolitan, adaptable.', adjustments: { com: 10, sci: 5, sec: 5 } },
  { name: 'Confluence Defector', desc: 'Former Confluence operative who saw the truth. Knows their systems, languages, law.', adjustments: { sci: 10, sec: 10, cmd: -5 } },
  { name: 'Architect Touched', desc: 'Experienced a temporal event early in life. Haunted by fragments of possible futures.', adjustments: { sci: 5, cmd: 5, com: -5 } }
];

// === CHARACTER ROLES ===
export const PJ_ROLES = [
  { name: 'Commander', desc: "The ship's commanding officer. Balanced leader.", abilities: { cbt: 50, pil: 45, eng: 40, sci: 45, sec: 45, cmd: 70, com: 60, ath: 55 } },
  { name: 'Tactical Officer', desc: 'Combat specialist and security chief.', abilities: { cbt: 70, pil: 45, eng: 40, sci: 40, sec: 60, cmd: 50, com: 40, ath: 60 } },
  { name: 'Chief Engineer', desc: 'Keeps the ship flying through impossible odds.', abilities: { cbt: 45, pil: 40, eng: 75, sci: 55, sec: 50, cmd: 40, com: 40, ath: 55 } },
  { name: 'Science Officer', desc: 'Xenobiologist, analyst, future-memory interpreter.', abilities: { cbt: 40, pil: 40, eng: 50, sci: 75, sec: 45, cmd: 45, com: 50, ath: 50 } },
  { name: 'Pilot', desc: 'Flies the ship through fire and FTL.', abilities: { cbt: 45, pil: 75, eng: 50, sci: 40, sec: 45, cmd: 45, com: 45, ath: 60 } },
  { name: 'Communications Officer', desc: 'Broadcasts, encrypts, intercepts, diplomates.', abilities: { cbt: 40, pil: 45, eng: 45, sci: 50, sec: 45, cmd: 50, com: 75, ath: 50 } }
];

// === CANONICAL CREW ===
export const PJ_CREW = [
  { name: 'Commander Farah Thorne', role: 'Tactical / Security', desc: 'Fierce, blunt, heroic, competitive, loyal. Bub\'s tactical right hand.', use: 'Combat advice, boarding actions, security warnings.' },
  { name: 'Commander Clark', role: 'Science / Sensors / Hacking', desc: 'Dry humor, brilliant, curious, skeptical.', use: 'Analysis, alien tech, future-memory interpretation.' },
  { name: 'James Stellar', role: 'Grandfather / Confluence Survivor', desc: 'Haunted, wise, regretful, disciplined. Bub\'s grandfather.', use: 'Confluence tactics, legal systems, augmentation knowledge.' },
  { name: 'Sarah Chen', role: 'Resistance Agent', desc: "Admiral Chen's daughter. Desperate, brave, wounded, practical.", use: 'Resistance contacts, Sanctuary knowledge, Chen family insight.' },
  { name: 'Professor Carmelon', role: 'Alien History / Biology', desc: 'Old, brilliant, eccentric, thoughtful. A Sanctuary scholar.', use: 'Archaeology, alien motives, weird science.' },
  { name: 'Mitchell', role: 'Enhanced Bald Eagle', desc: 'Intelligent, instinctive, loyal, mysterious. Temporal sensitivity.', use: 'Danger warnings, deception sense, temporal disturbance, emotional truth.' },
  { name: 'Lieutenant Hayes', role: 'Communications', desc: 'Young, brave, growing into legend. Her messages can start the resistance cascade.', use: 'Broadcasts, encryption, signal tracing, morale messages.' },
  { name: 'Lieutenant Reeves', role: 'Pilot', desc: 'Young, talented, anxious under pressure but dependable.', use: 'Evasive maneuvers, dangerous jumps, pursuit scenes.' },
  { name: 'Chief Ramos', role: 'Engineering', desc: 'Veteran, tough, practical. Keeps the Pathfinder alive.', use: 'Repairs, upgrades, power problems, emergency miracles.' },
  { name: 'Dr. Voss', role: 'Medical Officer', desc: 'Skeptical, dry, humane. Deals with injuries and alien biology.', use: 'Injuries, alien biology, trauma, moral medical dilemmas.' },
  { name: 'Ensign Patel', role: 'Engineer / New Titan Native', desc: 'Earnest, emotional, capable. His family is on New Titan.', use: 'New Titan connection, engineering support, human cost.' }
];

// === SANDBOX REGIONS ===
export const PJ_REGIONS = [
  { name: 'New Titan System', desc: 'Mining colony. 2M population. Immediate danger. Possible Confluence agents.' },
  { name: 'Earth / Sol System', desc: 'Homeworld. Chen controls UEC. Public does not know the truth.' },
  { name: 'Novara System', desc: "Lost colony sold to Collector's Guild. Survivors may exist as contract labor." },
  { name: 'Sanctuary Fleet', desc: 'Refugee allies. Mobile, fragile, politically complicated.' },
  { name: 'Confluence Space', desc: 'Legal courts, enforcement routes, data archives, claim offices. High danger.' },
  { name: 'Vescarri Sovereignty Space', desc: 'Species claiming Earth. Ancient seeding records may be here.' },
  { name: "Collector's Guild Routes", desc: 'Trade lanes where populations are moved, leased, cataloged, sold.' },
  { name: 'Architect Sites', desc: 'Ancient temporal structures. Future memories, time anomalies.' },
  { name: 'Lost Human Colonies', desc: 'Human worlds Earth forgot or never knew survived.' },
  { name: 'Dead Civilization Graveyards', desc: 'Worlds destroyed by The Confluence. Archaeology, warnings, records.' }
];

// === SANDBOX CLOCKS ===
export const PJ_CLOCKS = [
  { key: 'confluence_claim', label: 'Confluence Claim', desc: 'How close The Confluence is to processing Earth/New Titan.', start: 70, highIsBad: true },
  { key: 'confluence_heat', label: 'Confluence Heat', desc: 'How hard The Confluence is hunting Bub.', start: 65, highIsBad: true },
  { key: 'chen_countermeasures', label: 'Chen Countermeasures', desc: 'How aggressively Admiral Chen moves against Bub.', start: 35, highIsBad: true },
  { key: 'new_titan_stability', label: 'New Titan Stability', desc: 'Calm, suspicious, panicking, or resisting.', start: 50, highIsBad: false },
  { key: 'resistance_spark', label: 'Resistance Spark', desc: 'How much the galaxy believes resistance is possible.', start: 20, highIsBad: false },
  { key: 'sanctuary_trust', label: 'Sanctuary Trust', desc: 'Confidence of alien allies in Bub.', start: 55, highIsBad: false },
  { key: 'crew_morale', label: 'Crew Morale', desc: 'Inspired, strained, shaken, or breaking.', start: 85, highIsBad: false },
  { key: 'temporal_instability', label: 'Temporal Instability', desc: 'Rises if future memories are used too aggressively.', start: 15, highIsBad: true },
  { key: 'public_truth', label: 'Public Truth', desc: 'How much the galaxy knows Chen and The Confluence are lying.', start: 10, highIsBad: false }
];

// === SHIP STATS ===
export const PJ_SHIP_STATS = [
  { key: 'hull', label: 'Hull', start: 82 },
  { key: 'shields', label: 'Shields', start: 76 },
  { key: 'engines', label: 'Engines', start: 70 },
  { key: 'ftl', label: 'FTL Drive', start: 68 },
  { key: 'weapons', label: 'Weapons', start: 65 },
  { key: 'sensors', label: 'Sensors', start: 82 },
  { key: 'life_support', label: 'Life Support', start: 94 },
  { key: 'fuel', label: 'Fuel / Power', start: 75 }
];

// === EVIDENCE ===
export const PJ_EVIDENCE = [
  { name: 'Prometheus Warning', desc: 'Lost ship warns: Do not attend. It is a trap.' },
  { name: 'James Stellar Testimony', desc: 'Grandfather and Confluence survivor.' },
  { name: 'Korath Database', desc: 'Scavenged from the Korath Graveyard.' },
  { name: 'Novara Transaction Record', desc: "Proof Novara was sold to Collector's Guild." },
  { name: 'Sakura-Chen Technology Exchange', desc: 'Chen traded Novara for propulsion technology.' },
  { name: 'New Titan Claim File', desc: 'The Confluence claim on New Titan.' },
  { name: 'Sarah Chen Testimony', desc: "Admiral Chen's daughter speaks." },
  { name: 'Sanctuary Archive Records', desc: 'Records from the refugee haven.' },
  { name: 'Architect Future-History Data', desc: 'Encoded memories of a 473-year future war where The Confluence fell.' }
];

// === EPISODE SUMMARIES (Campaign Bible — Already Happened) ===
export const PJ_EPISODES = [
  { num: 1, title: 'The Auction of Stars', summary: 'Confluence invitation, Earth claimed, 14 cycles to contest.' },
  { num: 2, title: 'The Prometheus Warning', summary: 'Lost ship warns: Do not attend. It is a trap.' },
  { num: 3, title: 'The Korath Graveyard', summary: 'Scavenge wreckage, find evidence, encounter Vescarri refugees.' },
  { num: 4, title: 'Coordinates and Consequences', summary: 'Navigator Thorne joins, choose destination, Chen shadow grows.' },
  { num: 5, title: 'The Novara Exchange', summary: 'Meet Sarah Chen, discover Sakura-Chen technology exchange.' },
  { num: 6, title: 'The Traitor Revealed', summary: 'Admiral Chen exposed, crew mutiny, Sarah Chen guides escape.' },
  { num: 7, title: 'Sanctuary', summary: 'Refugee haven, Sanctuary Council, Vescarri refugees, Mitchell reacts.' },
  { num: 8, title: "The Archive's Secret", summary: 'Shapeshifter infiltrator, Architect Protocol discovered, Confluence fleet arrives.' },
  { num: 9, title: 'The Battle for Sanctuary', summary: 'Large-scale ship battle, Vask offer, activate Architect Protocol.' },
  { num: 10, title: 'Messages Across Time', summary: '473 years in future, Confluence fell, crew returns with encoded memories, broadcast resistance, head to New Titan.' }
];

// === STARTING STATE (Canon Mode — after Arc 1) ===
export const PJ_STARTING_STATE = {
  ship_stats: PJ_SHIP_STATS.reduce((acc, s) => { acc[s.key] = s.start; return acc; }, {}),
  clocks: PJ_CLOCKS.reduce((acc, c) => { acc[c.key] = c.start; return acc; }, {}),
  evidence: PJ_EVIDENCE.map(e => e.name),
  allies: ['Sarah Chen', 'James Stellar', 'Sanctuary refugee fleet', 'Councilor Verath', 'Commander Vex', '37 allied ships', 'Mitchell'],
  enemies: ['The Confluence', 'Vescarri Sovereignty', "Collector's Guild", 'Admiral Chen', 'Captain Vask', 'Confluence shapeshifters'],
  current_location: 'Edge of New Titan System',
  current_mission: 'Warn New Titan before Confluence agents secure the colony.'
};

// === BUB STELLAR (Canon Mode Player Character) ===
export const BUB_STELLAR = {
  name: 'Bub Stellar',
  race: 'Human',
  character_class: 'Commander',
  ability_scores: { cbt: 62, pil: 50, eng: 45, sci: 48, sec: 50, cmd: 80, com: 68, ath: 58 },
  level: 1,
  hp_current: 58,
  hp_max: 58,
  ac: 62,
  gold: 500,
  equipment: [
    { name: 'Laser Pistol', qty: 1 },
    { name: 'Command Override Codes', qty: 1 },
    { name: 'Tactical Vest', qty: 1 },
    { name: 'Commlink', qty: 1 }
  ],
  skills: [{ name: 'Leadership', level: 1 }],
  appearance: "A weathered officer in his mid-forties, silver threading through dark hair at the temples. Clean-shaven with deep-set eyes that carry the weight of impossible knowledge — memories of a future war. Wears the standard United Earth Command duty uniform with captain's insignia.",
  background: "Captain Bub Stellar commands the UES Pathfinder. He led his crew through Arc 1: the Confluence claimed Earth, the Prometheus warned of a trap, the Korath Graveyard yielded evidence, Admiral Chen was exposed as a traitor, Sarah Chen became an ally, Sanctuary was defended, the Architect Protocol was activated, and the crew traveled 473 years into the future — where they learned The Confluence fell. They returned with encoded future memories and broadcast the first resistance message. Now Bub stands at the edge of the New Titan system, the weight of a 473-year future war in his mind, ready to begin the fight that will topple an empire."
};

// === HELPER FUNCTIONS ===
export function getVitality(abilityScores) {
  return Math.max(1, Math.round(abilityScores?.ath || 50));
}

export function getInitiative(abilityScores) {
  const ath = abilityScores?.ath || 50;
  return Math.floor(ath / 10);
}

export function getHitChance(combatScore, skillLevel) {
  return Math.min(95, Math.max(5, Math.floor(combatScore / 2) + (skillLevel || 0) * 10));
}

export function rollAbilityScores() {
  const scores = {};
  for (const ab of PJ_ABILITIES) {
    let total = 20;
    for (let i = 0; i < 3; i++) total += Math.floor(Math.random() * 20) + 1;
    scores[ab.key] = Math.min(95, Math.max(20, total));
  }
  return scores;
}

export function applyOrigin(scores, origin) {
  if (!origin || !origin.adjustments) return scores;
  const adjusted = { ...scores };
  for (const [key, mod] of Object.entries(origin.adjustments)) {
    adjusted[key] = Math.min(95, Math.max(10, (adjusted[key] || 50) + mod));
  }
  return adjusted;
}