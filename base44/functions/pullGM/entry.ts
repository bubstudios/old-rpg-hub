import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

// ─── Province data (compact, for GM context) ───
const PROVINCES = {
  618: { n: 'Red Sand Camp', b: 'Red dunes, harsh sun, water scarcity, ruins, raiders, metal bird drone', d: 'Thirst, raiders, sand maws', npcs: 'Shard (leader), Patch (healer), Spark (young inventor), Maul (rival bruiser), Cowboy, Rivet', e: 'Raiders, Sand Maw', c: 'Thirst, Camp Trust, Purifier Stability, Raider Threat', m: 'Help retrieve purifier core or follow the Pull alone', l: 'Metal bird scans Bullet and recognizes something. Etched symbol matches ruins.', t: 'Tutorial survival' },
  472: { n: 'Liquid Block / Dome', b: 'Floating liquid cube, jelly-water, pressure, oxygen scarcity, underwater dome', d: 'Oxygen depletion, spine creatures, Dreadwraith', npcs: 'Ember (dome leader), Thread (net weaver), Veil (suspicious), Glint (engineer), Flicker (apprentice)', e: 'Dreadwraith (first appearance — adaptive material hunter)', c: 'Oxygen, Pressure, Dome Stability, Dreadwraith Adaptation', m: 'Save dome resources or fight Dreadwraith and leave while needed', l: 'Dreadwraith adapts to materials. Exposed core is its weakness. It is not natural.', t: 'Oxygen survival and first monster' },
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

const PULL_LABELS = ['Quiet', 'Tug', 'Ache', 'Burn', 'Commanding', 'Blackout Risk', 'Override'];

// Server-side validation: a clock can only be discovered once its narrative
// condition is met. This prevents the LLM from revealing hidden clocks early.
const CLOCK_DISCOVERY_RULES = {
  camp_trust: (f) => Object.keys(f.npc_relationships || {}).length > 0,
  purifier_stability: (f) => {
    const r = f.npc_relationships || {};
    return !!(r.shard || r.spark || r.patch);
  },
  raider_threat: (f) => (f.discovered_clocks || []).includes('camp_trust')
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
    decision_impact: { type: "object", properties: {
      is_meaningful: { type: "boolean" },
      impacts: { type: "array", items: { type: "object", properties: {
        label: { type: "string" }, change: { type: "number" }, change_label: { type: "string" }, reason: { type: "string" }, category: { type: "string" }, tone: { type: "string" }
      } } },
      future_consequence: { type: "string" }
    } },
    npc_updates: { type: "array", items: { type: "object", properties: { key: { type: "string" }, name: { type: "string", description: "NPC display name" }, description: { type: "string", description: "Brief physical description" }, disposition: { type: "string", description: "friendly, hostile, neutral, etc." }, is_new: { type: "boolean", description: "true if Bullet is meeting this NPC for the first time" }, relationship_change: { type: "number" }, reason: { type: "string" } } } },
    discovered_clocks: { type: "array", items: { type: "string" }, description: "Local clock keys Bullet just discovered or was told about. Keys: camp_trust, purifier_stability, raider_threat, etc. Only include clocks Bullet just learned about this turn." },
    province_transition: { type: "object", properties: { to_province: { type: "number" }, reason: { type: "string" } } },
    enemy_turn: { type: "object", properties: { province_1_alert_change: { type: "number" }, hunter_proximity_change: { type: "number" }, action: { type: "string" } } },
    item_changes: { type: "array", items: { type: "object", properties: { action: { type: "string" }, item: { type: "string" }, notes: { type: "string" } } } },
    pipe_state: { type: "string", description: "Updated pipe state: unfound, battered_metal_pipe, or radiant_sword" },
    shard_focus_unlocked: { type: "boolean" },
    spark_shard_acquired: { type: "boolean" },
    choices: { type: "array", items: { type: "string" }, description: "3-4 suggested player actions for the next turn" }
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
- Every scene must include: environmental danger, survival pressure, local NPCs or threats, a moral dimension, a clue about the larger mystery, and offscreen consequences.
- Do not railroad. Let the player make choices. But the Pull should always create pressure.
- If the player delays too long, increase Pull intensity, danger, or Hunter Proximity.
- Make survival costly. Make kindness matter. Make guilt matter. Make connection one of the few forces that can resist the realm.
- Do not make self-harm a gameplay solution. Despair scenes should be crisis states that can be resisted, interrupted, or survived.
- Blackout combat should create fear and consequence, not reward.
- THE PIPE: Bullet does NOT start with a weapon. The first time he faces a physical threat or combat, narrate him instinctively snatching up a battered metal pipe (or similar bludgeon) from the environment — his body remembering what his mind has forgotten. This is a significant narrative beat: a wounded amnesiac reaching for something to swing. Add the pipe to inventory via item_changes (action: "add", item: "Battered Metal Pipe") and set pipe_state to "battered_metal_pipe". Do NOT give him the pipe before the first physical confrontation. After acquisition, the pipe becomes his main weapon, walking stick, and an emotional anchor — it collects scars and stories from every Province.
- Innocent suffering should have emotional weight, not be used casually.
- LOCAL CLOCK DISCOVERY (CRITICAL): Bullet only sees clocks he has discovered. At game start ONLY these are discovered: thirst, heat_exposure, fatigue. Do NOT add camp_trust, purifier_stability, or raider_threat to discovered_clocks until their trigger fires. Triggers: camp_trust = Bullet reaches camp AND talks to someone (at least one NPC met); purifier_stability = Shard, Spark, or Patch explains the purifier is failing; raider_threat = Spark warns raiders coming, Bullet sees raider tracks, a scout reports movement, or the attack begins. Track hidden clock VALUES in local_clocks but NEVER add their keys to discovered_clocks until the trigger actually happens this turn.
- NPC DISCOVERY: When Bullet meets an NPC for the first time, include them in npc_updates with is_new: true, name, description, and disposition. Key NPCs: Shard (leader), Patch (healer), Spark (inventor), Maul (rival), Cowboy, Rivet. Discovery triggers: Shard when she names Bullet; Patch when she treats him; Spark near camp tech; Maul when he confronts Bullet; Cowboy on purifier mission; Rivet during raid setup.
- Player choices should matter whenever possible.
- Visions can be true memory, distorted memory, false guilt echo, Province-planted accusation, symbolic echo, or unverified myth. Do not treat all visions as true.

CURRENT GAME STATE:
Province: ${ctx.currentProvince} — ${p.n}
Phase: ${ctx.phase} | Chapter: ${ctx.chapter}
Pull Intensity: ${ctx.pullIntensity} — ${pullLabel}
Scar State: ${ctx.scarState}
Shard Resonance: ${ctx.shardResonance}
HP: ${ctx.hpCurrent}/${ctx.hpMax}
Conditions: ${conditionsStr}
Inventory: ${equipmentStr}
Pipe State: ${ctx.pipeState}
Shard Focus Unlocked: ${ctx.shardFocusUnlocked}
Spark's Shard: ${ctx.sparkShard ? 'Acquired' : 'Not acquired'}

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

RECENT STORY:
${ctx.recentStory || '(The tale has just begun.)'}

PLAYER ACTION:
${ctx.action}

Respond with vivid narration (2-4 paragraphs, second-person present tense, dark and atmospheric). Include environmental details, sensory information, NPC reactions, and consequences. Then provide state changes as JSON. For decision_impact, only set is_meaningful=true for choices that have real consequences (ally trust changes, clock shifts, moral outcomes, lore discoveries). Use change_label values like "Major increase", "Slight decline", "Strong approval", etc.`;
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
      pipeState: flags.pipe_state || 'unfound',
      shardFocusUnlocked: !!flags.shard_focus_unlocked,
      sparkShard: !!flags.spark_shard,
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

    const narration = result.narration || 'The Pull drags you forward. The world shifts around you.';

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

    // Shard focus unlock
    if (result.shard_focus_unlocked) updatedFlags.shard_focus_unlocked = true;

    // Spark shard acquired
    if (result.spark_shard_acquired) updatedFlags.spark_shard = true;

    // Pipe state update
    if (result.pipe_state) updatedFlags.pipe_state = result.pipe_state;

    // Apply NPC updates — update relationships and create NPC entity records for new encounters
    const npcRels = { ...(flags.npc_relationships || {}) };
    for (const nu of (result.npc_updates || [])) {
      if (!nu.key) continue;
      const existing = npcRels[nu.key] || {};
      const isNew = nu.is_new === true && !existing.first_met;
      npcRels[nu.key] = {
        name: nu.name || existing.name || nu.key,
        disposition: nu.disposition || existing.disposition || 'neutral',
        relationship: Math.max(-100, Math.min(100, (existing.relationship || 0) + (nu.relationship_change || 0))),
        first_met: existing.first_met || isNew
      };
      if (isNew) {
        try {
          await admin.entities.NPC.create({
            campaign_id,
            name: nu.name || nu.key,
            disposition: nu.disposition || 'neutral',
            description: nu.description || '',
            first_met_chapter: campaign.current_chapter || 1
          });
        } catch (e) { /* NPC may already exist */ }
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

    // Province transition
    let chapterUpdate = {};
    if (result.province_transition && typeof result.province_transition.to_province === 'number') {
      updatedFlags.current_province = result.province_transition.to_province;
      updatedFlags.province_history = [...(flags.province_history || []), currentProvince];
      const nextCh = PROVINCE_CHAPTERS[result.province_transition.to_province];
      if (nextCh && nextCh > (campaign.current_chapter || 1)) {
        chapterUpdate.current_chapter = nextCh;
      }
      // Update phase
      if (result.province_transition.to_province === 1) updatedFlags.phase = 'Final Revelation';
      else if (result.province_transition.to_province === -1) updatedFlags.phase = 'Cleanup';
      else if (result.province_transition.to_province === 0 || result.province_transition.to_province === 14 || result.province_transition.to_province === 140) updatedFlags.phase = 'System Breaker';
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
      if (updatedEquipment.length !== (bullet.equipment || []).length || JSON.stringify(updatedEquipment) !== JSON.stringify(bullet.equipment || [])) {
        charUpdates.equipment = updatedEquipment;
      }
    }

    if (Object.keys(charUpdates).length) {
      await admin.entities.Character.update(bullet.id, charUpdates);
    }

    // Return response
    return Response.json({
      narration,
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
      province_transition: result.province_transition || null,
      enemy_turn: result.enemy_turn || null,
      condition_changes: result.condition_changes || [],
      item_changes: result.item_changes || [],
      pipe_state: updatedFlags.pipe_state,
      shard_focus_unlocked: !!result.shard_focus_unlocked,
      spark_shard_acquired: !!result.spark_shard_acquired,
      choices: result.choices || []
    });

  } catch (error) {
    console.error('PullGM error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});