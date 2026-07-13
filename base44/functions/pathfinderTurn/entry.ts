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
    james: 'James Stellar — Bub\'s grandfather, Confluence survivor. Haunted, wise. Confluence tactics/legal. Guilt may cloud judgment.',
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
    james_stellar: 'James Stellar [LOYAL +80] — Needs purpose, redemption. Strengthens when treated as family. Damages if used as weapon. Need: maintenance, forgiveness.',
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
    sanctuary_archive: 'Sanctuary Archives [HIGH] — Multi-species resistance records. Build alien alliances.',
    architect_future: 'Architect Future-History [LOW] — Encoded future memories. High spark if careful, temporal risk if overused.'
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
    gungi_belt: 'Gungi Belt [RUMORED] — Debris from fake "pirate attacks." Proof of replacements.'
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
    public_truth: 'Public Truth (good) — Galaxy knows Chen/Confluence are lying.'
  },

  arc2: {
    first_echo: '5hr: First Echo — future-memory flash, silver moon, child in shelter. No explanation.',
    suspicious_order: '10hr: Suspicious Order — Earth Command order correct but emotionally wrong.',
    unity: '15hr: Unity — sentient nanite collective, living silver, adapts to location.',
    new_titan: '18hr or 10+ days: New Titan crisis — distress call, news, future memory, or Farrah reveals father is Governor Thorne.',
    harvester: '25hr: Harvester — "BIOLOGICAL PACIFICATION ASSET: HARVESTER, STATUS: AWAKENING."',
    chen_wrong: '30hr: Chen Is Wrong — Sarah discovers Chen\'s behavior changed 11 years ago.',
    black_site: '40hr: Black Site — Omega-Seven, captured shapeshifter memory. Sarah: "My mother is alive."'
  },

  response_format: `Respond as JSON: {"narration":"scene text (always present)","effects":[{"type":"clock|ally|evidence|faction|npc|location","id":"key","delta":number,"reason":"short why","effect":"consequence (clock only)","state":"new state (evidence/location)","notes":"extra detail (evidence)","name":"NPC name (npc)","disposition":"friendly/hostile/etc (npc)","what_we_know":"NEW facts only (npc)","last_action":"what faction did (faction)","faction_move":"narrate faction action (faction)"}],"decision_impact":{"is_meaningful":bool,"impacts":[1-4 items {"label","change":number,"change_label","reason","category":"ally|clock|faction|evidence|hidden","tone":"positive|negative|neutral|hidden","character_note":"optional NPC quote"}],"future_consequence":"optional"},"new_scene":"scene desc","in_world_days_advanced":0,"arc2_elements_introduced":[]}
Rules: narration always present. Only include effects that ACTUALLY changed this turn. Clock deltas: normal +1-3, important +4-8, major +10-20. Only 1-3 clocks per action. Only include allies MEANINGFULLY affected (0-2 per turn). decision_impact always present — is_meaningful:false with empty impacts for minor actions. Evidence state changes: UNKNOWN→DISCOVERED→VERIFIED→SHARED_PRIVATELY→PUBLICLY_RELEASED→WEAPONIZED. Location states: UNKNOWN→RUMORED→UNLOCKED→ACTIVE→VISITED→COMPLETED.`
};

// ═══════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════

function npcKey(s) { return String(s || '').trim().toLowerCase().replace(/\s+/g, ' '); }
function locKey(s) { return String(s || '').trim().toLowerCase().replace(/\s+/g, ' '); }

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
    const nameRaw = String(n.name).trim();
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
      if (aliases.length) {
        const curAliases = match.aliases;
        const merged = [...curAliases];
        for (const a of aliases) if (!curAliases.some(b => npcKey(b) === npcKey(a))) merged.push(a);
        if (merged.length !== curAliases.length) updates.aliases = merged;
      }
      if (Object.keys(updates).length) {
        await base44.asServiceRole.entities.NPC.update(match.id, updates);
        Object.assign(match, updates);
      }
    } else {
      const created = await base44.asServiceRole.entities.NPC.create({
        campaign_id, name: nameRaw, aliases,
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
  const flags = worldState.quest_flags || {};
  const clocks = flags.campaign_clocks || {};
  const allyStates = worldState.ally_states || {};
  const facStates = worldState.faction_states || {};
  const evStates = worldState.evidence_states || {};
  const locStates = worldState.location_states || {};
  const currentLoc = flags.current_location || 'Edge of New Titan System';

  // --- Select relevant crew ---
  const crewKw = { 'thorne': 'thorne', 'farah': 'thorne', 'clark': 'clark', 'james': 'james', 'grandpa': 'james', 'sarah': 'sarah', 'carmelon': 'carmelon', 'mitchell': 'mitchell', 'eagle': 'mitchell', 'hayes': 'hayes', 'reeves': 'reeves', 'ramos': 'ramos', 'voss': 'voss', 'patel': 'patel' };
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
  const evKw = { 'prometheus': 'prometheus_warning', 'james testimony': 'james_testimony', 'james stellar testimony': 'james_testimony', 'korath': 'korath_database', 'novara': 'novara_transaction', 'sakura': 'sakura_chen_exchange', 'titan claim': 'new_titan_claim', 'new titan claim': 'new_titan_claim', 'sarah testimony': 'sarah_chen_testimony', 'sarah chen testimony': 'sarah_chen_testimony', 'sanctuary archive': 'sanctuary_archive', 'architect': 'architect_future', 'future memory': 'architect_future', 'future-history': 'architect_future' };
  const relevantEvidence = [];
  for (const [kw, key] of Object.entries(evKw)) {
    if (actionLower.includes(kw) && !relevantEvidence.includes(key)) relevantEvidence.push(key);
  }

  // --- Select relevant allies ---
  const allyKw = { 'sarah': 'sarah_chen', 'james': 'james_stellar', 'mitchell': 'mitchell', 'verath': 'councilor_verath', 'vex': 'commander_vex', 'sanctuary': 'sanctuary_refugee_fleet', 'refugee': 'sanctuary_refugee_fleet', 'unity': 'unity', 'nanite': 'unity' };
  const relevantAllies = [];
  for (const [kw, key] of Object.entries(allyKw)) {
    if (actionLower.includes(kw) && !relevantAllies.includes(key)) relevantAllies.push(key);
  }

  // --- Select relevant locations ---
  const locKw = { 'new titan': 'new_titan', 'titan': 'new_titan', 'earth': 'earth', 'novara': 'novara', 'sanctuary': 'sanctuary', 'confluence space': 'confluence_space', 'vescarri': 'vescarri_space', 'guild route': 'guild_routes', 'architect site': 'architect_sites', 'lost colon': 'lost_colonies', 'graveyard': 'dead_graveyards', 'omega': 'omega_seven', 'kepler': 'kepler_station', 'gungi': 'gungi_belt' };
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

  // --- Build enemy cards (relevant only) ---
  const enemyCards = relevantEnemies.map(key => CANON.enemies[key]).filter(Boolean).join('\n');

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

## Recent Events
${history || 'The adventure has just begun.'}

## Timeline
${timelineStatus}

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
          new_scene: { type: "string" },
          in_world_days_advanced: { type: "number" },
          arc2_elements_introduced: { type: "array", items: { type: "string" } }
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
      name: e.name || e.id, disposition: String(e.disposition || ''),
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
      new_scene: result.new_scene || campaign.current_scene,
      in_world_days_advanced: result.in_world_days_advanced || 0,
      arc2_elements_introduced: result.arc2_elements_introduced || [],
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