// Pathfinder Journeys — Reputation Labels & Public Narrative State
// Derived from clock values: what New Titan, Earth, Sanctuary, Confluence, and Chen
// currently believe about Captain Stellar. Not a number — a living public story.

import { getClockValue } from '@/lib/pjClocks';

// === NEW TITAN REPUTATION LABELS ===
// What New Titan Control and civilians currently think of Bub.
export const NEW_TITAN_LABELS = [
  { max: 10, label: 'Unknown Vessel', tone: 'text-muted-foreground' },
  { max: 25, label: 'Possible Ally', tone: 'text-sky-400' },
  { max: 45, label: 'Cautious Interest', tone: 'text-cyan-400' },
  { max: 65, label: 'Credible Witness', tone: 'text-emerald-400' },
  { max: 85, label: 'Resistance Catalyst', tone: 'text-emerald-300' },
  { max: 100, label: 'New Titan Defender', tone: 'text-emerald-200' }
];

export function getNewTitanLabel(campaign) {
  const stability = getClockValue(campaign, 'new_titan_stability');
  const truth = getClockValue(campaign, 'public_truth');
  const spark = getClockValue(campaign, 'resistance_spark');
  // Composite score: stability matters most, then truth reaching them, then spark
  const score = Math.min(100, Math.round(stability * 0.4 + truth * 0.35 + spark * 0.25));
  for (const tier of NEW_TITAN_LABELS) {
    if (score <= tier.max) return { ...tier, score };
  }
  return { ...NEW_TITAN_LABELS[NEW_TITAN_LABELS.length - 1], score };
}

// === ENEMY REPUTATION LABELS ===
// What Confluence and Chen currently call Bub.
export const ENEMY_LABELS = [
  { max: 10, label: 'Procedural Irritant', tone: 'text-muted-foreground' },
  { max: 25, label: 'Evidence Carrier', tone: 'text-amber-400' },
  { max: 45, label: 'Narrative Threat', tone: 'text-orange-400' },
  { max: 65, label: 'Resistance Seed', tone: 'text-red-400' },
  { max: 85, label: 'Primary Destabilizer', tone: 'text-red-500' },
  { max: 100, label: 'Existential Threat', tone: 'text-red-600' }
];

export function getEnemyLabel(campaign) {
  const heat = getClockValue(campaign, 'confluence_heat');
  const spark = getClockValue(campaign, 'resistance_spark');
  const truth = getClockValue(campaign, 'public_truth');
  const discredit = getClockValue(campaign, 'discredit_campaign');
  // Composite: how much of a threat the enemy perceives
  const score = Math.min(100, Math.round(heat * 0.35 + spark * 0.25 + truth * 0.2 + discredit * 0.2));
  for (const tier of ENEMY_LABELS) {
    if (score <= tier.max) return { ...tier, score };
  }
  return { ...ENEMY_LABELS[ENEMY_LABELS.length - 1], score };
}

// === PUBLIC NARRATIVE STATE ===
// What each group currently believes about Pathfinder and the situation.
export function getPublicNarrative(campaign) {
  const stability = getClockValue(campaign, 'new_titan_stability');
  const truth = getClockValue(campaign, 'public_truth');
  const spark = getClockValue(campaign, 'resistance_spark');
  const heat = getClockValue(campaign, 'confluence_heat');
  const chen = getClockValue(campaign, 'chen_countermeasures');
  const discredit = getClockValue(campaign, 'discredit_campaign');
  const sanctuary = getClockValue(campaign, 'sanctuary_trust');
  const morale = getClockValue(campaign, 'crew_morale');

  // New Titan Control
  let ntControl;
  if (stability < 25) ntControl = 'Panicking — may surrender';
  else if (stability < 50) ntControl = 'Divided and afraid';
  else if (truth < 30) ntControl = 'Cautious but listening';
  else if (truth < 60) ntControl = 'Beginning to believe';
  else if (stability > 75) ntControl = 'Mobilizing to resist';
  else ntControl = 'Cautiously hopeful';

  // New Titan Civilians
  let ntCivilians;
  if (truth < 20) ntCivilians = 'Mostly unaware';
  else if (truth < 40) ntCivilians = 'Rumors spreading';
  else if (spark < 30) ntCivilians = 'Fearful and confused';
  else if (spark < 60) ntCivilians = 'Hopeful but anxious';
  else ntCivilians = 'Inspired — volunteering';

  // EarthGov Channels
  let earthgov;
  if (chen > 70 && discredit > 50) earthgov = 'Pathfinder classified as rogue';
  else if (chen > 50) earthgov = 'Pathfinder possibly rogue';
  else if (truth > 50) earthgov = 'Questioning Chen\'s narrative';
  else if (discredit > 30) earthgov = 'Pathfinder under suspicion';
  else earthgov = 'Pathfinder unknown';

  // Sanctuary Fleet
  let sanctuaryFleet;
  if (sanctuary < 25) sanctuaryFleet = 'Distrustful of Bub';
  else if (sanctuary < 50) sanctuaryFleet = 'Trusting but nervous';
  else if (sanctuary < 75) sanctuaryFleet = 'Committed allies';
  else sanctuaryFleet = 'Devoted — will follow Bub';

  // Confluence Public Line
  let confluence;
  if (discredit > 70) confluence = 'Pathfinder is a fabricated alien propaganda vessel';
  else if (discredit > 40) confluence = 'Pathfinder is spreading forged evidence';
  else if (discredit > 20) confluence = 'Pathfinder claims are unverified';
  else if (heat > 60) confluence = 'Pathfinder is a rogue vessel';
  else confluence = 'Pathfinder is a minor procedural concern';

  // Chen Network
  let chenNetwork;
  if (chen > 70 && discredit > 50) chenNetwork = 'Bub Stellar is compromised by temporal contamination';
  else if (chen > 50) chenNetwork = 'Bub Stellar is mentally unstable from future exposure';
  else if (chen > 30) chenNetwork = 'Bub Stellar is a rogue officer';
  else chenNetwork = 'Bub Stellar is a disobedient captain';

  // Crew
  let crew;
  if (morale < 25) crew = 'Breaking under pressure';
  else if (morale < 50) crew = 'Strained but holding';
  else if (morale < 75) crew = 'Steady and committed';
  else crew = 'Inspired — ready for anything';

  return [
    { group: 'New Titan Control', belief: ntControl },
    { group: 'New Titan Civilians', belief: ntCivilians },
    { group: 'EarthGov Channels', belief: earthgov },
    { group: 'Sanctuary Fleet', belief: sanctuaryFleet },
    { group: 'Confluence Public Line', belief: confluence },
    { group: 'Chen Network', belief: chenNetwork },
    { group: 'Pathfinder Crew', belief: crew }
  ];
}