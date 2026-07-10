// Pathfinder Journeys — Living Ally System
// Ally relationship states, Sanctuary Fleet ships, internal factions, and helpers.

export const ALLY_STATES = [
  { key: 'LOYAL', label: 'Loyal', desc: 'Will stand with Bub unless he commits a major betrayal.', tone: 'text-emerald-400', bar: 'bg-emerald-600' },
  { key: 'TRUSTED', label: 'Trusted', desc: 'Strong ally, but still has limits.', tone: 'text-green-400', bar: 'bg-green-600' },
  { key: 'CAUTIOUS', label: 'Cautious', desc: 'Helpful, but not fully convinced.', tone: 'text-amber-400', bar: 'bg-amber-600' },
  { key: 'CONDITIONAL', label: 'Conditional', desc: 'Will help only if their own people or interests are protected.', tone: 'text-yellow-400', bar: 'bg-yellow-600' },
  { key: 'STRAINED', label: 'Strained', desc: 'Relationship damaged. May refuse aid.', tone: 'text-orange-400', bar: 'bg-orange-600' },
  { key: 'FRACTURING', label: 'Fracturing', desc: 'Ally may leave, split, or oppose Bub soon.', tone: 'text-red-400', bar: 'bg-red-600' },
  { key: 'LOST', label: 'Lost', desc: 'Ally has withdrawn support.', tone: 'text-red-500', bar: 'bg-red-800' },
  { key: 'BETRAYED', label: 'Betrayed', desc: 'Ally believes Bub used, abandoned, or deceived them.', tone: 'text-red-600', bar: 'bg-red-900' },
  { key: 'RIVAL_ALLY', label: 'Rival Ally', desc: "Still on the same side, but challenges Bub's leadership.", tone: 'text-purple-400', bar: 'bg-purple-600' }
];

export const ALLY_STATE_MAP = ALLY_STATES.reduce((acc, s) => { acc[s.key] = s; return acc; }, {});

export const SANCTUARY_SHIPS = [
  { name: 'The Defiance', role: 'Sanctuary command vessel / heavy defensive ship', commander: 'Vex', personality: 'Military, scarred, practical', use: 'Fleet defense, last-stand actions, tactical planning' },
  { name: 'The Gentle Vast', role: 'Civilian refugee carrier', commander: 'Elder Maari of the Vellan', personality: 'Protective, pacifist, terrified of combat', use: 'Evacuation, moral pressure, civilian stakes' },
  { name: 'The Glass Horizon', role: 'Quellan archive ship', commander: 'Scholar-Envoy Terev', personality: 'Diplomatic, cautious, record-obsessed', use: 'Evidence research, legal precedent, alien history' },
  { name: 'The Emberwake', role: 'Fast strike ship', commander: "Kesh'tar", personality: 'Aggressive, eager to hit The Confluence', use: 'Raids, scouting, risky attacks' },
  { name: 'The Quiet Mercy', role: 'Hospital ship', commander: 'Dr. Sovaal', personality: 'Compassionate, politically neutral', use: 'Medical care, moral dilemmas, triage missions' },
  { name: 'The Broken Crown', role: 'Former royal vessel from a conquered species', commander: 'Princess-Regent Vael', personality: 'Proud, bitter, anti-Confluence', use: 'Political tension, elite refugees, revenge missions' },
  { name: 'The Many Lanterns', role: 'Family colony ship', commander: 'Rotating civilian council', personality: 'Democratic, anxious, slow to decide', use: 'Votes, refugee disputes, civilian needs' },
  { name: 'The Knife of Dawn', role: 'Stealth/scout ship', commander: 'Rill, a former Confluence escapee', personality: 'Paranoid, useful, hard to trust', use: 'Recon, smuggling, secret routes' }
];

export const SANCTUARY_INTERNAL_FACTIONS = [
  { name: 'The Cautious', desc: 'Want to hide, survive, avoid open war. Led by Verath.' },
  { name: 'The Fighters', desc: 'Want revenge and believe Bub is the first real chance in centuries. Led by Vex and Kesh\'tar.' },
  { name: 'The Civilians', desc: 'Want food, safety, medicine, and no more dead children. Led by Elder Maari.' },
  { name: 'The Archivists', desc: 'Want proof preserved and truth released carefully. Led by Terev.' },
  { name: 'The Bitter', desc: 'Believe humanity is late to a war other species have already suffered through. May resent Bub receiving so much attention.' },
  { name: 'The Hopeful', desc: 'Young refugees inspired by Bub. May volunteer recklessly.' }
];

export const ALLY_NEEDS = {
  sarah_chen: 'Truth about her mother, trust, and Chen answers',
  james_stellar: 'Maintenance, purpose, forgiveness, and not being used as a weapon',
  mitchell: 'Respect, protection, freedom, and trust in his warnings',
  councilor_verath: 'Civilian safety, secrecy, and diplomacy',
  commander_vex: 'Strategy, discipline, and military clarity',
  sanctuary_refugee_fleet: 'Food, fuel, safety, and hope',
  '37_allied_ships': 'Repairs, assignments, morale, and leadership'
};

export function getAllyState(campaign, key) {
  const states = campaign?.world_state?.ally_states || {};
  const data = states[key];
  if (!data) return null;
  const stateKey = data.state || 'CAUTIOUS';
  return {
    ...data,
    stateKey,
    stateInfo: ALLY_STATE_MAP[stateKey] || ALLY_STATE_MAP['CAUTIOUS'],
    relationship: typeof data.relationship === 'number' ? data.relationship : 0
  };
}

export function getAllyRelationship(campaign, key) {
  const states = campaign?.world_state?.ally_states || {};
  const data = states[key];
  return typeof data?.relationship === 'number' ? data.relationship : null;
}

export function getAllyNeed(campaign, key) {
  const states = campaign?.world_state?.ally_states || {};
  const data = states[key];
  if (data?.need) return data.need;
  return ALLY_NEEDS[key] || null;
}

export function getAllyLastAction(campaign, key) {
  const states = campaign?.world_state?.ally_states || {};
  return states[key]?.last_action || null;
}

export function isAllyVisible(campaign, ally) {
  if (!ally) return false;
  if (ally.locked) return false;
  return true;
}