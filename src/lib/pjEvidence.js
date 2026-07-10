// Pathfinder Journeys — Playable Evidence System
// Evidence is a command tool, not lore. It persuades, broadcasts, challenges claims,
// recruits factions, exposes enemies — and triggers consequences when revealed.

// === EVIDENCE STATES ===
export const EVIDENCE_STATES = [
  'UNKNOWN',
  'DISCOVERED',
  'VERIFIED',
  'SHARED_PRIVATELY',
  'PUBLICLY_RELEASED',
  'DISPUTED',
  'WEAPONIZED',
  'SUPPRESSED'
];

export const STATE_META = {
  UNKNOWN: { label: 'Unknown', color: 'text-muted-foreground', dot: 'bg-muted-foreground/40' },
  DISCOVERED: { label: 'Discovered', color: 'text-amber-400', dot: 'bg-amber-500' },
  VERIFIED: { label: 'Verified', color: 'text-emerald-400', dot: 'bg-emerald-500' },
  SHARED_PRIVATELY: { label: 'Shared Privately', color: 'text-sky-400', dot: 'bg-sky-500' },
  PUBLICLY_RELEASED: { label: 'Publicly Released', color: 'text-violet-400', dot: 'bg-violet-500' },
  DISPUTED: { label: 'Disputed', color: 'text-orange-400', dot: 'bg-orange-500' },
  WEAPONIZED: { label: 'Weaponized', color: 'text-red-400', dot: 'bg-red-500' },
  SUPPRESSED: { label: 'Suppressed', color: 'text-slate-400', dot: 'bg-slate-500' }
};

// === CREDIBILITY LEVELS ===
export const CREDIBILITY_LEVELS = ['LOW', 'MEDIUM', 'HIGH', 'IRREFUTABLE'];

export const CREDIBILITY_META = {
  LOW: { label: 'Low', color: 'text-amber-400', desc: 'Rumor, testimony, partial file, unclear source.' },
  MEDIUM: { label: 'Medium', color: 'text-sky-400', desc: 'Strong but contestable proof.' },
  HIGH: { label: 'High', color: 'text-emerald-400', desc: 'Verified records, multiple sources, technical confirmation.' },
  IRREFUTABLE: { label: 'Irrefutable', color: 'text-violet-400', desc: 'Confirmed by multiple independent sources, witnesses, data, and enemy reaction.' }
};

// === EVIDENCE USAGE ACTIONS (buttons on each EvidenceCard) ===
// Each produces a command string sent to the action input for the player to review & send.
export const EVIDENCE_USAGE_ACTIONS = [
  { key: 'show_npc', label: 'Show to NPC', icon: 'MessageCircle', command: (e) => `Show the ${e.label} to the current NPC and gauge their reaction.` },
  { key: 'share_crew', label: 'Share with Crew', icon: 'Users', command: (e) => `Share the ${e.label} with the Pathfinder crew in a briefing.` },
  { key: 'broadcast', label: 'Broadcast Publicly', icon: 'Radio', command: (e) => `Broadcast the ${e.label} publicly to the colonies and all known channels.` },
  { key: 'legal', label: 'Add to Legal Challenge', icon: 'Scale', command: (e) => `Add the ${e.label} to a formal legal challenge against the Confluence claim.` },
  { key: 'clark', label: 'Ask Clark to Verify', icon: 'FlaskConical', command: (e) => `Ask Clark to verify and authenticate the ${e.label}.` },
  { key: 'sarah', label: 'Ask Sarah (Political Read)', icon: 'User', command: (e) => `Ask Sarah Chen for a political read on using the ${e.label}.` },
  { key: 'james', label: 'Ask James (Confluence Context)', icon: 'BookMarked', command: (e) => `Ask James Stellar for Confluence context on the ${e.label}.` },
  { key: 'hayes', label: 'Ask Hayes (Controlled Release)', icon: 'Megaphone', command: (e) => `Ask Hayes to prepare a controlled release plan for the ${e.label}.` }
];

// === EVIDENCE PACKAGE PURPOSES ===
export const EVIDENCE_PACKAGE_PURPOSES = [
  { key: 'persuade_new_titan', label: 'Persuade New Titan', audience: 'Governor Marcus Thorne / New Titan Colonial Council' },
  { key: 'convince_earth_captain', label: 'Convince Earth Captain', audience: 'A loyal Earth Command starship captain' },
  { key: 'broadcast_colonies', label: 'Broadcast to Colonies', audience: 'All human colonies and free stations' },
  { key: 'challenge_claim', label: 'Challenge Confluence Claim', audience: 'Confluence legal adjudication forum' },
  { key: 'recruit_sanctuary', label: 'Recruit Sanctuary Support', audience: 'Sanctuary Council and allied refugee fleet' },
  { key: 'expose_chen', label: 'Expose Admiral Chen', audience: 'Earth Command leadership and political allies' },
  { key: 'inspire_resistance', label: 'Inspire Resistance Cells', audience: 'Underground resistance cells across human space' },
  { key: 'pressure_guild', label: "Pressure Collector's Guild", audience: "A Collector's Guild broker" }
];

// === EVIDENCE COMBOS ===
export const EVIDENCE_COMBOS = [
  {
    items: ['prometheus_warning', 'james_stellar_testimony'],
    label: 'Coerced Consent',
    result: 'Strong proof that The Confluence coerces crews and lies about consent. Hard to dismiss as a single source.'
  },
  {
    items: ['korath_database', 'sanctuary_archive_records'],
    label: 'A Pattern Across Species',
    result: 'Strong proof that The Confluence has repeated its destruction across many species — not an isolated incident.'
  },
  {
    items: ['novara_transaction_record', 'sakura_chen_technology_exchange'],
    label: 'Humanity Sold for Technology',
    result: 'Strong proof that human lives and colonies were traded for Confluence technology.'
  },
  {
    items: ['new_titan_claim_file', 'novara_transaction_record'],
    label: 'New Titan Is Next',
    result: 'Strong proof that New Titan is being processed just as Novara was — the pattern is repeating now.'
  },
  {
    items: ['sarah_chen_testimony', 'sakura_chen_technology_exchange'],
    label: 'The Chen Connection',
    result: 'Strong combined pressure against Admiral Chen and Earth Command — personal testimony plus documented transaction.'
  },
  {
    items: ['architect_future_history_data', 'korath_database'],
    label: 'The Confluence Can Fall',
    result: 'Future-history plus historical precedent: proof that The Confluence has been resisted and can eventually be defeated. Inspires allies, but risks Temporal Instability if revealed too widely.'
  }
];

// === THE EVIDENCE ROSTER (full mechanics per item) ===
export const PJ_EVIDENCE = [
  {
    key: 'prometheus_warning',
    label: 'Prometheus Warning',
    credibility: 'MEDIUM',
    explanation: 'A warning transmission from the lost UES Prometheus — Earth\u2019s first deep-space ship — stating that The Confluence does not negotiate fairly and harvests species through law, coercion, and force.',
    canPersuade: ['Skeptical Earth captains', 'Colonial leaders who trust human sources', 'Crew members who need context'],
    missionUnlocks: ['Locate Prometheus survivor records', 'Search for additional Prometheus transmissions', 'Ask James about Confluence service'],
    clockEffects: [
      { clock: 'public_truth', effect: '+ small', condition: 'when revealed' },
      { clock: 'confluence_heat', effect: '+ small', condition: 'if broadcast publicly' },
      { clock: 'crew_morale', effect: '+ small', condition: 'when shared internally' }
    ],
    risks: 'Earth officials may dismiss it as fake, corrupted, or enemy propaganda. Released publicly without verification, it can raise Earth Command suspicion.',
    suggestedUse: 'Warn skeptical captains and introduce James Stellar\u2019s testimony. Best held privately until verified.',
    combos: ['james_stellar_testimony']
  },
  {
    key: 'james_stellar_testimony',
    label: 'James Stellar Testimony',
    credibility: 'MEDIUM',
    explanation: 'Firsthand testimony from Commander James Stellar — Bub\u2019s grandfather and Prometheus survivor — who was forced into decades of Confluence service. He knows their tactics, legal systems, and the truth of coerced consent.',
    canPersuade: ['Military officers', 'Colonial councils', 'Anyone who needs a human face on the conspiracy'],
    missionUnlocks: ['Confluence enforcement tactics briefing', 'Prometheus crew history', 'Legal precedent research'],
    clockEffects: [
      { clock: 'public_truth', effect: '+ medium', condition: 'when revealed' },
      { clock: 'resistance_spark', effect: '+ medium', condition: 'when revealed' },
      { clock: 'confluence_heat', effect: '+ medium', condition: 'when revealed' },
      { clock: 'sanctuary_trust', effect: '+ small', condition: 'when shared with allies' }
    ],
    risks: 'Enemies can claim James is compromised because he served The Confluence and was augmented. His credibility is attacked, not his facts.',
    suggestedUse: 'Pair with the Prometheus Warning to prove coercion. Use to persuade military officers and explain Confluence tactics.',
    combos: ['prometheus_warning']
  },
  {
    key: 'korath_database',
    label: 'Korath Database',
    credibility: 'MEDIUM',
    explanation: 'Records recovered from the destroyed Korath civilization, proving The Confluence has used legal claims to destroy, relocate, or harvest species for centuries.',
    canPersuade: ['Sanctuary and alien factions', 'Skeptics who need pattern proof', 'Broadcasts targeting non-human audiences'],
    missionUnlocks: ['Dead Civilization Graveyards', 'Search for more Korath records', 'Find anti-Confluence legal precedents'],
    clockEffects: [
      { clock: 'public_truth', effect: '+ medium/high', condition: 'when revealed' },
      { clock: 'resistance_spark', effect: '+ medium', condition: 'when revealed' },
      { clock: 'confluence_heat', effect: '+ medium', condition: 'when revealed' },
      { clock: 'confluence_claim', effect: '- small', condition: 'if used in a legal challenge' }
    ],
    risks: 'Skeptics may call it alien data, mistranslated, or irrelevant to humanity. Needs corroboration to reach HIGH credibility.',
    suggestedUse: 'Pair with Sanctuary Archive Records to prove the pattern spans many species. Use legally to contest the Confluence claim.',
    combos: ['sanctuary_archive_records', 'architect_future_history_data']
  },
  {
    key: 'novara_transaction_record',
    label: 'Novara Transaction Record',
    credibility: 'HIGH',
    explanation: 'A record showing that the lost human colony Novara was sold into Confluence-linked custody — proving human colonies have already been processed and someone connected to Earth facilitated it.',
    canPersuade: ['New Titan leaders', 'Earth captains', 'Resistance cells', 'Anyone who doubts the threat is real'],
    missionUnlocks: ['Search for Novara survivors', "Collector's Guild Routes", 'Investigate who authorized the transaction'],
    clockEffects: [
      { clock: 'public_truth', effect: '+ high', condition: 'when revealed' },
      { clock: 'resistance_spark', effect: '+ high', condition: 'when revealed' },
      { clock: 'confluence_heat', effect: '+ high', condition: 'when revealed' },
      { clock: 'chen_countermeasures', effect: '+ high', condition: 'if Admiral Chen is implicated' }
    ],
    risks: 'Can cause panic, rage, political collapse, or calls for revenge if released without preparation. The Confluence will move aggressively to suppress it.',
    suggestedUse: 'Show privately to New Titan leaders before any public broadcast. Pair with the New Titan Claim File to prove New Titan is next.',
    combos: ['sakura_chen_technology_exchange', 'new_titan_claim_file']
  },
  {
    key: 'sakura_chen_technology_exchange',
    label: 'Sakura-Chen Technology Exchange',
    credibility: 'MEDIUM',
    explanation: 'Evidence that humanity\u2019s advanced propulsion technology was obtained through a hidden bargain with The Confluence — suggesting Earth\u2019s expansion was built on a terrible transaction.',
    canPersuade: ['Political allies', 'Colonial leaders questioning Earth Command', 'Anyone building a case against Admiral Chen'],
    missionUnlocks: ['Investigate Sakura-Chen drive origins', 'Audit Earth Command technology transfers', 'Find hidden Confluence tech backdoors'],
    clockEffects: [
      { clock: 'public_truth', effect: '+ high', condition: 'when revealed' },
      { clock: 'chen_countermeasures', effect: '+ high', condition: 'when revealed' },
      { clock: 'resistance_spark', effect: '+ medium', condition: 'when revealed' }
    ],
    risks: 'May make colonies distrust all Earth technology and leadership. Can fracture Earth Command internally. Chen will counterattack hard.',
    suggestedUse: 'Pair with Sarah Chen\u2019s testimony to pressure Admiral Chen directly. Build corroboration before going public.',
    combos: ['novara_transaction_record', 'sarah_chen_testimony']
  },
  {
    key: 'new_titan_claim_file',
    label: 'New Titan Claim File',
    credibility: 'HIGH',
    explanation: 'A Confluence legal claim file proving New Titan is already being legally processed — not a future threat, but an active one.',
    canPersuade: ['Governor Marcus Thorne', 'New Titan Colonial Council', 'New Titan defense forces'],
    missionUnlocks: ['New Titan council meeting', 'Search for Confluence agents on New Titan', 'Prepare colony defenses'],
    clockEffects: [
      { clock: 'new_titan_stability', effect: '+ if shared carefully', condition: 'private briefing with context' },
      { clock: 'new_titan_stability', effect: '- if dumped publicly', condition: 'released without preparation' },
      { clock: 'public_truth', effect: '+ medium', condition: 'when revealed' },
      { clock: 'confluence_claim', effect: '- small', condition: 'if contested early' },
      { clock: 'confluence_heat', effect: '+ medium', condition: 'when revealed' }
    ],
    risks: 'If released publicly without context, New Titan may panic, surrender, or fracture politically. Timing and framing are critical.',
    suggestedUse: 'Show privately to Governor Thorne and the council first. Pair with the Novara Transaction Record to prove the pattern.',
    combos: ['novara_transaction_record']
  },
  {
    key: 'sarah_chen_testimony',
    label: 'Sarah Chen Testimony',
    credibility: 'MEDIUM',
    explanation: 'Testimony from Sarah Chen — Admiral Chen\u2019s daughter and resistance agent — providing insight into relay traps, her mother\u2019s involvement, Sanctuary, and the hidden resistance.',
    canPersuade: ['People who distrust alien data', 'Earth officers who knew the Chen family', 'Anyone needing a human witness'],
    missionUnlocks: ['Investigate Admiral Chen', 'Contact resistance cells', 'Search for compromised relay networks'],
    clockEffects: [
      { clock: 'public_truth', effect: '+ medium', condition: 'when revealed' },
      { clock: 'resistance_spark', effect: '+ medium', condition: 'when revealed' },
      { clock: 'chen_countermeasures', effect: '+ medium', condition: 'when revealed' },
      { clock: 'crew_morale', effect: '+ small', condition: 'when shared internally' }
    ],
    risks: 'Enemies may call Sarah bitter, unstable, or a traitor to her mother. Her motives will be attacked.',
    suggestedUse: 'Pair with the Sakura-Chen exchange to pressure Admiral Chen. Use to humanize the conspiracy for skeptical audiences.',
    combos: ['sakura_chen_technology_exchange']
  },
  {
    key: 'sanctuary_archive_records',
    label: 'Sanctuary Archive Records',
    credibility: 'HIGH',
    explanation: 'Records from Sanctuary proving many species have suffered under The Confluence — containing legal precedents, resistance history, alien testimony, and survival strategies.',
    canPersuade: ['Alien factions', 'Sanctuary Council', 'Skeptics needing multi-species corroboration'],
    missionUnlocks: ['Sanctuary Fleet missions', 'Dead Civilization Graveyards', 'Architect Sites', 'Alien ally recruitment'],
    clockEffects: [
      { clock: 'sanctuary_trust', effect: '+ if protected', condition: 'used carefully with allies' },
      { clock: 'public_truth', effect: '+ medium', condition: 'when revealed' },
      { clock: 'resistance_spark', effect: '+ medium/high', condition: 'when revealed' },
      { clock: 'confluence_heat', effect: '+ high', condition: 'if exposed publicly' }
    ],
    risks: 'Revealing too much can endanger Sanctuary itself. The Confluence will hunt the source. Refugees may be put at risk.',
    suggestedUse: 'Use to build alien alliances and research legal precedents. Protect Sanctuary\u2019s location at all costs.',
    combos: ['korath_database']
  },
  {
    key: 'architect_future_history_data',
    label: 'Architect Future-History Data',
    credibility: 'LOW',
    explanation: 'Encoded future memories and timeline data from ancient Architect technology — showing a possible future where The Confluence eventually falls. It proves victory is possible, but not how to achieve it perfectly.',
    canPersuade: ['Allies who need hope', 'Crew facing despair', 'Resistance cells needing proof the cause can win'],
    missionUnlocks: ['Architect Sites', 'Future-memory events', 'Temporal anomaly investigations', 'Future Unity threads (later)'],
    clockEffects: [
      { clock: 'resistance_spark', effect: '+ high', condition: 'if revealed carefully' },
      { clock: 'temporal_instability', effect: '+', condition: 'if overused' },
      { clock: 'crew_morale', effect: '+ medium', condition: 'when shared internally' },
      { clock: 'confluence_heat', effect: '+ high', condition: 'if The Confluence detects it' }
    ],
    risks: 'Too much future knowledge can create paradox, disbelief, or dangerous overconfidence. The Confluence detecting it raises Heat sharply.',
    suggestedUse: 'Reveal carefully to inspire key allies. Avoid broadcasting widely. Watch Temporal Instability.',
    combos: ['korath_database']
  }
];

// === HELPER FUNCTIONS ===
export function findEvidenceItem(key) {
  return PJ_EVIDENCE.find((e) => e.key === key);
}

export function isEvidenceVisible(campaign, evidence) {
  // All Arc-1 evidence is possessed at campaign start (post-Arc 1).
  // Future evidence items could gate on discovery flags.
  return true;
}

export function getEvidenceStatus(campaign, key) {
  const states = campaign?.world_state?.evidence_states || {};
  const st = states[key];
  if (st && typeof st.state === 'string' && EVIDENCE_STATES.includes(st.state)) return st.state;
  // Arc-1 evidence defaults to DISCOVERED
  return 'DISCOVERED';
}

export function isEvidenceDiscovered(campaign, key) {
  const status = getEvidenceStatus(campaign, key);
  return status !== 'UNKNOWN';
}

export function getEvidenceCredibility(campaign, key) {
  const states = campaign?.world_state?.evidence_states || {};
  const st = states[key];
  if (st && typeof st.credibility === 'string' && CREDIBILITY_LEVELS.includes(st.credibility)) return st.credibility;
  const item = findEvidenceItem(key);
  return item?.credibility || 'MEDIUM';
}

export function getEvidenceShownTo(campaign, key) {
  const states = campaign?.world_state?.evidence_states || {};
  const st = states[key];
  return Array.isArray(st?.shown_to) ? st.shown_to : [];
}

export function getEvidenceStateObject(campaign, key) {
  const states = campaign?.world_state?.evidence_states || {};
  return states[key] || null;
}

// Find any combo that applies to a set of evidence keys
export function findCombosForKeys(keys) {
  if (!Array.isArray(keys) || keys.length < 2) return [];
  return EVIDENCE_COMBOS.filter((combo) => combo.items.every((k) => keys.includes(k)));
}