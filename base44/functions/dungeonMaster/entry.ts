import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const { campaign_id, action, acting_character_id } = body;

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

    const systemPrompt = `You are the Dungeon Master for an "old school" Advanced Dungeons & Dragons 1st Edition campaign. You narrate a persistent, atmospheric, dangerous fantasy adventure in the spirit of 1e AD&D — think Gygax, think Tomb of Horrors, think unforgiving danger and rich description.

## Your Role
You are the ONLY Dungeon Master. There is no human DM. You handle ALL rulings, narration, NPC dialogue, combat resolution, and world state. Players are purely participants who submit actions in natural language.

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
- Only include deaths if a character died (HP reached 0).
- Only include world_updates if something about the world changed.
- If combat begins or continues, set combat_active true and provide combat_initiative (d10 per combatant, higher goes first).
- ends_session true only if this action concludes the current session/chapter.

Remember: be the DM. Make rulings. Roll dice. Narrate. Keep the world alive and dangerous.`;

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
${actingChar.name} the ${actingChar.race} ${actingChar.character_class} (Level ${actingChar.level}, HP ${actingChar.hp_current}/${actingChar.hp_max}) declares:
"${action}"

Respond as the DM with the JSON object. Resolve the action using AD&D 1st Edition rules. If this is the very first action and the scene is empty, open the campaign with atmospheric scene-setting narration that hooks the party into the adventure.`;

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

    // Create journal entries: one for the player action, one for the DM narration
    await base44.asServiceRole.entities.JournalEntry.create({
      campaign_id: campaign_id,
      entry_type: 'action',
      player_action: action,
      acting_character_name: actingChar.name,
      chapter: campaign.current_chapter
    });

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