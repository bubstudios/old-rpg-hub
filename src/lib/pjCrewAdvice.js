// Pathfinder Journeys — Crew Advice System
// Expertise-driven advice generation. Each crew member reads current game state
// through the lens of their expertise and produces contextual advice with
// in-character quotes, recommended actions, and risk warnings.

import { getClockValue } from '@/lib/pjClocks';
import { CREW_PROFILES } from '@/lib/pjCrewProfiles';

// === AVAILABILITY ===

function getCrewStatus(crewKey, campaign) {
  const flags = campaign?.world_state?.quest_flags || {};
  const crewStatus = flags.crew_status || {};
  return crewStatus[crewKey] || 'active';
}

export function isCrewAvailable(crewKey, campaign) {
  const flags = campaign?.world_state?.quest_flags || {};
  const crewStatus = flags.crew_status || {};
  const status = crewStatus[crewKey];

  if (status === 'dead') return false;
  if (status === 'captured') return false;
  if (status === 'away_mission') return false;
  if (status === 'injured_unavailable') return false;

  const hidden = flags.crew_hidden || {};
  if (hidden[crewKey] === true) return false;

  // Voss timeline protection — dead after Arc 3 Ch 4 execution
  if (crewKey === 'voss') {
    const arc3 = flags.arc3 || {};
    if (arc3.vossExecuted) return false;
  }

  return true;
}

function getUnavailableReason(crewKey, campaign) {
  const status = getCrewStatus(crewKey, campaign);
  const name = CREW_PROFILES[crewKey]?.displayName || crewKey;

  if (status === 'dead') return `${name} is deceased and cannot advise.`;
  if (status === 'captured') return `${name} has been captured and is not available.`;
  if (status === 'away_mission') return `${name} is on an away mission and cannot advise in real time.`;
  if (status === 'injured_unavailable') return `${name} is injured and unavailable for consultation.`;

  if (crewKey === 'voss') {
    const arc3 = campaign?.world_state?.quest_flags?.arc3 || {};
    if (arc3.vossExecuted) return `Dr. Voss is deceased and cannot advise.`;
  }

  return `${name} is unavailable.`;
}

// === CREW ADVISORS ===
// Each advisor's generateAdvice returns: { quote, recommendedActions, riskWarning? }

export const CREW_ADVISORS = [
  {
    key: 'sarah',
    icon: 'User',
    generateAdvice: (campaign) => {
      const heat = getClockValue(campaign, 'confluence_heat');
      const chen = getClockValue(campaign, 'chen_countermeasures');
      const truth = getClockValue(campaign, 'public_truth');
      const stability = getClockValue(campaign, 'new_titan_stability');

      if (heat > 60 && chen > 40) {
        return {
          quote: "Do not trust the channel just because it authenticated cleanly. Chen protocols can be spoofed, copied, or buried inside official traffic. Let me verify the handshake before we send anything else.",
          recommendedActions: [
            'Verify the rendezvous channel for Chen-linked relay interference',
            'Send only partial evidence until the channel is confirmed secure',
            'Check for Chen protocol signatures in recent transmissions',
            'Prepare a counter-narrative in case Chen moves first'
          ],
          riskWarning: 'If Chen\'s network heard the first burst, they\'ll be waiting for the second.'
        };
      }
      if (chen > 50) {
        return {
          quote: "My mother's people are already preparing a counter-narrative. Whatever you decide, assume they've already thought three moves ahead. We need to be the fourth move they didn't see.",
          recommendedActions: [
            'Monitor Chen-authenticated channels for forged advisories',
            'Prepare verified evidence that survives political attack',
            'Consider a controlled release through back channels',
            'Do not let Sarah be used as a symbol — use me as an operative'
          ],
          riskWarning: 'Chen will attack the witness, not the facts. Expect discredit campaigns.'
        };
      }
      if (truth < 25 && stability < 40) {
        return {
          quote: "We need proof that survives scrutiny — not just proof that exists. One verified file is worth ten rumors. New Titan won't move on whispers.",
          recommendedActions: [
            'Ask Clark to prepare a single verified evidence file',
            'Use family channels to reach Governor Thorne privately',
            'Keep evidence physical, not digital',
            'Build credibility before making claims'
          ]
        };
      }
      return {
        quote: "Whatever you decide, I want in on Chen decisions. Don't use me as a symbol — use me as an operative. I know how my mother thinks. That's worth more than evidence right now.",
        recommendedActions: [
          'Include Sarah in all Chen-related decisions',
          'Use Sarah\'s Earth Command contacts for intelligence',
          'Verify all incoming transmissions through Sarah\'s network',
          'Prepare resistance cell activation if the time comes'
        ]
      };
    }
  },
  {
    key: 'james',
    icon: 'BookMarked',
    generateAdvice: (campaign) => {
      const claim = getClockValue(campaign, 'confluence_claim');
      const discredit = getClockValue(campaign, 'discredit_campaign');
      const heat = getClockValue(campaign, 'confluence_heat');

      if (claim > 70) {
        return {
          quote: "The Confluence will not argue the truth. They'll attack the chain of custody. Who handled the evidence? Who can testify they didn't tamper with it? That's where they win — not in the facts, but in the procedure.",
          recommendedActions: [
            'Have Clark document every step of evidence handling',
            'Prepare witnesses who can testify to chain of custody',
            'Use James\'s Confluence procedure knowledge to anticipate legal attacks',
            'Build a physical evidence courier, not digital'
          ],
          riskWarning: 'The Confluence process is legal, not military. They win by making surrender the only reasonable option.'
        };
      }
      if (discredit > 50) {
        return {
          quote: "They'll say I'm compromised. That I was augmented against my will and can't be trusted. They always attack the witness, not the facts. Be ready — and don't let them isolate me from the evidence chain.",
          recommendedActions: [
            'Prepare a counter-narrative: James survived, that\'s not a weakness',
            'Use James\'s augmentations as proof of Confluence coercion',
            'Document Confluence enforcement doctrine from James\'s testimony',
            'Do not let James testify alone — bring corroborating evidence'
          ],
          riskWarning: 'They\'re starting to whisper "rogue vessel, temporally compromised." It will get worse.'
        };
      }
      if (heat > 50) {
        return {
          quote: "The Confluence likes rooms where everyone thinks they are safe. If they let us choose the rendezvous, they will try to own the path to it. If they choose it, they already own the room. Assume compromise either way.",
          recommendedActions: [
            'Use a decoy route to the rendezvous',
            'Bring security overwatch — Mitchell if possible',
            'Scan for Confluence surveillance along the approach',
            'Have an exit vector ready before you arrive'
          ]
        };
      }
      return {
        quote: "The Confluence process is legal, not military. They win by making surrender the only reasonable option. Your job is to make resistance the reasonable option. Give people a plan, not just a warning.",
        recommendedActions: [
          'Frame resistance as the practical choice, not the heroic one',
          'Use Confluence procedure knowledge to find legal weaknesses',
          'Prepare testimony that is calm and factual, not emotional',
          'Give New Titan a concrete defense plan they can believe in'
        ]
      };
    }
  },
  {
    key: 'clark',
    icon: 'FlaskConical',
    generateAdvice: (campaign) => {
      const temporal = getClockValue(campaign, 'temporal_instability');
      const truth = getClockValue(campaign, 'public_truth');
      const claim = getClockValue(campaign, 'confluence_claim');

      if (temporal > 60) {
        return {
          quote: "Temporal Instability is climbing. If you keep leaning on future memories, we'll start seeing paradox effects — things that shouldn't be here, people who remember differently. I can't protect you from that. The timeline is not a tool.",
          recommendedActions: [
            'Avoid using future memories for the next several decisions',
            'Have Carmelon monitor Architect systems for instability spikes',
            'Document any temporal anomalies for future reference',
            'Let events unfold naturally for a while'
          ],
          riskWarning: 'Continued temporal overuse may cause permanent timeline divergence.'
        };
      }
      if (claim > 50 || truth < 30) {
        return {
          quote: "If New Titan is cautious, that is good. Caution means they are weighing credibility. We should give them a clean chain of custody, not a mountain of frightening claims. One strong file beats a dozen weak ones.",
          recommendedActions: [
            'Prepare a legal evidence package with clear chain of custody',
            'Separate confirmed proof from future-memory claims',
            'Bring a physical copy to the rendezvous',
            'Document authentication steps for each piece of evidence'
          ]
        };
      }
      if (temporal > 30) {
        return {
          quote: "Be careful with Architect data. Every time we use it, the timeline ripples. It's a tool, not a script. I can analyze what we have, but I can't promise the analysis will stay true if the timeline shifts again.",
          recommendedActions: [
            'Use Architect data sparingly and document each use',
            'Have Clark cross-reference temporal data against current records',
            'Avoid acting on future-memory details that could change',
            'Flag any inconsistencies between memories and current reality'
          ]
        };
      }
      return {
        quote: "We need a clean evidence package. Small, verifiable, impossible to dismiss. One strong file beats a dozen weak ones. Give me the best piece and I'll make it airtight.",
        recommendedActions: [
          'Ask Clark to assemble the strongest single evidence file',
          'Document authentication and verification steps',
          'Separate confirmed evidence from speculative claims',
          'Prepare a physical evidence package for the rendezvous'
        ]
      };
    }
  },
  {
    key: 'mitchell',
    icon: 'Eye',
    generateAdvice: (campaign) => {
      const suspicion = getClockValue(campaign, 'shapeshifter_suspicion');
      const heat = getClockValue(campaign, 'confluence_heat');

      if (suspicion > 50) {
        return {
          quote: "Mitchell gives a sharp warning chirp. Something is wrong. Not everyone who looks like themselves is themselves. I can feel it. The wrongness is close.",
          recommendedActions: [
            'Scan everyone at the rendezvous with biometric verification',
            'Trust the scan results, not the faces',
            'Watch for behavioral tells — wrong cadence, missing verbal tics',
            'Keep Mitchell in a position where he can watch faces during meetings'
          ],
          riskWarning: 'Shapeshifters maintain cover until mission demands violence. Suspicion should build slowly.'
        };
      }
      if (suspicion > 20 || heat > 50) {
        return {
          quote: "Mitchell ruffles his feathers and stares at the approach corridor. He says the clean road is the dangerous one. Too quiet. Too straight. Something waits where the path looks easiest.",
          recommendedActions: [
            'Avoid the obvious approach route',
            'Scan for ambush along the rendezvous path',
            'Send an advance scout before committing',
            'Watch body language during all meetings'
          ],
          riskWarning: 'Assume the meeting is watched. Assume one person there is not who they say they are.'
        };
      }
      return {
        quote: "Mitchell settles on James's shoulder, alert but calm. I can sense deception, but I can't see through walls. Give me a position where I can watch faces and I'll tell you who's lying.",
        recommendedActions: [
          'Position Mitchell where he can observe all meeting participants',
          'Let Mitchell react naturally — don\'t explain his behavior to outsiders',
          'Watch for Mitchell\'s body language as a warning system',
          'Trust his instincts even when you can\'t verify them'
        ]
      };
    }
  },
  {
    key: 'thorne',
    icon: 'Shield',
    generateAdvice: (campaign) => {
      const heat = getClockValue(campaign, 'confluence_heat');
      const stability = getClockValue(campaign, 'new_titan_stability');
      const morale = getClockValue(campaign, 'crew_morale');

      if (heat > 60 && stability < 40) {
        return {
          quote: "New Titan is listening, but they are not ready to stand beside us in public. That is not cowardice. That is survival. Do not push them into a public declaration yet. Keep the rendezvous private, control the evidence chain, and assume the Confluence is already looking for a way to make us look unstable.",
          recommendedActions: [
            'Keep the rendezvous private — no public broadcast yet',
            'Bring physical proof to the meeting, not digital transmissions',
            'Have Sarah verify the channel is clean',
            'Ask Clark to prepare the cleanest possible legal package'
          ],
          riskWarning: 'If New Titan panics further, they may surrender just to make the fear stop.'
        };
      }
      if (heat > 70) {
        return {
          quote: "We can't keep broadcasting without expecting a response. Set a Sanctuary ship as overwatch before the next transmission. If they come for us, I want an exit vector — not a heroic last stand.",
          recommendedActions: [
            'Place a Sanctuary ship in silent overwatch',
            'Map all exit vectors from the current position',
            'Minimize Pathfinder\'s signal signature',
            'Have Ramos prepare emergency FTL jump capability'
          ],
          riskWarning: 'The Confluence is actively hunting us. Every broadcast paints a target.'
        };
      }
      if (stability < 30) {
        return {
          quote: "New Titan is panicking. If we push too hard without giving them a plan, they'll surrender just to make the fear stop. Give them something to fight for, not just something to fear.",
          recommendedActions: [
            'Offer New Titan a concrete defense plan, not just warnings',
            'Use my family connection to Governor Thorne to build trust',
            'Keep evidence controlled — a mountain of frightening claims will backfire',
            'Give them hope: show that resistance is possible, not just necessary'
          ]
        };
      }
      if (morale < 30) {
        return {
          quote: "The crew is stretched thin. I can see it in their eyes. We need a win — not a grand victory, just something that proves the fight is worth it. Give them a moment of hope before the next push.",
          recommendedActions: [
            'Acknowledge the crew\'s strain openly',
            'Choose a mission with achievable goals, not a desperate gamble',
            'Let the crew see the impact of their work',
            'Protect your people — don\'t spend lives carelessly'
          ]
        };
      }
      return {
        quote: "If this saves New Titan, we go. But I want eyes on every approach vector. No blind spots. And Bub — no grand speech unless they force one.",
        recommendedActions: [
          'Secure all approach vectors to the rendezvous',
          'Bring physical evidence only',
          'Keep Sanctuary ships in quiet overwatch',
          'Have an exit vector ready'
        ]
      };
    }
  },
  {
    key: 'hayes',
    icon: 'Megaphone',
    generateAdvice: (campaign) => {
      const truth = getClockValue(campaign, 'public_truth');
      const spark = getClockValue(campaign, 'resistance_spark');
      const heat = getClockValue(campaign, 'confluence_heat');

      if (heat > 50) {
        return {
          quote: "We can make the next message look boring. Administrative. Nothing flashy. If the Confluence is watching for dramatic resistance traffic, let's give them paperwork. The best signal is the one nobody notices.",
          recommendedActions: [
            'Send boring low-priority admin cover traffic',
            'Prepare an emergency broadcast but do not use it yet',
            'Use Unity to watch for signal reflection or interception',
            'Mask all evidence transmissions as routine maintenance'
          ]
        };
      }
      if (truth > 50 && spark > 50) {
        return {
          quote: "The resistance is listening. If we broadcast now, it's not just information — it's a signal that it's okay to fight back. But once we say it, we can't take it back. Are we ready for what comes next?",
          recommendedActions: [
            'Prepare a controlled, verified broadcast',
            'Contextualize the evidence — don\'t just dump raw data',
            'Time the broadcast for maximum impact',
            'Have a counter-narrative ready for the inevitable response'
          ],
          riskWarning: 'Once the truth is public, the Confluence will escalate. There is no going back.'
        };
      }
      if (truth < 30) {
        return {
          quote: "Nobody knows yet. One broadcast could change everything — or it could get dismissed as alien propaganda. Let me prepare a controlled release with context and verification. We need people to believe, not just hear.",
          recommendedActions: [
            'Prepare a controlled, contextualized evidence release',
            'Attach verification metadata to all evidence files',
            'Build a narrative around the evidence — facts need a story',
            'Test the waters with a back-channel release first'
          ]
        };
      }
      return {
        quote: "I can prepare a controlled release — verified, contextualized, timed for maximum impact. But we need to decide: do we want people to know, or do we want them to believe? Those are two different missions.",
        recommendedActions: [
          'Have Hayes prepare a broadcast package with context and verification',
          'Decide between public awareness and public belief',
          'Consider a phased release rather than a single dump',
          'Keep Unity monitoring signal integrity during any broadcast'
        ]
      };
    }
  },
  {
    key: 'reeves',
    icon: 'Navigation',
    generateAdvice: (campaign) => {
      const chen = getClockValue(campaign, 'chen_countermeasures');
      const discredit = getClockValue(campaign, 'discredit_campaign');
      const exposure = getClockValue(campaign, 'mission_exposure');

      if (chen > 40 || discredit > 40) {
        return {
          quote: "The phrasing bothers me. They accepted receipt but avoided commitment. That may be normal caution, or someone inside New Titan Command is already advising them to slow-walk us. I want to see the names attached to the replies.",
          recommendedActions: [
            'Audit New Titan response language for unusual phrasing',
            'Check names attached to the reply — are they the right people?',
            'Look for unusual delay patterns in transmissions',
            'Cross-reference response timing against Chen-linked activity'
          ],
          riskWarning: 'Someone inside New Titan Command may be advising them to stall.'
        };
      }
      if (exposure > 50) {
        return {
          quote: "We're being tracked. I can see the pattern in the sensor logs — someone is shadowing us at extreme range. We can't stay in open space much longer.",
          recommendedActions: [
            'Plot an evasion route through the debris field',
            'Minimize active sensor usage',
            'Have Reeves analyze the tracking pattern for origin',
            'Consider a jump to throw off the tail'
          ]
        };
      }
      return {
        quote: "If we need to leave fast, give me a heading. I can have us in jumpspace in ninety seconds — but I need to know where we're going. A blind jump is worse than staying put.",
        recommendedActions: [
          'Identify two possible jump destinations in advance',
          'Pre-calculate jump coordinates for emergency extraction',
          'Keep the engines warm and the path clear',
          'Have Reeves ready for a ninety-second jump window'
        ]
      };
    }
  },
  {
    key: 'carmelon',
    icon: 'Atom',
    generateAdvice: (campaign) => {
      const temporal = getClockValue(campaign, 'temporal_instability');
      const heat = getClockValue(campaign, 'confluence_heat');

      if (temporal > 50) {
        return {
          quote: "The temporal fabric is strained. I can feel it — the echoes are getting louder, and louder means closer. If we push the Architect technology any further, we risk attracting something that notices temporal disturbance. And some things that notice are very old, and very patient.",
          recommendedActions: [
            'Cease all Architect technology activation immediately',
            'Have Carmelon monitor for temporal anomaly escalation',
            'Document all future-memory fragments before they fade',
            'Avoid decisions that could create paradox loops'
          ],
          riskWarning: 'Something old may be noticing our temporal activity. Patience is not always safe.'
        };
      }
      if (temporal > 25) {
        return {
          quote: "The future-memories are fragmenting. They're not wrong, but they're becoming less precise — like a signal degrading over distance. We can still use them, but we need to be honest about what we don't know. Certainty is a luxury we no longer have.",
          recommendedActions: [
            'Treat future-memories as hypotheses, not facts',
            'Have Carmelon cross-reference memories against current evidence',
            'Look for confirmation in present-day data before acting',
            'Track which memories are fading fastest'
          ]
        };
      }
      if (heat > 60) {
        return {
          quote: "There is alien technology in the Confluence archives that we don't understand. Not because it's too complex — because it was designed for a purpose we haven't imagined yet. Be careful what we poke. Some doors open inward.",
          recommendedActions: [
            'Have Carmelon analyze any recovered Confluence technology cautiously',
            'Do not activate unknown alien systems without preparation',
            'Cross-reference alien technology against Sanctuary archives',
            'Keep Mitchell away from unknown temporal systems'
          ]
        };
      }
      return {
        quote: "The future is not a map. It's a memory of something that hasn't happened yet. We can learn from it, but we cannot follow it like a road. The moment we treat it as instructions, we stop making choices — and that's when we lose.",
        recommendedActions: [
          'Use future-memories as context, not commands',
          'Have Carmelon interpret temporal data with appropriate caution',
          'Document all Architect anomalies for future study',
          'Keep temporal knowledge crew-only — do not broadcast'
        ]
      };
    }
  },
  {
    key: 'ramos',
    icon: 'Wrench',
    generateAdvice: (campaign) => {
      const morale = getClockValue(campaign, 'crew_morale');
      const heat = getClockValue(campaign, 'confluence_heat');
      const shipStats = campaign?.world_state?.quest_flags?.ship_stats || {};
      const integrity = shipStats.hull_integrity ?? 100;

      if (integrity < 40) {
        return {
          quote: "The Pathfinder can't take another fight right now. I need time — at least six hours in the field to patch the hull. Don't pick a fight I can't get you out of. I can only work miracles when the ship isn't actively exploding.",
          recommendedActions: [
            'Avoid combat engagements for at least six hours',
            'Have Ramos prioritize hull integrity repairs',
            'Keep Sanctuary ships as a defensive screen',
            'Do not push the engines past safe limits'
          ],
          riskWarning: 'Another engagement at current hull integrity could be catastrophic.'
        };
      }
      if (heat > 60) {
        return {
          quote: "They're hunting us. I can mask our signature, rig a burst transmitter, or harden the hull — but not all three at once. Pick one. And pick fast, because the longer we sit here, the more time they have to find us.",
          recommendedActions: [
            'Choose: signature masking, burst transmitter, or hull hardening',
            'Have Ramos minimize engine heat output',
            'Prepare emergency systems for rapid FTL jump',
            'Divert power from non-essential systems to defenses'
          ]
        };
      }
      if (morale < 30) {
        return {
          quote: "The ship is holding, but the crew isn't. I can fix engines, Bub. I can't fix people. Give them something to believe in, or the next crisis will break them. A ship runs on morale as much as fuel.",
          recommendedActions: [
            'Give the crew a clear, achievable goal',
            'Acknowledge their hard work openly',
            'Prioritize crew rest if possible — tired people make mistakes',
            'Let Ramos handle the ship so the crew can focus on the mission'
          ]
        };
      }
      return {
        quote: "I can mask our signature, rig a burst transmitter, or harden the hull — but not all three at once. Pick one. And tell me before you need it, not after.",
        recommendedActions: [
          'Choose a system priority: stealth, comms, or defense',
          'Have Ramos prepare the chosen system in advance',
          'Keep emergency repair capability in reserve',
          'Do not push systems beyond rated capacity without warning'
        ]
      };
    }
  },
  {
    key: 'patel',
    icon: 'Radio',
    generateAdvice: (campaign) => {
      const stability = getClockValue(campaign, 'new_titan_stability');
      const chen = getClockValue(campaign, 'chen_countermeasures');

      if (stability < 40) {
        return {
          quote: "My family is down there, Captain. They're scared. They don't know what's coming. If we can give them even a little hope — even just proof that someone is fighting for them — that matters more than you think.",
          recommendedActions: [
            'Use Patel\'s family contacts on New Titan for intelligence',
            'Send a private message to Patel\'s family — hope spreads',
            'Cross-reference New Titan comm patterns through Patel\'s contacts',
            'Look for overlooked details in colonial transmission logs'
          ]
        };
      }
      if (chen > 40) {
        return {
          quote: "I found something in the relay logs. A tiny inconsistency — a handshake that took 0.3 seconds longer than it should have. That might be nothing. Or it might be someone spoofing Chen protocols. I can trace it if you give me time.",
          recommendedActions: [
            'Have Patel trace the anomalous relay handshake',
            'Look for similar timing anomalies in other transmissions',
            'Cross-reference the handshake source against known Chen channels',
            'Check for relay bounce patterns that indicate interception'
          ]
        };
      }
      return {
        quote: "I can pull records from my family contacts on the surface. Nothing official — just what people are saying, what they're seeing, what the colony control isn't telling the public. Sometimes the small details are the ones that matter.",
        recommendedActions: [
          'Use Patel\'s New Titan contacts for ground-level intelligence',
          'Cross-reference colonial comm traffic for overlooked details',
          'Trace signal anomalies through the relay network',
          'Look for patterns in routine administrative traffic'
        ]
      };
    }
  },
  {
    key: 'voss',
    icon: 'Stethoscope',
    generateAdvice: (campaign) => {
      const suspicion = getClockValue(campaign, 'shapeshifter_suspicion');
      const arc3 = campaign?.world_state?.quest_flags?.arc3 || {};
      const morale = getClockValue(campaign, 'crew_morale');

      // Before Arc 3, Voss provides medical advice only — no shapeshifter references
      if (!arc3.kimelonInvented) {
        if (morale < 30) {
          return {
            quote: "The crew is showing signs of cumulative stress — disrupted sleep, irritability, minor psychosomatic complaints. It's not weakness, Captain. It's biology under sustained pressure. I recommend a rest cycle if the tactical situation allows it.",
            recommendedActions: [
              'Schedule a rest cycle for non-essential crew',
              'Monitor crew for signs of acute stress reaction',
              'Consider rotating bridge shifts to prevent burnout',
              'Keep medical bay stocked for stress-related complaints'
            ]
          };
        }
        return {
          quote: "Crew health is stable. I'm monitoring for fatigue, stress reactions, and any signs of exposure to unknown pathogens. If we encounter alien biology, I want samples before we let anyone touch it. Medical protocols exist for a reason.",
          recommendedActions: [
            'Maintain standard medical screening protocols',
            'Quarantine any alien biological samples',
            'Monitor crew health after away missions',
            'Keep medical supplies fully stocked'
          ]
        };
      }

      // Arc 3+ — Voss can discuss biological screening
      if (suspicion > 40) {
        return {
          quote: "I can screen for biological irregularities — body temperature variations, retinal inconsistencies, blood panel anomalies. A kimelon scan is faster, but a medical workup catches things a scanner might miss. Let me know who needs checking.",
          recommendedActions: [
            'Have Voss run medical screenings on key personnel',
            'Cross-reference medical results with kimelon scan data',
            'Look for biometric inconsistencies over time',
            'Check for behavioral mismatches during medical exams'
          ]
        };
      }
      return {
        quote: "Medical is standing by. If we encounter unknown biology or need crew screening, I'm ready. Don't wait until someone collapses to call medical — early intervention saves lives.",
        recommendedActions: [
          'Schedule routine medical screenings for the crew',
          'Prepare medical bay for potential casualties',
          'Screen all new contacts for biological anomalies',
          'Maintain quarantine protocols for unknown biology'
        ]
      };
    }
  }
];

// === NAME KEYWORDS (for intent detection) ===

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
  patel: ['patel'],
  voss: ['voss', 'doctor', 'doc']
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
      const profile = CREW_PROFILES[key];
      if (advisor) return { isAdvice: true, advisor: { key, name: profile?.displayName || key, role: profile?.role || '', ...advisor } };
    }
  }
  return { isAdvice: true, advisor: null };
}

// === ADVICE RETRIEVAL ===

export function getAdvisorAdvice(campaign, advisorKey) {
  const advisor = CREW_ADVISORS.find(a => a.key === advisorKey);
  if (!advisor) return null;

  if (!isCrewAvailable(advisorKey, campaign)) {
    return getUnavailableReason(advisorKey, campaign);
  }

  return advisor.generateAdvice(campaign);
}

export function getAllAdvice(campaign) {
  return CREW_ADVISORS.map(a => {
    const profile = CREW_PROFILES[a.key] || {};
    const available = isCrewAvailable(a.key, campaign);
    let advice;
    if (available) {
      advice = a.generateAdvice(campaign);
    } else {
      advice = getUnavailableReason(a.key, campaign);
    }
    return {
      key: a.key,
      name: profile.displayName || a.key,
      role: profile.role || '',
      icon: a.icon,
      expertise: profile.expertise || [],
      advice,
      available
    };
  });
}

// === FORMATTER ===
// Formats structured advice as readable discussion text for the journal.

export function formatCrewAdvice(advisor, advice) {
  // Unavailable messages are plain strings — pass through
  if (typeof advice === 'string') return advice;

  const name = advisor.displayName || advisor.name;
  const role = advisor.role || '';

  let text = `${name}${role ? ` — ${role}` : ''}\n\n"${advice.quote}"`;

  if (advice.recommendedActions?.length) {
    text += '\n\nRecommended Actions:';
    advice.recommendedActions.forEach((action, i) => {
      text += `\n${i + 1}. ${action}`;
    });
  }

  if (advice.riskWarning) {
    text += `\n\n⚠ ${advice.riskWarning}`;
  }

  return text;
}