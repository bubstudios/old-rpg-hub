// Pathfinder Journeys — Future Echoes System
// Future Memories are NOT evidence. They are private crew knowledge from the
// 473-year future jump — vague, emotional, sometimes useful flashes that
// trigger during major decisions and give the crew an edge without proof.

// === ECHO TYPES ===
export const ECHO_TYPES = {
  tactical: {
    label: 'Tactical Echo',
    icon: 'Crosshair',
    color: 'text-sky-400',
    bg: 'bg-sky-500/10',
    border: 'border-sky-500/30',
    desc: 'A flash of danger — ambush, blind spot, enemy move.'
  },
  emotional: {
    label: 'Emotional Echo',
    icon: 'Heart',
    color: 'text-rose-400',
    bg: 'bg-rose-500/10',
    border: 'border-rose-500/30',
    desc: 'The weight of a future that hasn\'t happened yet.'
  },
  evidence: {
    label: 'Evidence Echo',
    icon: 'FileSearch',
    color: 'text-amber-400',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/30',
    desc: 'A hint about where to look — not proof itself.'
  },
  warning: {
    label: 'Warning Echo',
    icon: 'AlertTriangle',
    color: 'text-purple-400',
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/30',
    desc: 'A vague sense of regret — don\'t do what they did.'
  }
};

// === CERTAINTY LEVELS ===
export const CERTAINTY_LEVELS = {
  low: { label: 'Low', desc: 'Emotional impression only', color: 'text-muted-foreground' },
  medium: { label: 'Medium', desc: 'Useful but incomplete', color: 'text-amber-400' },
  high: { label: 'High', desc: 'Strong warning', color: 'text-orange-400' },
  critical: { label: 'Critical', desc: 'Rare, major story trigger', color: 'text-red-400' }
};

// === CREW MEMORY AFFINITY ===
// Maps crew keys to thematic triggers. Used by the GM to pick who receives the echo.
export const CREW_AFFINITY = {
  bub: ['command', 'moral_choice', 'future_war'],
  sarah: ['chen', 'relay', 'communications', 'family'],
  james: ['confluence', 'captivity', 'survivor_patterns'],
  clark: ['evidence', 'law', 'far_reach'],
  mitchell: ['combat', 'ambush', 'predator_instinct', 'shapeshifter'],
  thorne: ['new_titan', 'civilian_risk', 'colony_loss'],
  hayes: ['sacrifice', 'reactor', 'unity_echo'],
  reeves: ['investigation', 'records', 'inconsistency'],
  carmelon: ['architect', 'temporal', 'anomaly'],
  ramos: ['engineering', 'ship_damage', 'systems'],
  patel: ['comms', 'signals', 'small_details'],
  voss: ['medical', 'biology', 'behavioral_wrongness']
};

// === CREW DISPLAY NAMES ===
export const CREW_NAMES = {
  bub: 'Captain Bub Stellar',
  sarah: 'Sarah Chen',
  james: 'James Stellar',
  clark: 'Cmdr Clark',
  mitchell: 'Mitchell',
  thorne: 'Cmdr Farah Thorne',
  hayes: 'Lt Hayes',
  reeves: 'Lt Reeves',
  carmelon: 'Prof Carmelon',
  ramos: 'Chief Ramos',
  patel: 'Ens Patel',
  voss: 'Dr Voss'
};

// === SECRECY WARNING ===
// When the player tries to use Future Memories publicly, show this warning.
export const SECRECY_WARNING = {
  title: 'CREW SECRET',
  body: 'Future Memories cannot be verified. Using them publicly may damage Pathfinder\'s credibility and make Bub appear compromised.',
  effects: [
    { label: 'Public Truth', change: -5 },
    { label: 'New Titan Trust', change: -4 },
    { label: 'Chen Countermeasures', change: +8 },
    { label: 'Temporal Instability', change: +3 }
  ]
};

// === HELPER: Get echoes from campaign state ===
export function getUnlockedEchoes(campaign) {
  const flags = campaign?.world_state?.quest_flags || {};
  return flags.future_echoes || [];
}

// === HELPER: Get cooldown remaining ===
export function getEchoCooldown(campaign) {
  const flags = campaign?.world_state?.quest_flags || {};
  return flags.echo_cooldown || 0;
}