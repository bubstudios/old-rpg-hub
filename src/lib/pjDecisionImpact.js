// Decision Impact system — builds a unified impact list from DM response data

export const CLOCK_LABELS = {
  confluence_claim: { label: 'Confluence Claim', highIsBad: true },
  confluence_heat: { label: 'Confluence Heat', highIsBad: true },
  chen_countermeasures: { label: 'Chen Countermeasures', highIsBad: true },
  new_titan_stability: { label: 'New Titan Stability', highIsBad: false },
  resistance_spark: { label: 'Resistance Spark', highIsBad: false },
  sanctuary_trust: { label: 'Sanctuary Trust', highIsBad: false },
  crew_morale: { label: 'Crew Morale', highIsBad: false },
  temporal_instability: { label: 'Temporal Instability', highIsBad: true },
  public_truth: { label: 'Public Truth', highIsBad: false },
  harvester_arrival: { label: 'Harvester Arrival', highIsBad: true },
  mission_exposure: { label: 'Mission Exposure', highIsBad: true },
  shapeshifter_suspicion: { label: 'Shapeshifter Suspicion', highIsBad: true },
  unity_expansion: { label: 'Unity Expansion', highIsBad: false },
  new_titan_evacuation: { label: 'New Titan Evacuation', highIsBad: false },
  omega_seven_alert: { label: 'Omega-Seven Alert', highIsBad: true }
};

export const ALLY_LABELS = {
  sarah_chen: 'Sarah Chen',
  james_stellar: 'James Stellar',
  mitchell: 'Mitchell',
  councilor_verath: 'Councilor Verath',
  commander_vex: 'Commander Vex',
  sanctuary_refugee_fleet: 'Sanctuary Refugee Fleet',
  '37_allied_ships': '37 Allied Ships',
  unity: 'Unity'
};

export const FACTION_LABELS = {
  the_confluence: 'The Confluence',
  vescarri_sovereignty: 'Vescarri Sovereignty',
  collectors_guild: "Collector's Guild",
  earth_command: 'Earth Command',
  sanctuary_council: 'Sanctuary Council',
  the_resistance: 'The Resistance',
  unity: 'Unity'
};

function prettyKey(key) {
  return String(key || '').replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

export function getRelationshipLabel(change) {
  if (change >= 10) return 'Major loyalty gain';
  if (change >= 6) return 'Strong approval';
  if (change >= 3) return 'Approval';
  if (change >= 1) return 'Slight approval';
  if (change <= -10) return 'Major relationship damage';
  if (change <= -6) return 'Strong disapproval';
  if (change <= -3) return 'Disapproval';
  if (change <= -1) return 'Minor concern';
  return '';
}

export function getClockLabel(change, highIsBad) {
  if (change === 0) return '';
  if (highIsBad) {
    if (change >= 10) return 'Critical escalation';
    if (change >= 6) return 'Major worsening';
    if (change >= 3) return 'Worsening';
    if (change >= 1) return 'Slight increase';
    if (change <= -10) return 'Major relief';
    if (change <= -6) return 'Significant relief';
    if (change <= -3) return 'Improving';
    if (change <= -1) return 'Slight relief';
  } else {
    if (change >= 10) return 'Major boost';
    if (change >= 6) return 'Strong improvement';
    if (change >= 3) return 'Improving';
    if (change >= 1) return 'Slight improvement';
    if (change <= -10) return 'Major damage';
    if (change <= -6) return 'Significant drop';
    if (change <= -3) return 'Declining';
    if (change <= -1) return 'Slight decline';
  }
  return '';
}

export function buildDecisionImpact(dmData) {
  const impacts = [];

  // Ally relationship changes
  for (const au of (dmData?.ally_updates || [])) {
    const change = typeof au.relationship_change === 'number' ? au.relationship_change : 0;
    if (change === 0) continue;
    impacts.push({
      label: ALLY_LABELS[au.key] || prettyKey(au.key),
      change,
      change_label: getRelationshipLabel(change),
      reason: au.reason || au.last_action || '',
      category: 'ally',
      tone: change > 0 ? 'positive' : 'negative',
      character_note: null
    });
  }

  // Clock changes
  for (const cc of (dmData?.clock_changes || [])) {
    const change = typeof cc.change === 'number' ? cc.change : 0;
    if (change === 0) continue;
    const clockInfo = CLOCK_LABELS[cc.clock] || { label: prettyKey(cc.clock), highIsBad: false };
    const highIsBad = clockInfo.highIsBad;
    impacts.push({
      label: clockInfo.label,
      change,
      change_label: getClockLabel(change, highIsBad),
      reason: cc.reason || '',
      category: 'clock',
      tone: highIsBad ? (change > 0 ? 'negative' : 'positive') : (change > 0 ? 'positive' : 'negative'),
      character_note: null
    });
  }

  // Faction relationship changes
  for (const fu of (dmData?.faction_updates || [])) {
    const change = typeof fu.relationship_change === 'number' ? fu.relationship_change : 0;
    if (change === 0) continue;
    impacts.push({
      label: FACTION_LABELS[fu.key] || prettyKey(fu.key),
      change,
      change_label: getRelationshipLabel(change),
      reason: fu.last_action || fu.new_agenda || '',
      category: 'faction',
      tone: change > 0 ? 'positive' : 'negative',
      character_note: null
    });
  }

  if (impacts.length === 0) return null;

  // Sort by absolute change value (most significant first), take top 4
  impacts.sort((a, b) => Math.abs(b.change) - Math.abs(a.change));
  const topImpacts = impacts.slice(0, 4);

  return {
    is_meaningful: true,
    impacts: topImpacts,
    future_consequence: null
  };
}