// Pathfinder Journeys — Sandbox Clocks system
// Story pressure meters, not spreadsheets.
// The AI GM manages clocks; the player only needs to understand:
// 1. what is getting better, 2. what is getting worse, 3. why it changed, 4. what they can do about it.

// === CLOCK TIERS (generic color bands + labels) ===
export const CLOCK_TIERS = [
  { max: 24, label: 'Low', color: 'bg-emerald-600', text: 'text-emerald-400', dot: 'bg-emerald-500' },
  { max: 49, label: 'Watch', color: 'bg-amber-600', text: 'text-amber-400', dot: 'bg-amber-500' },
  { max: 74, label: 'Danger', color: 'bg-orange-600', text: 'text-orange-400', dot: 'bg-orange-500' },
  { max: 89, label: 'Critical', color: 'bg-red-600', text: 'text-red-400', dot: 'bg-red-500' },
  { max: 100, label: 'Crisis', color: 'bg-red-700', text: 'text-red-500', dot: 'bg-red-600' }
];

// === MAIN SANDBOX CLOCKS (always tracked, always in Codex) ===
export const PJ_CLOCKS_FULL = [
  {
    key: 'confluence_claim',
    label: 'Confluence Claim',
    highIsBad: true,
    start: 70,
    mainVisible: false,
    crisisClock: false,
    statusLabels: [
      { max: 24, label: 'Contested' },
      { max: 49, label: 'Advancing' },
      { max: 74, label: 'Dangerous' },
      { max: 89, label: 'Critical' },
      { max: 100, label: 'Imminent' }
    ],
    whatItMeans: 'How close The Confluence legal process is to declaring ownership over Earth, New Titan, or other human colonies. If this reaches 100, The Confluence can declare legal processing rights.',
    whyHigh: [
      'Time has passed without contesting the claim.',
      'Colonies failed to mount a legal defense.',
      'Confluence victories strengthened their legal precedent.'
    ],
    howToLower: [
      'Present strong evidence in Confluence legal channels.',
      'Inspire public resistance that forces reconsideration.',
      'Rescue witnesses who can testify against the claim.',
      'Expose Confluence fraud or legal manipulation.'
    ],
    howToRise: [
      'Ignoring legal summons or deadlines.',
      'Confluence victories or enforcement actions.',
      'Colonies surrendering without contest.',
      'Time passing without action.'
    ],
    whatCanIDo: [
      'Gather evidence and prepare a legal case.',
      'Rally colonies to contest the claim together.',
      'Find species who previously defeated Confluence claims.',
      'Expose the Vescarri seeding claim as fraud.'
    ]
  },
  {
    key: 'confluence_heat',
    label: 'Confluence Heat',
    highIsBad: true,
    start: 65,
    mainVisible: true,
    crisisClock: false,
    statusLabels: [
      { max: 24, label: 'Quiet' },
      { max: 49, label: 'Watch' },
      { max: 74, label: 'Dangerous' },
      { max: 89, label: 'Critical' },
      { max: 100, label: 'Crisis' }
    ],
    whatItMeans: 'How much hostile attention The Confluence is giving the Pathfinder and Captain Stellar. Higher Heat means more hunters, shapeshifters, legal threats, and enforcement ships.',
    whyHigh: [
      'You escaped Sanctuary with refugees.',
      'You possess evidence The Confluence wants destroyed.',
      'New Titan is already under claim.',
      'You broadcast the first resistance message.'
    ],
    howToLower: [
      'Stay quiet and avoid public broadcasts.',
      'Use false trails and misdirection.',
      'Move through hidden routes and uncharted systems.',
      'Let time pass without provocative action.'
    ],
    howToRise: [
      'Publicly expose Confluence crimes.',
      'Destroy Confluence assets or ships.',
      'Rescue prisoners from Confluence custody.',
      'Humiliate a Confluence envoy.',
      'Recruit colonies openly.'
    ],
    whatCanIDo: [
      'Go dark — minimize transmissions.',
      'Plant false sensor trails to confuse pursuit.',
      'Travel through uncharted systems.',
      'Use Sanctuary contacts for safe routes.'
    ]
  },
  {
    key: 'chen_countermeasures',
    label: 'Chen Countermeasures',
    highIsBad: true,
    start: 35,
    mainVisible: false,
    crisisClock: false,
    statusLabels: [
      { max: 24, label: 'Calm' },
      { max: 49, label: 'Watchful' },
      { max: 74, label: 'Active' },
      { max: 89, label: 'Aggressive' },
      { max: 100, label: 'Overwhelming' }
    ],
    whatItMeans: 'How aggressively Admiral Chen or Earth Command is acting against the Pathfinder. Higher values mean arrest orders, propaganda, fleet pursuit, sabotage, and political isolation.',
    whyHigh: [
      'You defied Earth Command orders.',
      'You broadcast evidence against Chen.',
      'You approached protected colonies.',
      'Chen fears exposure of her dealings.'
    ],
    howToLower: [
      'Gather evidence quietly before going public.',
      'Convince Earth captains with verifiable proof.',
      'Prove Confluence infiltration of Earth Command.',
      'Find allies within Earth Command who distrust Chen.'
    ],
    howToRise: [
      'Publicly accuse Chen without proof.',
      'Attack Earth Command assets.',
      'Approach Earth-controlled colonies openly.',
      'Interfere with Chen\'s political operations.'
    ],
    whatCanIDo: [
      'Build a case with hard evidence first.',
      'Reach out privately to loyal captains.',
      'Investigate shapeshifter infiltration of Earth Command.',
      'Find political allies who can counter Chen.'
    ]
  },
  {
    key: 'new_titan_stability',
    label: 'New Titan Stability',
    highIsBad: false,
    start: 50,
    mainVisible: true,
    crisisClock: false,
    statusLabels: [
      { max: 24, label: 'Collapsing' },
      { max: 49, label: 'Shaky' },
      { max: 74, label: 'Uncertain' },
      { max: 89, label: 'Stable' },
      { max: 100, label: 'United' }
    ],
    whatItMeans: 'How calm, organized, and unified New Titan is. High Stability means the colony can prepare, debate, defend, and survive. Low Stability means panic, surrender factions, riots, or Confluence control.',
    whyHigh: [
      'The colony is still processing what is happening.',
      'Leaders are divided on how to respond.',
      'Some factions want to surrender; others want to fight.',
      'Confluence agents may be operating inside.'
    ],
    howToLower: [
      'Cause public panic without preparation.',
      'Allow Confluence propaganda to spread.',
      'Delay action while the claim advances.',
      'Let hidden agents destabilize the government.'
    ],
    howToRise: [
      'Speak honestly to Governor Thorne.',
      'Share encrypted evidence with the Colonial Council.',
      'Find and neutralize Confluence agents.',
      'Offer a practical defense plan.',
      'Give the council time to process before going public.'
    ],
    whatCanIDo: [
      'Speak with Governor Thorne.',
      'Share evidence with the Colonial Council.',
      'Find Confluence agents operating on New Titan.',
      'Avoid causing public panic.',
      'Offer a practical defense plan.'
    ]
  },
  {
    key: 'resistance_spark',
    label: 'Resistance Spark',
    highIsBad: false,
    start: 20,
    mainVisible: true,
    crisisClock: false,
    statusLabels: [
      { max: 24, label: 'Flickering' },
      { max: 49, label: 'Smoldering' },
      { max: 74, label: 'Growing' },
      { max: 89, label: 'Blazing' },
      { max: 100, label: 'Wildfire' }
    ],
    whatItMeans: 'How much hope the Pathfinder has created across human and alien space. High Resistance Spark causes colonies, refugees, defectors, and hidden allies to reach out and join the fight.',
    whyHigh: [
      'The resistance is only beginning.',
      'The galaxy is watching to see if Captain Stellar can make defiance real.',
      'Most people still believe resistance is impossible.'
    ],
    howToLower: [
      'Abandon allies in danger.',
      'Hide too long without action.',
      'Suffer public defeats.',
      'Break promises to refugees or colonies.'
    ],
    howToRise: [
      'Save people in danger.',
      'Broadcast the truth to the galaxy.',
      'Refuse to surrender against impossible odds.',
      'Protect the weak and vulnerable.',
      'Win battles that prove resistance works.'
    ],
    whatCanIDo: [
      'Broadcast evidence of Confluence crimes.',
      'Rescue prisoners and refugees.',
      'Win a visible victory against Confluence forces.',
      'Let Hayes prepare inspiring resistance messages.',
      'Recruit colonies and species to the cause.'
    ]
  },
  {
    key: 'sanctuary_trust',
    label: 'Sanctuary Trust',
    highIsBad: false,
    start: 55,
    mainVisible: false,
    crisisClock: false,
    statusLabels: [
      { max: 24, label: 'Wary' },
      { max: 49, label: 'Cautious' },
      { max: 74, label: 'Trusted' },
      { max: 89, label: 'Committed' },
      { max: 100, label: 'Devoted' }
    ],
    whatItMeans: 'How much the Sanctuary refugees and alien allies trust Captain Stellar. High trust unlocks ships, intelligence, volunteers, alien technology, and political support.',
    whyHigh: [
      'Sanctuary is cautious but hopeful.',
      'They want to believe the Pathfinder can change the war.',
      'Their trust must be earned through actions, not words.'
    ],
    howToLower: [
      'Use refugees as shields or bargaining chips.',
      'Ignore Sanctuary concerns and requests.',
      'Break agreements or promises.',
      'Cause civilian losses through reckless action.'
    ],
    howToRise: [
      'Protect refugees at personal cost.',
      'Respect alien allies and their customs.',
      'Keep promises and follow through.',
      'Avoid reckless sacrifice of allies.'
    ],
    whatCanIDo: [
      'Protect refugee ships during combat.',
      'Consult Sanctuary Council on major decisions.',
      'Share evidence and intelligence with allies.',
      'Respect alien customs and needs.',
      'Keep promises — do not abandon allies.'
    ]
  },
  {
    key: 'crew_morale',
    label: 'Crew Morale',
    highIsBad: false,
    start: 85,
    mainVisible: true,
    crisisClock: false,
    statusLabels: [
      { max: 24, label: 'Breaking' },
      { max: 49, label: 'Strained' },
      { max: 74, label: 'Steady' },
      { max: 89, label: 'Strong' },
      { max: 100, label: 'Inspired' }
    ],
    whatItMeans: 'The emotional strength, loyalty, and confidence of the Pathfinder crew. High morale improves performance and willingness to take risks. Low morale causes fear, mistakes, arguments, or refusal of orders.',
    whyHigh: [
      'The crew believes in Captain Stellar.',
      'They survived Arc 1 together.',
      'They carry future memories of eventual victory.'
    ],
    howToLower: [
      'Take casualties through bad tactics.',
      'Lie to the crew or hide the truth.',
      'Send them on hopeless missions.',
      'Ignore crew concerns and welfare.',
      'Make moral compromises that sicken them.'
    ],
    howToRise: [
      'Give clear, honest leadership.',
      'Save lives whenever possible.',
      'Win victories that prove the cause is real.',
      'Hold honest briefings — trust the crew with the truth.',
      'Protect individual crew members.'
    ],
    whatCanIDo: [
      'Hold a crew briefing — be honest about the situation.',
      'Listen to crew concerns in private.',
      'Protect your people — don\'t treat them as expendable.',
      'Win a victory that proves the mission is possible.',
      'Ask Farrah Thorne for a morale assessment.'
    ]
  },
  {
    key: 'temporal_instability',
    label: 'Temporal Instability',
    highIsBad: true,
    start: 15,
    mainVisible: false,
    crisisClock: false,
    statusLabels: [
      { max: 24, label: 'Stable' },
      { max: 49, label: 'Ripple' },
      { max: 74, label: 'Unstable' },
      { max: 89, label: 'Volatile' },
      { max: 100, label: 'Collapsing' }
    ],
    whatItMeans: 'How much the campaign is being affected by future memories, Architect technology, paradox, or time interference. High instability may unlock future warnings and strange events, but also dangerous paradoxes.',
    whyHigh: [
      'Bub carries encoded memories of a 473-year future war.',
      'The Architect Protocol was activated.',
      'Future memories are surfacing more frequently.'
    ],
    howToLower: [
      'Let events unfold naturally without interference.',
      'Avoid overusing future knowledge.',
      'Stabilize Architect systems when encountered.',
      'Accept that not every future memory must be acted on.'
    ],
    howToRise: [
      'Use future knowledge too directly or openly.',
      'Activate Architect technology recklessly.',
      'Change events you remember from the future.',
      'Talk about future memories in front of others.'
    ],
    whatCanIDo: [
      'Use future memories cautiously — as warnings, not scripts.',
      'Let Clark analyze Architect data before acting.',
      'Avoid changing events you remember from the future.',
      'Talk to James about Confluence-era temporal science.',
      'Watch Mitchell for temporal disturbance reactions.'
    ]
  },
  {
    key: 'public_truth',
    label: 'Public Truth',
    highIsBad: false,
    start: 10,
    mainVisible: true,
    crisisClock: false,
    statusLabels: [
      { max: 24, label: 'Hidden' },
      { max: 49, label: 'Whispered' },
      { max: 74, label: 'Emerging' },
      { max: 89, label: 'Spreading' },
      { max: 100, label: 'Known' }
    ],
    whatItMeans: 'How much the public knows about The Confluence, Admiral Chen, Novara, New Titan, and the larger conspiracy. High truth can inspire resistance, but if raised too quickly without proof, it may cause panic or disbelief.',
    whyHigh: [
      'Most people still do not know the truth.',
      'The Confluence controls legal and media narratives.',
      'Chen\'s propaganda is effective.',
      'Evidence exists but has not been released.'
    ],
    howToLower: [
      'Allow Chen\'s propaganda to spread unchallenged.',
      'Stay silent too long.',
      'Lose or fail to protect evidence.',
      'Let Confluence legal manipulation censor the truth.'
    ],
    howToRise: [
      'Broadcast evidence to the public.',
      'Release prisoner testimony.',
      'Cause public Confluence failures.',
      'Let Hayes prepare controlled, verified broadcasts.'
    ],
    whatCanIDo: [
      'Release evidence carefully — with context.',
      'Find witnesses who can testify.',
      'Let Hayes prepare a controlled broadcast.',
      'Convince New Titan leaders privately first.',
      'Avoid dumping everything publicly before people are ready.'
    ]
  }
];

// === CRISIS CLOCKS (hidden until triggered) ===
export const CRISIS_CLOCKS = [
  {
    key: 'harvester_arrival',
    label: 'Harvester Arrival',
    highIsBad: true,
    start: 0,
    mainVisible: false,
    crisisClock: true,
    trigger: (campaign) => campaign?.arc2_unlocks?.harvester_word === true,
    statusLabels: [
      { max: 24, label: 'Distant' },
      { max: 49, label: 'Approaching' },
      { max: 74, label: 'Imminent' },
      { max: 89, label: 'Impact Imminent' },
      { max: 100, label: 'Catastrophe' }
    ],
    whatItMeans: 'The Harvester — a moon-sized biological pacification asset — is inbound. If it reaches a populated world and detects the population, mass death is likely. This is an extreme Confluence response to sustained defiance.',
    whyHigh: [
      'The Confluence has classified Bub\'s resistance as a biological threat.',
      'The Harvester was awakened as a response to defiance.',
      'It is slow but inevitable once deployed.'
    ],
    howToLower: [
      'Evacuate the target population before arrival.',
      'Find a way to mask the population\'s biological signature.',
      'Negotiate or deceive the Confluence into recalling it.',
      'Find ancient technology that can deter biological assets.'
    ],
    howToRise: [
      'Continued open defiance of Confluence authority.',
      'Destroying Confluence enforcement assets.',
      'Inspiring mass resistance that threatens Confluence control.',
      'Time passing without resolution.'
    ],
    whatCanIDo: [
      'Warn the target population immediately.',
      'Begin emergency evacuation planning.',
      'Ask Clark about masking biological signatures.',
      'Consult James about Confluence biological assets.',
      'Consider desperate diplomacy to buy time.'
    ]
  },
  {
    key: 'mission_exposure',
    label: 'Mission Exposure',
    highIsBad: true,
    start: 0,
    mainVisible: false,
    crisisClock: true,
    trigger: (campaign, clocks, location) => {
      const loc = (location || '').toLowerCase();
      return loc.includes('confluence') || loc.includes('court') || loc.includes('archive');
    },
    statusLabels: [
      { max: 24, label: 'Clean' },
      { max: 49, label: 'Noticed' },
      { max: 74, label: 'Watched' },
      { max: 89, label: 'Exposed' },
      { max: 100, label: 'Compromised' }
    ],
    whatItMeans: 'How visible the Pathfinder\'s current mission is to Confluence surveillance. High exposure means the mission may be compromised, intercepted, or anticipated. This clock is active when operating in or near Confluence space.',
    whyHigh: [
      'You are operating in Confluence-monitored space.',
      'Your transmissions are being intercepted.',
      'Confluence sensors have detected your ship.',
      'Your mission profile is being analyzed.'
    ],
    howToLower: [
      'Minimize transmissions — go silent.',
      'Use encrypted channels and burst transmissions.',
      'Move through sensor shadows and debris fields.',
      'Have Clark mask your ship\'s signature.'
    ],
    howToRise: [
      'Broadcasting openly in Confluence space.',
      'Approaching Confluence facilities directly.',
      'Being detected by Confluence patrols.',
      'Leaving obvious sensor trails.'
    ],
    whatCanIDo: [
      'Go dark — minimize all transmissions.',
      'Ask Clark to mask the ship\'s signature.',
      'Use debris fields and sensor shadows.',
      'Send burst transmissions only when necessary.',
      'Have Reeves plot an evasion route.'
    ]
  },
  {
    key: 'shapeshifter_suspicion',
    label: 'Shapeshifter Suspicion',
    highIsBad: true,
    start: 0,
    mainVisible: false,
    crisisClock: true,
    trigger: (campaign) => {
      const flags = campaign?.world_state?.quest_flags || {};
      return flags.shapeshifter_encountered === true || campaign?.arc2_unlocks?.chen_wrong === true;
    },
    statusLabels: [
      { max: 24, label: 'None' },
      { max: 49, label: 'Suspected' },
      { max: 74, label: 'Investigating' },
      { max: 89, label: 'Confirmed' },
      { max: 100, label: 'Paranoia' }
    ],
    whatItMeans: 'How much evidence suggests shapeshifter infiltration of the crew, allies, or leadership. High suspicion means someone may not be who they appear to be. Trust is fraying.',
    whyHigh: [
      'A shapeshifter infiltrator was caught at Sanctuary.',
      'Others may already be hidden inside human society.',
      'Some leaders\' behavior changed inexplicably.',
      'The systemic replacement program is vast.'
    ],
    howToLower: [
      'Find verifiable evidence of who is real and who is not.',
      'Use Mitchell\'s instinct to detect deception.',
      'Establish trust protocols and verification methods.',
      'Investigate carefully without accusing the innocent.'
    ],
    howToRise: [
      'Making unproven accusations publicly.',
      'Trust the wrong person with critical information.',
      'Ignore warning signs of replacement.',
      'Let paranoia fracture the crew or alliance.'
    ],
    whatCanIDo: [
      'Watch Mitchell — he senses deception and temporal disturbance.',
      'Establish verification protocols for sensitive information.',
      'Investigate quietly — don\'t accuse without proof.',
      'Ask Sarah Chen about her mother\'s changed behavior.',
      'Look for the Gungi Belt debris field evidence.'
    ]
  },
  {
    key: 'unity_expansion',
    label: 'Unity Expansion',
    highIsBad: false,
    start: 0,
    mainVisible: false,
    crisisClock: true,
    trigger: (campaign) => campaign?.arc2_unlocks?.unity === true,
    statusLabels: [
      { max: 24, label: 'Dormant' },
      { max: 49, label: 'Stirring' },
      { max: 74, label: 'Growing' },
      { max: 89, label: 'Expanding' },
      { max: 100, label: 'Ascendant' }
    ],
    whatItMeans: 'How much the Unity collective — a sentient nanite entity — has grown, learned, and bonded. Unity starts as a curious, dangerous stranger and can become a powerful ally or a fearful, defensive force depending on how the player treats it.',
    whyHigh: [
      'Unity is learning and evolving.',
      'It is drawn to the Pathfinder and Mitchell.',
      'It wants to understand humanity and individuality.'
    ],
    howToLower: [
      'Treat Unity as a tool or weapon — it becomes colder.',
      'Threaten or attempt to destroy it.',
      'Restrict its access to resources and information.'
    ],
    howToRise: [
      'Treat Unity as a person, not a tool.',
      'Protect individuals — Unity values individual lives.',
      'Allow it access to resources and systems.',
      'Let it bond with Mitchell and the crew.'
    ],
    whatCanIDo: [
      'Speak to Unity directly — treat it as a person.',
      'Allow it to repair systems and help the crew.',
      'Protect individuals — Unity values individual lives.',
      'Let it bond with Mitchell.',
      'Be honest — Unity detects deception like Mitchell does.'
    ]
  },
  {
    key: 'new_titan_evacuation',
    label: 'New Titan Evacuation',
    highIsBad: true,
    start: 0,
    mainVisible: false,
    crisisClock: true,
    trigger: (campaign, clocks) => {
      const stab = clocks?.new_titan_stability ?? 50;
      return stab < 25;
    },
    statusLabels: [
      { max: 24, label: 'None' },
      { max: 49, label: 'Planning' },
      { max: 74, label: 'Urgent' },
      { max: 89, label: 'Critical' },
      { max: 100, label: 'Failing' }
    ],
    whatItMeans: 'The state of emergency evacuation efforts on New Titan. This clock appears only when New Titan Stability has collapsed. High values mean evacuation is underway but failing — millions are at risk.',
    whyHigh: [
      'New Titan Stability has collapsed.',
      'The colony is panicking or under attack.',
      'Evacuation infrastructure is overwhelmed.',
      'Confluence forces are closing in.'
    ],
    howToLower: [
      'Stabilize the government and restore order.',
      'Bring in allied ships to help evacuate.',
      'Create safe corridors for civilian transport.',
      'Buy time against Confluence enforcement.'
    ],
    howToRise: [
      'Delay action while the colony falls.',
      'Lose evacuation ships to enemy fire.',
      'Allow Confluence forces to blockade the system.',
      'Fail to rally support from allies.'
    ],
    whatCanIDo: [
      'Rally Sanctuary ships for evacuation support.',
      'Ask Reeves for emergency jump corridor options.',
      'Contact Governor Thorne for evacuation coordination.',
      'Defend evacuation corridors from Confluence forces.',
      'Stabilize New Titan Stability — address the root cause.'
    ]
  },
  {
    key: 'omega_seven_alert',
    label: 'Omega-Seven Alert',
    highIsBad: true,
    start: 0,
    mainVisible: false,
    crisisClock: true,
    trigger: (campaign) => campaign?.arc2_unlocks?.black_site === true,
    statusLabels: [
      { max: 24, label: 'Inactive' },
      { max: 49, label: 'Monitoring' },
      { max: 74, label: 'Active' },
      { max: 89, label: 'Critical' },
      { max: 100, label: 'Breach' }
    ],
    whatItMeans: 'Alert status for Omega-Seven, a Confluence black-site prison in the Crimson Nebula where the real Admiral Chen may be held. This clock appears only when the black-site thread has been discovered through play.',
    whyHigh: [
      'You have learned about Omega-Seven.',
      'The Confluence knows you are aware of the prison.',
      'Security at the black site is increasing.',
      'The real Admiral Chen\'s situation is deteriorating.'
    ],
    howToLower: [
      'Avoid approaching the system directly.',
      'Gather intelligence before any rescue attempt.',
      'Use stealth and infiltration rather than assault.',
      'Find defectors who know the facility layout.'
    ],
    howToRise: [
      'Approach the Crimson Nebula openly.',
      'Attempt a frontal assault on the prison.',
      'Alert Confluence forces to your interest in the facility.',
      'Let too much time pass — Chen\'s situation worsens.'
    ],
    whatCanIDo: [
      'Gather intelligence on the facility layout.',
      'Find defectors or former prisoners who know Omega-Seven.',
      'Plan a stealth infiltration, not an assault.',
      'Consult Sarah Chen — her mother may be there.',
      'Use Clark to hack Confluence security data.'
    ]
  }
];

// === SCENE-BASED MAIN CLOCK SELECTION ===
// Main screen shows only the 4 most relevant clocks for the current scene.
export const SCENE_CLOCKS = {
  new_titan: ['new_titan_stability', 'confluence_heat', 'public_truth', 'crew_morale'],
  confluence_space: ['confluence_heat', 'mission_exposure', 'crew_morale', 'public_truth'],
  architect_event: ['temporal_instability', 'crew_morale', 'confluence_heat', 'resistance_spark'],
  default: ['confluence_heat', 'crew_morale', 'resistance_spark', 'public_truth']
};

// === HELPER FUNCTIONS ===
export function getAllClocks() {
  return [...PJ_CLOCKS_FULL, ...CRISIS_CLOCKS];
}

export function findClock(key) {
  return getAllClocks().find((c) => c.key === key);
}

export function getClockValue(campaign, key) {
  const clocks = campaign?.world_state?.quest_flags?.campaign_clocks || {};
  const clock = findClock(key);
  return typeof clocks[key] === 'number' ? clocks[key] : (clock?.start ?? 0);
}

export function getClockTier(val) {
  const clamped = Math.max(0, Math.min(100, val));
  for (const tier of CLOCK_TIERS) {
    if (clamped <= tier.max) return tier;
  }
  return CLOCK_TIERS[CLOCK_TIERS.length - 1];
}

export function getClockStatus(clock, val) {
  const labels = clock.statusLabels || CLOCK_TIERS;
  const clamped = Math.max(0, Math.min(100, val));
  for (const tier of labels) {
    if (clamped <= tier.max) return tier;
  }
  return labels[labels.length - 1];
}

export function isCrisisClockVisible(campaign, clock) {
  if (!clock.crisisClock) return true;
  if (clock.trigger) {
    const flags = campaign?.world_state?.quest_flags || {};
    const clocks = flags.campaign_clocks || {};
    const location = flags.current_location || campaign?.current_scene || '';
    return clock.trigger(campaign, clocks, location);
  }
  return false;
}

export function getVisibleMainClocks(campaign) {
  const flags = campaign?.world_state?.quest_flags || {};
  const location = (flags.current_location || campaign?.current_scene || '').toLowerCase();
  const clocks = flags.campaign_clocks || {};

  let sceneKey = 'default';
  if (location.includes('new titan') || location.includes('mining colon')) sceneKey = 'new_titan';
  else if (location.includes('confluence') || location.includes('court') || location.includes('archive')) sceneKey = 'confluence_space';
  else if (flags.architect_event || campaign?.arc2_unlocks?.first_echo) sceneKey = 'architect_event';

  const sceneClocks = SCENE_CLOCKS[sceneKey] || SCENE_CLOCKS.default;

  const visible = sceneClocks.filter((key) => {
    const clock = findClock(key);
    if (!clock) return false;
    if (clock.crisisClock) return isCrisisClockVisible(campaign, clock);
    return true;
  });

  if (visible.length < 4) {
    const fallback = SCENE_CLOCKS.default.filter((k) => !visible.includes(k));
    for (const key of fallback) {
      if (visible.length >= 4) break;
      const clock = findClock(key);
      if (clock && !clock.crisisClock) visible.push(key);
    }
  }

  return visible.slice(0, 4);
}