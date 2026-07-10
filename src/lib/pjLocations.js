// Pathfinder Journeys — Playable Location Nodes
// Every Codex location is a real game destination: it has a state, a gameplay
// purpose, triggers that can send the crew there, arrival events, consequences
// for ignoring it, and tied clocks/evidence/NPCs. No dead lore entries.

// Local key normalizer (mirrors pjCodex.codexKey) to avoid a circular import.
function codexKey(s) {
  return String(s || '')
    .trim()
    .toLowerCase()
    .replace(/[\u2018\u2019']/g, '')
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_|_$/g, '');
}

// === LOCATION STATES ===
// UNKNOWN: not heard of yet; hide unless spoiler-safe.
// RUMORED: heard references, no exact coordinates.
// UNLOCKED: knows where it is; can travel there.
// ACTIVE: a mission/crisis/timer is happening there now.
// VISITED: been there at least once.
// DANGEROUS: enemy activity confirmed or likely.
// COMPLETED: main known mission resolved; may still be revisited.
// LOST: ignored or failed the crisis; fallen/destroyed/occupied/silent.
export const LOCATION_STATES = {
  UNKNOWN: { label: 'Unknown', tone: 'muted', desc: 'Not heard of yet.' },
  RUMORED: { label: 'Rumored', tone: 'amber', desc: 'Heard references, no exact coordinates.' },
  UNLOCKED: { label: 'Unlocked', tone: 'sky', desc: 'Known location; can travel there.' },
  ACTIVE: { label: 'Active', tone: 'red', desc: 'A crisis/timer/opportunity is happening now.' },
  VISITED: { label: 'Visited', tone: 'emerald', desc: 'Been there at least once.' },
  DANGEROUS: { label: 'Dangerous', tone: 'rose', desc: 'Enemy activity confirmed or likely.' },
  COMPLETED: { label: 'Completed', tone: 'emerald', desc: 'Main mission resolved; may revisit.' },
  LOST: { label: 'Lost', tone: 'slate', desc: 'Ignored or failed; fallen, destroyed, occupied, or silent.' },
  LOCKED: { label: 'Partially Locked', tone: 'violet', desc: 'Exists, but details are sealed until discovered.' }
};

// State tone → tailwind text/border/bg classes (literal strings so purge keeps them)
export const STATE_TONE_CLASSES = {
  muted: 'border-muted-foreground/40 text-muted-foreground bg-muted/20',
  amber: 'border-amber-500/40 text-amber-300 bg-amber-500/10',
  sky: 'border-sky-500/40 text-sky-300 bg-sky-500/10',
  red: 'border-red-500/40 text-red-300 bg-red-500/10',
  emerald: 'border-emerald-500/40 text-emerald-300 bg-emerald-500/10',
  rose: 'border-rose-500/40 text-rose-300 bg-rose-500/10',
  slate: 'border-slate-500/40 text-slate-300 bg-slate-500/10',
  violet: 'border-violet-500/40 text-violet-300 bg-violet-500/10'
};

// === RISK CLASSES ===
export const RISK_TONE_CLASSES = {
  Low: 'text-emerald-300/80',
  'Medium-Low': 'text-lime-300/80',
  Medium: 'text-amber-300/80',
  'Medium-High': 'text-orange-300/80',
  High: 'text-orange-400/80',
  Extreme: 'text-red-400/80',
  Variable: 'text-sky-300/80',
  Unknown: 'text-violet-300/80'
};

// === PLAYER ACTIONS (suggested commands for unlocked/active locations) ===
export const LOCATION_ACTIONS = [
  { key: 'set_course', label: 'Set Course', icon: 'Compass', command: (loc) => `Set course for ${loc.label}.` },
  { key: 'ask_crew', label: 'Ask Crew', icon: 'Users', command: (loc) => `Ask the crew what they know about ${loc.label}.` },
  { key: 'review_risks', label: 'Review Risks', icon: 'AlertTriangle', command: (loc) => `Review the known risks of going to ${loc.label}.` },
  { key: 'review_evidence', label: 'Review Evidence', icon: 'FileText', command: (loc) => `Review the evidence we have connected to ${loc.label}.` },
  { key: 'send_probe', label: 'Send Probe', icon: 'Radar', command: (loc) => `Send a long-range probe toward ${loc.label} and report back.` },
  { key: 'contact_faction', label: 'Contact Faction', icon: 'Flag', command: (loc) => `Attempt to contact the faction controlling ${loc.label}.` },
  { key: 'plan_mission', label: 'Plan Mission', icon: 'ClipboardList', command: (loc) => `Plan a mission to ${loc.label} with the senior crew.` },
  { key: 'ignore', label: 'Ignore For Now', icon: 'Clock', command: (loc) => `Note ${loc.label} but focus elsewhere for now. What are the consequences of waiting?` }
];

// === PLAYABLE LOCATIONS ===
export const CODEX_LOCATIONS = [
  {
    key: 'new_titan_system',
    label: 'New Titan System',
    aliases: ['New Titan'],
    description: 'Mining colony. 2M population. Immediate danger. Possible Confluence agents.',
    defaultState: 'ACTIVE',
    stateLabel: 'CRISIS',
    risk: 'High',
    knownByPlayer: true,
    travelRequirements: 'FTL jump from current position. New Titan Control will demand identification on arrival.',
    primaryFaction: 'New Titan Colonial Council / Earth Command loyalists',
    mainPurpose: 'Warn two million humans before Confluence agents secure the colony; prevent harvest, occupation, or surrender.',
    unlockTrigger: 'Already unlocked — the Pathfinder arrived at the edge of the system at the end of Arc 1.',
    missionTriggers: [
      'New Titan Control requests identification.',
      'Farrah reveals her father is Governor Marcus Thorne.',
      'Confluence envoy arrives to "facilitate compliance".',
      'Colony council fractures into resist vs. surrender factions.',
      'Patel begs to contact his family.',
      'Admiral Chen broadcasts a wanted order for Captain Stellar.'
    ],
    arrivalEvents: [
      'New Titan Control hails with suspicion or hostility.',
      'Scan reveals Confluence claim-ships already in system.',
      'Underground resistance cell contacts Hayes quietly.',
      'Governor Thorne agrees to meet — or refuses.',
      'Future-memory flash: "twelve hours to prepare."'
    ],
    ifIgnored: 'Within days: council divides. Within 1–2 weeks: a Confluence envoy gains influence. Within 3+ weeks: the colony may fall, be occupied, or go silent (Harvester event without the player).',
    possibleRewards: ['2M allied humans', 'mining resources', 'a defensible colony HQ', 'Governor Thorne as ally', 'Resistance Spark surge'],
    possibleConsequences: ['Confluence Heat spike', 'Chen Countermeasures spike', 'open war with Confluence enforcement', 'colony civilians killed if mishandled'],
    relatedNpcs: ['Farrah Thorne', 'Governor Marcus Thorne', 'Ensign Patel', 'Admiral Chen'],
    relatedEvidence: ['New Titan Claim File', 'Sarah Chen Testimony'],
    relatedClocks: ['new_titan_stability', 'confluence_claim', 'chen_countermeasures', 'resistance_spark'],
    arrivalScene: 'The Pathfinder drops out of FTL at the edge of the New Titan system. Mining beacons blink across the belt. New Titan Control is already hailing: "Unidentified vessel, state your registration and intent." Farrah Thorne goes very still at her station. Mitchell grips the perch rail and stares toward the third planet.',
    spoilerLevel: 'none',
    locked: false
  },
  {
    key: 'earth_sol_system',
    label: 'Earth / Sol System',
    aliases: ['Earth', 'Sol'],
    description: 'Homeworld. Chen controls UEC. Public does not know the truth.',
    defaultState: 'UNLOCKED',
    stateLabel: 'HOMEWORLD',
    risk: 'High',
    knownByPlayer: true,
    travelRequirements: 'FTL jump to Sol. Earth Command patrols and Chen-loyal fleet units make open approach extremely dangerous.',
    primaryFaction: 'Earth Command (United Earth) — compromised by Admiral Chen',
    mainPurpose: 'Expose the truth to Earth, win over loyal captains, protect the homeworld from the claim, and root out shapeshifter infiltration.',
    unlockTrigger: 'Known from the start — it is humanity\'s homeworld. But safe travel requires evading Chen\'s fleet and finding sympathizers.',
    missionTriggers: [
      'Broadcast evidence to Earth public.',
      'Meet a loyal Earth Command captain willing to defect.',
      'Infiltrate Kepler Station to capture the Chen shapeshifter.',
      'Smuggle evidence to a free press outlet.',
      'Rally colonies to pressure Earth Command.',
      'Chen issues an arrest warrant for Captain Stellar.'
    ],
    arrivalEvents: [
      'Earth Command patrol intercepts and demands surrender.',
      'A sympathetic captain quietly warns of a trap.',
      'Public broadcast sparks riots or hope depending on proof.',
      'Shapeshifter agent detected among the crew that greets you.',
      'Mitchell reacts to someone who "feels wrong."'
    ],
    ifIgnored: 'Chen Countermeasures and Public Truth stagnate; Chen consolidates control; Earth remains in the dark while the claim advances.',
    possibleRewards: ['Earth fleet defections', 'public uprising', 'Chen exposed', 'Public Truth surge'],
    possibleConsequences: ['arrest or destruction', 'fratricidal fleet battle', 'civilian panic', 'Confluence enforcement summoned'],
    relatedNpcs: ['Admiral Chen', 'Sarah Chen', 'Captain Myers', 'Farrah Thorne'],
    relatedEvidence: ['Prometheus Warning', 'Sakura-Chen Technology Exchange', 'Sarah Chen Testimony'],
    relatedClocks: ['chen_countermeasures', 'public_truth', 'confluence_claim'],
    arrivalScene: 'Sol\'s sun flares on the sensor rim. Earth Command traffic is dense and watchful. A patrol cruiser breaks formation and moves to intercept, hailing on a channel that feels too official. Somewhere down there, eight billion people still do not know what is coming.',
    spoilerLevel: 'none',
    locked: false
  },
  {
    key: 'novara_system',
    label: 'Novara System',
    aliases: ['Novara'],
    description: "Lost colony sold to Collector's Guild. Survivors may exist as contract labor.",
    defaultState: 'RUMORED',
    stateLabel: 'LOST COLONY',
    risk: 'High',
    knownByPlayer: true,
    travelRequirements: 'Coordinates obscured. Requires the Novara Transaction Record, a captured Guild route map, or a defector broker to pinpoint.',
    primaryFaction: "Collector's Guild (leaseholders)",
    mainPurpose: 'Find and free Novara survivors held as contract labor; prove the colony was sold.',
    unlockTrigger: 'Unlocked by studying the Novara Transaction Record, interrogating a Guild broker, or following a Collector\'s Guild route.',
    missionTriggers: [
      'Decode the Novara Transaction Record for last-known coordinates.',
      'Track a Guild prisoner transport.',
      'Follow a Guild auction route.',
      'Capture a Guild broker and extract the lease registry.',
      'Receive a distress signal from Novara descendants.'
    ],
    arrivalEvents: [
      'Silent, automated trade beacons mark a populated "asset route."',
      'Shielded cargo containers carry hundreds of biological life signs.',
      'A Novara descendant recognizes the Pathfinder\'s name.',
      'Guild broker offers information in exchange for protection.',
      'Confluence enforcement responds to the disruption.'
    ],
    ifIgnored: 'Survivors are moved deeper into Confluence territory; the trail goes cold; Novara becomes a footnote.',
    possibleRewards: ['freed colonists', 'slavery proof', 'Resistance Spark', 'Guild route intel'],
    possibleConsequences: ['Confluence Heat spike', 'Guild retaliation', 'moral cost of choosing the few vs. the many'],
    relatedNpcs: ['Sarah Chen', 'Admiral Chen'],
    relatedEvidence: ['Novara Transaction Record', 'Sakura-Chen Technology Exchange', 'Sanctuary Archive Records'],
    relatedClocks: ['confluence_heat', 'public_truth', 'resistance_spark'],
    arrivalScene: 'The ship emerges near a silent trade lane marked by automated beacons. Cargo signatures pass through the dark: water, metals, machinery... and several hundred biological life signs packed into shielded containers. Someone down there is being inventoried.',
    spoilerLevel: 'none',
    locked: false
  },
  {
    key: 'sanctuary_fleet',
    label: 'Sanctuary Fleet',
    aliases: ['Sanctuary', 'Sanctuary refugee fleet'],
    description: 'Refugee allies. Mobile, fragile, politically complicated.',
    defaultState: 'UNLOCKED',
    stateLabel: 'ALLY BASE',
    risk: 'Medium',
    knownByPlayer: true,
    travelRequirements: 'Encrypted rendezvous coordinates held by Sarah Chen and the Sanctuary Council. Fleet moves to avoid detection.',
    primaryFaction: 'Sanctuary Council',
    mainPurpose: 'Mobile refugee ally fleet and political/military support base. Resupply, recruit, repair, coordinate the resistance.',
    unlockTrigger: 'Already known after Arc 1. Begins UNLOCKED or ACTIVE.',
    missionTriggers: [
      'Sanctuary requests supplies.',
      'Councilor Verath asks for a strategy meeting.',
      'Commander Vex reports Confluence scouts nearby.',
      'A refugee ship breaks formation.',
      'Sanctuary Trust drops and must be repaired.',
      'Sanctuary offers evacuation support for New Titan.'
    ],
    arrivalEvents: [
      'Meet with Councilor Verath.',
      'Inspect refugee ships and hear their stories.',
      'Recruit volunteers for the resistance.',
      'Resolve a species dispute.',
      'Upgrade the Pathfinder with alien tech.',
      'Defend the fleet from a Confluence patrol.'
    ],
    ifIgnored: 'Sanctuary Trust drops. Refugee ships may scatter or refuse future aid. The fleet could be found and processed.',
    possibleRewards: ['alien tech upgrades', 'volunteers', 'intelligence', 'political support', 'Sanctuary Trust'],
    possibleConsequences: ['fleet vulnerability', 'political fracturing', 'refugee losses if attacked'],
    relatedNpcs: ['Councilor Verath', 'Commander Vex', 'Sarah Chen', 'James Stellar', 'Mitchell'],
    relatedEvidence: ['Sanctuary Archive Records', 'Sarah Chen Testimony'],
    relatedClocks: ['sanctuary_trust', 'resistance_spark', 'confluence_heat'],
    arrivalScene: 'Thirty-seven refugee ships drift in a coordinated holding pattern, hulls patched with a dozen species\' engineering. Councilor Verath\'s shuttle is already approaching. Commander Vex reports a long-range contact that may be Confluence scouts. The fleet is glad to see the Pathfinder — and afraid of what following it will cost.',
    spoilerLevel: 'none',
    locked: false
  },
  {
    key: 'confluence_space',
    label: 'Confluence Space',
    aliases: ['Confluence territory'],
    description: 'Legal courts, enforcement routes, data archives, claim offices. High danger.',
    defaultState: 'UNLOCKED',
    stateLabel: 'DANGEROUS',
    risk: 'Extreme',
    knownByPlayer: true,
    travelRequirements: 'Known after Arc 1, but travel requires intelligence, a stealth route, forged legal access, Unity help, or captured Confluence data to avoid enforcement.',
    primaryFaction: 'The Confluence',
    mainPurpose: 'High-risk enemy territory: legal courts, claim offices, archives, prisons, enforcement routes. Infiltrate, steal, sabotage, rescue.',
    unlockTrigger: 'Known after Arc 1; safe travel requires stealth route, forged legal access, Unity help, or captured Confluence data.',
    missionTriggers: [
      'Infiltrate a legal archive.',
      'Steal claim records.',
      'Rescue prisoners from a Confluence holding facility.',
      'Sabotage enforcement logistics.',
      'Attend or disrupt a Confluence hearing.',
      'Track a shapeshifter handler.',
      'Locate Omega-Seven or another black site.'
    ],
    arrivalEvents: [
      'Legal challenge filed against the Pathfinder.',
      'Patrol encounter — evade or be boarded.',
      'Shapeshifter trap sprung.',
      'Confluence envoy offers a "deal."',
      'Prisoner convoy detected.',
      'Court records reveal which colony is next.'
    ],
    ifIgnored: 'Confluence Claim and Confluence Heat advance in the background. New colonies are processed unopposed.',
    possibleRewards: ['claim records', 'freed prisoners', 'legal precedent', 'black-site intel', 'Public Truth'],
    possibleConsequences: ['capture', 'Pathfinder seizure', 'crew replacement by shapeshifters', 'extreme Confluence Heat'],
    relatedNpcs: ['Captain Vask', 'Nexus-Seven', 'Admiral Chen'],
    relatedEvidence: ['Korath Database', 'Sanctuary Archive Records', 'Architect Future-History Data'],
    relatedClocks: ['confluence_heat', 'confluence_claim', 'public_truth'],
    arrivalScene: 'The Pathfinder drops out of FTL near a dark legal relay station. No weapons lock immediately, which somehow feels worse. Hayes reports encrypted court traffic. Clark detects prisoner registry pings. Mitchell becomes very still.',
    spoilerLevel: 'none',
    locked: false
  },
  {
    key: 'vescarri_sovereignty_space',
    label: 'Vescarri Sovereignty Space',
    aliases: ['Vescarri space'],
    description: 'Species claiming Earth. Ancient seeding records may be here.',
    defaultState: 'RUMORED',
    stateLabel: 'LEGAL ADVERSARY',
    risk: 'High',
    knownByPlayer: true,
    travelRequirements: 'No exact coordinates. Requires investigating the Vescarri claim, obtaining seeding records, interrogating a Confluence legal agent, or studying the Korath Database.',
    primaryFaction: 'Vescarri Sovereignty',
    mainPurpose: 'Home territory of the species claiming Earth through ancient seeding rights. Find proof the claim is fraudulent or manipulated.',
    unlockTrigger: 'Unlocked by investigating the Vescarri claim, obtaining seeding records, interrogating a Confluence legal agent, or studying the Korath Database.',
    missionTriggers: [
      'Search for the original seeding records.',
      'Prove the Vescarri claim is fraudulent.',
      'Negotiate with Vescarri claim-lords.',
      'Discover the Vescarri are also being manipulated by The Confluence.',
      'Steal genetic/legal evidence.',
      'Find proof Earth was altered by someone else after Vescarri seeding.'
    ],
    arrivalEvents: [
      'Formal legal challenge issued.',
      'Diplomatic audience granted.',
      'Trial by evidence.',
      'Vescarri hunter ships intercept the Pathfinder.',
      'Mitchell senses deception in a Vescarri witness.',
      'Future memory reveals part of the claim is not what it seems.'
    ],
    ifIgnored: 'The Vescarri claim strengthens and Confluence Claim rises; Earth\'s legal defense weakens.',
    possibleRewards: ['fraud proof', 'Vescarri defectors', 'legal precedent against the claim', 'Public Truth'],
    possibleConsequences: ['Vescarri hostility', 'legal trap', 'Confluence enforcement summoned'],
    relatedNpcs: ['Vescarri Claim-Lords', 'Mitchell', 'Professor Carmelon'],
    relatedEvidence: ['Korath Database', 'Prometheus Warning', 'Sanctuary Archive Records'],
    relatedClocks: ['confluence_claim', 'public_truth'],
    arrivalScene: 'Vescarri claim-stations orbit a crystalline archive world. Hail comes in formal, ancient legal phrasing: "Present your standing before the sovereignty, or withdraw." Mitchell tilts his head at the envoy on the view-screen and does not relax.',
    spoilerLevel: 'none',
    locked: false
  },
  {
    key: 'collectors_guild_routes',
    label: "Collector's Guild Routes",
    aliases: ['Collectors Guild Routes', 'Guild Routes'],
    description: 'Trade lanes where populations are moved, leased, cataloged, sold.',
    defaultState: 'RUMORED',
    stateLabel: 'TRAFFICKING LANES',
    risk: 'High',
    knownByPlayer: true,
    travelRequirements: 'No fixed location. Requires the Novara Transaction Record, freed prisoner testimony, Sanctuary Archive Records, or captured Confluence data to plot a route.',
    primaryFaction: "Collector's Guild",
    mainPurpose: 'Trade lanes where captured populations are moved, leased, cataloged, sold, or reassigned. Raid convoys, free prisoners, prove slavery.',
    unlockTrigger: 'Unlocked through the Novara Transaction Record, freed prisoner testimony, Sanctuary Archive Records, or captured Confluence data.',
    missionTriggers: [
      'Locate Novara survivors on a Guild route.',
      'Intercept a prisoner transport.',
      'Follow a Guild auction route.',
      'Rescue cataloged children, families, or workers.',
      'Capture a Guild broker.',
      'Plant a tracker on a population shipment.',
      'Obtain proof that "contract labor" is slavery.'
    ],
    arrivalEvents: [
      'Convoy raid opportunity.',
      'Undercover auction discovered.',
      'Moral choice: rescue a few now or track the route to save many later.',
      'Guild broker offers information for protection.',
      'Confluence enforcement ship responds.'
    ],
    ifIgnored: 'Prisoners are moved deeper into Confluence territory and become harder to rescue; the slavery proof ages.',
    possibleRewards: ['freed prisoners', 'slavery proof', 'Novara survivors', 'Guild route maps', 'Public Truth'],
    possibleConsequences: ['Confluence Heat spike', 'Guild retaliation', 'moral cost', 'captured crew'],
    relatedNpcs: ["Guild Brokers", 'Sarah Chen', 'Admiral Chen'],
    relatedEvidence: ['Novara Transaction Record', 'Sanctuary Archive Records', 'Sakura-Chen Technology Exchange'],
    relatedClocks: ['confluence_heat', 'public_truth', 'resistance_spark'],
    arrivalScene: 'The ship emerges near a silent trade lane marked by automated beacons. Cargo signatures pass through the dark: water, metals, machinery... and several hundred biological life signs packed into shielded containers. A Guild broker\'s automated hail pings the Pathfinder, offering "a courtesy catalog."',
    spoilerLevel: 'none',
    locked: false
  },
  {
    key: 'architect_sites',
    label: 'Architect Sites',
    aliases: ['Architect ruins'],
    description: 'Ancient temporal structures. Future memories, time anomalies.',
    defaultState: 'LOCKED',
    stateLabel: 'TEMPORAL',
    risk: 'Unknown',
    knownByPlayer: true,
    travelRequirements: 'No stable coordinates. Sites surface through Architect Future-History Data, temporal flashes, Mitchell warnings, or high Temporal Instability.',
    primaryFaction: 'None — ancient, abandoned',
    mainPurpose: 'Ancient temporal ruins tied to future memories, timeline instability, and the long-term defeat of The Confluence.',
    unlockTrigger: 'Unlocked through Architect Future-History Data, temporal flashes, Mitchell warnings, Sanctuary Archive Records, or high Temporal Instability.',
    missionTriggers: [
      'Investigate a temporal anomaly.',
      'Recover an Architect map fragment.',
      'Stabilize future-memory data.',
      'Learn why The Confluence fears Architect technology.',
      'Prevent Confluence excavation of an Architect ruin.',
      'Contact a future echo.',
      'Learn about Future Unity.'
    ],
    arrivalEvents: [
      'Time distortion — past/future versions of events appear.',
      'Crew memories conflict; no one agrees on what just happened.',
      'Mitchell becomes agitated and refuses to enter.',
      'Unity reacts strangely to the site.',
      'Bub sees possible futures branching from current choices.'
    ],
    ifIgnored: 'Temporal Instability may rise. The Confluence may acquire Architect data first and learn to counter the future-memory advantage.',
    possibleRewards: ['future-memory stabilization', 'timeline fragments', 'anti-Confluence precedent', 'Future Unity contact'],
    possibleConsequences: ['Temporal Instability surge', 'paradox', 'crew psychological damage', 'Confluence acquires the site'],
    relatedNpcs: ['Mitchell', 'James Stellar', 'Professor Carmelon'],
    relatedEvidence: ['Architect Future-History Data', 'Sanctuary Archive Records'],
    relatedClocks: ['temporal_instability'],
    arrivalScene: 'The ruin hangs in a dead orbit, geometry that hurts to look at. Instruments disagree on the time. Mitchell screams and will not enter the structure. Clark\'s scan shows two versions of the Pathfinder already docked — one of them transmitting a distress call that has not been sent yet.',
    spoilerLevel: 'partial',
    locked: false
  },
  {
    key: 'lost_human_colonies',
    label: 'Lost Human Colonies',
    aliases: ['Lost colonies'],
    description: 'Human worlds Earth forgot, abandoned, or never knew survived.',
    defaultState: 'RUMORED',
    stateLabel: 'UNCHARTED',
    risk: 'Variable',
    knownByPlayer: true,
    travelRequirements: 'No central coordinates. Requires Sarah Chen, Korath data, Novara records, captured Confluence maps, or refugee testimony to locate individual colonies.',
    primaryFaction: 'Varies — isolated colonial governments',
    mainPurpose: 'Human worlds Earth forgot, abandoned, or never knew survived. Recruit them, rescue them, or discover they have already been compromised.',
    unlockTrigger: 'Unlocked through Sarah Chen, Korath data, Novara records, captured Confluence maps, or refugee testimony.',
    missionTriggers: [
      'Find a lost colony before The Confluence does.',
      'Convince a forgotten settlement to join the resistance.',
      'Discover a colony already working with The Confluence.',
      'Rescue colonists from "contract" processing.',
      'Learn a colony has developed its own strange culture, laws, or technology.',
      'Find evidence that Earth Command hid these colonies.'
    ],
    arrivalEvents: [
      'First contact with isolated humans.',
      'Colony distrusts Earth and the Pathfinder.',
      'A Confluence claim is already pending.',
      'The local leader may be human, collaborator, or shapeshifter.',
      'Future memory hints this colony matters later.'
    ],
    ifIgnored: 'Lost colonies may be claimed, sold, hidden, or turned against the resistance.',
    possibleRewards: ['new allies', 'unique tech', 'population', 'Resistance Spark', 'Public Truth'],
    possibleConsequences: ['colony falls', 'collaborator exposure', 'shapeshifter infiltration', 'diplomatic failure'],
    relatedNpcs: ['Sarah Chen', 'James Stellar', 'Mitchell'],
    relatedEvidence: ['Novara Transaction Record', 'Korath Database', 'Sarah Chen Testimony', 'Sanctuary Archive Records'],
    relatedClocks: ['resistance_spark', 'public_truth', 'confluence_claim'],
    arrivalScene: 'A colony beacon answers in an old Earth dialect nobody on the bridge recognizes. They have not heard from Earth Command in generations. They are not sure they want to hear from the Pathfinder now. Mitchell watches the colony leader on the screen and offers no reassurance.',
    spoilerLevel: 'none',
    locked: false
  },
  {
    key: 'dead_civilization_graveyards',
    label: 'Dead Civilization Graveyards',
    aliases: ['Graveyards', 'Dead worlds'],
    description: 'Worlds destroyed by The Confluence. Archaeology, warnings, records.',
    defaultState: 'UNLOCKED',
    stateLabel: 'WARNING',
    risk: 'Medium-High',
    knownByPlayer: true,
    travelRequirements: 'Coordinates held from the Korath Graveyard and Sanctuary Archive Records. Some require captured Confluence star charts.',
    primaryFaction: 'None — dead worlds, automated defenses',
    mainPurpose: 'Ruins of civilizations destroyed, processed, or erased by The Confluence. Recover warnings, weapons, precedent, and tech.',
    unlockTrigger: 'Unlocked through the Korath Database, James Stellar testimony, Sanctuary Archive Records, or Confluence star charts.',
    missionTriggers: [
      'Search for anti-Confluence weapons.',
      'Recover warning records.',
      'Learn how a previous species failed.',
      'Find a survivor AI, ghost archive, or hidden refugee vault.',
      'Discover legal precedent that can be used against The Confluence.',
      'Recover tech for Pathfinder upgrades.'
    ],
    arrivalEvents: [
      'Ruin exploration.',
      'Automated defenses activate.',
      'Confluence scavengers already present.',
      'Emotional crew reaction to genocide evidence.',
      'Mitchell senses old terror or truth.',
      'Future memory shows the same fate could happen to humanity.'
    ],
    ifIgnored: 'The resistance loses possible evidence, tech, and warnings; The Confluence may scavenge the sites first.',
    possibleRewards: ['anti-Confluence precedent', 'salvage tech', 'warning records', 'survivor AI', 'Pathfinder upgrades'],
    possibleConsequences: ['automated defense damage', 'Confluence ambush', 'crew trauma', 'temporal echoes'],
    relatedNpcs: ['James Stellar', 'Professor Carmelon', 'Mitchell'],
    relatedEvidence: ['Korath Database', 'Sanctuary Archive Records', 'Architect Future-History Data'],
    relatedClocks: ['crew_morale', 'temporal_instability', 'resistance_spark'],
    arrivalScene: 'The system is dead. Three shattered planets orbit a dying star. The ruins are ancient, but the warning beacon is still transmitting one phrase in a thousand languages: "Do not accept their law." Mitchell lands on the hull window and stares down at the graveyard in silence.',
    spoilerLevel: 'none',
    locked: false
  },
  {
    key: 'cygnu_442_omega_seven',
    label: 'Cygnu-442 / Omega-Seven',
    aliases: ['Omega-Seven', 'Cygnu-442', 'Crimson Nebula'],
    description: 'Confluence black-site prison in the Crimson Nebula. Emerges after the black-site thread unlocks.',
    defaultState: 'UNKNOWN',
    stateLabel: 'BLACK SITE',
    risk: 'Extreme',
    knownByPlayer: false,
    travelRequirements: 'Location sealed until the black-site thread unlocks. Requires captured shapeshifter memory or a defector with coordinates.',
    primaryFaction: 'The Confluence (Enforcement)',
    mainPurpose: 'Confluence black-site prison holding ~200 prisoners from 43 species, guarded by 100 guards across 3 orbital platforms. The real Admiral Chen may be held here.',
    unlockTrigger: 'Unlocks after the Chen replacement mystery or Sarah\'s "my mother is alive" revelation (~40 hrs playtime, Living Timeline).',
    missionTriggers: [
      'Extract the real Admiral Chen.',
      'Free political prisoners who can testify.',
      'Seize black-site records.',
      'Sabotage the orbital platforms.',
      'Discover who else has been replaced.'
    ],
    arrivalEvents: [
      'Nebula disrupts standard sensors — stealth possible but blind.',
      'Orbital patrol sweep.',
      'A prisoner recognizes James Stellar.',
      'The "Admiral Chen" held here is not what Sarah expected.'
    ],
    ifIgnored: 'Prisoners are relocated or executed; the truth about the replacements is lost.',
    possibleRewards: ['real Admiral Chen', 'prisoner testimony', 'replacement proof', 'Public Truth surge'],
    possibleConsequences: ['Confluence Heat spike', 'Sarah psychological trauma', 'crew losses', 'capture'],
    relatedNpcs: ['Admiral Chen', 'Sarah Chen', 'James Stellar'],
    relatedEvidence: ['Architect Future-History Data', 'Sanctuary Archive Records'],
    relatedClocks: ['confluence_heat', 'public_truth', 'crew_morale'],
    arrivalScene: 'Sealed until discovered through play.',
    spoilerLevel: 'full',
    locked: true
  },
  {
    key: 'kepler_station',
    label: 'Kepler Station (Earth Orbital)',
    aliases: ['Kepler Station'],
    description: 'Primary UE military station in Earth orbit. Where the Chen shapeshifter can be captured via covert infiltration.',
    defaultState: 'RUMORED',
    stateLabel: 'MILITARY',
    risk: 'High',
    knownByPlayer: true,
    travelRequirements: 'FTL to Sol, then a covert approach to Earth orbit. Requires loyal Earth contacts or forged clearance.',
    primaryFaction: 'Earth Command (United Earth)',
    mainPurpose: 'Primary UE military station. A covert infiltration here can expose or capture the Chen shapeshifter.',
    unlockTrigger: 'Unlocked once the player has evidence of Chen replacement and a plan to infiltrate Earth orbit.',
    missionTriggers: [
      'Infiltrate the station under forged orders.',
      'Capture the Chen shapeshifter for interrogation.',
      'Recruit a loyal station officer.',
      'Seize Chen\'s private comms logs.',
      'Extract before the deception unravels.'
    ],
    arrivalEvents: [
      'Identity challenge at docking.',
      'A loyal officer quietly offers help.',
      'Mitchell reacts to the "wrong" Chen.',
      'Shapeshifter realizes it is being hunted.'
    ],
    ifIgnored: 'The Chen shapeshifter tightens control; the replacement program continues unexposed.',
    possibleRewards: ['Chen replacement proof', 'loyal defectors', 'Earth Command split', 'Public Truth'],
    possibleConsequences: ['capture', 'fleet battle', 'exposed infiltration', 'crew replacement risk'],
    relatedNpcs: ['Admiral Chen', 'Sarah Chen', 'Captain Myers'],
    relatedEvidence: ['Sarah Chen Testimony', 'Sakura-Chen Technology Exchange'],
    relatedClocks: ['chen_countermeasures', 'public_truth', 'confluence_heat'],
    arrivalScene: 'Kepler Station turns slowly above Earth, bristling with Earth Command insignia. Docking control asks for clearance codes that may or may not still be valid. Somewhere aboard, the woman wearing Admiral Chen\'s face is giving orders.',
    spoilerLevel: 'partial',
    locked: false
  },
  {
    key: 'gungi_belt',
    label: 'Gungi Belt',
    aliases: ['Gungi Belt debris fields'],
    description: 'Deep-space region where fake "pirate attacks" occurred. Debris holds evidence of Confluence ambushes and shapeshifter replacements.',
    defaultState: 'RUMORED',
    stateLabel: 'EVIDENCE FIELD',
    risk: 'Medium-High',
    knownByPlayer: true,
    travelRequirements: 'Coordinates from Korath data or a captured Confluence star chart. Debris fields are navigational hazards.',
    primaryFaction: 'None — debris and ghosts',
    mainPurpose: 'Investigate the wreckage of "pirate attacks" that were really Confluence ambushes covering shapeshifter replacements.',
    unlockTrigger: 'Unlocked after the player investigates Reeves debris or hears refugee testimony about missing ships.',
    missionTriggers: [
      'Salvage a black box from a "pirate attack."',
      'Find a replacement-program transport wreck.',
      'Recover bodies that are not human.',
      'Trace the ambush pattern to other victims.',
      'Build the systemic conspiracy case.'
    ],
    arrivalEvents: [
      'Debris field navigation hazard.',
      'A wreck logs a final transmission naming Confluence ships.',
      'A "body" is recovered that is clearly not the logged crew member.',
      'Confluence salvage team arrives to clean up evidence.'
    ],
    ifIgnored: 'Evidence is cleaned up or drifts apart; the systemic conspiracy stays hidden.',
    possibleRewards: ['replacement proof', 'conspiracy evidence', 'salvage', 'Public Truth'],
    possibleConsequences: ['navigation damage', 'Confluence ambush', 'crew unease'],
    relatedNpcs: ['James Stellar', 'Lieutenant Reeves'],
    relatedEvidence: ['Korath Database', 'Novara Transaction Record', 'Sanctuary Archive Records'],
    relatedClocks: ['public_truth', 'confluence_heat', 'chen_countermeasures'],
    arrivalScene: 'The Gungi Belt is a graveyard of honest wrecks. Debris spins in the scan-light. A hull fragment still bears the registry of a ship Earth Command listed as "lost to pirates." The black box is pinging. So is something else.',
    spoilerLevel: 'partial',
    locked: false
  }
];

// === HELPERS ===

// Resolve the live state of a location from the campaign, falling back to its default.
export function getLocationState(campaign, locationKey) {
  const live = campaign?.world_state?.location_states?.[locationKey];
  if (live && LOCATION_STATES[live]) return live;
  const loc = CODEX_LOCATIONS.find((l) => l.key === locationKey);
  return loc ? loc.defaultState : 'UNKNOWN';
}

// Look up a location codex entry by name (fuzzy) — used by UI and dossier linking.
export function findLocationEntry(name) {
  const key = codexKey(name);
  return CODEX_LOCATIONS.find(
    (l) =>
      codexKey(l.label) === key ||
      (l.aliases || []).some((a) => codexKey(a) === key)
  );
}

// Whether a location should be shown at all (hide UNKNOWN unless spoiler-safe flag).
export function isLocationVisible(campaign, loc) {
  const state = getLocationState(campaign, loc.key);
  if (state === 'UNKNOWN' && loc.spoilerLevel === 'full') return false;
  return true;
}