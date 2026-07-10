// Pathfinder Journeys — Discovery Trigger System
// When specific evidence is found (transitions to DISCOVERED), it automatically
// unlocks hidden mission/location nodes and shifts NPC dispositions in the background.
// This is deterministic — it fires on state transition, not on GM discretion.

import { CODEX_LOCATIONS } from '@/lib/pjLocations';

// === DISCOVERY TRIGGERS ===
// Each entry fires when the evidence transitions TO onState (default DISCOVERED)
// from a different state. The effects are applied automatically by the backend.
export const EVIDENCE_DISCOVERY_TRIGGERS = {
  prometheus_warning: {
    onState: 'DISCOVERED',
    unlockLocations: [],
    npcShifts: [
      { name: 'Admiral Chen', disposition: 'suspicious', notes: 'Chen is aware the Prometheus warning is circulating — she increases surveillance on deep-space comms.' }
    ],
    hint: 'The Prometheus warning echoes through old military channels. Someone is listening.'
  },
  james_stellar_testimony: {
    onState: 'DISCOVERED',
    unlockLocations: [],
    npcShifts: [
      { name: 'Captain Vask', disposition: 'hostile', notes: 'Vask learns James Stellar survived — she hunts for him to silence the testimony and prove her choice was right.' }
    ],
    hint: "James Stellar's survival is no longer a secret. Confluence hunters take notice."
  },
  korath_database: {
    onState: 'DISCOVERED',
    unlockLocations: [
      { key: 'dead_civilization_graveyards', newState: 'UNLOCKED', reason: 'Korath records contain coordinates of civilization graveyards — dead worlds that warn of what The Confluence does.' }
    ],
    npcShifts: [
      { name: 'Vescarri Claim-Lords', disposition: 'defensive', notes: 'The Korath precedent threatens their legal standing — they strengthen their filings.' }
    ],
    hint: 'The Korath database reveals graveyard coordinates — dead worlds that warn of Confluence processing.'
  },
  novara_transaction_record: {
    onState: 'DISCOVERED',
    unlockLocations: [
      { key: 'novara_system', newState: 'UNLOCKED', reason: 'The transaction record contains last-known Novara coordinates — the lost colony can now be found.' },
      { key: 'collectors_guild_routes', newState: 'UNLOCKED', reason: 'The transaction trail leads directly to Collector\u2019s Guild trade lanes.' }
    ],
    npcShifts: [
      { name: 'Admiral Chen', disposition: 'hostile', notes: 'Chen is directly implicated in the Novara sale — she will move aggressively to suppress this evidence.' }
    ],
    hint: 'The Novara Transaction Record unlocks two destination nodes and marks Admiral Chen as an active threat.'
  },
  sakura_chen_technology_exchange: {
    onState: 'DISCOVERED',
    unlockLocations: [],
    npcShifts: [
      { name: 'Admiral Chen', disposition: 'hostile', notes: 'Chen\u2019s darkest secret is exposed — humanity\u2019s propulsion tech was bought with lives. She will counterattack hard.' },
      { name: 'Sarah Chen', disposition: 'strained', notes: 'Sarah is devastated — her mother sold humanity\u2019s future for engine technology.' }
    ],
    hint: 'The Sakura-Chen exchange implicates Admiral Chen directly. Sarah is shaken. Chen will strike back.'
  },
  new_titan_claim_file: {
    onState: 'DISCOVERED',
    unlockLocations: [
      { key: 'new_titan_system', newState: 'ACTIVE', reason: 'The claim file confirms New Titan is already being legally processed — the crisis is not future, it is now.' }
    ],
    npcShifts: [
      { name: 'Governor Marcus Thorne', disposition: 'alarmed', notes: 'Thorne senses the Confluence interest in his colony is wrong — he begins quiet preparations.' }
    ],
    hint: 'The New Titan Claim File confirms the colony is being processed — the crisis is active.'
  },
  sarah_chen_testimony: {
    onState: 'DISCOVERED',
    unlockLocations: [],
    npcShifts: [
      { name: 'Admiral Chen', disposition: 'hostile', notes: 'Her daughter\u2019s betrayal makes this deeply personal — Chen will not forgive or hesitate.' },
      { name: 'Sarah Chen', disposition: 'invested', notes: 'Sarah has committed everything to exposing the truth about her mother.' }
    ],
    hint: "Sarah Chen's testimony makes the conspiracy personal. Admiral Chen will not forgive this."
  },
  sanctuary_archive_records: {
    onState: 'DISCOVERED',
    unlockLocations: [
      { key: 'architect_sites', newState: 'RUMORED', reason: 'Archive records reference ancient Architect temporal sites — a new destination emerges from the data.' }
    ],
    npcShifts: [
      { name: 'Councilor Verath', disposition: 'cautiously_trusting', notes: 'Sharing Sanctuary archive access deepens the alliance — Verath opens slightly.' }
    ],
    hint: 'Sanctuary archives reveal references to Architect Sites — a new destination node emerges.'
  },
  architect_future_history_data: {
    onState: 'DISCOVERED',
    unlockLocations: [
      { key: 'architect_sites', newState: 'UNLOCKED', reason: 'Future-history data contains Architect site coordinates — the temporal ruins can now be located.' }
    ],
    npcShifts: [
      { name: 'Mitchell', disposition: 'agitated', notes: 'Mitchell senses temporal instability radiating from the encoded data — he becomes restless and watchful.' }
    ],
    hint: 'The Architect data unlocks coordinates to temporal ruins. Mitchell is uneasy.'
  }
};

// === PURE FUNCTIONS ===

// Compute which triggers fire when comparing old vs new evidence states.
// Returns an array of { key, trigger, oldState, newState } for each fired trigger.
export function computeDiscoveryTriggers(oldEvidenceStates, newEvidenceStates) {
  const fired = [];
  for (const [key, trigger] of Object.entries(EVIDENCE_DISCOVERY_TRIGGERS)) {
    const oldState = (oldEvidenceStates?.[key]?.state) || 'UNKNOWN';
    const newState = (newEvidenceStates?.[key]?.state) || 'UNKNOWN';
    const targetState = trigger.onState || 'DISCOVERED';
    if (newState === targetState && oldState !== targetState) {
      fired.push({ key, trigger, oldState, newState });
    }
  }
  return fired;
}

// Extract all location unlocks from a set of fired triggers.
export function extractLocationUnlocks(firedTriggers) {
  const unlocks = [];
  for (const { key, trigger } of firedTriggers) {
    for (const loc of trigger.unlockLocations || []) {
      unlocks.push({ ...loc, evidenceKey: key });
    }
  }
  return unlocks;
}

// Extract all NPC disposition shifts from a set of fired triggers.
export function extractNpcShifts(firedTriggers) {
  const shifts = [];
  for (const { key, trigger } of firedTriggers) {
    for (const npc of trigger.npcShifts || []) {
      shifts.push({ ...npc, evidenceKey: key });
    }
  }
  return shifts;
}

// Get the discovery effects for a single evidence key (for EvidenceCard display).
// Returns { unlockLocations, npcShifts, hint } or null if no triggers.
export function getDiscoveryEffects(evidenceKey) {
  const trigger = EVIDENCE_DISCOVERY_TRIGGERS[evidenceKey];
  if (!trigger) return null;
  return {
    unlockLocations: trigger.unlockLocations || [],
    npcShifts: trigger.npcShifts || [],
    hint: trigger.hint || null
  };
}

// Resolve a location key to its label for display.
export function getLocationLabel(locationKey) {
  const loc = CODEX_LOCATIONS.find((l) => l.key === locationKey);
  return loc ? loc.label : locationKey;
}