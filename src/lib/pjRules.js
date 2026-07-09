// Pathfinder Journeys: The Auction of Stars — d100 roll-under sci-fi rules.
// Core mechanic: roll d100, success if ≤ ability score (after difficulty modifier).

export const ABILITIES = [
  { key: 'cbt', name: 'Combat', desc: 'Weapons, hand-to-hand, tactical firefights.' },
  { key: 'pil', name: 'Piloting', desc: 'Flying ships, navigation, maneuvering, evasion.' },
  { key: 'eng', name: 'Engineering', desc: 'Repair, modify, hack systems and technology.' },
  { key: 'sci', name: 'Science', desc: 'Research, analysis, medicine, xenobiology.' },
  { key: 'sec', name: 'Security', desc: 'Stealth, infiltration, locks, security systems.' },
  { key: 'cmd', name: 'Command', desc: 'Leadership, tactics, fleet coordination, willpower, courage.' },
  { key: 'com', name: 'Communications', desc: 'Broadcasting, signals, encryption, diplomacy.' },
  { key: 'ath', name: 'Athletics', desc: 'Running, climbing, endurance — your vitality base.' }
];

export const ORIGINS = {
  Human: {
    description: "Versatile and adaptable. Humans channel their drive into any pursuit.",
    adjustment: { chosen: 10 },
    fixedAdjustment: false,
    special: "Adaptable: +10 to any one ability of your choice."
  },
  Vescarri: {
    description: "Alien refugees from a Confluence-harvested world. Resilient survivors with keen survival instincts.",
    adjustment: { sec: 10 },
    fixedAdjustment: true,
    special: "Survival Instincts: +10 Security. Vescarri sense danger and deception."
  },
  Synthetic: {
    description: "An android or AI-construct. Processes logic and systems with machine precision.",
    adjustment: { eng: 10 },
    fixedAdjustment: true,
    special: "Integrated Systems: +10 Engineering. Immune to fear and biological hazards."
  },
  'Frontier Colonist': {
    description: "Born on the harsh edge of colonized space. Tough, resourceful, and self-reliant.",
    adjustment: { ath: 10 },
    fixedAdjustment: true,
    special: "Frontier Hardiness: +10 Athletics (and +10 Vitality)."
  }
};

export const ROLES = {
  Commander: {
    description: "Leads the crew with tactical acumen and courage. Coordinates fleet actions and makes the hard calls.",
    primarySkills: ['Leadership', 'Tactical Analysis', 'Fleet Coordination'],
    kit: {
      credits: 500,
      equipment: [
        { name: 'Laser Pistol', qty: 1 },
        { name: 'Command Override Codes', qty: 1 },
        { name: 'Tactical Vest', qty: 1 },
        { name: 'Commlink', qty: 1 }
      ]
    }
  },
  Pilot: {
    description: "Flies the Pathfinder through hostile space. Master of maneuvering, navigation, and evasion.",
    primarySkills: ['Piloting', 'Navigation', 'Evasion'],
    kit: {
      credits: 400,
      equipment: [
        { name: 'Laser Pistol', qty: 1 },
        { name: 'Flight Suit', qty: 1 },
        { name: 'Nav Computer', qty: 1 },
        { name: 'Commlink', qty: 1 }
      ]
    }
  },
  Engineer: {
    description: "Keeps the Pathfinder running. Repairs, modifies, and hacks systems under fire.",
    primarySkills: ['Engineering', 'Systems Repair', 'Modification'],
    kit: {
      credits: 450,
      equipment: [
        { name: 'Laser Pistol', qty: 1 },
        { name: 'Engineering Toolkit', qty: 1 },
        { name: 'EVA Suit', qty: 1 },
        { name: 'Commlink', qty: 1 }
      ]
    }
  },
  'Science Officer': {
    description: "Analyzes the unknown. Xenobiology, medicine, and research under pressure.",
    primarySkills: ['Science', 'Xenobiology', 'Analysis'],
    kit: {
      credits: 450,
      equipment: [
        { name: 'Stun Baton', qty: 1 },
        { name: 'Scanner', qty: 1 },
        { name: 'Medkit', qty: 1 },
        { name: 'Commlink', qty: 1 }
      ]
    }
  },
  'Security Officer': {
    description: "Protects the crew. Combat, infiltration, and security operations specialist.",
    primarySkills: ['Combat', 'Infiltration', 'Weapons Training'],
    kit: {
      credits: 400,
      equipment: [
        { name: 'Laser Rifle', qty: 1 },
        { name: 'Tactical Vest', qty: 1 },
        { name: 'Combat Knife', qty: 1 },
        { name: 'Commlink', qty: 1 }
      ]
    }
  },
  'Communications Officer': {
    description: "Manages signals, broadcasts, and encryption. The voice of the resistance.",
    primarySkills: ['Communications', 'Encryption', 'Signals Analysis'],
    kit: {
      credits: 450,
      equipment: [
        { name: 'Laser Pistol', qty: 1 },
        { name: 'Portable Comms Array', qty: 1 },
        { name: 'Signal Jammer', qty: 1 },
        { name: 'Commlink', qty: 1 }
      ]
    }
  }
};

export const WEAPONS = {
  'Laser Pistol': { damage: '1d10', type: 'beam', notes: 'Standard sidearm, energy clip' },
  'Laser Rifle': { damage: '2d10', type: 'beam', notes: 'Long arm, energy clip' },
  'Pulse Carbine': { damage: '2d8', type: 'pulse', notes: 'Rapid fire, energy clip' },
  'Plasma Grenade': { damage: '3d10', type: 'thrown', notes: 'Area blast' },
  'Combat Knife': { damage: '1d6', type: 'melee', notes: 'Close quarters' },
  'Stun Baton': { damage: '1d6', type: 'melee', notes: 'Stunning melee weapon' }
};

export const SHIP_STATS = [
  { key: 'hull', name: 'Hull', desc: 'Structural integrity.' },
  { key: 'shields', name: 'Shields', desc: 'Energy shielding.' },
  { key: 'engines', name: 'Engines', desc: 'Sublight propulsion.' },
  { key: 'ftl', name: 'FTL Drive', desc: 'Faster-than-light drive.' },
  { key: 'weapons', name: 'Weapons', desc: 'Offensive systems.' },
  { key: 'sensors', name: 'Sensors', desc: 'Detection and scanning.' },
  { key: 'life_support', name: 'Life Support', desc: 'Atmosphere, gravity, temperature.' },
  { key: 'crew_morale', name: 'Crew Morale', desc: 'Crew spirit and cohesion.' },
  { key: 'fuel', name: 'Fuel/Power', desc: 'Energy reserves.' },
  { key: 'confluence_heat', name: 'Confluence Heat', desc: 'Enemy awareness/tracking level.' }
];

export const SHIP_COMBAT_ZONES = [
  'Long Range', 'Medium Range', 'Close Range', 'Point Blank', 'Escape Vector'
];

export const CAMPAIGN_CLOCKS = [
  { key: 'confluence_claim', name: 'Confluence Claim Clock', desc: 'Countdown from 14 cycles. At 0, Confluence finalizes claim on Earth.', default: 14 },
  { key: 'confluence_heat', name: 'Confluence Heat', desc: '0-100. Rises with conspicuous actions. High = more enemy response.', default: 0 },
  { key: 'chen_exposure', name: 'Chen Exposure', desc: '0-13. Evidence collected against Admiral Chen.', default: 0 },
  { key: 'sanctuary_trust', name: 'Sanctuary Trust', desc: '0-100. Relationship with Sanctuary. Starts suspicious (20).', default: 20 },
  { key: 'resistance_spark', name: 'Resistance Spark', desc: '0-100. Resistance momentum.', default: 0 }
];

export const EVIDENCE_PIECES = [
  'Prometheus Warning',
  'James Stellar Testimony',
  'Korath Database',
  'Novara Transaction Record',
  'Sakura-Chen Technology Exchange',
  'New Titan Claim File',
  'Sarah Chen Testimony',
  'Sanctuary Archive Records',
  'Architect Future-History Data'
];

export const DIFFICULTY_MODIFIERS = [
  { label: 'Trivial', mod: 20 },
  { label: 'Easy', mod: 10 },
  { label: 'Routine', mod: 0 },
  { label: 'Challenging', mod: -10 },
  { label: 'Difficult', mod: -20 },
  { label: 'Very Difficult', mod: -30 },
  { label: 'Formidable', mod: -40 },
  { label: 'Near Impossible', mod: -60 }
];

export const EPISODES = [
  { num: 1, title: 'The Auction of Stars', summary: 'Confluence invitation, Earth claimed, 14 cycles to contest.' },
  { num: 2, title: 'The Prometheus Warning', summary: 'Lost ship warns: "Do not attend. It is a trap."' },
  { num: 3, title: 'The Korath Graveyard', summary: 'Scavenge wreckage, find evidence, encounter Vescarri refugees.' },
  { num: 4, title: 'Coordinates and Consequences', summary: 'Navigator Thorne, choose destination, Chen shadow grows.' },
  { num: 5, title: 'The Novara Exchange', summary: 'Meet Sarah Chen, discover Sakura-Chen technology exchange.' },
  { num: 6, title: 'The Traitor Revealed', summary: 'Admiral Chen exposed, crew mutiny, Sarah Chen guides escape.' },
  { num: 7, title: 'Sanctuary', summary: 'Refugee haven, Sanctuary Council, Vescarri refugees, Mitchell reacts.' },
  { num: 8, title: "The Archive's Secret", summary: 'Shapeshifter infiltrator, Architect Protocol discovered, Confluence fleet arrives.' },
  { num: 9, title: 'The Battle for Sanctuary', summary: 'Large-scale ship battle, Vask offer, activate Architect Protocol.' },
  { num: 10, title: 'Messages Across Time', summary: '473 years in future, Confluence fell, crew votes to return, broadcast resistance, head to New Titan.' }
];

export function rollD100() {
  return Math.floor(Math.random() * 100) + 1;
}

export function rollAbilityScores() {
  const scores = {};
  ABILITIES.forEach((a) => { scores[a.key] = rollD100(); });
  return scores;
}

export function applyOriginAdjustments(scores, origin, chosenAbility) {
  const adj = ORIGINS[origin]?.adjustment || {};
  const out = { ...scores };
  if (ORIGINS[origin]?.fixedAdjustment) {
    Object.entries(adj).forEach(([k, v]) => {
      if (k !== 'chosen') out[k] = Math.min(100, (out[k] || 50) + v);
    });
  } else if (chosenAbility && out[chosenAbility] !== undefined) {
    out[chosenAbility] = Math.min(100, out[chosenAbility] + (adj.chosen || 10));
  }
  return out;
}

// Vitality (HP) = Athletics score (damage capacity).
export function computeVitality(scores) {
  return Math.max(1, Math.round(scores.ath || 50));
}

// Initiative = Athletics / 10 (rounded down).
export function getInitiative(ath) {
  return Math.floor((ath || 50) / 10);
}

// To-hit chance (percentile, roll-under): ability/2 + 10% per skill level.
export function hitChance(abilityScore, skillLevel) {
  return Math.min(95, Math.max(5, Math.floor((abilityScore || 50) / 2) + (skillLevel || 0) * 10));
}

// Evidence strength tier based on number of pieces collected.
export function evidenceStrengthTier(count) {
  if (count >= 13) return 'Undeniable';
  if (count >= 9) return 'Damning';
  if (count >= 6) return 'Strong';
  if (count >= 3) return 'Suspicious';
  return 'Rumor';
}

// Default ship stats for a new campaign (all at 100 except Confluence Heat).
export function defaultShipStats() {
  const stats = {};
  SHIP_STATS.forEach((s) => { stats[s.key] = s.key === 'confluence_heat' ? 0 : 100; });
  return stats;
}

// Default campaign clocks for a new campaign.
export function defaultCampaignClocks() {
  const clocks = {};
  CAMPAIGN_CLOCKS.forEach((c) => { clocks[c.key] = c.default; });
  return clocks;
}