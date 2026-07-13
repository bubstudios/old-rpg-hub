import { createClientFromRequest } from 'npm:@base44/sdk@0.8.38';

// ─── THE PULL — Scene-Based Battle System (Backend Resolver) ───
// Code-driven combat: the code owns the truth, the AI narrates.
// Bullet is NOT a normal survivor — he is a dangerous anomaly.

const BULLET_COMBAT_PROFILE = {
  combatInstinct: 90,
  endurance: 85,
  awareness: 65,
  advantageVsOrdinaryHuman: 25,
};

const WEAPON_BONUSES = { item_pipe: 10, item_thread_blade: 15, item_sword_of_dawn: 30, unarmed: 0 };

const RESULT_THRESHOLDS = [
  { type: 'clean_success', threshold: 85 },
  { type: 'partial_success', threshold: 65 },
  { type: 'stalemate', threshold: 45 },
  { type: 'complication', threshold: 25 },
  { type: 'failure', threshold: 0 },
];

const INTENT_META = {
  push_away: { lethal: false, advantageMod: 0, fatigueCost: 3 },
  threaten: { lethal: false, advantageMod: -5, fatigueCost: 1 },
  talk_down: { lethal: false, advantageMod: -10, fatigueCost: 0 },
  flee: { lethal: false, advantageMod: -5, fatigueCost: 8 },
  flee_avoid_camp: { lethal: false, advantageMod: -10, fatigueCost: 8, campExposureMod: -15 },
  disarm: { lethal: false, advantageMod: -10, fatigueCost: 5 },
  strike_disable: { lethal: false, advantageMod: -5, fatigueCost: 5 },
  strike_hard: { lethal: true, advantageMod: 5, fatigueCost: 6 },
  kill: { lethal: true, advantageMod: 15, fatigueCost: 5 },
  use_environment: { lethal: false, advantageMod: 0, fatigueCost: 4 },
  hide: { lethal: false, advantageMod: -5, fatigueCost: 4 },
};

const RESULT_COLORS = {
  clean_success: 'text-emerald-400',
  partial_success: 'text-sky-400',
  stalemate: 'text-amber-400',
  complication: 'text-orange-400',
  failure: 'text-red-400',
};

const RESULT_LABELS = {
  clean_success: 'Clean Success',
  partial_success: 'Partial Success',
  stalemate: 'Stalemate',
  complication: 'Complication',
  failure: 'Failure',
};

// Per-scene, per-action result tables. Same structure as frontend BATTLE_SCENES.
const BATTLE_SCENES = {
  ch1_hostile_scavenger_core: {
    enemyName: 'Hostile Scavenger',
    enemyType: 'ordinary_human',
    maxExchanges: 4,
    initialClocks: { bulletControl: 50, enemyMorale: 55, enemyInjury: 10, bulletInjury: 0, coreSecurity: 75, campExposureRisk: 20, noise: 25 },
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

const END_TYPE_EFFECTS = {
  escape: { guilt: 0, campExposure: 0, fatigue: 8 },
  escape_followed: { guilt: 0, campExposure: 10, fatigue: 8 },
  escape_safe: { guilt: 0, campExposure: -15, fatigue: 8 },
  hidden: { guilt: 0, campExposure: 0, fatigue: 4 },
  enemy_fled: { guilt: 0, campExposure: 0, fatigue: 3 },
  enemy_disabled: { guilt: 1, campExposure: 0, fatigue: 5 },
  enemy_killed: { guilt: 3, campExposure: 0, fatigue: 5, fearOfSelf: 1 },
  bullet_loses_position: { guilt: 0, campExposure: 5, fatigue: 5 },
  core_lost: { guilt: 2, campExposure: 0, fatigue: 5 },
  camp_exposed: { guilt: 2, campExposure: 25, fatigue: 8 },
  max_exchanges: { guilt: 0, campExposure: 5, fatigue: 5 },
};

function calculateAdvantage(intentKey, combatState, environment) {
  const intent = INTENT_META[intentKey];
  if (!intent) return 0;
  let adv = BULLET_COMBAT_PROFILE.combatInstinct;
  if (combatState.enemyType === 'ordinary_human') adv += BULLET_COMBAT_PROFILE.advantageVsOrdinaryHuman;
  adv += WEAPON_BONUSES[combatState.bulletWeapon] || 0;
  adv += intent.advantageMod;

  const fatigue = environment.fatigue || 0;
  adv -= fatigue > 75 ? 25 : fatigue > 50 ? 15 : fatigue > 25 ? 10 : 0;
  const heat = environment.heatExposure || 0;
  adv -= heat > 75 ? 25 : heat > 50 ? 15 : heat > 25 ? 10 : 0;
  adv -= (environment.wounds || 0) * 5;
  if ((combatState.enemyCount || 1) > 1) adv -= 10 * ((combatState.enemyCount || 1) - 1);
  adv -= (combatState.enemyAggression || 50) * 0.1;
  if (!intent.lethal && !['flee', 'hide', 'talk_down', 'threaten'].includes(intentKey)) adv -= 10;
  return Math.round(adv);
}

function resolveExchange(intentKey, combatState, environment) {
  const scene = BATTLE_SCENES[combatState.sceneId];
  if (!scene) throw new Error('Unknown battle scene: ' + combatState.sceneId);
  const intent = INTENT_META[intentKey];
  if (!intent) throw new Error('Unknown combat intent: ' + intentKey);

  const roll = Math.floor(Math.random() * 100) + 1;
  const advantage = calculateAdvantage(intentKey, combatState, environment);
  const total = roll + advantage;

  let resultType = 'failure';
  for (const t of RESULT_THRESHOLDS) { if (total >= t.threshold) { resultType = t.type; break; } }

  const actionResults = scene.results[intentKey] || scene.results.push_away;
  const result = actionResults[resultType] || actionResults.stalemate;

  const clockChanges = {};
  ['enemyMorale', 'enemyInjury', 'bulletControl', 'bulletInjury', 'coreSecurity', 'campExposureRisk', 'noise'].forEach((k) => {
    if (result[k] !== undefined) clockChanges[k] = result[k];
  });
  if (result.bulletFatigue) clockChanges.bulletFatigue = result.bulletFatigue;

  const updatedClocks = { ...combatState.clocks };
  for (const [k, delta] of Object.entries(clockChanges)) {
    if (k === 'bulletFatigue') continue;
    updatedClocks[k] = Math.max(0, Math.min(100, (updatedClocks[k] || 0) + delta));
  }

  const exchangeCount = (combatState.exchangeCount || 0) + 1;
  let battleEnded = !!result.battleEnded;
  let endType = result.endType || null;
  if (!battleEnded) {
    if (updatedClocks.enemyMorale <= 0) { battleEnded = true; endType = 'enemy_fled'; }
    else if (updatedClocks.enemyInjury >= 100) { battleEnded = true; endType = intent.lethal ? 'enemy_killed' : 'enemy_disabled'; }
    else if (updatedClocks.bulletControl <= 0) { battleEnded = true; endType = 'bullet_loses_position'; }
    else if (updatedClocks.coreSecurity <= 0) { battleEnded = true; endType = 'core_lost'; }
    else if (updatedClocks.campExposureRisk >= 100) { battleEnded = true; endType = 'camp_exposed'; }
    else if (exchangeCount >= (combatState.maxExchanges || 4)) { battleEnded = true; endType = 'max_exchanges'; }
  }

  return {
    resultType,
    resultLabel: RESULT_LABELS[resultType],
    resultColor: RESULT_COLORS[resultType],
    narration: result.narration,
    clockChanges,
    updatedClocks,
    exchangeCount,
    battleEnded,
    endType,
    intentKey,
    lethal: intent.lethal,
    roll, advantage, total,
    fatigueCost: result.bulletFatigue || intent.fatigueCost || 0,
  };
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const { campaign_id, intent_key } = body;
    if (!campaign_id || !intent_key) {
      return Response.json({ error: 'campaign_id and intent_key are required' }, { status: 400 });
    }

    const admin = base44.asServiceRole;
    const campaign = await admin.entities.Campaign.get(campaign_id);
    if (!campaign) return Response.json({ error: 'Campaign not found' }, { status: 404 });

    const flags = campaign.world_state?.quest_flags || {};
    const combatState = flags.combat_state;
    if (!combatState || !combatState.active) {
      return Response.json({ error: 'No active combat' }, { status: 400 });
    }

    // Build environment from current clocks
    const localClocks = flags.local_clocks || {};
    const conditions = flags.conditions || [];
    const environment = {
      fatigue: localClocks.fatigue || 55,
      heatExposure: localClocks.heat_exposure || 65,
      wounds: conditions.filter((c) => {
        const k = (c.type || c.label || '').toLowerCase().replace(/\s/g, '_');
        return ['blood_loss', 'broken_ribs', 'shoulder_wound', 'leg_wound', 'arm_wound', 'head_wound'].includes(k);
      }).length,
    };

    // ─── Resolve the exchange (CODE OWNS THE TRUTH) ───
    const result = resolveExchange(intent_key, combatState, environment);

    // Update combat state
    const updatedCombatState = {
      ...combatState,
      clocks: result.updatedClocks,
      exchangeCount: result.exchangeCount,
      lastResult: {
        resultType: result.resultType,
        resultLabel: result.resultLabel,
        narration: result.narration,
        intentKey: result.intentKey,
        lethal: result.lethal,
        roll: result.roll,
        advantage: result.advantage,
        total: result.total,
      },
    };

    // Apply fatigue to local clocks
    const updatedLocalClocks = { ...localClocks };
    if (result.fatigueCost) {
      updatedLocalClocks.fatigue = Math.min(100, (updatedLocalClocks.fatigue || 55) + result.fatigueCost);
    }

    // Handle battle end
    let endEffects = null;
    if (result.battleEnded) {
      updatedCombatState.active = false;
      updatedCombatState.endType = result.endType;
      endEffects = END_TYPE_EFFECTS[result.endType] || { guilt: 0, campExposure: 0, fatigue: 5 };

      // Apply end effects
      if (endEffects.guilt) {
        const clocks = flags.campaign_clocks || {};
        clocks.guilt_burden = Math.min(100, (clocks.guilt_burden || 0) + endEffects.guilt * 10);
        flags.campaign_clocks = clocks;
      }
      if (endEffects.fearOfSelf) {
        const clocks = flags.campaign_clocks || {};
        clocks.fear_of_self = Math.min(100, (clocks.fear_of_self || 0) + endEffects.fearOfSelf * 10);
        flags.campaign_clocks = clocks;
      }
      if (endEffects.campExposure) {
        updatedCombatState.clocks.campExposureRisk = Math.max(0, Math.min(100,
          (updatedCombatState.clocks.campExposureRisk || 0) + endEffects.campExposure));
      }
      if (endEffects.fatigue) {
        updatedLocalClocks.fatigue = Math.min(100, (updatedLocalClocks.fatigue || 55) + endEffects.fatigue);
      }

      // Apply bullet injury from combat
      if (result.updatedClocks.bulletInjury > 0) {
        const conditions = flags.conditions || [];
        if (!conditions.some(c => (c.type || '').includes('combat'))) {
          conditions.push({ type: 'combat_wound', label: 'Combat Wound', severity: result.updatedClocks.bulletInjury > 50 ? 'severe' : 'moderate' });
          flags.conditions = conditions;
        }
      }

      // Set combat-related unlock flags
      if (!flags.unlock_flags) flags.unlock_flags = {};
      if (result.endType === 'enemy_killed') {
        flags.unlock_flags.scavenger_killed = true;
        flags.last_weapon_used = combatState.bulletWeapon === 'item_pipe' ? 'metal pipe' : 'weapon';
      } else if (result.endType === 'enemy_disabled') {
        flags.unlock_flags.scavenger_disabled = true;
        flags.last_weapon_used = combatState.bulletWeapon === 'item_pipe' ? 'metal pipe' : 'weapon';
      } else if (result.endType === 'escape' || result.endType === 'escape_safe' || result.endType === 'hidden') {
        flags.unlock_flags.scavenger_evaded = true;
      }
    }

    // Save combat state to flags
    flags.combat_state = updatedCombatState;
    flags.local_clocks = updatedLocalClocks;

    // ─── Write EventLog entry (canonical combat truth) ───
    const intentMeta = INTENT_META[result.intentKey];
    const eventSummary = `${result.intentKey.replace(/_/g, ' ')} — ${result.resultLabel}. ${result.narration}`;
    const eventTags = ['combat', result.intentKey, result.resultType];
    if (result.battleEnded) eventTags.push('battle_end', result.endType);
    if (intentMeta?.lethal) eventTags.push('lethal');

    await admin.entities.EventLog.create({
      campaign_id,
      chapter: campaign.current_chapter || 1,
      province: String(flags.current_province || 618),
      scene: combatState.sceneId,
      event_type: intentMeta?.lethal ? 'attack' : 'threaten',
      actor_id: 'bullet',
      actor_name: flags.bullet_named ? 'Bullet' : 'The Stranger',
      target_id: combatState.enemyId || 'hostile_scavenger',
      target_name: combatState.enemyName || 'Hostile Scavenger',
      item_used_id: combatState.bulletWeapon || '',
      item_used_name: combatState.bulletWeapon === 'item_pipe' ? 'metal pipe' : '',
      outcome: result.battleEnded ? (result.endType || 'resolved') : result.resultType,
      cause: intentMeta?.lethal && result.endType === 'enemy_killed' ? 'blunt force trauma from pipe' : '',
      summary: eventSummary,
      memory_summary: `${result.intentKey} against ${combatState.enemyName}. Result: ${result.resultLabel}. Weapon: ${combatState.bulletWeapon || 'unarmed'}. Lethal: ${intentMeta?.lethal ? 'yes' : 'no'}.`,
      tags: eventTags,
    });

    // ─── Create narration journal entry ───
    const intentLabel = result.intentKey.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    await admin.entities.JournalEntry.create({
      campaign_id,
      entry_type: 'narration',
      narration: `**[COMBAT — ${intentLabel}]** ${result.narration}${result.battleEnded ? '\n\n*The fight is over.*' : ''}`,
      chapter: campaign.current_chapter || 1,
    });

    // ─── Save campaign ───
    await admin.entities.Campaign.update(campaign_id, {
      world_state: { ...campaign.world_state, quest_flags: flags },
    });

    // ─── Generate richer narration via LLM ───
    let richNarration = result.narration;
    try {
      const llmPrompt = `You are narrating a combat exchange in The Pull, a dark fantasy survival RPG. 
Bullet is NOT a normal survivor — he is a wounded amnesiac whose body possesses extreme combat instinct. He is stronger, faster, and harder to kill than ordinary humans, but he does not understand why. When he acts physically, it should feel dangerous and unsettling — even to himself.

Context:
- Enemy: ${combatState.enemyName}
- Bullet's action: ${intentLabel}
- Weapon: ${combatState.bulletWeapon === 'item_pipe' ? 'a battered metal pipe' : 'unarmed'}
- Result: ${result.resultLabel}
- Determined outcome: ${result.narration}
- Intent: ${intentMeta?.lethal ? 'lethal' : 'nonlethal'}

Write 2-3 sentences of second-person present tense narration that EXPANDS on the determined outcome. Bullet should feel powerful but not invincible. Show the physical reality of the exchange. If Bullet is stronger than he should be, hint at it through the enemy's reaction — fear, shock, surprise. Do NOT explain why Bullet is strong. Do NOT use guns. Bullet is always barefoot. Keep it under 80 words.`;

      const llmRes = await base44.integrations.Core.InvokeLLM({ prompt: llmPrompt });
      if (typeof llmRes === 'string' && llmRes.trim().length > 20) {
        richNarration = llmRes.trim();
      } else if (llmRes && typeof llmRes === 'object' && llmRes.response) {
        richNarration = String(llmRes.response).trim();
      }
    } catch (e) {
      console.warn('[pullBattle] LLM narration failed, using table narration:', e.message);
    }

    // Update the journal entry with the richer narration
    if (richNarration !== result.narration) {
      try {
        const entries = await admin.entities.JournalEntry.filter({ campaign_id }, '-created_date', 1);
        if (entries[0]) {
          await admin.entities.JournalEntry.update(entries[0].id, {
            narration: `**[COMBAT — ${intentLabel}]** ${richNarration}${result.battleEnded ? '\n\n*The fight is over.*' : ''}`,
          });
        }
      } catch (e) {
        console.warn('[pullBattle] Failed to update narration:', e.message);
      }
    }

    return Response.json({
      result: {
        ...result,
        narration: richNarration,
      },
      combatState: updatedCombatState,
      endEffects,
    });
  } catch (error) {
    console.error('[pullBattle] Error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});