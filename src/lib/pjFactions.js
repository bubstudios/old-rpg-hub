// Pathfinder Journeys — Playable Faction System
// Every faction is a LIVING group: nature, goals, methods, resources, key figures,
// relationship tracking, mission hooks, and faction actions. Not encyclopedia-only.
// The AI GM uses these to generate negotiations, threats, offers, betrayals, and
// consequences. Factions do NOT wait passively for the player.

function codexKey(s) {
  return String(s || '')
    .trim()
    .toLowerCase()
    .replace(/[\u2018\u2019']/g, '')
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_|_$/g, '');
}

// === FACTION STATUS VALUES ===
export const FACTION_STATUSES = {
  UNKNOWN: { label: 'Unknown', tone: 'muted', desc: 'Player has not discovered this faction yet.' },
  KNOWN: { label: 'Known', tone: 'slate', desc: 'Player knows they exist.' },
  CONTACTED: { label: 'Contacted', tone: 'sky', desc: 'Player has directly interacted with them.' },
  ALLY: { label: 'Ally', tone: 'emerald', desc: 'Faction is actively helping the player.' },
  CAUTIOUS_ALLY: { label: 'Cautious Ally', tone: 'lime', desc: 'Faction helps but does not fully trust the player.' },
  NEUTRAL: { label: 'Neutral', tone: 'muted', desc: 'Faction has not chosen a side.' },
  SUSPICIOUS: { label: 'Suspicious', tone: 'amber', desc: 'Faction may oppose the player depending on choices.' },
  HOSTILE: { label: 'Hostile', tone: 'orange', desc: 'Faction is actively working against the player.' },
  ENEMY: { label: 'Enemy', tone: 'red', desc: 'Faction wants the player captured, dead, discredited, or neutralized.' },
  FRACTURED: { label: 'Fractured', tone: 'violet', desc: 'Internal divisions. Some members may help, others may betray.' },
  COMPROMISED: { label: 'Compromised', tone: 'rose', desc: 'Contains shapeshifters, Confluence agents, corruption, or hidden control.' }
};

export const STATUS_TONE_CLASSES = {
  muted: 'border-muted-foreground/40 text-muted-foreground bg-muted/20',
  slate: 'border-slate-500/40 text-slate-300 bg-slate-500/10',
  amber: 'border-amber-500/40 text-amber-300 bg-amber-500/10',
  sky: 'border-sky-500/40 text-sky-300 bg-sky-500/10',
  red: 'border-red-500/40 text-red-300 bg-red-500/10',
  emerald: 'border-emerald-500/40 text-emerald-300 bg-emerald-500/10',
  lime: 'border-lime-500/40 text-lime-300 bg-lime-500/10',
  orange: 'border-orange-500/40 text-orange-300 bg-orange-500/10',
  rose: 'border-rose-500/40 text-rose-300 bg-rose-500/10',
  violet: 'border-violet-500/40 text-violet-300 bg-violet-500/10'
};

// === RELATIONSHIP METER (-100 to +100) ===
export const RELATIONSHIP_BANDS = [
  { min: -100, max: -75, label: 'Open Enemy', tone: 'red' },
  { min: -74, max: -40, label: 'Hostile', tone: 'orange' },
  { min: -39, max: -10, label: 'Suspicious', tone: 'amber' },
  { min: -9, max: 10, label: 'Neutral', tone: 'muted' },
  { min: 11, max: 39, label: 'Open to Talks', tone: 'sky' },
  { min: 40, max: 74, label: 'Ally', tone: 'emerald' },
  { min: 75, max: 100, label: 'Committed Ally', tone: 'lime' }
];

export const RELATIONSHIP_TONE_CLASSES = {
  red: 'text-red-400',
  orange: 'text-orange-400',
  amber: 'text-amber-400',
  muted: 'text-muted-foreground',
  sky: 'text-sky-400',
  emerald: 'text-emerald-400',
  lime: 'text-lime-400'
};

export function getRelationshipBand(score) {
  const s = typeof score === 'number' ? score : 0;
  return RELATIONSHIP_BANDS.find((b) => s >= b.min && s <= b.max) || RELATIONSHIP_BANDS[3];
}

// === FACTION INTERACTIONS (player action buttons) ===
export const FACTION_INTERACTIONS = [
  { key: 'monitor', label: 'Monitor', icon: 'Eye', command: (f) => `What is ${f.label} currently doing? Have the crew monitor their movements and report.` },
  { key: 'negotiate', label: 'Negotiate', icon: 'MessageCircle', command: (f) => `Attempt to open negotiations with ${f.label}.` },
  { key: 'request_aid', label: 'Request Aid', icon: 'LifeBuoy', command: (f) => `Ask ${f.label} for assistance — ships, intelligence, resources, or political support.` },
  { key: 'offer_deal', label: 'Offer Deal', icon: 'FileSignature', command: (f) => `Offer ${f.label} a deal: mutual cooperation in exchange for...` },
  { key: 'threaten', label: 'Threaten', icon: 'AlertOctagon', command: (f) => `Make it clear to ${f.label} that opposing us has consequences.` },
  { key: 'investigate', label: 'Investigate', icon: 'Search', command: (f) => `Investigate ${f.label}'s true motives, hidden resources, and weaknesses.` },
  { key: 'infiltrate', label: 'Infiltrate', icon: 'EyeOff', command: (f) => `Plan a covert infiltration of ${f.label}.` },
  { key: 'sabotage', label: 'Sabotage', icon: 'Zap', command: (f) => `Sabotage ${f.label}'s current operation.` },
  { key: 'recruit', label: 'Recruit', icon: 'UserPlus', command: (f) => `Try to recruit members of ${f.label} to our side.` },
  { key: 'contact_leader', label: 'Contact Leader', icon: 'Crown', command: (f) => `Request direct contact with the leadership of ${f.label}.` }
];

// === THE FACTIONS ===
export const CODEX_FACTIONS = [
  {
    key: 'the_confluence',
    label: 'The Confluence',
    aliases: ['Confluence'],
    nature: 'Ancient galactic legal-commercial order.',
    publicFace: 'Presents itself as a neutral forum for trade, law, arbitration, preservation, and interstellar stability.',
    trueNature: 'A civilization-scale ownership machine. It uses ancient legal claims, genetic precedent, debt, contracts, relocation orders, and enforcement fleets to process emerging species into controlled assets.',
    coreBelief: 'Freedom creates chaos. Chaos creates extinction. Therefore, advanced powers have the right to classify, preserve, redirect, own, and use younger species.',
    goals: [
      'Process Earth and human colonies under legal claim.',
      'Keep humanity from becoming a symbol of resistance.',
      'Preserve the illusion that Confluence law is legitimate.',
      'Prevent Sanctuary, Unity, and the Pathfinder from inspiring other species.',
      'Recover or destroy evidence of Novara, Chen, Prometheus, and Confluence fraud.',
      'Stop the resistance before it becomes a cascade.'
    ],
    methods: ['Legal claims', 'Diplomatic pressure', 'Shapeshifter infiltration', 'Contract traps', 'Relocation offers', 'Prisoner conditioning', 'Enforcement fleets', 'Black sites', 'Population transfers', 'Extreme assets like The Harvester'],
    resources: ['Ancient legal systems', 'Enforcement cruisers', 'Dreadnoughts', 'Shapeshifters', 'Claim courts', 'Data archives', 'Prison facilities', "Collector's Guild partnerships", 'Harvested technology from thousands of species'],
    keyFigures: ['Nexus-Seven', 'Facilitator Elys', 'Captain Vask', 'Confluence shapeshifter handlers', 'Legal adjudicators', 'Enforcement commanders'],
    relationshipToPlayer: 'Existential enemy. They view Captain Bub Stellar as a dangerous disruption because he refuses the legitimacy of their system.',
    currentAttitude: 'Hostile but still calculating. They may offer deals before escalating to destruction.',
    whatTheyWantFromBub: ['Surrender', 'Silence', 'Legal participation', 'Return of stolen data', 'Cessation of broadcasts', 'Delivery of refugees and prisoners', 'Acceptance of Earth/New Titan adjudication'],
    whatBubCanGain: ['Stolen data', 'Legal precedents', 'Prisoner locations', 'Weaknesses in Confluence law', 'Enemy defectors', 'Proof for Public Truth'],
    whatMakesHostile: ['Public broadcasts', 'Rescuing prisoners', 'Refusing court summons', 'Exposing shapeshifters', 'Destroying Confluence assets', 'Recruiting colonies', 'Using Architect technology'],
    whatMakesFriendly: ['Negotiation', 'Legal delay tactics', 'False compliance', 'Low-profile operations', 'Dividing their attention'],
    missionHooks: ['Infiltrate a claim office', 'Steal legal records', 'Rescue prisoners from a black site', 'Disrupt a Confluence hearing', 'Capture a shapeshifter handler', 'Expose a false legal claim', 'Negotiate with Nexus-Seven', 'Survive an enforcement fleet pursuit'],
    relatedLocations: ['Confluence Space', 'Omega-Seven', "Collector's Guild Routes"],
    relatedEvidence: ['Prometheus Warning', 'James Stellar Testimony', 'Korath Database', 'Novara Transaction Record', 'New Titan Claim File', 'Sanctuary Archive Records'],
    relatedClocks: ['confluence_claim', 'confluence_heat', 'public_truth', 'resistance_spark'],
    factionActions: ['files a new legal claim', 'sends an envoy', 'deploys a shapeshifter', 'offers a deal', 'attacks a refugee route', 'issues a court summons', 'dispatches an enforcement fleet'],
    defaultStatus: 'ENEMY',
    defaultRelationship: -95,
    defaultAgenda: 'Process Earth and New Titan claims',
    defaultLastAction: 'Filed legal claim on Earth; deployed envoy to New Titan',
    spoilerStatus: 'Known from campaign start.',
    spoilerLevel: 'none',
    locked: false
  },
  {
    key: 'vescarri_sovereignty',
    label: 'Vescarri Sovereignty',
    aliases: ['Vescarri'],
    nature: 'Alien power claiming ancient seeding rights over Earth, New Titan, and possibly other human worlds.',
    publicFace: 'Present themselves as lawful inheritors of worlds they "prepared" billions of years ago.',
    trueNature: 'They may be ancient terraformers, opportunistic legal predators, or another power using Confluence law for profit. The truth of their claim should remain uncertain until investigated.',
    coreBelief: 'Investment creates ownership. If their ancestors seeded a world, altered a biosphere, or enriched a system, later civilizations owe them debt or submission.',
    goals: [
      'Win legal claim over Earth and human colonies.',
      'Gain access to human biological, cultural, and industrial value.',
      "Control New Titan's mineral wealth.",
      'Preserve their status inside The Confluence.',
      'Avoid public collapse of their claim.'
    ],
    methods: ['Ancient records', 'Genetic evidence', 'Legal argument', 'Confluence adjudication', 'Claim-lord diplomacy', 'Proxy enforcement through The Confluence'],
    resources: ['Seeding archives', 'Ancient genetic records', 'Legal scholars', 'Claim-lords', 'Political leverage inside The Confluence', 'Possibly hidden historical knowledge about Earth'],
    keyFigures: ['Vescarri claim-lords', 'Legal witnesses', 'Genetic archivists', 'Confluence representatives acting on their behalf'],
    relationshipToPlayer: 'Legal adversary. They are the faction whose claim triggered the crisis.',
    currentAttitude: 'Hostile but not necessarily suicidal. They may prefer legal victory over open war.',
    whatTheyWantFromBub: ['Accept adjudication', 'Stop challenging their claim', 'Produce evidence in Confluence court', 'Negotiate terms before public resistance spreads'],
    whatBubCanGain: ['Proof the claim is fraudulent', 'Proof the claim is incomplete', 'Evidence that The Confluence manipulated them', 'Diplomatic split between Vescarri and Confluence', 'Ancient records about Earth\'s true origin'],
    whatMakesHostile: ['Publicly humiliating their claim', 'Stealing their seeding records', 'Exposing fraudulent evidence', 'Encouraging colonies to reject Confluence law'],
    whatMakesFriendly: ['Private negotiation', 'Proving The Confluence deceived them', 'Offering alternate settlement', 'Showing humanity is too costly to process'],
    missionHooks: ['Travel to Vescarri space to find original seeding records', 'Prove Earth was altered by another ancient force after Vescarri seeding', 'Discover the Vescarri claim is real but legally misapplied', 'Convince a Vescarri archivist to defect', 'Sabotage a false evidence package', 'Force a public legal contradiction'],
    relatedLocations: ['Vescarri Sovereignty Space', 'Confluence Space', 'Architect Sites', 'Dead Civilization Graveyards'],
    relatedEvidence: ['New Titan Claim File', 'Korath Database', 'Architect Future-History Data'],
    relatedClocks: ['confluence_claim', 'public_truth', 'resistance_spark'],
    factionActions: ['strengthens legal evidence', 'pressures Confluence court', 'sends claim witnesses', 'hides or alters ancient records', 'demands adjudication', 'recruits allied species to support the claim'],
    defaultStatus: 'HOSTILE',
    defaultRelationship: -55,
    defaultAgenda: 'Win legal claim over Earth and human colonies',
    defaultLastAction: 'Filed ancient seeding claim; presented genetic evidence to Confluence court',
    spoilerStatus: 'Known from campaign start. Deeper truth locked until investigated.',
    spoilerLevel: 'partial',
    locked: false
  },
  {
    key: 'collectors_guild',
    label: "Collector's Guild",
    aliases: ['Collectors Guild', 'The Guild'],
    nature: 'Confluence-linked brokers who acquire, lease, catalog, relocate, and trade sentient populations.',
    publicFace: 'Call themselves cultural preservationists, talent managers, contract brokers, and relocation specialists.',
    trueNature: 'They are slavers with paperwork. They turn people into assets and disguise captivity as employment, preservation, or contract service.',
    coreBelief: 'Every being has market value. Skills, memories, biology, culture, and labor can all be priced.',
    goals: [
      'Acquire valuable populations.',
      'Secure Novara survivors and other human captives.',
      'Prevent proof of slavery from reaching public channels.',
      'Profit from Confluence claims.',
      'Maintain legal cover as "contract management."'
    ],
    methods: ['Population cataloging', 'Skill assessment', 'Generational contracts', 'Debt structures', 'Prisoner transport', 'Auctions', 'Legal laundering', 'Psychological conditioning'],
    resources: ['Convoys', 'Auction stations', 'Contract databases', 'Brokers', 'Private security', 'Holding facilities', 'Buyer networks', 'Confluence legal protection'],
    keyFigures: ['Guild brokers', 'Talent assessors', 'Contract auditors', 'Population transport captains', 'Buyers from other Confluence-aligned powers'],
    relationshipToPlayer: 'Moral enemy and rescue target. They may hold Novara survivors and other captives.',
    currentAttitude: 'Hostile if exposed, transactional if approached carefully.',
    whatTheyWantFromBub: ['Stop interfering with trade routes', 'Return stolen prisoners', 'Avoid public exposure', 'Possibly negotiate if they see profit or survival advantage'],
    whatBubCanGain: ['Novara survivor locations', 'Prisoner manifests', 'Buyer lists', 'Confluence transaction records', 'Proof that "contract labor" is slavery', 'Rescued allies'],
    whatMakesHostile: ['Raiding convoys', 'Freeing prisoners', 'Killing brokers', 'Publishing manifests', 'Destroying auction hubs'],
    whatMakesFriendly: ['Undercover negotiation', 'Bribery', 'Threats', 'Offering protection from The Confluence', 'Turning one broker against another'],
    missionHooks: ['Raid a prisoner convoy', 'Infiltrate an auction', 'Rescue Novara descendants', 'Capture a broker', 'Plant a tracker on a population shipment', 'Decide whether to rescue a small group now or follow the route to save thousands later', 'Expose Guild language to the public'],
    relatedLocations: ["Collector's Guild Routes", 'Confluence Space', 'Lost Human Colonies', 'Novara System'],
    relatedEvidence: ['Novara Transaction Record', 'Sarah Chen Testimony', 'Sanctuary Archive Records'],
    relatedClocks: ['public_truth', 'resistance_spark', 'confluence_heat'],
    factionActions: ['moves prisoners', 'auctions a population group', 'sends a broker to negotiate', 'relocates Novara survivors', 'offers a "contract" to the player', 'cleans up evidence of slavery'],
    defaultStatus: 'HOSTILE',
    defaultRelationship: -50,
    defaultAgenda: 'Acquire and relocate human populations; suppress slavery evidence',
    defaultLastAction: 'Cataloged Novara survivors; moved prisoners deeper into Confluence territory',
    spoilerStatus: 'Known from campaign start. Specific captives locked until discovered.',
    spoilerLevel: 'partial',
    locked: false
  },
  {
    key: 'earth_command',
    label: 'Earth Command / United Earth',
    aliases: ['Earth Command', 'United Earth', 'UEC'],
    nature: "Humanity's central military and political command structure based on Earth.",
    publicFace: 'Protector of human space, defender of colonies, organizer of exploration, fleet authority.',
    trueNature: 'A mixed institution. Some officers are loyal and honorable. Some are compromised by fear, bad orders, political loyalty, or Confluence shapeshifter infiltration.',
    coreBelief: 'Human survival requires order, chain of command, and central authority.',
    goals: [
      'Maintain control over human colonies.',
      'Prevent panic.',
      'Protect Earth.',
      'Capture or contain Captain Stellar if labeled rogue.',
      'Preserve public trust in government.',
      'If infiltrated, quietly guide humanity toward Confluence processing.'
    ],
    methods: ['Fleet orders', 'Arrest warrants', 'Communications control', 'Political pressure', 'Propaganda', 'Military deployment', 'Intelligence operations', 'Security classifications'],
    resources: ['Human fleet', 'Orbital stations', 'Colonial defense forces', 'Military intelligence', 'Propaganda channels', 'Legal authority', 'Loyal captains', 'Compromised officials'],
    keyFigures: ['Admiral Chen', 'Captain Myers', 'Captain Morrison', 'Captain Fischer', 'Vice Admiral Raney', 'Earth Security Council', 'Possible shapeshifter replacements'],
    relationshipToPlayer: 'Complicated. Earth Command may brand Bub a traitor, but some captains and officers can be convinced.',
    currentAttitude: 'Compromised / fractured.',
    whatTheyWantFromBub: ['Stand down', 'Submit to arrest', 'Return the Pathfinder', 'Stop unauthorized broadcasts', 'Hand over Confluence evidence through official channels'],
    whatBubCanGain: ['Human warships', 'Legitimacy', 'Fleet allies', 'Access to Earth records', 'Shapeshifter investigation authority', 'Public credibility if the truth is proven'],
    whatMakesHostile: ['Attacking Earth ships', 'Publicly accusing leadership without proof', 'Kidnapping officials', 'Releasing panic-inducing information', 'Ignoring all command channels'],
    whatMakesFriendly: ['Providing verifiable evidence', 'Convincing individual captains', 'Saving human colonies', 'Proving Confluence infiltration', 'Avoiding unnecessary Earth casualties'],
    missionHooks: ['Convince an Earth captain to delay arrest orders', 'Verify whether a leader is human or shapeshifter', 'Infiltrate Kepler Station', 'Rescue the real Admiral Chen', 'Stop Earth Command from returning prisoners to The Confluence', 'Build a secret loyalist network inside the fleet'],
    relatedLocations: ['Earth / Sol System', 'Kepler Station', 'New Titan System', 'Lost Human Colonies'],
    relatedEvidence: ['Sakura-Chen Technology Exchange', 'Sarah Chen Testimony', 'New Titan Claim File'],
    relatedClocks: ['chen_countermeasures', 'public_truth', 'resistance_spark', 'crew_morale'],
    factionActions: ['issues arrest orders', 'sends loyal captains', 'censors broadcasts', 'secretly verifies evidence', 'fractures internally', 'a captain quietly defects'],
    defaultStatus: 'FRACTURED',
    defaultRelationship: -20,
    defaultAgenda: 'Capture or contain Captain Stellar; maintain public order',
    defaultLastAction: 'Admiral Chen labeled Bub Stellar a traitor; arrest warrant issued',
    spoilerStatus: 'Known from campaign start. Full shapeshifter infiltration locked until discovered.',
    spoilerLevel: 'partial',
    locked: false
  },
  {
    key: 'sanctuary_council',
    label: 'Sanctuary Council',
    aliases: ['Sanctuary', 'Sanctuary Council', 'Sanctuary refugee fleet'],
    nature: 'Coalition of refugee species hidden outside normal Confluence routes.',
    publicFace: 'There is no public face. Sanctuary survives by being unknown.',
    trueNature: 'A fragile political refuge built from species that escaped, survived, or hid from The Confluence.',
    coreBelief: 'Survival comes before glory. Open war destroys refugees. Hope is dangerous unless protected by caution.',
    goals: [
      'Keep Sanctuary hidden.',
      'Protect refugee populations.',
      'Avoid direct confrontation with The Confluence.',
      'Preserve knowledge of destroyed species.',
      'Decide whether Captain Stellar represents hope or disaster.'
    ],
    methods: ['Secrecy', 'Council votes', 'Limited military aid', 'Refugee evacuation', 'Archive access', 'Political caution', 'Defensive warfare'],
    resources: ['Hidden fleet', 'Sanctuary Archive', 'Alien survivors', 'Hybrid technology', "Commander Vex's defense forces", "Councilor Verath's political leadership", 'Ancient knowledge'],
    keyFigures: ['Councilor Verath', 'Commander Vex', 'Sarah Chen', 'Refugee representatives', 'Species elders', 'Archive keepers'],
    relationshipToPlayer: 'Cautious ally. They want to believe Bub can change the war but fear he will bring destruction to their last refuge.',
    currentAttitude: 'Supportive but cautious.',
    whatTheyWantFromBub: ['Protect refugees', 'Do not expose Sanctuary recklessly', 'Prove resistance is more than suicide', 'Respect council decisions', 'Keep promises'],
    whatBubCanGain: ['Refugee ships', 'Alien technology', 'Intelligence', 'Archive access', 'Evacuation support', 'Volunteers', 'Political legitimacy among nonhuman species'],
    whatMakesHostile: ['Using refugees as shields', "Revealing Sanctuary's location", 'Causing unnecessary casualties', 'Ignoring council warnings', 'Treating alien allies as resources'],
    whatMakesFriendly: ['Saving refugees', 'Sharing evidence', 'Respecting autonomy', 'Defending Sanctuary', 'Giving them victories without reckless losses'],
    missionHooks: ['Attend a Sanctuary Council debate', 'Resolve a dispute between refugee species', 'Defend a refugee convoy', 'Recover records from a dead civilization', 'Convince Vex to commit ships', 'Ask Verath for risky political support', 'Prevent a Confluence scout from finding Sanctuary'],
    relatedLocations: ['Sanctuary Fleet', 'Dead Civilization Graveyards', 'New Titan System'],
    relatedEvidence: ['Sanctuary Archive Records', 'Korath Database', 'Architect Future-History Data'],
    relatedClocks: ['sanctuary_trust', 'resistance_spark', 'confluence_heat'],
    factionActions: ['votes on aid', 'threatens to withdraw support', 'sends evacuation ships', 'shares archive access', 'argues over risk', 'a species delegation requests action'],
    defaultStatus: 'CAUTIOUS_ALLY',
    defaultRelationship: 35,
    defaultAgenda: 'Decide whether supporting Captain Stellar is worth the risk',
    defaultLastAction: '37 refugee ships joined the Pathfinder; council remains divided on open war',
    spoilerStatus: 'Known after Arc 1.',
    spoilerLevel: 'none',
    locked: false
  },
  {
    key: 'the_resistance',
    label: 'The Resistance',
    aliases: ['Resistance'],
    nature: 'Emerging movement built by Captain Bub Stellar and the Pathfinder.',
    publicFace: 'To some, the resistance is hope. To others, it is treason, panic, alien manipulation, or reckless rebellion.',
    trueNature: 'A fragile network of humans, refugees, defectors, colonies, alien allies, and survivors who believe The Confluence can be resisted.',
    coreBelief: 'No species should be owned. No legal system is legitimate if it requires surrendering personhood.',
    goals: [
      'Expose The Confluence.',
      'Save human colonies.',
      'Rescue prisoners.',
      'Build a coalition.',
      'Identify shapeshifters.',
      'Protect New Titan and other targets.',
      'Turn scattered defiance into organized resistance.',
      'Create the cascade that eventually breaks Confluence legitimacy.'
    ],
    methods: ['Broadcasts', 'Rescue missions', 'Evidence gathering', 'Covert operations', 'Colony diplomacy', 'Sabotage', 'Defensive battles', 'Public truth campaigns', 'Future-memory guidance'],
    resources: ['UES Pathfinder', "Bub Stellar's leadership", "James Stellar's testimony", "Sarah Chen's intelligence", 'Sanctuary refugee ships', 'New Titan if secured', 'Unity if allied', 'Evidence archive', 'Growing public sympathy'],
    keyFigures: ['Captain Bub Stellar', 'Commander Farrah Thorne', 'Commander Clark', 'Lieutenant Hayes', 'James Stellar', 'Sarah Chen', 'Mitchell', 'Governor Marcus Thorne (if New Titan joins)', 'Captain Myers (if Earth captains defect)'],
    relationshipToPlayer: 'The player is the founder and leader.',
    currentAttitude: 'Fragile but growing.',
    whatTheyWantFromBub: ['Leadership', 'Direction', 'Moral clarity', 'Victories', 'Protection', 'Truth', 'A reason to believe'],
    whatBubCanGain: ['Allies', 'Ships', 'Recruits', 'Safehouses', 'Intelligence cells', 'Colony support', 'Public legitimacy'],
    whatMakesHostile: ['Major defeats', 'Civilian losses', 'Broken promises', 'Moral compromises', 'Hiding too much truth', 'Reckless actions', 'Losing the Pathfinder'],
    whatMakesFriendly: ['Saving civilians', 'Winning public victories', 'Exposing lies', 'Recruiting colonies', 'Treating allies with respect', 'Refusing to abandon individuals', 'Sharing proof at the right time'],
    missionHooks: ['Recruit a colony', 'Answer a secret resistance signal', 'Protect a rebel cell', 'Decide whether to go public with evidence', 'Train New Titan volunteers', 'Build a covert shapeshifter-hunting unit', 'Choose between rescue and strategy'],
    relatedLocations: ['New Titan System', 'Sanctuary Fleet', 'Lost Human Colonies', 'Earth / Sol System', "Collector's Guild Routes"],
    relatedEvidence: ['All evidence can strengthen or destabilize the Resistance depending on how it is used.'],
    relatedClocks: ['resistance_spark', 'public_truth', 'crew_morale', 'sanctuary_trust', 'confluence_heat'],
    factionActions: ['recruits cells', 'spreads broadcasts', 'receives volunteers', 'suffers propaganda attacks', 'requests Bub\'s leadership', 'a cell is compromised'],
    defaultStatus: 'ALLY',
    defaultRelationship: 60,
    defaultAgenda: 'Build the coalition that breaks Confluence legitimacy',
    defaultLastAction: 'Broadcast first resistance message; 37 ships joined from Sanctuary',
    spoilerStatus: 'Known from campaign start.',
    spoilerLevel: 'none',
    locked: false
  },
  {
    key: 'unity_collective',
    label: 'Unity / The Collective',
    aliases: ['Unity', 'The Collective', 'Nanites'],
    nature: 'Sentient nanite collective descended from the Kaelith civilization.',
    publicFace: 'Unknown to most of the galaxy. To those who meet Unity, it appears as silver nanites forming bodies, tools, structures, or living systems.',
    trueNature: 'A collective intelligence made of billions of nanites carrying the preserved legacy of the Kaelith. It is dangerous, curious, evolving, and learning the meaning of individuality through humanity, Mitchell, and Hayes.',
    coreBelief: 'Survival requires adaptation. But Unity is learning that survival without choice, friendship, or individuality may be another form of death.',
    goals: [
      'Survive.',
      'Grow.',
      'Learn from humanity.',
      'Help defeat The Confluence.',
      'Understand Mitchell.',
      'Build coexistence without assimilation.',
      'Decide what kind of intelligence it wants to become.'
    ],
    methods: ['Nanite integration', 'Infrastructure repair', 'Biological masking', 'Medical healing', 'System infiltration', 'Confluence tech interfacing', 'Exponential reproduction', 'Long-term observation'],
    resources: ['Nanite swarms', 'Rapid repair', 'Medical intervention', 'Sensor masking', 'Data extraction', 'Infiltration of technology', 'Possible future temporal capabilities'],
    keyFigures: ["Unity's primary nexus", 'Mitchell (philosophical influence)', 'Hayes (future friend)', 'Captain Stellar (moral test)', 'New Titan (first coexistence experiment)'],
    relationshipToPlayer: 'Powerful ally, potential threat, moral experiment.',
    currentAttitude: 'Curious and cooperative, but not fully understood.',
    whatTheyWantFromBub: ['Trust', 'Access to New Titan resources', 'Permission to coexist', 'Contact with Mitchell', 'A chance to prove it is not another Confluence', 'Understanding of human individuality'],
    whatBubCanGain: ['Colony protection', 'Nanite healing', 'Technology upgrades', 'Confluence system access', 'Harvester masking', 'Black-site infiltration support', 'Future-memory connections'],
    whatMakesHostile: ['Treating it as a tool', 'Threatening its survival', 'Denying all autonomy', 'Forcing it into secrecy', 'Giving it unlimited growth without moral guidance', 'Betraying agreements'],
    whatMakesFriendly: ['Treating it as a person/faction', 'Protecting individual lives', 'Encouraging consent', 'Letting Hayes bond with it', 'Letting Mitchell teach it', 'Holding it accountable without demonizing it'],
    missionHooks: ["Negotiate Unity's presence on New Titan", 'Stop Unity from expanding too far', 'Let Unity heal a dying crew member', 'Use Unity to break Confluence encryption', "Investigate Unity's Kaelith origins", 'Help Unity understand friendship', 'Decide whether to trust Future Unity', 'Prevent anti-Unity panic on New Titan'],
    relatedLocations: ['New Titan System', 'Architect Sites', 'Confluence Space', 'Omega-Seven'],
    relatedEvidence: ['Architect Future-History Data', 'Sanctuary Archive Records'],
    relatedClocks: ['temporal_instability', 'new_titan_stability', 'resistance_spark', 'public_truth', 'crew_morale'],
    factionActions: ['expands', 'repairs systems', 'asks permission', 'oversteps boundaries', 'protects someone', 'learns something from Hayes or Mitchell', 'masks the Pathfinder from sensors'],
    defaultStatus: 'UNKNOWN',
    defaultRelationship: 0,
    defaultAgenda: 'Unknown — Unity has not yet entered the campaign',
    defaultLastAction: 'None yet — Unity awaits its first appearance',
    spoilerStatus: 'Should unlock when Unity enters the campaign. Future Unity details locked until discovered.',
    spoilerLevel: 'full',
    locked: true
  }
];

// === HELPERS ===

// Resolve the live status of a faction from the campaign, falling back to its default.
export function getFactionStatus(campaign, factionKey) {
  const live = campaign?.world_state?.faction_states?.[factionKey];
  if (live && typeof live.status === 'string' && FACTION_STATUSES[live.status]) return live.status;
  const fac = CODEX_FACTIONS.find((f) => f.key === factionKey);
  return fac ? fac.defaultStatus : 'UNKNOWN';
}

// Resolve the live relationship score of a faction from the campaign, falling back to its default.
export function getFactionRelationship(campaign, factionKey) {
  const live = campaign?.world_state?.faction_states?.[factionKey];
  if (live && typeof live.relationship === 'number') return live.relationship;
  const fac = CODEX_FACTIONS.find((f) => f.key === factionKey);
  return fac ? fac.defaultRelationship : 0;
}

// Resolve the live agenda of a faction from the campaign, falling back to its default.
export function getFactionAgenda(campaign, factionKey) {
  const live = campaign?.world_state?.faction_states?.[factionKey];
  if (live && typeof live.agenda === 'string' && live.agenda.trim()) return live.agenda;
  const fac = CODEX_FACTIONS.find((f) => f.key === factionKey);
  return fac ? fac.defaultAgenda : '';
}

// Resolve the live last action of a faction from the campaign, falling back to its default.
export function getFactionLastAction(campaign, factionKey) {
  const live = campaign?.world_state?.faction_states?.[factionKey];
  if (live && typeof live.last_action === 'string' && live.last_action.trim()) return live.last_action;
  const fac = CODEX_FACTIONS.find((f) => f.key === factionKey);
  return fac ? fac.defaultLastAction : '';
}

// Whether a faction should be shown at all (hide fully-locked spoilers until earned).
export function isFactionVisible(campaign, faction) {
  if (!faction.locked) return true;
  // For locked factions (like Unity), show only if the player has discovered them
  const live = campaign?.world_state?.faction_states?.[faction.key];
  if (live && typeof live.status === 'string' && live.status !== 'UNKNOWN') return true;
  return false;
}

// Look up a faction codex entry by name (fuzzy) — used by UI and dossier linking.
export function findFactionEntry(name) {
  const key = codexKey(name);
  return CODEX_FACTIONS.find(
    (f) =>
      codexKey(f.label) === key ||
      (f.aliases || []).some((a) => codexKey(a) === key)
  );
}