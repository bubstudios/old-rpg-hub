// Pathfinder Journeys — Operations System
// Evidence wins arguments. Operations win the war.
// Bub commands missions: covert ops, recon, rescue, counterintelligence,
// exploration, ship maneuvers, sabotage prevention, and undercover work.

import { PJ_EVIDENCE } from '@/lib/pjEvidence';
import { ARC3_OPERATIONS } from '@/lib/pjArc3';

// === CREW CAPABILITIES ===
// Each crew member's specialties for operation assignment.
export const CREW_CAPABILITIES = {
  sarah:    { name: 'Sarah Chen',     role: 'Resistance Agent',     specialties: ['Chen protocols', 'relay compromise', 'political family knowledge', 'undercover comms'] },
  james:    { name: 'James Stellar',  role: 'Confluence Survivor',  specialties: ['Confluence procedure', 'survivor testimony', 'enemy pattern recognition'] },
  clark:    { name: 'Clark',          role: 'Science Officer',      specialties: ['evidence authentication', 'legal framing', 'interrogation', 'chain of custody'] },
  mitchell: { name: 'Mitchell',       role: 'Security',             specialties: ['ambush detection', 'shapeshifter suspicion', 'intimidation', 'danger sense'] },
  thorne:   { name: 'Farah Thorne',  role: 'Tactical/Security',     specialties: ['New Titan politics', 'colony trust', 'civilian stakes', 'family connection'] },
  hayes:    { name: 'Hayes',          role: 'Engineering',          specialties: ['reactor systems', 'tactical repairs', 'sensor packages', 'broadcast capability'] },
  reeves:   { name: 'Reeves',         role: 'Pilot',               specialties: ['investigation', 'records', 'inconsistencies', 'quiet questioning'] },
  carmelon: { name: 'Carmelon',       role: 'Xenohistorian',        specialties: ['temporal anomalies', 'Architect technology', 'future-memory interpretation'] },
  ramos:    { name: 'Ramos',          role: 'Chief Engineer',       specialties: ['ship systems', 'damage control', 'technical recovery'] },
  patel:    { name: 'Patel',          role: 'Junior Engineer',      specialties: ['comms', 'signal traces', 'overlooked details', 'New Titan native'] },
  voss:     { name: 'Voss',           role: 'Medical',             specialties: ['biological irregularities', 'behavior mismatches', 'crew health'] },
  kim:      { name: 'Rebecca Kim',    role: 'Scanner Tech',        specialties: ['kimelon scanner', 'biotech analysis', 'sensor systems', 'Kepler Station tech'] },
  martinez: { name: 'Chief Martinez', role: 'Security',            specialties: ['undercover ops', 'surveillance', 'station infiltration'] },
  torres:   { name: 'Lt. Torres',     role: 'Tactical',            specialties: ['combat', 'boarding', 'security ops'] }
};

export const CREW_KEYS = Object.keys(CREW_CAPABILITIES);

// === OPERATION TYPES ===
export const OPERATION_TYPES = [
  { key: 'covert',              label: 'Covert Operation',      desc: 'Stealth missions behind enemy lines' },
  { key: 'recon',               label: 'Reconnaissance',         desc: 'Gather intelligence, secure locations' },
  { key: 'rescue',              label: 'Rescue Operation',        desc: 'Recover captives, extract allies' },
  { key: 'evidence_recovery',   label: 'Evidence Recovery',       desc: 'Find and secure physical proof' },
  { key: 'counterintel',        label: 'Counterintelligence',    desc: 'Counter enemy infiltration and sabotage' },
  { key: 'exploration',         label: 'Exploration',             desc: 'Discover new locations and resources' },
  { key: 'diplomatic',          label: 'Diplomatic Mission',     desc: 'Negotiate, persuade, build alliances' },
  { key: 'ship_maneuver',       label: 'Ship Maneuver',          desc: 'Position, deploy, or reposition forces' },
  { key: 'sabotage_prevention', label: 'Sabotage Prevention',     desc: 'Protect assets from enemy action' },
  { key: 'undercover',          label: 'Undercover Contact',      desc: 'Infiltrate under false identity' }
];

export function getOperationType(typeKey) {
  return OPERATION_TYPES.find(t => t.key === typeKey) || OPERATION_TYPES[0];
}

// === AVAILABLE OPERATIONS ===
// Story-driven mission options for the New Titan arc.
export const AVAILABLE_OPERATIONS = [
  {
    id: 'secure_rendezvous',
    title: 'Secure the Off-World Rendezvous',
    type: 'recon',
    location: 'Off-World Rendezvous Point',
    objective: "Ensure New Titan's face-to-face meeting is not an ambush, surveillance trap, or political setup.",
    recommendedCrew: ['mitchell', 'thorne', 'hayes'],
    approaches: [
      'Send Mitchell ahead quietly for a full security sweep',
      'Place a Sanctuary ship in silent overwatch',
      'Use a decoy shuttle for the approach',
      'Bring physical evidence only — no digital transmissions',
      'Jam all outgoing signals during the meeting'
    ],
    risks: ['ambush', 'infiltration', 'signal trace', 'civilian panic'],
    rewards: ['safe meeting', 'hidden transmitter found', 'enemy plan exposed'],
    clocksAffected: ['new_titan_stability', 'confluence_heat', 'crew_morale']
  },
  {
    id: 'trace_signal_leak',
    title: 'Trace the Signal Leak',
    type: 'counterintel',
    location: 'Pathfinder Comms Systems',
    objective: 'Find out how much the Confluence and Chen intercepted of the evidence transmission, and identify the compromised relay.',
    recommendedCrew: ['sarah', 'reeves', 'patel'],
    approaches: [
      'Have Patel trace the relay handshake back to its source',
      'Ask Sarah to check for Chen-linked protocol signatures',
      'Send Reeves to audit the transmission logs quietly',
      'Plant a false signal to see who picks it up'
    ],
    risks: ['chen_countermeasures escalation', 'false trail', 'confluence_heat'],
    rewards: ['identify compromised relay', 'unlock safer evidence channel', 'expose forged Chen advisory'],
    clocksAffected: ['chen_countermeasures', 'confluence_heat', 'public_truth']
  },
  {
    id: 'verify_new_titan_claim',
    title: 'Verify New Titan Claim File Locally',
    type: 'evidence_recovery',
    location: 'New Titan Colonial Archives',
    objective: 'Cross-reference the Confluence claim file against New Titan colonial records to find discrepancies or forged language.',
    recommendedCrew: ['clark', 'reeves', 'patel'],
    approaches: [
      'Send Clark to authenticate the claim file against colonial records',
      'Have Reeves quietly audit New Titan legal archives',
      'Ask Patel to pull records from his family contacts on the surface',
      'Request Governor Thorne grant formal archive access'
    ],
    risks: ['chen_countermeasures', 'political exposure', 'records tampered'],
    rewards: ['prove claim is fraudulent', 'identify Chen-linked intermediary', 'unlock legal challenge option'],
    clocksAffected: ['new_titan_stability', 'public_truth', 'chen_countermeasures']
  },
  {
    id: 'investigate_discredit_campaign',
    title: "Investigate Chen's Discredit Campaign",
    type: 'counterintel',
    location: 'Earth Command Comms Network',
    objective: 'Find out what Chen is broadcasting to discredit the Pathfinder and who is receiving it.',
    recommendedCrew: ['sarah', 'reeves', 'patel'],
    approaches: [
      'Ask Sarah to monitor Chen-authenticated channels for forged advisories',
      'Send Reeves to trace where the discredit broadcasts are landing',
      'Have Patel intercept relay fragments from the outer network',
      'Plant a counter-narrative through back channels'
    ],
    risks: ['chen_countermeasures escalation', 'false trail', 'infiltration'],
    rewards: ['expose forged advisory', 'identify who had EarthGov access', 'reduce discredit_campaign'],
    clocksAffected: ['chen_countermeasures', 'public_truth', 'crew_morale']
  },
  {
    id: 'sanctuary_silent_overwatch',
    title: 'Move Sanctuary Ships to Silent Overwatch',
    type: 'ship_maneuver',
    location: 'Near New Titan System',
    objective: 'Position Sanctuary Fleet ships near the rendezvous point to provide emergency support without being detected.',
    recommendedCrew: ['thorne', 'hayes', 'ramos'],
    approaches: [
      'Ask Commander Vex to position the Defiance at maximum sensor range',
      'Have Ramos minimize engine signatures on all ships',
      'Use the debris field as natural cover',
      'Keep only a small strike team ready, rest of fleet further back'
    ],
    risks: ['fleet exposure', 'refugee panic', 'confluence_heat'],
    rewards: ['emergency extraction capability', 'deter ambush', 'sanctuary_trust boost'],
    clocksAffected: ['sanctuary_trust', 'confluence_heat', 'crew_morale']
  },
  {
    id: 'audit_new_titan_records',
    title: 'Audit New Titan Records',
    type: 'undercover',
    location: 'New Titan Surface Control',
    objective: 'Send a crew member undercover as a technical auditor to find evidence of Confluence legal infiltration in New Titan government.',
    recommendedCrew: ['reeves', 'patel', 'voss'],
    approaches: [
      'Reeves poses as a technical auditor from Earth Command',
      'Patel uses family connections to access colonial records directly',
      'Voss screens staff for biological irregularities during the audit',
      'Send a quiet probe through the legal system without anyone knowing'
    ],
    risks: ['cover blown', 'chen_countermeasures', 'aide compromised'],
    rewards: ['find altered records', 'identify compromised aide', 'trace Chen influence'],
    clocksAffected: ['new_titan_stability', 'chen_countermeasures', 'public_truth']
  },
  {
    id: 'analyze_chen_protocols',
    title: 'Analyze Chen Protocols',
    type: 'counterintel',
    location: 'Pathfinder Bridge',
    objective: "Have Sarah analyze whether Chen's transmissions were real orders or spoofed by the Confluence.",
    recommendedCrew: ['sarah', 'clark', 'patel'],
    approaches: [
      'Sarah enters a Chen-authenticated channel under an old protocol',
      'Clark cross-references the protocol format against EarthGov standards',
      'Patel traces the authentication handshake',
      'Compare against known Confluence forgery patterns from James'
    ],
    risks: ['chen_countermeasures', 'false trail', 'sarah emotional strain'],
    rewards: ['determine if Chen is compromised or complicit', 'identify forged advisory', 'unlock counter-narrative'],
    clocksAffected: ['chen_countermeasures', 'public_truth', 'crew_morale']
  },
  {
    id: 'sweep_infiltration',
    title: 'Sweep for Infiltration',
    type: 'sabotage_prevention',
    location: 'Pathfinder & Sanctuary Fleet',
    objective: 'Have Mitchell scan for shapeshifter infiltration risk across the Pathfinder and key Sanctuary personnel.',
    recommendedCrew: ['mitchell', 'voss', 'clark'],
    approaches: [
      'Mitchell observes body language during the next diplomatic meeting',
      'Sequential biometric scans on all bridge crew over 24 hours',
      'Voss screens for biological irregularities in medical records',
      'Questions only the real person would answer correctly'
    ],
    risks: ['crew trust damaged', 'shapeshifter alert', 'false accusation'],
    rewards: ['identify infiltrator', 'prevent sabotage', 'crew_morale boost'],
    clocksAffected: ['crew_morale', 'chen_countermeasures', 'sanctuary_trust']
  },
  {
    id: 'explore_dead_relay_buoy',
    title: 'Explore the Dead Relay Buoy',
    type: 'exploration',
    location: 'Near Rendezvous Path',
    objective: 'Investigate a silent buoy showing signs of recent wake-up activity near the rendezvous path.',
    recommendedCrew: ['mitchell', 'clark', 'hayes'],
    approaches: [
      'Send a probe drone first to scan for traps',
      'Mitchell goes personally — his senses can detect wrongness',
      'Have Clark analyze any data fragments remotely',
      'Hayes hides a sensor package inside the buoy'
    ],
    risks: ['ambush', 'signal trace', 'Confluence technology'],
    rewards: ['find Confluence listener node', 'Chen-authenticated packet fragment', 'false evidence seed'],
    clocksAffected: ['confluence_heat', 'crew_morale', 'chen_countermeasures']
  },
  {
    id: 'recover_courier_proof',
    title: 'Recover Physical Proof from Derelict Courier',
    type: 'evidence_recovery',
    location: 'Abandoned Confluence Courier',
    objective: 'Board a derelict Confluence courier ship and recover any physical evidence of legal processing or harvest operations.',
    recommendedCrew: ['james', 'mitchell', 'clark', 'ramos'],
    approaches: [
      'James leads — he knows Confluence ship layouts and security',
      'Mitchell goes first to detect ambush or traps',
      'Clark handles evidence recovery and chain of custody',
      'Ramos handles ship systems and technical recovery'
    ],
    risks: ['Confluence technology', 'traps', 'shapeshifter remnants'],
    rewards: ['physical proof of harvest', 'Confluence enforcement records', 'ship design intelligence'],
    clocksAffected: ['confluence_heat', 'public_truth', 'crew_morale']
  },
  {
    id: 'plant_false_signal',
    title: 'Plant a False Signal',
    type: 'covert',
    location: 'Compromised Comms Node',
    objective: 'Feed false coordinates through the compromised relay to mislead the Confluence about Pathfinder intentions.',
    recommendedCrew: ['sarah', 'patel', 'hayes'],
    approaches: [
      'Sarah crafts a convincing Chen-authenticated false advisory',
      'Patel plants it through the compromised relay handshake',
      'Hayes broadcasts a decoy distress signal on a different vector',
      'Use the false signal to trace who acts on it'
    ],
    risks: ['chen_countermeasures', 'false trail backfires', 'confluence_heat'],
    rewards: ['mislead enemy', 'identify who acts on forged data', 'buy time'],
    clocksAffected: ['chen_countermeasures', 'confluence_heat', 'public_truth']
  },
  {
    id: 'shadow_confluence_courier',
    title: 'Shadow the Confluence Courier',
    type: 'covert',
    location: 'Confluence Space Border',
    objective: 'Follow a Confluence courier vessel to learn where enemy communications and orders are being routed.',
    recommendedCrew: ['reeves', 'mitchell', 'james'],
    approaches: [
      'Reeves shadows at extreme range using debris cover',
      'Mitchell tracks the courier through hyperspace residue',
      'James identifies the courier type and likely destination',
      'Use a Sanctuary scout ship instead of the Pathfinder'
    ],
    risks: ['detection', 'confluence_heat', 'trap'],
    rewards: ['map enemy comms network', 'find Vask location', 'identify Confluence base'],
    clocksAffected: ['confluence_heat', 'crew_morale', 'chen_countermeasures']
  },
  {
    id: 'screen_delegation',
    title: 'Screen the Rendezvous Delegation',
    type: 'counterintel',
    location: 'Off-World Rendezvous Point',
    objective: 'Verify the identities of the New Titan delegation before the meeting — ensure none have been replaced by shapeshifters.',
    recommendedCrew: ['mitchell', 'voss', 'thorne'],
    approaches: [
      'Mitchell watches body language as they arrive',
      'Voss requests medical scans as a "health protocol"',
      'Thorne verifies identities through personal knowledge of New Titan officials',
      'Ask questions only the real delegation would know'
    ],
    risks: ['diplomatic offense', 'shapeshifter alert', 'trust damaged'],
    rewards: ['confirm delegation is clean', 'detect infiltrator', 'safe meeting'],
    clocksAffected: ['new_titan_stability', 'crew_morale', 'chen_countermeasures']
  },
  {
    id: 'explore_abandoned_courier',
    title: 'Explore the Abandoned Confluence Courier',
    type: 'exploration',
    location: 'Derelict Confluence Vessel',
    objective: 'Search the derelict for Confluence technology, records, or signs of shapeshifter movement.',
    recommendedCrew: ['james', 'clark', 'carmelon', 'ramos'],
    approaches: [
      'James recognizes the ship class and knows where to look',
      'Clark recovers data cores and physical evidence',
      'Carmelon analyzes any alien or temporal technology',
      'Ramos handles ship power and technical access'
    ],
    risks: ['Confluence technology', 'shapeshifter remnants', 'traps'],
    rewards: ['Confluence enforcement records', 'signs of prior harvest', 'clues about the Harvester'],
    clocksAffected: ['confluence_heat', 'public_truth', 'crew_morale']
  },
  {
    id: 'build_evidence_chain',
    title: 'Build Clean Evidence Chain of Custody',
    type: 'evidence_recovery',
    location: 'Pathfinder Science Lab',
    objective: 'Have Clark assemble a legally defensible chain of custody for all evidence, making it harder for the Confluence to dismiss.',
    recommendedCrew: ['clark', 'sarah', 'james'],
    approaches: [
      'Clark documents authentication and verification steps',
      'Sarah provides political context for each piece',
      'James provides Confluence procedure context',
      'Prepare a physical evidence courier for the rendezvous'
    ],
    risks: ['time pressure', 'evidence tampering', 'chen_countermeasures'],
    rewards: ['evidence harder to dismiss', 'stronger legal challenge', 'unlock physical courier option'],
    clocksAffected: ['public_truth', 'chen_countermeasures', 'crew_morale']
  },
  {
    id: 'diplomatic_thorne',
    title: 'Diplomatic Outreach to Governor Thorne',
    type: 'diplomatic',
    location: 'New Titan Surface Control',
    objective: 'Use Farah Thorne family connection to build trust with Governor Marcus Thorne and prepare him for the truth.',
    recommendedCrew: ['thorne', 'sarah', 'clark'],
    approaches: [
      'Farah contacts her father privately through family channels',
      'Sarah provides the evidence personally to build credibility',
      'Clark prepares a formal briefing packet',
      'Request a formal colonial council session'
    ],
    risks: ['political exposure', 'chen_countermeasures', 'emotional conflict'],
    rewards: ['Governor Thorne convinced', 'New Titan prepares to resist', 'colonial council support'],
    clocksAffected: ['new_titan_stability', 'public_truth', 'crew_morale']
  },
  ...ARC3_OPERATIONS
];

// === FORMATTER ===
// Produces the structured command string sent to the GM when an operation is authorized.
export function formatOperationCommand(operation, selectedTeam, selectedApproach, selectedEvidence) {
  const typeInfo = getOperationType(operation.type);
  const teamNames = (selectedTeam && selectedTeam.length > 0)
    ? selectedTeam.map(key => CREW_CAPABILITIES[key]?.name || key).join(', ')
    : 'Bub Stellar (solo)';
  const evText = (selectedEvidence && selectedEvidence.length > 0)
    ? selectedEvidence.join(', ')
    : 'None';

  return `OPERATION: ${operation.title}
TYPE: ${typeInfo.label}
LOCATION: ${operation.location}
OBJECTIVE: ${operation.objective}

TEAM ASSIGNED: ${teamNames}
APPROACH: ${selectedApproach || 'No specific approach — Bub improvises'}
EVIDENCE ATTACHED: ${evText}

Resolve this operation based on crew expertise, chosen approach, current clock pressures, and known enemy activity. Narrate the outcome and apply all consequences.`;
}

// === CREW SCORING FOR OPERATIONS ===
// Scores each crew member for a given operation based on expertise match,
// operation type bonuses, and availability. Used to recommend teams.

import { isCrewAvailable } from '@/lib/pjCrewAdvice';
import { CREW_PROFILES } from '@/lib/pjCrewProfiles';

const TYPE_BONUSES = {
  counterintel: { sarah: 25, reeves: 20, patel: 15 },
  evidence_recovery: { clark: 25, james: 15, reeves: 10 },
  recon: { mitchell: 25, reeves: 15, hayes: 10 },
  rescue: { mitchell: 20, thorne: 15, ramos: 10 },
  covert: { sarah: 20, hayes: 15, mitchell: 10 },
  diplomatic: { thorne: 25, sarah: 15, clark: 10 },
  ship_maneuver: { ramos: 25, reeves: 15, hayes: 10 },
  sabotage_prevention: { mitchell: 25, ramos: 15, clark: 10 },
  undercover: { reeves: 25, patel: 15, voss: 10 },
  exploration: { carmelon: 25, mitchell: 15, clark: 10 }
};

export function scoreCrewForOperation(crewKey, operation, campaign) {
  const profile = CREW_PROFILES[crewKey];
  if (!profile) return -999;

  if (!isCrewAvailable(crewKey, campaign)) return -999;

  let score = 0;

  // Score based on expertise matching operation text
  const opText = [
    operation.title || '',
    operation.objective || '',
    operation.location || '',
    ...(operation.risks || []),
    ...(operation.approaches || [])
  ].join(' ').toLowerCase();

  for (const exp of profile.expertise) {
    const expWords = exp.toLowerCase().split(/\s+/);
    if (expWords.some(w => w.length > 3 && opText.includes(w))) score += 20;
  }

  for (const pri of profile.priorities) {
    const priWords = pri.toLowerCase().split(/\s+/);
    if (priWords.some(w => w.length > 3 && opText.includes(w))) score += 10;
  }

  // Location-based bonuses
  const loc = (operation.location || '').toLowerCase();
  if (loc.includes('new titan') && crewKey === 'thorne') score += 25;
  if (loc.includes('new titan') && crewKey === 'patel') score += 15;
  if (loc.includes('confluence') && crewKey === 'james') score += 20;
  if (loc.includes('sanctuary') && crewKey === 'carmelon') score += 15;

  // Operation type bonuses
  const typeBonus = TYPE_BONUSES[operation.type]?.[crewKey] || 0;
  score += typeBonus;

  return score;
}

export function getRecommendedTeam(operation, campaign) {
  const crewKeys = Object.keys(CREW_PROFILES);
  const scored = crewKeys.map(key => ({
    key,
    name: CREW_PROFILES[key].displayName,
    role: CREW_PROFILES[key].role,
    expertise: CREW_PROFILES[key].expertise,
    score: scoreCrewForOperation(key, operation, campaign),
    available: isCrewAvailable(key, campaign)
  }));

  return scored
    .filter(c => c.available && c.score > 0)
    .sort((a, b) => b.score - a.score);
}

// === EVIDENCE LIST (for attachment selection) ===
export function getAvailableEvidence() {
  return PJ_EVIDENCE.map(e => ({ key: e.key, label: e.label }));
}