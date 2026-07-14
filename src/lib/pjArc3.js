// Pathfinder Journeys — Arc 3: The Hidden War
// Systems data for the counterintelligence and source warfare arc.
// Evidence wins arguments. Operations win the war. Arc 3 proves the hidden war is real.

// === OVERVIEW ===
export const ARC3_TITLE = 'The Hidden War';
export const ARC3_DESIGN_LINE = 'Evidence wins arguments. Operations win the war. Arc 3 proves the hidden war is real.';
export const ARC3_SUMMARY = 'Pathfinder moves from evidence-based resistance into active counterintelligence and source warfare. Find the infiltrators. Learn how they are made. Survive the enemy\'s counterattack. Destroy the source. Accept the cost of the choices made.';
export const ARC3_LOOP = 'Detect hidden threat → Choose who to trust → Assign team → Run covert operation → Discover enemy network → Enemy reacts → Make command decision → Accept consequence → Update clocks → Unlock next operation';

// === KIMELON SCANNER ===
export const KIMELON_SPECS = {
  name: 'Kimelon',
  detectionTime: '8 seconds',
  range: '12 meters (improved to 14)',
  mode: 'Passive scan possible',
  units: 8,
  secrecyLevel: 'Senior staff only',
  enemyAware: false,
  limitations: [
    'Prototype — limited units',
    'Can be affected by interference',
    'Does not detect loyalty — only Confluence biotech',
    'A human scan proves biology, not trustworthiness'
  ]
};

export const KIMELON_RESULTS = [
  { key: 'HUMAN', label: 'Human', color: 'text-emerald-400', dot: 'bg-emerald-500', desc: 'No Confluence biotech detected. Biology confirmed — loyalty not.' },
  { key: 'SHAPESHIFTER', label: 'Shapeshifter', color: 'text-red-400', dot: 'bg-red-500', desc: 'Confluence biotech detected. Subject is a shapeshifter infiltrator.' },
  { key: 'INCONCLUSIVE', label: 'Inconclusive', color: 'text-amber-400', dot: 'bg-amber-500', desc: 'Results unclear. Interference, distance, or unknown biotech pattern.' },
  { key: 'SCAN_FAILED', label: 'Scan Failed', color: 'text-slate-400', dot: 'bg-slate-500', desc: 'Technical failure. Retry or repair needed.' },
  { key: 'INTERFERENCE', label: 'Interference Detected', color: 'text-orange-400', dot: 'bg-orange-500', desc: 'Active interference. Possible countermeasures or environmental noise.' }
];

// === SHAPESHIFTER SUSPECTS ===
export const SHAPESHIFTER_SUSPECTS = [
  { name: 'Dr. Voss (Shifter)', status: 'CONFIRMED', outcome: 'EXECUTED', notes: 'Replaced Dr. Elena Voss ~8 years ago. Reported Pathfinder data for years. Interrogated and executed by Stellar.', threat: 'neutralized' },
  { name: 'Jennifer Orlando', status: 'CONFIRMED', outcome: 'AT_LARGE', notes: 'Fortuna Station. Knows about kimelons. Escaped Cradle destruction. High-priority target.', threat: 'extreme' },
  { name: 'Thomas Berkley', status: 'CONFIRMED', outcome: 'AT_LARGE', notes: 'Fortuna Station. Shapeshifter network member.', threat: 'high' },
  { name: 'Marcus Valen', status: 'CONFIRMED', outcome: 'AT_LARGE', notes: 'Wealthy businessman, Fortuna Station. Tertius-sector shapeshifter network hub.', threat: 'extreme' },
  { name: 'Councilor Hale', status: 'CONFIRMED', outcome: 'ESCAPED', notes: 'Earth Command Council. Escaped Earth purge. Missing and dangerous.', threat: 'extreme' },
  { name: 'Councilor Reynolds', status: 'CONFIRMED', outcome: 'ARRESTED', notes: 'Earth Command Council. Arrested during Earth purge.', threat: 'neutralized' },
  { name: 'General Ruiz', status: 'CONFIRMED', outcome: 'ARRESTED', notes: 'Earth Command. Arrested during Earth purge.', threat: 'neutralized' },
  { name: 'Admin. Whitmore', status: 'CONFIRMED', outcome: 'EXPOSED', notes: 'Colonial Administrator. 94% confidence scan. Exposed by Carmelon on Earth.', threat: 'neutralized' },
  { name: 'Lt. Peter Chase', status: 'CONFIRMED', outcome: 'PENDING', notes: 'Valiant. Junior engineering officer. High sabotage risk. Found by Captain Myers.', threat: 'high' },
  { name: 'Ens. Jennifer Parker', status: 'CONFIRMED', outcome: 'PENDING', notes: 'Valiant. Tactical analyst. Found by Captain Myers.', threat: 'medium' }
];

// === VERIFIED ALLIES ===
export const VERIFIED_ALLIES = [
  { ship: 'Pathfinder', captain: 'Bub Stellar', scan: 'HUMAN', trust: 100, kimelon: true, notes: 'Player character.' },
  { ship: 'Valiant', captain: 'Rachel Myers', scan: 'HUMAN', trust: 85, kimelon: true, notes: 'Trusted ally. Found two shapeshifters aboard.' },
  { ship: 'Defender', captain: 'Morrison', scan: 'HUMAN', trust: 80, kimelon: true, notes: 'Trusted ally. Led boarding team at Cradle assault.' },
  { ship: 'Resolution', captain: 'Fischer', scan: 'HUMAN', trust: 45, kimelon: true, caution: 'ambitious_not_fully_trusted', notes: 'Human but ambitious. Limited information. A reminder that human danger still exists.' }
];

// === CASE ASSESSMENT ===
export const CASE_ASSESSMENT_QUESTIONS = [
  'What access does the infiltrator have?',
  'Can they sabotage the ship or mission?',
  'Do they know we can detect them?',
  'Are they actively communicating with the network?',
  'Can they be safely monitored without alerting the network?',
  'Are they useful as an intelligence source (double agent)?',
  'Is containment possible without risk?',
  'Would removal alert the network and cause escalation?',
  'What is the moral/political cost of each option?',
  'Who has authority to decide?'
];

export const CASE_OUTCOMES = [
  { key: 'monitor', label: 'Monitor', desc: 'Watch quietly. Gather intelligence. Do not alert them.', color: 'text-sky-400' },
  { key: 'contain', label: 'Contain', desc: 'Restrict access. Isolate from critical systems.', color: 'text-amber-400' },
  { key: 'interrogate', label: 'Interrogate', desc: 'Bring in for questioning. Risk network alert.', color: 'text-orange-400' },
  { key: 'false_channel', label: 'Use as False Channel', desc: 'Feed them false information. High risk, high reward.', color: 'text-violet-400' },
  { key: 'execute', label: 'Execute', desc: 'Eliminate the threat permanently. Heavy moral cost.', color: 'text-red-400' },
  { key: 'expose', label: 'Expose Publicly', desc: 'Reveal to the crew or public. Political fallout.', color: 'text-pink-400' },
  { key: 'transfer', label: 'Transfer', desc: 'Move them somewhere they cannot do harm.', color: 'text-cyan-400' },
  { key: 'delay', label: 'Delay Decision', desc: 'Gather more information. Risk grows over time.', color: 'text-slate-400' }
];

// === UNITY EVOLUTION ===
export const UNITY_CLOCKS = [
  { key: 'unity_grief', label: 'Unity Grief', direction: 'bad', desc: 'Emotional instability after fragment loss. High = erratic behavior, withdrawal.' },
  { key: 'unity_trust', label: 'Unity Trust', direction: 'good', desc: 'Crew trust in Unity after boundary failures and sacrifices.' },
  { key: 'unity_fear', label: 'Unity Fear', direction: 'bad', desc: 'Fear of death, fragmentation, Weaver, and self-loss.' },
  { key: 'unity_selfhood', label: 'Unity Selfhood', direction: 'good', desc: 'Development into a person/people rather than only a collective tool.' }
];

export const UNITY_FRAGMENTS = [
  {
    id: 'unity_fragment_martinez_torres',
    location: 'Martinez/Torres shuttle',
    status: 'LOST',
    capabilities: ['electronic_warfare', 'remote_interface', 'limited_autonomy'],
    risks: ['connection_instability', 'capture', 'fragment_divergence'],
    dataRecovered: 37,
    lastWords: 'We do not want to go. We like being. We are afraid, we think.',
    emotionalImpact: 'severe'
  }
];

export const UNITY_MILESTONES = [
  { event: 'Boundary Failure — Knew Voss was shapeshifter, did not tell crew', effect: 'Crew Trust -4, Unity Understanding +6', resolved: false },
  { event: 'Interrupting cow joke during interrogation', effect: 'Unity developing humor and personality', resolved: true },
  { event: 'Station takeover at Fortuna', effect: 'Unity system-control capability revealed', resolved: true },
  { event: 'Fragment death at Cradle', effect: 'Unity grief, fear, resolve. Selfhood increased.', resolved: true },
  { event: 'Loom called Unity "something else"', effect: 'Unity may be a new thread. Wants to find Predecessor work.', resolved: true }
];

// === CRADLE ===
export const CRADLE_FACTS = [
  'The Cradle is a Predecessor machine from a previous universe/cycle.',
  'The Predecessors built seed-machines to carry life/patterns across cosmic collapse.',
  'The Confluence found and hijacked the Cradle.',
  'The Cradle was built for seeding, not harvest.',
  'The Confluence repurposed it into a shapeshifter factory.',
  'Shapeshifters are engineered bio-construct weapons, not a natural species.',
  'They are grown from assimilated species templates using quantum-linked nanostructures.',
  'The Cradle is tuned for human-compatible constructs.',
  'Thousands of shapeshifters were deployed. Production continued for decades.',
  'There are other Cradle-like facilities tuned to other populations.',
  'The Loom is the Cradle\'s original Predecessor process — it recognizes corruption.',
  'The Loom called Unity "something else" — outside its grammar.',
  'Destroying the Cradle makes the human-space shapeshifter campaign finite.'
];

export const WEAVER_DATA = {
  name: 'The Weaver',
  nature: 'Ancient Predecessor thread/entity alerted by Cradle destruction.',
  status: 'ALERTED',
  awareness: 20,
  threat: 'Unknown — possibly existential. Older than the Confluence.',
  signal: 'The Loom scream went somewhere. The Weaver heard.',
  arc4Hook: 'Something old notices a severed thread. Correction will be required. Not yet. Soon.'
};

// === ARC 3 CLOCKS ===
export const ARC3_CLOCKS = [
  { key: 'shapeshifter_network_alert', label: 'Shapeshifter Network Alert', direction: 'bad', startVal: 75, desc: 'How aware remaining infiltrators are that they are being hunted. High = they go to ground, retaliate, or accelerate plans.' },
  { key: 'earth_support_network', label: 'Earth Support Network', direction: 'good', startVal: 45, desc: 'How strong Raney\'s verified support cell is. High = more Earth resources, political cover, intelligence sharing.' },
  { key: 'earth_infiltration_exposure', label: 'Earth Infiltration Exposure', direction: 'good', startVal: 40, desc: 'How much Earth has uncovered about Confluence infiltration.' },
  { key: 'orlando_retaliation', label: 'Orlando Retaliation', direction: 'bad', startVal: 30, desc: 'How soon Jennifer Orlando strikes back.' },
  { key: 'hale_escape_risk', label: 'Hale Escape Risk', direction: 'bad', startVal: 35, desc: 'How much damage Councilor Hale can do after escaping Earth purge.' },
  { key: 'unity_grief', label: 'Unity Grief', direction: 'bad', startVal: 65, desc: 'Unity\'s emotional instability after fragment loss.' },
  { key: 'unity_trust', label: 'Unity Trust', direction: 'good', startVal: 70, desc: 'Crew trust in Unity after boundary failures and sacrifices.' },
  { key: 'unity_fear', label: 'Unity Fear', direction: 'bad', startVal: 40, desc: 'Unity\'s fear of death, fragmentation, Weaver, and self-loss.' },
  { key: 'unity_selfhood', label: 'Unity Selfhood', direction: 'good', startVal: 75, desc: 'Unity\'s development into a person rather than a collective tool.' },
  { key: 'weaver_awareness', label: 'Weaver Awareness', direction: 'bad', startVal: 20, desc: 'How close the ancient Predecessor/Weaver thread is to responding.' },
  { key: 'trellix_crisis', label: 'Trellix Crisis', direction: 'bad', startVal: 85, desc: 'How badly the unresolved Veyris situation is deteriorating.' },
  { key: 'captain_burden', label: 'Captain Burden', direction: 'bad', startVal: 78, desc: 'The accumulated moral weight on Bub Stellar. High = harder decisions, crew unease.' }
];

// === ARC 3 NPCs ===
export const ARC3_NPCS = [
  { name: 'Vice Admiral Thomas Raney', faction: 'Earth Command', disposition: 'cautiously_trusting', status: 'verified_human', notes: 'Verified HUMAN (92%). Agrees to help quietly. Commands Earth covert support cell.' },
  { name: 'Captain Rachel Myers', faction: 'Valiant', disposition: 'friendly', status: 'verified_human', notes: 'Verified HUMAN. Trusted ally. Found two shapeshifters aboard. Trust 85.' },
  { name: 'Captain Morrison', faction: 'Defender', disposition: 'friendly', status: 'verified_human', notes: 'Verified HUMAN. Trusted ally. Led boarding team at Cradle. Trust 80.' },
  { name: 'Captain Fischer', faction: 'Resolution', disposition: 'neutral', status: 'verified_human', notes: 'Verified HUMAN but ambitious. Not fully trusted. Limited information. Trust 45.' },
  { name: 'Marcus Valen', faction: 'Confluence Network', disposition: 'hostile', status: 'confirmed_shapeshifter', notes: 'Tertius-sector shapeshifter network hub. Fortuna Station. Wealthy businessman cover.' },
  { name: 'Jennifer Orlando', faction: 'Confluence Network', disposition: 'hostile', status: 'confirmed_shapeshifter', notes: 'Knows about kimelons. Escaped Cradle. High-priority target.' },
  { name: 'Thomas Berkley', faction: 'Confluence Network', disposition: 'hostile', status: 'confirmed_shapeshifter', notes: 'Fortuna Station. Network member.' },
  { name: 'Rebecca Kim', faction: 'Pathfinder', disposition: 'friendly', status: 'human', notes: 'Built original Kepler Station scanner. Co-developed kimelon with Carmelon.' },
  { name: 'Chief Martinez', faction: 'Pathfinder', disposition: 'friendly', status: 'human', notes: 'Undercover specialist. Captured at Cradle. Rescued.' },
  { name: 'Lt. Torres', faction: 'Pathfinder', disposition: 'friendly', status: 'human', notes: 'Tactical. Captured at Cradle with Martinez. Rescued.' },
  { name: 'Lt. Carmichael', faction: 'Earth', disposition: 'friendly', status: 'human', notes: 'Real Lieutenant Carmichael. Part of Earth gambit team.' },
  { name: 'Councilor Hale', faction: 'Earth Council', disposition: 'hostile', status: 'confirmed_shapeshifter', notes: 'Escaped Earth purge. Missing and dangerous.' },
  { name: 'Councilor Reynolds', faction: 'Earth Council', disposition: 'hostile', status: 'confirmed_shapeshifter', notes: 'Arrested during Earth purge.' },
  { name: 'General Ruiz', faction: 'Earth Command', disposition: 'hostile', status: 'confirmed_shapeshifter', notes: 'Arrested during Earth purge.' },
  { name: 'Admin. Whitmore', faction: 'Earth Colony', disposition: 'hostile', status: 'confirmed_shapeshifter', notes: '94% confidence scan. Exposed by Carmelon.' }
];

// === ARC 3 LOCATIONS ===
export const ARC3_LOCATIONS = [
  { name: 'Pathfinder Brig', state: 'ACTIVE', notes: 'Where Shifter-Voss was contained and interrogated.' },
  { name: 'Pathfinder Maintenance Bay / Unity Nexus', state: 'ACTIVE', notes: 'Unity\'s primary interface point.' },
  { name: 'Fortuna Station', state: 'COMPROMISED', notes: 'Casino resort station. Valen\'s base. Shapeshifter network hub.' },
  { name: 'The Eclipse (Private Club)', state: 'COMPROMISED', notes: 'Fortuna Station exclusive club. Valen\'s inner circle meets here.' },
  { name: 'Hadrax Station', state: 'DISCOVERED', notes: 'Front for Confluence quantum teleporter to the Cradle. Remote mining facility cover.' },
  { name: 'The Cradle', state: 'DESTROYED', notes: 'Predecessor seed-machine hijacked by Confluence. Shapeshifter factory. Destroyed by allied assault.' },
  { name: 'Earth / New Mansfield', state: 'ACTIVE', notes: 'Earth Command. Chen\'s confession. Earth purge of shapeshifters.' },
  { name: 'Earth Command Council Chamber', state: 'ACTIVE', notes: 'Where Chen addressed the council. Hale, Reynolds, Ruiz exposed.' },
  { name: 'Veyris / Trellix Homeworld', state: 'UNRESOLVED', notes: 'Non-human species under Confluence threat. Recon aborted to prioritize Cradle. Debt remains.' },
  { name: 'Quadron Belt', state: 'DISCOVERED', notes: 'Remote region. Hadrax Station located here.' },
  { name: 'Predecessor Relic Site', state: 'LOCKED', notes: 'Older Predecessor relic. Coordinates unlocked from Cradle telemetry. Arc 4 destination.' }
];

// === ARC 3 INTEL ===
export const ARC3_INTEL = [
  { key: 'kimelon_scanner_specs', label: 'Kimelon Scanner Specs', desc: 'Technical specifications for the portable shapeshifter detector.' },
  { key: 'voss_confirmed_shapeshifter', label: 'Voss Confirmed Shapeshifter', desc: 'Dr. Voss confirmed as Confluence shapeshifter infiltrator.' },
  { key: 'voss_interrogation_transcript', label: 'Voss Interrogation Transcript', desc: 'Full interrogation revealing 8-year infiltration, reporting history, Valen network.' },
  { key: 'valen_network_hub', label: 'Valen Network Hub Confirmation', desc: 'Marcus Valen confirmed as Tertius-sector shapeshifter network hub.' },
  { key: 'orlando_identified', label: 'Orlando Identified', desc: 'Jennifer Orlando identified as shapeshifter. Knows about kimelons.' },
  { key: 'berkley_identified', label: 'Berkley Identified', desc: 'Thomas Berkley identified as shapeshifter network member.' },
  { key: 'whitmore_confirmed', label: 'Whitmore Confirmed Shapeshifter', desc: 'Colonial Administrator Whitmore. 94% confidence kimelon scan.' },
  { key: 'earth_council_shapeshifters', label: 'Earth Council Shapeshifters', desc: 'Hale, Reynolds, Ruiz confirmed as infiltrators. Earth purge conducted.' },
  { key: 'chen_novara_confession', label: 'Chen Novara Confession', desc: 'Admiral Chen confesses FTL/Novara deal to Earth Command Council.' },
  { key: 'hadrax_front', label: 'Hadrax Station Front', desc: 'Hadrax is not a mining station. Contains Confluence quantum teleporter.' },
  { key: 'cradle_coordinates', label: 'Cradle Coordinates', desc: 'Location of the Cradle. Uncharted shielded artificial world.' },
  { key: 'cradle_internal_map', label: 'Cradle Internal Map (Partial)', desc: '37% of fragment data recovered. Partial maps, energy signatures, weak points.' },
  { key: 'shapeshifter_origin_truth', label: 'Shapeshifter Origin Truth', desc: 'Shapeshifters are engineered bio-constructs, not a natural species.' },
  { key: 'predecessor_cradle_lore', label: 'Predecessor Cradle Lore', desc: 'Cradle is a Predecessor seed-machine. Built for seeding, not harvest.' },
  { key: 'unity_phase_arrest_data', label: 'Unity Phase Arrest Data', desc: 'Cradle can freeze/pin Unity using pattern-lock technology.' },
  { key: 'loom_weaver_signal', label: 'Loom/Weaver Signal', desc: 'Cradle destruction sent a signal. The Weaver heard.' },
  { key: 'cradle_destruction_record', label: 'Cradle Destruction Record', desc: 'Cradle destroyed. Human-compatible shapeshifter production halted.' },
  { key: 'predecessor_relic_coordinates', label: 'Predecessor Relic Coordinates', desc: 'Older Predecessor relic site. Arc 4 destination.' }
];

// === COMMAND BURDEN ===
export const COMMAND_BURDEN_TYPES = [
  { key: 'execution', label: 'Execution', icon: 'Crosshair', desc: 'Ordered the death of an enemy prisoner or crew member.' },
  { key: 'sacrifice', label: 'Sacrifice', icon: 'Heart', desc: 'Allowed someone to be harmed or lost for the mission.' },
  { key: 'abandonment', label: 'Abandonment', icon: 'MapPin', desc: 'Left a people or crisis behind to pursue a higher priority.' },
  { key: 'deception', label: 'Deception', icon: 'Eye', desc: 'Lied to allies or crew for strategic reasons.' },
  { key: 'collateral', label: 'Collateral', icon: 'AlertTriangle', desc: 'Civilian losses accepted as cost of mission.' },
  { key: 'fragment_loss', label: 'Fragment Loss', icon: 'Cpu', desc: 'A Unity fragment was lost or killed under your command.' }
];

// === ARC 3 OPERATIONS ===
export const ARC3_OPERATIONS = [
  {
    id: 'build_kimelon',
    title: 'Build Kimelon Scanner',
    type: 'sabotage_prevention',
    location: 'Pathfinder Science Lab',
    objective: 'Carmelon and Rebecca Kim improve the original Kepler Station scanner into a portable shapeshifter detection device.',
    recommendedCrew: ['carmelon', 'clark', 'hayes'],
    approaches: [
      'Carmelon and Kim collaborate on biotech calibration',
      'Clark handles sensor miniaturization',
      'Hayes builds the portable housing and power supply',
      'Test the prototype on known biological samples first'
    ],
    risks: ['prototype failure', 'limited units', 'interference issues'],
    rewards: ['shapeshifter detection unlocked', '8 functional units', 'passive scan capability'],
    clocksAffected: ['crew_morale', 'shapeshifter_network_alert']
  },
  {
    id: 'verify_allied_captains',
    title: 'Verify Allied Captains',
    type: 'counterintel',
    location: 'Allied Ships (Valiant, Defender, Resolution)',
    objective: 'Scan trusted ship captains and command staff to confirm they are human. Distribute kimelon units to verified ships.',
    recommendedCrew: ['mitchell', 'thorne', 'clark'],
    approaches: [
      'Visit each ship personally with Mitchell present',
      'Scan captains privately to avoid alarm',
      'Issue kimelons only to fully trusted captains',
      'Withhold full intelligence from Fischer'
    ],
    risks: ['political offense', 'shapeshifter alert if discovered', 'Fischer ambition'],
    rewards: ['verified allies', 'distributed scanner network', 'trust network established'],
    clocksAffected: ['shapeshifter_network_alert', 'earth_support_network', 'crew_morale']
  },
  {
    id: 'fortuna_surveillance',
    title: 'Fortuna Station Surveillance',
    type: 'covert',
    location: 'Fortuna Station',
    objective: 'Go undercover at Fortuna Station casino resort. Surveil Marcus Valen, track associates, monitor transmissions, identify shapeshifter network.',
    recommendedCrew: ['mitchell', 'thorne', 'hayes', 'reeves', 'clark'],
    approaches: [
      'Cover as wealthy tourists on shore leave',
      'Clark coordinates remotely from Pathfinder',
      'Mitchell watches body language at the casino',
      'Use Unity for remote electronic surveillance',
      'Keep Reese and Torres away from blackjack tables'
    ],
    risks: ['facial recognition', 'cover blown', 'Valen trap', 'casino security'],
    rewards: ['Valen confirmed as hub', 'Orlando identified', 'Berkley identified', 'network coordination confirmed'],
    clocksAffected: ['shapeshifter_network_alert', 'confluence_heat', 'crew_morale']
  },
  {
    id: 'voss_interrogation',
    title: 'Voss Interrogation',
    type: 'counterintel',
    location: 'Pathfinder Brig',
    objective: 'Interrogate contained Shifter-Voss. Extract intelligence on Confluence network, Valen, shapeshifter deployment, and reporting history.',
    recommendedCrew: ['james', 'clark', 'sarah'],
    approaches: [
      'James and Stellar lead interrogation with Confluence knowledge',
      'Unity assists with pattern analysis',
      'Sarah asks about Chen-linked protocols',
      'Use the interrupting cow joke moment to read Voss\'s reaction to Unity'
    ],
    risks: ['unity boundary revelation', 'voss psychological manipulation', 'crew trust issues'],
    rewards: ['valen network hub confirmation', 'reporting history exposed', 'shapeshifter deployment scale revealed', 'thousands of shifters estimated'],
    clocksAffected: ['unity_trust', 'unity_selfhood', 'shapeshifter_network_alert']
  },
  {
    id: 'earth_gambit',
    title: 'Earth Gambit',
    type: 'diplomatic',
    location: 'Earth / New Mansfield',
    objective: 'Return to Earth. Reach Vice Admiral Raney. Scan him. Convince him shapeshifters are real. Begin Earth covert support network.',
    recommendedCrew: ['sarah', 'carmelon', 'clark'],
    approaches: [
      'Chen identifies herself and is biometrically verified',
      'Carmelon demonstrates kimelon on Administrator Whitmore',
      'Scan Raney to prove he is human',
      'Address the Earth Command Council with the full truth',
      'Sarah and Carmelon secretly scan council members during the address'
    ],
    risks: ['political danger', 'chen_countermeasures', 'shapeshifter council members', 'earth_command_compromise'],
    rewards: ['Raney verified human', 'Earth support network established', 'council shapeshifters exposed', 'Earth purge initiated'],
    clocksAffected: ['earth_support_network', 'earth_infiltration_exposure', 'chen_countermeasures']
  },
  {
    id: 'fortuna_followup',
    title: 'Fortuna Follow-Up Surveillance',
    type: 'covert',
    location: 'Fortuna Station → Hadrax Station',
    objective: 'Surveil Marcus Valen through unknown faces. Track Orlando leaving Fortuna. Follow to Hadrax Station in the Quadron Belt.',
    recommendedCrew: ['mitchell', 'reeves', 'patel'],
    approaches: [
      'Use unknown faces — no one from the original casino team',
      'Unity sends a fragment for remote support',
      'Track Orlando\'s departure vector quietly',
      'No solo movement — backup required at all times',
      'Avoid level-four maintenance corridors (Hayes future memory)'
    ],
    risks: ['ambush', 'recognition', 'level-four corridor trap', 'fragment loss'],
    rewards: ['Hadrax Station discovered', 'Orlando tracked', 'Cradle teleporter found'],
    clocksAffected: ['shapeshifter_network_alert', 'unity_grief', 'crew_morale']
  },
  {
    id: 'veyris_recon',
    title: 'Veyris Recon',
    type: 'recon',
    location: 'Veyris / Trellix Homeworld',
    objective: 'Observe Confluence harvest operation near the Trellix homeworld. Document, do not engage. Decide whether to intervene.',
    recommendedCrew: ['mitchell', 'reeves', 'clark'],
    approaches: [
      'Descend under storm cover to avoid Confluence aerospace control',
      'Mitchell scouts for danger signs',
      'Clark documents harvest tactics remotely',
      'Reeves maintains emergency escape vector',
      'Observe only — decide in the moment whether to act'
    ],
    risks: ['confluence detection', 'trap', 'moral crisis if Trellix are being harmed'],
    rewards: ['Confluence harvest tactics documented', 'potential Trellix alliance', 'understanding of enemy operations'],
    clocksAffected: ['trellix_crisis', 'confluence_heat', 'captain_burden']
  },
  {
    id: 'hadrax_investigation',
    title: 'Hadrax Station Investigation',
    type: 'exploration',
    location: 'Hadrax Station, Quadron Belt',
    objective: 'Investigate Hadrax Station. Discover it is a front for a Confluence quantum teleporter. Find the Cradle.',
    recommendedCrew: ['martinez', 'torres'],
    approaches: [
      'Martinez and Torres infiltrate under cover',
      'Unity fragment provides electronic warfare support',
      'Investigate the "mining" operations quietly',
      'Follow Orlando\'s trail to the teleporter node'
    ],
    risks: ['capture', 'fragment loss', 'quantum containment', 'Cradle countermeasures'],
    rewards: ['Cradle discovered', 'teleporter coordinates', 'partial internal maps', 'weak point data'],
    clocksAffected: ['shapeshifter_network_alert', 'unity_grief', 'weaver_awareness']
  },
  {
    id: 'earth_purge',
    title: 'Earth Purge',
    type: 'counterintel',
    location: 'Earth Command',
    objective: 'Raney prepares simultaneous arrests of confirmed shapeshifters in Earth Command Council and military.',
    recommendedCrew: ['sarah', 'clark', 'raney'],
    approaches: [
      'Raney coordinates simultaneous arrests',
      'Sarah provides intelligence on each target',
      'Clark handles biometric verification during arrests',
      'Secure Councilor Hale first — highest escape risk'
    ],
    risks: ['Hale escape', 'network alert', 'combat with resisting shifters', 'political fallout'],
    rewards: ['12 shapeshifters arrested', 'Earth partially secured', 'network disrupted'],
    clocksAffected: ['earth_infiltration_exposure', 'shapeshifter_network_alert', 'hale_escape_risk']
  },
  {
    id: 'cradle_assault',
    title: 'Cradle Assault',
    type: 'rescue',
    location: 'The Cradle',
    objective: 'Assault the Cradle with allied fleet. Rescue Martinez and Torres. Plant charges under the dais/core convergence. Destroy shapeshifter production.',
    recommendedCrew: ['mitchell', 'thorne', 'james', 'clark', 'morrison'],
    approaches: [
      'Pathfinder leads the assault',
      'Valiant and Resolution attack external plates',
      'Defender boards through the breach',
      'Unity provides weak-point guidance and holds corridors',
      'Boarding team plants charges under the brainstem convergence'
    ],
    risks: ['Cradle defenses', 'Loom awakening', 'fragment death', 'mass casualties', 'Weaver signal'],
    rewards: ['Cradle destroyed', 'Martinez and Torres rescued', 'shapeshifter production halted', 'finite threat campaign'],
    clocksAffected: ['weaver_awareness', 'unity_grief', 'confluence_heat', 'captain_burden']
  },
  {
    id: 'hunt_shapeshifters',
    title: 'Hunt Remaining Shapeshifters',
    type: 'counterintel',
    location: 'Human Space',
    objective: 'With Cradle destroyed, the remaining shapeshifters are finite. Hunt them systematically using distributed kimelons and verified ally network.',
    recommendedCrew: ['mitchell', 'thorne', 'myers'],
    approaches: [
      'Coordinate sweeps across all allied ships',
      'Use verified captains to root out local infiltrators',
      'Mitchell leads detection teams',
      'Case-by-case assessment for each found infiltrator'
    ],
    risks: ['infiltrator retaliation', 'false accusations', 'network going to ground'],
    rewards: ['infiltrators removed', 'allied ships secured', 'finite threat reduced'],
    clocksAffected: ['shapeshifter_network_alert', 'earth_infiltration_exposure', 'crew_morale']
  },
  {
    id: 'track_orlando',
    title: 'Track Jennifer Orlando',
    type: 'covert',
    location: 'Unknown — Last seen escaping Cradle',
    objective: 'Find and track Jennifer Orlando. She knows about kimelons, has future memories, and escaped the Cradle destruction. She is the highest-priority loose end.',
    recommendedCrew: ['mitchell', 'reeves', 'patel'],
    approaches: [
      'Patel traces her communications from Cradle debris',
      'Mitchell tracks her through hyperspace residue',
      'Reeves follows leads through station security networks',
      'Use Unity to monitor for her biotech signature remotely'
    ],
    risks: ['Orlando counterattack', 'trap', 'shapeshifter network protection'],
    rewards: ['Orlando located', 'network node exposed', 'future memory leak prevented'],
    clocksAffected: ['orlando_retaliation', 'shapeshifter_network_alert', 'captain_burden']
  },
  {
    id: 'track_hale',
    title: 'Track Councilor Hale',
    type: 'counterintel',
    location: 'Earth / Unknown',
    objective: 'Find Councilor Hale, who escaped the Earth purge. She has Earth Command knowledge and is a dangerous loose end.',
    recommendedCrew: ['sarah', 'clark', 'patel'],
    approaches: [
      'Sarah monitors Earth Command channels for Hale\'s activity',
      'Clark traces her access codes',
      'Patel intercepts relay traffic',
      'Coordinate with Raney\'s verified cell'
    ],
    risks: ['Hale counterintelligence', 'Earth political fallout', 'network protection'],
    rewards: ['Hale located', 'Earth Command secured', 'intelligence recovered'],
    clocksAffected: ['hale_escape_risk', 'earth_infiltration_exposure', 'shapeshifter_network_alert']
  },
  {
    id: 'support_unity_grief',
    title: 'Support Unity Through Grief',
    type: 'diplomatic',
    location: 'Pathfinder / Unity Nexus',
    objective: 'Help Unity process the fragment loss. Unity is grieving, afraid, and changing. How the crew treats Unity now determines what Unity becomes.',
    recommendedCrew: ['carmelon', 'clark', 'mitchell', 'sarah'],
    approaches: [
      'Carmelon talks to Unity about change and fear',
      'Let Unity grieve in its own way',
      'Acknowledge the fragment as a person, not just a tool',
      'Ask Unity what it needs',
      'Mitchell sits with Unity — he understands nonhuman minds'
    ],
    risks: ['Unity withdrawal', 'Unity fear escalating', 'crew mistrust'],
    rewards: ['Unity trust restored', 'Unity selfhood grows', 'Unity becomes a true ally'],
    clocksAffected: ['unity_grief', 'unity_trust', 'unity_selfhood', 'crew_morale']
  },
  {
    id: 'investigate_weaver',
    title: 'Investigate Weaver Disturbance',
    type: 'exploration',
    location: 'Cradle Debris / Deep Space',
    objective: 'Unity detected a harmonic resonance in Cradle residual telemetry. Investigate what the Cradle\'s death awakened.',
    recommendedCrew: ['carmelon', 'clark', 'mitchell'],
    approaches: [
      'Carmelon analyzes the Predecessor patterns',
      'Clark studies the telemetry data',
      'Unity interprets the signal',
      'Mitchell watches for temporal anomalies'
    ],
    risks: ['unknown Predecessor technology', 'Weaver response', 'temporal instability'],
    rewards: ['Weaver understanding', 'Predecessor relic coordinates', 'Arc 4 destination unlocked'],
    clocksAffected: ['weaver_awareness', 'unity_selfhood', 'temporal_instability']
  },
  {
    id: 'resolve_veylris',
    title: 'Resolve Veyris / Trellix Debt',
    type: 'diplomatic',
    location: 'Veyris / Trellix Homeworld',
    objective: 'Return to Veyris. The Trellix crisis was left unresolved when Pathfinder aborted to pursue the Cradle. The debt must be paid.',
    recommendedCrew: ['sarah', 'carmelon', 'thorne', 'mitchell'],
    approaches: [
      'Approach under flag of peace',
      'Bring evidence of Confluence harvest operations',
      'Offer kimelon scanning as a gesture of good faith',
      'Ask what the Trellix need',
      'Accept that some debts cannot be fully repaid'
    ],
    risks: ['Trellix hostility', 'Confluence presence', 'moral cost of earlier abandonment'],
    rewards: ['Trellix alliance', 'debt partially repaid', 'new perspective on non-human relations'],
    clocksAffected: ['trellix_crisis', 'resistance_spark', 'captain_burden', 'crew_morale']
  },
  {
    id: 'travel_predecessor_relic',
    title: 'Travel to Predecessor Relic Site',
    type: 'exploration',
    location: 'Unnamed Predecessor Relic Site',
    objective: 'Travel to the Predecessor relic site whose coordinates were unlocked from Cradle telemetry. Determine what the Cradle\'s death awakened.',
    recommendedCrew: ['carmelon', 'clark', 'mitchell', 'james'],
    approaches: [
      'Carmelon leads the archaeological investigation',
      'Clark scans for Predecessor technology',
      'Mitchell watches for temporal anomalies',
      'Unity interprets any pattern-lock or containment grammar',
      'James identifies any Confluence adaptation of Predecessor tech'
    ],
    risks: ['unknown Predecessor technology', 'Weaver presence', 'sealed dangers', 'incomplete or finished systems'],
    rewards: ['Predecessor understanding', 'Weaver truth', 'Unity\'s origin connection', 'Arc 4 begins'],
    clocksAffected: ['weaver_awareness', 'unity_selfhood', 'temporal_instability']
  }
];

// Mark all Arc 3 operations as requiring Arc 3 unlock
ARC3_OPERATIONS.forEach(op => { op.requiresArc3 = true; });

// === UNLOCK GATING ===
// Arc 3 systems are hidden until the story reaches Arc 3 Chapter 1.
// The GM sets arc3.kimelonInvented through the arc3_unlocks response field.
export function isArc3Unlocked(campaign) {
  const flags = campaign?.world_state?.quest_flags || {};
  return flags.arc3?.kimelonInvented === true;
}