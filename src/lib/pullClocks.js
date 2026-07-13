// THE PULL — Local Clock Metadata, Qualitative Labels, and Stage Caps

// Clock direction:
//   Survival/danger clocks (thirst, heat, fatigue, raider_threat, pressure):
//     higher = worse
//   Supply/stability clocks (air, purifier_stability, dome_stability):
//     higher = better
//   Trust/relationship clocks (camp_trust, dome_trust):
//     higher = better
export const LOCAL_CLOCK_META = {
  thirst:             { label: 'Thirst',              highIsBad: true  },
  heat_exposure:      { label: 'Heat Exposure',       highIsBad: true  },
  fatigue:            { label: 'Fatigue',             highIsBad: true  },
  camp_trust:         { label: 'Camp Trust',          highIsBad: false },
  purifier_stability: { label: 'Purifier Stability',  highIsBad: false },
  raider_threat:      { label: 'Raider Threat',       highIsBad: true  },
  air:                { label: 'Air Supply',          highIsBad: false },
  pressure:           { label: 'Pressure',            highIsBad: true  },
  swimming_fatigue:   { label: 'Swimming Fatigue',    highIsBad: true  },
  blood_loss:         { label: 'Blood Loss',          highIsBad: true  },
  dome_stability:     { label: 'Dome Stability',       highIsBad: false },
  dome_trust:         { label: 'Dome Trust',           highIsBad: false },
  air_supply:         { label: 'Dome Air Supply',     highIsBad: false },
  dreadwraith_threat: { label: 'Dreadwraith Threat',  highIsBad: true  }
};

// Qualitative label for a clock value — gives the player a word, not just a number
export function getClockLabel(key, value) {
  const meta = LOCAL_CLOCK_META[key];
  if (!meta) return '';
  const v = Math.round(value || 0);

  // Camp Trust has its own narrative scale
  if (key === 'camp_trust') {
    if (v <= 10) return 'Hostile';
    if (v <= 25) return 'Wary';
    if (v <= 45) return 'Provisional';
    if (v <= 65) return 'Useful';
    if (v <= 80) return 'Trusted';
    if (v <= 95) return 'Hero';
    return 'Family';
  }

  if (meta.highIsBad) {
    // Danger clocks: higher = worse
    if (v <= 10) return 'Stable';
    if (v <= 25) return 'Manageable';
    if (v <= 50) return 'Strained';
    if (v <= 75) return 'Critical';
    return 'Lethal';
  }

  // Supply / stability clocks: higher = better
  if (v >= 80) return 'Stable';
  if (v >= 50) return 'Functional';
  if (v >= 25) return 'Failing';
  return 'Critical';
}

// Camp Trust caps by story stage — prevents camp_trust from reaching 100 too early.
// The GM enforces this server-side after applying LLM changes.
export function getCampTrustCap(flags) {
  const uf = flags.unlock_flags || {};
  const seq = flags.chapter1_sequence || 1;
  if (uf.raiders_defeated) return 85;
  if (uf.task_complete) return 55;
  if (seq >= 7) return 30;   // After agreeing to help
  if (seq >= 5) return 20;   // After water / naming
  return 15;                  // Before water — barely tolerated
}