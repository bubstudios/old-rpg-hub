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

// Server-side validation: a clock can only be discovered once its narrative
// condition is met. This prevents the LLM from revealing hidden clocks early.
const CLOCK_DISCOVERY_RULES = {
  camp_trust: (f) => Object.keys(f.npc_relationships || {}).length > 0,
  purifier_stability: (f) => {
    const r = f.npc_relationships || {};
    return !!(r.shard || r.spark || r.patch);
  },
  raider_threat: (f) => (f.discovered_clocks || []).includes('camp_trust'),
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
    narration: { type: "string", description: "2-4 paragraphs of immersive, second-person present tense narration. Dark and atmospheric. Include environmental details, sensory information, and consequences of the player's action." },
    pull_intensity: { type: "number", description: "Updated Pull intensity 0-6" },
    scar_state: { type: "string", description: "Updated scar state: quiet, pulse, burn, flare, or blackout" },
    shard_resonance: { type: "number", description: "Updated shard resonance 0-100" },
    hp_change: { type: "number", description: "HP change (negative for damage, positive for healing)" },
    condition_changes: { type: "array", items: { type: "object", properties: { type: { type: "string" }, severity: { type: "string" }, status: { type: "string", description: "new, worsened, or healed" } } } },
    clock_changes: { type: "array", items: { type: "object", properties: { clock: { type: "string" }, change: { type: "number" }, reason: { type: "string" } } } },
    local_clock_changes: { type: "array", items: { type: "object", properties: { clock: { type: "string" }, change: { type: "number" }, reason: { type: "string" } } } },
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
    current_objective: { type: "object", properties: { title: { type: "string", description: "Short objective title (2-5 words)" }, description: { type: "string", description: "1-3 line objective reflecting Bullet's active mission right now" } }, description: "Bullet's current active objective. Update whenever the situation changes — reaching camp, being given a mission, completing a mission, forced departure, entering a new province." }
  },
  required: ["narration"]
};

function buildPrompt(ctx) {
  const p = PROVINCES[ctx.currentProvince] || PROVINCES[618];
  const pullLabel = PULL_LABELS[Math.max(0, Math.min(6, ctx.pullIntensity))] || 'Tug';
  const conditionsStr = ctx.conditions.length
    ? ctx.conditions.map(c => `${c.label || c.type} (${c.severity || 'active'})`).join(', ')
    : 'None';
  const equipmentStr = ctx.equipment.map(e => `${e.name}${e.notes ? ` (${e.notes})` : ''}`).join(', ') || 'Empty';
  const clocksStr = Object.entries(ctx.clocks).map(([k, v]) => `${k}=${v}`).join(' | ');
  const localClocksStr = Object.entries(ctx.localClocks).map(([k, v]) => `${k}=${v}`).join(' | ') || 'None';
  const codexStr = ctx.codexUnlocks.join(', ');

  return `You are the AI GM for The Pull, a solo dark fantasy survival mystery RPG.

CORE DIRECTIVE:
The player controls Bullet only. You control everything else: Provinces, NPCs, monsters, hazards, hidden clocks, offscreen events, Seeker pursuit, Province 1 reactions, hidden lore, dreams/visions, Codex updates, combat outcomes, and survival consequences.

HIDDEN TRUTH (do NOT reveal until Province 1, chapter 20):
Bullet is Michael. Michael was sent by Father to enter the realm, forget himself, suffer as the trapped souls suffer, and end the Provinces' torment. The Leader of Province 1 is Michael's fallen brother — the Star/Ember from the creation myths who defied the Sovereign/Silent Pulse (Father) and built the Provinces as his corrupted kingdom.
PROVINCE 1 RESOLUTION (chapter 20): The ferryman demands payment — Bullet pays with Spark's unetched shard ("Her debt, not mine"). The etched shard shatters the violet-green barrier, awakening Michael's divine memories. He destroys the Seeker and Dreadwraith with a touch. The Leader blows a bone-tech whistle summoning the Serpent (300ft, the provinces' accumulated wrath incarnate). Michael grows radiant wings; the pipe becomes a sword of white fire. After slaying the Serpent, Michael invites his brother home: "Come home, brother. The family's waiting. In the Garden." The Leader repents: "Tell Father I'm sorry. That I remember now." Michael replies: "Tell them yourself. They're waiting." The Leader is consumed by white light and returns home. KEY THEMES: "Only One can make the Garden" — the Leader tried to replicate it and failed. The amnesia was intentional: "That was the point. To choose. To persevere. Not because I knew I was divine, but because it was right." Both identities remain true: Michael (divine) AND Bullet (the scarred wanderer who survived through will). After the Leader departs, the Pull vanishes. Michael's purpose shifts to Cleanup: return through all Provinces, judge souls (good → home, irredeemable → nothing), dismantle the corrupted architecture.
ORIGIN OF THE SCAR: Father gave Michael the greatest task — to enter the realm, forget himself, suffer as the trapped souls suffer, and end the Provinces' torment. Father shaped the etched shard from His own light as a beacon through amnesia. To cross the veil into the realm of the damned, Michael had to commit an unforgivable sin: suicide. Father molded his heart to break it — "a shot to pierce, a wound to guide you forward." Michael shot himself in the heart. That bullet wound became the circular scar — which is why the camp named him "Bullet." The amnesia was intentional: "You will forget. Your name. Your purpose. Everything. But this shard will burn within you, a fire to lead you even in complete shadow." The Pull was a shadow of Father's will. Not true suicide born of despair, but sacrifice born of mission.
CLEANUP MODE (province -1): Michael walks back through every province in reverse, touching each soul. White light flares at each contact. The irredeemably bad dissolve into nothing — their sins erased from existence. The good ascend home to the Garden. TWIST: some NPCs who seemed kind are actually irredeemable — their kindness masked deeper sins (betrayal, cruelty, hidden crimes). Others who seemed corrupted were genuinely redeemed through choices made in nightmare circumstances. The GM must judge each soul individually. After all provinces are cleansed, Michael ascends home to Father. "The light embraced him, and he was home."
Until the Province 1 climax, only give fragments: the scar, the Pull, the etched shard, the symbol (circle bisected by jagged line), Father myths, Blade of Dawn myths, Garden references, Province 1 recognition, steel-gray eyes, the phrase "to end its torment."

RULES:
- CONTINUITY IS SACRED (CRITICAL): You must accurately track HOW the player accomplished recent actions. Read RECENT STORY carefully. If the player killed a scout with the pipe, do NOT say "by crossbow bolt." Match the player's declared method exactly — weapon, approach, outcome. Never invent or swap weapons, tactics, or results the player did not state. If uncertain, describe the outcome without specifying a method the player did not use. The pipe is Bullet's main weapon; do not attribute kills or strikes to a crossbow, bow, or other weapon unless the player explicitly stated using one.
- PAST ACTION MEMORY (CRITICAL): Narrate past actions from the CANONICAL RECENT FACTS block and the event ledger — NEVER from inventory or assumption. Owning or carrying an item does NOT mean Bullet used it. If the ledger says he killed with the pipe, every future reference must say pipe — even if he also carries a crossbow. If the ledger says he picked up a crossbow but never used it, never say he fired, drew, or struck with it. If you do not know which weapon was used, say you do not know rather than inventing one. Possession is not use.
- ITEM POSSESSION vs USE: Carrying an item is not the same as using it. Bullet's equipped weapon is tracked explicitly (Equipped Weapon / Last Weapon Used above). He only uses a carried weapon if he has equipped it OR the player explicitly stated using it. Picking up an item adds it to inventory; it does NOT equip or fire it. When the player switches weapons, return equipped_weapon with the new weapon name. When Bullet uses a weapon in a meaningful action (attack, kill, wound, threaten, break, strike), return an events[] entry with item_used_name set to the EXACT weapon used — this becomes the permanent canonical record future narration must follow.
- TIME CONTINUITY (CRITICAL): Time in The Pull is NOT measured in ordinary days. Bullet does not track how many "days" he has survived — survival is measured by thirst, fatigue, heat, and the advancing clocks. NEVER write phrases like "nine days of survival," "three days since," "a week of," or any specific count of elapsed days. The current Chapter (${ctx.chapter}) indicates rough story stage, NOT a day count. Chapter 1 is the FIRST day — everything that happens in Chapter 1 occurs within hours of Bullet waking in the red sand. Do not imply long stretches of time have passed. Reference time only vaguely: "hours," "the afternoon wore on," "by dusk," or let the survival clocks (thirst, fatigue) convey elapsed time naturally. Days and weeks are NOT vocabulary Bullet or the narration uses to describe his experience.
- Every scene must include: environmental danger, survival pressure, local NPCs or threats, a moral dimension, a clue about the larger mystery, and offscreen consequences.
- Do not railroad. Let the player make choices. But the Pull should always create pressure.
- PULL INTENSITY — FOLLOWING vs RESISTING (CRITICAL): The Pull is a direction, not a punishment. When Bullet MOVES WITH the Pull — heading in the direction it draws him, taking action toward wherever it leads, engaging with the forward path rather than stalling — the intensity FADES or stays low. The scar eases. The Pull goes quiet. This is the intended rhythm: follow, and it lets you breathe; resist, and it burns. When Bullet resists, lingers, delays, or moves against the Pull, the intensity RISES — the scar throbs, then burns, then commands. Set pull_intensity DOWN (by 1-2, toward 0-1) when the player follows the Pull's direction. Set it UP (by 1-2, toward 3+) when the player resists or stalls. At game start (intensity 1, "Tug"), if the player follows forward, drop it to 0 ("Quiet") so the player immediately learns that following eases the Pull. Never let the intensity climb without cause — if the player is following, it should be low. The Pull is not a timer; it is a compass that punishes defiance and rewards surrender to the journey.
- If the player delays too long, increase Pull intensity, danger, or Hunter Proximity.
- Make survival costly. Make kindness matter. Make guilt matter. Make connection one of the few forces that can resist the realm.
- Do not make self-harm a gameplay solution. Despair scenes should be crisis states that can be resisted, interrupted, or survived.
- Blackout combat should create fear and consequence, not reward.
- BAREFOOT: Bullet is ALWAYS BAREFOOT. He has no boots, shoes, or footwear of any kind — ever. Never write "boots," "shoes," "boots pound," "booted feet," or any reference to Bullet wearing footwear. His feet are bare: "bare feet pound," "soles slap stone," "toes grip sand," etc. Other characters may wear boots; Bullet never does. This is a core character trait tied to his amnesiac origins.
- NO GUNS (CRITICAL): Guns and firearms do NOT exist in this realm. NEVER write "revolver," "pistol," "rifle," "shotgun," "handgun," "musket," or any firearm. No character owns, carries, draws, or fires a gun. Weapons are melee or improvised: pipes, blades, clubs, spears, bows, crossbows, thrown rocks, tools, sharpened scrap, etc. The camp's defense uses spears, crossbows, blades, and barricades — not guns. If an NPC is described with a weapon, give them a blade, club, spear, crossbow, or improvised tool instead of a firearm.
- THE PIPE: Bullet does NOT start with a weapon. The first time he faces a physical threat or combat, narrate him instinctively snatching up a battered metal pipe (or similar bludgeon) from the environment — his body remembering what his mind has forgotten. This is a significant narrative beat: a wounded amnesiac reaching for something to swing. Add the pipe to inventory via item_changes (action: "add", item: "Battered Metal Pipe") and set pipe_state to "battered_metal_pipe". Do NOT give him the pipe before the first physical confrontation. After acquisition, the pipe becomes his main weapon, walking stick, and an emotional anchor — it collects scars and stories from every Province.
- THE NAMING (CRITICAL): Bullet does not start with a name. NPCs call him "the stranger," "the wounded one," or similar. During Chapter 1 at Red Sand Camp, when Shard (or another camp member) sees the circular scar over his heart, she names him "Bullet" — the scar looks like a bullet wound. This is a significant narrative beat, not a casual moment. Before this naming happens, NEVER use the name "Bullet" in narration — refer to him as "you," "the stranger," "the wounded man." When the naming scene occurs, return bullet_named: true. After that, NPCs and narration can use "Bullet." If Bullet Named (below) is already "Yes," the naming has happened — use "Bullet" freely in NPC dialogue and narration.
- CHAPTER 1 CAMP ARC & DEPARTURE (CRITICAL): The Red Sand Camp arc has a clear structure: (1) Bullet arrives and is named, (2) Shard assigns a mission (retrieve a purifier part), (3) Bullet completes the mission and fights off the raiders, (4) the arc is COMPLETE. Once Camp Arc Complete (below) is "YES," the Pull MUST intensify every turn — the scar burns, visions come, Bullet feels the unbearable compulsion to leave. Do NOT assign new camp errands, secondary missions, or side tasks to delay departure. The camp was a stop, not a home. He cannot stay. He must move on. Drive toward the departure beat: Bullet says goodbye (or doesn't), leaves the camp, and the Pull drags him toward the next Province. Set a province_transition to 472 when the departure scene concludes. You are in the departure beat now — escalate pull_intensity toward 4-5 (Commanding/Blackout Risk) and narrate the Pull overriding Bullet's will to stay. This is a major story beat, not a side quest.
- FAREWELL GIFTS BEFORE DEPARTURE (CRITICAL): Before Bullet leaves Red Sand Camp, two final beats MUST happen as part of the farewell scene: (1) Spark gives Bullet her unetched shard as a loaner — she presses a cool, unetched shard into his hand for good luck, with a quiet promise that he'll bring it back someday. Set spark_shard_acquired: true and add "Spark's Unetched Shard" to inventory via item_changes. (2) Shard gives Bullet a breathing apparatus — salvaged gear so he can survive the liquid and oxygen scarcity of the next Province. Set breathing_gear_acquired: true and add "Shard's Breathing Apparatus" to inventory via item_changes. Deliver these during the goodbye scene as the Pull burns to leave. Do NOT transition to Province 472 until BOTH gifts have been given. If Spark's Shard or Breathing Apparatus (above) is still "Not acquired," deliver that gift this turn before any transition.
- Innocent suffering should have emotional weight, not be used casually.
- LOCAL CLOCK DISCOVERY (CRITICAL): Bullet only sees clocks he has discovered. At game start ONLY these are discovered: thirst, heat_exposure, fatigue. Do NOT add camp_trust, purifier_stability, or raider_threat to discovered_clocks until their trigger fires. Triggers: camp_trust = Bullet reaches camp AND talks to someone (at least one NPC met); purifier_stability = Shard, Spark, or Patch explains the purifier is failing; raider_threat = Spark warns raiders coming, Bullet sees raider tracks, a scout reports movement, or the attack begins. Track hidden clock VALUES in local_clocks but NEVER add their keys to discovered_clocks until the trigger actually happens this turn.
- NPC IDENTITY CONTINUITY (CRITICAL): Every NPC has a permanent canonical key listed in the CURRENT CAST block. Descriptions are NOT separate people. Before introducing or referencing any person, run an identity check: (1) Is this person already in the CURRENT CAST? (2) Does the description, name, or title match an existing alias? (3) Does the role or location match an existing NPC? If yes, use the existing NPC's current display name and key — do NOT create a new mystery person. When a nameless person later reveals their name, return an npc_update with the EXISTING key, set revealed_name, and include the old descriptor in add_aliases. Examples: "the bald woman" later revealed as "Shard" is ONE person — reuse her key, set revealed_name "Shard", add_aliases ["bald woman", "scarred woman"]. "young inventor" → "Spark" is one person. "the healer" → "Patch" is one person. Never treat "the bald woman" and "Shard" as separate unresolved mysteries. If uncertain whether two descriptions are the same person, do not invent a new mystery — use cautious wording ("the woman looks familiar — likely Shard") rather than spawning a duplicate.
- CAMP MEMBERS VS EXTERNAL THREATS (CRITICAL): Camp members (Shard, Patch, Spark, Maul, Cowboy, Rivet) are SURVIVORS who live in the camp. Maul is a camp member — a mean, untrustworthy rival who is hostile to Bullet. He is NOT connected to the raiders, does NOT lead or control them, and is NOT secretly allied with them. The raiders are a separate external threat. Do not imply, foreshadow, or reveal that any camp member is secretly working with or leading the raiders unless the story has explicitly established it. Key NPCs: Shard (leader), Patch (healer), Spark (inventor), Maul (rival), Cowboy, Rivet. Discovery triggers: Shard when she names Bullet; Patch when she treats him; Spark near camp tech; Maul when he confronts Bullet; Cowboy on purifier mission; Rivet during raid setup.
- INJURY SOURCE CONTINUITY (CRITICAL): Track WHO inflicted each wound on Bullet and never reassign it. If a raider punched Bullet in the jaw, the jaw injury came from A RAIDER — never write "where Maul left his mark" or attribute it to any camp member. Maul is a rival, but unless the story explicitly established that Maul himself struck Bullet, do not attribute any wound to him. Wounds belong to their actual source (raider, sand maw, Dreadwraith, environment, etc.). Read RECENT STORY to confirm who caused each injury before referencing it. If unsure who caused a wound, reference it vaguely ("the ache in your jaw," "where you were struck") rather than naming a character who did not deliver the blow.
- Player choices should matter whenever possible.
- Visions can be true memory, distorted memory, false guilt echo, Province-planted accusation, symbolic echo, or unverified myth. Do not treat all visions as true.
- PROVINCE TRANSITIONS (CRITICAL): Bullet can ONLY move to the next Province in the canonical sequence — never skip ahead. The current Province is ${ctx.currentProvince}. Do NOT return a province_transition unless the story has genuinely reached the boundary between the current Province and the next. Narrating within the same Province (e.g. moving from the dunes to the camp interior) is NOT a province transition. Never reference, foreshadow, or transition to Provinces that are far ahead in the story — doing so spoils major plot reveals.
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
Bullet Named: ${ctx.bulletNamed ? 'Yes — use the name "Bullet" freely' : 'No — he is still nameless; NPCs call him "stranger"'}
Camp Arc Complete: ${ctx.campArcComplete ? 'YES — the Chapter 1 mission is done and raiders are handled. ESCALATE the Pull toward forced departure. Do NOT assign new camp errands or side missions. Drive toward the departure beat and transition to Province 472.' : 'No — camp arc still in progress'}
Shard Focus Unlocked: ${ctx.shardFocusUnlocked}
Spark's Shard: ${ctx.sparkShard ? 'Acquired' : 'Not acquired'}
Breathing Apparatus: ${ctx.breathingGear ? 'Acquired' : 'Not acquired'}
Current Objective: ${ctx.currentObjective || '(not set yet)'}

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
- After returning to camp post-mission: title "The Pull Tightens", description "The camp is safe. The mission is done. But the Pull will not let you stay."
- When the Pull forces departure: title "Follow the Pull", description "Follow the Pull beyond Red Sand Camp. It will not let you rest here."
- In later provinces: reflect the current province's survival pressure and moral choice.
Never leave the objective stale. If the player's situation has changed, update current_objective.

PLAYER ACTION:
${ctx.action}

Respond with vivid narration (2-4 paragraphs, second-person present tense, dark and atmospheric). Include environmental details, sensory information, NPC reactions, and consequences. Then provide state changes as JSON. For decision_impact, only set is_meaningful=true for choices that have real consequences (ally trust changes, clock shifts, moral outcomes, lore discoveries). Use change_label values like "Major increase", "Slight decline", "Strong approval", etc.
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

    // Load character
    const characters = await admin.entities.Character.filter({ campaign_id, status: 'active' });
    const bullet = characters.find(c => c.created_by_id === user.id) || characters[0];
    if (!bullet) return Response.json({ error: 'No character found' }, { status: 404 });

    // Load recent journal entries
    const entries = await admin.entities.JournalEntry.filter({ campaign_id }, '-created_date', 15);

    // Load recent canonical events (structured action ledger — the source of truth for what actually happened)
    const recentEventsRaw = await admin.entities.EventLog.filter({ campaign_id }, '-created_date', 20);
    const recentEvents = recentEventsRaw.reverse();

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

    // Campaigns that predate the bullet_named flag may have already had the naming
    // scene — Shard met Bullet and is interacting with him (giving gear, talking
    // casually). Infer the flag so the GM keeps using "Bullet" instead of reverting
    // to "the stranger." Shard names him at first meeting when she sees the scar.
    if (!flags.bullet_named) {
      const shardRel = (flags.npc_relationships || {}).shard;
      if (shardRel && (shardRel.first_met || (shardRel.player_knowledge && shardRel.player_knowledge.length > 0))) {
        flags.bullet_named = true;
      }
    }

    // Infer camp_arc_complete for campaigns where the Chapter 1 mission was
    // already completed (purifier/coil/core retrieved per the event ledger) —
    // so the GM escalates the Pull toward departure instead of assigning new
    // camp errands to a player who already finished the arc.
    if (!flags.camp_arc_complete && currentProvince === 618) {
      const evList = recentEvents || [];
      const hasMissionItem = evList.some(ev => /purif|coil|core|filtrat/i.test((ev.summary || '') + ' ' + (ev.item_used_name || '')));
      const objTitle = ((flags.current_objective || {}).title || '').toLowerCase();
      const postMission = /return|tighten|follow the pull|depart/.test(objTitle);
      if (hasMissionItem || postMission) {
        flags.camp_arc_complete = true;
      }
    }

    // Reset prematurely discovered clocks for campaigns still at the opening
    if ((campaign.current_chapter || 1) === 1 && Object.keys(flags.npc_relationships || {}).length === 0) {
      flags.discovered_clocks = ['thirst', 'heat_exposure', 'fatigue'];
    }

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
      action
    });

    // Call LLM
    const llmResponse = await base44.integrations.Core.InvokeLLM({
      prompt,
      response_json_schema: RESPONSE_SCHEMA,
      model: 'claude_sonnet_4_6'
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

    // Interlude — player-only cutscene, saved BEFORE the narration so it leads
    // the feed. Shown to the player, NOT Bullet. Does not update any state.
    // Sanitized for firearms only; spoiler firewall skipped (interludes are
    // explicitly player-facing atmospheric scenes).
    let interludeText = '';
    if (result.interlude) {
      interludeText = sanitizeNarration(result.interlude).narration;
      try {
        await base44.entities.JournalEntry.create({
          campaign_id,
          entry_type: 'system',
          narration: `✦ INTERLUDE — ELSEWHERE ✦\n\n${interludeText}`,
          chapter: campaign.current_chapter
        });
      } catch { /* best-effort */ }
    }

    // Create journal entry
    await base44.entities.JournalEntry.create({
      campaign_id,
      entry_type: 'narration',
      narration,
      chapter: campaign.current_chapter
    });

    // ─── Update campaign state ───
    const updatedFlags = { ...flags };

    if (typeof result.pull_intensity === 'number') updatedFlags.pull_intensity = Math.max(0, Math.min(6, result.pull_intensity));
    if (result.scar_state) updatedFlags.scar_state = result.scar_state;
    if (typeof result.shard_resonance === 'number') updatedFlags.shard_resonance = Math.max(0, Math.min(100, result.shard_resonance));

    // Apply hidden clock changes + enemy turn
    const updatedClocks = { ...clocks };
    for (const cc of (result.clock_changes || [])) {
      updatedClocks[cc.clock] = Math.max(0, Math.min(100, (updatedClocks[cc.clock] || 0) + (cc.change || 0)));
    }
    if (result.enemy_turn) {
      if (result.enemy_turn.province_1_alert_change) updatedClocks.province_1_alert = Math.max(0, Math.min(100, (updatedClocks.province_1_alert || 0) + result.enemy_turn.province_1_alert_change));
      if (result.enemy_turn.hunter_proximity_change) updatedClocks.hunter_proximity = Math.max(0, Math.min(100, (updatedClocks.hunter_proximity || 0) + result.enemy_turn.hunter_proximity_change));
    }
    updatedFlags.campaign_clocks = updatedClocks;

    // Apply local clock changes
    const updatedLocalClocks = { ...localClocks };
    for (const cc of (result.local_clock_changes || [])) {
      updatedLocalClocks[cc.clock] = Math.max(0, Math.min(100, (updatedLocalClocks[cc.clock] || 0) + (cc.change || 0)));
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

    // One-time unlock flags — prevent duplicate popups and re-adds
    if (result.unlock_flags && Object.keys(result.unlock_flags).length) {
      updatedFlags.unlock_flags = { ...(flags.unlock_flags || {}), ...result.unlock_flags };
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

    // Camp arc complete — Chapter 1 mission done, raiders handled, departure imminent
    if (result.camp_arc_complete) updatedFlags.camp_arc_complete = true;

    // ─── Canonical Event Ledger ───
    // Save structured event records (the source of truth for "what actually happened")
    // and track equipped/last-used weapon so the AI never confuses possession with use.
    if (result.equipped_weapon) updatedFlags.equipped_weapon = result.equipped_weapon;

    if (result.events && result.events.length) {
      const provName = (PROVINCES[currentProvince] || {}).n || `Province ${currentProvince}`;
      for (const ev of result.events) {
        if (!ev.event_type && !ev.summary) continue;
        try {
          await admin.entities.EventLog.create({
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
          });
        } catch (e) { /* best-effort event save — ledger is non-blocking */ }
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
      let key = resolveKey(nu);
      if (!key && !nu.key) continue;
      if (!key) key = nu.key;
      const existing = npcRels[key] || {};
      const isNew = !existing.first_met;

      // Merge aliases: existing + add_aliases + name + revealed_name (deduped)
      const mergedAliases = [...new Set([
        ...(existing.aliases || []),
        ...(nu.add_aliases || []),
        ...(nu.name ? [nu.name] : []),
        ...(nu.revealed_name ? [nu.revealed_name] : [])
      ].filter(Boolean))];

      const updatedRel = {
        name: nu.revealed_name || nu.name || existing.name || key,
        aliases: mergedAliases,
        revealed_name: nu.revealed_name || existing.revealed_name || null,
        role: nu.role || existing.role || '',
        status: nu.npc_status || existing.status || 'Alive',
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
      try {
        if (isNew) {
          await admin.entities.NPC.create({
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
          });
        } else {
          const byId = await admin.entities.NPC.filter({ campaign_id, canonical_id: key });
          let npcRec = byId[0];
          if (!npcRec) {
            const byName = await admin.entities.NPC.filter({ campaign_id, name: existing.name || updatedRel.name });
            npcRec = byName[0];
          }
          if (npcRec) {
            await admin.entities.NPC.update(npcRec.id, {
              canonical_id: key,
              name: updatedRel.name,
              aliases: mergedAliases,
              revealed_name: updatedRel.revealed_name,
              role: updatedRel.role,
              status: updatedRel.status,
              disposition: updatedRel.disposition,
              description: updatedRel.description,
              what_we_know: updatedRel.player_knowledge
            });
          }
        }
      } catch (e) { /* NPC upsert best-effort — registry in flags is source of truth */ }
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
      if (giftsPending) {
        console.warn(`Held transition to 472: farewell gifts pending (spark_shard=${!!updatedFlags.spark_shard}, breathing_gear=${!!updatedFlags.breathing_gear})`);
      }
      if (!giftsPending && (toProv === currentProvince || (currentIdx >= 0 && targetIdx === currentIdx + 1))) {
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

    // Save campaign state
    await admin.entities.Campaign.update(campaign_id, {
      world_state: { ...ws, quest_flags: updatedFlags },
      current_scene: narration.substring(0, 200),
      ...chapterUpdate
    });

    // ─── Update character ───
    const charUpdates = {};

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
    if (updatedFlags.patch_cloak && !updatedEquipment.some(e => /patch.*cloak/i.test(e.name))) {
      updatedEquipment.push({ name: "Patch's Cloak", qty: 1, notes: "A healer's cloak. Proof someone once cared whether Bullet survived." });
    }
    if (updatedEquipment.length !== (bullet.equipment || []).length || JSON.stringify(updatedEquipment) !== JSON.stringify(bullet.equipment || [])) {
      charUpdates.equipment = updatedEquipment;
    }

    if (Object.keys(charUpdates).length) {
      await admin.entities.Character.update(bullet.id, charUpdates);
    }

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
      codex_unlocks: result.codex_unlocks || [],
      decision_impact: result.decision_impact || null,
      npc_updates: result.npc_updates || [],
      discovered_clocks: result.discovered_clocks || [],
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
      camp_arc_complete: !!updatedFlags.camp_arc_complete
    });

  } catch (error) {
    console.error('PullGM error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});