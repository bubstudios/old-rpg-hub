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

// === RELATIONSHIP BANDS (-100 to +100) ===
// The authoritative tier system. Hostility is RARE — allies pass through
// strain → withdraw → rival before becoming hostile, and only after major betrayal.
export const ALLY_RELATIONSHIP_BANDS = [
  { min: 80, max: 100, tier: 'DEVOTED', label: 'Devoted / Fully Loyal', tone: 'text-emerald-400', bar: 'bg-emerald-600', desc: 'Will stand with Bub through almost anything.' },
  { min: 60, max: 79, tier: 'TRUSTED', label: 'Trusted Ally', tone: 'text-green-400', bar: 'bg-green-600', desc: 'Strong ally, but still has limits.' },
  { min: 40, max: 59, tier: 'CAUTIOUS', label: 'Cautious Ally', tone: 'text-amber-400', bar: 'bg-amber-600', desc: 'Helpful, not fully convinced.' },
  { min: 20, max: 39, tier: 'STRAINED', label: 'Strained Ally', tone: 'text-orange-400', bar: 'bg-orange-600', desc: 'Relationship damaged. May refuse aid or argue.' },
  { min: 1, max: 19, tier: 'FRACTURING', label: 'Fracturing', tone: 'text-red-400', bar: 'bg-red-500', desc: 'May leave, split, or become a rival soon. Can still be repaired.' },
  { min: -25, max: 0, tier: 'WITHDRAWN', label: 'Withdrawn Support', tone: 'text-red-500', bar: 'bg-red-700', desc: 'Has pulled back aid. NOT hostile — can be won back.' },
  { min: -60, max: -26, tier: 'RIVAL', label: 'Rival / Opposed', tone: 'text-purple-400', bar: 'bg-purple-600', desc: 'Same side, but actively opposes Bub\'s leadership.' },
  { min: -100, max: -61, tier: 'HOSTILE', label: 'Hostile or Betrayed', tone: 'text-red-600', bar: 'bg-red-900', desc: 'Rare. Only after repeated major betrayal. Now an enemy.' }
];

export function getAllyRelationshipBand(score) {
  const s = typeof score === 'number' ? score : 0;
  return ALLY_RELATIONSHIP_BANDS.find((b) => s >= b.min && s <= b.max) || ALLY_RELATIONSHIP_BANDS[2];
}

// === RELATIONSHIP TRIGGERS (what shifts ally scores) ===
export const ALLY_TRIGGERS = [
  { key: 'civilian_lives', label: 'Civilian Lives', desc: 'Civilian casualties, abandoned colonies, or protected populations endangered.' },
  { key: 'refugee_safety', label: 'Refugee Safety', desc: 'Risking the Sanctuary Fleet or nonhuman refugees for human goals.' },
  { key: 'truth_vs_secrecy', label: 'Truth vs Secrecy', desc: 'Burying evidence, hiding the Confluence threat, or releasing truth carelessly.' },
  { key: 'evidence_use', label: 'Use of Evidence', desc: 'How and when evidence is revealed — privately, publicly, or weaponized.' },
  { key: 'reckless_sacrifice', label: 'Reckless Sacrifice', desc: 'Throwing away ships, crew, or allies for symbolic or emotional reasons.' },
  { key: 'alien_allies', label: 'Treatment of Alien Allies', desc: 'Prioritizing human lives over nonhuman lives, or disrespecting alien culture.' },
  { key: 'trust_in_unity', label: 'Trust in Unity', desc: 'Treating Unity as a tool, prison, or monster — or as a friend with boundaries.' },
  { key: 'future_memories', label: 'Use of Future Memories', desc: 'Overusing future knowledge or Architect technology, raising Temporal Instability.' },
  { key: 'sanctuary_fleet', label: 'Protection of the Sanctuary Fleet', desc: 'Exposing, spending, or neglecting the refugee fleet.' },
  { key: 'admiral_chen', label: 'Handling of Admiral Chen', desc: 'How Bub pursues, exposes, or forgives Chen — and whether Sarah is included.' },
  { key: 'crew_treatment', label: 'Treatment of James, Sarah, Mitchell & Crew', desc: 'Whether Bub treats his people as family or as tools.' }
];

// === UNIQUE BREAKING POINTS PER ALLY ===
export const ALLY_BREAKING_POINTS = {
  sarah_chen: {
    damagedBy: ['Hiding Chen-related evidence from her', 'Using her as bait', 'Publicly humiliating her mother without proof', 'Leaving captives behind for convenience'],
    strengthenedBy: ['Letting Sarah participate in Chen decisions', 'Honesty', 'Rescuing prisoners', 'Treating her as more than "Chen\'s daughter"'],
    breakingPoint: 'Repeatedly hiding Chen truth or using her as a political weapon pushes her toward Withdrawn/Rival. Hostility is rare — she is family.'
  },
  james_stellar: {
    damagedBy: ['Treating him like a Confluence weapon', 'Forcing augmentations recklessly', 'Ignoring his trauma', 'Dismissing his guilt'],
    strengthenedBy: ['Treating him as family', 'Being asked, not ordered', 'Honesty about his augmentations', 'Protecting him from exploitation'],
    breakingPoint: 'Being used as a tool repeatedly pushes him toward Withdrawn. Full hostility is extremely rare — he is Bub\'s grandfather.'
  },
  mitchell: {
    damagedBy: ['Treating him like equipment', 'Ignoring repeated warnings', 'Letting others study him without consent', 'Forcing him away from James/Carmelon in crises'],
    strengthenedBy: ['Trusting his warnings', 'Treating him as crew', 'Letting Carmelon interpret him', 'Protecting his autonomy'],
    breakingPoint: 'Repeated dismissal or exploitation pushes him toward Withdrawn — he may leave the room and refuse to help rather than turn hostile.'
  },
  councilor_verath: {
    damagedBy: ['Reckless risks to refugees', 'Rushing to war', 'Treating Sanctuary as Bub\'s fleet', 'Publicly shaming him for caution'],
    strengthenedBy: ['Protecting Sanctuary civilians', 'Respecting council process', 'Patient diplomacy', 'Using evidence carefully'],
    breakingPoint: 'Refugee deaths through recklessness pushes him toward Withdrawn/Rival — he may pull Sanctuary ships home rather than fight.'
  },
  commander_vex: {
    damagedBy: ['Vague speeches instead of strategy', 'Bad tactics', 'Lying about risks', 'Wasting ships for symbolism'],
    strengthenedBy: ['Clear strategy', 'Military competence', 'Accepting his warnings', 'Protecting his ships'],
    breakingPoint: 'Repeated tactical incompetence or wasted ships pushes him toward Rival — he may refuse to commit forces or challenge Bub\'s command.'
  },
  sanctuary_refugee_fleet: {
    damagedBy: ['Unnecessary losses', 'Exposing their location', 'Using them as shields', 'Prioritizing humans over aliens every time'],
    strengthenedBy: ['Supplies and repairs', 'Protection', 'Victories', 'Respect and consent before risky ops'],
    breakingPoint: 'Heavy refugee losses or betrayal pushes ships toward Withdrawn — they split, leave, or refuse orders. Individual ships may depart.'
  },
  '37_allied_ships': {
    damagedBy: ['Unnecessary losses', 'No repairs or supplies', 'Ignoring morale', 'Symbolic sacrifice'],
    strengthenedBy: ['Clear assignments', 'Repairs and fuel', 'Victories', 'Leadership and reassurance'],
    breakingPoint: 'Individual ships may leave the fleet if morale collapses or they feel used.'
  },
  unity: {
    damagedBy: ['Treating her as a tool', 'Treating her as a prison or monster', 'Violating her boundaries', 'Forcing her use without consent'],
    strengthenedBy: ['Trust', 'Clear boundaries', 'Consent', 'Friendship and respect'],
    breakingPoint: 'Repeated exploitation or dehumanization pushes her toward Withdrawn/Rival — she may refuse to cooperate or act independently.'
  }
};

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
  '37_allied_ships': 'Repairs, assignments, morale, and leadership',
  unity: 'Trust, boundaries, consent, and friendship'
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