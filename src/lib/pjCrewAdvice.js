// Pathfinder Journeys — Crew Advice System
// Before major decisions, the player can ask the crew for advice.
// Each crew member gives contextual advice based on current campaign state.

import { getClockValue } from '@/lib/pjClocks';

export const CREW_ADVISORS = [
  {
    key: 'sarah',
    name: 'Sarah Chen',
    role: 'Resistance Agent',
    icon: 'User',
    advice: (campaign) => {
      const heat = getClockValue(campaign, 'confluence_heat');
      const chen = getClockValue(campaign, 'chen_countermeasures');
      const truth = getClockValue(campaign, 'public_truth');
      if (heat > 60) return "Do not send everything digitally again. If Chen's network heard the first burst, they'll be waiting for the second. Go physical or go silent.";
      if (chen > 50) return "My mother's people are already preparing a counter-narrative. Whatever you do, assume they've already thought three moves ahead.";
      if (truth < 25) return "We need proof that survives scrutiny — not just proof that exists. One verified file is worth ten rumors.";
      return "Whatever you decide, I want in on Chen decisions. Don't use me as a symbol — use me as an operative.";
    }
  },
  {
    key: 'james',
    name: 'James Stellar',
    role: 'Confluence Survivor',
    icon: 'BookMarked',
    advice: (campaign) => {
      const claim = getClockValue(campaign, 'confluence_claim');
      const discredit = getClockValue(campaign, 'discredit_campaign');
      if (claim > 70) return "The Confluence will not argue the truth. They'll attack the chain of custody. Who handled the evidence? Who can testify they didn't tamper with it?";
      if (discredit > 50) return "They'll say I'm compromised. That I was augmented against my will and can't be trusted. They always attack the witness, not the facts.";
      if (discredit > 25) return "They're starting to whisper. 'Rogue vessel. Temporally compromised.' It will get worse before it gets better. Be ready.";
      return "The Confluence process is legal, not military. They win by making surrender the only reasonable option. Your job is to make resistance the reasonable option.";
    }
  },
  {
    key: 'clark',
    name: 'Cmdr Clark',
    role: 'Science / Sensors',
    icon: 'FlaskConical',
    advice: (campaign) => {
      const temporal = getClockValue(campaign, 'temporal_instability');
      if (temporal > 60) return "Temporal Instability is climbing. If you keep leaning on future memories, we'll start seeing paradox effects — things that shouldn't be here, people who remember differently. I can't protect you from that.";
      if (temporal > 30) return "Be careful with Architect data. Every time we use it, the timeline ripples. It's a tool, not a script.";
      return "We need a clean evidence package. Small, verifiable, impossible to dismiss. One strong file beats a dozen weak ones.";
    }
  },
  {
    key: 'mitchell',
    name: 'Mitchell',
    role: 'Enhanced Scout',
    icon: 'Eye',
    advice: (campaign) => {
      const suspicion = getClockValue(campaign, 'shapeshifter_suspicion');
      if (suspicion > 50) return "Something is wrong. Not everyone who looks like themselves is themselves. I can feel it. Scan everyone. Trust the scan, not the face.";
      if (suspicion > 20) return "Assume the meeting is watched. Assume one person there is not who they say they are. I'll be watching too.";
      return "I can sense deception, but I can't see through walls. Give me a position where I can watch faces and I'll tell you who's lying.";
    }
  },
  {
    key: 'thorne',
    name: 'Cmdr Farah Thorne',
    role: 'Tactical / Security',
    icon: 'Shield',
    advice: (campaign) => {
      const heat = getClockValue(campaign, 'confluence_heat');
      const stability = getClockValue(campaign, 'new_titan_stability');
      if (heat > 70) return "We can't keep broadcasting without expecting a response. Set a Sanctuary ship as overwatch before the next transmission. If they come for us, I want an exit vector.";
      if (stability < 30) return "New Titan is panicking. If we push too hard without giving them a plan, they'll surrender just to make the fear stop. Give them something to fight for, not just something to fear.";
      return "If this saves New Titan, we go. But I want eyes on every approach vector. No blind spots.";
    }
  },
  {
    key: 'hayes',
    name: 'Lt Hayes',
    role: 'Comms',
    icon: 'Megaphone',
    advice: (campaign) => {
      const truth = getClockValue(campaign, 'public_truth');
      const spark = getClockValue(campaign, 'resistance_spark');
      if (truth > 50 && spark > 50) return "The resistance is listening. If we broadcast now, it's not just information — it's a signal that it's okay to fight back. But once we say it, we can't take it back.";
      if (truth < 30) return "Nobody knows yet. One broadcast could change everything — or it could get dismissed as alien propaganda. Let me prepare a controlled release with context and verification.";
      return "I can prepare a controlled release — verified, contextualized, timed for maximum impact. But we need to decide: do we want people to know, or do we want them to believe?";
    }
  },
  {
    key: 'reeves',
    name: 'Lt Reeves',
    role: 'Pilot',
    icon: 'Navigation',
    advice: (campaign) => {
      const exposure = getClockValue(campaign, 'mission_exposure');
      if (exposure > 50) return "We're being tracked. I can plot an evasion route through the debris field, but we can't stay in open space much longer.";
      return "If we need to leave fast, give me a heading. I can have us in jumpspace in ninety seconds — but I need to know where we're going.";
    }
  },
  {
    key: 'ramos',
    name: 'Chief Ramos',
    role: 'Engineering',
    icon: 'Wrench',
    advice: (campaign) => {
      const shipStats = campaign?.world_state?.quest_flags?.ship_stats || {};
      const integrity = shipStats.hull_integrity ?? 100;
      if (integrity < 40) return "The Pathfinder can't take another fight right now. I need time — at least six hours in the field to patch the hull. Don't pick a fight I can't get you out of.";
      return "I can mask our signature, rig a burst transmitter, or harden the hull — but not all three at once. Pick one.";
    }
  }
];

const CREW_NAME_KEYWORDS = {
  sarah: ['sarah', 'chen'],
  james: ['james', 'stellar', 'grandfather', 'grandpa'],
  clark: ['clark'],
  mitchell: ['mitchell', 'eagle'],
  thorne: ['thorne', 'farah'],
  hayes: ['hayes'],
  reeves: ['reeves'],
  ramos: ['ramos'],
  carmelon: ['carmelon', 'professor'],
  patel: ['patel']
};

export function detectCrewAdviceIntent(input) {
  const normalized = String(input || '').toLowerCase();
  const isAdviceRequest = normalized.includes('ask') &&
    (normalized.includes('advice') || normalized.includes('recommend') ||
     normalized.includes('what do you think') || normalized.includes('thoughts') ||
     normalized.includes('what should'));
  if (!isAdviceRequest) return { isAdvice: false };
  for (const [key, keywords] of Object.entries(CREW_NAME_KEYWORDS)) {
    if (keywords.some(kw => normalized.includes(kw))) {
      const advisor = CREW_ADVISORS.find(a => a.key === key);
      if (advisor) return { isAdvice: true, advisor };
    }
  }
  return { isAdvice: true, advisor: null };
}

export function getAdvisorAdvice(campaign, advisorKey) {
  const advisor = CREW_ADVISORS.find(a => a.key === advisorKey);
  if (!advisor) return null;
  return advisor.advice(campaign);
}

export function getAllAdvice(campaign) {
  return CREW_ADVISORS.map(a => ({
    key: a.key,
    name: a.name,
    role: a.role,
    icon: a.icon,
    advice: a.advice(campaign)
  }));
}