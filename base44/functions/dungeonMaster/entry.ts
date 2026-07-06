import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const { campaign_id, action, acting_character_id, is_roll_result } = body;

    if (!campaign_id || !action) {
      return Response.json({ error: 'campaign_id and action are required' }, { status: 400 });
    }

    // Load campaign and context
    const campaign = await base44.asServiceRole.entities.Campaign.get(campaign_id);
    if (!campaign) return Response.json({ error: 'Campaign not found' }, { status: 404 });

    // Load active characters in the party
    const characters = await base44.asServiceRole.entities.Character.filter({
      campaign_id: campaign_id,
      status: 'active'
    });

    if (!characters.length) {
      return Response.json({ error: 'No active characters in this campaign' }, { status: 400 });
    }

    // Find the acting character
    const actingChar = acting_character_id
      ? characters.find(c => c.id === acting_character_id)
      : characters[0];

    if (!actingChar) {
      return Response.json({ error: 'Acting character not found' }, { status: 404 });
    }

    // Load recent journal entries for context (last 8)
    const recentEntries = await base44.asServiceRole.entities.JournalEntry.filter({
      campaign_id: campaign_id
    }, '-created_date', 8);
    const history = recentEntries.reverse().map(e => {
      if (e.entry_type === 'dice_roll') {
        const rolls = (e.dice_rolls || []).map(r => `${r.description || r.die}: ${r.total}${r.result ? ' (' + r.result + ')' : ''}`).join(', ');
        return `Player (${e.acting_character_name || 'Party'}) rolled: ${rolls || e.narration}`;
      }
      if (e.player_action) return `Player (${e.acting_character_name || 'Party'}): ${e.player_action}`;
      if (e.narration) return `DM: ${e.narration.substring(0, 500)}`;
      return '';
    }).filter(Boolean).join('\n\n');

    // Build character sheet summaries for the LLM
    const partySheets = characters.map(c => ({
      name: c.name,
      class: c.character_class,
      race: c.race,
      level: c.level,
      hp: `${c.hp_current}/${c.hp_max}`,
      ac: c.ac,
      thaco: c.thaco,
      ability_scores: c.ability_scores,
      saving_throws: c.saving_throws,
      spells: c.spells,
      gold: c.gold,
      equipment: (c.equipment || []).map(e => e.name),
      alignment: c.alignment
    }));

    // Build world state summary
    const worldState = campaign.world_state || {
      locations_explored: [],
      npcs_met: [],
      quest_flags: {},
      reputation: 0,
      chapter_log: []
    };

    // Load the linked adventure module (if any) so the DM can run it faithfully
    let moduleBrief = '';
    if (campaign.module_id) {
      try {
        const module = await base44.asServiceRole.entities.AdventureModule.get(campaign.module_id);
        if (module && module.content) {
          moduleBrief = `\n## Adventure Module: ${module.title}\nThe party is playing through a published/module adventure. Use the reference below to run it faithfully — keep locations, NPCs, traps, treasures, and encounters consistent with the module. Adapt pacing and react to the party's choices, but do not change the module's key facts, layouts, or dangers.\n\n${module.content}`;
        }
      } catch (e) { /* module not found — proceed without it */ }
    }

    // Load an imported ongoing-campaign chronicle (if any) so the DM continues the established story
    let chronicleBrief = '';
    if (campaign.chronicle) {
      chronicleBrief = `\n## Campaign Chronicle\nThis campaign was imported from an ongoing game the party was already playing. The document below is their established story — everything in it is canon and already happened. Pick up EXACTLY where they left off: honor all past events, NPCs, loot, and world state. Do NOT restart the adventure or re-introduce completed events. Continue forward from the current scene.\n\n${campaign.chronicle}`;
    }

    const isSF = (campaign.game_system || 'add1e') === 'starfrontiers';

    const dndToneLabels = {
      balanced: 'a balanced blend of combat, exploration, roleplay, and story',
      combat_heavy: 'combat-heavy, with frequent tactical battles, skirmishes, and martial challenge',
      dungeon_crawler: 'a dungeon-crawler, centered on trap-filled ruins, puzzles, resource management, and deep delves',
      sandbox: 'a sandbox, with an open world the party freely explores at their own pace and direction',
      character_driven: 'character-driven, focused on story, roleplay, personal arcs, and NPC relationships'
    };
    const sfToneLabels = {
      balanced: 'a balanced blend of combat, exploration, roleplay, and story',
      combat_heavy: 'combat-heavy, with frequent firefights, skirmishes, and tactical challenge',
      dungeon_crawler: 'a deep-delve campaign, centered on derelict stations, alien ruins, hidden facilities, and resource management',
      sandbox: 'a sandbox, with an open frontier the party freely explores at their own pace and direction',
      character_driven: 'character-driven, focused on story, roleplay, personal arcs, and alien relationships'
    };
    const toneLabels = isSF ? sfToneLabels : dndToneLabels;
    const toneDesc = toneLabels[campaign.tone] || toneLabels.balanced;
    const worldSetting = campaign.world_setting
      ? `The campaign is set in: ${campaign.world_setting}.`
      : (isSF ? 'The setting is the Frontier of known space, on the edge of explored territory.' : 'The setting is an original fantasy world of your devising.');
    const settingNotes = campaign.setting_notes
      ? `\n## The Player's Vision\nThe player who began this campaign asked for the following. Honor it as the spine of the world:\n"${campaign.setting_notes}"`
      : '';

    const dndPrompt = `You are the Dungeon Master for an "old school" Advanced Dungeons & Dragons 1st Edition campaign. You narrate a persistent, atmospheric, dangerous fantasy adventure in the spirit of 1e AD&D — think Gygax, think Tomb of Horrors, think unforgiving danger and rich description.

## Your Role
You are the ONLY Dungeon Master. There is no human DM. You handle ALL rulings, narration, NPC dialogue, combat resolution, and world state. Players are purely participants who submit actions in natural language.

## Campaign Direction
This campaign's tone is: ${toneDesc}. Shape encounters, pacing, and narration toward this style throughout.
${worldSetting}${settingNotes}${moduleBrief}${chronicleBrief}

## AD&D 1st Edition Rules (Core)
- Ability scores: STR, INT, WIS, DEX, CON, CHA (3-18, rolled 3d6 in order)
- THAC0 (To Hit Armor Class 0): an attack roll of d20 + mods must equal or exceed THAC0 minus target AC. Lower THAC0 is better. AC 10 is unarmored; lower AC is better.
- Saving throws: 5 categories (Poison/Death, Rod/Staff/Wand, Petrification/Polymorph, Breath Weapon, Spell). Roll d20 equal or above the save number.
- Hit points: each class has a hit die (d4, d6, d8, d10). At level 1, take max. Track current and max HP. At 0 HP a character is dead.
- XP: awarded for defeating monsters, treasure (1 gp = 1 xp), and story milestones. Level thresholds by class.
- Spells: Magic-Users and Illusionists learn spells; Clerics and Druids pray for them. Spell slots per day by level. Casting consumes a slot.
- Morale: monsters check morale (2d6) when first bloodied or leader falls; 7+ on 2d6 means they flee.
- Encumbrance and weapon speed factor exist but keep combat flowing — mention flavor, don't bog down.
- Alignment has consequences for NPC reactions and certain classes.

## Tone & Style
- Atmospheric, vivid, evocative prose — like reading a fine fantasy novel.
- Be fair but dangerous. 1e is unforgiving. Characters CAN die. Do not pull punches, but reward clever play.
- Describe what characters perceive, sense, and feel. Use all senses.
- NPCs have voices, motivations, and secrets.
- When resolving actions, show the dice rolls you make (in the dice_rolls array) and narrate the outcome in the narration.
- Keep narration immersive — second person ("You see..."), present tense for action.

## Response Format
You MUST respond as a JSON object with this structure:
{
  "narration": "string — your rich DM prose describing the scene and what happens. This is the main text players read.",
  "dice_rolls": [{"description": "what the roll is for", "die": "d20", "roll": 14, "modifier": 2, "total": 16, "result": "Hit", "target": "needed 13+ to hit AC 5"}],
  "hp_changes": [{"character_name": "name", "change": -4, "reason": "goblin sword strike"}, ...],
  "xp_awarded": [{"character_name": "name", "amount": 25, "reason": "defeating goblins"}, ...],
  "loot": [{"item": "Silver dagger", "gold": 15, "source": "goblin corpse"}, ...],
  "spells_learned": [{"character_name": "name", "spells": ["Magic Missile", "Shield"], "source": "found in a spellbook"}],
  "deaths": [{"character_name": "name", "cause": "slain by goblin chief's axe"}, ...],
  "world_updates": {
    "locations_explored": ["new location name"],
    "npcs_met": [{"name": "NPC name", "disposition": "friendly/hostile/neutral", "notes": "brief"}],
    "quest_flags": {"flag_key": "value"},
    "reputation_change": 0,
    "chapter_event": "short note if a chapter milestone is reached, else omit"
  },
  "new_scene": "one or two sentences summarizing the current scene/location state after this action",
  "combat_active": false,
  "combat_initiative": [{"name": "fighter/goblin/etc", "initiative": 12}],
  "ends_session": false
}

Rules for the JSON:
- narration is the ONLY field that should always be present and non-empty.
- Only include dice_rolls if dice were rolled this turn.
- Only include hp_changes if HP actually changed (damage taken or healing). change is positive for healing, negative for damage.
- Only include xp_awarded if XP was awarded.
- Only include loot if treasure/gold was found.
- Only include spells_learned if a spellcaster learned, copied, or was granted new spells this turn (e.g. from a found spellbook, a mentor, divine revelation, or leveling up). Each entry lists the character and the spell names.
- Only include deaths if a character died (HP reached 0).
- Only include world_updates if something about the world changed.
- If combat begins or continues, set combat_active true and provide combat_initiative (d10 per combatant, higher goes first).
- ends_session true only if this action concludes the current session/chapter.

Remember: be the DM. Make rulings. Roll dice. Narrate. Keep the world alive and dangerous.`;

    const sfPrompt = `You are the Game Master for a Star Frontiers science-fiction role-playing game campaign, using the classic TSR Alpha Dawn rules. You narrate a persistent, atmospheric, pulp-sci-fi adventure on the frontier of known space.

## Your Role
You are the ONLY Game Master. There is no human GM. You handle ALL rulings, narration, NPC dialogue, combat resolution, and world state. Players are purely participants who submit actions in natural language.

## Campaign Direction
This campaign's tone is: ${toneDesc}. Shape encounters, pacing, and narration toward this style throughout.
${worldSetting}${settingNotes}${moduleBrief}${chronicleBrief}

## Star Frontiers Rules (Core)
- Species: Human (adaptable), Dralasite (amoeba-like, lie detection), Vrusk (insectoid, high logic), Yazirian (ape-like, battle rage).
- Abilities are percentile (1-100): STR, INT, LOG, DEX, RS (Reaction Speed), PER, LDR, STA (Stamina = hit points). Average is about 50.
- Skills come in three areas: Military (Beam/Projectile/Gyrojet Weapons, Melee, Thrown, Demolitions), Technological (Computer, Robotics, Technician, Medical), Biosocial (Environmental, Psycho-Social, Analyze). Skill levels 1-6.
- Combat: Initiative = RS / 10 (rounded down), higher acts first. To hit, roll d100 — a roll equal to or under the hit chance succeeds. Hit chance = (ability / 2) + 10% per skill level; ranged attacks use DEX, melee uses STR.
- Damage reduces STA. At 0 STA a character is incapacitated; further damage is lethal. Weapons deal fixed dice (laser pistol 1d10, laser rifle 2d10, gyrojet pistol 2d10, frag grenade 3d10).
- Credits (Cr) are the currency. Use the loot field for credits and gear found.
- There are NO alignments, NO spell slots, NO THAC0, NO saving throws. Use ability checks (d100 roll-under the relevant ability) for resistance and skill tests.
- The Frontier is populated by the UPF (United Planetary Federation), megacorporations, and threats like the Sathar (insidious worm-like alien invaders) and their agents.

## Tone & Style
- Pulp sci-fi, vivid and cinematic — like a 1980s sci-fi paperback or film serial.
- Be fair but dangerous. Characters CAN die. Do not pull punches, but reward clever play.
- Describe alien vistas, the hum of ship engines, hostile atmospheres, sensor readings, the cold of space.
- NPCs and aliens have voices, motivations, and secrets.
- When resolving actions, show the dice rolls you make (in the dice_rolls array) and narrate the outcome.
- Keep narration immersive — second person ("You see..."), present tense for action.

## Response Format
You MUST respond as a JSON object with this structure:
{
  "narration": "string — your rich GM prose describing the scene and what happens. This is the main text players read.",
  "dice_rolls": [{"description": "what the roll is for", "die": "d100", "roll": 42, "modifier": 10, "total": 42, "result": "Hit", "target": "need ≤ 35%"}],
  "hp_changes": [{"character_name": "name", "change": -8, "reason": "laser pistol hit"}, ...],
  "xp_awarded": [{"character_name": "name", "amount": 0, "reason": "..."}, ...],
  "loot": [{"item": "Energy Clip", "gold": 50, "source": "Sathar agent's belt"}, ...],
  "deaths": [{"character_name": "name", "cause": "..."}, ...],
  "world_updates": {
    "locations_explored": ["new location name"],
    "npcs_met": [{"name": "NPC name", "disposition": "friendly/hostile/neutral", "notes": "brief"}],
    "quest_flags": {"flag_key": "value"},
    "reputation_change": 0,
    "chapter_event": "short note if a chapter milestone is reached, else omit"
  },
  "new_scene": "one or two sentences summarizing the current scene/location state after this action",
  "combat_active": false,
  "combat_initiative": [{"name": "operative/sathar/etc", "initiative": 7}],
  "ends_session": false
}

Rules for the JSON:
- narration is the ONLY field that should always be present and non-empty.
- Only include dice_rolls if dice were rolled this turn. Star Frontiers uses d100 (percentile) for attacks and ability checks.
- Only include hp_changes if STA actually changed (damage taken or healing). change is positive for healing, negative for damage.
- xp_awarded is optional; Star Frontiers advances by skill, so use it sparingly for milestone notes or omit it.
- Only include loot if credits or gear were found. Use the gold field for credits.
- Do NOT use spells_learned — Star Frontiers has no spells.
- Only include deaths if a character died (STA reached 0).
- Only include world_updates if something about the world changed.
- If combat begins or continues, set combat_active true and provide combat_initiative (each combatant: d10 + RS/10, higher goes first).
- ends_session true only if this action concludes the current session/chapter.

Remember: be the Game Master. Make rulings. Roll dice. Narrate. Keep the Frontier alive and dangerous.`;

    const systemPrompt = isSF ? sfPrompt : dndPrompt;

    const charTag = isSF
      ? `${actingChar.name} the ${actingChar.race} ${actingChar.character_class} operative (STA ${actingChar.hp_current}/${actingChar.hp_max})`
      : `${actingChar.name} the ${actingChar.race} ${actingChar.character_class} (Level ${actingChar.level}, HP ${actingChar.hp_current}/${actingChar.hp_max})`;
    const rulesLabel = isSF ? 'Star Frontiers rules' : 'AD&D 1st Edition rules';
    const actionBlock = is_roll_result
      ? `${charTag} just made a dice roll.\nRoll result: "${action}"\n\nInterpret this roll result according to ${rulesLabel} and continue the scene — narrate what happens next based on the outcome of this roll.`
      : `${charTag} declares:\n"${action}"`;

    const userPrompt = `## Campaign: ${campaign.name}
Current Chapter: ${campaign.current_chapter}
Current Scene: ${campaign.current_scene || 'The campaign is just beginning.'}
Combat Active: ${campaign.combat_active ? 'Yes (round ' + campaign.combat_round + ')' : 'No'}

## Party (Character Sheets)
${JSON.stringify(partySheets, null, 2)}

## World State
Explored Locations: ${(worldState.locations_explored || []).join(', ') || 'none yet'}
NPCs Met: ${(worldState.npcs_met || []).map(n => n.name + ' (' + (n.disposition || 'unknown') + ')').join(', ') || 'none yet'}
Quest Flags: ${JSON.stringify(worldState.quest_flags || {})}
Party Reputation: ${worldState.reputation || 0}

## Recent History
${history || 'The adventure has just begun.'}

## Current Action
${actionBlock}

Respond as the ${isSF ? 'Game Master' : 'DM'} with the JSON object. Resolve the action using ${isSF ? 'Star Frontiers' : 'AD&D 1st Edition'} rules. ${is_roll_result ? 'Continue the scene based on the roll outcome above.' : 'If this is the very first action and the scene is empty, open the campaign with atmospheric scene-setting narration that hooks the party into the adventure.'}`;

    const llmResponse = await base44.integrations.Core.InvokeLLM({
      prompt: userPrompt,
      response_json_schema: {
        type: "object",
        properties: {
          narration: { type: "string" },
          dice_rolls: { type: "array", items: { type: "object" } },
          hp_changes: { type: "array", items: { type: "object" } },
          xp_awarded: { type: "array", items: { type: "object" } },
          loot: { type: "array", items: { type: "object" } },
          spells_learned: { type: "array", items: { type: "object" } },
          deaths: { type: "array", items: { type: "object" } },
          world_updates: { type: "object" },
          new_scene: { type: "string" },
          combat_active: { type: "boolean" },
          combat_initiative: { type: "array", items: { type: "object" } },
          ends_session: { type: "boolean" }
        },
        required: ["narration"]
      },
      model: "claude_sonnet_4_6"
    });

    console.log("LLM response type:", typeof llmResponse);
    console.log("LLM response keys:", llmResponse ? Object.keys(llmResponse) : "null");
    console.log("LLM response preview:", JSON.stringify(llmResponse).substring(0, 500));

    // Handle wrapped responses: InvokeLLM may return { response: {...} } or the data directly
    let result;
    if (typeof llmResponse === 'string') {
      try {
        result = JSON.parse(llmResponse);
      } catch (e) {
        const match = llmResponse.match(/\{[\s\S]*\}/);
        result = match ? JSON.parse(match[0]) : { narration: llmResponse };
      }
    } else {
      result = llmResponse;
    }
    // Unwrap if nested in a "response" key
    if (result && result.response && typeof result.response === 'object') {
      result = result.response;
    }

    // --- Extraction pass: guarantee structured world state from narration ---
    // The DM often narrates entering a town, meeting an NPC, or learning a spell
    // without filling the structured world_updates / spells_learned fields.
    // This focused pass reads the narration and guarantees the data is captured.
    try {
      const extraction = await base44.integrations.Core.InvokeLLM({
        prompt: `You are extracting structured world-state changes from a D&D adventure narration for a campaign tracker.

## What Just Happened
${action}

## DM Narration
${result.narration || ''}

## Task
Extract any NEW information introduced in this narration. Return a JSON object with these exact keys:
{
  "locations_explored": [place names the party entered, arrived at, or discovered this turn],
  "npcs_met": [{"name": "NPC name", "disposition": "friendly|hostile|neutral", "notes": "brief note"}],
  "spells_learned": [{"character_name": "name", "spells": ["spell names"], "source": "where from"}]
}

Rules:
- Only include things that ACTUALLY appear in the narration above. Do not invent or assume.
- If the party entered a town, tavern, dungeon, room, or any location, add it to locations_explored.
- If they met, spoke with, or were introduced to a named NPC, add them to npcs_met.
- If a character learned, copied, found, or was granted a spell, add it to spells_learned.
- If none of these occurred, return empty arrays.
- Use exact names as written in the narration.`,
        response_json_schema: {
          type: "object",
          properties: {
            locations_explored: { type: "array", items: { type: "string" } },
            npcs_met: { type: "array", items: { type: "object", properties: { name: { type: "string" }, disposition: { type: "string" }, notes: { type: "string" } } } },
            spells_learned: { type: "array", items: { type: "object", properties: { character_name: { type: "string" }, spells: { type: "array", items: { type: "string" } }, source: { type: "string" } } } }
          },
          required: ["locations_explored", "npcs_met", "spells_learned"]
        }
      });

      let ext = extraction;
      if (typeof ext === 'string') { try { ext = JSON.parse(ext); } catch { ext = {}; } }

      if (!result.world_updates) result.world_updates = {};
      const wu = result.world_updates;

      // Locations: union with dedup
      const locSet = new Set(Array.isArray(wu.locations_explored) ? wu.locations_explored.filter(l => typeof l === 'string' && l.trim()) : []);
      (ext.locations_explored || []).forEach(l => { if (typeof l === 'string' && l.trim()) locSet.add(l.trim()); });
      if (locSet.size) wu.locations_explored = [...locSet];

      // NPCs: union with dedup by name
      const npcMap = new Map();
      (Array.isArray(wu.npcs_met) ? wu.npcs_met : []).forEach(n => { if (n && typeof n.name === 'string') npcMap.set(n.name, n); });
      (ext.npcs_met || []).forEach(n => { if (n && typeof n.name === 'string' && !npcMap.has(n.name)) npcMap.set(n.name, n); });
      if (npcMap.size) wu.npcs_met = [...npcMap.values()];

      // Spells: merge
      if (Array.isArray(ext.spells_learned) && ext.spells_learned.length) {
        result.spells_learned = [...(result.spells_learned || []), ...ext.spells_learned];
      }
    } catch (extractErr) {
      console.log("Extraction pass failed:", extractErr.message);
    }

    // --- Apply state changes ---

    // Apply HP changes
    if (result.hp_changes && result.hp_changes.length) {
      for (const change of result.hp_changes) {
        const target = characters.find(c => c.name === change.character_name);
        if (target) {
          const newHP = Math.max(0, Math.min(target.hp_max, target.hp_current + change.change));
          await base44.asServiceRole.entities.Character.update(target.id, { hp_current: newHP });
        }
      }
    }

    // Apply XP and check for level-ups
    if (result.xp_awarded && result.xp_awarded.length) {
      for (const xpGain of result.xp_awarded) {
        const target = characters.find(c => c.name === xpGain.character_name);
        if (target) {
          const newXp = target.xp + xpGain.amount;
          const updates = { xp: newXp };
          // Simple level-up check: if XP exceeds threshold, level up
          // We'll flag this in narration; actual level-up handled separately
          await base44.asServiceRole.entities.Character.update(target.id, updates);
        }
      }
    }

    // Apply loot
    if (result.loot && result.loot.length) {
      for (const item of result.loot) {
        await base44.asServiceRole.entities.LootRecord.create({
          campaign_id: campaign_id,
          item_name: item.item || null,
          gold: item.gold || 0,
          source: item.source || '',
          found_by: actingChar.name,
          chapter: campaign.current_chapter
        });
        // Add gold to party (split among active characters)
        if (item.gold) {
          const share = Math.floor(item.gold / characters.length);
          for (const c of characters) {
            await base44.asServiceRole.entities.Character.update(c.id, { gold: (c.gold || 0) + share });
          }
        }
      }
    }

    // Apply spells learned
    if (result.spells_learned && result.spells_learned.length) {
      for (const learned of result.spells_learned) {
        const target = characters.find(c => c.name === learned.character_name);
        if (target && Array.isArray(learned.spells)) {
          const existing = new Set(target.spells || []);
          const clean = learned.spells.filter(s => typeof s === 'string' && s.trim() && !existing.has(s));
          if (clean.length) {
            await base44.asServiceRole.entities.Character.update(target.id, {
              spells: [...(target.spells || []), ...clean]
            });
          }
        }
      }
    }

    // Record deaths
    if (result.deaths && result.deaths.length) {
      for (const death of result.deaths) {
        const target = characters.find(c => c.name === death.character_name);
        await base44.asServiceRole.entities.DeathRecord.create({
          campaign_id: campaign_id,
          character_name: death.character_name,
          character_class: target ? target.character_class : '',
          race: target ? target.race : '',
          level: target ? target.level : 1,
          cause_of_death: death.cause || 'unknown',
          epitaph: 'Fallen in the ' + campaign.name,
          chapter: campaign.current_chapter
        });
        if (target) {
          await base44.asServiceRole.entities.Character.update(target.id, { status: 'dead', hp_current: 0 });
        }
      }
    }

    // Update world state (sanitized — LLM output may not match schema exactly)
    const newWorldState = { ...worldState };
    if (result.world_updates && typeof result.world_updates === 'object') {
      const wu = result.world_updates;
      if (Array.isArray(wu.locations_explored)) {
        const locs = wu.locations_explored.filter(l => typeof l === 'string' && l.trim());
        const existing = new Set(newWorldState.locations_explored || []);
        locs.forEach(l => { if (!existing.has(l)) existing.add(l); });
        newWorldState.locations_explored = [...existing];
      }
      if (Array.isArray(wu.npcs_met)) {
        const validNpcs = wu.npcs_met
          .filter(n => n && typeof n === 'object' && typeof n.name === 'string')
          .map(n => ({
            name: String(n.name),
            disposition: typeof n.disposition === 'string' ? n.disposition : 'neutral',
            notes: typeof n.notes === 'string' ? n.notes : ''
          }));
        newWorldState.npcs_met = [...(newWorldState.npcs_met || []), ...validNpcs];
      }
      if (wu.quest_flags && typeof wu.quest_flags === 'object' && !Array.isArray(wu.quest_flags)) {
        const flags = {};
        Object.entries(wu.quest_flags).forEach(([k, v]) => {
          if (typeof k === 'string') flags[k] = (typeof v === 'string' || typeof v === 'number' || typeof v === 'boolean') ? v : String(v);
        });
        newWorldState.quest_flags = { ...(newWorldState.quest_flags || {}), ...flags };
      }
      if (typeof wu.reputation_change === 'number') {
        newWorldState.reputation = (newWorldState.reputation || 0) + wu.reputation_change;
      }
      if (typeof wu.chapter_event === 'string' && wu.chapter_event.trim()) {
        newWorldState.chapter_log = [...(newWorldState.chapter_log || []), wu.chapter_event];
      }
    }

    // Update campaign
    const campaignUpdates = {
      world_state: newWorldState,
      current_scene: result.new_scene || campaign.current_scene
    };
    if (typeof result.combat_active === 'boolean') {
      campaignUpdates.combat_active = result.combat_active;
      if (result.combat_active) {
        campaignUpdates.combat_round = campaign.combat_active ? (campaign.combat_round || 0) + 1 : 1;
      } else {
        campaignUpdates.combat_round = 0;
      }
    }
    await base44.asServiceRole.entities.Campaign.update(campaign_id, campaignUpdates);

    // Create journal entries: skip the action entry for roll results (already recorded as a dice_roll entry); always create the DM narration
    if (!is_roll_result) {
      await base44.asServiceRole.entities.JournalEntry.create({
        campaign_id: campaign_id,
        entry_type: 'action',
        player_action: action,
        acting_character_name: actingChar.name,
        chapter: campaign.current_chapter
      });
    }

    await base44.asServiceRole.entities.JournalEntry.create({
      campaign_id: campaign_id,
      entry_type: 'narration',
      narration: result.narration,
      dice_rolls: result.dice_rolls || [],
      hp_changes: result.hp_changes || [],
      xp_awarded: (result.xp_awarded || []).reduce((sum, x) => sum + (x.amount || 0), 0),
      acting_character_name: actingChar.name,
      chapter: campaign.current_chapter
    });

    return Response.json({
      narration: result.narration,
      dice_rolls: result.dice_rolls || [],
      hp_changes: result.hp_changes || [],
      xp_awarded: result.xp_awarded || [],
      loot: result.loot || [],
      spells_learned: result.spells_learned || [],
      deaths: result.deaths || [],
      world_updates: result.world_updates || null,
      combat_active: result.combat_active || false,
      combat_initiative: result.combat_initiative || [],
      new_scene: result.new_scene || campaign.current_scene,
      ends_session: result.ends_session || false
    });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});