// Pathfinder Journeys — Status Query Detection
// Intercepts player questions (Where am I? Who is with me? What is the situation?)
// and answers from current game state instead of echoing them as Bub dialogue.

import { CREW_PROFILES } from '@/lib/pjCrewProfiles';

const STATUS_KEYWORDS = [
  'where am i', 'who am i with', 'what is happening', 'current situation',
  "what's going on", 'whats going on', 'where are we', 'who is here',
  'who is available', 'what is the situation', 'what do i know',
  'what is the current', 'what can i do', 'what are my options',
  'who is on the ship', 'who is aboard', 'summarize', 'what is the status',
  'give me a status', 'where is the pathfinder', 'what is our situation'
];

const OPERATION_STATUS_KEYWORDS = [
  'status of the', 'what is the status of', 'how is the',
  'progress on', 'courier status', 'operation status',
  'what happened to the', 'is the courier', 'has the courier',
  'did the courier', 'how goes the'
];

const MISSION_KEYWORDS = [
  'review mission', 'current mission', 'what is the mission',
  'what is my mission', 'what am i supposed to do', 'what is the objective',
  'what are we doing here', 'what is the goal'
];

export function detectStatusQuery(input) {
  const text = String(input || '').toLowerCase().trim();
  if (OPERATION_STATUS_KEYWORDS.some(kw => text.includes(kw))) return 'operation_query';
  if (STATUS_KEYWORDS.some(kw => text.includes(kw))) return 'status_query';
  if (MISSION_KEYWORDS.some(kw => text.includes(kw))) return 'mission_query';
  return null;
}

function isCrewAvailable(crewKey, campaign) {
  const flags = campaign?.world_state?.quest_flags || {};
  const crewStatus = flags.crew_status || {};
  const status = crewStatus[crewKey];
  if (status === 'dead' || status === 'captured' || status === 'away_mission' || status === 'injured_unavailable') return false;
  if (flags.crew_hidden?.[crewKey] === true) return false;
  if (crewKey === 'voss' && flags.arc3?.vossExecuted) return false;
  return true;
}

export function buildStatusResponse(campaign) {
  const flags = campaign?.world_state?.quest_flags || {};
  const currentLocation = flags.current_location || campaign?.current_scene || 'Edge of New Titan System';
  const clocks = flags.campaign_clocks || {};

  const crewList = Object.entries(CREW_PROFILES)
    .filter(([key]) => isCrewAvailable(key, campaign))
    .map(([, profile]) => `- ${profile.displayName}${profile.role ? ` — ${profile.role}` : ''}`);

  const heat = clocks.confluence_heat || 0;
  const stability = clocks.new_titan_stability || 0;
  const chen = clocks.chen_countermeasures || 0;
  const truth = clocks.public_truth || 0;
  const morale = clocks.crew_morale || 0;

  let situation = '';
  if (heat > 60) situation += 'The Confluence is actively hunting the Pathfinder. ';
  else if (heat > 30) situation += 'The Confluence has noticed unusual activity. ';
  else situation += 'Confluence attention is low for now. ';

  if (stability < 30) situation += 'New Titan is panicking. ';
  else if (stability < 60) situation += 'New Titan is cautious but listening. ';
  else situation += 'New Titan is stable and receptive. ';

  if (chen > 50) situation += 'Admiral Chen is moving aggressively against you. ';
  else if (chen > 30) situation += 'Chen is preparing countermeasures. ';

  if (truth < 25) situation += 'The public does not yet know the truth. ';
  else if (truth > 50) situation += 'Public awareness is growing. ';

  if (morale < 30) situation += 'Crew morale is strained. ';

  let text = `CURRENT SITUATION\n\n`;
  text += `You are Captain Bub Stellar aboard the UES Pathfinder.\n\n`;
  text += `Location: ${currentLocation}\n\n`;
  text += `Crew Available:\n${crewList.join('\n')}\n\n`;
  text += `Situation: ${situation.trim() || 'The situation is stable.'}`;

  return text;
}

export function buildMissionResponse(campaign) {
  const flags = campaign?.world_state?.quest_flags || {};
  const currentLocation = flags.current_location || campaign?.current_scene || 'Edge of New Titan System';

  let text = `CURRENT MISSION\n\n`;
  text += `Location: ${currentLocation}\n\n`;
  text += `Pathfinder has arrived at New Titan with thirty-seven Sanctuary refugee ships. `;
  text += `New Titan Control is requesting identification. `;
  text += `The colony does not yet understand that it is being legally processed for harvest.\n\n`;
  text += `Your mission: survive, expose the truth, protect humanity, build the resistance, `;
  text += `and decide what kind of future is worth fighting for.`;

  return text;
}

export function buildOperationStatusResponse(campaign) {
  const flags = campaign?.world_state?.quest_flags || {};
  const ops = flags.active_operations || [];
  if (!ops.length) {
    return 'No active operations. Issue a command to start one.';
  }
  let text = 'ACTIVE OPERATIONS\n\n';
  for (const op of ops) {
    text += `${op.title}\n`;
    text += `Status: ${op.status || 'Active'}\n`;
    if (op.assigned_crew?.length) text += `Assigned: ${op.assigned_crew.join(', ')}\n`;
    if (op.objective) text += `Objective: ${op.objective}\n`;
    if (op.risks?.length) text += `Risks: ${op.risks.join('; ')}\n`;
    text += '\n';
  }
  return text.trim();
}