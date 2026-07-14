// Pathfinder Journeys — Structured Crew Profiles
// Single source of truth for crew expertise, advice style, and priorities.
// Powers: Ask the Crew, Operations team scoring, Mission team selection.

export const CREW_PROFILES = {
  sarah: {
    displayName: 'Sarah Chen',
    role: 'Resistance Agent',
    expertise: [
      'Chen protocols',
      'relay compromise',
      'political family knowledge',
      'undercover comms'
    ],
    adviceStyle: 'sharp, wounded, suspicious, direct',
    priorities: ['signal security', 'truth about mother', 'resistance network', 'verification']
  },
  james: {
    displayName: 'James Stellar',
    role: 'Confluence Survivor',
    expertise: [
      'Confluence procedure',
      'survivor testimony',
      'enemy pattern recognition',
      'Confluence legal systems',
      'ship design knowledge'
    ],
    adviceStyle: 'haunted, dry, protective, tactical',
    priorities: ['Confluence counter-tactics', 'legal defense', 'pattern recognition', 'protecting Bub']
  },
  clark: {
    displayName: 'Cmdr Clark',
    role: 'Science / Sensors',
    expertise: [
      'evidence authentication',
      'legal framing',
      'chain of custody',
      'interrogation',
      'data analysis'
    ],
    adviceStyle: 'dry, sarcastic, brilliant, nervous',
    priorities: ['evidence quality', 'legal framing', 'clean packages', 'scientific truth']
  },
  mitchell: {
    displayName: 'Mitchell',
    role: 'Enhanced Scout',
    expertise: [
      'ambush detection',
      'shapeshifter suspicion',
      'danger sense',
      'deception detection'
    ],
    adviceStyle: 'instinctive, intense, nonverbal, protective',
    priorities: ['danger awareness', 'deception detection', 'security scanning', 'protecting crew']
  },
  thorne: {
    displayName: 'Cmdr Farah Thorne',
    role: 'Executive Officer / Tactical',
    expertise: [
      'New Titan politics',
      'colony trust',
      'civilian stakes',
      'family connection to Governor Thorne'
    ],
    adviceStyle: 'practical, protective, politically aware',
    priorities: ['civilian safety', 'crew safety', 'controlled escalation', 'New Titan stability']
  },
  hayes: {
    displayName: 'Lt Hayes',
    role: 'Engineering / Comms',
    expertise: [
      'reactor systems',
      'tactical repairs',
      'sensor packages',
      'broadcast capability',
      'Unity coordination'
    ],
    adviceStyle: 'clever, human, slightly irreverent',
    priorities: ['communications', 'systems', 'morale', 'creative misdirection']
  },
  reeves: {
    displayName: 'Lt Reeves',
    role: 'Investigation / Pattern Analysis',
    expertise: [
      'investigation',
      'records',
      'inconsistencies',
      'quiet questioning'
    ],
    adviceStyle: 'quiet, analytical, suspicious',
    priorities: ['hidden patterns', 'false records', 'enemy tells', 'verification']
  },
  carmelon: {
    displayName: 'Professor Carmelon',
    role: 'Science / Temporal Anomalies',
    expertise: [
      'temporal anomalies',
      'Architect technology',
      'future-memory interpretation',
      'alien biology'
    ],
    adviceStyle: 'brilliant, worried, theoretical',
    priorities: ['unknown variables', 'future echoes', 'dangerous technology', 'scientific truth']
  },
  ramos: {
    displayName: 'Chief Ramos',
    role: 'Chief Engineer',
    expertise: [
      'ship systems',
      'damage control',
      'technical recovery',
      'battlefield improvisation'
    ],
    adviceStyle: 'practical, tough, no-nonsense',
    priorities: ['ship readiness', 'system priorities', 'damage control', 'crew survival']
  },
  patel: {
    displayName: 'Ens Patel',
    role: 'Junior Engineer / New Titan Native',
    expertise: [
      'comms',
      'signal traces',
      'overlooked details',
      'New Titan contacts'
    ],
    adviceStyle: 'earnest, emotional, detail-oriented',
    priorities: ['signal investigation', 'New Titan connections', 'family safety', 'small details']
  },
  voss: {
    displayName: 'Dr Voss',
    role: 'Medical',
    expertise: [
      'biological irregularities',
      'behavior mismatches',
      'crew health'
    ],
    adviceStyle: 'dry, clinical, skeptical',
    priorities: ['biological screening', 'crew health', 'behavioral analysis'],
    timelineLocked: true,
    spoilerNote: 'Before Arc 3, Voss provides medical advice only. After Arc 3 Ch 4, Voss is dead and unavailable.'
  }
};

export function getCrewProfile(key) {
  return CREW_PROFILES[key] || null;
}

export function getCrewDisplayName(key) {
  return CREW_PROFILES[key]?.displayName || key;
}

export function getCrewExpertiseSummary(key, maxItems = 3) {
  const profile = CREW_PROFILES[key];
  if (!profile?.expertise?.length) return '';
  return profile.expertise.slice(0, maxItems).join(' · ');
}