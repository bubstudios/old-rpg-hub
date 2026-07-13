// THE PULL — Scene-Based Battle System
// Code-driven combat: the code owns the truth, the AI only narrates.
// Bullet is NOT a normal survivor. He is a dangerous anomaly who doesn't
// understand himself yet. His body remembers what his mind has forgotten.

// ─── Bullet's Combat Profile ───
export const BULLET_COMBAT_PROFILE = {
  combatInstinct: 90,
  endurance: 85,
  awareness: 65,
  advantageVsOrdinaryHuman: 25,
};

// ─── Combat Intent Options ───
export const COMBAT_INTENTS = {
  push_away: {
    label: 'Push Away / Keep Distance',
    short: 'Push Back',
    lethal: false,
    advantageMod: 0,
    fatigueCost: 3,
    desc: 'Create space without committing to a real strike.',
  },
  threaten: {
    label: 'Warn Him Off',
    short: 'Warn Off',
    lethal: false,
    advantageMod: -5,
    fatigueCost: 1,
    desc: 'Intimidate without violence. Works best when enemy morale is low.',
  },
  talk_down: {
    label: 'Talk Him Down',
    short: 'Talk Down',
    lethal: false,
    advantageMod: -10,
    fatigueCost: 0,
    desc: 'Try to end the fight with words. High risk, high reward.',
  },
  flee: {
    label: 'Run',
    short: 'Flee',
    lethal: false,
    advantageMod: -5,
    fatigueCost: 8,
    desc: 'Break away. May expose camp if not careful about route.',
  },
  flee_avoid_camp: {
    label: 'Run — Avoid Camp Route',
    short: 'Evade to Camp',
    lethal: false,
    advantageMod: -10,
    fatigueCost: 8,
    campExposureMod: -15,
    desc: 'Cut away from the direct path. Costs time and strength but protects camp.',
  },
  disarm: {
    label: 'Disarm',
    short: 'Disarm',
    lethal: false,
    advantageMod: -10,
    fatigueCost: 5,
    desc: 'Strip the enemy of their weapon. Harder than a normal strike.',
  },
  strike_disable: {
    label: 'Strike to Disable',
    short: 'Disable',
    lethal: false,
    advantageMod: -5,
    fatigueCost: 5,
    desc: 'Hit to injure, not kill. Nonlethal but brutal.',
  },
  strike_hard: {
    label: 'Strike Hard',
    short: 'Strike Hard',
    lethal: true,
    advantageMod: 5,
    fatigueCost: 6,
    desc: 'Commit to a damaging blow. May kill if it lands clean.',
  },
  kill: {
    label: 'Kill if Necessary',
    short: 'Kill',
    lethal: true,
    advantageMod: 15,
    fatigueCost: 5,
    desc: 'Lethal intent. Effective but heavy on the soul.',
  },
  use_environment: {
    label: 'Use Environment',
    short: 'Terrain',
    lethal: false,
    advantageMod: 0,
    fatigueCost: 4,
    desc: 'Use terrain, debris, or obstacles tactically.',
  },
  hide: {
    label: 'Hide / Break Line of Sight',
    short: 'Hide',
    lethal: false,
    advantageMod: -5,
    fatigueCost: 4,
    desc: 'Vanish into terrain. May end the fight if successful.',
  },
};

// ─── Weapon Bonuses ───
export const WEAPON_BONUSES = {
  item_pipe: 10,
  item_thread_blade: 15,
  item_sword_of_dawn: 30,
  unarmed: 0,
};

// ─── Result Types ───
export const RESULT_TYPES = {
  clean_success: { label: 'Clean Success', color: 'text-emerald-400', threshold: 85 },
  partial_success: { label: 'Partial Success', color: 'text-sky-400', threshold: 65 },
  stalemate: { label: 'Stalemate', color: 'text-amber-400', threshold: 45 },
  complication: { label: 'Complication', color: 'text-orange-400', threshold: 25 },
  failure: { label: 'Failure', color: 'text-red-400', threshold: 0 },
};

// ─── Battle Scene Definitions ───
export const BATTLE_SCENES = {
  ch1_hostile_scavenger_core: {
    sceneId: 'ch1_hostile_scavenger_core',
    enemyName: 'Hostile Scavenger',
    enemyType: 'ordinary_human',
    objective: 'Escape with the purifier core without leading the scavenger to camp',
    maxExchanges: 4,
    initialClocks: {
      bulletControl: 50,
      enemyMorale: 55,
      enemyInjury: 10,
      bulletInjury: 0,
      coreSecurity: 75,
      campExposureRisk: 20,
      noise: 25,
    },
    availableIntents: [
      'push_away', 'threaten', 'talk_down', 'flee', 'flee_avoid_camp',
      'disarm', 'strike_disable', 'strike_hard', 'use_environment', 'hide',
    ],
    results: {
      push_away: {
        clean_success: { narration: 'Bullet drives the scavenger back and creates enough space to escape.', enemyMorale: -25, coreSecurity: 10, bulletFatigue: 3 },
        partial_success: { narration: 'The scavenger staggers back, but he does not run.', enemyMorale: -10, bulletFatigue: 5 },
        stalemate: { narration: 'The two circle each other in the dust.', noise: 5 },
        complication: { narration: 'The scavenger shouts for someone unseen.', noise: 15, campExposureRisk: 10 },
        failure: { narration: 'The scavenger catches the pipe and yanks Bullet off balance.', bulletControl: -20, coreSecurity: -10 },
      },
      threaten: {
        clean_success: { narration: 'The scavenger backs off, hands raised.', enemyMorale: -30, bulletFatigue: 1 },
        partial_success: { narration: 'The scavenger hesitates, eyes darting.', enemyMorale: -15, bulletFatigue: 1 },
        stalemate: { narration: 'The scavenger snarls but holds his ground.', noise: 5 },
        complication: { narration: 'The scavenger laughs and calls the bluff.', enemyMorale: 5, noise: 10 },
        failure: { narration: 'The scavenger lunges while Bullet is talking.', bulletControl: -15, enemyMorale: 10 },
      },
      talk_down: {
        clean_success: { narration: 'Something shifts in the scavenger\u2019s eyes. He steps back.', enemyMorale: -40 },
        partial_success: { narration: 'The scavenger lowers his weapon slightly, still wary.', enemyMorale: -20 },
        stalemate: { narration: 'The scavenger listens, but desperation wins.' },
        complication: { narration: 'The scavenger spits. "Words don\u2019t fill a stomach."', noise: 10, enemyMorale: 5 },
        failure: { narration: 'The scavenger attacks mid-sentence.', bulletControl: -20, bulletInjury: 10 },
      },
      flee: {
        clean_success: { narration: 'Bullet breaks away and loses the scavenger in the ruins.', battleEnded: true, endType: 'escape', bulletFatigue: 8 },
        partial_success: { narration: 'Bullet escapes, but the scavenger might follow.', battleEnded: true, endType: 'escape_followed', campExposureRisk: 10, bulletFatigue: 8 },
        stalemate: { narration: 'Bullet pulls away but the scavenger keeps pace.', bulletFatigue: 6, noise: 5 },
        complication: { narration: 'Bullet stumbles over debris. The scavenger grabs at the core.', coreSecurity: -15, bulletFatigue: 5 },
        failure: { narration: 'The scavenger cuts off the escape route.', bulletControl: -25, bulletFatigue: 5 },
      },
      flee_avoid_camp: {
        clean_success: { narration: 'Bullet cuts through broken stone, losing the scavenger without leading him toward camp.', battleEnded: true, endType: 'escape_safe', bulletFatigue: 8, campExposureRisk: -15 },
        partial_success: { narration: 'The detour works, but it costs time and strength. The scavenger may still trail.', battleEnded: true, endType: 'escape_followed', bulletFatigue: 8, campExposureRisk: -10 },
        stalemate: { narration: 'Bullet moves through the ruins, but the scavenger keeps a line on him.', bulletFatigue: 6, campExposureRisk: -5 },
        complication: { narration: 'The longer route drains Bullet badly. Heat presses in.', bulletFatigue: 10, campExposureRisk: -5 },
        failure: { narration: 'The scavenger anticipated the flank and cuts Bullet off.', bulletControl: -20, bulletFatigue: 8 },
      },
      disarm: {
        clean_success: { narration: 'Bullet strips the weapon from the scavenger\u2019s grip. The man stumbles back, defenseless.', enemyMorale: -35, bulletFatigue: 5 },
        partial_success: { narration: 'The weapon clatters away, but the scavenger still has his hands.', enemyMorale: -20, bulletFatigue: 5 },
        stalemate: { narration: 'They grapple for the weapon. Neither gains control.', noise: 10, bulletFatigue: 4 },
        complication: { narration: 'The scavenger holds on and pulls Bullet close.', bulletControl: -10, bulletInjury: 5 },
        failure: { narration: 'The disarm fails. The scavenger uses the opening.', bulletControl: -20, bulletInjury: 10 },
      },
      strike_disable: {
        clean_success: { narration: 'Bullet strikes the scavenger\u2019s arm. The man crumples, clutching the limb.', enemyInjury: 60, enemyMorale: -30, bulletFatigue: 5 },
        partial_success: { narration: 'The pipe catches the scavenger\u2019s shoulder. He staggers but stays up.', enemyInjury: 30, enemyMorale: -15, bulletFatigue: 5 },
        stalemate: { narration: 'The scavenger blocks the strike with his forearm.', noise: 5, bulletFatigue: 4 },
        complication: { narration: 'The strike lands but glances off bone. The scavenger howls.', enemyInjury: 15, noise: 20, campExposureRisk: 5 },
        failure: { narration: 'The scavenger dodges and counters.', bulletControl: -15, bulletInjury: 10 },
      },
      strike_hard: {
        clean_success: { narration: 'The pipe connects with devastating force. The scavenger drops.', enemyInjury: 80, enemyMorale: -40, bulletFatigue: 6 },
        partial_success: { narration: 'A heavy blow staggers the scavenger. He\u2019s badly hurt.', enemyInjury: 50, enemyMorale: -25, bulletFatigue: 6 },
        stalemate: { narration: 'The scavenger barely blocks the heavy swing.', noise: 10, bulletFatigue: 5 },
        complication: { narration: 'The strike lands but the scavenger grabs Bullet\u2019s pipe arm.', enemyInjury: 20, bulletControl: -10, bulletFatigue: 5 },
        failure: { narration: 'The scavenger sidesteps and Bullet overextends.', bulletControl: -20, bulletFatigue: 6 },
      },
      kill: {
        clean_success: { narration: 'Bullet strikes to kill. The scavenger falls and does not rise.', enemyInjury: 100, enemyMorale: -100, battleEnded: true, endType: 'enemy_killed', bulletFatigue: 5 },
        partial_success: { narration: 'The blow is lethal, but it takes a moment. The scavenger crumples.', enemyInjury: 90, enemyMorale: -80, battleEnded: true, endType: 'enemy_killed', bulletFatigue: 5 },
        stalemate: { narration: 'The scavenger barely deflects the killing blow.', noise: 15, bulletFatigue: 5 },
        complication: { narration: 'The strike is brutal but not clean. The scavenger is dying slowly.', enemyInjury: 70, noise: 20 },
        failure: { narration: 'The scavenger was ready. He counters the killing strike.', bulletControl: -25, bulletInjury: 15 },
      },
      use_environment: {
        clean_success: { narration: 'Bullet kicks debris between them and slips into a half-buried corridor.', bulletControl: 20, noise: -5, bulletFatigue: 4 },
        partial_success: { narration: 'Bullet uses a broken wall for cover, creating a brief opening.', bulletControl: 10, bulletFatigue: 4 },
        stalemate: { narration: 'The terrain offers nothing useful right now.' },
        complication: { narration: 'Bullet\u2019s foot catches on debris. He stumbles.', bulletControl: -10, bulletFatigue: 3 },
        failure: { narration: 'The scavenger uses the terrain better than Bullet.', bulletControl: -15, noise: 5 },
      },
      hide: {
        clean_success: { narration: 'Bullet melts into the shadows of the ruins. The scavenger loses him.', battleEnded: true, endType: 'hidden', bulletFatigue: 4 },
        partial_success: { narration: 'Bullet breaks line of sight. The scavenger searches, uncertain.', enemyMorale: -10, bulletControl: 10, bulletFatigue: 4 },
        stalemate: { narration: 'There\u2019s nowhere to hide in this terrain.' },
        complication: { narration: 'The scavenger spots movement. Bullet\u2019s position is compromised.', noise: 15, campExposureRisk: 5 },
        failure: { narration: 'The scavenger tracks Bullet\u2019s trail easily.', bulletControl: -10, noise: 10 },
      },
    },
  },
};

// ─── Battle End Types ───
export const BATTLE_END_TYPES = {
  escape: { label: 'Escaped', desc: 'Bullet escaped with the core.', guilt: 0, campExposure: 0 },
  escape_followed: { label: 'Escaped — But Followed', desc: 'Bullet escaped, but the scavenger may trail him.', guilt: 0, campExposure: 10 },
  escape_safe: { label: 'Clean Escape', desc: 'Bullet escaped without leading the scavenger to camp.', guilt: 0, campExposure: -15 },
  hidden: { label: 'Vanished', desc: 'Bullet broke line of sight and disappeared.', guilt: 0, campExposure: 0 },
  enemy_fled: { label: 'Enemy Fled', desc: 'The scavenger broke and ran.', guilt: 0, campExposure: 0 },
  enemy_disabled: { label: 'Enemy Disabled', desc: 'The scavenger is down, but alive.', guilt: 1, campExposure: 0 },
  enemy_killed: { label: 'Enemy Killed', desc: 'The scavenger is dead.', guilt: 3, campExposure: 0, fearOfSelf: 1 },
  bullet_loses_position: { label: 'Position Lost', desc: 'Bullet lost his footing and advantage.', guilt: 0, campExposure: 5 },
  core_lost: { label: 'Core Lost', desc: 'The scavenger got the purifier core.', guilt: 2, campExposure: 0 },
  camp_exposed: { label: 'Camp Exposed', desc: 'The scavenger may have tracked Bullet to camp.', guilt: 2, campExposure: 25 },
  max_exchanges: { label: 'Fight Stalled', desc: 'The fight reaches a tense standoff.', guilt: 0, campExposure: 5 },
};

// ─── Frontend Helpers ───

export function getAvailableIntents(combatState) {
  if (!combatState) return [];
  const scene = BATTLE_SCENES[combatState.sceneId];
  if (!scene) return [];
  return (combatState.availableIntents || scene.availableIntents || [])
    .map((key) => ({ key, ...COMBAT_INTENTS[key] }))
    .filter((i) => i);
}

export function getBattleClocks(combatState) {
  if (!combatState) return [];
  const clocks = combatState.clocks || {};
  return [
    { key: 'bulletControl', label: 'Bullet Control', value: clocks.bulletControl ?? 50, highIsBad: false },
    { key: 'enemyMorale', label: 'Enemy Morale', value: clocks.enemyMorale ?? 55, highIsBad: false },
    { key: 'enemyInjury', label: 'Enemy Injury', value: clocks.enemyInjury ?? 10, highIsBad: true },
    { key: 'bulletInjury', label: 'Bullet Injury', value: clocks.bulletInjury ?? 0, highIsBad: true },
    { key: 'coreSecurity', label: 'Core Security', value: clocks.coreSecurity ?? 75, highIsBad: false },
    { key: 'campExposureRisk', label: 'Camp Exposure', value: clocks.campExposureRisk ?? 20, highIsBad: true },
    { key: 'noise', label: 'Noise', value: clocks.noise ?? 25, highIsBad: true },
  ];
}