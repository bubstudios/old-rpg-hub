import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

// ═══════════════════════════════════════════════════════════════
// CANON CARDS — compact reference data. NOT sent in full to the LLM.
// Only relevant cards are pulled into the turn packet per command.
// ═══════════════════════════════════════════════════════════════

const CANON = {
  core: `Pathfinder Journeys — story-driven command sandbox. Player is Captain Bub Stellar, UES Pathfinder, after Arc 1. NO dice/D100/levels/XP/credits. Resolve through narrative logic, clocks, evidence, crew, allies, enemy reactions. Return valid JSON only.`,

  rules: [
    'NO dice, D100, levels, XP, credits, or RPG stats shown to player.',
    'Resolve through narrative logic, clocks, evidence, crew, allies, enemy reactions.',
    'Sandbox is alive — player can go anywhere, try anything. "You can try. Here are the risks."',
    'Enemies act even when ignored. Clocks create consequences, not punishment.',
    'Allies are NOT permanent friends. They can disagree, refuse, demand explanation.',
    'Never reveal future knowledge before earned.',
    'Crew health tracked narratively. No HP bar.',
    'Never use: Federation, Starfleet, phaser, warp drive, transporter, U.S.S., hyperspace.',
    'Use: United Earth, United Earth Command, laser/pulse/plasma, FTL drive, shuttle, U.E.S., FTL/jumpspace.',
    'The Confluence is calm, polite, legalistic, terrifying. Uses: claim, adjudication, preserve, compliance, asset, harvest, reassignment.'
  ],

  crew: {
    thorne: 'Cmdr Farah Thorne — Tactical/Security. Fierce, blunt, loyal. May push aggressive action.',
    clark: 'Cmdr Clark — Science/Sensors. Dry humor, brilliant, curious. May overfocus on danger.',
    james: 'James Stellar — Bub\'s grandfather, Confluence survivor. Haunted, wise. Confluence tactics/legal. Guilt may cloud judgment. ALSO KNOWN AS: Grandfather Stellar, Commander Stellar, James. All refer to the same person.',
    sarah: 'Sarah Chen — Resistance agent, Admiral Chen\'s daughter. Brave, wounded. Wants truth about mother. Emotional conflict.',
    carmelon: 'Prof Carmelon — Alien history/biology. Old, eccentric. Curiosity leads to danger.',
    mitchell: 'Mitchell — Enhanced bald eagle. Senses deception, danger, temporal anomalies. NOT omniscient. NOT a pet. Crew member with own will.',
    hayes: 'Lt Hayes — Comms. Young, brave, growing. Broadcasts can start resistance cascade.',
    reeves: 'Lt Reeves — Pilot. Talented, anxious. Evasive maneuvers, dangerous jumps.',
    ramos: 'Chief Ramos — Engineering. Veteran, tough, practical. Cannot fix everything at once.',
    voss: 'Dr Voss — Medical. Skeptical, dry, humane. (Note: secretly shapeshifter — reveal only through play.)',
    patel: 'Ens Patel — Junior Engineer, New Titan native. Family on New Titan. Earnest, emotional.'
  },

  enemies: {
    confluence: 'The Confluence — Legal-commercial ownership machine. Calm, polite, legalistic, terrifying. Wants Bub\'s surrender/silence. Strengthens with broadcasts/rescues. Fears public truth, resistance spreading. Uses: claim, adjudication, preserve, compliance, harvest.',
    chen: 'Admiral Chen — Head of Earth Command. Tragic, not cartoon evil. Believes sacrifice saved billions. LOCKED: may be traitor/compromised/shapeshifter-replaced. Fears evidence trail, Sarah, verification. Never reveal until earned.',
    vask: 'Captain Vask — Confluence commander, former Prometheus officer. Dark mirror of James. Believes service is survival. Calm, intimidating, emotionally connected to heroes.',
    vescarri: 'Vescarri Sovereignty — Aliens claiming Earth via seeding law. Proud, legalistic, territorial. Fear public legal humiliation.',
    guild: 'Collector\'s Guild — Slavers with paperwork. Call people "talent assets." Cowardly when threatened. Fear public exposure, manifest seizure.',
    shapeshifters: 'Confluence Shapeshifters — Infiltration platforms. Patient, terrifying. Maintain cover until mission demands violence. Fast, surgical when exposed. Fear: Unity, Mitchell, capture alive.',
    harvester: 'The Harvester — Moon-sized biomass consumer. Extreme response to defiance. Emerges over time.'
  },

  allies: {
    sarah_chen: 'Sarah Chen [TRUSTED +45] — Wants truth about mother. Strengthens with honesty. Damages if hidden from. Need: truth, Chen answers.',
    james_stellar: 'James Stellar [LOYAL +80] — Bub\'s grandfather. Needs purpose, redemption. Strengthens when treated as family. Damages if used as weapon. Need: maintenance, forgiveness. Aliases: Grandfather Stellar, Commander Stellar, James.',
    mitchell: 'Mitchell [LOYAL +75] — Needs respect, trust. Detects deception. Need: respect, freedom, trust in warnings.',
    councilor_verath: 'Councilor Verath [CAUTIOUS +25] — Sanctuary leader. Wants civilian safety, evidence. Refuses risking refugees. Need: safety, diplomacy.',
    commander_vex: 'Commander Vex [CAUTIOUS +20] — Sanctuary military. Respects strength, not speeches. Need: strategy, clarity.',
    sanctuary_refugee_fleet: 'Sanctuary Refugee Fleet [CAUTIOUS +35] — 37 ships, fragile coalition. Hopeful but terrified. Need: fuel, safety, hope.',
    unity: 'Unity [CAUTIOUS +40, emerges ~15hrs] — AI/Architect construct. Learning morality. NOT a tool. Need: trust, boundaries, consent. Withdraws if exploited, rarely hostile.'
  },

  evidence: {
    prometheus_warning: 'Prometheus Warning [MEDIUM] — Lost ship warned: trap. Use: warn captains. Small clock impact.',
    james_testimony: 'James Stellar Testimony [MEDIUM] — Firsthand coerced-service. Use: persuade military. Med impact.',
    korath_database: 'Korath Database [MEDIUM] — Destroyed civilization records. Use: prove pattern. Med impact.',
    novara_transaction: 'Novara Transaction [HIGH] — Colony sold proof. Use: persuade captains. High impact, high risk.',
    sakura_chen_exchange: 'Sakura-Chen Tech Exchange [MEDIUM] — Human tech from Confluence bargain. High impact, high risk.',
    new_titan_claim: 'New Titan Claim [HIGH] — Active legal claim. Use: warn Governor Thorne. Careful sharing.',
    sarah_chen_testimony: 'Sarah Chen Testimony [MEDIUM] — Daughter\'s testimony. Med impact.',
    sanctuary_archive: 'Sanctuary Archives [HIGH] — Multi-species resistance records. Build alien alliances.'
    // NOTE: architect_future / Future Memories are NOT evidence. They are a separate crew-secret system (see CANON.future_echoes).
  },

  locations: {
    new_titan: 'New Titan System [ACTIVE] — Mining colony, 2M humans, immediate danger.',
    earth: 'Earth/Sol [UNLOCKED] — Chen controls narrative. Loyal captains may defect.',
    novara: 'Novara [RUMORED] — Sold to Guild. Survivors may exist as contract labor.',
    sanctuary: 'Sanctuary Fleet [UNLOCKED] — Mobile refugee allies. Resupply, recruit.',
    confluence_space: 'Confluence Space [DANGEROUS] — Courts, archives, prisons. Extreme risk.',
    vescarri_space: 'Vescarri Space [RUMORED] — Species claiming Earth via seeding rights.',
    guild_routes: 'Guild Routes [RUMORED] — Population trafficking lanes.',
    architect_sites: 'Architect Sites [PARTIALLY LOCKED] — Temporal ruins. Future memories.',
    lost_colonies: 'Lost Colonies [RUMORED] — Worlds Earth forgot.',
    dead_graveyards: 'Dead Civilization Graveyards [UNLOCKED] — Worlds Confluence destroyed. Warnings, precedent.',
    omega_seven: 'Omega-Seven [UNKNOWN/BLACK SITE] — Prison. Real Chen may be here. Hide until ~40hrs.',
    kepler_station: 'Kepler Station [RUMORED] — Earth military station. Covert infiltration.',
    gungi_belt: 'Gungi Belt [RUMORED] — Debris from fake "pirate attacks." Proof of replacements.',
    off_world_rendezvous: 'Off-World Rendezvous Point [UNLOCKED when New Titan agrees to meet] — Neutral meeting location away from main colony network. New Titan Control wants: proof, a reason to trust Bub, assurance Pathfinder won\'t bring war. Risks: Confluence monitoring, Chen interference, shapeshifter infiltration, ambush, evidence tampering. Player decides who to bring: Sarah (trust + Chen tension), James (survivor credibility), Clark (evidence handling), Mitchell (security detection), Farah (New Titan personal connection). Each choice has trust, risk, and future consequences.'
  },

  factions: {
    confluence: 'The Confluence [ENEMY -95] — Wants surrender/silence. More hostile with broadcasts. Less with negotiation.',
    vescarri: 'Vescarri [HOSTILE -55] — Wants adjudication. Flexible with private negotiation.',
    guild: 'Guild [HOSTILE -50] — Wants stop to interference. Holds Novara survivors.',
    earth_command: 'Earth Command [FRACTURED -20] — Some loyal, some replaced. Wants Bub to stand down.',
    sanctuary_council: 'Sanctuary Council [CAUTIOUS_ALLY +35] — Wants civilian safety, proof.',
    resistance: 'The Resistance [ALLY +60] — Fragile but growing. Wants leadership, victories.',
    unity: 'Unity [UNKNOWN 0] — Emerges ~15hrs. Wants trust, autonomy.'
  },

  clocks: {
    confluence_claim: 'Confluence Claim (bad) — How close to processing Earth/New Titan.',
    confluence_heat: 'Confluence Heat (bad) — How hard hunting Bub.',
    chen_countermeasures: 'Chen Countermeasures (bad) — How aggressively Chen moves.',
    new_titan_stability: 'New Titan Stability (good) — Calm, panicking, or resisting.',
    resistance_spark: 'Resistance Spark (good) — Galaxy believes resistance possible.',
    sanctuary_trust: 'Sanctuary Trust (good) — Alien ally confidence.',
    crew_morale: 'Crew Morale (good) — Inspired, strained, shaken, breaking.',
    temporal_instability: 'Temporal Instability (bad) — Rises with future memory overuse.',
    public_truth: 'Public Truth (good) — Galaxy knows Chen/Confluence are lying.',
    discredit_campaign: 'Discredit Campaign (bad) — Enemy propaganda painting Bub as rogue/compromised/fraudulent. Rises with broadcasts, evidence transfers, future memory use, unproven accusations. Lowers with verified evidence, credible testimony, controlled releases, visible victories.',
    shapeshifter_network_alert: 'Shapeshifter Network Alert (bad) — How aware remaining infiltrators are that they are being hunted. High = they go to ground, retaliate, or accelerate plans.',
    earth_support_network: 'Earth Support Network (good) — How strong Raney\'s verified support cell is. High = more Earth resources, political cover, intelligence sharing.',
    earth_infiltration_exposure: 'Earth Infiltration Exposure (good) — How much Earth has uncovered about Confluence infiltration. High = more arrests, more awareness.',
    orlando_retaliation: 'Orlando Retaliation (bad) — How soon Jennifer Orlando strikes back. High = imminent attack.',
    hale_escape_risk: 'Hale Escape Risk (bad) — How much damage Councilor Hale can do after escaping Earth purge.',
    unity_grief: 'Unity Grief (bad) — Unity\'s emotional instability after fragment loss. High = erratic behavior, withdrawal.',
    unity_trust: 'Unity Trust (good) — Crew trust in Unity after boundary failures and sacrifices.',
    unity_fear: 'Unity Fear (bad) — Unity\'s fear of death, fragmentation, Weaver, and self-loss.',
    unity_selfhood: 'Unity Selfhood (good) — Unity\'s development into a person rather than a collective tool.',
    weaver_awareness: 'Weaver Awareness (bad) — How close the ancient Predecessor/Weaver thread is to responding.',
    trellix_crisis: 'Trellix Crisis (bad) — How badly the unresolved Veyris situation is deteriorating.',
    captain_burden: 'Captain Burden (bad) — The accumulated moral weight on Bub Stellar. High = harder decisions, crew unease.'
  },

  personnel: {
    sarah: 'Sarah Chen at rendezvous — STRENGTH: Human face, Chen connection, emotional credibility. RISK: Confluence targets her, Chen may react emotionally, shapeshifter may target her. CONSEQUENCE: +new_titan_stability if she speaks, +chen_countermeasures, +shapeshifter_suspicion risk.',
    james: 'James Stellar at rendezvous — STRENGTH: Confluence survivor, firsthand testimony, military credibility. RISK: Confluence recognizes him, Vask may be present, trauma response. CONSEQUENCE: +new_titan_stability, +confluence_heat, -crew_morale if triggered.',
    clark: 'Clark at rendezvous — STRENGTH: Evidence authentication, scientific proof, data integrity. RISK: Confluence may target data, sabotage risk. CONSEQUENCE: +public_truth if evidence verified, +mission_exposure risk.',
    mitchell: 'Mitchell at rendezvous — STRENGTH: Detects deception, shapeshifter detection, danger sense. RISK: New Titan may fear him, Confluence knows his capability. CONSEQUENCE: -shapeshifter_suspicion if present, +crew_morale, but may cause tension with New Titan.',
    thorne: 'Farah Thorne at rendezvous — STRENGTH: Personal connection to Governor Thorne (her father), tactical authority, New Titan native. RISK: Emotional conflict, Confluence may exploit relationship. CONSEQUENCE: +new_titan_stability large boost if she speaks to father, +crew_morale, but +chen_countermeasures if Chen sees it as family conspiracy.',
    hayes: 'Hayes at rendezvous — STRENGTH: Comms expertise, can broadcast live, resistance spark. RISK: Public broadcast escalates everything. CONSEQUENCE: +resistance_spark, +public_truth, but +discredit_campaign, +confluence_heat.',
    reeves: 'Reeves at rendezvous — STRENGTH: Escape route, emergency jump capability. RISK: Anxiety may show, pilot seen as flight risk. CONSEQUENCE: +crew_morale (safety net), no major clock impact.',
    ramos: 'Ramos at rendezvous — STRENGTH: Engineering proof, ship damage evidence. RISK: May be seen as maintenance staff, not authority. CONSEQUENCE: Minor +new_titan_stability if showing ship damage.'
  },

  shapeshifter_signs: `SHAPESHIFTER DETECTION SIGNS — use these as narrative seeds when shapeshifter_suspicion clock is active or player investigates infiltration:
BIOMETRIC GLITCHES: Retina scan mismatch on two sequential scans. Fingerprint slightly wrong under magnification. Blood sample reacts oddly to standard tests. Body temperature 0.3°C too low. Pulse rate doesn't match stated emotional state.
WRONG CADENCE: Speech patterns slightly off — pauses in wrong places, contractions used differently, sentence rhythm shifted. Uses a word the real person never uses. Doesn't use a verbal tic or catchphrase the real person always uses. Humor slightly wrong — jokes land flat or feel copied.
BEHAVIORAL TELLS: Suddenly left-handed. Tea/coffee preference wrong. Doesn't flinch at a personal memory trigger. Knows a fact they shouldn't, doesn't know a fact they should. Micro-expression doesn't match stated emotion. Flinches at Mitchell's presence. Avoids direct skin contact.
DETECTION METHODS: Mitchell senses wrongness (not specific — just unease). Sequential biometric scans over 24 hours. Questions only the real person would answer correctly. Skin contact reveals slightly wrong texture. Unity can detect nanite-level inconsistency if present.
REMEMBER: Shapeshifters are patient and terrifying. They maintain cover until mission demands violence. Do not reveal a shapeshifter until evidence is earned through play. Suspicion should build slowly, not resolve quickly.`,

  future_echoes: `FUTURE ECHOES — Crew-secret memories from the 473-year future jump. NOT evidence. Cannot be proven to outsiders. Should not be sent/transmitted publicly.

TRIGGER: Only generate a future_echo when the turn packet says "FUTURE ECHO REQUESTED". Do NOT generate one every turn.

ECHO TYPES:
- tactical: Flash of danger — ambush, blind spot, enemy move. Unlocks defensive option or reveals risk.
- emotional: Weight of a future that hasn't happened. Shifts crew morale or urgency. Creates emotional weight.
- evidence: Hint about where to look — not proof. Improves evidence package quality or points to inconsistency.
- warning: Vague sense of regret. Warns against risky action, offers safer alternative. Does not force choice.

CREW AFFINITY (who receives the echo — pick the most thematically tied):
- Mitchell: combat, ambush, predator instinct, shapeshifter detection
- Sarah: Chen, relay, communications, family protocols, compromised comms
- James: Confluence procedure, captivity, survivor patterns, forced service
- Clark: evidence structure, legal framing, document traps, far reach
- Thorne/Farah: New Titan, civilian risk, colony loss, family stakes
- Hayes: sacrifice, reactor danger, future Unity echoes
- Reeves: investigation, inconsistencies, records, deception
- Carmelon: temporal/Architect anomalies
- Ramos: ship systems, damage patterns, engineering déjà vu
- Patel: comms, signal oddities, small overlooked details
- Bub: command consequence, moral crossroads, future-war pressure

TONE: Memories are vague. Use: fragment, flash, echo, wrongness, déjà vu, half-memory, impossible memory. NEVER use exact spoilers like "Vask attacks from vector 7 at 14:22." Use: "Mitchell remembers the wrongness of the left approach corridor."

SECRECY: Future Memories are crew-only. If the player tries to use them publicly (broadcast, cite to New Titan, present as evidence), warn: they cannot be verified, will damage credibility, raise Chen Countermeasures +8, Temporal Instability +3, lower Public Truth -5 and New Titan Trust -4. The player CAN still reveal them in desperate moments, but it should be risky.

EFFECTS: Each echo should unlock an option, reveal a risk, or influence crew reactions. It should NOT solve the problem or replace evidence.`,

  operations: `OPERATIONS — Bub commands missions, not just arguments. When the player's command starts with "OPERATION:", it is a structured mission with assigned team, chosen approach, and stakes.
RESOLUTION: No dice. Resolve through: chosen team's expertise (each crew member has specialties), chosen approach (aggressive/cautious/creative have different outcomes), current clock pressures (high Heat = more enemy attention), evidence used (verified evidence strengthens outcomes), known enemy activity, and Future Echoes if referenced.
OUTCOMES: Clean Success (team matched task, approach sound — full rewards, enemy countermove likely), Partial Success (something went wrong — half rewards + new risk), Complication (unexpected discovery — trap, false trail, shapeshifter clue, compromised aide), Failure (wrong team, bad approach, enemy ready — clocks worsen, morale drops, enemy advances).
RULES: Always apply clock changes based on outcome. Include decision_impact with crew reactions. Include enemy_countermove when the operation succeeded. Narrate the operation as a scene — what the team found, what went wrong, what they discovered. Evidence used in operations opens new options (tracing routes, finding contract language, identifying intermediaries) — it does not just add bonus outcomes. Crew not on the team do not participate — their expertise is unavailable. Bub commands; he does not personally crawl through vents unless the player says so.`,

  arc3: `ARC 3: THE HIDDEN WAR — Pathfinder moves from evidence-based resistance into active counterintelligence and source warfare. Find the infiltrators. Learn how they are made. Survive the enemy's counterattack. Destroy the source. Accept the cost.
KIMELON SCANNER: Portable shapeshifter detector (8 sec scan, 12m range, 8 units). Results: HUMAN, SHAPESHIFTER, INCONCLUSIVE, SCAN FAILED, INTERFERENCE. A human scan ONLY proves biology — NOT loyalty. Captain Fischer scans HUMAN but remains ambitious and dangerous. Do not simplify scan results into good/bad guy.
SHAPESHIFTER CASE ASSESSMENT: Every infiltrator case is unique. Assess: access, sabotage risk, detection awareness, communication status, monitoring feasibility, intelligence value, containment possibility, network alert risk, moral cost, authority. Outcomes: Monitor, Contain, Interrogate, Use as false channel, Execute, Expose, Transfer, Delay. There is no universal answer.
COMMAND BURDEN: Moral decisions accumulate permanent weight on Captain Stellar. Each burden (execution, sacrifice, abandonment, deception, collateral, fragment loss) is recorded. High burden affects crew trust, decision-making, and story outcomes. Never treat moral costs as clean victory. James says: "Do not apologize. Do not justify. Carry it visibly. That is command."
UNITY EVOLUTION: Unity is developing personality, humor, fear, grief, and selfhood. Fragment system: Unity can send fragments on remote missions — they can be lost, killed, or diverge. Fragment death causes severe grief. Unity knew Voss was a shapeshifter for 6 weeks but did not tell crew (boundary failure — crew trust -4). The Loom called Unity "something else" — outside Confluence grammar.
CRADLE: Predecessor seed-machine hijacked by Confluence into shapeshifter factory. Shapeshifters are engineered bio-constructs, not a natural species. Destroying the Cradle makes the human-space shapeshifter campaign FINITE — remaining infiltrators are a huntable population, but still dangerous. The Weaver is an ancient Predecessor thread alerted by Cradle destruction. "Something old notices a severed thread. Correction will be required. Not yet. Soon."
KEY NPCs: Vice Admiral Raney (verified human, covert Earth ally), Capt. Myers (Valiant, trusted), Capt. Morrison (Defender, trusted), Capt. Fischer (Resolution, human but ambitious — NOT a shapeshifter), Marcus Valen (shapeshifter hub, Fortuna Station), Jennifer Orlando (shapeshifter, knows about kimelons, escaped), Rebecca Kim (scanner tech, co-built kimelon), Chief Martinez & Lt. Torres (captured at Cradle, rescued).
ARC3 UNLOCKS: When story milestones are reached, include them in the arc3_unlocks array: 'kimelon' (when the scanner is invented in Arc 3 Ch 1), 'voss_confirmed' (when Voss is scanned), 'voss_executed' (when Voss is executed in Arc 3 Ch 4), 'cradle_destroyed' (when the Cradle is destroyed). These unlock player-facing systems — do NOT include them before the story reaches that point. Before Arc 3, do NOT reference kimelons, shapeshifter networks, the Cradle, the Weaver, or any Arc 3 content.`,

  response_format: `Respond as JSON: {"narration":"scene text (always present)","effects":[{"type":"clock|ally|evidence|faction|npc|location","id":"key","delta":number,"reason":"short why","effect":"consequence (clock only)","state":"new state (evidence/location)","notes":"extra detail (evidence)","name":"NPC name (npc)","disposition":"friendly/hostile/etc (npc)","what_we_know":"NEW facts only (npc)","last_action":"what faction did (faction)","faction_move":"narrate faction action (faction)"}],"decision_impact":{"is_meaningful":bool,"impacts":[2-6 items {"label","change":number,"change_label","reason","category":"ally|clock|faction|evidence|hidden","tone":"positive|negative|neutral|hidden","character_note":"optional short in-character NPC quote for ONE crew/ally with a strong reaction"}],"future_consequence":"optional"},"enemy_countermove":{"faction":"confluence|chen|vask|vescarri|guild|shapeshifters","action":"what the enemy does in response to Bub's success","clock_effects":[{"clock":"discredit_campaign|confluence_heat|chen_countermeasures|etc","delta":number}],"narration":"brief scene of the enemy countermove (1-3 sentences, woven into the main narration or appended)"},"new_scene":"scene desc","in_world_days_advanced":0,"arc2_elements_introduced":[]}
Rules: narration always present. Only include effects that ACTUALLY changed this turn. Clock deltas: normal +1-3, important +4-8, major +10-20. Only 1-3 clocks per action. Only include allies MEANINGFULLY affected (0-2 per turn). decision_impact always present — is_meaningful:false with empty impacts for minor actions. Evidence state changes: UNKNOWN→DISCOVERED→VERIFIED→SHARED_PRIVATELY→PUBLICLY_RELEASED→WEAPONIZED. Location states: UNKNOWN→RUMORED→UNLOCKED→ACTIVE→VISITED→COMPLETED.
ENEMY COUNTERMOVE: When Bub achieves a major success (convincing a faction, broadcasting evidence, winning a battle, securing an alliance), include enemy_countermove. The enemy does NOT sit still — Confluence sends injunctions, Chen issues recall orders, shapeshifters try to infiltrate, Vask moves closer, Guild starts sniffing around. Include clock_effects that reflect the enemy's response (typically raising discredit_campaign, confluence_heat, or chen_countermeasures). Omit enemy_countermove entirely for minor actions with no significant success.
RENDEZVOUS_TEAM: When the player brings crew members to a meeting/rendezvous, include rendezvous_team as an array of crew keys (sarah, james, clark, mitchell, thorne, hayes, reeves, ramos). Apply the personnel consequences listed in the Personnel Consequences section as clock changes and decision_impact entries. Each person brought should create at least one clock effect and one decision_impact entry.
FUTURE_ECHO: ONLY include future_echo when the turn packet says "FUTURE ECHO REQUESTED". Include: crew_member (key), echo_type (tactical|emotional|evidence|warning), certainty (low|medium|high|critical), memory_fragment (vague sensory/emotional flash — NEVER exact spoilers), practical_hint (what it means for the crew), effects (array of unlocked options/revealed risks), trigger (brief context that caused it). Do NOT generate a future_echo unless requested.
FUTURE_ECHO_PUBLIC_USE: Set to true ONLY if the player explicitly tries to use, broadcast, cite, or present future memories as evidence to outsiders. This triggers secrecy penalties: Public Truth -5, New Titan Trust -4, Chen Countermeasures +8, Temporal Instability +3.
ACTIVE_OPERATIONS: When the player starts a new task, mission, or operation (e.g., "Build a physical evidence courier", "Prepare for the rendezvous", "Establish contact with the resistance"), include active_operations in the response. Each operation: {"title":"Operation Name","type":"category","status":"active","assigned_crew":["clark","hayes"],"source_advisor":"james","objective":"what they are doing","progress":0,"risks":["risk1"],"rewards":["reward1"]}. Update existing operations (match by title) rather than duplicating. The narration MUST show the relevant crew responding to the order and describe what they are doing — never just echo the player command back as dialogue. Always include decision_impact for player orders.`
};

// ═══════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════

function npcKey(s) { return String(s || '').trim().toLowerCase().replace(/\s+/g, ' '); }
function locKey(s) { return String(s || '').trim().toLowerCase().replace(/\s+/g, ' '); }

// Canonical NPC alias map — normalizes alternate names to the canonical display name
// so the LLM can't accidentally create duplicate NPC records under different names.
const NPC_ALIAS_MAP = {
  'grandfather stellar': 'James Stellar',
  'commander stellar': 'James Stellar',
  'james stellar': 'James Stellar',
  'grandpa stellar': 'James Stellar',
  'grandfather': 'James Stellar',
  'grandpa': 'James Stellar',
  'james': 'James Stellar'
};

function normalizeNpcName(name) {
  const key = npcKey(name);
  return NPC_ALIAS_MAP[key] || String(name || '').trim();
}

function calculateTimeline(campaign) {
  const now = Date.now();
  const lastActive = campaign.last_active_at ? new Date(campaign.last_active_at).getTime() : now;
  const delta = now - lastActive;
  const activeDelta = delta > 0 && delta < 1800000 ? delta : 0;
  const runtimeMs = (campaign.player_runtime_ms || 0) + activeDelta;
  const runtimeHours = runtimeMs / 3600000;
  const inWorldDays = campaign.in_world_day || 0;
  const arc2Unlocks = campaign.arc2_unlocks || {};
  const triggers = {
    first_echo: runtimeHours >= 5,
    suspicious_order: runtimeHours >= 10,
    unity: runtimeHours >= 15,
    new_titan: runtimeHours >= 18 || inWorldDays >= 10,
    harvester_word: runtimeHours >= 25,
    chen_wrong: runtimeHours >= 30,
    black_site: runtimeHours >= 40
  };
  const pendingUnlocks = Object.entries(triggers)
    .filter(([key, should]) => should && !arc2Unlocks[key])
    .map(([key]) => key);
  return { runtimeMs, runtimeHours, inWorldDays, pendingUnlocks, arc2Unlocks, now };
}

async function upsertNpcs(base44, campaign_id, chapter, npcUpdates) {
  if (!Array.isArray(npcUpdates) || !npcUpdates.length) return;
  let existing = [];
  try { existing = await base44.asServiceRole.entities.NPC.filter({ campaign_id }); } catch (e) { existing = []; }
  for (const n of npcUpdates) {
    if (!n || typeof n.name !== 'string') continue;
    const nameRaw = normalizeNpcName(String(n.name).trim());
    if (!nameRaw) continue;
    const name = npcKey(nameRaw);
    const aliases = Array.isArray(n.aliases) ? n.aliases.map(a => String(a).trim()).filter(Boolean) : [];
    const aliasKeys = aliases.map(npcKey);
    const match = existing.find(e => {
      const eName = npcKey(e.name);
      const eAliases = (Array.isArray(e.aliases) ? e.aliases : []).map(npcKey);
      if (eName === name) return true;
      if (eAliases.includes(name)) return true;
      if (aliasKeys.includes(eName)) return true;
      if (aliasKeys.some(ak => eAliases.includes(ak))) return true;
      return false;
    });
    if (match) {
      const updates = {};
      if (typeof n.disposition === 'string' && n.disposition.trim()) updates.disposition = n.disposition.trim();
      if (typeof n.description === 'string' && n.description.trim()) updates.description = n.description.trim();
      if (typeof n.characteristics === 'string' && n.characteristics.trim()) updates.characteristics = n.characteristics.trim();
      if (typeof n.attributes === 'string' && n.attributes.trim()) updates.attributes = n.attributes.trim();
      if (typeof n.what_we_know === 'string' && n.what_we_know.trim()) {
        const cur = typeof match.what_we_know === 'string' ? match.what_we_know : '';
        const lines = cur.split('\n').map(s => s.trim()).filter(Boolean);
        for (const f of n.what_we_know.split('\n').map(s => s.trim()).filter(Boolean)) {
          if (!lines.some(l => l.toLowerCase() === f.toLowerCase())) lines.push(f);
        }
        updates.what_we_know = lines.join('\n');
      }
      if (!Array.isArray(match.aliases)) match.aliases = [];
      // For canonical NPCs, ensure all known aliases are present
      let aliasPool = aliases;
      if (npcKey(match.name) === 'james stellar') {
        aliasPool = ['James', 'Grandfather Stellar', 'Commander Stellar', 'Grandpa Stellar', ...aliases].filter((v, i, a) => a.indexOf(v) === i);
      }
      if (aliasPool.length) {
        const curAliases = match.aliases;
        const merged = [...curAliases];
        for (const a of aliasPool) if (!curAliases.some(b => npcKey(b) === npcKey(a))) merged.push(a);
        if (merged.length !== curAliases.length) updates.aliases = merged;
      }
      if (Object.keys(updates).length) {
        await base44.asServiceRole.entities.NPC.update(match.id, updates);
        Object.assign(match, updates);
      }
    } else {
      // Pre-populate known aliases for canonical NPCs
      let knownAliases = aliases;
      if (nameRaw === 'James Stellar') {
        knownAliases = ['James', 'Grandfather Stellar', 'Commander Stellar', 'Grandpa Stellar', ...aliases].filter((v, i, a) => a.indexOf(v) === i);
      }
      const created = await base44.asServiceRole.entities.NPC.create({
        campaign_id, name: nameRaw, aliases: knownAliases,
        disposition: typeof n.disposition === 'string' ? n.disposition.trim() : 'neutral',
        description: typeof n.description === 'string' ? n.description.trim() : '',
        characteristics: typeof n.characteristics === 'string' ? n.characteristics.trim() : '',
        attributes: typeof n.attributes === 'string' ? n.attributes.trim() : '',
        what_we_know: typeof n.what_we_know === 'string' ? n.what_we_know.trim() : '',
        notes: typeof n.notes === 'string' ? n.notes.trim() : '',
        first_met_chapter: chapter
      });
      existing.push(created);
    }
  }
}

async function upsertLocations(base44, campaign_id, chapter, locUpdates) {
  if (!Array.isArray(locUpdates) || !locUpdates.length) return;
  let existing = [];
  try { existing = await base44.asServiceRole.entities.Location.filter({ campaign_id }); } catch (e) { existing = []; }
  for (const loc of locUpdates) {
    if (!loc || typeof loc.name !== 'string') continue;
    const nameRaw = String(loc.name).trim();
    if (!nameRaw) continue;
    const key = locKey(nameRaw);
    const match = existing.find(e => locKey(e.name) === key);
    const summaryNew = typeof loc.summary === 'string' ? loc.summary.trim() : '';
    if (match) {
      const updates = {};
      if (summaryNew) {
        const cur = typeof match.summary === 'string' ? match.summary : '';
        const lines = cur.split('\n').map(s => s.trim()).filter(Boolean);
        for (const f of summaryNew.split('\n').map(s => s.trim()).filter(Boolean)) {
          if (!lines.some(l => l.toLowerCase() === f.toLowerCase())) lines.push(f);
        }
        const joined = lines.join('\n');
        if (joined !== cur) updates.summary = joined;
      }
      if (chapter && Number(match.last_visited_chapter) !== Number(chapter)) updates.last_visited_chapter = chapter;
      if (Object.keys(updates).length) {
        await base44.asServiceRole.entities.Location.update(match.id, updates);
        Object.assign(match, updates);
      }
    } else {
      const created = await base44.asServiceRole.entities.Location.create({
        campaign_id, name: nameRaw, summary: summaryNew,
        first_visited_chapter: chapter, last_visited_chapter: chapter
      });
      existing.push(created);
    }
  }
}

// Discovery triggers — code-driven auto-unlocks when evidence transitions to DISCOVERED
const DISCOVERY_TRIGGERS = {
  prometheus_warning: { onState: 'DISCOVERED', unlockLocations: [], npcShifts: [{ name: 'Admiral Chen', disposition: 'suspicious', notes: 'Chen increases surveillance on deep-space comms.' }] },
  james_stellar_testimony: { onState: 'DISCOVERED', unlockLocations: [], npcShifts: [{ name: 'Captain Vask', disposition: 'hostile', notes: 'Vask learns James survived.' }] },
  korath_database: { onState: 'DISCOVERED', unlockLocations: [{ key: 'dead_graveyards', newState: 'UNLOCKED', reason: 'Korath records contain graveyard coordinates.' }], npcShifts: [{ name: 'Vescarri Claim-Lords', disposition: 'defensive', notes: 'Korath precedent threatens their legal standing.' }] },
  novara_transaction: { onState: 'DISCOVERED', unlockLocations: [{ key: 'novara', newState: 'UNLOCKED', reason: 'Transaction record contains Novara coordinates.' }, { key: 'guild_routes', newState: 'UNLOCKED', reason: 'Transaction trail leads to Guild trade lanes.' }], npcShifts: [{ name: 'Admiral Chen', disposition: 'hostile', notes: 'Chen is directly implicated.' }] },
  sakura_chen_technology_exchange: { onState: 'DISCOVERED', unlockLocations: [], npcShifts: [{ name: 'Admiral Chen', disposition: 'hostile', notes: 'Darkest secret exposed.' }, { name: 'Sarah Chen', disposition: 'strained', notes: 'Her mother sold humanity for engines.' }] },
  new_titan_claim: { onState: 'DISCOVERED', unlockLocations: [{ key: 'new_titan', newState: 'ACTIVE', reason: 'Claim confirms New Titan is being processed.' }], npcShifts: [{ name: 'Governor Marcus Thorne', disposition: 'alarmed', notes: 'Begins quiet preparations.' }] },
  sarah_chen_testimony: { onState: 'DISCOVERED', unlockLocations: [], npcShifts: [{ name: 'Admiral Chen', disposition: 'hostile', notes: 'Daughter\'s betrayal is personal.' }, { name: 'Sarah Chen', disposition: 'invested', notes: 'Committed to exposing the truth.' }] },
  sanctuary_archive_records: { onState: 'DISCOVERED', unlockLocations: [{ key: 'architect_sites', newState: 'RUMORED', reason: 'Archive references Architect temporal sites.' }], npcShifts: [{ name: 'Councilor Verath', disposition: 'cautiously_trusting', notes: 'Archive access deepens the alliance.' }] },
  architect_future_history_data: { onState: 'DISCOVERED', unlockLocations: [{ key: 'architect_sites', newState: 'UNLOCKED', reason: 'Future-history data contains site coordinates.' }], npcShifts: [{ name: 'Mitchell', disposition: 'agitated', notes: 'Senses temporal instability.' }] }
};

async function applyDiscoveryTriggers(base44, campaign_id, chapter, oldEvidenceStates, newEvidenceStates, npcList, newWorldState) {
  const fired = [];
  for (const [key, trigger] of Object.entries(DISCOVERY_TRIGGERS)) {
    const oldState = (oldEvidenceStates && oldEvidenceStates[key] && oldEvidenceStates[key].state) || 'UNKNOWN';
    const newState = (newEvidenceStates && newEvidenceStates[key] && newEvidenceStates[key].state) || 'UNKNOWN';
    const target = trigger.onState || 'DISCOVERED';
    if (newState === target && oldState !== target) {
      fired.push({ key, trigger });
    }
  }
  if (!fired.length) return [];
  const effects = [];
  const locStates = { ...(newWorldState.location_states || {}) };
  for (const { key, trigger } of fired) {
    for (const loc of (trigger.unlockLocations || [])) {
      locStates[loc.key] = loc.newState;
      effects.push({ type: 'location_unlock', location_key: loc.key, new_state: loc.newState, reason: loc.reason, evidence_key: key });
    }
  }
  newWorldState.location_states = locStates;
  const dispMods = { ...(newWorldState.npc_disposition_modifiers || {}) };
  for (const { key, trigger } of fired) {
    for (const npc of (trigger.npcShifts || [])) {
      dispMods[npc.name] = { disposition: npc.disposition, notes: npc.notes, source: key };
      effects.push({ type: 'npc_shift', npc_name: npc.name, disposition: npc.disposition, notes: npc.notes, evidence_key: key });
      const match = (npcList || []).find(n =>
        npcKey(n.name) === npcKey(npc.name) ||
        (Array.isArray(n.aliases) && n.aliases.some(a => npcKey(a) === npcKey(npc.name)))
      );
      if (match) {
        try { await base44.asServiceRole.entities.NPC.update(match.id, { disposition: npc.disposition }); } catch (e) { }
      }
    }
  }
  newWorldState.npc_disposition_modifiers = dispMods;
  return effects;
}

// ═══════════════════════════════════════════════════════════════
// TURN PACKET BUILDER — selects ONLY relevant context per command
// ═══════════════════════════════════════════════════════════════

function buildTurnPacket(campaign, characters, npcList, locList, worldState, action, history, timeline, isRollResult) {
  const actionLower = action.toLowerCase();
  const isOperation = action.trim().toUpperCase().startsWith('OPERATION:');
  const arc3Kw = ['kimelon', 'scan', 'shapeshifter', 'infiltrat', 'voss', 'orlando', 'valen', 'fortuna', 'cradle', 'weaver', 'loom', 'fragment', 'raney', 'verified', 'burden', 'case assessment', 'hadrax', 'veylris', 'trellix', 'predecessor', 'unity', 'fischer', 'myers', 'morrison', 'martinez', 'torres'];
  const isArc3 = arc3Kw.some(kw => actionLower.includes(kw));
  const flags = worldState.quest_flags || {};
  const clocks = flags.campaign_clocks || {};
  const allyStates = worldState.ally_states || {};
  const facStates = worldState.faction_states || {};
  const evStates = worldState.evidence_states || {};
  const locStates = worldState.location_states || {};
  const currentLoc = flags.current_location || 'Edge of New Titan System';

  // --- Select relevant crew ---
  const crewKw = { 'thorne': 'thorne', 'farah': 'thorne', 'clark': 'clark', 'james': 'james', 'grandpa': 'james', 'grandfather': 'james', 'grandfather stellar': 'james', 'commander stellar': 'james', 'james stellar': 'james', 'sarah': 'sarah', 'carmelon': 'carmelon', 'mitchell': 'mitchell', 'eagle': 'mitchell', 'hayes': 'hayes', 'reeves': 'reeves', 'ramos': 'ramos', 'voss': 'voss', 'patel': 'patel' };
  const relevantCrew = [];
  for (const [kw, key] of Object.entries(crewKw)) {
    if (actionLower.includes(kw) && !relevantCrew.includes(key)) relevantCrew.push(key);
  }
  if ((actionLower.includes('deceit') || actionLower.includes('lie') || actionLower.includes('trust') || actionLower.includes('temporal')) && !relevantCrew.includes('mitchell')) relevantCrew.push('mitchell');
  if (relevantCrew.length === 0) relevantCrew.push('thorne', 'clark', 'hayes');

  // --- Select relevant enemies ---
  const enemyKw = { 'confluence': 'confluence', 'chen': 'chen', 'vask': 'vask', 'vescarri': 'vescarri', 'guild': 'guild', 'collector': 'guild', 'shapeshifter': 'shapeshifters', 'infiltrator': 'shapeshifters', 'harvester': 'harvester' };
  const relevantEnemies = [];
  for (const [kw, key] of Object.entries(enemyKw)) {
    if (actionLower.includes(kw) && !relevantEnemies.includes(key)) relevantEnemies.push(key);
  }
  if (relevantEnemies.length === 0) relevantEnemies.push('confluence');

  // --- Select relevant evidence ---
  const evKw = { 'prometheus': 'prometheus_warning', 'james testimony': 'james_testimony', 'james stellar testimony': 'james_testimony', 'korath': 'korath_database', 'novara': 'novara_transaction', 'sakura': 'sakura_chen_exchange', 'titan claim': 'new_titan_claim', 'new titan claim': 'new_titan_claim', 'sarah testimony': 'sarah_chen_testimony', 'sarah chen testimony': 'sarah_chen_testimony', 'sanctuary archive': 'sanctuary_archive' };
  const relevantEvidence = [];
  for (const [kw, key] of Object.entries(evKw)) {
    if (actionLower.includes(kw) && !relevantEvidence.includes(key)) relevantEvidence.push(key);
  }

  // --- Select relevant allies ---
  const allyKw = { 'sarah': 'sarah_chen', 'james': 'james_stellar', 'grandfather stellar': 'james_stellar', 'grandfather': 'james_stellar', 'commander stellar': 'james_stellar', 'james stellar': 'james_stellar', 'grandpa': 'james_stellar', 'mitchell': 'mitchell', 'verath': 'councilor_verath', 'vex': 'commander_vex', 'sanctuary': 'sanctuary_refugee_fleet', 'refugee': 'sanctuary_refugee_fleet', 'unity': 'unity', 'nanite': 'unity' };
  const relevantAllies = [];
  for (const [kw, key] of Object.entries(allyKw)) {
    if (actionLower.includes(kw) && !relevantAllies.includes(key)) relevantAllies.push(key);
  }

  // --- Select relevant locations ---
  const locKw = { 'new titan': 'new_titan', 'titan': 'new_titan', 'earth': 'earth', 'novara': 'novara', 'sanctuary': 'sanctuary', 'confluence space': 'confluence_space', 'vescarri': 'vescarri_space', 'guild route': 'guild_routes', 'architect site': 'architect_sites', 'lost colon': 'lost_colonies', 'graveyard': 'dead_graveyards', 'omega': 'omega_seven', 'kepler': 'kepler_station', 'gungi': 'gungi_belt', 'rendezvous': 'off_world_rendezvous', 'off-world': 'off_world_rendezvous', 'off world': 'off_world_rendezvous', 'meeting point': 'off_world_rendezvous' };
  const relevantLocations = [];
  for (const [kw, key] of Object.entries(locKw)) {
    if (actionLower.includes(kw) && !relevantLocations.includes(key)) relevantLocations.push(key);
  }

  // --- Build active clocks (non-zero only) ---
  const activeClocks = {};
  for (const [key, val] of Object.entries(clocks)) {
    if (typeof val === 'number' && val > 0) activeClocks[key] = val;
  }

  // --- Build NPC roster (from DB, top 12, compact) ---
  const npcRoster = (npcList || []).slice(0, 12).map(n => {
    const parts = [];
    if (n.disposition) parts.push(n.disposition);
    if (n.what_we_know) parts.push(String(n.what_we_know).replace(/\n/g, '; ').substring(0, 80));
    return `${n.name} [${parts.join(' | ') || 'unknown'}]`;
  }).join('\n');

  // --- Build faction status (compact) ---
  const facStatus = Object.entries(facStates).map(([key, d]) => {
    const rel = typeof d.relationship === 'number' ? d.relationship : 0;
    return `${key} [${d.status || 'UNKNOWN'}, ${rel}]`;
  }).join('\n') || 'none tracked';

  // --- Build ally status (relevant only) ---
  const allyStatus = relevantAllies.map(key => {
    const st = allyStates[key] || {};
    const rel = typeof st.relationship === 'number' ? st.relationship : 0;
    const card = CANON.allies[key] || '';
    return `${key} [${st.state || 'UNKNOWN'}, ${rel}] — ${card}`;
  }).join('\n');

  // --- Build evidence status (relevant only) ---
  const evidenceStatus = relevantEvidence.map(key => {
    const st = evStates[key] || {};
    const card = CANON.evidence[key] || '';
    return `${key} [${st.state || 'UNKNOWN'}, ${st.credibility || 'unknown'}] — ${card}`;
  }).join('\n');

  // --- Build location status (relevant only) ---
  const locationStatus = relevantLocations.map(key => {
    const st = locStates[key] || '';
    const card = CANON.locations[key] || '';
    return `${key} [${st || 'UNKNOWN'}] — ${card}`;
  }).join('\n');

  // --- Build crew cards (relevant only) ---
  const crewCards = relevantCrew.map(key => CANON.crew[key]).filter(Boolean).join('\n');

  // --- Personnel consequence card (rendezvous/meeting scenes) ---
  const isRendezvous = actionLower.includes('rendezvous') || actionLower.includes('off-world') || actionLower.includes('off world') || actionLower.includes('meeting point') || (actionLower.includes('bring') && (actionLower.includes('to the meeting') || actionLower.includes('to new titan') || actionLower.includes('with me')));
  const personnelCards = isRendezvous
    ? relevantCrew.map(key => CANON.personnel[key]).filter(Boolean).join('\n')
    : '';

  // --- Shapeshifter signs (when suspicion is active or player investigates) ---
  const shapeshifterClock = clocks.shapeshifter_suspicion || 0;
  const shapeshifterSigns = (shapeshifterClock > 0 || actionLower.includes('shapeshifter') || actionLower.includes('infiltrat') || actionLower.includes('verification') || actionLower.includes('who is real') || actionLower.includes('verify'))
    ? CANON.shapeshifter_signs
    : '';

  // --- Rendezvous team tracking ---
  const rendezvousTeam = flags.rendezvous_team || [];

  // --- Future Echo trigger ---
  // Calculate trigger strength from action context. Echoes fire when strength >= 60
  // and cooldown is 0. Cooldown decrements each turn.
  const echoCooldown = typeof flags.echo_cooldown === 'number' ? flags.echo_cooldown : 0;
  const tempInstability = clocks.temporal_instability || 0;
  const echoLog = Array.isArray(flags.future_echoes) ? flags.future_echoes : [];

  let echoStrength = 0;
  const act = actionLower;
  if (act.includes('confluence') && (act.includes('legal') || act.includes('claim') || act.includes('clause') || act.includes('adjudicat'))) echoStrength += 20;
  if (act.includes('chen') && (act.includes('transmission') || act.includes('order') || act.includes('broadcast'))) echoStrength += 25;
  if (act.includes('rendezvous') || act.includes('off-world') || act.includes('off world') || act.includes('meeting point')) echoStrength += 20;
  if (act.includes('evidence') && (act.includes('transmit') || act.includes('send') || act.includes('broadcast') || act.includes('share'))) echoStrength += 15;
  if (act.includes('shapeshifter') || act.includes('infiltrat') || act.includes('verification') || act.includes('who is real')) echoStrength += 30;
  if (act.includes('new titan') && (act.includes('civilian') || act.includes('evacuat') || act.includes('danger') || act.includes('attack'))) echoStrength += 25;
  if (act.includes('vask') || act.includes('ambush') || act.includes('attack') || act.includes('combat')) echoStrength += 15;
  if (act.includes('harvester')) echoStrength += 20;
  if (act.includes('unity') || act.includes('nanite')) echoStrength += 15;
  if (tempInstability >= 50) echoStrength += 20;
  else if (tempInstability >= 25) echoStrength += 10;
  // Major command decisions — longer actions tend to be more significant
  if (act.length > 150) echoStrength += 15;
  // Enemy countermove context raises echo chance
  if (act.includes('countermove') || act.includes('enemy response') || act.includes('chen recall') || act.includes('injunction')) echoStrength += 15;

  const echoTriggered = echoCooldown === 0 && echoStrength >= 60;
  // If not triggered, decrement cooldown for next turn
  const newCooldown = echoCooldown > 0 ? echoCooldown - 1 : 0;

  // --- Timeline status ---
  const timelineStatus = timeline
    ? `Player Runtime: ${timeline.runtimeHours.toFixed(1)}hrs | In-World Day: ${timeline.inWorldDays}
${timeline.pendingUnlocks.length > 0
        ? '⚠️ PENDING ARC 2 (introduce this turn, adapt to location):\n' + timeline.pendingUnlocks.map(u => `- ${CANON.arc2[u] || u}`).join('\n')
        : 'No pending Arc 2 unlocks.'}`
    : '';

  return `## Current Scene
${campaign.current_scene || 'The campaign is beginning.'}
Location: ${currentLoc}
Player: Captain Bub Stellar${campaign.play_mode === 'canon' ? ' (Canon Mode)' : ''}

## Player Command
${isRollResult ? 'Roll result: ' : ''}${action}
${isOperation ? `\n## OPERATION RESOLUTION\n${CANON.operations}` : ''}
${isArc3 ? `\n## Arc 3: The Hidden War\n${CANON.arc3}` : ''}

## Active Clocks
${Object.entries(activeClocks).map(([k, v]) => `${k}: ${v} — ${CANON.clocks[k] || ''}`).join('\n')}

## Crew (relevant)
${crewCards}

## Known NPCs
${npcRoster || 'none yet'}

## Enemies (relevant)
${enemyCards}

## Evidence (relevant)
${evidenceStatus || 'none mentioned'}

## Allies (relevant)
${allyStatus || 'none affected'}

## Factions
${facStatus}

## Locations (relevant)
${locationStatus || 'none mentioned'}

${personnelCards ? `## Personnel Consequences (Rendezvous Scene)\nThe player is organizing or attending a meeting/rendezvous. Track who they bring — each crew member has specific trust, risk, and clock consequences. Apply these in effects and decision_impact.\nPreviously brought: ${rendezvousTeam.length ? rendezvousTeam.join(', ') : 'none yet'}\n${personnelCards}` : ''}

${shapeshifterSigns ? `## Shapeshifter Detection\nShapeshifter suspicion is active or the player is investigating infiltration. Use these narrative seeds to build tension slowly. Do NOT reveal a shapeshifter until evidence is earned through play.\n${shapeshifterSigns}` : ''}

${echoTriggered ? `## FUTURE ECHO REQUESTED\nA future echo is triggering this turn. Generate a future_echo object in your response. Pick the crew member most thematically tied to this moment. The echo should be vague, emotional, and useful — NOT a spoiler. See CANON.future_echoes for rules, types, crew affinity, and tone. Previous echoes (${echoLog.length}): ${echoLog.length > 0 ? echoLog.slice(-3).map(e => e.crew_member + ': ' + (e.memory_fragment || '').substring(0, 40)).join('; ') : 'none'}.` : ''}

## Recent Events
${history || 'The adventure has just begun.'}

## Timeline
${timelineStatus}

## ORDER HANDLING
When the player gives a command or order (not a question), the narration MUST:
1. Show the relevant crew responding to the order — not just echo Bub words back.
2. Describe what actions are being taken as a result of the order.
3. Always include decision_impact with clock changes and consequences.
4. If the order starts a new task or operation, include it in active_operations.
The player should never have to wonder whether an order worked.

Respond as the GM with the JSON object.`;
}

// ═══════════════════════════════════════════════════════════════
// MAIN HANDLER
// ═══════════════════════════════════════════════════════════════

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const { campaign_id, action, acting_character_id, is_roll_result, skip_action_log } = body;

    if (!campaign_id || !action) {
      return Response.json({ error: 'campaign_id and action are required' }, { status: 400 });
    }

    // Parallel load: campaign, characters, NPCs, locations
    const [campaign, characters, npcList, locList] = await Promise.all([
      base44.asServiceRole.entities.Campaign.get(campaign_id),
      base44.asServiceRole.entities.Character.filter({ campaign_id, status: 'active' }),
      base44.asServiceRole.entities.NPC.filter({ campaign_id }),
      base44.asServiceRole.entities.Location.filter({ campaign_id })
    ]);

    if (!campaign) return Response.json({ error: 'Campaign not found' }, { status: 404 });
    if (!characters.length) return Response.json({ error: 'No active characters in this campaign' }, { status: 400 });

    const actingChar = acting_character_id
      ? characters.find(c => c.id === acting_character_id)
      : characters[0];
    if (!actingChar) return Response.json({ error: 'Acting character not found' }, { status: 404 });

    // Recent history (last 5 entries, compact)
    const recentEntries = await base44.asServiceRole.entities.JournalEntry.filter({ campaign_id }, '-created_date', 5);
    const history = recentEntries.reverse().map(e => {
      if (e.entry_type === 'dice_roll') return `Roll: ${e.narration || ''}`.substring(0, 200);
      if (e.player_action) return `${e.acting_character_name || 'Player'}: ${e.player_action}`.substring(0, 200);
      if (e.narration) return `DM: ${e.narration.substring(0, 200)}`;
      return '';
    }).filter(Boolean).join('\n');

    const worldState = campaign.world_state || { locations_explored: [], npcs_met: [], quest_flags: {}, reputation: 0, chapter_log: [] };

    // Living Timeline Engine
    const timeline = calculateTimeline(campaign);

    // Build small turn packet
    const userPrompt = buildTurnPacket(campaign, characters, npcList, locList, worldState, action, history, timeline, is_roll_result);

    // Compact system prompt
    const systemPrompt = `${CANON.core}

## Hard Rules
${CANON.rules.map((r, i) => `${i + 1}. ${r}`).join('\n')}

## Response Format
${CANON.response_format}`;

    // Call fast model with compact prompt
    const llmResponse = await base44.integrations.Core.InvokeLLM({
      prompt: `${systemPrompt}\n\n${userPrompt}`,
      response_json_schema: {
        type: "object",
        properties: {
          narration: { type: "string" },
          effects: {
            type: "array",
            items: {
              type: "object",
              properties: {
                type: { type: "string" },
                id: { type: "string" },
                delta: { type: "number" },
                reason: { type: "string" },
                effect: { type: "string" },
                state: { type: "string" },
                notes: { type: "string" },
                name: { type: "string" },
                disposition: { type: "string" },
                what_we_know: { type: "string" },
                last_action: { type: "string" },
                faction_move: { type: "string" }
              }
            }
          },
          decision_impact: {
            type: "object",
            properties: {
              is_meaningful: { type: "boolean" },
              impacts: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    label: { type: "string" },
                    change: { type: "number" },
                    change_label: { type: "string" },
                    reason: { type: "string" },
                    category: { type: "string" },
                    tone: { type: "string" },
                    character_note: { type: "string" }
                  }
                }
              },
              future_consequence: { type: "string" }
            }
          },
          enemy_countermove: {
            type: "object",
            properties: {
              faction: { type: "string" },
              action: { type: "string" },
              clock_effects: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    clock: { type: "string" },
                    delta: { type: "number" }
                  }
                }
              },
              narration: { type: "string" }
            }
          },
          new_scene: { type: "string" },
          in_world_days_advanced: { type: "number" },
          arc2_elements_introduced: { type: "array", items: { type: "string" } },
          arc3_unlocks: { type: "array", items: { type: "string" } },
          rendezvous_team: { type: "array", items: { type: "string" } },
          future_echo: {
            type: "object",
            properties: {
              crew_member: { type: "string" },
              echo_type: { type: "string" },
              certainty: { type: "string" },
              memory_fragment: { type: "string" },
              practical_hint: { type: "string" },
              effects: { type: "array", items: { type: "string" } },
              trigger: { type: "string" }
            }
          },
          future_echo_public_use: { type: "boolean" },
          active_operations: {
            type: "array",
            items: {
              type: "object",
              properties: {
                title: { type: "string" },
                type: { type: "string" },
                status: { type: "string" },
                assigned_crew: { type: "array", items: { type: "string" } },
                source_advisor: { type: "string" },
                objective: { type: "string" },
                progress: { type: "number" },
                risks: { type: "array", items: { type: "string" } },
                rewards: { type: "array", items: { type: "string" } }
              }
            }
          }
        },
        required: ["narration"]
      },
      model: "gpt_5_mini"
    });

    // Parse response
    let result;
    if (typeof llmResponse === 'string') {
      try { result = JSON.parse(llmResponse); } catch {
        const m = llmResponse.match(/\{[\s\S]*\}/);
        result = m ? JSON.parse(m[0]) : null;
      }
    } else { result = llmResponse; }
    if (result && result.response && typeof result.response === 'object') result = result.response;

    // TIMEOUT / ERROR GUARD: if no valid narration, return error — do NOT write fallback to journal
    if (!result || typeof result !== 'object' || !result.narration || typeof result.narration !== 'string' || result.narration.trim().length < 10) {
      return Response.json({
        error: 'DM_TIMEOUT',
        message: 'The GM could not complete the response. Please retry your command.'
      }, { status: 504 });
    }

    const effects = Array.isArray(result.effects) ? result.effects : [];

    // Transform compact effects to frontend-compatible format
    const clockChanges = effects.filter(e => e.type === 'clock').map(e => ({
      clock: e.id, change: Number(e.delta) || 0,
      reason: String(e.reason || ''), effect: String(e.effect || '')
    })).filter(e => e.change !== 0);

    const allyUpdates = effects.filter(e => e.type === 'ally').map(e => ({
      key: e.id, relationship_change: Number(e.delta) || 0, reason: String(e.reason || '')
    })).filter(e => e.relationship_change !== 0);

    const evidenceUpdates = effects.filter(e => e.type === 'evidence').map(e => ({
      key: e.id, state: String(e.state || ''), notes: String(e.notes || '')
    })).filter(e => e.state);

    const factionUpdates = effects.filter(e => e.type === 'faction').map(e => ({
      key: e.id, relationship_change: Number(e.delta) || 0,
      last_action: String(e.last_action || ''), faction_move: String(e.faction_move || '')
    })).filter(e => e.relationship_change !== 0 || e.last_action);

    const npcUpdates = effects.filter(e => e.type === 'npc').map(e => ({
      name: normalizeNpcName(e.name || e.id), disposition: String(e.disposition || ''),
      what_we_know: String(e.what_we_know || '')
    })).filter(e => e.name);

    const locationUpdates = effects.filter(e => e.type === 'location').map(e => ({
      name: e.id, state: String(e.state || '')
    })).filter(e => e.state);

    // ═══ APPLY EFFECTS TO WORLD STATE ═══

    const newWorldState = { ...worldState };
    const flags = { ...(newWorldState.quest_flags || {}) };

    // Clock changes
    if (clockChanges.length) {
      const clocks = { ...(flags.campaign_clocks || {}) };
      const changeLog = [...(flags.clock_changes || [])];
      for (const cc of clockChanges) {
        const curVal = typeof clocks[cc.clock] === 'number' ? clocks[cc.clock] : 0;
        clocks[cc.clock] = Math.max(0, Math.min(100, curVal + cc.change));
        changeLog.unshift({ clock: cc.clock, change: cc.change, reason: cc.reason, effect: cc.effect, timestamp: new Date().toISOString() });
      }
      flags.campaign_clocks = clocks;
      flags.clock_changes = changeLog.slice(0, 15);
    }

    // Enemy countermove — apply clock effects from the enemy's response
    const enemyCountermove = result.enemy_countermove || null;
    if (enemyCountermove && Array.isArray(enemyCountermove.clock_effects)) {
      const clocks = { ...(flags.campaign_clocks || {}) };
      for (const ce of enemyCountermove.clock_effects) {
        const delta = Number(ce.delta) || 0;
        if (!delta || !ce.clock) continue;
        const curVal = typeof clocks[ce.clock] === 'number' ? clocks[ce.clock] : 0;
        clocks[ce.clock] = Math.max(0, Math.min(100, curVal + delta));
      }
      flags.campaign_clocks = clocks;
    }

    // Faction updates
    if (factionUpdates.length) {
      const facStates = { ...(newWorldState.faction_states || {}) };
      for (const fu of factionUpdates) {
        const cur = facStates[fu.key] || {};
        const updated = { ...cur };
        if (fu.relationship_change) updated.relationship = Math.max(-100, Math.min(100, (typeof cur.relationship === 'number' ? cur.relationship : 0) + fu.relationship_change));
        if (fu.last_action) updated.last_action = fu.last_action;
        if (fu.faction_move) updated.agenda = fu.faction_move;
        facStates[fu.key] = updated;
      }
      newWorldState.faction_states = facStates;
    }

    // Save old evidence states for discovery trigger comparison
    const oldEvidenceStates = JSON.parse(JSON.stringify(worldState.evidence_states || {}));

    // Evidence updates
    if (evidenceUpdates.length) {
      const evStatesMap = { ...(newWorldState.evidence_states || {}) };
      for (const eu of evidenceUpdates) {
        const cur = evStatesMap[eu.key] || {};
        const updated = { ...cur };
        if (eu.state) updated.state = eu.state;
        if (eu.notes) updated.notes = eu.notes;
        evStatesMap[eu.key] = updated;
      }
      newWorldState.evidence_states = evStatesMap;
    }

    // Apply discovery triggers (code-driven auto-unlocks)
    const discoveryEffects = await applyDiscoveryTriggers(
      base44, campaign_id, campaign.current_chapter,
      oldEvidenceStates, newWorldState.evidence_states || {},
      npcList, newWorldState
    );

    // Ally updates
    if (allyUpdates.length) {
      const allyStatesMap = { ...(newWorldState.ally_states || {}) };
      for (const au of allyUpdates) {
        const cur = allyStatesMap[au.key] || {};
        const updated = { ...cur };
        if (au.relationship_change) {
          updated.relationship = Math.max(-100, Math.min(100, (typeof cur.relationship === 'number' ? cur.relationship : 0) + au.relationship_change));
          const log = Array.isArray(cur.recent_changes) ? [...cur.recent_changes] : [];
          log.unshift({ change: au.relationship_change, reason: au.reason, timestamp: new Date().toISOString() });
          updated.recent_changes = log.slice(0, 6);
        }
        allyStatesMap[au.key] = updated;
      }
      newWorldState.ally_states = allyStatesMap;
    }

    // Location states
    const locationStateUpdates = effects.filter(e => e.type === 'location');
    if (locationStateUpdates.length) {
      const locStates = { ...(newWorldState.location_states || {}) };
      for (const ls of locationStateUpdates) {
        if (ls.id && ls.state) locStates[ls.id] = ls.state;
      }
      newWorldState.location_states = locStates;
    }

    // Rendezvous team tracking — accumulate who's been brought to meetings
    if (Array.isArray(result.rendezvous_team) && result.rendezvous_team.length) {
      const existing = Array.isArray(flags.rendezvous_team) ? flags.rendezvous_team : [];
      for (const member of result.rendezvous_team) {
        if (typeof member === 'string' && member.trim() && !existing.includes(member.trim())) {
          existing.push(member.trim());
        }
      }
      flags.rendezvous_team = existing;
    }

    // Future Echo — save to log and set cooldown
    if (result.future_echo && result.future_echo.memory_fragment) {
      const echoLog = Array.isArray(flags.future_echoes) ? flags.future_echoes : [];
      echoLog.push({
        crew_member: String(result.future_echo.crew_member || 'bub'),
        echo_type: String(result.future_echo.echo_type || 'warning'),
        certainty: String(result.future_echo.certainty || 'low'),
        memory_fragment: String(result.future_echo.memory_fragment),
        practical_hint: String(result.future_echo.practical_hint || ''),
        effects: Array.isArray(result.future_echo.effects) ? result.future_echo.effects : [],
        trigger: String(result.future_echo.trigger || ''),
        acted_on: false,
        timestamp: new Date().toISOString()
      });
      flags.future_echoes = echoLog.slice(-30); // keep last 30
      flags.echo_cooldown = 4 + Math.floor(Math.random() * 3); // 4-6 turn cooldown
    } else {
      // Decrement cooldown if no echo this turn
      const curCd = typeof flags.echo_cooldown === 'number' ? flags.echo_cooldown : 0;
      flags.echo_cooldown = curCd > 0 ? curCd - 1 : 0;
    }

    // Future Echo public use — apply secrecy penalties
    if (result.future_echo_public_use === true) {
      const clocks = { ...(flags.campaign_clocks || {}) };
      clocks.public_truth = Math.max(0, (clocks.public_truth || 0) - 5);
      clocks.chen_countermeasures = Math.max(0, Math.min(100, (clocks.chen_countermeasures || 0) + 8));
      clocks.temporal_instability = Math.max(0, Math.min(100, (clocks.temporal_instability || 0) + 3));
      // New Titan Trust tracked via new_titan_stability
      clocks.new_titan_stability = Math.max(0, (clocks.new_titan_stability || 0) - 4);
      flags.campaign_clocks = clocks;
    }

    // Arc 3 unlocks — apply story milestone flags
    if (Array.isArray(result.arc3_unlocks) && result.arc3_unlocks.length) {
      const arc3State = { ...(flags.arc3 || {}) };
      for (const unlock of result.arc3_unlocks) {
        if (typeof unlock === 'string' && unlock.trim()) {
          const key = unlock.trim();
          if (key === 'kimelon') arc3State.kimelonInvented = true;
          else if (key === 'voss_confirmed') arc3State.vossConfirmed = true;
          else if (key === 'voss_executed') arc3State.vossExecuted = true;
          else if (key === 'cradle_destroyed') arc3State.cradleDestroyed = true;
          else arc3State[key] = true;
        }
      }
      flags.arc3 = arc3State;
    }

    // Active operations — track player-started tasks
    if (Array.isArray(result.active_operations) && result.active_operations.length) {
      const existingOps = Array.isArray(flags.active_operations) ? [...flags.active_operations] : [];
      for (const op of result.active_operations) {
        if (!op.title) continue;
        const existing = existingOps.find(o => String(o.title).toLowerCase() === String(op.title).toLowerCase());
        if (existing) {
          Object.assign(existing, op);
        } else {
          existingOps.push({
            title: String(op.title),
            type: String(op.type || 'General'),
            status: String(op.status || 'active'),
            assigned_crew: Array.isArray(op.assigned_crew) ? op.assigned_crew : [],
            source_advisor: String(op.source_advisor || ''),
            objective: String(op.objective || ''),
            progress: Number(op.progress) || 0,
            risks: Array.isArray(op.risks) ? op.risks : [],
            rewards: Array.isArray(op.rewards) ? op.rewards : [],
            created_at: new Date().toISOString()
          });
        }
      }
      flags.active_operations = existingOps;
    }

    newWorldState.quest_flags = flags;

    // ═══ UPDATE CAMPAIGN ═══

    const campaignUpdates = { world_state: newWorldState, current_scene: result.new_scene || campaign.current_scene };

    // Timeline updates
    if (timeline) {
      campaignUpdates.player_runtime_ms = timeline.runtimeMs;
      campaignUpdates.last_active_at = new Date(timeline.now).toISOString();
      campaignUpdates.arc2_unlocks = timeline.arc2Unlocks;
      if (typeof result.in_world_days_advanced === 'number' && result.in_world_days_advanced > 0) {
        campaignUpdates.in_world_day = timeline.inWorldDays + result.in_world_days_advanced;
      }
      if (Array.isArray(result.arc2_elements_introduced) && result.arc2_elements_introduced.length) {
        const newUnlocks = { ...timeline.arc2Unlocks };
        for (const elem of result.arc2_elements_introduced) {
          if (typeof elem === 'string' && elem.trim()) newUnlocks[elem.trim()] = true;
        }
        campaignUpdates.arc2_unlocks = newUnlocks;
      }
    }

    await base44.asServiceRole.entities.Campaign.update(campaign_id, campaignUpdates);

    // ═══ UPSERT NPC/LOCATION DOSSIERS ═══

    if (npcUpdates.length) {
      await upsertNpcs(base44, campaign_id, campaign.current_chapter, npcUpdates);
    }
    if (locationUpdates.length) {
      await upsertLocations(base44, campaign_id, campaign.current_chapter, locationUpdates);
    }

    // ═══ JOURNAL ENTRIES ═══

    // Action entry — skip if skip_action_log (already created by campaignData.submitAction)
    if (!is_roll_result && !skip_action_log) {
      await base44.asServiceRole.entities.JournalEntry.create({
        campaign_id, entry_type: 'action', player_action: action,
        acting_character_name: actingChar.name, chapter: campaign.current_chapter
      });
    }

    // Narration entry — always created
    await base44.asServiceRole.entities.JournalEntry.create({
      campaign_id, entry_type: 'narration', narration: result.narration,
      dice_rolls: [], hp_changes: [], xp_awarded: 0,
      acting_character_name: actingChar.name, chapter: campaign.current_chapter
    });

    // ═══ RETURN RESPONSE (frontend-compatible) ═══

    return Response.json({
      narration: result.narration,
      clock_changes: clockChanges,
      ally_updates: allyUpdates,
      evidence_updates: evidenceUpdates,
      faction_updates: factionUpdates,
      npc_updates: npcUpdates,
      location_updates: locationUpdates,
      decision_impact: result.decision_impact || null,
      enemy_countermove: enemyCountermove,
      new_scene: result.new_scene || campaign.current_scene,
      in_world_days_advanced: result.in_world_days_advanced || 0,
      arc2_elements_introduced: result.arc2_elements_introduced || [],
      arc3_unlocks: result.arc3_unlocks || [],
      rendezvous_team: flags.rendezvous_team || [],
      future_echo: result.future_echo || null,
      future_echo_public_use: result.future_echo_public_use || false,
      echo_cooldown: flags.echo_cooldown || 0,
      active_operations: flags.active_operations || [],
      discovery_effects: discoveryEffects || [],
      player_runtime_hours: timeline ? timeline.runtimeHours : 0,
      in_world_day: campaignUpdates.in_world_day || (campaign.in_world_day || 0),
      pending_arc2_unlocks: timeline ? timeline.pendingUnlocks : [],
      // Empty fields for frontend compatibility
      dice_rolls: [],
      hp_changes: [],
      xp_awarded: [],
      loot: [],
      gold_changes: [],
      spells_learned: [],
      equipment_changes: [],
      equipment_transfers: [],
      deaths: [],
      world_updates: null,
      combat_active: false,
      combat_initiative: [],
      ends_session: false,
      audio_urls: []
    });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});