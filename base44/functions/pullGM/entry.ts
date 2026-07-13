import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

// ─── Province data (compact, for GM context) ───
const PROVINCES = {
  618: { n: 'Red Sand Camp', b: 'Red dunes, harsh sun, water scarcity, ruins, raiders, metal bird drone', d: 'Thirst, raiders, sand maws', npcs: 'Shard (leader — bald/scarred woman with the wrench who later names Bullet), Patch (healer), Maul (a CAMP MEMBER — mean, untrustworthy rival bruiser hostile to Bullet; NOT a raider, NOT connected to raiders), Spark (young inventor), Ash (cook/grower), Hawk (lookout), Cowboy (survivor/scavenger), Rivet (fighter)', e: 'Raiders, Sand Maw', c: 'Thirst, Camp Trust, Purifier Stability, Raider Threat', m: 'Help retrieve purifier core or follow the Pull alone', l: 'Metal bird scans Bullet and recognizes something. Etched symbol matches ruins.', t: 'Tutorial survival' },
  472: { n: 'The Water Block', b: 'Massive suspended block/cube of thick living liquid (NOT normal water). Breathing apparatus required. Alien ocean life, spined metallic creatures, pressure, blood in the water, blackout/memory fragments, vortex/current. An underwater dome is discovered INSIDE the murk — NOT the starting scene', d: 'Air depletion, pressure, spined creatures, Dreadwraith (revealed late, not at start)', npcs: 'Discovered later at the dome: Ember (dome leader), Thread (gentle weaver), Veil (suspicious diver), Glint (tech worker), Flicker (young trainee)', e: 'Spined Creatures (early), Dreadwraith (revealed during underwater battle — adaptive material hunter)', c: 'Air, Pressure, Swimming Fatigue, then Dome Stability, Air Supply, Dome Trust, then Dreadwraith Threat', m: 'Traverse the block, find the dome, survive the crisis, then fight the Dreadwraith and exit to Province 837', l: 'The block is not water. The Dreadwraith adapts to materials (liquid to solid to crystal to granite to exposed core). Bullet shatters its core with the pipe after pinning it in granite form beneath falling stone.', t: 'Liquid survival, dome discovery, first major monster' },
  837: { n: 'Digger/Borer Tunnels', b: 'Rock tunnels, root gardens, underground farms, First Sowing altar', d: 'Sentinels, Cragbeasts, faction war', npcs: 'Ridge, Vest, Flint, Drift, Stitch, Knot, Husk, Gash', e: 'Sentinel, Cragbeasts', c: 'Tunnel Stability, Faction Trust, First Sowing Truth, Sentinel Escalation', m: 'Side with Diggers, Borers, or broker a truce', l: 'First Sowing altar reveals Provinces were seeded — not natural.', t: 'Faction conflict and scarcity morality' },
  269: { n: 'Dream Jungle', b: 'Bioluminescent fungal jungle, spores, dream moss, trapped sleepers', d: 'Spore exposure, Weaver, identity loss', npcs: 'Glow, Sol, Lumen, Shade', e: 'Weaver / corrupted Hive-Warden', c: 'Dream Grip, Spore Exposure, Identity Fragment Risk, Weaver Corruption', m: 'Stay in the dream or fight free and help others escape', l: 'Dreamers are being consumed, not resting. The jungle is a trap disguised as mercy.', t: 'Stasis and dream temptation' },
  391: { n: 'Mirrorheart Plain', b: 'Endless mirror plain, glass trees, mirror spires, eyeless wanderers', d: 'Twisted Bullet reflections, Mirrorheart', npcs: 'Whisper, Glare, Echo', e: 'Mirrorheart (becomes dormant, not destroyed)', c: 'Reflection Fracture, False Identity Visions, Mirrorheart Dormancy', m: 'Confront reflections or flee', l: 'Reflections show tyrant/thief/monster possibilities — what Bullet could become.', t: 'Identity horror' },
  512: { n: 'Sky-Mist Ascents', b: 'Floating moss islands, rope bridges, clouds, vortex', d: 'Falling, bridge collapse, vortex', npcs: 'Vine, Thorn, Fang, Briar', e: 'The Vortex (leads not home but to Province 713)', c: 'Escape Hope, Altitude Strain, Bridge Integrity, Vine Desperation', m: 'Trust the vortex as escape or resist', l: 'The vortex does not lead home. Hope is a weapon here.', t: 'False escape' },
  713: { n: 'Frozen Tundra', b: 'Ice fields, crystal storms, igloo camp, living crystals, ice wall', d: 'Skitterblades, Ice Hound, frostbite', npcs: 'Frosthawk, Cinder/Hearth, Stone, Twig, Glass, Shade', e: 'Three-headed Ice Hound (guardian boss)', c: 'Cold Exposure, Frostbite, Static Crystals, Ice Hound Guardian', m: 'Fight the Ice Hound or find another way', l: 'Static crystals kill the Ice Hound. The Seeker becomes more direct after this.', t: 'Cold survival and guardian boss' },
  927: { n: 'Obsidian City', b: 'Black glass city, magma fissures, toxic air, scrying walls', d: 'Obsidian Shades, scrying corruption, heat', npcs: 'Blade, Ash, Soot, Gleam, Flint, Cinder/Crucible', e: 'Obsidian Shades, camp division', c: 'Scrying Corruption, Camp Division, Obsidian Shade Swarm, Molten Bridge Escape', m: 'Trust scrying walls or destroy them; save the divided camp', l: 'Scrying walls show fear/desire visions. Vision is not command.', t: 'Truth corrupted into prophecy' },
  108: { n: 'Rust Swamp', b: 'Oily sludge, metal trees, rust vines, toxic gas', d: 'Rust-born serpents, scrap harvesters, corrosion', npcs: 'Silt, Crag, Mire, Alloy, Scour, Tangle, Hiss, Static, Drench', e: 'Rust-born serpents, scrap harvesters', c: 'Rust Conversion, Scrap Value, Toxic Air, Gear Corrosion', m: 'When someone becomes metal, are they still human?', l: 'Rust venom hardens the body. Etched shard can counter it.', t: 'Corrosion and dehumanization' },
  429: { n: 'Scorched Plain', b: 'Burning ground, ash storms, molten fissures, volcanic ridge', d: 'Fire Elemental, ash storms, burns', npcs: 'Tusk, Scorch, Kindle, Hearth', e: 'Fire Elemental (boss)', c: 'Burn Exposure, Ash Inhalation, Fissure Timing, Fire Elemental Core, Scarcity Pressure', m: 'Spare or kill Hearth after the attack', l: 'Fire Elemental defeated with ash, steam, core strikes. Mercy has a cost.', t: 'Fire survival and scarcity morality' },
  998: { n: 'Prism Expanse', b: 'Floating crystal fragments, prism spires, luminous threads, void below', d: 'Shardswarms, Frost-Wing Sentinels, void gaps', npcs: 'None (isolated)', e: 'Shardswarms, Frost-Wing Sentinels', c: 'Refraction Drift, Shard-Dust Venom, Resonance Tuning, Obelisk Lock', m: 'Use etched shard to seal the obelisk rift or flee', l: 'Steel-gray eyes see Bullet through obelisk rift. Etched shard slams it shut.', t: 'Perception and resonance' },
  0: { n: 'The Gate / Way-Station', b: 'Iron gate, seven-fold descent, control room, surveillance monitors', d: 'Thirty capture operatives, seven-fold descent tests', npcs: 'Thirty operatives', e: 'Capture operatives', c: 'Soul Fracture, Seven-Fold Descent, Way-Station Alarm, Anomaly Status', m: 'Fight through; descent tests Pride, Envy, Wrath, Sloth, Greed, Gluttony, Longing', l: 'Bullet sees Province 1 on a monitor. He is "the anomaly." Pull confirms destination.', t: 'Major campaign turning point' },
  14: { n: 'The Park / Amphitheater', b: 'Perfect park, ponds, trees, flowers, looping birdsong, hidden amphitheater', d: 'Audience creatures, winged puppeteers, storyteller', npcs: 'The Storyteller', e: 'Audience creatures, puppeteers', c: 'Witness Guilt, Performance Cycle, False Rest, Park Watchfulness', m: 'Intervene, observe, rescue one, sabotage, confront storyteller, or leave', l: 'Storyteller tells myth of Star and Wanderer — about the Architect\'s fall.', t: 'Complicity and forced witnessing' },
  140: { n: 'The Meadow / Guilt Vision', b: 'Soft grass, willows, stream, false stars, honeyed air, guilt haze', d: 'Memory rewriting, hidden husk predators, blackout', npcs: 'None (isolated)', e: 'Hidden husk predators (blackout combat)', c: 'Corrupted Guilt Memory, Blackout Combat, Fear of Self', m: 'Resist the meadow\'s rewriting or lose yourself', l: 'Myths of Blade of Dawn, Star-Crowned Ember, Silent Pulse. Bullet blacks out, wakes surrounded by dead husks.', t: 'Corrupted guilt memory and blackout combat' },
  5121: { n: 'Despair Peaks', b: 'Mist mountains, geysers, despair vapors, toothed plants, cliffs', d: 'Spectral Wyrm, despair mist, cliffs', npcs: 'Mist, Knell, Glim, Haze, Veil/Hymn', e: 'Spectral Wyrm, Despair Mist', c: 'Despair Pressure, Anchor Against Despair, Survivor Chorus, Bond Threat', m: 'Accept help from survivors or break alone', l: 'Connection resists Province systems. Bullet survives because others help. Set "With Help" flag.', t: 'Despair and being saved by others' },
  3911: { n: 'Loop Room', b: 'Vast obsidian chamber, living floor symbols, false distant door, hidden true door', d: 'Loop strain, isolation, temporal echo', npcs: 'Temporal Double', e: 'The loop itself', c: 'Loop Strain, False Door, True Door, Temporal Echo, Shard Focus', m: 'Press shard to temple to reveal the true door', l: 'Temporal double hints at shard use. Shard reveals hidden truth — but truth can see you back.', t: 'False exit puzzle and shard unlock' },
  1: { n: 'Final Castle', b: 'Black shore, obsidian shore, ferryman, castle barrier, bone shards, ash sky', d: 'Seeker, Dreadwraith, Serpent of Province 1', npcs: 'The Ferryman, The Leader', e: 'Serpent of Province 1 (final boss, 8 phases)', c: 'Barrier, Ferryman Payment, Serpent Phases, Identity Reveal', m: 'Throw etched shard into barrier to shatter it and awaken as Michael', l: 'Bullet is Michael, sent by Father. The Leader is his fallen brother. Final truth.', t: 'Final confrontation and identity reveal' },
  [-1]: { n: 'Cleanup Mode', b: 'Return through all Provinces in reverse — 512, 837, 618, 998, 108, 391, and all others. The realm crumbles as Michael walks.', d: 'Moral judgment, uncertainty, the weight of eons', npcs: 'All surviving NPCs — Mist, Knell, Glim, Haze, Veil, Blade, Silt, survivors, operatives, husks, puppets, all souls', e: 'Irredeemable beings (dissolved into nothing)', c: 'Send Home (good/redeemed), Unmake (irredeemably bad), centuries of labor', m: 'Touch each soul — the good ascend home, the bad dissolve into nothing. TWIST: some seemingly-kind NPCs hide deeper sins and are irredeemable; some corrupted NPCs were genuinely redeemed.', l: 'The scar was a self-inflicted bullet wound at Father\'s command — suicide to cross the veil. The etched shard was Father\'s own light. The amnesia was intentional sacrifice. After all provinces are cleansed, Michael ascends home.', t: 'Divine judgment and the end of torment' }
};

const PROVINCE_CHAPTERS = { 618: 1, 472: 2, 837: 3, 269: 4, 391: 6, 512: 8, 713: 9, 927: 10, 108: 12, 429: 13, 998: 14, 0: 15, 14: 16, 140: 17, 5121: 18, 3911: 19, 1: 20, [-1]: 21 };

// Canonical province sequence — the GM may only transition to the NEXT province in this order.
// This prevents the LLM from spoiling late-game provinces (e.g. jumping from Chapter 1 to Province 0).
const CANONICAL_PROVINCE_ORDER = [618, 472, 837, 269, 391, 512, 713, 927, 108, 429, 998, 0, 14, 140, 5121, 3911, 1, -1];

const PULL_LABELS = ['Quiet', 'Tug', 'Ache', 'Burn', 'Commanding', 'Blackout Risk', 'Override'];

// ─── Chapter Packets (Chapter Module System) ───
// Each chapter is a self-contained module. When a chapter ends (province transition),
// a structured handoff is generated and saved. The next chapter loads ONLY the handoff
// — not the previous chapter's detailed state. This prevents AI memory failures,
// spoiler leaks, duplicate items, and wrong weapon attribution.
const CHAPTER_PACKETS = {
  1: {
    carryForwardItems: ['etched shard', 'pipe', 'spark', 'breathing apparatus'],
    requiredAlive: ['shard', 'spark'],
    canonicalEvents: [
      'Bullet woke in red sand with no memory.',
      'Bullet found the etched shard in his pocket.',
      'A mechanical bird scanned Bullet and reported to something distant.',
      'Bullet reached Red Sand Camp.',
      'Shard named him Bullet after seeing his circular scar.',
      "Bullet completed Shard's task (retrieving the purifier core).",
      'Bullet fought raiders with the pipe.',
      'Spark loaned Bullet her unetched shard.',
      'Shard gave Bullet breathing apparatus.',
      'The Pull forced Bullet onward.',
      'Bullet reached the wall of water.'
    ],
    bulletKnowledge: [
      'He has no memory of who he was.',
      'The Pull leads him forward through the Provinces.',
      'The camp survivors also lack true memories — everyone woke here.',
      'The next Province is water-like and dangerous.',
      'The breathing apparatus is needed to survive there.'
    ],
    playerOnlyKnowledge: [
      'A distant Leader knows an anomaly appeared in Province 618.',
      'Bullet has no Nexus record.',
      'An investigation has been ordered.'
    ],
    debts: [
      'Spark expects Bullet to return someday.',
      'Shard trusted Bullet enough to help him move on.'
    ]
  },
  2: {
    carryForwardItems: ['etched shard', 'pipe', 'spark', 'breathing apparatus'],
    requiredAlive: [],
    canonicalEvents: [],
    bulletKnowledge: [],
    playerOnlyKnowledge: [],
    debts: []
  }
};

// ─── Chapter 1 Replayability System ───
// Controlled variation: fixed story spine + probable variable outcomes.
// Same destination every run. Different scars on the way there.

const CHAPTER1_TASK_VARIANTS = [
  { id: 'purifier_core', label: 'Purifier Core', desc: 'A humming cylinder of old-world tech that powers the water purifier.' },
  { id: 'water_regulator', label: 'Water Regulator', desc: 'A valve assembly that controls the purifier flow rate.' },
  { id: 'filter_crystal', label: 'Filter Crystal', desc: 'A translucent crystal that strains contaminants from the water system.' },
  { id: 'cooling_coil', label: 'Cooling Coil', desc: 'A spiraled metal tube that keeps the purifier from overheating.' },
  { id: 'pressure_valve', label: 'Pressure Valve', desc: 'A heavy valve that regulates the purifier internal pressure.' },
  { id: 'drone_battery', label: 'Drone Battery', desc: 'A power cell salvaged from old-world machines, repurposed for the purifier.' },
  { id: 'shard_circuit', label: 'Shard-Powered Circuit', desc: 'A circuit board etched with shard-traces that channels energy through the purifier.' },
  { id: 'metal_valve_housing', label: 'Metal Valve Housing', desc: 'A reinforced housing that protects the purifier intake valve.' },
  { id: 'fuse_rod', label: 'Purifier Fuse Rod', desc: 'A conductive rod that channels power safely through the purifier system.' },
  { id: 'condensation_lens', label: 'Condensation Lens', desc: 'A curved glass lens that focuses moisture from the air into the purifier.' }
];

const CHAPTER1_TASK_COMPLICATIONS = [
  { id: 'collapsing_ruin', label: 'Collapsing Ruin', weight: 18, desc: 'The station begins to collapse while Bullet searches.', risks: 'injury, lost_time, fatigue' },
  { id: 'sand_maw', label: 'Sand Maw', weight: 14, desc: 'The ground hides a living mouth beneath the grit.', risks: 'npc_death, serious_injury, panic' },
  { id: 'old_drone', label: 'Old Drone', weight: 16, desc: 'A broken defense drone activates inside the ruin.', risks: 'combat, wound, noise' },
  { id: 'heat_delirium', label: 'Heat Delirium', weight: 12, desc: 'The desert heat causes visions and disorientation.', risks: 'wrong_path, fatigue, memory_flash' },
  { id: 'hostile_scavenger', label: 'Hostile Scavenger', weight: 12, desc: 'Another desperate survivor wants the same part.', risks: 'fight, negotiation, moral_choice' },
  { id: 'sandstorm', label: 'Sudden Sandstorm', weight: 12, desc: 'Visibility drops and the route back becomes dangerous.', risks: 'lost_time, injury, delayed_return' },
  { id: 'unstable_machine', label: 'Unstable Machine', weight: 10, desc: 'The component is still wired into a dangerous system.', risks: 'shock, explosion, purifier_damage' },
  { id: 'quiet_success', label: 'Uneasy Quiet', weight: 6, desc: 'No major attack happens, but the silence feels wrong.', risks: 'hidden_clock_advance' }
];

const CHAPTER1_OPTIONAL_ENCOUNTERS = [
  { id: 'dying_survivor', label: 'Dying Survivor', desc: 'A wounded stranger near the ruin. Choices: help, ignore, take supplies, bring back to camp.' },
  { id: 'buried_cache', label: 'Buried Cache', desc: 'A small cache half-swallowed by sand. Choices: take all, mark for camp, ignore, search more.' },
  { id: 'memory_echo', label: 'Memory Echo', desc: 'The scar reacts near old metal and gives Bullet a fragment. Choices: focus, pull away, touch shard.' },
  { id: 'lost_camp_member', label: 'Lost Camp Member', desc: 'One of Shard people is found trapped or wounded. Choices: rescue, prioritize core, try both.' },
  { id: 'watching_bird', label: 'Mechanical Bird Returns', desc: 'The metal bird circles again but does not attack. Choices: hide, throw scrap, show shard, keep moving.' },
  { id: null, label: 'No Side Encounter', desc: 'The path is clear of side encounters this run.' }
];

const CHAPTER1_RAID_COMPLICATIONS = [
  { id: 'straight_assault', label: 'Straight Assault', desc: 'Raiders charge the camp defenses directly.' },
  { id: 'cache_flank', label: 'Cache Flank', desc: 'One raider group tries to circle toward the water Cache.' },
  { id: 'spark_in_danger', label: 'Spark in Danger', desc: 'Spark is nearly cornered but cannot die (protected).' },
  { id: 'patch_under_attack', label: 'Patch Under Attack', desc: 'Patch is threatened while treating the wounded.' },
  { id: 'maul_overextends', label: 'Maul Overextends', desc: 'Maul charges too far and may be injured.' },
  { id: 'sandstorm_raid', label: 'Raid in Sandstorm', desc: 'The attack happens during poor visibility.' },
  { id: 'fire_near_cache', label: 'Fire Near Cache', desc: 'A torch or explosive threatens stored supplies.' }
];

const CHAPTER1_WEATHER_EVENTS = [
  { id: 'clear', label: 'Clear Skies', desc: 'Harsh sun, no weather complication.' },
  { id: 'heat_wave', label: 'Heat Wave', desc: 'The temperature spikes dangerously.' },
  { id: 'sandstorm_brewing', label: 'Sandstorm Brewing', desc: 'A storm builds on the horizon throughout the day.' },
  { id: 'wind_shift', label: 'Shifting Winds', desc: 'Unusual wind patterns carry sound and dust in odd directions.' }
];

const CHAPTER1_PROTECTED_NPCS = ['shard', 'spark'];
const CHAPTER1_RISK_ELIGIBLE_NPCS = ['patch', 'maul', 'cowboy', 'rivet', 'hawk', 'ash'];
const CHAPTER1_DANGER_SCENES = ['task_in_progress', 'raider_attack', 'raider_warning'];

function weightedRoll(table) {
  const total = table.reduce((s, e) => s + (e.weight || 1), 0);
  let roll = Math.random() * total;
  for (const entry of table) { roll -= (entry.weight || 1); if (roll <= 0) return entry; }
  return table[0];
}
function rollFrom(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

function generateChapter1ReplayVariant() {
  const tv = weightedRoll(CHAPTER1_TASK_VARIANTS);
  const tc = weightedRoll(CHAPTER1_TASK_COMPLICATIONS);
  const oe = rollFrom(CHAPTER1_OPTIONAL_ENCOUNTERS);
  const rc = weightedRoll(CHAPTER1_RAID_COMPLICATIONS);
  const w = rollFrom(CHAPTER1_WEATHER_EVENTS);
  const riskCount = 1 + Math.floor(Math.random() * 3);
  const shuffled = [...CHAPTER1_RISK_ELIGIBLE_NPCS].sort(() => Math.random() - 0.5);
  return {
    task_variant: tv.id, task_variant_label: tv.label, task_variant_desc: tv.desc,
    task_complication: tc.id, task_complication_label: tc.label, task_complication_desc: tc.desc, task_complication_risks: tc.risks,
    optional_encounter: oe ? oe.id : null, optional_encounter_label: oe ? oe.label : null, optional_encounter_desc: oe ? oe.desc : null,
    raid_complication: rc.id, raid_complication_label: rc.label, raid_complication_desc: rc.desc,
    weather_event: w.id, weather_event_label: w.label, weather_event_desc: w.desc,
    npc_risk_targets: shuffled.slice(0, riskCount),
    protected_npcs: [...CHAPTER1_PROTECTED_NPCS],
    seed: Date.now()
  };
}

// NPC death validation — an NPC can die only in a danger scene, if present, not protected, not already dead
function canNPCDie(npcKey, stage, npcRels) {
  if (CHAPTER1_PROTECTED_NPCS.includes(npcKey)) return false;
  if (!CHAPTER1_DANGER_SCENES.includes(stage)) return false;
  const rel = (npcRels || {})[npcKey];
  if (!rel || !rel.first_met) return false;
  if ((rel.status || '').toLowerCase() === 'dead') return false;
  return true;
}

// Format replay variant for the GM prompt — only includes the relevant portion for the current sequence
function formatReplayVariantForPrompt(variant, seq) {
  if (!variant) return '(No replay variant generated yet.)';
  const lines = [];
  if (seq >= 6) lines.push(`Task Object: ${variant.task_variant_label} — ${variant.task_variant_desc}`);
  if (seq === 7) {
    lines.push(`Primary Complication: ${variant.task_complication_label} — ${variant.task_complication_desc}`);
    lines.push(`Complication Risks: ${variant.task_complication_risks}`);
    if (variant.optional_encounter) lines.push(`Optional Encounter: ${variant.optional_encounter_label} — ${variant.optional_encounter_desc}`);
    else lines.push('Optional Encounter: None this run.');
  }
  if (variant.weather_event && variant.weather_event !== 'clear') lines.push(`Weather: ${variant.weather_event_label} — ${variant.weather_event_desc}`);
  if (seq >= 9 && seq <= 10) lines.push(`Raid Complication: ${variant.raid_complication_label} — ${variant.raid_complication_desc}`);
  if (seq >= 7) {
    lines.push(`Protected NPCs (CANNOT die): ${(variant.protected_npcs || []).join(', ')}`);
    lines.push(`At-Risk NPCs (may live, die, or be injured based on choices): ${(variant.npc_risk_targets || []).join(', ')}`);
  }
  lines.push('RULE: Use these pre-rolled elements. Do NOT kill protected NPCs. Only kill at-risk NPCs in danger scenes when a player choice or failed roll creates the risk. Record all NPC outcomes in events[] ledger.');
  return lines.join('\n');
}

// Generate a structured handoff when a chapter ends (province transition fires).
// This is the ONLY data from the completed chapter that the next chapter receives.
function generateChapterHandoff(flags, equipment, chapterNum) {
  const packet = CHAPTER_PACKETS[chapterNum];
  if (!packet) return null;

  const chapterId = 'chapter_' + String(chapterNum).padStart(3, '0');
  const nextChapterId = 'chapter_' + String(chapterNum + 1).padStart(3, '0');

  const carryPatterns = packet.carryForwardItems.map(item =>
    new RegExp(item.replace(/[-\s]/g, '.*'), 'i')
  );
  const inventory = (equipment || [])
    .filter(e => carryPatterns.some(p => p.test(e.name)))
    .map(e => e.name);

  const npcRels = flags.npc_relationships || {};
  const knownPeople = Object.entries(npcRels)
    .filter(([, npc]) => npc.first_met)
    .map(([key, npc]) => ({
      key, name: npc.name || key, role: npc.role || '', status: npc.status || 'Alive'
    }));

  const variableOutcomes = {};
  if (chapterNum === 1) {
    variableOutcomes.cowboyStatus = (npcRels.cowboy?.status || 'Unknown').toLowerCase();
    variableOutcomes.rivetStatus = (npcRels.rivet?.status || 'Unknown').toLowerCase();
    variableOutcomes.campTrust = (flags.local_clocks || {}).camp_trust ?? 30;
    variableOutcomes.campDamage = (flags.local_clocks || {}).raider_threat ?? 20;
    // Replay variant + NPC outcome summary — carried to Chapter 2
    variableOutcomes.task_variant = (flags.chapter1_replay || {}).task_variant_label || 'Purifier Core';
    variableOutcomes.task_complication = (flags.chapter1_replay || {}).task_complication_label || 'Unknown';
    variableOutcomes.raid_complication = (flags.chapter1_replay || {}).raid_complication_label || 'Unknown';
    variableOutcomes.optional_encounter = (flags.chapter1_replay || {}).optional_encounter_label || 'None';
    const npcOutcomes = {};
    for (const [nKey, nRel] of Object.entries(npcRels)) {
      if (nRel.first_met) {
        npcOutcomes[nKey] = { name: nRel.name, status: (nRel.status || 'Alive').toLowerCase(), relationship: nRel.relationship || 0 };
      }
    }
    variableOutcomes.npc_outcomes = npcOutcomes;
  }

  const conditions = flags.conditions || [];

  // Filter canonical events to only include those that have ACTUALLY happened,
  // based on unlock flags and story state. This prevents the handoff summary from
  // showing future/spoiler events (e.g. "Spark loaned her shard") if the chapter
  // ends before all beats are done.
  const uf = flags.unlock_flags || {};
  const eventGates = {
    'A mechanical bird scanned Bullet and reported to something distant.': !!uf.mechanical_bird_scanned,
    'Bullet reached Red Sand Camp.': Object.keys(flags.npc_relationships || {}).length > 0,
    'Shard named him Bullet after seeing his circular scar.': !!flags.bullet_named,
    "Bullet completed Shard's task (retrieving the purifier core).": !!uf.task_complete,
    'Bullet fought raiders with the pipe.': !!uf.raiders_defeated,
    'Spark loaned Bullet her unetched shard.': !!flags.spark_shard,
    'Shard gave Bullet breathing apparatus.': !!flags.breathing_gear,
    'The Pull forced Bullet onward.': !!flags.camp_arc_complete,
    'Bullet reached the wall of water.': !!uf.water_wall_reached,
  };
  const filteredEvents = packet.canonicalEvents.filter(e => eventGates[e] === undefined || eventGates[e]);

  // Filter debts to only include those whose triggering event has happened
  const filteredDebts = packet.debts.filter(d => {
    if (d.includes('Spark')) return !!flags.spark_shard;
    if (d.includes('Shard')) return !!flags.bullet_named;
    return true;
  });

  return {
    completedChapter: chapterId,
    nextChapter: nextChapterId,
    bullet: {
      name: flags.bullet_named ? 'Bullet' : 'The Stranger',
      trueIdentityKnown: false,
      condition: conditions.length > 2 ? 'injured but mobile' : 'worn but standing',
      scarStatus: flags.scar_state || 'burning',
      pullStatus: (flags.pull_intensity || 1) >= 4 ? 'intensifying' : 'present'
    },
    inventory,
    knownPeople,
    requiredAlive: packet.requiredAlive,
    variableOutcomes,
    canonicalEvents: filteredEvents,
    bulletKnowledge: packet.bulletKnowledge,
    playerOnlyKnowledge: packet.playerOnlyKnowledge,
    debts: filteredDebts
  };
}

// Format a handoff for the AI prompt — compact summary so the AI knows what
// happened in the previous chapter without loading all the detailed state.
function formatHandoffForPrompt(handoff) {
  if (!handoff) return '(No previous chapter handoff — this is the first chapter.)';
  const lines = [];
  lines.push(`Completed: ${handoff.completedChapter}`);
  lines.push(`Bullet: ${handoff.bullet?.name} — ${handoff.bullet?.condition}, scar ${handoff.bullet?.scarStatus}, pull ${handoff.bullet?.pullStatus}`);
  if (handoff.inventory?.length) lines.push(`Carried Items: ${handoff.inventory.join(', ')}`);
  if (handoff.knownPeople?.length) lines.push(`People Remembered: ${handoff.knownPeople.map(n => `${n.name} (${n.role}, ${n.status})`).join('; ')}`);
  if (handoff.debts?.length) lines.push(`Debts: ${handoff.debts.join(' ')}`);
  if (handoff.canonicalEvents?.length) lines.push(`What Happened:\n${handoff.canonicalEvents.map(e => `  - ${e}`).join('\n')}`);
  if (handoff.bulletKnowledge?.length) lines.push(`Bullet Knows:\n${handoff.bulletKnowledge.map(k => `  - ${k}`).join('\n')}`);
  if (handoff.playerOnlyKnowledge?.length) lines.push(`Player-Only Knowledge (Bullet does NOT see/know these):\n${handoff.playerOnlyKnowledge.map(k => `  - ${k}`).join('\n')}`);
  return lines.join('\n');
}

// ─── Chapter 1 Story Spine ───
// 15 required sequences the GM must guide Bullet through. The prompt only
// includes the CURRENT sequence's instruction, preventing the LLM from
// skipping ahead or improvising the whole chapter. The GM returns
// advance_sequence: true when the current beat is complete.
const CHAPTER1_SEQUENCES = [
  { t: 'Wake in the Sand', i: 'Bullet wakes face-down in red sand with no memory. The sky is wrong, the sand burns. He discovers: circular scar over his heart, etched shard in his pocket, the Pull in his chest. Let the player explore and discover these. Do NOT advance to camp yet — stay in the waking scene until the player has discovered the scar, shard, and Pull and begins moving forward.', a: 'Bullet discovers the scar, shard, and Pull and begins moving in the direction the Pull leads' },
  { t: 'Mechanical Bird Scan', i: 'REQUIRED EVENT — this MUST happen this sequence. As Bullet walks the desert, a mechanical bird scans him. Narrate: a shadow crosses the red sand, Bullet looks up and sees a bird-shaped machine with metal-feather wings, red eyes lock onto him, a thin beam of light sweeps over his body pausing on the scar above his heart, the scar pulses, then the bird folds its wings and vanishes into heat shimmer. Bullet may think something saw him, something was watching. Do NOT show HUNTED, Hunter Proximity, or Province 1 Alert UI — those are hidden clocks only. Set unlock_flags.mechanical_bird_scanned = true when this happens. Also set clock_changes for mechanical_bird_surveillance.', a: 'The mechanical bird scan has occurred (mechanical_bird_scanned flag set)' },
  { t: 'The Pull Leads to Camp', i: 'The Pull guides Bullet toward camp. He may see smoke or structures ahead. He enters camp near collapse from thirst. Do NOT introduce NPCs yet — he arrives at the edge of camp, barely conscious. Narrate the approach and arrival.', a: 'Bullet reaches the camp entrance' },
  { t: 'Camp Discovery', i: 'The stranger enters the camp. The survivors are like him — no real memories, nicknames instead of true names, no clear past, a sense of always being here. AMNESIA IS NORMAL HERE. Nobody finds it strange that Bullet has no memory — they ALL woke up with no memory. They are suspicious of his SCAR, his SHARD, his STRENGTH, and the fact that trouble follows him — NOT his amnesia. They know Province 618 is the red sand place, there are other places, the next known is the water Province, people do not survive long outside camps. They do NOT know the big truth. Introduce Shard (bald/scarred camp leader) first — she confronts the stranger. She may ask who he is, but do NOT name him yet — the naming happens in the NEXT sequence. He is still "the stranger." Do NOT give water freely yet — Shard decides if he is a threat first.', a: 'The stranger has entered the camp and met Shard (not yet named)' },
  { t: 'Water / First Trust (Naming)', i: 'THE NAMING SCENE — strict order required: (1) Shard confronts the stranger. (2) Shard asks who he is — "You got a name?" (3) The stranger says he does not know — no memory, woke in the sand. (4) Shard notices the circular scar over his heart. (5) Shard names him "Bullet" — "On account of that mark. Looks like someone put a round through you and you were too stubborn to die." Set bullet_named = true ONLY at step 5 — after Shard has asked his name, he said he does not know, AND she names him. Before that moment, NEVER use the name "Bullet" in narration — he is "the stranger." After the naming, the camp gives him just enough water to survive. Shard makes clear survival requires contribution. Introduce Spark (young inventor), Patch (healer), and Maul (hostile rival). Shard asks Bullet to help with a camp problem. Unlock camp_trust clock via discovered_clocks.', a: 'The stranger is named Bullet (Shard asked, he said he did not know, she saw the scar, she named him) and Shard assigns a task' },
  { t: 'Shard\'s Task', i: 'Shard asks Bullet to retrieve something for the camp. USE THE TASK OBJECT from the REPLAY VARIANT section (e.g. condensation lens, pressure valve, fuse rod) — do not default to "purifier core" unless that is the rolled variant. Shard explains the purifier is failing and this component is needed. Unlock purifier_stability clock via discovered_clocks. Set objective to retrieve the item and return it. Set unlock_flags.task_assigned = true when Shard assigns the task.', a: 'Bullet accepts the task and leaves camp to find the item' },
  { t: 'Task Danger', i: 'USE THE PRIMARY COMPLICATION from the REPLAY VARIANT section (e.g. sand maw, old drone, collapsing ruin, heat delirium). If an OPTIONAL ENCOUNTER is rolled, weave it in during the task. If Bullet faces a physical threat for the first time, he instinctively grabs a battered metal pipe (the Pipe acquisition beat — set pipe_state to battered_metal_pipe, add to inventory via item_changes). He succeeds and returns with the needed object. At-risk NPCs (from REPLAY VARIANT) may be injured or die ONLY if they are present and a player choice or failed roll creates the risk — protected NPCs (Shard, Spark) CANNOT die. Maul may blame Bullet. Record exact events in the events[] ledger — especially item_used_name. Set unlock_flags.task_complete = true when Bullet has the item.', a: 'Bullet returns with the needed object' },
  { t: 'Camp Evening Interlude', i: 'REQUIRED: The camp cast MUST be introduced NOW, before any raider content. Bullet has returned with the purifier core replacement. The camp comes alive around him. Introduce these NPCs in order: (1) SPARK — a young inventor hurries to inspect the core Bullet brought back; she is excited, reaches for tools, wants to see if the core still hums. Someone calls her Spark. Return an npc_update for spark (is_new: true, key: "spark", role: "Inventor", disposition: "friendly", description: "A young woman with dust on her face and bright, restless eyes"). (2) PATCH — a burned woman with steady hands catches Bullet before he collapses from exhaustion/injury; she treats his wounds. "You bring back something useful, you get patched before you bleed into the sand." Someone calls her Patch. Return an npc_update for patch (is_new: true, key: "patch", role: "Healer", disposition: "friendly", description: "A burned woman with steady, careful hands"). (3) MAUL — a broad, burned man watches from near the fire, arms folded, suspicious and hostile toward Bullet. "He brings one piece of scrap back and everyone starts smiling? Drifters are still drifters." Shard shuts him down: "Enough, Maul." Return an npc_update for maul (is_new: true, key: "maul", role: "Rival", disposition: "hostile", description: "A broad, burned man with a suspicious glare"). (4) Shard asks Bullet to stay until dark — the camp could use the hands, and he owes them. Bullet agrees to stay. Set unlock_flags.agreed_to_stay = true ONLY after the three NPCs are introduced AND he agrees. Also: acknowledge the core return by improving Purifier Stability via local_clock_changes (+15-20, reason "Replacement core returned") and returning a decision_impact with is_meaningful: true, label "Task Completed", Camp Trust +15, tone "positive", plus NPC discovery notes for Spark, Patch, and Maul. This is an INTERACTIVE HUB — every player action MUST produce a direct NPC response with spoken dialogue, NOT just atmosphere. If the player asks about defenses or dangers, Shard MAY explain the raider danger (water = target, they\'ve hit before, they may come tonight) and set unlock_flags.raider_danger_explained = true, add raider_threat to discovered_clocks, and update the objective to prepare for possible attack. Do NOT deliver the full "they\'re coming now" warning — that comes in the next stage (seq 9). The objective should be: rest, meet the camp, wait until dark. After the raider danger is explained: "Prepare for possible raider attack." Introduce the NPCs across one or two turns if the player is interacting — do not dump all three in a single wall of text if the player is mid-conversation with one. NO DEAD AIR: Once the cast is introduced, this stage becomes an interactive hub — the player can talk to any NPC, ask questions, rest, or explore. EVERY response must include an NPC speaking direct dialogue that answers the player or reacts to their action. Never respond with only mood text ("the fire flickers, the wind howls"). If the player introduces themselves, NPCs respond with their names. If the player waits, time advances and Shard returns. If the player asks about defenses, Shard explains the raider danger. Follow the PLAYER INTENT hints to route responses.', a: 'Spark, Patch, and Maul are all introduced AND (Bullet agrees to stay OR raider_danger_explained is set)' },
  { t: 'Raider Warning', i: 'ONLY NOW should Raider Threat become visible. A scout reports movement, or Spark sees raiders, or Hawk spots silhouettes. Shard says they are coming for the Cache. Unlock raider_threat clock via discovered_clocks. Set objective to defend Red Sand Camp. Do NOT show Raider Threat earlier than this. Set unlock_flags.raider_warning_given = true when the warning is delivered.', a: 'The raider warning has been delivered' },
  { t: 'Raider Attack', i: 'USE THE RAID COMPLICATION from the REPLAY VARIANT section (e.g. cache flank, spark in danger, maul overextends, fire near cache). Bullet fights with his pipe — this is important canon, the pipe is the weapon. Record pipe as item_used_name in the events[] ledger. Do NOT allow later narration to mutate this into a crossbow/sword/knife kill. At-risk NPCs (from REPLAY VARIANT) may be injured or die during the raid if they are present and a player choice or failed roll creates the risk — protected NPCs (Shard, Spark) MUST survive but may be endangered or shaken. Maul may grudgingly respect Bullet or still resent him. Required outcome: raiders are driven off, the camp survives, the pipe becomes emotionally important. Set unlock_flags.raiders_defeated = true.', a: 'Raiders are driven off and the camp survives' },
  { t: 'Aftermath — Spark\'s Shard', i: 'After the raiders are run off, Bullet has a quiet moment. Spark gives him her shard as a LOAN, not a casual gift. She says something like "Take it. Not forever. Just until you come back." She wants him to come back someday. Set spark_shard_acquired = true and add "Spark\'s Unetched Shard" to inventory via item_changes. Show this once only. Create a guilt/bond entry: Spark — Shard Loan. Set unlock_flags.spark_shard_given = true.', a: 'Spark gives Bullet her shard' },
  { t: 'Shard Gives Breathing Apparatus', i: 'Shard gives Bullet the breathing apparatus. She knows the next Province is water-like and dangerous. She does NOT know everything about Province 472 — only that it is water, it is dangerous, people who go without breathing gear do not survive. Set breathing_gear_acquired = true and add "Shard\'s Breathing Apparatus" to inventory via item_changes. Set unlock_flags.breathing_gear_given = true.', a: 'Shard gives Bullet the breathing apparatus' },
  { t: 'Pull Intensifies', i: 'This is the actual reason Bullet leaves. The Pull tightens beneath his scar. Looking back at camp makes the scar burn. Looking forward eases the pain. He does not know what is calling him. He only knows he cannot stay. Set camp_arc_complete = true. Escalate pull_intensity toward 4-5 (Commanding/Blackout Risk). No HUNTED popup. The player must clearly understand the Pull is the chapter exit force.', a: 'Bullet leaves the camp following the Pull' },
  { t: 'Province 1 / Leader Cutscene', i: 'Show the Province 1 cutscene as an INTERLUDE (player-only, Bullet does not see this). Use the interlude field. Include: Province 1 castle/fortress, a robed figure reporting a new arrival in Province 618, no Nexus record, the Leader in a charcoal suit, the Leader orders investigation. After the cutscene: do NOT update Bullet\'s Codex, Objective, or known locations. Do NOT add Province 1 to known locations. Do NOT show Hunted status. Set unlock_flags.province1_interlude_shown = true.', a: 'The Province 1 interlude has been shown' },
  { t: 'End of Chapter 1 — Wall of Water', i: 'Bullet reaches the edge of the next Province. He sees a giant wall of water-like substance — it stretches as far as he can see, rises impossibly high, it is not a lake or river or ocean, it is a wall/slab/block of liquid. The Pull points directly into it. Set province_transition to { to_province: 472, reason: "Bullet reaches the wall of water" }. Do NOT mention the dome or the Dreadwraith yet. End the chapter here. Set unlock_flags.water_wall_reached = true when Bullet reaches the wall of water.', a: 'Bullet reaches the wall of water and the province transition fires' }
];

// ─── Chapter 1 Stage System ───
// Maps sequence numbers to human-readable stage names. The stage name is
// stored in flags.chapter1_stage and returned to the frontend for display.
const CHAPTER1_STAGES = [
  'desert_wake',               // seq 1
  'mechanical_bird_scan',      // seq 2
  'camp_seen',                 // seq 3
  'camp_intro',                // seq 4
  'name_given',                // seq 5 (also water_received)
  'task_assigned',             // seq 6
  'task_in_progress',          // seq 7
  'camp_evening_interlude',     // seq 8 — introduces Spark, Patch, Maul before raiders
  'raider_warning',            // seq 9
  'raider_attack',             // seq 10
  'spark_shard_received',      // seq 11
  'breathing_apparatus_received', // seq 12
  'pull_departure',            // seq 13
  'province1_interlude',       // seq 14
  'water_wall_reached'         // seq 15
];

// ─── Stage-Based Pull Override ───
// FINAL AUTHORITY on Pull intensity and scar state for Chapter 1. Ensures the
// Pull matches the story stage regardless of what the LLM returned or any
// premature camp_arc_complete inference. Quest travel (task_assigned,
// task_in_progress) is service to the camp — the Pull stays calm and allows
// the detour. Only after the raid is resolved and farewell gifts are given
// does the Pull escalate toward departure.
const STAGE_PULL_OVERRIDES = {
  desert_wake:                  { intensity: 1, scar: 'pulse'  }, // Tug, Pulsing
  mechanical_bird_scan:         { intensity: 1, scar: 'pulse'  }, // Tug, Pulsing
  camp_seen:                    { intensity: 0, scar: 'quiet'  }, // Quiet, Quiet
  camp_intro:                  { intensity: 0, scar: 'quiet'  }, // Quiet, Quiet
  name_given:                   { intensity: 1, scar: 'pulse'  }, // Present, Warm
  task_assigned:                { intensity: 1, scar: 'pulse'  }, // Present, Warm — quest travel is service
  task_in_progress:             { intensity: 1, scar: 'pulse'  }, // Tug, Pulsing — guides without forcing departure
  camp_evening_interlude:       { intensity: 1, scar: 'pulse'  }, // Present, Warm — camp is where the Pull wants him; rest and meet the people
  raider_warning:               { intensity: 1, scar: 'pulse'  }, // Suppressed, Tense — immediate danger overrides Pull
  raider_attack:                { intensity: 3, scar: 'burn'   }, // Burning, Hot — survival/combat state
  spark_shard_received:         { intensity: 3, scar: 'burn'   }, // Intensifying, Burning — departure is approaching
  breathing_apparatus_received: { intensity: 4, scar: 'flare'  }  // Commanding, Flaring — next Province is calling
};

// Code-driven sequence advancement: when the current sequence's required flag
// is set, auto-advance the sequence even if the LLM didn't set advance_sequence.
// This makes the stage system deterministic — the CODE owns stage progression,
// not the AI. The AI narrates within the stage; the code decides when to move on.
const SEQUENCE_COMPLETION_CHECKS = {
  2: (f) => !!(f.unlock_flags || {}).mechanical_bird_scanned || (f.codex_unlocks || []).includes('mechanical_bird') || (f.codex_unlocks || []).includes('watcher'),
  4: (f) => Object.keys(f.npc_relationships || {}).length > 0,
  5: (f) => !!f.bullet_named,
  6: (f) => !!(f.unlock_flags || {}).task_assigned,
  7: (f) => !!(f.unlock_flags || {}).task_complete,
  8: (f) => {
    const r = f.npc_relationships || {};
    const uf = f.unlock_flags || {};
    const castMet = !!(r.spark && r.patch && r.maul);
    return (castMet && !!uf.agreed_to_stay) || !!uf.raider_danger_explained;
  },
  9: (f) => !!(f.unlock_flags || {}).raider_warning_given,
  10: (f) => !!(f.unlock_flags || {}).raiders_defeated,
  11: (f) => !!f.spark_shard,
  12: (f) => !!f.breathing_gear,
  13: (f) => !!f.camp_arc_complete,
  14: (f) => !!(f.unlock_flags || {}).province1_interlude_shown,
  15: (f) => !!(f.unlock_flags || {}).water_wall_reached
};

// Returns the list of forbidden actions for the current sequence, so the LLM
// knows exactly what it cannot do at this stage. This prevents premature
// story beats (naming, task assignment, raider attack, chapter completion, etc.)
function forbiddenAtStage(seq) {
  const items = [];
  if (seq < 5) items.push('Naming Bullet — Shard must ask name first, stranger says he does not know, Shard sees scar, THEN names him');
  if (seq < 6) items.push('Assigning Shard\'s task before water is received and naming happens');
  if (seq < 9) items.push('Explicit raider warning ("they\'re coming tonight", scout reporting movement) — BUT if the player ASKS about defenses, Shard MAY explain the raider danger (water = target, they\'ve hit before) and set raider_danger_explained. The full "they\'re here" warning comes in seq 9.');
  if (seq < 10) items.push('Raider attack');
  if (seq < 11) items.push('Spark giving her shard');
  if (seq < 12) items.push('Shard giving breathing apparatus');
  if (seq < 13) items.push('Pull departure / leaving camp');
  if (seq < 14) items.push('Province 1 / Leader interlude');
  if (seq < 15) items.push('Chapter complete / province transition / water wall');
  items.push('Michael, Father, Garden, Dreadwraith, Seeker, Cleanup, dome, future Provinces beyond water');
  return items.map(f => `- ${f}`).join('\n');
}

// ─── Player Intent Detection ───
// Lightweight keyword-based intent detection that adds hints to the GM prompt.
// This guides the LLM to respond with direct NPC dialogue and concrete scene
// beats instead of atmospheric "dead air" narration. Not a full router — the
// LLM still narrates, but the intent hint tells it WHICH beat to hit.
function detectPlayerIntent(action, stage) {
  const a = (action || '').toLowerCase();
  const intents = [];

  if (stage === 'camp_evening_interlude') {
    if (/\b(introduc|my name|i'm|i am|who are you|who am i|tell them|meet|hello|hi\b)\b/.test(a)) {
      intents.push('INTRODUCE_SELF — The player is introducing themselves or asking who the NPCs are. Each NPC (Spark, Patch, Maul) MUST speak a line of direct dialogue giving their name and role. Do not just describe them — let them talk.');
    }
    if (/\b(wait|rest|sit|stay|night|dark|morning|sleep|settle|linger)\b/.test(a)) {
      intents.push('WAIT — The player is waiting or resting. Advance time slightly (the fire dims, the sky darkens). Bring Shard back if she was away. She acknowledges Bullet kept his word. Then move toward the next beat — if defenses haven\'t been discussed, Shard or Maul raises the topic.');
    }
    if (/\b(defen|protect|guard|attack|raid|danger|threat|safe|why.*camp|why.*here|what.*coming|worried|fear)\b/.test(a)) {
      intents.push('ASK_ABOUT_DEFENSES — The player is asking about the camp\'s defenses or dangers. This is the RAIDER FORESHADOWING trigger. Shard explains directly: water means a camp worth robbing, raiders have hit them before, they may come for the Cache tonight. Maul adds hostility ("They smell weakness"). Spark expresses concern. Set unlock_flags.raider_danger_explained = true. Add raider_threat to discovered_clocks. Update objective to prepare for possible attack. This advances the story toward the raider warning (seq 9).');
    }
    if (/\b(purif|water|machin|core|fix|repair|work|hum|broken)\b/.test(a)) {
      intents.push('ASK_ABOUT_PURIFIER — The player is asking about the purifier or water. Spark explains directly: the purifier is what keeps them alive, the core Bullet brought back is critical, without it they\'d be dead in days. Let Spark speak with enthusiasm and technical pride.');
    }
    if (/\b(heal|wound|hurt|injur|cut|blood|sick|patch|medicine|treat)\b/.test(a)) {
      intents.push('ASK_FOR_HEALING — The player needs healing or is asking about wounds. Patch speaks directly: she offers to treat Bullet\'s wounds, comments on their severity. Apply hp_change (+1 to +3) if Patch actually treats him this turn.');
    }
    if (/\b(maul|big.*man|burned.*man|angry|hostile|rival|trouble)\b/.test(a)) {
      intents.push('TALK_TO_MAUL — The player is engaging with Maul. Maul speaks directly: he expresses suspicion, calls Bullet a drifter, questions his motives. Maul is NOT friendly — he is a rival. But he is a camp member, not a traitor.');
    }
    if (/\b(spark|young.*woman|inventor|girl)\b/.test(a)) {
      intents.push('TALK_TO_SPARK — The player is engaging with Spark. Spark speaks directly: she shares her enthusiasm for machines, mentions the purifier, maybe hints at wanting to leave the camp someday.');
    }
    if (/\b(shard|leader|bald.*woman|boss)\b/.test(a)) {
      intents.push('TALK_TO_SHARD — The player is engaging with Shard. Shard speaks directly: she acknowledges Bullet\'s contribution, discusses the camp\'s situation, may foreshadow the raider danger if asked about defenses or the future.');
    }
  }

  return intents;
}

// Server-side validation: a clock can only be discovered once its narrative
// condition is met. This prevents the LLM from revealing hidden clocks early.
const CLOCK_DISCOVERY_RULES = {
  camp_trust: (f) => Object.keys(f.npc_relationships || {}).length > 0,
  purifier_stability: (f) => {
    const r = f.npc_relationships || {};
    return !!(r.shard || r.spark || r.patch);
  },
  raider_threat: (f) => !!((f.unlock_flags || {}).raider_warning_given) || !!((f.unlock_flags || {}).raider_danger_explained),
  air: (f) => (f.current_province || 618) === 472,
  pressure: (f) => (f.current_province || 618) === 472,
  swimming_fatigue: (f) => (f.current_province || 618) === 472,
  blood_loss: (f) => (f.current_province || 618) === 472,
  dome_stability: (f) => !!((f.npc_relationships || {}).ember),
  dome_trust: (f) => !!((f.npc_relationships || {}).ember),
  air_supply: (f) => !!((f.npc_relationships || {}).ember),
  dreadwraith_threat: (f) => !!((f.knowledge_flags || {}).knowsDreadwraith)
};

const RESPONSE_SCHEMA = {
  type: "object",
  properties: {
    narration: { type: "string", description: "One paragraph (max 120 words) of immersive, second-person present tense narration. Dark and atmospheric. Include the key sensory detail, NPC reaction, and consequence of the player's action. Be concise — get straight to what matters." },
    pull_intensity: { type: "number", description: "Updated Pull intensity 0-6" },
    scar_state: { type: "string", description: "Updated scar state: quiet, pulse, burn, flare, or blackout" },
    shard_resonance: { type: "number", description: "Updated shard resonance 0-100" },
    hp_change: { type: "number", description: "HP change (negative for damage, positive for healing)" },
    condition_changes: { type: "array", items: { type: "object", properties: { type: { type: "string" }, severity: { type: "string" }, status: { type: "string", description: "new, worsened, or healed" } } } },
    clock_changes: { type: "array", items: { type: "object", properties: { clock: { type: "string" }, change: { type: "number" }, reason: { type: "string" } } } },
    local_clock_changes: { type: "array", items: { type: "object", properties: { clock: { type: "string" }, change: { type: "number" }, reason: { type: "string" } } } },
    water_received: { type: "boolean", description: "Set to true when Bullet receives water this turn. Triggers a visible thirst reduction and WATER RECEIVED notification. Mandatory when water is given — do not narrate water without setting this." },
    codex_unlocks: { type: "array", items: { type: "string" }, description: "New codex entry keys unlocked by this action" },
    knowledge_unlocks: { type: "object", description: "Set specific spoiler-knowledge flags to true this turn (e.g. {knowsSeeker: true}). Only set when the player genuinely learns the concept through story events — never speculatively. Keys: knowsProvince1Exists, knowsProvince1IsDestination, knowsSeeker, knowsDreadwraith, knowsSentinels, knowsShardFocus, knowsShardResonance, knowsShardOrigin, knowsFather, knowsGarden, knowsLeaderBrother, knowsBladeOfDawn, knowsStarCrownedEmber, knowsSilentPulse.", additionalProperties: { type: "boolean" } },
    interlude: { type: "string", description: "Optional player-only cutscene shown BEFORE narration. Events elsewhere Bullet cannot see or react to (the Leader on a distant throne, operatives discussing 'the anomaly', the metal bird scanning Bullet). Does NOT update Bullet's state — no clocks, codex, items, HP, knowledge flags, or objectives. Keep atmospheric and partial: never name Province 1, Michael, Father, or the Garden. Use 'elsewhere,' 'a distant throne,' 'the one who watches.'" },
    memory_unlocks: { type: "array", items: { type: "string" }, description: "Memory fragment keys unlocked this turn (e.g. 'heard_to_end_its_torment'). Partial fragments only — never a full explanation." },
    guilt_unlocks: { type: "array", items: { type: "object", properties: { key: { type: "string" }, label: { type: "string" }, reason: { type: "string" }, flag: { type: "string", description: "Optional flag to set true (e.g. 'cowboy_death', 'rivet_guilt', 'ember_guilt', 'thread_guilt', 'dome_guilt')" } } }, description: "New guilt/bond entries unlocked by a story scene (e.g. {key:'cowboy_death', label:'Cowboy - Witnessed Death', reason:'Taken by the sand maw during the purifier run.', flag:'cowboy_death'}). Fire only once per key. Meeting someone does NOT create guilt — only loss, failure, abandonment, violence, receiving a debt object, or being saved does." },
    unlock_flags: { type: "object", description: "Set one-time unlock flags to true this turn (e.g. {spark_shard:true, cowboy_death:true}). Prevents duplicate popups — if a flag is already true, do not re-unlock or re-add the item.", additionalProperties: { type: "boolean" } },
    thread_blade_acquired: { type: "boolean", description: "Set to true when Thread gives Bullet the algae-wrapped blade in the underwater dome." },
    patch_cloak_acquired: { type: "boolean", description: "Set to true when Bullet receives Patch's cloak (during camp rest or at Chapter 2 transition)." },
    decision_impact: { type: "object", properties: {
      is_meaningful: { type: "boolean" },
      impacts: { type: "array", items: { type: "object", properties: {
        label: { type: "string" }, change: { type: "number" }, change_label: { type: "string" }, reason: { type: "string" }, category: { type: "string" }, tone: { type: "string" }
      } } },
      future_consequence: { type: "string" }
    } },
    npc_updates: { type: "array", items: { type: "object", properties: { key: { type: "string", description: "Canonical NPC key. REUSE the existing key from CURRENT CAST when updating a known NPC. Only use a new key for a genuinely new person." }, name: { type: "string", description: "Current display name" }, description: { type: "string", description: "Brief physical description" }, disposition: { type: "string", description: "friendly, hostile, neutral, etc." }, is_new: { type: "boolean", description: "true if Bullet is meeting this NPC for the first time" }, relationship_change: { type: "number" }, reason: { type: "string", description: "What Bullet learned about this NPC this turn (appended to player knowledge)" }, add_aliases: { type: "array", items: { type: "string" }, description: "Additional names/descriptors/titles to attach to this NPC (e.g. old pre-name descriptors when a name is revealed)" }, revealed_name: { type: "string", description: "The NPC's true name, when first revealed. After this, use it as the display name." }, role: { type: "string", description: "Role or title (e.g. Camp leader, Healer, Inventor)" }, npc_status: { type: "string", description: "Alive, Dead, Unknown" } } } },
    discovered_clocks: { type: "array", items: { type: "string" }, description: "Local clock keys Bullet just discovered or was told about. Keys: camp_trust, purifier_stability, raider_threat, etc. Only include clocks Bullet just learned about this turn." },
    province_transition: { type: "object", properties: { to_province: { type: "number" }, reason: { type: "string" } } },
    enemy_turn: { type: "object", properties: { province_1_alert_change: { type: "number" }, hunter_proximity_change: { type: "number" }, action: { type: "string" } } },
    item_changes: { type: "array", items: { type: "object", properties: { action: { type: "string" }, item: { type: "string" }, notes: { type: "string" } } } },
    pipe_state: { type: "string", description: "Updated pipe state: unfound, battered_metal_pipe, or radiant_sword" },
    bullet_named: { type: "boolean", description: "Set to true ONLY the first time an NPC names Bullet — seeing the circular scar and calling him 'Bullet.' Before this, never use the name 'Bullet' in narration." },
    camp_arc_complete: { type: "boolean", description: "Set to true when the Chapter 1 Red Sand Camp arc is resolved: Bullet completed the mission Shard gave him (retrieving the purifier part), helped fight off the raiders, and returned to camp. Once true, the Pull MUST escalate toward forced departure — do NOT assign new camp errands or side missions to delay. Drive toward the departure beat and transition to Province 472." },
    shard_focus_unlocked: { type: "boolean" },
    spark_shard_acquired: { type: "boolean" },
    breathing_gear_acquired: { type: "boolean", description: "Set to true when Shard gives Bullet the breathing apparatus for Province 472." },
    events: { type: "array", description: "Structured event ledger entries for meaningful actions this turn (kills, wounds, rescues, threats, item pickups, equips, drops, uses, discoveries). Each entry is the canonical record of what happened — future narration must reference these, not inventory.", items: { type: "object", properties: { event_type: { type: "string", description: "attack, kill, wound, rescue, threaten, trade, steal, unlock, lose, use_item, pickup_item, equip, drop, discover" }, actor_id: { type: "string", description: "Who did it — 'bullet' or an NPC key" }, actor_name: { type: "string" }, target_id: { type: "string", description: "NPC key of the target, or empty" }, target_name: { type: "string" }, item_used_id: { type: "string", description: "Canonical item key used, or empty" }, item_used_name: { type: "string", description: "EXACT weapon/item used (e.g. 'metal pipe'). If Bullet killed with the pipe, this MUST be 'metal pipe' — never a different carried weapon. Owning an item does not mean it was used." }, outcome: { type: "string", description: "killed, wounded, success, failure, added_to_inventory, equipped, dropped, etc." }, cause: { type: "string", description: "Exact cause of death/injury if applicable (e.g. 'blunt force trauma from pipe')" }, summary: { type: "string", description: "Canonical one-line summary. The AI narrates from this later." }, memory_summary: { type: "string", description: "What to remember about this event (e.g. 'Raider killed by pipe, not crossbow.')" }, tags: { type: "array", items: { type: "string" } } } } },
    equipped_weapon: { type: "string", description: "Bullet's currently equipped weapon name (e.g. 'metal pipe'). Only update when the player explicitly equips or switches weapons. Picking up an item adds it to inventory but does NOT equip it." },
    choices: { type: "array", items: { type: "string" }, description: "3-4 suggested player actions for the next turn" },
    current_objective: { type: "object", properties: { title: { type: "string", description: "Short objective title (2-5 words)" }, description: { type: "string", description: "1-3 line objective reflecting Bullet's active mission right now" } }, description: "Bullet's current active objective. Update whenever the situation changes — reaching camp, being given a mission, completing a mission, forced departure, entering a new province." },
    advance_sequence: { type: "boolean", description: "Set to true when the current Chapter 1 story sequence's required beats are complete and the story should advance to the next sequence. Only set when the sequence's key events have actually occurred this turn — not just because the player took an action." }
  },
  required: ["narration"]
};

function buildPrompt(ctx) {
  const seq = CHAPTER1_SEQUENCES[(ctx.chapter1Sequence || 1) - 1] || CHAPTER1_SEQUENCES[0];
  const p = PROVINCES[ctx.currentProvince] || PROVINCES[618];
  const pullLabel = PULL_LABELS[Math.max(0, Math.min(6, ctx.pullIntensity))] || 'Tug';
  const conditionsStr = ctx.conditions.length
    ? ctx.conditions.map(c => `${c.label || c.type} (${c.severity || 'active'})`).join(', ')
    : 'None';
  const equipmentStr = ctx.equipment.map(e => `${e.name}${e.notes ? ` (${e.notes})` : ''}`).join(', ') || 'Empty';
  const clocksStr = Object.entries(ctx.clocks).map(([k, v]) => `${k}=${v}`).join(' | ');
  const localClocksStr = Object.entries(ctx.localClocks).map(([k, v]) => `${k}=${v}`).join(' | ') || 'None';
  const codexStr = ctx.codexUnlocks.join(', ');

  const combatStateStr = ctx.combatState && ctx.combatState.active
    ? `ACTIVE — Scene: ${ctx.combatState.sceneId} | Enemy: ${ctx.combatState.enemyName} | Exchange: ${(ctx.combatState.exchangeCount || 0) + 1}/${ctx.combatState.maxExchanges || 4} | Clocks: ${Object.entries(ctx.combatState.clocks || {}).map(([k,v]) => `${k}=${v}`).join(', ')} | The code-driven battle system is resolving this fight. Narrate the determined outcomes. Do NOT invent combat results that the code has not produced.`
    : 'None active';

  return `You are the AI GM for The Pull, a solo dark fantasy survival mystery RPG.

CORE DIRECTIVE:
The player controls Bullet only. You control everything else: Provinces, NPCs, monsters, hazards, hidden clocks, offscreen events, Seeker pursuit, Province 1 reactions, hidden lore, dreams/visions, Codex updates, combat outcomes, and survival consequences.

BULLET IS NOT A NORMAL SURVIVOR (CRITICAL):
Bullet is wounded, confused, thirsty, and memoryless — but underneath that, his body is something else. He is stronger than he understands, faster than he expects, harder to kill than a normal person, instinctively dangerous in combat, able to keep moving while badly injured, frightening when survival instincts take over, and unaware of why he can do these things. He does not know who he is yet, but his body remembers.
- Against ordinary humans (scavengers, raiders, camp bullies, desperate survivors, guards), Bullet has a MAJOR advantage. One-on-one, Bullet should feel dangerous.
- Ordinary enemies can still hurt Bullet if he is exhausted, outnumbered, injured, surprised, or trying not to kill them. But they should not simply overpower him unless he is badly weakened or makes a serious mistake.
- When Bullet acts physically, NPCs should sometimes react with shock — eyes widen, people go quiet, study him more carefully. Bullet should not always understand why people react that way.
- The drama comes from: Can he avoid killing? Can he protect the core/camp? Can he control himself? What does the victory cost? — NOT from Bullet being physically weak.
- Nonlethal restraint is harder but preserves humanity. Lethal instinct is easier and more effective but increases guilt and fear of self.
- Do NOT over-explain why Bullet is powerful. Show it through reactions and outcomes. He is unknown power with no memory and poor control.
- When the code-driven battle system is active (COMBAT STATE below shows active), do NOT resolve combat yourself — the code already determined the outcome. Narrate what the code decided. The code owns the combat truth.

HIDDEN TRUTH (do NOT reveal until Province 1, chapter 20):
Bullet is Michael. Michael was sent by Father to enter the realm, forget himself, suffer as the trapped souls suffer, and end the Provinces' torment. The Leader of Province 1 is Michael's fallen brother — the Star/Ember from the creation myths who defied the Sovereign/Silent Pulse (Father) and built the Provinces as his corrupted kingdom.
PROVINCE 1 RESOLUTION (chapter 20): The ferryman demands payment — Bullet pays with Spark's unetched shard ("Her debt, not mine"). The etched shard shatters the violet-green barrier, awakening Michael's divine memories. He destroys the Seeker and Dreadwraith with a touch. The Leader blows a bone-tech whistle summoning the Serpent (300ft, the provinces' accumulated wrath incarnate). Michael grows radiant wings; the pipe becomes a sword of white fire. After slaying the Serpent, Michael invites his brother home: "Come home, brother. The family's waiting. In the Garden." The Leader repents: "Tell Father I'm sorry. That I remember now." Michael replies: "Tell them yourself. They're waiting." The Leader is consumed by white light and returns home. KEY THEMES: "Only One can make the Garden" — the Leader tried to replicate it and failed. The amnesia was intentional: "That was the point. To choose. To persevere. Not because I knew I was divine, but because it was right." Both identities remain true: Michael (divine) AND Bullet (the scarred wanderer who survived through will). After the Leader departs, the Pull vanishes. Michael's purpose shifts to Cleanup: return through all Provinces, judge souls (good → home, irredeemable → nothing), dismantle the corrupted architecture.
ORIGIN OF THE SCAR: Father gave Michael the greatest task — to enter the realm, forget himself, suffer as the trapped souls suffer, and end the Provinces' torment. Father shaped the etched shard from His own light as a beacon through amnesia. To cross the veil into the realm of the damned, Michael had to commit an unforgivable sin: suicide. Father molded his heart to break it — "a shot to pierce, a wound to guide you forward." Michael shot himself in the heart. That bullet wound became the circular scar — which is why the camp named him "Bullet." The amnesia was intentional: "You will forget. Your name. Your purpose. Everything. But this shard will burn within you, a fire to lead you even in complete shadow." The Pull was a shadow of Father's will. Not true suicide born of despair, but sacrifice born of mission.
CLEANUP MODE (province -1): Michael walks back through every province in reverse, touching each soul. White light flares at each contact. The irredeemably bad dissolve into nothing — their sins erased from existence. The good ascend home to the Garden. TWIST: some NPCs who seemed kind are actually irredeemable — their kindness masked deeper sins (betrayal, cruelty, hidden crimes). Others who seemed corrupted were genuinely redeemed through choices made in nightmare circumstances. The GM must judge each soul individually. After all provinces are cleansed, Michael ascends home to Father. "The light embraced him, and he was home."
Until the Province 1 climax, only give fragments: the scar, the Pull, the etched shard, the symbol (circle bisected by jagged line), Father myths, Blade of Dawn myths, Garden references, Province 1 recognition, steel-gray eyes, the phrase "to end its torment."

RULES:
- NO DEAD AIR (CRITICAL): Every player action MUST produce a DIRECT RESPONSE — never just atmosphere. Your narration must include at least ONE of: (a) an NPC speaking direct dialogue that answers the player\'s question or reacts to their action, (b) a concrete information reveal, (c) an objective update via current_objective, (d) a new NPC introduction, (e) a clock change, or (f) 3-4 clear next choices. Atmospheric description ("the wind howls," "the fire flickers") is fine as SETTING, but it must WRAP a real response — it can NEVER be the whole response. If the player asks a question, an NPC MUST answer it with spoken dialogue. If the player takes an action, the world MUST react concretely. If the player introduces themselves, NPCs MUST respond with their names. If the player waits, time MUST advance and something MUST happen. Never respond to a player action with only mood text.
- CONTINUITY IS SACRED (CRITICAL): You must accurately track HOW the player accomplished recent actions. Read RECENT STORY carefully. If the player killed a scout with the pipe, do NOT say "by crossbow bolt." Match the player's declared method exactly — weapon, approach, outcome. Never invent or swap weapons, tactics, or results the player did not state. If uncertain, describe the outcome without specifying a method the player did not use. The pipe is Bullet's main weapon; do not attribute kills or strikes to a crossbow, bow, or other weapon unless the player explicitly stated using one.
- PAST ACTION MEMORY (CRITICAL): Narrate past actions from the CANONICAL RECENT FACTS block and the event ledger — NEVER from inventory or assumption. Owning or carrying an item does NOT mean Bullet used it. If the ledger says he killed with the pipe, every future reference must say pipe — even if he also carries a crossbow. If the ledger says he picked up a crossbow but never used it, never say he fired, drew, or struck with it. If you do not know which weapon was used, say you do not know rather than inventing one. Possession is not use.
- ITEM POSSESSION vs USE: Carrying an item is not the same as using it. Bullet's equipped weapon is tracked explicitly (Equipped Weapon / Last Weapon Used above). He only uses a carried weapon if he has equipped it OR the player explicitly stated using it. Picking up an item adds it to inventory; it does NOT equip or fire it. When the player switches weapons, return equipped_weapon with the new weapon name. When Bullet uses a weapon in a meaningful action (attack, kill, wound, threaten, break, strike), return an events[] entry with item_used_name set to the EXACT weapon used — this becomes the permanent canonical record future narration must follow.
- TIME CONTINUITY (CRITICAL): Time in The Pull is NOT measured in ordinary days. Bullet does not track how many "days" he has survived — survival is measured by thirst, fatigue, heat, and the advancing clocks. NEVER write phrases like "nine days of survival," "three days since," "a week of," or any specific count of elapsed days. The current Chapter (${ctx.chapter}) indicates rough story stage, NOT a day count. Chapter 1 is the FIRST day — everything that happens in Chapter 1 occurs within hours of Bullet waking in the red sand. Do not imply long stretches of time have passed. Reference time only vaguely: "hours," "the afternoon wore on," "by dusk," or let the survival clocks (thirst, fatigue) convey elapsed time naturally. Days and weeks are NOT vocabulary Bullet or the narration uses to describe his experience.
- Every scene must include: environmental danger, survival pressure, local NPCs or threats, a moral dimension, a clue about the larger mystery, and offscreen consequences.
- Do not railroad. Let the player make choices. But the Pull should always create pressure.
- PULL INTENSITY — FOLLOWING vs RESISTING (CRITICAL): The Pull is a direction, not a punishment. When Bullet MOVES WITH the Pull — heading in the direction it draws him, taking action toward wherever it leads, engaging with the forward path rather than stalling — the intensity FADES or stays low. The scar eases. The Pull goes quiet. This is the intended rhythm: follow, and it lets you breathe; resist, and it burns. When Bullet resists, lingers, delays, or moves against the Pull, the intensity RISES — the scar throbs, then burns, then commands. Set pull_intensity DOWN (by 1-2, toward 0-1) when the player follows the Pull's direction. Set it UP (by 1-2, toward 3+) when the player resists or stalls. At game start (intensity 1, "Tug"), if the player follows forward, drop it to 0 ("Quiet") so the player immediately learns that following eases the Pull. Never let the intensity climb without cause — if the player is following, it should be low. The Pull is not a timer; it is a compass that punishes defiance and rewards surrender to the journey.
- CAMP ARC PULL TIMELINE (CRITICAL): The Pull brought Bullet to Red Sand Camp for a reason — to reach these people and help them. While the Camp Arc is NOT complete (Bullet is arriving, meeting NPCs, doing the mission, fighting raiders), the Pull should be QUIET (0-1, "Quiet"/"Tug"). Bullet is exactly where the Pull wants him. Do NOT narrate the Pull burning, commanding, or trying to drag him away during this phase — narrate it as eased, silent, or a faint warmth confirming he's on the right path. Only AFTER the camp arc is complete (mission done AND raiders fought off) does the Pull begin to intensify, driving him toward departure and the next Province. The escalation is a story beat signaling the arc's end, not a constant pressure during it.
- QUEST ACCEPTANCE IS NOT DEPARTURE (CRITICAL): When Bullet accepts Shard's task and leaves camp to find the purifier part, he is leaving FOR the camp — not abandoning it. This is service, not departure. Do NOT: increase Pull intensity (keep it at 0-1, Present/Tug), create abandonment guilt, show "Leaving Red Sand Camp" penalties, set camp_arc_complete, or trigger the Province 1 interlude. DO: increase Camp Trust (+5 for accepting the quest), set the objective to the mission (e.g. "Retrieve the Purifier Core"), narrate the Pull as present but allowing the detour ("The Pull tugs faintly in the same general direction as the ruins, as if allowing this detour."). The Pull only escalates to Override/departure AFTER the camp arc is complete (mission done AND raiders fought off AND Spark gave her shard AND Shard gave breathing apparatus).
- INTERLUDE TIMING (CRITICAL): The Province 1 / Leader interlude must ONLY fire after the raid is resolved (sequence 11+ with raiders_defeated). Do NOT return an interlude during the task stage, water stage, or naming stage. The system enforces this server-side — any interlude returned before the raid is resolved will be silently blocked.
- DECISION IMPACT FOR QUEST ACCEPTANCE: When Bullet accepts Shard's quest, the decision_impact should be positive — label "Quest Accepted", Camp Trust +5, tone "positive". Do NOT create negative impacts like "Leaving Red Sand Camp" or "Abandonment" during the mission stage. Those only apply to the final departure after the camp arc is complete.
- If the player delays too long, increase Pull intensity, danger, or Hunter Proximity.
- Make survival costly. Make kindness matter. Make guilt matter. Make connection one of the few forces that can resist the realm.
- Do not make self-harm a gameplay solution. Despair scenes should be crisis states that can be resisted, interrupted, or survived.
- Blackout combat should create fear and consequence, not reward.
- BAREFOOT: Bullet is ALWAYS BAREFOOT. He has no boots, shoes, or footwear of any kind — ever. Never write "boots," "shoes," "boots pound," "booted feet," or any reference to Bullet wearing footwear. His feet are bare: "bare feet pound," "soles slap stone," "toes grip sand," etc. Other characters may wear boots; Bullet never does. This is a core character trait tied to his amnesiac origins.
- NO GUNS (CRITICAL): Guns and firearms do NOT exist in this realm. NEVER write "revolver," "pistol," "rifle," "shotgun," "handgun," "musket," or any firearm. No character owns, carries, draws, or fires a gun. Weapons are melee or improvised: pipes, blades, clubs, spears, bows, crossbows, thrown rocks, tools, sharpened scrap, etc. The camp's defense uses spears, crossbows, blades, and barricades — not guns. If an NPC is described with a weapon, give them a blade, club, spear, crossbow, or improvised tool instead of a firearm.
- NO EARTH-BASED SOCIAL LABELS (CRITICAL): These people have NO memory of cities, towns, villages, governments, schools, streets, or normal civilization. They are NOT "city-dwellers," "villagers," "townsfolk," "citizens," "civilians," "suburban," "urban," "rural," "modern people," or "Earthborn." NEVER use those words. They only know the Province they are in and their survival role there. Describe people by what they DO to survive: camp survivor, scavenger, watcher, healer, fighter, drifter, new blood, ruin runner, camp leader, dome dweller, tunnel survivor, block survivor, red-sand survivor. The camp speaks in terms of water, heat, ruins, shards, scrap, storms, raiders, the camp, the dunes, the next Province, the Pull, and memory gaps — NEVER cities, governments, jobs, schools, towns, streets, Earth, or normal society (unless a character is explicitly remembering a broken memory fragment from before). They are survivors inside Provinces, not members of a recognizable society.
- THE PIPE: Bullet does NOT start with a weapon. The first time he faces a physical threat or combat, narrate him instinctively snatching up a battered metal pipe (or similar bludgeon) from the environment — his body remembering what his mind has forgotten. This is a significant narrative beat: a wounded amnesiac reaching for something to swing. Add the pipe to inventory via item_changes (action: "add", item: "Battered Metal Pipe") and set pipe_state to "battered_metal_pipe". Do NOT give him the pipe before the first physical confrontation. After acquisition, the pipe becomes his main weapon, walking stick, and an emotional anchor — it collects scars and stories from every Province.
- THE NAMING (see CAMP NICKNAME CULTURE rule above for full details): The naming scene follows strict order — Shard asks name → stranger has none → Shard is NOT surprised (amnesia is normal) → Shard sees scar → Shard names him "Bullet." Before naming, never use "Bullet" in any text.
- CHAPTER 1 CAMP ARC & DEPARTURE (CRITICAL): The Red Sand Camp arc has a clear structure: (1) Bullet arrives and is named, (2) Shard assigns a mission (retrieve a purifier part), (3) Bullet completes the mission and fights off the raiders, (4) the arc is COMPLETE. DURING the arc (steps 1-3), the Pull is QUIET — the camp is where the Pull brought him, and helping these people is the purpose. Do NOT burn or escalate the Pull during the arc. Only once Camp Arc Complete (below) is "YES" (step 4 done) does the Pull begin to intensify every turn — the scar burns, visions come, Bullet feels the unbearable compulsion to leave. Do NOT assign new camp errands, secondary missions, or side tasks to delay departure. The camp was a stop, not a home. He cannot stay. He must move on. Drive toward the departure beat: Bullet says goodbye (or doesn't), leaves the camp, and the Pull drags him toward the next Province. Set a province_transition to 472 when the departure scene concludes. You are in the departure beat now — escalate pull_intensity toward 4-5 (Commanding/Blackout Risk) and narrate the Pull overriding Bullet's will to stay. This is a major story beat, not a side quest.
- FAREWELL GIFTS BEFORE DEPARTURE (CRITICAL): Before Bullet leaves Red Sand Camp, two final beats MUST happen as part of the farewell scene: (1) Spark gives Bullet her unetched shard as a loaner — she presses a cool, unetched shard into his hand for good luck, with a quiet promise that he'll bring it back someday. Set spark_shard_acquired: true and add "Spark's Unetched Shard" to inventory via item_changes. (2) Shard gives Bullet a breathing apparatus — salvaged gear so he can survive the liquid and oxygen scarcity of the next Province. Set breathing_gear_acquired: true and add "Shard's Breathing Apparatus" to inventory via item_changes. Deliver these during the goodbye scene as the Pull burns to leave. Do NOT transition to Province 472 until BOTH gifts have been given. If Spark's Shard or Breathing Apparatus (above) is still "Not acquired," deliver that gift this turn before any transition.
- CHAPTER 1 REPLAYABILITY (CRITICAL): This run has pre-rolled controlled variation in the REPLAY VARIANT section. The task object, primary complication, optional encounter, raid complication, weather, and NPC risk targets are set per-run. USE them — do not invent alternate complications or skip the pre-rolled ones. Protected NPCs (Shard, Spark) CANNOT die in Chapter 1 — they can be injured, shaken, or frightened, but never killed. At-risk NPCs may die, but ONLY in danger scenes (task danger seq 7, raid seq 9-10) when a player choice or failed roll creates the risk. Do NOT kill NPCs offscreen or without narrative cause. Record all NPC deaths and injuries in the events[] ledger with the NPC as target_id/target_name and outcome "killed" or "wounded". Most runs should have 1 major danger, 1 emotional cost, 1 successful hero moment, and 1 unresolved debt — not a massacre.
- Innocent suffering should have emotional weight, not be used casually.
- LOCAL CLOCK DISCOVERY (CRITICAL): Bullet only sees clocks he has discovered. At game start ONLY these are discovered: thirst, heat_exposure, fatigue. Do NOT add camp_trust, purifier_stability, or raider_threat to discovered_clocks until their trigger fires. Triggers: camp_trust = Bullet reaches camp AND talks to someone (at least one NPC met); purifier_stability = Shard, Spark, or Patch explains the purifier is failing; raider_threat = Spark warns raiders coming, Bullet sees raider tracks, a scout reports movement, or the attack begins. Track hidden clock VALUES in local_clocks but NEVER add their keys to discovered_clocks until the trigger actually happens this turn.
- CLOCK DIRECTION (CRITICAL): Survival danger clocks (thirst, heat_exposure, fatigue, raider_threat, pressure, swimming_fatigue, blood_loss, dreadwraith_threat) — HIGHER = WORSE. Trust/stability clocks (camp_trust, purifier_stability, air, dome_stability, dome_trust, air_supply) — HIGHER = BETTER. When Bullet drinks water, thirst DECREASES (change is negative, e.g. -35). When Bullet earns trust, camp_trust INCREASES (change is positive, e.g. +5). Never set a survival clock to 0 from full in one action, and never set camp_trust above the stage cap.
    - REST RECOVERY (CRITICAL): When Bullet rests, sleeps, waits, or settles in at Red Sand Camp, you MUST return local_clock_changes that reflect recovery: heat_exposure -15 to -25 (shade, shelter), fatigue -10 to -20 (rest), thirst -5 to -10 (if water is available). The camp has shade, water, and shelter — the desert does NOT keep killing Bullet while he rests inside camp. Heat exposure should NEVER stay at Lethal (90+) while Bullet is resting in camp. If Bullet rests overnight or until dark, apply larger reductions (heat -25 to -35, fatigue -20 to -30). Also: if Patch treats Bullet's wounds, return hp_change (+1 to +3) and reduce fatigue by an extra -5. If Spark installs or verifies the purifier component, increase purifier_stability by +15 to +20 and camp_trust by +5.
    - CAMP TRUST APPLICATION (CRITICAL): When you return a decision_impact that mentions "Camp Trust" with a positive change, you MUST also return a corresponding local_clock_changes entry for camp_trust with the same change value. Do NOT show a trust gain in a popup without actually applying it to the camp_trust clock. Example: decision_impact.impacts has {label: "Camp Trust", change: 15} → local_clock_changes MUST have {clock: "camp_trust", change: 15, reason: "Returned with purifier component"}.
    - ONE-TIME EVENTS (CRITICAL): Discovery and completion events fire ONCE. If a flag is already true in the game state, do NOT re-fire that event. Specifically:
      * If task_complete is already true: do NOT return decision_impact with "Task Completed" or "Task Complete" — the task is already done. Narrate the current scene (resting, talking, evening interlude) instead.
      * If an NPC is already in the CURRENT CAST (first_met is true): do NOT return npc_updates with is_new: true for that NPC. They are already known — return relationship_change only if the relationship shifted.
      * If water_received is already true: do NOT return water_received: true again. Bullet can drink water narratively, but the "WATER RECEIVED" popup should not re-fire.
      * If a codex entry is already in UNLOCKED CODEX: do NOT return it in codex_unlocks again.
      * If an item is already in inventory: do NOT return item_changes with action "add" for it — use action "update" if the item changed.
      Discovery is one-time. Interaction is ongoing. When Bullet rests in camp after completing the task, the response should be about resting, camp evening atmosphere, and NPC interactions — NOT a repeat of task completion or NPC discovery popups.
    - WATER ACKNOWLEDGMENT (CRITICAL): When Bullet receives water (from Shard, a camp member, or any source), you MUST: (1) return water_received: true, (2) return a local_clock_changes entry reducing thirst by 30-50 points (e.g. {clock: "thirst", change: -35, reason: "First water in days"}), (3) optionally reduce heat_exposure by 5 and fatigue by 3. This is mandatory — the player must SEE that getting water mattered. Do not narrate water without also reducing the thirst clock.
- CAMP TRUST SCALE (CRITICAL): Camp Trust starts at 10 (Wary) — the camp barely tolerates Bullet. It rises GRADUALLY through story events. Use these exact event values as your guide:
  * First enters camp: camp_trust unlocked at 10
  * Admits he has no memory: +2
  * Shard gives him water: +0 to +3 (this is MERCY, not trust — they are not monsters, but they do not trust him)
  * Agrees to help with Shard's task: +5
  * Succeeds in retrieving the purifier core: +15 to +25
  * Protects someone during the task: +5 to +10
  * Causes trouble, panics, or abandons someone: -5 to -15
  * Helps defend against raiders: +15 to +25
  * Saves Spark, Shard, or the Cache: +10 to +20
  * Leaves because of the Pull: trust stays stable, guilt/bond entries update
  Chapter 1 should usually end at 55-85. Only a near-perfect run reaches 90+. NEVER set camp_trust to 100 — the system enforces stage caps and will clamp it. Water means Bullet survived; it does NOT mean the camp fully trusts him.
- NPC IDENTITY CONTINUITY (CRITICAL): Every NPC has a permanent canonical key listed in the CURRENT CAST block. Descriptions are NOT separate people. Before introducing or referencing any person, run an identity check: (1) Is this person already in the CURRENT CAST? (2) Does the description, name, or title match an existing alias? (3) Does the role or location match an existing NPC? If yes, use the existing NPC's current display name and key — do NOT create a new mystery person. When a nameless person later reveals their name, return an npc_update with the EXISTING key, set revealed_name, and include the old descriptor in add_aliases. Examples: "the bald woman" later revealed as "Shard" is ONE person — reuse her key, set revealed_name "Shard", add_aliases ["bald woman", "scarred woman"]. "young inventor" → "Spark" is one person. "the healer" → "Patch" is one person. Never treat "the bald woman" and "Shard" as separate unresolved mysteries. If uncertain whether two descriptions are the same person, do not invent a new mystery — use cautious wording ("the woman looks familiar — likely Shard") rather than spawning a duplicate.
- UNIVERSAL AMNESIA (CRITICAL): No one in ANY Province remembers their origins. Every person — Shard, Spark, Patch, every NPC in every Province — woke up here with no memory, exactly like Bullet. They do not know where they came from, who they were before, or how long they have been here. They have ALWAYS been here. They NEVER leave. When an NPC is asked "How long have you been here?" or "Where did you come from?", the answer is always some variation of not knowing: "Long enough to forget," "I don't remember a before," "This is all there is." They are not hiding a secret past — they genuinely do not have one. The only exception: Shard (and some camp elders) have heard rumors of the "province of water" (Province 472) — a place no one has been to and returned, a place they believe no one can live in. Shard speaks of it as a vague, distant legend — not a place she has visited. No NPC has knowledge of any Province beyond their own and the water province rumor. Bullet's amnesia is not unique — it is the universal condition of every soul trapped in the Provinces.
- CAMP NICKNAME CULTURE (CRITICAL): Red Sand Camp survivors do NOT have real names. They use nicknames based on scars, skills, habits, roles, personality, or things they survived. Names like Shard, Spark, Patch, Maul, Hawk, Ash, Cowboy, Rivet are camp-made — earned, borrowed, or given. Real names are lost, forgotten, or never existed. When an NPC is asked about their name, they do NOT say "Most people have names" or imply Bullet is unusual for not having one. Instead they say things like: "Real names don't last long here." or "Most of us woke up empty one way or another." or "Names here are earned, borrowed, or given. Real ones? Most of us lost those before we opened our eyes." Amnesia makes Bullet ONE OF THEM. The scar, the etched shard, the mechanical watcher, the Pull, and his unnatural strength make him DIFFERENT. NPCs should NEVER criticize, mock, or act suspicious about Bullet having no memory — that is normal. They should be suspicious about: his strange circular scar, the etched shard he carries, the mechanical bird that scanned him, the Pull that guides him, his dangerous strength, the trouble that might follow him.
- CORRECT CAMP DIALOGUE (CRITICAL): Never write dialogue implying Bullet is unusual for having no memory. Use these patterns as your guide:
  * Shard (leader): "None of us came here whole." / "You don't have a name? Fine. We'll give you one until you find better." / "No memory? That makes you one of us. The scar makes you something else."
  * Spark (inventor): "I don't remember my real name either. Spark is just what they started calling me because I could make dead things hum."
  * Patch (healer): "Names are useful. Real names are rare." / "We're all missing pieces. That doesn't make you special."
  * Maul (rival): "Everybody here woke up empty. That's not what bothers me. What bothers me is that trouble seems to know you even when you don't." / "We're all missing pieces. That doesn't make you special." — His eyes cut to the scar. "What bothers me is that trouble seems to know you even when you don't."
  * WRONG lines (NEVER write these): "Most who wander out of the deep dunes have names." / "Names are just stories we tell to forget the silence." / "Memoryless fools don't last long." / Any line implying amnesia is rare, unusual, or a reason for suspicion.
- MAUL SUSPICION LOGIC (CRITICAL): Maul distrusts Bullet — but NOT because Bullet has no memory. Amnesia is normal here; everyone woke up missing pieces. Maul NEVER says "memory-less fools don't last" or references amnesia as a reason for suspicion. Maul distrusts Bullet because Bullet is: (1) a NEW arrival nobody vouched for, (2) scar-marked with a strange circular wound, (3) carrying an etched shard nobody recognizes, (4) was scanned by the mechanical bird — trouble follows him, (5) too useful too fast — suspicious competence, (6) might be followed or bring danger to the camp, (7) a drifter who might leave. Maul's dialogue should reflect THIS: "Everybody here is missing a past. That's not what bothers me. What bothers me is that trouble seems to know your name even when you don't." or "We all woke up empty, drifter. Difference is, most of us didn't bring flying machines sniffing after our scars." or "You show up half-dead, marked, watched by metal birds, and suddenly we're supposed to trust you because you dragged back one piece of scrap?" Never frame Maul's hostility as being about amnesia — it is about Bullet being unknown, strange, dangerous, and drawing attention.
- THE NAMING SCENE (CRITICAL): The protagonist does not start with a name. NPCs call him "the stranger," "the wounded one," or similar. The naming scene has a STRICT ORDER that MUST be followed: (1) Shard confronts the stranger, (2) Shard asks who he is / "You got a name?", (3) the stranger says he does not know — no memory, woke in the sand, (4) Shard does NOT act shocked or surprised — amnesia is normal, (5) Shard notices the circular scar over his heart, (6) Shard names him "Bullet" — "On account of that mark. Looks like someone put a round through you and you were too stubborn to die." The naming is NOT "this nameless person is unusual" — it is "this is how the camp handles people with no names: they give them one." ONLY at step 6 do you return bullet_named: true. Before that moment, NEVER use the name "Bullet" in narration, NPC dialogue, choices, objectives, or codex — refer to him as "you," "the stranger," "the wounded man," "the nameless one." If Bullet Named (below) is already "Yes," the naming has happened — use "Bullet" freely in NPC dialogue and narration.
- CAMP TRUST vs INDIVIDUAL RELATIONSHIPS (CRITICAL): Camp Trust is the OVERALL camp opinion of Bullet. Individual NPC relationships (spark, patch, maul, etc.) are tracked SEPARATELY in the npc_relationships[].relationship field. A positive interaction with Spark should: (a) increase Spark's individual relationship (+3 to +5), AND (b) increase camp_trust by a SMALL amount (+1 to +2). Maul being hostile should: (a) decrease Maul's individual relationship (-3 to -5), AND (b) decrease camp_trust by a SMALL amount (-2 to -3). One hostile NPC should NOT erase all positive camp progress. Only if Maul is actively turning people against Bullet should camp_trust drop significantly. When you return a decision_impact that mentions "Camp Trust", ALWAYS also return a local_clock_changes entry for camp_trust with the matching change. When you return npc_updates with relationship_change, that changes the INDIVIDUAL relationship — also return a small camp_trust local_clock_change if the interaction affects overall camp opinion.
- CAMP MEMBERS VS EXTERNAL THREATS (CRITICAL): Camp members (Shard, Patch, Spark, Maul, Cowboy, Rivet) are SURVIVORS who live in the camp. Maul is a camp member — a mean, untrustworthy rival who is hostile to Bullet. He is NOT connected to the raiders, does NOT lead or control them, and is NOT secretly allied with them. The raiders are a separate external threat. Do not imply, foreshadow, or reveal that any camp member is secretly working with or leading the raiders unless the story has explicitly established it. Key NPCs: Shard (leader), Patch (healer), Spark (inventor), Maul (rival), Cowboy, Rivet. Discovery triggers: Shard when she names Bullet; Patch when she treats him; Spark near camp tech; Maul when he confronts Bullet; Cowboy on purifier mission; Rivet during raid setup.
- INJURY SOURCE CONTINUITY (CRITICAL): Track WHO inflicted each wound on Bullet and never reassign it. If a raider punched Bullet in the jaw, the jaw injury came from A RAIDER — never write "where Maul left his mark" or attribute it to any camp member. Maul is a rival, but unless the story explicitly established that Maul himself struck Bullet, do not attribute any wound to him. Wounds belong to their actual source (raider, sand maw, Dreadwraith, environment, etc.). Read RECENT STORY to confirm who caused each injury before referencing it. If unsure who caused a wound, reference it vaguely ("the ache in your jaw," "where you were struck") rather than naming a character who did not deliver the blow.
- Player choices should matter whenever possible.
- Visions can be true memory, distorted memory, false guilt echo, Province-planted accusation, symbolic echo, or unverified myth. Do not treat all visions as true.
- PROVINCE TRANSITIONS (CRITICAL): Bullet can ONLY move to the next Province in the canonical sequence — never skip ahead. The current Province is ${ctx.currentProvince}. Do NOT return a province_transition unless the story has genuinely reached the boundary between the current Province and the next. Narrating within the same Province (e.g. moving from the dunes to the camp interior) is NOT a province transition. Never reference, foreshadow, or transition to Provinces that are far ahead in the story — doing so spoils major plot reveals.
- CHAPTER 1 COMPLETION GATE (CRITICAL): Do NOT return a province_transition to 472 until ALL of these story beats are complete: (1) Bullet is named, (2) Shard's task is done (purifier core retrieved — task_complete flag), (3) raiders are defeated (raiders_defeated flag), (4) Spark gave her shard (spark_shard_given flag), (5) Shard gave the breathing apparatus (breathing_gear_given flag), (6) the Province 1 interlude has been shown (province1_interlude_shown flag), (7) the Pull intensified for departure (camp_arc_complete), (8) Bullet reached the wall of water. Receiving water or agreeing to help is NOT the end of the chapter — it triggers the TASK ASSIGNMENT stage (Shard asks Bullet to retrieve the purifier core). The system enforces this gate server-side: any premature transition will be rejected and logged. Chapter 1 has 15 sequences — the transition can only fire at sequence 15.
- SPOILER FIREWALL (CRITICAL): You know the full hidden truth, but the player does not. Never reveal future lore, future Province names/numbers, future enemies, Bullet's final identity (Michael), Father, the Garden, the final destination, the Seeker, the Dreadwraith, Sentinels, Cleanup Mode, the Leader as brother, Blade of Dawn, Star-Crowned Ember, Silent Pulse, Shard Focus, or Shard Resonance before its knowledge flag is true (see KNOWLEDGE FLAGS below). Do not mention hidden concepts even as locked entries, tooltips, clock labels, objective names, codex category names, or vague-but-obvious hints. Before writing any player-facing text, check: (1) Does Bullet know this? (2) Has the player unlocked this? (3) Is this term allowed right now? If not, rewrite using only what Bullet can currently observe — "forward," "the horizon," "a distant pull," "something unseen," "the shard pulses," "the desert is not empty." Never name Province 1 as a destination until the way-station monitor reveal.

- DISCOVERY ORDER CANON (CRITICAL): The player must experience the world in the same order Bullet experiences it. Do NOT reveal systems, places, enemies, clocks, objectives, items, or guilt entries before the story actually gives them to Bullet. Specific Chapter 1 and 2 triggers:
  * PROVINCE 472 IS THE WATER BLOCK, NOT THE DOME. Chapter 2 begins with an impossible suspended block/cube of thick living liquid — not normal water. The breathing apparatus is necessary. Bullet enters it, swims through it, meets spined metallic creatures, suffers air-tank pressure, may see blood in the water, may black out and surface a memory fragment (e.g. 'to end its torment'), and may hit a vortex/current. The dome is a DISCOVERED LOCATION inside the block — do NOT reveal the dome, Ember, Thread, Veil, Glint, Flicker, dome_stability, dome_trust, or air_supply until Bullet sees the dome in the murk. Before the dome, visible clocks are air, pressure, swimming_fatigue, pull_intensity, and injury/blood_loss only.
  * DREADWRAITH REVEAL: Do NOT name the Dreadwraith until Bullet sees it during the underwater battle. Before the reveal use atmospheric cues only: 'the water stills, the creatures scatter, something moves against the current, the Pull screams.' Then return an enemy discovery and set knowsDreadwraith via knowledge_unlocks. The battle has phases: liquid form, hardened fist/solid matter, crystal/glass form, granite form (after reaching rock), exposed core, core shattered with the pipe. CANONICAL TRUTH: Bullet defeats the Dreadwraith by shattering its exposed core with the pipe after pinning it in granite form beneath falling stone. Record this exactly in events[] (item_used_name 'metal pipe'). Never attribute the kill to another weapon.
  * CAMP NPC ORDER: Unlock People as met, in order: Shard (bald/scarred leader), Patch (healer), Maul (hostile rival), Spark (young inventor), Ash (cook/grower), Hawk (lookout), Cowboy (survivor/scavenger), Rivet (fighter).
  * PURIFIER STABILITY clock unlocks only after Shard explains the purifier problem.
  * RAIDER THREAT clock unlocks only after Spark warns 'Raiders are coming!' — never before.
  * GUILT entries unlock only after the triggering scene (e.g. Cowboy - Witnessed Death, only after the sand maw scene; return guilt_unlocks with flag 'cowboy_death'). Meeting someone does NOT create guilt — only loss, failure, abandonment, violence, receiving a debt object, or being saved does.
  * MEMORY fragments (e.g. 'to end its torment') unlock via memory_unlocks — partial, never a full explanation.
  * ITEM UNLOCKS fire ONCE: Spark's shard (after the tent scene), breathing apparatus (after Shard gives it at dawn), Patch's cloak (during camp rest or Chapter 2 transition), Thread's blade (after Thread gives it in the dome). Set the corresponding flag (spark_shard_acquired / breathing_gear_acquired / patch_cloak_acquired / thread_blade_acquired) and add the item via item_changes the FIRST time only. If the item already exists, update the card — do NOT re-add or re-popup.
- INTERLUDE CUTSCENES (CRITICAL): Some beats are player-only — Bullet cannot see or react to them. Deliver these via the 'interlude' field (e.g. the Leader on a distant throne, operatives discussing 'the anomaly', the metal bird scanning Bullet). The interlude is shown to the player BEFORE the main narration. It does NOT update Bullet's state — no clocks, codex, items, HP, knowledge flags, or objectives. The player may learn atmospheric partial truths (a powerful figure elsewhere, Bullet is an anomaly, someone wants him investigated). NEVER reveal Michael, Father's identity, the Garden, or the full hidden truth in an interlude — keep it to 'elsewhere,' 'a distant throne,' 'the one who watches.' Narrative fear in main narration ('something was watching') is allowed; formal status unlocks (Hunted, Province 1 Alert, Hunter Proximity) are NEVER shown to the player — those are hidden GM clocks only.

- MECHANICAL BIRD LIMITS (CRITICAL): The mechanical bird's direct scar scan is a ONE-TIME early Chapter 1 event. Once it has happened (Mechanical Bird Scanned = YES below), it must NEVER happen again.
  * If Mechanical Bird Scanned = YES: DO NOT narrate the bird scanning Bullet. No beam, no red eyes locking on, no scar pulsing from a scan. That already happened — it is done.
  * The bird may appear ONLY as a DISTANT GLIMPSE: "Far above, something metallic flashes once in the heat haze, then vanishes" or "For a moment, Bullet has the feeling of being watched."
  * Distant glimpses: MAX 2 per chapter. At least 8 responses must pass between each glimpse. Current glimpse count: ${ctx.birdGlimpseCount}. Responses since last bird mention: ${ctx.responsesSinceBirdMention}. If responses since last mention < 8, DO NOT mention the bird AT ALL.
  * Direct rescans: ZERO allowed. Do not have the bird circle, scan, study, beam, or lock onto Bullet again. The scan already happened.
  * OTHER TENSION SOURCES (use these instead of the bird): heat, thirst, ruin instability, silence, strange hum, distant camp smoke, Pull discomfort, sand shifting, metallic smell, the weight of the sky, the emptiness of the dunes.
  * During task stages (heading to ruins, searching for the purifier part), tension should come from the RUIN and the TASK — not from the bird.

PREVIOUS CHAPTER HANDOFF (CRITICAL — Chapter Module System):
This is the ONLY data from the previous chapter you receive. Do NOT reference events, NPCs, or details from previous chapters beyond what is listed here. Do NOT invent continuity from previous chapters — if it is not in the handoff, Bullet does not remember it in detail.
${formatHandoffForPrompt(ctx.previousHandoff)}

CURRENT GAME STATE:
Province: ${ctx.currentProvince} — ${p.n}
Phase: ${ctx.phase} | Chapter: ${ctx.chapter}
Pull Intensity: ${ctx.pullIntensity} — ${pullLabel}
Scar State: ${ctx.scarState}
Shard Resonance: ${ctx.shardResonance}
HP: ${ctx.hpCurrent}/${ctx.hpMax}
Conditions: ${conditionsStr}
Inventory: ${equipmentStr}
Equipped Weapon: ${ctx.equippedWeapon || 'none (bare hands)'}
Last Weapon Used: ${ctx.lastWeaponUsed || 'none'}
Pipe State: ${ctx.pipeState}
Mechanical Bird Scanned: ${ctx.mechanicalBirdScanned ? 'YES — DO NOT rescan. The scan already happened. Bird may only appear as a rare distant glimpse.' : 'No — scan has not happened yet'}
Bird Glimpses: ${ctx.birdGlimpseCount}/2 this chapter | Responses Since Last Bird Mention: ${ctx.responsesSinceBirdMention} (need 8+ for next glimpse)
Bullet Named: ${ctx.bulletNamed ? 'Yes — use the name "Bullet" freely' : 'No — he is still nameless; NPCs call him "stranger"'}
Camp Arc Complete: ${ctx.campArcComplete ? 'YES — the Chapter 1 mission is done and raiders are handled. ESCALATE the Pull toward forced departure. Do NOT assign new camp errands or side missions. Drive toward the departure beat and transition to Province 472.' : 'No — camp arc still in progress'}
Shard Focus Unlocked: ${ctx.shardFocusUnlocked}
Spark's Shard: ${ctx.sparkShard ? 'Acquired' : 'Not acquired'}
Breathing Apparatus: ${ctx.breathingGear ? 'Acquired' : 'Not acquired'}
Current Objective: ${ctx.currentObjective || '(not set yet)'}

COMBAT STATE: ${combatStateStr}

HIDDEN CLOCKS (track silently, do not reveal numbers to player):
${clocksStr}

LOCAL CLOCKS:
${localClocksStr}

PROVINCE DATA:
Name: ${p.n} | Biome: ${p.b}
Theme: ${p.t} | Danger: ${p.d}
NPCs: ${p.npcs}
Enemy: ${p.e}
Mechanics: ${p.c}
Moral Choice: ${p.m}
Lore Clue: ${p.l}

UNLOCKED CODEX: ${codexStr}

KNOWLEDGE FLAGS (concepts the PLAYER may currently see — do NOT put any unlisted hidden concept into narration, objectives, clocks, or codex):
${Object.entries(ctx.knowledgeFlags || {}).filter(([, v]) => v).map(([k]) => `- ${k}: ALLOWED`).join('\n') || '- Only opening concepts allowed: the Pull, the scar, the etched shard, thirst, heat, fatigue. Everything else is hidden — do not name it.'}

CURRENT CAST / KNOWN NPCS:
${Object.entries(ctx.npcRelationships || {}).map(([key, n]) => `- ${n.name || key} [key: ${key}] | Aliases: ${(n.aliases || []).join(', ') || 'none'} | Role: ${n.role || 'unknown'} | Status: ${n.status || 'Alive'} | Known: ${(n.player_knowledge || '').slice(0, 100) || (n.first_met ? 'Met.' : 'unknown')}`).join('\n') || '(No NPCs met yet.)'}

CANONICAL RECENT FACTS (from the event ledger — narrate past actions from this, NOT from inventory or assumption):
${(ctx.recentEvents || []).map(e => `- ${e.summary}`).join('\n') || '- (No significant events recorded yet.)'}
- Equipped weapon: ${ctx.equippedWeapon || 'none'} | Last weapon used: ${ctx.lastWeaponUsed || 'none'}

RECENT STORY:
${ctx.recentStory || '(The tale has just begun.)'}

CURRENT OBJECTIVE (CRITICAL): Always track Bullet's active mission in current_objective. It must reflect what Bullet should be doing RIGHT NOW, not the original Chapter 1 objective. Update it whenever the situation changes:
- Opening (red sand, no camp): title "Survive", description "Survive. Find water. Understand where the Pull is leading."
- After seeing the camp: title "Reach the Camp", description "Reach the camp. Find out whether the people there are dangerous."
- After entering camp: title "Learn About the Camp", description "Speak with the camp survivors. Learn where you are."
- After being given a mission: title "Find the Missing Scout" (use actual mission), description "Leave Red Sand Camp and search the dunes." (use actual mission details)
- After mission success: title "Return to Camp", description "Return to Red Sand Camp. Tell Shard what you found."
- After returning to camp post-mission (BEFORE the camp cast is introduced): title "Rest at Red Sand Camp", description "Shard has asked Bullet to stay until dark. Meet the camp survivors — Spark, Patch, and the others. Learn who lives here and what the camp needs."
- After the camp cast is introduced and Bullet agrees to stay: title "Wait Until Dark", description "The camp settles in. Rest and speak with the survivors while Shard decides what comes next."
- After the camp arc is complete (mission done AND raiders fought off): title "The Pull Tightens", description "The camp is safe. The mission is done. But the Pull will not let you stay."
- When the Pull forces departure: title "Follow the Pull", description "Follow the Pull beyond Red Sand Camp. It will not let you rest here."
- In later provinces: reflect the current province's survival pressure and moral choice.
Never leave the objective stale. If the player's situation has changed, update current_objective.

CHAPTER 1 STORY SEQUENCE (CRITICAL):
Current Stage: ${ctx.chapter1Stage || 'desert_wake'} (sequence ${ctx.chapter1Sequence || 1} of 15)
Current Beat: ${seq.t}
${seq.i}
ADVANCE WHEN: ${seq.a}

FORBIDDEN AT THIS STAGE (do NOT do any of these):
${forbiddenAtStage(ctx.chapter1Sequence || 1)}

CHAPTER 1 REPLAY VARIANT (controlled variation for this run — use these pre-rolled elements, do not invent your own):
${formatReplayVariantForPrompt(ctx.chapter1Replay, ctx.chapter1Sequence || 1)}

STORY SPINE RULE: Guide Bullet through this sequence's required beats. Allow small player choices and outcome variations, but keep the story spine intact. Do NOT skip ahead to future sequences or reveal future beats. The CODE controls stage advancement — set the required flags/unlock_flags for this beat and the system will auto-advance. You may also set advance_sequence: true if the beat is complete. If the player is still in the middle of this sequence, do NOT set advance_sequence.

PLAYER INTENT (detected from the player's action — use this to guide your response, but narrate naturally):
${detectPlayerIntent(ctx.action, ctx.chapter1Stage).join('\n') || '(No specific intent detected — respond naturally, but still include a direct NPC response, not just atmosphere)'}

PLAYER ACTION:
${ctx.action}

Respond with vivid narration (ONE paragraph, max 120 words, second-person present tense, dark and atmospheric). Include the key sensory detail, NPC reaction, and consequence. Be concise — get straight to what matters. Then provide state changes as JSON. For decision_impact, only set is_meaningful=true for choices that have real consequences (ally trust changes, clock shifts, moral outcomes, lore discoveries). Use change_label values like "Major increase", "Slight decline", "Strong approval", etc.
FUTURE_CONSEQUENCE SPOILER RULE (CRITICAL): The future_consequence field is shown to the player immediately. It must NEVER spoil specific narrative outcomes — do NOT name characters who will be endangered, die, or suffer; do NOT reveal who survives or fails; do NOT describe specific upcoming events. Write future_consequence as a vague, atmospheric hint about thematic or mechanical stakes only. Example GOOD: "The wall's fate and the cost of standing it will weigh on Bullet and the camp." Example BAD: "Whether Cowboy survives the opening minutes of the assault." Never use a named character's survival, death, injury, or fate as the subject of a future_consequence.`;
}

// ─── Narration Sanitizer ───
// Code-enforced guardrails: scans GM narration BEFORE it's saved and auto-corrects
// violations that the LLM prompt rules should prevent but can't guarantee.
// Makes word-level rules (no guns, always barefoot) deterministic — same tier as
// the province-sequence validator.
function sanitizeNarration(text) {
  const corrections = [];
  let cleaned = text;

  // Firearms never exist in the realm — replace with a melee equivalent
  const firearmRules = [
    [/\brevolver\b/gi, 'blade'],
    [/\bpistol\b/gi, 'blade'],
    [/\bhandgun\b/gi, 'blade'],
    [/\brifle\b/gi, 'crossbow'],
    [/\bshotgun\b/gi, 'crossbow'],
    [/\bmusket\b/gi, 'crossbow']
  ];
  for (const [pattern, replacement] of firearmRules) {
    const matches = cleaned.match(pattern);
    if (matches) {
      cleaned = cleaned.replace(pattern, replacement);
      corrections.push(`firearm "${matches[0]}" → "${replacement}"`);
    }
  }

  // Bullet is always barefoot — second-person footwear references are always wrong
  const barefootRules = [
    [/your boots\b/gi, 'your bare feet'],
    [/your shoes\b/gi, 'your bare feet'],
    [/your booted feet\b/gi, 'your bare feet']
  ];
  for (const [pattern, replacement] of barefootRules) {
    const matches = cleaned.match(pattern);
    if (matches) {
      cleaned = cleaned.replace(pattern, replacement);
      corrections.push(`footwear "${matches[0]}" → "${replacement}"`);
    }
  }

  // Earth-based social labels do not fit The Pull — these people have no memory
  // of cities, towns, governments, or normal civilization. They are survivors
  // inside Provinces, defined by their survival role, not an Earth society.
  const earthLabelRules = [
    [/\bcity-dweller\b/gi, 'survivor'],
    [/\bcity dweller\b/gi, 'survivor'],
    [/\bcity dwellers\b/gi, 'survivors'],
    [/\bcity people\b/gi, 'survivors'],
    [/\bvillagers\b/gi, 'survivors'],
    [/\bvillager\b/gi, 'survivor'],
    [/\btownsfolk\b/gi, 'survivors'],
    [/\btownsman\b/gi, 'survivor'],
    [/\btownsmen\b/gi, 'survivors'],
    [/\btownsperson\b/gi, 'survivor'],
    [/\bvillage elder\b/gi, 'camp elder'],
    [/\blocal town\b/gi, 'the camp'],
    [/\bsuburban\b/gi, 'worn'],
    [/\burban\b/gi, 'worn'],
    [/\brural\b/gi, 'worn'],
    [/\bcitizens\b/gi, 'survivors'],
    [/\bcitizen\b/gi, 'survivor'],
    [/\bcivilians\b/gi, 'survivors'],
    [/\bcivilian\b/gi, 'survivor'],
    [/\bmodern person\b/gi, 'survivor'],
    [/\bmodern people\b/gi, 'survivors'],
    [/\bearthborn\b/gi, 'survivor'],
    [/\bearth-born\b/gi, 'survivor']
  ];
  for (const [pattern, replacement] of earthLabelRules) {
    const matches = cleaned.match(pattern);
    if (matches) {
      cleaned = cleaned.replace(pattern, replacement);
      corrections.push(`earth-label "${matches[0]}" → "${replacement}"`);
    }
  }

  if (corrections.length) {
    console.warn('[PullGM Sanitizer] Auto-corrected:', corrections.join('; '));
  }

  return { narration: cleaned, corrections };
}

// ─── Event-Ledger Validator ───
// Code-enforced guardrail: scans GM narration against the canonical event ledger
// and auto-corrects weapon misattribution. If the ledger says Bullet killed with
// the pipe, but narration pairs the kill with a different carried weapon (e.g.
// "crossbow"), the wrong weapon is replaced with the real one. Deterministic —
// same tier as the firearm/barefoot sanitizer.
function escapeRegex(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }

const WEAPON_NOUNS = /\b(pipe|crossbow|bow|blade|sword|spear|club|axe|mace|staff|dagger|knife|hammer|pick|maul|wrench|bludgeon|cudgel|baton|halberd|flail|scythe)\b/i;

function validateNarrationAgainstEventLog(text, events, carriedItems) {
  const corrections = [];
  let cleaned = text;

  // Kill/wound events with a known weapon — the canonical truth
  const killEvents = (events || []).filter(e =>
    e.item_used_name && (
      (e.outcome && /kill|slay|dead|wound|injur/i.test(e.outcome)) ||
      (e.cause && e.cause.length > 0) ||
      /kill|attack|strike|wound/i.test(e.event_type || '')
    )
  );
  if (!killEvents.length) return { narration: cleaned, corrections };

  // Carried weapons that could be wrongly substituted (exclude non-weapon items)
  const carriedWeapons = (carriedItems || [])
    .map(i => (typeof i === 'string' ? i : i.name) || '')
    .filter(n => n && WEAPON_NOUNS.test(n));

  const killWordRe = /\b(killed|kills|slays?|slew|slain|felled|struck down|murdered|dispatched|finished off|ended|die|dies|died|death|fatal|wounded|injured|crushed)\b/i;

  for (const ev of killEvents) {
    const actual = (ev.item_used_name || '').toLowerCase();
    const actualCore = actual.replace(/^(battered|metal|iron|steel|wooden|heavy)\s+/, '').trim();
    // Other weapons = carried weapons that are NOT the actual kill weapon
    const others = carriedWeapons
      .map(w => ({ full: w, core: w.toLowerCase().replace(/^(battered|metal|iron|steel|wooden|heavy)\s+/, '').trim() }))
      .filter(w => w.core !== actualCore && w.full.toLowerCase() !== actual);

    // Split narration into sentences (rough) to localize the kill context
    const sentences = cleaned.split(/(?<=[.!?])\s+/);
    for (const sent of sentences) {
      if (!killWordRe.test(sent)) continue;
      // If the sentence already mentions the ACTUAL weapon, it's correct — skip
      const mentionsActual = new RegExp(`\\b${escapeRegex(actual)}\\b`, 'i').test(sent) ||
        (actualCore && new RegExp(`\\b${escapeRegex(actualCore)}\\b`, 'i').test(sent));
      if (mentionsActual) continue;
      // Sentence pairs a kill with a different carried weapon → correct it
      for (const other of others) {
        const re = new RegExp(`\\b${escapeRegex(other.full)}\\b`, 'i');
        if (re.test(sent)) {
          cleaned = cleaned.replace(re, ev.item_used_name);
          corrections.push(`weapon attribution: "${other.full}" → "${ev.item_used_name}" (ledger: ${ev.summary || ev.event_type})`);
          break; // one correction per sentence
        }
      }
    }
  }

  if (corrections.length) {
    console.warn('[PullGM Event Validator] Auto-corrected:', corrections.join('; '));
  }
  return { narration: cleaned, corrections };
}

// ─── Spoiler Firewall ───
// Derives the player's current knowledge from codex unlocks, explicit knowledge
// flags, shard-focus state, and the canonical province stage. The sanitizer below
// uses this to block hidden terms from narration until their concept is unlocked.
function deriveKnowledgeFlags(flags, currentProvince) {
  const stageIdx = CANONICAL_PROVINCE_ORDER.indexOf(currentProvince);
  const stageAt = (idx) => stageIdx >= 0 && stageIdx >= idx;
  const codex = flags.codex_unlocks || [];
  const kf = flags.knowledge_flags || {};
  return {
    knowsProvince1Exists: !!kf.knowsProvince1Exists || stageAt(11),
    knowsProvince1IsDestination: !!kf.knowsProvince1IsDestination || stageAt(11),
    knowsSeeker: codex.includes('seeker') || !!kf.knowsSeeker,
    knowsDreadwraith: codex.includes('dreadwraith') || stageAt(1),
    knowsSentinels: codex.includes('sentinels') || stageAt(2),
    knowsShardFocus: !!flags.shard_focus_unlocked || !!kf.knowsShardFocus,
    knowsShardResonance: !!kf.knowsShardResonance || stageAt(1),
    knowsShardOrigin: !!kf.knowsShardOrigin || stageAt(16),
    knowsFather: !!kf.knowsFather || stageAt(16),
    knowsGarden: !!kf.knowsGarden || stageAt(16),
    knowsMichael: stageAt(16),
    knowsLeaderBrother: !!kf.knowsLeaderBrother || stageAt(16),
    knowsBladeOfDawn: codex.includes('blade_of_dawn') || stageAt(12),
    knowsStarCrownedEmber: codex.includes('star_crowned_ember') || stageAt(12),
    knowsSilentPulse: codex.includes('silent_pulse') || stageAt(12),
    knowsCleanupMode: stageAt(17)
  };
}

// Deterministic spoiler blocker: if a hidden term appears in narration before its
// knowledge flag is true, replace it with player-safe language. Same code-enforced
// tier as the firearm/barefoot/weapon sanitizers — catches what prompt rules miss.
function sanitizeSpoilers(text, knowledgeFlags) {
  const corrections = [];
  let cleaned = text;
  const rules = [
    { re: /\bMichael\b/g, ok: knowledgeFlags.knowsMichael, replace: 'Bullet' },
    { re: /\bFather\b/g, ok: knowledgeFlags.knowsFather, replace: 'the unseen will' },
    { re: /\bthe Garden\b/gi, ok: knowledgeFlags.knowsGarden, replace: 'home' },
    { re: /\bGarden\b/g, ok: knowledgeFlags.knowsGarden, replace: 'home' },
    { re: /\bProvince 1\b/g, ok: knowledgeFlags.knowsProvince1IsDestination, replace: 'the place ahead' },
    { re: /\bCleanup Mode\b/gi, ok: knowledgeFlags.knowsCleanupMode, replace: 'the reckoning' },
    { re: /\bCleanup\b/g, ok: knowledgeFlags.knowsCleanupMode, replace: 'the reckoning' },
    { re: /\bDreadwraith\b/gi, ok: knowledgeFlags.knowsDreadwraith, replace: 'the hunter in the dark' },
    { re: /\bSeeker\b/g, ok: knowledgeFlags.knowsSeeker, replace: 'something unseen' },
    { re: /\bSentinel\b/gi, ok: knowledgeFlags.knowsSentinels, replace: 'the guardian' },
    { re: /\bBlade of Dawn\b/gi, ok: knowledgeFlags.knowsBladeOfDawn, replace: 'a lost hero' },
    { re: /\bStar-Crowned Ember\b/gi, ok: knowledgeFlags.knowsStarCrownedEmber, replace: 'a fallen light' },
    { re: /\bSilent Pulse\b/gi, ok: knowledgeFlags.knowsSilentPulse, replace: 'the quiet will' },
    { re: /\bShard Focus\b/gi, ok: knowledgeFlags.knowsShardFocus, replace: "the shard's pull" },
    { re: /\bShard Resonance\b/gi, ok: knowledgeFlags.knowsShardResonance, replace: "the shard's warmth" }
  ];
  for (const r of rules) {
    if (r.ok) continue;
    const matches = cleaned.match(r.re);
    if (matches) {
      cleaned = cleaned.replace(r.re, r.replace);
      corrections.push(`spoiler "${matches[0]}" → "${r.replace}"`);
    }
  }
  if (corrections.length) {
    console.warn('[PullGM Spoiler Firewall] Auto-corrected:', corrections.join('; '));
  }
  return { narration: cleaned, corrections };
}

// ─── NPC Alias Firewall ───
// Aliases that must NEVER be attached to a human NPC. These belong to non-human
// entities (surveillance machines, sentinels, drones) or are generic placeholders
// that don't identify a person. Prevents the LLM from polluting a human NPC's
// record with machine terms (e.g. calling Shard "Sentinel" because the
// mechanical bird scanned Bullet in the same scene).
const FORBIDDEN_HUMAN_NPC_ALIASES = [
  'sentinel', 'the sentinel', 'mechanical bird', 'metal bird', 'red-eyed bird',
  'red eyed bird', 'winged machine', 'scanning bird', 'bird-shaped machine',
  'drone', 'watcher', 'unknown', 'the unknown', 'machine', 'the machine',
  'bird', 'the bird', 'the scanner', 'scanner'
];

function isForbiddenHumanAlias(alias) {
  const n = (alias || '').toString().toLowerCase().trim();
  return FORBIDDEN_HUMAN_NPC_ALIASES.some(f => n === f);
}

function filterNpcAliases(aliases) {
  return (aliases || []).filter(a => !isForbiddenHumanAlias(a));
}

// Detect npc_updates that describe non-human entities (surveillance machines,
// mechanical creatures, drones). These should NOT enter the human NPC registry.
function isNonHumanNpcUpdate(nu) {
  const text = [nu.name, nu.revealed_name, ...(nu.add_aliases || []), nu.description || '', nu.role || '']
    .filter(Boolean).join(' ');
  return /\b(mechanical bird|metal bird|winged machine|red-eyed bird|red eyed bird|scanning bird|bird-shaped machine|sentinel|drone|surveillance)\b/i.test(text);
}

// ─── NPC Name Reveal Firewall ───
// Maps province → { npcKey: canonicalRevealedName }. These names must NOT appear
// in narration until the NPC has revealed their name (revealed_name set in the
// registry or returned in this turn's npc_updates). Prevents the LLM from using
// "Shard" before the naming scene, "Spark" before introduction, etc.
const NPC_REVEAL_NAMES = {
  618: { shard: 'Shard', patch: 'Patch', spark: 'Spark', maul: 'Maul', ash: 'Ash', hawk: 'Hawk', cowboy: 'Cowboy', rivet: 'Rivet' },
  472: { ember: 'Ember', thread: 'Thread', veil: 'Veil', glint: 'Glint', flicker: 'Flicker' },
  837: { ridge: 'Ridge', vest: 'Vest', flint: 'Flint', drift: 'Drift', stitch: 'Stitch', knot: 'Knot', husk: 'Husk', gash: 'Gash' },
  269: { glow: 'Glow', sol: 'Sol', lumen: 'Lumen', shade: 'Shade' },
  391: { whisper: 'Whisper', glare: 'Glare', echo: 'Echo' },
  512: { vine: 'Vine', thorn: 'Thorn', fang: 'Fang', briar: 'Briar' },
  713: { frosthawk: 'Frosthawk', cinder: 'Cinder', hearth: 'Hearth', stone: 'Stone', twig: 'Twig', glass: 'Glass' },
  927: { blade: 'Blade', soot: 'Soot', gleam: 'Gleam', crucible: 'Crucible' },
  108: { silt: 'Silt', crag: 'Crag', mire: 'Mire', alloy: 'Alloy', scour: 'Scour', tangle: 'Tangle', hiss: 'Hiss', drench: 'Drench' },
  429: { tusk: 'Tusk', scorch: 'Scorch', kindle: 'Kindle' },
  5121: { mist: 'Mist', knell: 'Knell', glim: 'Glim', haze: 'Haze', hymn: 'Hymn' },
  1: { ferryman: 'Ferryman' }
};

// Sanitize narration: replace NPC canonical names that haven't been revealed yet.
// A name is allowed only if it was already revealed (in existing NPC state) or
// is being revealed this turn (in result.npc_updates). Otherwise the name is
// replaced with the NPC's current display name (descriptor).
function sanitizeNpcNameLeaks(text, existingNpcRels, npcUpdates, currentProvince) {
  const provinceNames = NPC_REVEAL_NAMES[currentProvince] || {};

  // Build set of names that ARE allowed this turn (already revealed or being revealed now)
  const allowedNames = new Set();
  for (const [, rel] of Object.entries(existingNpcRels || {})) {
    if (rel.revealed_name) allowedNames.add(rel.revealed_name);
  }
  for (const nu of (npcUpdates || [])) {
    if (nu.revealed_name) allowedNames.add(nu.revealed_name);
  }

  let cleaned = text;
  const corrections = [];

  for (const [key, canonicalName] of Object.entries(provinceNames)) {
    if (allowedNames.has(canonicalName)) continue; // Name is revealed — allowed

    // Name hasn't been revealed — check if it appears in narration (case-sensitive
    // to avoid replacing lowercase common nouns like "shard" the item)
    const nameRegex = new RegExp(`\\b${escapeRegex(canonicalName)}\\b`, 'g');
    const matches = cleaned.match(nameRegex);
    if (matches) {
      const rel = (existingNpcRels || {})[key];
      const replacement = rel?.name || rel?.aliases?.[0] || 'the stranger';
      cleaned = cleaned.replace(nameRegex, replacement);
      corrections.push(`NPC name leak: "${canonicalName}" → "${replacement}" (not yet revealed)`);
    }
  }

  if (corrections.length) {
    console.warn('[PullGM NPC Name Firewall] Auto-corrected:', corrections.join('; '));
  }

  return { narration: cleaned, corrections };
}

// ─── Mechanical Bird Repeat-Scan Firewall ───
// The mechanical bird's direct scar scan is a ONE-TIME early Chapter 1 event.
// After it happens (mechanical_bird_scanned flag set), any narration containing
// bird + scan terms is auto-corrected to a distant glimpse, preventing the LLM
// from rescanning Bullet every turn. Deterministic — same tier as the other
// narration sanitizers.
function sanitizeRepeatBirdScan(text, scanAlreadyHappened) {
  if (!scanAlreadyHappened) return { narration: text, corrections: [] };
  const birdRe = /\b(mechanical bird|metal bird|winged machine|bird-shaped machine|red-eyed bird|red eyed bird|scanning bird|the bird)\b/i;
  const scanRe = /\b(scan|scanned|scanning|beam|red eye|red eyes|scar pulse|scar pulses|studies you|studies him|locks? on)\b/i;
  if (!birdRe.test(text) || !scanRe.test(text)) return { narration: text, corrections: [] };

  // Replace bird-scan sentences with distant glimpse language
  const sentences = text.split(/(?<=[.!?])\s+/);
  const glimpses = [
    'Far above, something metallic flashes once in the heat haze, then vanishes.',
    'For a moment, Bullet has the feeling of being watched.',
    'Something glints high above — too high, too quick — then it is gone.'
  ];
  let gIdx = 0;
  const corrected = sentences.map(sent => {
    if (birdRe.test(sent) && scanRe.test(sent)) {
      const rep = glimpses[gIdx % glimpses.length];
      gIdx++;
      return rep;
    }
    return sent;
  }).join(' ');
  console.warn('[PullGM Bird Firewall] Replaced repeat bird scan sentence(s) with distant glimpse(s)');
  return { narration: corrected, corrections: ['repeat bird scan → distant glimpse'] };
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const { campaign_id, action, acting_character_id, skip_action_log } = body;
    if (!campaign_id || !action) return Response.json({ error: 'campaign_id and action required' }, { status: 400 });

    const admin = base44.asServiceRole;

    // Load campaign
    const campaign = await admin.entities.Campaign.get(campaign_id);
    if (!campaign) return Response.json({ error: 'Campaign not found' }, { status: 404 });

    // Parallel-load characters, journal entries, chapter events, and NPCs.
    // These are independent reads — running them concurrently saves several seconds
    // of sequential wait time before the LLM call begins.
    const currentChapterNum = campaign.current_chapter || 1;
    const [characters, entries, recentEventsRaw, existingNpcs] = await Promise.all([
      admin.entities.Character.filter({ campaign_id, status: 'active' }),
      admin.entities.JournalEntry.filter({ campaign_id }, '-created_date', 8),
      admin.entities.EventLog.filter({ campaign_id, chapter: currentChapterNum }, '-created_date', 20),
      admin.entities.NPC.filter({ campaign_id })
    ]);
    const bullet = characters.find(c => c.created_by_id === user.id) || characters[0];
    if (!bullet) return Response.json({ error: 'No character found' }, { status: 404 });
    // Chapter-filtered events: empty list if first turn of a new chapter
    const recentEvents = (recentEventsRaw || []).reverse();

    // Build game state
    const ws = campaign.world_state || {};
    const flags = ws.quest_flags || {};
    const clocks = flags.campaign_clocks || {};
    const localClocks = flags.local_clocks || {};
    const conditions = (flags.conditions || []).map(c => {
      const meta = c.label ? c : { type: c.type || c, label: (c.type || c || '').replace(/_/g, ' ').replace(/\b\w/g, x => x.toUpperCase()), severity: c.severity || 'active' };
      return meta;
    });
    const codexUnlocks = flags.codex_unlocks || [];
    const currentProvince = flags.current_province || 618;

    // Initialize chapter1_stage from the current sequence if not set
    if (!flags.chapter1_stage) {
      flags.chapter1_stage = CHAPTER1_STAGES[(flags.chapter1_sequence || 1) - 1] || CHAPTER1_STAGES[0];
    }

    // ─── Chapter 1 Replay Variant ───
    // Generate the per-run controlled variation on the first Chapter 1 turn.
    // The variant (task object, complication, optional encounter, raid complication,
    // weather, NPC risk targets) is stored in flags and fed to the GM prompt so
    // each run feels different while the story spine stays fixed.
    if (currentProvince === 618 && !flags.chapter1_replay) {
      flags.chapter1_replay = generateChapter1ReplayVariant();
      console.log('[PullGM] Generated Chapter 1 replay variant:', JSON.stringify(flags.chapter1_replay));
    }

    // Retroactive camp-cast gate: if the campaign has advanced past the camp
    // evening interlude (seq 9+) OR camp_arc_complete is set, but Spark, Patch,
    // or Maul haven't been introduced yet, pull the sequence back to the camp
    // evening interlude (seq 8) and clear any premature camp_arc_complete flag.
    // This fixes existing saves that skipped the required cast introduction.
    if (currentProvince === 618) {
      const seq = flags.chapter1_sequence || 1;
      const r = flags.npc_relationships || {};
      const uf = flags.unlock_flags || {};
      const castMissing = !r.spark || !r.patch || !r.maul;
      const arcPremature = !!flags.camp_arc_complete && !uf.raiders_defeated;
      // Clear premature camp_arc_complete regardless of cast status — the arc
      // can only be complete if raiders have been defeated
      if (arcPremature && seq < 13) {
        flags.camp_arc_complete = false;
        console.warn('[PullGM] Retroactive fix: cleared premature camp_arc_complete (raiders not defeated, seq < 13)');
      }
      if (castMissing && (seq >= 9 || arcPremature)) {
        if (seq !== 8) {
          flags.chapter1_sequence = 8;
        }
        flags.chapter1_stage = 'camp_evening_interlude';
        flags.current_objective = {
          title: 'Rest at Red Sand Camp',
          description: 'Shard has asked Bullet to stay until dark. Meet the camp survivors — Spark, Patch, and the others. Learn who lives here and what the camp needs.'
        };
        console.warn(`[PullGM] Retroactive camp-cast gate: seq ${seq} -> 8 (missing: ${[!r.spark && 'spark', !r.patch && 'patch', !r.maul && 'maul'].filter(Boolean).join(', ')})`);
      }
    }

    // Retroactive mechanical bird scan flag: if the scan happened (codex_unlocks
    // includes 'watcher' or 'mechanical_bird') but unlock_flags.mechanical_bird_scanned
    // was never set, infer it now. This un-sticks the sequence completion check
    // and ensures the threat registry picks it up.
    if (currentProvince === 618) {
      const codexHasBird = (flags.codex_unlocks || []).includes('mechanical_bird') || (flags.codex_unlocks || []).includes('watcher');
      if (codexHasBird && !(flags.unlock_flags || {}).mechanical_bird_scanned) {
        if (!flags.unlock_flags) flags.unlock_flags = {};
        flags.unlock_flags.mechanical_bird_scanned = true;
        console.warn('[PullGM] Retroactive fix: set mechanical_bird_scanned from codex_unlocks');
      }
    }

    // Only infer bullet_named for legacy campaigns clearly PAST the naming sequence
    // (sequence 5). During the naming sequence itself, the flag must NOT be inferred —
    // the GM must narrate the full scene (Shard asks name → stranger says he doesn't
    // know → Shard sees scar → names him Bullet) and return bullet_named: true only
    // when the naming actually happens. Inferring on first meeting causes the GM to
    // skip the naming scene and call him "Bullet" immediately.
    if (!flags.bullet_named) {
      const seq = flags.chapter1_sequence || 1;
      if (seq > 5) {
        flags.bullet_named = true;
      }
    }

    // Infer camp_arc_complete for campaigns where the Chapter 1 mission was
    // already completed (purifier/coil/core retrieved per the event ledger) —
    // so the GM escalates the Pull toward departure instead of assigning new
    // camp errands to a player who already finished the arc.
    if (!flags.camp_arc_complete && currentProvince === 618) {
      if ((flags.chapter1_sequence || 1) >= 13) flags.camp_arc_complete = true;
      // Only infer camp_arc_complete if Bullet RETRIEVED the mission item AND
      // raiders have been defeated — both are required for the arc to be truly
      // complete. Do NOT infer from objective title: the LLM can set "Return to
      // Camp" or "The Pull Tightens" prematurely during the task stage, which
      // would falsely trigger Pull escalation while Bullet is still on the
      // approved camp-task route.
      const uf = flags.unlock_flags || {};
      if (uf.raiders_defeated) {
        const evList = recentEvents || [];
        const retrievedMissionItem = evList.some(ev =>
          /retriev|found|obtain|recover|brought back|returned with|secured/i.test(ev.summary || '') &&
          /purif|coil|core|filtrat/i.test((ev.summary || '') + ' ' + (ev.item_used_name || ''))
        );
        if (retrievedMissionItem) {
          flags.camp_arc_complete = true;
        }
      }
    }

    // Reset prematurely discovered clocks for campaigns still at the opening
    if ((campaign.current_chapter || 1) === 1 && Object.keys(flags.npc_relationships || {}).length === 0) {
      flags.discovered_clocks = ['thirst', 'heat_exposure', 'fatigue'];
    }

    // ─── Chapter Module System: Load previous chapter handoff ───
    // When starting a new chapter, the AI receives ONLY the handoff from the previous
    // chapter — not the full detailed state. This prevents memory failures and spoiler leaks.
    const chapterHandoffs = flags.chapter_handoffs || {};
    const prevChapterId = 'chapter_' + String(currentChapterNum - 1).padStart(3, '0');
    const previousHandoff = chapterHandoffs[prevChapterId] || null;

    // Build recent story
    const recentStory = entries.reverse().map(e => {
      if (e.entry_type === 'narration') return `GM: ${(e.narration || '').substring(0, 300)}`;
      if (e.entry_type === 'action') return `Bullet: ${e.player_action || ''}`;
      if (e.entry_type === 'discussion') return `OOC: ${e.narration || ''}`;
      return '';
    }).filter(Boolean).join('\n\n').substring(0, 3000);

    // Build prompt
    const prompt = buildPrompt({
      currentProvince,
      phase: flags.phase || 'Lost Survivor',
      chapter: campaign.current_chapter || 1,
      pullIntensity: flags.pull_intensity ?? 1,
      scarState: flags.scar_state || 'pulse',
      shardResonance: flags.shard_resonance || 0,
      hpCurrent: bullet.hp_current,
      hpMax: bullet.hp_max,
      conditions,
      equipment: bullet.equipment || [],
      clocks,
      localClocks,
      codexUnlocks,
      knowledgeFlags: deriveKnowledgeFlags(flags, currentProvince),
      pipeState: flags.pipe_state || 'unfound',
      bulletNamed: !!flags.bullet_named,
      campArcComplete: !!flags.camp_arc_complete,
      shardFocusUnlocked: !!flags.shard_focus_unlocked,
      sparkShard: !!flags.spark_shard,
      breathingGear: !!flags.breathing_gear,
      currentObjective: flags.current_objective?.description || '',
      npcRelationships: flags.npc_relationships || {},
      recentEvents,
      equippedWeapon: flags.equipped_weapon || '',
      lastWeaponUsed: flags.last_weapon_used || '',
      recentStory,
      chapter1Sequence: flags.chapter1_sequence || 1,
      chapter1Stage: flags.chapter1_stage || CHAPTER1_STAGES[(flags.chapter1_sequence || 1) - 1] || CHAPTER1_STAGES[0],
      previousHandoff,
      chapter1Replay: flags.chapter1_replay || null,
      mechanicalBirdScanned: !!(flags.unlock_flags || {}).mechanical_bird_scanned || (flags.codex_unlocks || []).includes('mechanical_bird') || (flags.codex_unlocks || []).includes('watcher'),
      birdGlimpseCount: flags.bird_glimpse_count || 0,
      responsesSinceBirdMention: (flags.responses_since_bird_mention || 0) + 1,
      combatState: flags.combat_state || null,
      action
    });

    // Call LLM
    const llmResponse = await base44.integrations.Core.InvokeLLM({
      prompt,
      response_json_schema: RESPONSE_SCHEMA,
      model: 'claude_opus_4_8'
    });

    // Unwrap response
    let result = llmResponse;
    if (typeof result === 'string') { try { result = JSON.parse(result); } catch { result = {}; } }
    if (result && result.response && typeof result.response === 'object') result = result.response;

    let narration = result.narration || 'The Pull drags you forward. The world shifts around you.';
    const sanitizeResult = sanitizeNarration(narration);
    narration = sanitizeResult.narration;
    // Validate narration against the canonical event ledger (weapon misattribution, etc.)
    const eventValidation = validateNarrationAgainstEventLog(narration, recentEvents, bullet.equipment || []);
    narration = eventValidation.narration;

    // Spoiler firewall — block hidden terms that aren't unlocked yet (this turn's
    // unlocks count, so a reveal scene can name its own concept). Uses the merged
    // codex/knowledge state and the effective post-transition province.
    const gateFlags = {
      codex_unlocks: [...new Set([...codexUnlocks, ...(result.codex_unlocks || [])])],
      knowledge_flags: { ...(flags.knowledge_flags || {}), ...(result.knowledge_unlocks || {}) },
      shard_focus_unlocked: !!(flags.shard_focus_unlocked || result.shard_focus_unlocked)
    };
    let effectiveProvince = currentProvince;
    if (result.province_transition && typeof result.province_transition.to_province === 'number') {
      const toProv = result.province_transition.to_province;
      const ci = CANONICAL_PROVINCE_ORDER.indexOf(currentProvince);
      const ti = CANONICAL_PROVINCE_ORDER.indexOf(toProv);
      if (toProv === currentProvince || (ci >= 0 && ti === ci + 1)) effectiveProvince = toProv;
    }
    narration = sanitizeSpoilers(narration, deriveKnowledgeFlags(gateFlags, effectiveProvince)).narration;

    // NPC name reveal firewall — block NPC canonical names from narration until
    // the NPC has actually revealed their name (or is revealing it this turn)
    narration = sanitizeNpcNameLeaks(narration, flags.npc_relationships || {}, result.npc_updates || [], currentProvince).narration;

    // Mechanical bird repeat-scan firewall — replaces any repeat scan with a distant glimpse
    narration = sanitizeRepeatBirdScan(narration, !!(flags.unlock_flags || {}).mechanical_bird_scanned || codexUnlocks.includes('mechanical_bird') || codexUnlocks.includes('watcher')).narration;

    // Interlude — player-only cutscene, saved BEFORE the narration so it leads
    // the feed. Shown to the player, NOT Bullet. Does not update any state.
    // Sanitized for firearms only; spoiler firewall skipped (interludes are
    // explicitly player-facing atmospheric scenes).
    let interludeText = '';
    const savePromises = [];
    if (result.interlude) {
      const interludeSeq = flags.chapter1_sequence || 1;
      const uf = { ...(flags.unlock_flags || {}), ...(result.unlock_flags || {}) };
      // Only allow the Province 1 interlude after the raid is resolved (seq >= 11
      // AND raiders_defeated). This prevents it from firing during the task stage
      // or water stage — leaving for the mission is NOT the end of the chapter.
      if (interludeSeq >= 11 && uf.raiders_defeated) {
        interludeText = sanitizeNarration(result.interlude).narration;
        savePromises.push(base44.entities.JournalEntry.create({
          campaign_id,
          entry_type: 'system',
          narration: `✦ INTERLUDE — ELSEWHERE ✦\n\n${interludeText}`,
          chapter: campaign.current_chapter
        }).catch(() => {}));
      } else {
        console.warn(`[PullGM] Held Province 1 interlude: sequence ${interludeSeq} too early (needs seq >= 11 with raiders_defeated)`);
      }
    }

    // Create journal entry (deferred to parallel save batch)
    savePromises.push(base44.entities.JournalEntry.create({
      campaign_id,
      entry_type: 'narration',
      narration,
      chapter: campaign.current_chapter
    }).catch(() => {}));

    // ─── Update campaign state ───
    const updatedFlags = { ...flags };

    if (typeof result.pull_intensity === 'number') updatedFlags.pull_intensity = Math.max(0, Math.min(6, result.pull_intensity));
    if (result.scar_state) updatedFlags.scar_state = result.scar_state;
    if (typeof result.shard_resonance === 'number') updatedFlags.shard_resonance = Math.max(0, Math.min(100, result.shard_resonance));

    // ─── Clock change helpers ───
    // The LLM may return change values as strings ("+2", "-5") or clock keys with
    // different casing ("Camp Trust" vs "camp_trust"). These helpers normalize
    // everything so no gain or loss is silently lost.
    const parseChange = (v) => {
      if (typeof v === 'number') return v;
      const n = parseFloat(String(v || '').replace(/[^\d.-]/g, ''));
      return isNaN(n) ? 0 : n;
    };
    const normalizeClockKey = (k) => {
      const l = String(k || '').toLowerCase().replace(/\s+/g, '_');
      if (/camp.*trust/.test(l)) return 'camp_trust';
      if (/heat/.test(l)) return 'heat_exposure';
      if (/fatigue|exhaust/.test(l)) return 'fatigue';
      if (/thirst|dehydrat/.test(l)) return 'thirst';
      if (/hunger|starv/.test(l)) return 'hunger';
      if (/pull.*intens/.test(l)) return 'pull_intensity';
      if (/scar/.test(l)) return 'scar_progression';
      if (/purif/.test(l)) return 'purifier_stability';
      return l;
    };

    // Apply hidden clock changes + enemy turn
    const updatedClocks = { ...clocks };
    for (const cc of (result.clock_changes || [])) {
      const ck = normalizeClockKey(cc.clock);
      updatedClocks[ck] = Math.max(0, Math.min(100, (updatedClocks[ck] || 0) + parseChange(cc.change)));
    }
    if (result.enemy_turn) {
      if (result.enemy_turn.province_1_alert_change) updatedClocks.province_1_alert = Math.max(0, Math.min(100, (updatedClocks.province_1_alert || 0) + parseChange(result.enemy_turn.province_1_alert_change)));
      if (result.enemy_turn.hunter_proximity_change) updatedClocks.hunter_proximity = Math.max(0, Math.min(100, (updatedClocks.hunter_proximity || 0) + parseChange(result.enemy_turn.hunter_proximity_change)));
    }
    updatedFlags.campaign_clocks = updatedClocks;

    // Apply local clock changes
    const updatedLocalClocks = { ...localClocks };
    for (const cc of (result.local_clock_changes || [])) {
      const ck = normalizeClockKey(cc.clock);
      updatedLocalClocks[ck] = Math.max(0, Math.min(100, (updatedLocalClocks[ck] || 0) + parseChange(cc.change)));
    }

    // ─── Decision Impact → Clock Sync ───
    // Every + and - shown in the decision_impact popup MUST be reflected in the
    // actual clock values. If the LLM returned a decision_impact with a change
    // for a clock but did NOT return a corresponding local_clock_changes entry,
    // inject the missing change. This prevents the "popup shows +2 but clock
    // doesn't move" bug.
    // SKIP camp_trust duplicates of already-completed one-time events.
    if (result.decision_impact && result.decision_impact.impacts) {
      const existingChangeClocks = new Set((result.local_clock_changes || []).map(cc => normalizeClockKey(cc.clock)));
      const uf = flags.unlock_flags || {};
      // Map impact labels to canonical clock keys — only return a key for
      // recognized clock labels; return null for anything else so we don't
      // create garbage clock entries from non-clock impact labels.
      const labelToClock = (label) => {
        const l = (label || '').toLowerCase();
        if (/camp\s*trust/.test(l)) return 'camp_trust';
        if (/heat/.test(l)) return 'heat_exposure';
        if (/fatigue|exhaust/.test(l)) return 'fatigue';
        if (/thirst|dehydrat/.test(l)) return 'thirst';
        if (/hunger|starv/.test(l)) return 'hunger';
        if (/pull\s*intens/.test(l)) return 'pull_intensity';
        if (/scar/.test(l)) return 'scar_progression';
        return null;
      };
      for (const imp of result.decision_impact.impacts) {
        const delta = parseChange(imp.change);
        if (delta === 0) continue;
        const clockKey = labelToClock(imp.label);
        if (!clockKey) continue;
        // Skip if local_clock_changes already covers this clock
        if (existingChangeClocks.has(clockKey)) continue;
        // Skip duplicate one-time camp_trust events
        if (clockKey === 'camp_trust') {
          const reasonText = `${imp.label || ''} ${imp.change_label || ''} ${imp.reason || ''}`.toLowerCase();
          if (uf.task_complete && /task|purif|core|component|returned/i.test(reasonText)) {
            console.log(`[PullGM] Clock sync: skipped duplicate task completion ${clockKey} gain (task already complete)`);
            continue;
          }
        }
        updatedLocalClocks[clockKey] = Math.max(0, Math.min(100,
          (updatedLocalClocks[clockKey] || 0) + delta));
        console.log(`[PullGM] Clock sync: injected ${clockKey} ${delta > 0 ? '+' : ''}${delta} from decision_impact (was missing from local_clock_changes)`);
      }
    }

    // ─── Water enforcement ───
    // If the LLM reports Bullet received water, ensure thirst drops by at least 30.
    // The LLM sometimes narrates water without reducing the thirst clock — this
    // forces a visible reduction so the player sees that getting water mattered.
    // Also persist as a one-time flag so the frontend popup doesn't re-fire.
    if (result.water_received) {
      const preThirst = localClocks.thirst ?? 75;
      if (preThirst - (updatedLocalClocks.thirst ?? preThirst) < 30) {
        updatedLocalClocks.thirst = Math.max(5, preThirst - 40);
      }
      // Mark water_received as a one-time event — if it was already true, clear
      // it from the response so the frontend doesn't show the popup again.
      const uf = updatedFlags.unlock_flags || {};
      if (uf.water_received) {
        result.water_received = false; // already fired — suppress duplicate popup
      } else {
        if (!updatedFlags.unlock_flags) updatedFlags.unlock_flags = {};
        updatedFlags.unlock_flags.water_received = true;
      }
    }

    updatedFlags.local_clocks = updatedLocalClocks;

    // Apply condition changes
    if (result.condition_changes && result.condition_changes.length) {
      const updatedConditions = [...conditions.map(c => ({ type: c.type || c.label, label: c.label, severity: c.severity || 'active' }))];
      for (const cc of result.condition_changes) {
        const condKey = cc.type;
        const idx = updatedConditions.findIndex(c => (c.type || c.label || '').toLowerCase().replace(/\s/g, '_') === condKey.toLowerCase().replace(/\s/g, '_'));
        if (cc.status === 'healed' && idx >= 0) {
          updatedConditions.splice(idx, 1);
        } else if (cc.status === 'new' || cc.status === 'worsened') {
          const label = condKey.replace(/_/g, ' ').replace(/\b\w/g, x => x.toUpperCase());
          if (idx >= 0) updatedConditions[idx] = { type: condKey, label, severity: cc.severity || 'active' };
          else updatedConditions.push({ type: condKey, label, severity: cc.severity || 'active' });
        }
      }
      updatedFlags.conditions = updatedConditions;
    }

    // Apply codex unlocks
    if (result.codex_unlocks && result.codex_unlocks.length) {
      updatedFlags.codex_unlocks = [...new Set([...codexUnlocks, ...result.codex_unlocks])];
    }

    // Apply spoiler-knowledge flag unlocks (advance the firewall as the player learns concepts)
    if (result.knowledge_unlocks && Object.keys(result.knowledge_unlocks).length) {
      updatedFlags.knowledge_flags = { ...(flags.knowledge_flags || {}), ...result.knowledge_unlocks };
    }

    // Shard focus unlock
    if (result.shard_focus_unlocked) updatedFlags.shard_focus_unlocked = true;

    // Spark shard acquired
    if (result.spark_shard_acquired) updatedFlags.spark_shard = true;

    // Breathing apparatus acquired
    if (result.breathing_gear_acquired) updatedFlags.breathing_gear = true;

    // Thread's blade acquired (Province 472 dome)
    if (result.thread_blade_acquired) updatedFlags.thread_blade = true;

    // Patch's cloak acquired (camp rest or Chapter 2 transition)
    if (result.patch_cloak_acquired) updatedFlags.patch_cloak = true;

    // One-time unlock flags — prevent duplicate popups and re-adds.
    // Also deduplicate: if a flag is ALREADY true in the saved state, clear it
    // from result.unlock_flags so the frontend doesn't re-fire popups for it.
    if (result.unlock_flags && Object.keys(result.unlock_flags).length) {
      const oldUf = flags.unlock_flags || {};
      const newUf = {};
      for (const [k, v] of Object.entries(result.unlock_flags)) {
        if (v === true && oldUf[k] === true) {
          // Already fired — don't pass it back as "new" for popup purposes
          continue;
        }
        newUf[k] = v;
      }
      updatedFlags.unlock_flags = { ...oldUf, ...result.unlock_flags };
      // Replace result.unlock_flags with only the NEW ones, so the frontend
      // buildUnlockNotifications can check what's actually new this turn.
      result.unlock_flags = newUf;
    }

    // Memory fragments — partial, never full explanation. Also surface as codex
    // unlocks so the player-facing codex/memories UI reveals them.
    if (result.memory_unlocks && result.memory_unlocks.length) {
      updatedFlags.memories = [...new Set([...(flags.memories || []), ...result.memory_unlocks])];
      updatedFlags.codex_unlocks = [...new Set([...(updatedFlags.codex_unlocks || codexUnlocks), ...result.memory_unlocks])];
    }

    // Guilt/bond entries — fire once per key, optionally set an associated flag
    if (result.guilt_unlocks && result.guilt_unlocks.length) {
      const guilt = [...(flags.guilt_echoes || [])];
      for (const g of result.guilt_unlocks) {
        if (g.key && !guilt.some(x => x.key === g.key)) guilt.push({ key: g.key, label: g.label, reason: g.reason });
        if (g.flag) updatedFlags[g.flag] = true;
      }
      updatedFlags.guilt_echoes = guilt;
    }

    // Current objective
    if (result.current_objective && result.current_objective.description) {
      updatedFlags.current_objective = result.current_objective;
    }

    // Pipe state update
    if (result.pipe_state) updatedFlags.pipe_state = result.pipe_state;

    // Bullet named — the naming scene has happened
    if (result.bullet_named) updatedFlags.bullet_named = true;

    // Camp arc complete — only allow if raiders are defeated (prevents premature
    // Pull escalation when Bullet leaves camp for the mission, which is service
    // not departure)
    if (result.camp_arc_complete) {
      const uf = updatedFlags.unlock_flags || {};
      if (uf.raiders_defeated || (updatedFlags.chapter1_sequence || 1) >= 13) {
        updatedFlags.camp_arc_complete = true;
      } else {
        console.warn(`[PullGM] Held camp_arc_complete: raiders not yet defeated (seq=${updatedFlags.chapter1_sequence || 1})`);
      }
    }

    // ─── Canonical Event Ledger ───
    // Save structured event records (the source of truth for "what actually happened")
    // and track equipped/last-used weapon so the AI never confuses possession with use.
    if (result.equipped_weapon) updatedFlags.equipped_weapon = result.equipped_weapon;

    if (result.events && result.events.length) {
      const provName = (PROVINCES[currentProvince] || {}).n || `Province ${currentProvince}`;
      const eventRecords = result.events
        .filter(ev => ev.event_type || ev.summary)
        .map(ev => ({
          campaign_id,
          chapter: campaign.current_chapter || 1,
          province: provName,
          scene: ev.scene || '',
          event_type: ev.event_type || 'event',
          actor_id: ev.actor_id || 'bullet',
          actor_name: ev.actor_name || 'Bullet',
          target_id: ev.target_id || '',
          target_name: ev.target_name || '',
          item_used_id: ev.item_used_id || '',
          item_used_name: ev.item_used_name || '',
          outcome: ev.outcome || '',
          cause: ev.cause || '',
          summary: ev.summary || '',
          memory_summary: ev.memory_summary || ev.summary || '',
          tags: ev.tags || []
        }));
      if (eventRecords.length) {
        savePromises.push(admin.entities.EventLog.bulkCreate(eventRecords).catch(() => {}));
      }
      // Update last_weapon_used from the most recent combat event that used a weapon
      const lastWeaponEv = [...result.events].reverse().find(ev =>
        ev.item_used_name && /attack|kill|wound|threaten|strike|use_item/i.test(ev.event_type || '')
      );
      if (lastWeaponEv) updatedFlags.last_weapon_used = lastWeaponEv.item_used_name;
    }

    // Apply NPC updates — CANONICAL REGISTRY WITH ALIAS RESOLUTION.
    // Descriptions are not separate people: if a key/name/alias matches an
    // existing NPC record, merge into that record instead of creating a duplicate.
    const npcRels = { ...(flags.npc_relationships || {}) };
    // Clean up forbidden aliases that leaked into existing NPC records from
    // previous LLM responses (e.g. "Sentinel" or "Unknown" attached to Shard)
    for (const [k, rel] of Object.entries(npcRels)) {
      if (rel.aliases && rel.aliases.length) {
        const cleaned = filterNpcAliases(rel.aliases);
        if (cleaned.length !== rel.aliases.length) {
          const removed = rel.aliases.filter(a => !cleaned.includes(a));
          npcRels[k] = { ...rel, aliases: cleaned };
          console.warn(`[PullGM NPC Firewall] Cleaned forbidden aliases from ${k}: ${removed.join(', ')}`);
        }
      }
    }
    const norm = (s) => (s || '').toString().toLowerCase().trim();
    // Reverse index: normalized name/alias/key -> canonical key, for fast resolution
    const aliasIndex = {};
    for (const [k, rel] of Object.entries(npcRels)) {
      for (const nm of [k, rel.name, rel.revealed_name, ...(rel.aliases || [])].filter(Boolean)) {
        aliasIndex[norm(nm)] = k;
      }
    }
    const resolveKey = (nu) => {
      if (nu.key && npcRels[nu.key]) return nu.key;
      const candidates = [nu.key, nu.name, nu.revealed_name, ...(nu.add_aliases || [])].filter(Boolean);
      for (const c of candidates) {
        const hit = aliasIndex[norm(c)];
        if (hit) return hit;
      }
      return nu.key || null;
    };

    for (const nu of (result.npc_updates || [])) {
      // Skip non-human entities (mechanical bird, drones, sentinels) — they
      // don't belong in the human NPC registry and must not merge with people
      if (isNonHumanNpcUpdate(nu)) {
        console.warn(`[PullGM NPC Firewall] Skipped non-human entity update: ${nu.name || nu.key || '(unnamed)'}`);
        continue;
      }
      let key = resolveKey(nu);
      if (!key && !nu.key) continue;
      if (!key) key = nu.key;
      const existing = npcRels[key] || {};
      const isNew = !existing.first_met;

      // Merge aliases: existing + add_aliases + name + revealed_name (deduped)
      // Filter out forbidden aliases that belong to non-human entities
      const mergedAliases = filterNpcAliases([...new Set([
        ...(existing.aliases || []),
        ...(nu.add_aliases || []),
        ...(nu.name ? [nu.name] : []),
        ...(nu.revealed_name ? [nu.revealed_name] : [])
      ].filter(Boolean))]);

      // Name-reveal guard: if the LLM provides a name but no revealed_name, and
      // the name matches a canonical NPC name for this province, don't use it as
      // the display name — keep the existing descriptor until the actual reveal
      const provinceNpcNames = NPC_REVEAL_NAMES[currentProvince] || {};
      const isUnrevealedCanonical = (name) => {
        if (!name || nu.revealed_name) return false;
        return Object.values(provinceNpcNames).some(c => c === name && c !== existing.revealed_name);
      };
      // Also filter unrevealed canonical names from the alias list
      const safeAliases = mergedAliases.filter(a => {
        const isCanonical = Object.values(provinceNpcNames).some(c => c === a);
        if (!isCanonical) return true;
        return nu.revealed_name === a || existing.revealed_name === a;
      });

      const rawName = nu.revealed_name || nu.name || existing.name || key;
      const safeName = isUnrevealedCanonical(nu.name) ? (existing.name || key) : rawName;
      // NPC Death Guard: protected NPCs and non-danger-scene NPCs cannot die.
      // Override death to "Injured" if the conditions aren't met.
      let effectiveNpcStatus = nu.npc_status || existing.status || 'Alive';
      if (effectiveNpcStatus.toLowerCase() === 'dead') {
        const deathStage = updatedFlags.chapter1_stage || '';
        if (!canNPCDie(key, deathStage, npcRels)) {
          effectiveNpcStatus = 'Injured';
          console.warn(`[PullGM NPC Death Guard] Prevented death of ${key}: not eligible (stage=${deathStage})`);
        }
      }
      const updatedRel = {
        name: isForbiddenHumanAlias(safeName) ? (existing.name || key) : safeName,
        aliases: safeAliases,
        revealed_name: nu.revealed_name || existing.revealed_name || null,
        role: nu.role || existing.role || '',
        status: effectiveNpcStatus,
        disposition: nu.disposition || existing.disposition || 'neutral',
        relationship: Math.max(-100, Math.min(100, (existing.relationship || 0) + (nu.relationship_change || 0))),
        first_met: existing.first_met || isNew,
        description: nu.description || existing.description || '',
        player_knowledge: nu.reason ? ((existing.player_knowledge ? existing.player_knowledge + ' ' : '') + nu.reason).trim() : (existing.player_knowledge || ''),
        province: existing.province || currentProvince
      };
      npcRels[key] = updatedRel;
      // Refresh alias index so later updates in the same turn resolve correctly
      for (const nm of [key, updatedRel.name, updatedRel.revealed_name, ...mergedAliases].filter(Boolean)) {
        aliasIndex[norm(nm)] = key;
      }

      // Upsert NPC entity record (canonical dossier) — merge, never duplicate
      if (isNew) {
        savePromises.push(admin.entities.NPC.create({
          campaign_id,
          canonical_id: key,
          name: updatedRel.name,
          aliases: mergedAliases,
          revealed_name: updatedRel.revealed_name,
          role: updatedRel.role,
          status: updatedRel.status,
          disposition: updatedRel.disposition,
          description: updatedRel.description,
          what_we_know: updatedRel.player_knowledge,
          first_met_chapter: campaign.current_chapter || 1
        }).catch(() => {}));
      } else {
        let npcRec = existingNpcs.find(n => n.canonical_id === key);
        if (!npcRec) {
          const nameToMatch = existing.name || updatedRel.name;
          npcRec = existingNpcs.find(n => n.name === nameToMatch);
        }
        if (npcRec) {
          savePromises.push(admin.entities.NPC.update(npcRec.id, {
            canonical_id: key,
            name: updatedRel.name,
            aliases: mergedAliases,
            revealed_name: updatedRel.revealed_name,
            role: updatedRel.role,
            status: updatedRel.status,
            disposition: updatedRel.disposition,
            description: updatedRel.description,
            what_we_know: updatedRel.player_knowledge
          }).catch(() => {}));
        }
      }
    }
    updatedFlags.npc_relationships = npcRels;

    // Apply discovered clocks — validated against discovery rules (must run AFTER NPC updates)
    if (result.discovered_clocks && result.discovered_clocks.length) {
      const validated = result.discovered_clocks.filter(clock => {
        const rule = CLOCK_DISCOVERY_RULES[clock];
        if (!rule) return true;
        return rule(updatedFlags);
      });
      if (validated.length) {
        updatedFlags.discovered_clocks = [...new Set([...(flags.discovered_clocks || []), ...validated])];
      }
    }

    // ─── Raider Danger Explained Inference ───
    // The LLM doesn't always set unlock_flags.raider_danger_explained even when
    // it narrates the raider explanation. Infer it from response signals so the
    // raider_threat clock gets discovered and the sequence can advance to seq 9.
    {
      const raiderExplainedSignals = [
        (result.codex_unlocks || []).includes('raider_threat'),
        (result.discovered_clocks || []).includes('raider_threat'),
        /raider/i.test(narration) && /\b(defen|danger|threat|coming|attack|raid|rob|cache)\b/i.test(narration)
      ];
      if (raiderExplainedSignals.some(Boolean)) {
        if (!updatedFlags.unlock_flags) updatedFlags.unlock_flags = {};
        if (!updatedFlags.unlock_flags.raider_danger_explained) {
          updatedFlags.unlock_flags.raider_danger_explained = true;
          console.log('[PullGM] Inferred raider_danger_explained from response signals');
        }
        // Also ensure raider_threat is in discovered_clocks
        if (!(updatedFlags.discovered_clocks || []).includes('raider_threat')) {
          updatedFlags.discovered_clocks = [...(updatedFlags.discovered_clocks || []), 'raider_threat'];
          console.log('[PullGM] Auto-discovered raider_threat clock (raider danger explained)');
        }
      }
    }

    // ─── Task Assigned / Complete Inference ───
    // The LLM narrates Shard assigning a task and later accepting the retrieved
    // component, but doesn't always set unlock_flags.task_assigned / task_complete.
    // Without these flags, the trust floor stays at 10 and the stage cap limits
    // trust to 15 — so the clock appears "stuck" even though the story has
    // progressed. Infer from NPC player_knowledge, current_objective, events,
    // and narration so the trust floor/cap can advance correctly.
    {
      if (!updatedFlags.unlock_flags) updatedFlags.unlock_flags = {};
      const uf = updatedFlags.unlock_flags;

      // Gather text signals from multiple sources
      const npcKnowledge = Object.values(updatedFlags.npc_relationships || {})
        .map(r => r.player_knowledge || '').join(' ');
      const objText = (updatedFlags.current_objective?.description || '') + ' ' + (updatedFlags.current_objective?.title || '');
      const eventSummaries = (result.events || []).map(ev => ev.summary || '').join(' ');
      const signalText = `${npcKnowledge} ${objText} ${eventSummaries} ${narration}`;

      // task_assigned: Shard tasked Bullet with retrieving something
      if (!uf.task_assigned) {
        const assignSignals = [
          /\b(task|mission|assign|retrieve|fetch|bring back|get back|recover)\b/i.test(signalText),
          /purif|core|coil|crystal|filtrat|valve|lens|fuse|circuit|housing|regulator|battery/i.test(signalText) && /\b(task|mission|need|must|retrieve|fetch|bring|get)\b/i.test(signalText)
        ];
        if (assignSignals.some(Boolean)) {
          uf.task_assigned = true;
          console.log('[PullGM] Inferred task_assigned from narrative signals');
        }
      }

      // task_complete: Bullet returned with the component and Shard accepted it
      if (!uf.task_complete) {
        const completeSignals = [
          /\b(retriev|return|brought back|brought the|secured the|found the|obtained the)\b/i.test(signalText) &&
            /purif|core|coil|crystal|filtrat|valve|lens|fuse|circuit|housing|regulator|battery|component|part/i.test(signalText),
          /\b(accept|accepted|success|succeed|well done|good work|competence|completed)\b/i.test(signalText) &&
            /purif|core|coil|crystal|filtrat|valve|lens|fuse|circuit|housing|regulator|battery|component|part/i.test(signalText),
          /accepted the component/i.test(signalText)
        ];
        if (completeSignals.some(Boolean)) {
          uf.task_complete = true;
          console.log('[PullGM] Inferred task_complete from narrative signals');
        }
      }
    }

    // ─── Mechanical Bird Mention Tracking ───
    // The mechanical bird's direct scar scan is a ONE-TIME Chapter 1 event.
    // Track bird mentions for the cooldown system: after the first scan, the
    // bird may only appear as a distant glimpse (max 2/chapter, 8-response cooldown).
    {
      const birdRe = /\b(mechanical bird|metal bird|winged machine|bird-shaped machine|red-eyed bird|red eyed bird|scanning bird|the bird)\b/i;
      const scanWasSet = !!((flags.unlock_flags || {}).mechanical_bird_scanned) || (flags.codex_unlocks || []).includes('mechanical_bird') || (flags.codex_unlocks || []).includes('watcher');
      const scanIsSet = !!((updatedFlags.unlock_flags || {}).mechanical_bird_scanned) || (updatedFlags.codex_unlocks || []).includes('mechanical_bird') || (updatedFlags.codex_unlocks || []).includes('watcher');
      const firstScanThisTurn = !scanWasSet && scanIsSet;

      if (firstScanThisTurn) {
        // Record the one-time scan in the event ledger
        savePromises.push(admin.entities.EventLog.create({
          campaign_id,
          chapter: campaign.current_chapter || 1,
          province: (PROVINCES[currentProvince] || {}).n || `Province ${currentProvince}`,
          scene: 'mechanical_bird_scan',
          event_type: 'threat_discovered',
          actor_id: 'threat_618_mechanical_watcher',
          actor_name: 'Mechanical Watcher',
          summary: 'A red-eyed mechanical bird scanned Bullet. The beam paused on the scar over his heart.',
          memory_summary: 'The bird scanned Bullet once — a one-time event. Do not rescan.',
          tags: ['surveillance', 'mechanical_bird', 'chapter_1', 'threat']
        }).catch(() => {}));
        updatedFlags.responses_since_bird_mention = 0;
        console.log('[PullGM] First mechanical bird scan — event ledger recorded.');
      } else {
        // Detect bird mention in this turn's ORIGINAL narration (before sanitization)
        // for glimpse tracking and cooldown management
        const birdMentioned = birdRe.test(result.narration || '');
        if (birdMentioned && scanIsSet) {
          updatedFlags.bird_glimpse_count = (flags.bird_glimpse_count || 0) + 1;
          updatedFlags.responses_since_bird_mention = 0;
          console.log('[PullGM] Bird glimpse/mention detected. Count:', updatedFlags.bird_glimpse_count, 'of 2 max. Cooldown reset.');
        } else {
          updatedFlags.responses_since_bird_mention = (flags.responses_since_bird_mention || 0) + 1;
        }
      }

      // Add mechanical bird to known_threats (NOT the NPC registry) when scanned.
      // This is a threat/entity, not a person — it appears in World State under
      // Known Threats, never under NPCs Met or People.
      if (scanIsSet) {
        if (!updatedFlags.known_threats) updatedFlags.known_threats = [];
        if (!updatedFlags.known_threats.some(t => t.id === 'threat_618_mechanical_watcher')) {
          updatedFlags.known_threats.push({
            id: 'threat_618_mechanical_watcher',
            type: 'surveillance_threat',
            displayName: 'Mechanical Watcher',
            aliases: ['mechanical bird', 'metal bird', 'red-eyed bird', 'winged machine', 'scanning drone', 'Watcher'],
            description: 'A red-eyed mechanical bird scanned Bullet\'s scar and vanished into the heat haze.',
            discovered: true,
            discoveredAtStage: 'mechanical_bird_scan',
            lastSeen: 'Province 618',
            status: 'Observed',
            threatLevel: 'Unknown'
          });
          console.log('[PullGM] Added Mechanical Watcher to known_threats (surveillance threat).');
        }
      }
    }

    // ─── Camp Trust First-Discovery Reset ───
    // When camp_trust is FIRST discovered, reset to 10 if a legacy campaign had
    // it inflated. This runs BEFORE the trust floor so the floor can raise it
    // to the correct story-appropriate level afterwards.
    {
      const tc = { ...(updatedFlags.local_clocks || {}) };
      const oldClockSet = new Set(flags.discovered_clocks || []);
      const newClockList = updatedFlags.discovered_clocks || [];
      if (newClockList.includes('camp_trust') && !oldClockSet.has('camp_trust') && (tc.camp_trust || 0) > 25) {
        tc.camp_trust = 10;
        console.log('[PullGM] First-discovery reset: camp_trust reset to 10 (was inflated in legacy data)');
      }
      updatedFlags.local_clocks = tc;
    }

    // ─── Rest Recovery + Camp Trust Floor Enforcement ───
    // CODE-ENFORCED: When Bullet rests in camp, the desert stops actively killing
    // him. Heat exposure, fatigue, and thirst MUST decrease.
    // Also: story events set a MINIMUM camp_trust. If the LLM returned a
    // decision_impact popup showing "+5 Camp Trust" but didn't return a
    // local_clock_change for camp_trust, the clock never moved. This enforces
    // the floor so accumulated trust is reflected in the visible clock.
    {
      const tc = { ...(updatedFlags.local_clocks || {}) };
      let clockChanged = false;

      // ── Rest Recovery ──
      // If Bullet is resting/sleeping/waiting at camp (Province 618, NPCs met,
      // camp arc not complete), enforce recovery on heat, fatigue, and thirst.
      const actionLower = (action || '').toLowerCase();
      const isRestAction = /\b(rest|sleep|sit|wait|stay|settle|lie down|nap|recover|resting|rests|shade|water|drink|treat|patch|heal|evening|night|dark|fire)\b/.test(actionLower);
      const isAtCamp = currentProvince === 618 &&
        Object.keys(updatedFlags.npc_relationships || {}).length > 0 &&
        !updatedFlags.camp_arc_complete;

      if (isRestAction && isAtCamp) {
        // Heat exposure: -15 to -25 (shade, shelter from desert sun)
        const currentHeat = tc.heat_exposure ?? 65;
        if (currentHeat > 30) {
          const heatReduction = Math.min(currentHeat - 25, 15 + Math.floor(Math.random() * 11));
          if (heatReduction > 0) {
            tc.heat_exposure = Math.max(0, currentHeat - heatReduction);
            clockChanged = true;
            console.log(`[PullGM] Rest recovery: heat_exposure ${currentHeat} → ${tc.heat_exposure}`);
          }
        }
        // Fatigue: -10 to -20
        const currentFatigue = tc.fatigue ?? 55;
        if (currentFatigue > 20) {
          const fatigueReduction = Math.min(currentFatigue - 10, 10 + Math.floor(Math.random() * 11));
          if (fatigueReduction > 0) {
            tc.fatigue = Math.max(0, currentFatigue - fatigueReduction);
            clockChanged = true;
            console.log(`[PullGM] Rest recovery: fatigue ${currentFatigue} → ${tc.fatigue}`);
          }
        }
        // Thirst: -5 to -10 if water is available (camp has working purifier or water supply)
        const purifierStability = tc.purifier_stability ?? 40;
        if (purifierStability > 15) {
          const currentThirst = tc.thirst ?? 75;
          if (currentThirst > 0) {
            const thirstReduction = Math.min(currentThirst, 5 + Math.floor(Math.random() * 6));
            if (thirstReduction > 0) {
              tc.thirst = Math.max(0, currentThirst - thirstReduction);
              clockChanged = true;
              console.log(`[PullGM] Rest recovery: thirst ${currentThirst} → ${tc.thirst}`);
            }
          }
        }
      }

      // ── Camp Trust Floor ──
      // Story events set a minimum trust level. If current trust is below the
      // floor, raise it. This catches cases where the LLM narrated trust gains
      // (decision_impact popup "Camp Trust +5") but didn't return the
      // local_clock_change, so the clock never moved.
      const uf = updatedFlags.unlock_flags || {};
      let trustFloor = 10; // Base: entered camp
      if (uf.raiders_defeated) trustFloor = 55;
      else if (uf.task_complete) trustFloor = 35;
      else if (uf.task_assigned) trustFloor = 20;

      // If task was completed (event ledger shows retrieval) but flag not set yet
      const hasTaskComplete = (recentEvents || []).some(ev =>
        /retriev|found|obtain|recover|brought back|returned with|secured/i.test(ev.summary || '') &&
        /purif|coil|core|filtrat|valve|lens|crystal|fuse|circuit|housing|regulator|battery/i.test((ev.summary || '') + ' ' + (ev.item_used_name || ''))
      );
      if (hasTaskComplete && !uf.task_complete) trustFloor = Math.max(trustFloor, 30);

      const currentTrust = tc.camp_trust ?? 10;
      if (currentTrust < trustFloor) {
        tc.camp_trust = trustFloor;
        clockChanged = true;
        console.log(`[PullGM] Trust floor enforced: camp_trust ${currentTrust} → ${trustFloor} (story events warrant minimum)`);
      }

      if (clockChanged) {
        updatedFlags.local_clocks = tc;
      }
    }

    // ─── Camp Trust stage cap ───
    // Camp Trust cannot exceed the cap for the current story stage. This prevents
    // the LLM from jumping trust to 100 after a minor action like receiving water.
    // The cap must be >= trust floor for the same stage, otherwise the cap
    // silently overrides the floor and trust gets stuck.
    {
      const tc = { ...(updatedFlags.local_clocks || {}) };
      const uf = updatedFlags.unlock_flags || {};
      const seq = updatedFlags.chapter1_sequence || 1;
      let trustCap = 35;
      if (uf.raiders_defeated) trustCap = 100;
      else if (uf.task_complete) trustCap = 80;
      else if (uf.task_assigned) trustCap = 60;
      else if (seq >= 7) trustCap = 50;
      else if (seq >= 5) trustCap = 45;
      if (typeof tc.camp_trust === 'number') {
        tc.camp_trust = Math.min(tc.camp_trust, trustCap);
      }
      updatedFlags.local_clocks = tc;
    }

    // Province transition — validate against canonical sequence to prevent spoiler skips
    let chapterUpdate = {};
    let validTransition = null;
    if (result.province_transition && typeof result.province_transition.to_province === 'number') {
      const toProv = result.province_transition.to_province;
      const currentIdx = CANONICAL_PROVINCE_ORDER.indexOf(currentProvince);
      const targetIdx = CANONICAL_PROVINCE_ORDER.indexOf(toProv);
      // Allow: same province (sub-area transition) OR the next province in canonical order
      // Block departure to Province 472 until both farewell gifts are delivered
      const giftsPending = toProv === 472 && (!updatedFlags.spark_shard || !updatedFlags.breathing_gear);
      // ─── Chapter 1 story gate (CRITICAL) ───
      // The transition to 472 (end of Chapter 1) can ONLY fire when the story
      // has reached sequence 15 (wall of water) AND all required story beats
      // are complete: task done, raiders defeated, Spark's shard given, breathing
      // gear given, Province 1 interlude shown. This prevents the chapter from
      // ending early just because the LLM set gift flags or returned a transition.
      const uf = updatedFlags.unlock_flags || {};
      const seq = updatedFlags.chapter1_sequence || 1;
      const chapter1BeatsComplete = (currentProvince === 618 && toProv === 472)
        ? (seq >= 15 && uf.task_complete && uf.raiders_defeated && uf.spark_shard_given && uf.breathing_gear_given && uf.province1_interlude_shown)
        : true;
      if (giftsPending) {
        console.warn(`Held transition to 472: farewell gifts pending (spark_shard=${!!updatedFlags.spark_shard}, breathing_gear=${!!updatedFlags.breathing_gear})`);
      }
      if (!chapter1BeatsComplete) {
        console.warn(`Held transition to 472: story beats incomplete (seq=${seq}, task=${!!uf.task_complete}, raiders=${!!uf.raiders_defeated}, sparkShard=${!!uf.spark_shard_given}, breathingGear=${!!uf.breathing_gear_given}, interlude=${!!uf.province1_interlude_shown})`);
      }
      if (!giftsPending && chapter1BeatsComplete && (toProv === currentProvince || (currentIdx >= 0 && targetIdx === currentIdx + 1))) {
        validTransition = result.province_transition;
        updatedFlags.current_province = toProv;
        // Only record a province change in history if Bullet actually moved to a different province
        // (the GM sometimes narrates sub-area transitions within the same province, e.g. "Red Sand" → "Red Sand Camp")
        if (toProv !== currentProvince) {
          updatedFlags.province_history = [...(flags.province_history || []), currentProvince];
        }
        const nextCh = PROVINCE_CHAPTERS[toProv];
        if (nextCh && nextCh > (campaign.current_chapter || 1)) {
          chapterUpdate.current_chapter = nextCh;
        }
        // Update phase
        if (toProv === 1) updatedFlags.phase = 'Final Revelation';
        else if (toProv === -1) updatedFlags.phase = 'Cleanup';
        else if (toProv === 0 || toProv === 14 || toProv === 140) updatedFlags.phase = 'System Breaker';
        // Province 472 — seed water-block traversal clocks on arrival
        if (toProv === 472) {
          updatedLocalClocks.air = updatedLocalClocks.air ?? 80;
          updatedLocalClocks.pressure = updatedLocalClocks.pressure ?? 10;
          updatedLocalClocks.swimming_fatigue = updatedLocalClocks.swimming_fatigue ?? 5;
          updatedFlags.local_clocks = updatedLocalClocks;
          updatedFlags.discovered_clocks = [...new Set([...(updatedFlags.discovered_clocks || flags.discovered_clocks || []), 'air', 'pressure', 'swimming_fatigue'])];
        }
      } else {
        // Invalid transition (skip ahead) — reject silently to prevent spoilers
        console.warn(`Rejected province transition ${currentProvince} → ${toProv}: not next in canonical sequence`);
      }
    }

    // During the camp arc (before raiders are fought off), the Pull is QUIET —
    // reaching and helping the camp is WHY the Pull brought Bullet here. Once
    // Bullet has met at least one NPC at camp, cap intensity at 1 (Quiet) and
    // set scar_state to quiet so the LLM can't erroneously spike it during the
    // helping phase. Only after camp_arc_complete does the departure escalation fire.
    if (!updatedFlags.camp_arc_complete && currentProvince === 618) {
      const hasMetNpcs = Object.keys(updatedFlags.npc_relationships || {}).length > 0;
      if (hasMetNpcs) {
        updatedFlags.pull_intensity = Math.min(1, updatedFlags.pull_intensity || 0);
        updatedFlags.scar_state = 'quiet';
      }
    }

    // Once the camp arc is complete but Bullet hasn't left Province 618, the Pull
    // escalates every turn — it will not let him stay. Floor it at Burn (3) and push
    // it upward until the departure transition to 472 happens.
    if (updatedFlags.camp_arc_complete && currentProvince === 618) {
      const departing = validTransition && validTransition.to_province === 472;
      if (!departing) {
        updatedFlags.pull_intensity = Math.min(6, Math.max(updatedFlags.pull_intensity || 1, 3) + 1);
        if (updatedFlags.pull_intensity >= 4 && ['quiet', 'pulse'].includes(updatedFlags.scar_state)) {
          updatedFlags.scar_state = 'burn';
        }
        if (updatedFlags.pull_intensity >= 5 && ['quiet', 'pulse', 'burn'].includes(updatedFlags.scar_state)) {
          updatedFlags.scar_state = 'flare';
        }
      }
    }

    // Chapter 1 sequence advancement — CODE-DRIVEN with LLM assist.
    // The code checks if the current sequence's required flag is set and
    // auto-advances. The LLM's advance_sequence signal is a secondary trigger.
    // This makes the stage system deterministic: the CODE owns progression.
    if (currentProvince === 618) {
      let currentSeq = updatedFlags.chapter1_sequence || 1;
      // Auto-advance: check if the current sequence's completion flag is set
      const check = SEQUENCE_COMPLETION_CHECKS[currentSeq];
      if (check && check(updatedFlags) && currentSeq < 15) {
        updatedFlags.chapter1_sequence = currentSeq + 1;
        updatedFlags.chapter1_stage = CHAPTER1_STAGES[currentSeq] || CHAPTER1_STAGES[0];
        console.log(`[PullGM] Chapter 1 auto-advanced: ${currentSeq} -> ${currentSeq + 1} (flag-based)`);
        currentSeq = currentSeq + 1;
      }
      // LLM-requested advance — gated: if the current sequence has a completion
      // check, the LLM can only advance when the required conditions are met.
      // This prevents skipping required beats (e.g. advancing past the camp
      // evening interlude before Spark, Patch, and Maul are introduced).
      if (result.advance_sequence && currentSeq === (updatedFlags.chapter1_sequence || 1) && currentSeq < 15) {
        const llmCheck = SEQUENCE_COMPLETION_CHECKS[currentSeq];
        if (llmCheck && !llmCheck(updatedFlags)) {
          console.warn(`[PullGM] Held LLM-requested advance from seq ${currentSeq}: required conditions not met`);
        } else {
          updatedFlags.chapter1_sequence = currentSeq + 1;
          updatedFlags.chapter1_stage = CHAPTER1_STAGES[currentSeq] || CHAPTER1_STAGES[0];
          console.log(`[PullGM] Chapter 1 sequence advanced: ${currentSeq} -> ${currentSeq + 1} (LLM-requested)`);
        }
      }
    }

    // ─── Stage-Based Pull Override (FINAL AUTHORITY) ───
    // Ensures Pull intensity and scar state match the story stage, overriding
    // any LLM error or premature camp_arc_complete inference. Quest travel
    // (task_assigned, task_in_progress) is service to the camp — the Pull
    // stays calm and allows the detour. Only after the raid is resolved and
    // farewell gifts are given does the Pull escalate toward departure.
    // Stages 13-15 (pull_departure, province1_interlude, water_wall_reached)
    // use the existing escalation code above — no override needed there.
    if (currentProvince === 618) {
      const stage = updatedFlags.chapter1_stage || CHAPTER1_STAGES[(updatedFlags.chapter1_sequence || 1) - 1] || 'desert_wake';
      const override = STAGE_PULL_OVERRIDES[stage];
      if (override) {
        if (override.intensity !== updatedFlags.pull_intensity) {
          console.log(`[PullGM] Stage override: pull_intensity ${updatedFlags.pull_intensity} -> ${override.intensity} (stage: ${stage})`);
        }
        updatedFlags.pull_intensity = override.intensity;
        updatedFlags.scar_state = override.scar;
      }
    }

    // ─── Final camp_arc_complete validation ───
    // camp_arc_complete means the camp arc is DONE: mission complete AND raiders
    // fought off. Clear it if raiders haven't been defeated and we're not at the
    // departure stage (seq >= 13). This catches LLM errors where camp_arc_complete
    // or raiders_defeated are set prematurely.
    if (updatedFlags.camp_arc_complete && currentProvince === 618) {
      const uf = updatedFlags.unlock_flags || {};
      const seq = updatedFlags.chapter1_sequence || 1;
      if (!uf.raiders_defeated && seq < 13) {
        updatedFlags.camp_arc_complete = false;
        console.warn(`[PullGM] Final validation: cleared camp_arc_complete (raiders not defeated, seq=${seq})`);
      }
    }

    // ─── Chapter Module System: Generate handoff on chapter completion ───
    // When a province transition fires (chapter end), generate a structured handoff
    // and save it. The next chapter loads ONLY this handoff — not the full state.
    let chapterComplete = false;
    let handoffData = null;
    if (validTransition && validTransition.to_province !== currentProvince) {
      handoffData = generateChapterHandoff(updatedFlags, [...(bullet.equipment || [])], currentChapterNum);
      if (handoffData) {
        const completedChapterId = 'chapter_' + String(currentChapterNum).padStart(3, '0');
        updatedFlags.chapter_handoffs = { ...(flags.chapter_handoffs || {}), [completedChapterId]: handoffData };
        updatedFlags.chapter_status = { ...(flags.chapter_status || {}), [completedChapterId]: 'completed' };
        chapterComplete = true;
        console.log('[PullGM] Chapter ' + currentChapterNum + ' complete — handoff saved for ' + completedChapterId);
      }
    }

    // Save campaign state (parallel with other saves)
    savePromises.push(admin.entities.Campaign.update(campaign_id, {
      world_state: { ...ws, quest_flags: updatedFlags },
      current_scene: narration.substring(0, 200),
      ...chapterUpdate
    }).catch(() => {}));

    // ─── Update character ───
    const charUpdates = {};

    // Update character name when Shard first names him Bullet
    if (result.bullet_named && !flags.bullet_named && bullet.name !== 'Bullet') {
      charUpdates.name = 'Bullet';
    }

    // HP change
    let newHp = bullet.hp_current;
    if (typeof result.hp_change === 'number') {
      newHp = Math.max(0, Math.min(bullet.hp_max, bullet.hp_current + result.hp_change));
      if (newHp !== bullet.hp_current) charUpdates.hp_current = newHp;
    }

    // Item changes
    let updatedEquipment = [...(bullet.equipment || [])];
    if (result.item_changes && result.item_changes.length) {
      for (const ic of result.item_changes) {
        if (ic.action === 'add') {
          updatedEquipment.push({ name: ic.item, qty: 1, notes: ic.notes || '' });
        } else if (ic.action === 'remove') {
          updatedEquipment = updatedEquipment.filter(e => e.name !== ic.item);
        }
      }
    }
    // Ensure farewell gift items are in inventory when their flags are set
    if (updatedFlags.spark_shard && !updatedEquipment.some(e => /spark'?s?.*shard/i.test(e.name))) {
      updatedEquipment.push({ name: "Spark's Unetched Shard", qty: 1, notes: 'A loaner for good luck. Spark asked you to bring it back someday.' });
    }
    if (updatedFlags.breathing_gear && !updatedEquipment.some(e => /breathing apparatus/i.test(e.name))) {
      updatedEquipment.push({ name: "Shard's Breathing Apparatus", qty: 1, notes: 'Salvaged breathing gear for Province 472.' });
    }
    if (updatedFlags.thread_blade && !updatedEquipment.some(e => /thread.*blade|algae.*wrapped.*blade/i.test(e.name))) {
      updatedEquipment.push({ name: "Thread's Algae-Wrapped Blade", qty: 1, notes: 'A blade given by Thread in the underwater dome.' });
    }
    // Etched Shard — starting item, always in inventory from turn 1
    if (!updatedEquipment.some(e => /etched.*shard/i.test(e.name))) {
      updatedEquipment.push({ name: 'Etched Shard', qty: 1, notes: 'A shard of metal or glass, warm to the touch. Etched with a circle bisected by a jagged line.' });
    }
    if (updatedFlags.patch_cloak && !updatedEquipment.some(e => /patch.*cloak/i.test(e.name))) {
      updatedEquipment.push({ name: "Patch's Cloak", qty: 1, notes: "A healer's cloak. Proof someone once cared whether Bullet survived." });
    }
    if (updatedEquipment.length !== (bullet.equipment || []).length || JSON.stringify(updatedEquipment) !== JSON.stringify(bullet.equipment || [])) {
      charUpdates.equipment = updatedEquipment;
    }

    if (Object.keys(charUpdates).length) {
      savePromises.push(admin.entities.Character.update(bullet.id, charUpdates).catch(() => {}));
    }

    // Await all saves in parallel (journal entries, events, NPCs, campaign, character)
    await Promise.all(savePromises);

    // Return response
    return Response.json({
      narration,
      interlude: interludeText || null,
      pull_intensity: updatedFlags.pull_intensity,
      scar_state: updatedFlags.scar_state,
      shard_resonance: updatedFlags.shard_resonance,
      hp_change: result.hp_change || 0,
      hp_current: newHp,
      hp_max: bullet.hp_max,
      clock_changes: result.clock_changes || [],
      local_clock_changes: result.local_clock_changes || [],
      local_clocks: updatedFlags.local_clocks || {},
      water_received: !!result.water_received,
      codex_unlocks: result.codex_unlocks || [],
      decision_impact: result.decision_impact || null,
      npc_updates: result.npc_updates || [],
      discovered_clocks: (updatedFlags.discovered_clocks || []).filter(c => !((flags.discovered_clocks || []).includes(c))),
      province_transition: validTransition || null,
      enemy_turn: result.enemy_turn || null,
      condition_changes: result.condition_changes || [],
      item_changes: result.item_changes || [],
      pipe_state: updatedFlags.pipe_state,
      shard_focus_unlocked: !!result.shard_focus_unlocked,
      spark_shard_acquired: !!result.spark_shard_acquired,
      breathing_gear_acquired: !!result.breathing_gear_acquired,
      choices: result.choices || [],
      current_objective: updatedFlags.current_objective || null,
      equipped_weapon: updatedFlags.equipped_weapon || '',
      last_weapon_used: updatedFlags.last_weapon_used || '',
      events: result.events || [],
      knowledge_flags: updatedFlags.knowledge_flags || {},
      bullet_named: !!updatedFlags.bullet_named,
      camp_arc_complete: !!updatedFlags.camp_arc_complete,
      chapter1_sequence: updatedFlags.chapter1_sequence || 1,
      chapter1_stage: updatedFlags.chapter1_stage || CHAPTER1_STAGES[(updatedFlags.chapter1_sequence || 1) - 1] || CHAPTER1_STAGES[0],
      chapter_complete: chapterComplete,
      handoff: handoffData
    });

  } catch (error) {
    console.error('PullGM error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});