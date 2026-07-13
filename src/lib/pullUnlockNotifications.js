// THE PULL — Unlock Notification Builder
// Processes the GM response and generates spoiler-gated unlock notifications.
// Each notification is a brief toast that surfaces what just changed in the world.

import { getProvinceInfo } from '@/lib/pullRules';
import { PLAYER_CODEX } from '@/lib/pullSheetData';

function prettyKey(key) {
  return String(key || '').replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

// Vague language for hidden consequences — never names the Seeker, Province 1, or Father
const HIDDEN_HINTS = {
  hunter_proximity: [
    'Something distant shifts in the dark.',
    'A presence stirs far away.',
    'The hunt adjusts, somewhere beyond sight.'
  ],
  province_1_alert: [
    'The realm takes notice.',
    'Something vast turns its attention.',
    'A distant will focuses on the disturbance.'
  ],
  seeker_frustration: [
    'A patient hunters grows restless.',
    'Something searching quickens its pace.'
  ],
  shard_resonance_trail: [
    'Something is tracking the shard\'s light.',
    'The shard\'s pulse ripples outward, further than it should.'
  ],
  dreadwraith_adaptation: [
    'Something in the dark is learning.',
    'A hunter adapts to what it has seen.'
  ],
  bond_threat: [
    'A distant will notices that connection stabilizes you.',
    'Something marks the bonds that hold you.'
  ]
};

function pickHint(clock) {
  const hints = HIDDEN_HINTS[clock];
  if (!hints) return 'Something shifts in the distance.';
  return hints[Math.floor(Math.random() * hints.length)];
}

export function buildUnlockNotifications(dmData, oldFlags, setting) {
  if (setting === 'off') return [];
  const notifications = [];
  const oldPipeState = oldFlags?.pipe_state || 'unfound';
  const oldShardFocus = !!oldFlags?.shard_focus_unlocked;

  // 1. Province transition (priority 1 — major reveal)
  // Only fire when the province ACTUALLY changed — the GM sometimes narrates
  // sub-area transitions within the same province (e.g. "Red Sand" → "Red Sand Camp"),
  // and those should not trigger a discovery notification.
  if (dmData.province_transition && dmData.province_transition.to_province != null) {
    const toProv = dmData.province_transition.to_province;
    const oldProv = oldFlags?.current_province;
    if (toProv !== oldProv) {
      const provInfo = getProvinceInfo(toProv);
      notifications.push({
        type: 'province',
        title: 'NEW PROVINCE DISCOVERED',
        message: provInfo.name,
        priority: 1
      });
    }
  }

  // 2. New ability/action unlock (priority 2)
  if (dmData.shard_focus_unlocked && !oldShardFocus) {
    notifications.push({
      type: 'shard_power',
      title: 'NEW ACTION UNLOCKED',
      message: 'Focus Etched Shard',
      priority: 2
    });
  }

  // Pipe found (priority 2)
  if (oldPipeState !== dmData.pipe_state && dmData.pipe_state === 'battered_metal_pipe') {
    notifications.push({
      type: 'item',
      title: 'WEAPON ACQUIRED',
      message: 'Battered Metal Pipe',
      priority: 2
    });
  }

  // Name given — Shard names the stranger "Bullet" (priority 2)
  if (dmData.bullet_named && !oldFlags?.bullet_named) {
    notifications.push({
      type: 'name',
      title: 'NAME GIVEN',
      message: 'Shard calls the stranger Bullet.',
      priority: 2
    });
  }

  // Water received (priority 2) — major survival moment
  if (dmData.water_received) {
    notifications.push({
      type: 'water',
      title: 'WATER RECEIVED',
      message: 'Thirst Greatly Reduced',
      priority: 2
    });
  }

  // Local clock updates (priority 3) — show before → after for significant changes
  if (dmData.local_clock_changes && dmData.local_clock_changes.length) {
    const oldLocal = oldFlags?.local_clocks || {};
    const lines = [];
    for (const cc of dmData.local_clock_changes) {
      if (Math.abs(cc.change || 0) < 5) continue;
      const oldVal = oldLocal[cc.clock];
      if (oldVal === undefined) continue;
      const newVal = Math.max(0, Math.min(100, oldVal + (cc.change || 0)));
      const pretty = cc.clock.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
      lines.push(`${pretty} ${oldVal} → ${newVal}`);
    }
    if (lines.length) {
      notifications.push({
        type: 'clock',
        title: 'CLOCK UPDATED',
        message: lines.slice(0, 4).join('\n'),
        priority: 3
      });
    }
  }

  // Spark's shard acquired (priority 2)
  if (dmData.spark_shard_acquired) {
    notifications.push({
      type: 'item',
      title: 'INVENTORY UPDATED',
      message: "Spark's Unetched Shard",
      priority: 2
    });
  }

  // 3. Codex unlocks (priority 3)
  for (const key of (dmData.codex_unlocks || [])) {
    const entry = PLAYER_CODEX[key];
    if (entry) {
      notifications.push({
        type: 'codex',
        title: 'CODEX UPDATED',
        message: entry.title,
        priority: 3
      });
    }
  }

  // 4. Item changes (priority 3)
  for (const ic of (dmData.item_changes || [])) {
    if (ic.action === 'add' && ic.item !== 'Battered Metal Pipe') {
      notifications.push({
        type: 'item',
        title: 'INVENTORY UPDATED',
        message: ic.item,
        priority: 3
      });
    }
  }

  // 5. NPC / bond changes (priority 3 for new NPCs, 4 for relationship changes)
  for (const nu of (dmData.npc_updates || [])) {
    if (nu.is_new) {
      notifications.push({
        type: 'bond',
        title: 'NPC DISCOVERED',
        message: nu.name || prettyKey(nu.key),
        detail: 'Added to People',
        priority: 3
      });
    }
    const change = typeof nu.relationship_change === 'number' ? nu.relationship_change : 0;
    if (change !== 0) {
      notifications.push({
        type: 'bond',
        title: change > 0 ? 'BOND STRENGTHENED' : 'BOND STRAINED',
        message: nu.name || prettyKey(nu.key),
        detail: nu.reason || '',
        priority: 4,
        change
      });
    }
  }

  // 5b. Clock discovery (priority 3) — only fire for clocks not already discovered
  const oldDiscovered = new Set(oldFlags?.discovered_clocks || []);
  for (const clockKey of (dmData.discovered_clocks || [])) {
    if (oldDiscovered.has(clockKey)) continue;
    notifications.push({
      type: 'codex',
      title: 'CLOCK UNLOCKED',
      message: prettyKey(clockKey),
      priority: 3
    });
  }

  // 6. Condition changes (priority 6)
  for (const cc of (dmData.condition_changes || [])) {
    if (cc.status === 'new') {
      notifications.push({
        type: 'condition',
        title: 'CONDITION',
        message: prettyKey(cc.type),
        priority: 6
      });
    }
  }

  // 7. Hidden consequence hints (priority 7 — only in normal/detailed, vague language)
  if (setting !== 'minimal') {
    const seenClocks = new Set();

    // Enemy turn clocks
    const enemyTurn = dmData.enemy_turn;
    if (enemyTurn) {
      if (enemyTurn.hunter_proximity_change > 0) {
        notifications.push({ type: 'hidden', title: 'HIDDEN CONSEQUENCE', message: pickHint('hunter_proximity'), priority: 7 });
        seenClocks.add('hunter_proximity');
      }
      if (enemyTurn.province_1_alert_change > 0) {
        notifications.push({ type: 'hidden', title: 'HIDDEN CONSEQUENCE', message: pickHint('province_1_alert'), priority: 7 });
        seenClocks.add('province_1_alert');
      }
    }

    // Other hidden clock changes
    for (const cc of (dmData.clock_changes || [])) {
      if (seenClocks.has(cc.clock)) continue;
      if (HIDDEN_HINTS[cc.clock] && cc.change > 0) {
        notifications.push({ type: 'hidden', title: 'HIDDEN CONSEQUENCE', message: pickHint(cc.clock), priority: 7 });
        seenClocks.add(cc.clock);
      }
    }

    // Detailed mode: show actual hidden numbers
    if (setting === 'detailed') {
      for (const cc of (dmData.clock_changes || [])) {
        if (HIDDEN_HINTS[cc.clock] && cc.change !== 0) {
          notifications.push({
            type: 'hidden',
            title: 'HIDDEN',
            message: `${prettyKey(cc.clock)} ${cc.change > 0 ? '+' : ''}${cc.change}`,
            priority: 8
          });
        }
      }
    }
  }

  // Sort by priority
  notifications.sort((a, b) => a.priority - b.priority);

  // Limit to 6 notifications max
  return notifications.slice(0, 6);
}