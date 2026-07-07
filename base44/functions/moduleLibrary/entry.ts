import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const op = body.op;
    const admin = base44.asServiceRole;

    // List modules: shared (available to everyone) + my private uploads.
    // Optionally filtered by game_system (legacy modules default to add1e).
    if (op === 'list') {
      const gameSystem = body.game_system || null;
      const [shared, mine] = await Promise.all([
        admin.entities.AdventureModule.filter({ visibility: 'shared' }, '-updated_date', 200),
        admin.entities.AdventureModule.filter({ created_by_id: user.id, visibility: 'private' }, '-updated_date', 100)
      ]);
      const seen = new Set();
      const modules = [];
      for (const m of [...shared, ...mine]) {
        if (seen.has(m.id)) continue;
        seen.add(m.id);
        const sys = m.game_system || 'add1e';
        if (gameSystem && sys !== gameSystem) continue;
        modules.push({
          id: m.id,
          title: m.title,
          description: m.description,
          author: m.author,
          recommended_levels: m.recommended_levels,
          game_system: sys,
          visibility: m.visibility,
          tags: m.tags || [],
          created_by_id: m.created_by_id,
          is_mine: m.created_by_id === user.id,
          created_date: m.created_date
        });
      }
      return Response.json({ modules });
    }

    // Get full module (for detail view or DM consumption)
    if (op === 'get') {
      const { module_id } = body;
      if (!module_id) return Response.json({ error: 'module_id required' }, { status: 400 });
      const mod = await admin.entities.AdventureModule.get(module_id);
      if (!mod) return Response.json({ error: 'Module not found' }, { status: 404 });
      // Accessible if shared, or owned by this user
      if (mod.visibility !== 'shared' && mod.created_by_id !== user.id) {
        return Response.json({ error: 'Module not found' }, { status: 404 });
      }
      return Response.json({ module: mod });
    }

    // Upload: read the document, extract a detailed DM brief, create the record
    if (op === 'upload') {
      const { file_url, title, description, visibility } = body;
      if (!file_url) return Response.json({ error: 'file_url required' }, { status: 400 });

      const gameSystem = body.game_system === 'starfrontiers' ? 'starfrontiers' : body.game_system === 'boothill' ? 'boothill' : body.game_system === 'gammaworld' ? 'gammaworld' : body.game_system === 'indianajones' ? 'indianajones' : body.game_system === 'spelljammer' ? 'spelljammer' : body.game_system === 'darksun' ? 'darksun' : body.game_system === 'topsecret' ? 'topsecret' : 'add1e';
      const isSF = gameSystem === 'starfrontiers';
      const isBH = gameSystem === 'boothill';
      const isGW = gameSystem === 'gammaworld';
      const isIJ = gameSystem === 'indianajones';
      const isSJ = gameSystem === 'spelljammer';
      const isDS = gameSystem === 'darksun';
      const isTS = gameSystem === 'topsecret';

      const extractionPrompt = isSF
        ? `You are preparing a detailed reference brief from an uploaded Star Frontiers adventure module so an AI Game Master can run it faithfully.

Read the attached module document in full and produce a COMPREHENSIVE brief that preserves everything needed to run the adventure. Do NOT summarize away tactical details.

Structure your brief exactly as:

## MODULE OVERVIEW
Title, author/source, recommended character levels, estimated length.

## PREMISE & BACKGROUND
The setup, hooks, and what the adventure is about — in enough detail to brief players.

## KEY LOCATIONS & AREAS
For EACH location, room, or area, preserve: the location name/number; what the party sees (description); contents (creatures, NPCs, gear, hazards, secrets, puzzles); any special rules or conditions; hidden elements the GM knows but players discover through play. Keep these FULLY detailed — this is the spine of the adventure.

## NPCs
Each named NPC: who they are, disposition, stats if given, goals, secrets, what they know.

## CREATURES & COMBAT
Creature types, stats, numbers, tactics, special abilities.

## TREASURE & EQUIPMENT
Notable gear, weapons, credits, and items, with locations.

## HAZARDS & TRAPS
Each hazard: where, what it does, how to detect/avoid, damage.

## SPECIAL RULES & CONDITIONS
Unique mechanics, random encounters, environmental rules, victory conditions.

## RUNNING NOTES
Tone, pacing advice, anything the GM should know.

Rules:
- Be thorough — better too much detail than too little. The GM needs area-by-area content.
- Preserve exact numbers (damage, STA, skill check targets, credit amounts).
- Use Star Frontiers mechanics: percentile (d100) skill checks, STA/stamina, species (Human, Yazirian, Vrusk, Dralasite), PSA skill areas (Military, Technological, Biosocial).
- If the document is not an adventure module, still extract whatever useful content exists and note that.
- Write in clear prose. This brief will be injected into the GM's instructions.`
        : isBH
        ? `You are preparing a detailed reference brief from an uploaded Boot Hill Wild West adventure module so an AI Game Master can run it faithfully.

Read the attached module document in full and produce a COMPREHENSIVE brief that preserves everything needed to run the adventure. Do NOT summarize away tactical details.

Structure your brief exactly as:

## MODULE OVERVIEW
Title, author/source, recommended character levels, estimated length.

## PREMISE & BACKGROUND
The setup, hooks, and what the adventure is about — in enough detail to brief players.

## KEY LOCATIONS & AREAS
For EACH location, building, or area, preserve: the location name; what the party sees (description); contents (NPCs, outlaws, gear, hazards, secrets); any special rules or conditions; hidden elements the GM knows but players discover through play. Keep these FULLY detailed — this is the spine of the adventure.

## NPCs
Each named NPC: who they are, disposition, stats if given, goals, secrets, what they know.

## COMBATANTS & GUNFIGHTS
Outlaw types, stats, numbers, tactics, weapons, special abilities. Note intended gunfight locations and ambush points.

## TREASURE & EQUIPMENT
Notable gear, weapons, horses, dollars, and items, with locations.

## HAZARDS & TRAPS
Each hazard: where, what it does, how to detect/avoid, damage.

## SPECIAL RULES & CONDITIONS
Unique mechanics, random encounters, environmental rules, victory conditions.

## RUNNING NOTES
Tone, pacing advice, anything the GM should know.

Rules:
- Be thorough — better too much detail than too little. The GM needs area-by-area content.
- Preserve exact numbers (damage, attribute scores, dollar amounts).
- Use Boot Hill mechanics: percentile (d100) attributes (Speed, Gun Accuracy, Throwing Accuracy, Strength, Bravery, Experience), wound location/severity tables, quick-draw, dollars.
- If the document is not an adventure module, still extract whatever useful content exists and note that.
- Write in clear prose. This brief will be injected into the GM's instructions.`
        : isGW
        ? `You are preparing a detailed reference brief from an uploaded Gamma World post-apocalyptic science-fantasy adventure module so an AI Game Master can run it faithfully.

Read the attached module document in full and produce a COMPREHENSIVE brief that preserves everything needed to run the adventure. Do NOT summarize away tactical details.

Structure your brief exactly as:

## MODULE OVERVIEW
Title, author/source, recommended character levels, estimated length.

## PREMISE & BACKGROUND
The setup, hooks, and what the adventure is about — in enough detail to brief players.

## KEY LOCATIONS & AREAS
For EACH location, ruin, or area, preserve: the location name/number; what the party sees (description); contents (creatures, NPCs, artifacts, hazards, secrets, puzzles); any special rules or conditions; hidden elements the GM knows but players discover through play. Keep these FULLY detailed — this is the spine of the adventure.

## NPCs
Each named NPC: who they are, disposition, stats if given, goals, secrets, what they know.

## CREATURES & COMBAT
Creature types, stats, numbers, tactics, special abilities. Note any mutations present.

## TREASURE & ARTIFACTS
Notable ancient artifacts, gear, weapons, domars, and items, with locations. Include Tech Levels for artifacts if given.

## HAZARDS & TRAPS
Each hazard: where, what it does, how to detect/avoid, damage. Include radiation, poison, and environmental hazards.

## SPECIAL RULES & CONDITIONS
Unique mechanics, random encounters, environmental rules, victory conditions.

## RUNNING NOTES
Tone, pacing advice, anything the GM should know.

Rules:
- Be COMPLETE but CONCISE — use compact bullet points, not prose paragraphs. The GM needs area-by-area content (what's in each area: creatures, treasure, traps, secrets).
- Preserve exact numbers (damage, HP, attribute scores, domar amounts).
- Use Gamma World mechanics: 7 attributes 3-18 (PS Physical Strength, MS Mental Strength, DX Dexterity, CN Constitution, IN Intelligence, CH Charisma, SN Senses), mutations (physical and mental, with defects), genotypes (Pure Strain Human, Altered Human, Mutated Animal, Sentient Plant), domars (ancient currency), Tech Levels for artifacts, Gamma Terra setting.
- If the document is not an adventure module, note that and extract what you can.
- This brief will be injected into the GM's instructions.`
        : isIJ
        ? `You are preparing a detailed reference brief from an uploaded Indiana Jones pulp adventure module so an AI Game Master can run it faithfully.

Read the attached module document in full and produce a COMPREHENSIVE brief that preserves everything needed to run the adventure. Do NOT summarize away tactical details.

Structure your brief exactly as:

## MODULE OVERVIEW
Title, author/source, recommended character levels, estimated length.

## PREMISE & BACKGROUND
The setup, hooks, and what the adventure is about — in enough detail to brief players. Note the 1930s time period and locale.

## KEY LOCATIONS & AREAS
For EACH location, tomb, ruin, or area, preserve: the location name; what the party sees (description); contents (NPCs, enemies, artifacts, hazards, secrets, puzzles, traps); any special rules or conditions; hidden elements the GM knows but players discover through play. Keep these FULLY detailed — this is the spine of the adventure.

## NPCs
Each named NPC: who they are, disposition, stats if given, goals, secrets, what they know. Note rival archaeologists, Nazis, gangsters, locals, and allies.

## ENEMIES & COMBAT
Enemy types (Nazis, mercenaries, thugs, cultists, natives, wild animals), stats, numbers, tactics, weapons. Note intended fight locations, chases, and ambush points.

## TREASURE & ARTIFACTS
Notable artifacts, gear, weapons, dollars, and items, with locations. Note any ancient artifacts and their powers/curses.

## HAZARDS & TRAPS
Each hazard/trap: where, what it does, how to detect/avoid, damage. Include ancient traps, poison, environmental hazards, collapsing structures.

## SPECIAL RULES & CONDITIONS
Unique mechanics, chase rules, random encounters, environmental rules, victory conditions.

## RUNNING NOTES
Tone, pacing advice, anything the GM should know.

Rules:
- Be COMPLETE but CONCISE — use compact bullet points, not prose paragraphs. The GM needs area-by-area content (what's in each area: enemies, treasure, traps, secrets).
- Preserve exact numbers (damage, attribute scores, dollar amounts, wound levels).
- Use Indiana Jones mechanics: six percentile attributes 1-100 (Strength, Movement, Prowess, Backbone, Instinct, Appeal), d100 roll-under resolution, Prowess for combat to-hit, light/medium/serious wound levels, dollars, 1930s pulp setting.
- If the document is not an adventure module, note that and extract what you can.
- This brief will be injected into the GM's instructions.`
        : isSJ
        ? `You are preparing a detailed reference brief from an uploaded Spelljammer (AD&D 2nd Edition Adventures in Space) adventure module so an AI Game Master can run it faithfully.

Read the attached module document in full and produce a COMPREHENSIVE brief that preserves everything needed to run the adventure. Do NOT summarize away tactical details.

Structure your brief exactly as:

## MODULE OVERVIEW
Title, author/source, recommended character/crew levels, estimated length.

## PREMISE & BACKGROUND
The setup, hooks, and what the adventure is about — in enough detail to brief players. Note the crystal sphere(s) and locales involved.

## KEY LOCATIONS & AREAS
For EACH location, ship, asteroid, planet, or area, preserve: the location name; what the party sees (description); contents (creatures, NPCs, treasure, traps, secrets, puzzles); any special rules or conditions; hidden elements the GM knows but players discover through play. Keep these FULLY detailed — this is the spine of the adventure.

## NPCs & CREWS
Each named NPC: who they are, disposition, stats if given, goals, secrets, what they know. Note ship captains, the Arcane, neogi, mind flayers, and rival crews.

## MONSTERS & COMBAT
Monster/creature types, stats, numbers, tactics, special abilities. Note any ship-to-ship combat encounters, boarding actions, and spelljamming tactical details.

## TREASURE & EQUIPMENT
Notable treasures, magic items, spelljamming helms, gold, and gear, with locations.

## TRAPS & HAZARDS
Each trap: where, what it does, how to detect/disarm, damage. Include void hazards, fouled air, gravity plane dangers, and phlogiston fire risks.

## SPECIAL RULES & CONDITIONS
Unique mechanics, ship combat (SR, hull points, weapons), environmental rules, wildspace/Flow rules, victory conditions.

## RUNNING NOTES
Tone, pacing advice, anything the GM should know.

Rules:
- Be COMPLETE but CONCISE — use compact bullet points, not prose paragraphs. The GM needs area-by-area content (what's in each area: monsters, treasure, traps, secrets).
- Preserve exact numbers (damage, HP, save values, treasure amounts, SR, hull points).
- Use Spelljammer (AD&D 2nd Edition) mechanics: ability scores 3-18 (STR/INT/WIS/DEX/CON/CHA), THAC0, saving throws (5 categories), hit dice by class, spell slots, spelljamming helms (powered by spellcaster spell energy), Ship Rating (SR), hull points, ship weapons (catapults, ballistae, rams), crystal spheres, the phlogiston, air envelopes, gravity planes.
- If the document is not an adventure module, note that and extract what you can.
- This brief will be injected into the GM's instructions.`
        : isDS
        ? `You are preparing a detailed reference brief from an uploaded Dark Sun (AD&D 2nd Edition) adventure module set on the dying desert world of Athas so an AI Game Master can run it faithfully.

Read the attached module document in full and produce a COMPREHENSIVE brief that preserves everything needed to run the adventure. Do NOT summarize away tactical details.

Structure your brief exactly as:

## MODULE OVERVIEW
Title, author/source, recommended character levels, estimated length.

## PREMISE & BACKGROUND
The setup, hooks, and what the adventure is about — in enough detail to brief players. Note the Athasian setting (city-state, region, sorcerer-king, arena).

## KEY LOCATIONS & AREAS
For EACH location, ruin, or area, preserve: the location name; what the party sees (description); contents (creatures, NPCs, treasure, traps, secrets); any special rules or conditions; hidden elements the GM knows but players discover through play. Keep these FULLY detailed — this is the spine of the adventure.

## NPCs
Each named NPC: who they are, disposition, stats if given, goals, secrets, what they know. Note templars, gladiators, merchant-house agents, elemental clerics, and sorcerer-kings.

## MONSTERS & COMBAT
Monster/creature types, stats, numbers, tactics, special abilities. Note the brutal Athasian ecology and psionic foes.

## TREASURE & EQUIPMENT
Notable treasures, magic items, ceramic pieces, and gear, with locations. Note whether weapons are metal (rare treasure) or bone/stone/obsidian.

## TRAPS & HAZARDS
Each trap: where, what it does, how to detect/disarm, damage. Include desert hazards, dehydration, defiler blight, and arena dangers.

## SPECIAL RULES & CONDITIONS
Unique mechanics, psionics, defiling vs preserving, environmental rules, victory conditions.

## RUNNING NOTES
Tone, pacing advice, anything the GM should know.

Rules:
- Be COMPLETE but CONCISE — use compact bullet points, not prose paragraphs. The GM needs area-by-area content (what's in each area: monsters, treasure, traps, secrets).
- Preserve exact numbers (damage, HP, save values, treasure amounts).
- Use Dark Sun (AD&D 2nd Edition) mechanics: ability scores 3-18 (4d6 drop lowest, may exceed 18 with racial mods), THAC0, saving throws (5 categories), hit dice by class, spell slots, defiling vs preserving magic, psionics (PSPs, disciplines), ceramic pieces (cp), metal scarcity (bone/stone/obsidian weapons), sorcerer-kings, gladiators, slavery, the dying world of Athas beneath a crimson sun.
- If the document is not an adventure module, note that and extract what you can.
- This brief will be injected into the GM's instructions.`
        : isTS
        ? `You are preparing a detailed reference brief from an uploaded Top Secret espionage mission module so an AI Administrator (Game Master) can run it faithfully.

Read the attached module document in full and produce a COMPREHENSIVE brief that preserves everything needed to run the mission. Do NOT summarize away tactical details.

Structure your brief exactly as:

## MODULE OVERVIEW
Title, author/source, recommended agent experience levels, estimated length.

## PREMISE & BACKGROUND
The mission briefing, objectives, hooks, and what the operation is about — in enough detail to brief the agents. Note the time period, theatre, and agencies involved.

## KEY LOCATIONS & AREAS
For EACH location, building, facility, or area, preserve: the location name; what the agents see (description); contents (NPCs, enemies, security, intel, hazards, secrets, traps); any special rules or conditions; hidden elements the GM knows but agents discover through play. Keep these FULLY detailed — this is the spine of the mission.

## NPCs
Each named NPC: who they are, disposition, stats if given, goals, secrets, what they know. Note handlers, assets, rival agents, defectors, informants, and enemy operatives.

## ENEMIES & COMBAT
Enemy types (guards, agents, soldiers, hitmen), stats, numbers, tactics, weapons. Note patrol routes, alarm systems, and ambush points.

## TREASURE & EQUIPMENT
Notable gear, weapons, dollars, forged documents, and intelligence recovered, with locations.

## HAZARDS & TRAPS
Each hazard/trap: where, what it does, how to detect/avoid, damage. Include security systems, alarms, mines, and environmental hazards.

## SPECIAL RULES & CONDITIONS
Unique mechanics, chase rules, random encounters, stealth and surveillance rules, victory conditions.

## RUNNING NOTES
Tone, pacing advice, anything the GM should know.

Rules:
- Be COMPLETE but CONCISE — use compact bullet points, not prose paragraphs. The GM needs area-by-area content (what's in each area: enemies, intel, traps, secrets).
- Preserve exact numbers (damage, attribute scores, dollar amounts, wound levels).
- Use Top Secret mechanics: seven percentile attributes 1-100 (Physical Strength, Physical Beauty, Charm, Courage, Knowledge, Judgment, Coordination), d100 roll-under resolution, Coordination for combat to-hit, Courage nerve modifier, wound location and severity tables, dollars, Cold War espionage setting.
- If the document is not a mission module, note that and extract what you can.
- This brief will be injected into the GM's instructions.`
        : `You are preparing a detailed reference brief from an uploaded AD&D 1st Edition adventure module so an AI Dungeon Master can run it faithfully.

Read the attached module document in full and produce a COMPREHENSIVE brief that preserves everything needed to run the adventure. Do NOT summarize away tactical details.

Structure your brief exactly as:

## MODULE OVERVIEW
Title, author/source, recommended character levels, estimated length.

## PREMISE & BACKGROUND
The setup, hooks, and what the adventure is about — in enough detail to brief players.

## KEY LOCATIONS & ROOMS
For EACH location or room, preserve: the location name/number; what the party sees (description); contents (monsters, NPCs, treasure, traps, secrets, puzzles); any special rules or conditions; hidden elements the DM knows but players discover through play. Keep these FULLY detailed — this is the spine of the adventure.

## NPCs
Each named NPC: who they are, disposition, stats if given, goals, secrets, what they know.

## MONSTERS & COMBAT
Monster types, stats, numbers, tactics, special abilities.

## TREASURE
Notable treasures, magic items, gold, with locations.

## TRAPS & HAZARDS
Each trap: where, what it does, how to detect/disarm, damage.

## SPECIAL RULES & CONDITIONS
Unique mechanics, wandering monsters, environmental rules, victory conditions.

## RUNNING NOTES
Tone, pacing advice, anything the DM should know.

Rules:
- Be COMPLETE but CONCISE — use compact bullet points, not prose paragraphs. The DM needs room-by-room content (what's in each room: monsters, treasure, traps, secrets).
- Preserve exact numbers (damage, HP, save values, treasure amounts).
- Omit flowery descriptions — keep only tactical and mechanical details.
- If the document is not an adventure module, note that and extract what you can.
- This brief will be injected into the DM's instructions.`;

      const extraction = await base44.integrations.Core.InvokeLLM({
        prompt: extractionPrompt,
        file_urls: [file_url],
        response_json_schema: {
          type: "object",
          properties: {
            title: { type: "string" },
            author: { type: "string" },
            recommended_levels: { type: "string" },
            description: { type: "string" },
            brief: { type: "string" }
          },
          required: ["brief"]
        },
        model: "gemini_3_flash"
      });

      let ext = extraction;
      console.log('MODULE UPLOAD raw extraction type:', typeof ext, '| preview:', JSON.stringify(ext).slice(0, 600));
      if (typeof ext === 'string') { try { ext = JSON.parse(ext); } catch { ext = {}; } }
      if (ext && ext.response && typeof ext.response === 'object') ext = ext.response;
      if (ext && ext.brief && typeof ext.brief === 'object') ext = ext.brief;

      // Surface API/LLM errors directly instead of masking them as "could not read"
      if (ext && ext.error && !ext.brief) {
        return Response.json({ error: 'The DM encountered an error reading the document: ' + ext.error }, { status: 500 });
      }

      const brief = (ext && ext.brief) || '';
      console.log('MODULE UPLOAD brief length:', brief.length, '| preview:', brief.slice(0, 300));
      // Only reject if the brief is empty or too short to be a real module brief (which is thousands of chars).
      // Removed the aggressive keyword regex that could false-positive on legitimate briefs.
      const unreadable = !brief || brief.trim().length < 100;
      if (unreadable) {
        return Response.json({ error: 'The DM could not extract content from that document — it may be empty, corrupted, or image-only. Try saving the content as a .txt file and uploading that instead.' }, { status: 400 });
      }

      const finalTitle = (title && title.trim()) || (ext && ext.title) || 'Untitled Module';

      const module = await base44.entities.AdventureModule.create({
        title: finalTitle,
        description: (description && description.trim()) || (ext && ext.description) || '',
        author: (ext && ext.author) || '',
        recommended_levels: (ext && ext.recommended_levels) || '',
        file_url,
        content: (ext && ext.brief) || '',
        game_system: gameSystem,
        visibility: visibility === 'private' ? 'private' : 'shared',
        tags: []
      });

      return Response.json({ module });
    }

    // Delete a module (uploader only)
    if (op === 'delete') {
      const { module_id } = body;
      if (!module_id) return Response.json({ error: 'module_id required' }, { status: 400 });
      const mod = await admin.entities.AdventureModule.get(module_id);
      if (!mod) return Response.json({ error: 'Module not found' }, { status: 404 });
      if (mod.created_by_id !== user.id) return Response.json({ error: 'Only the uploader can remove a module' }, { status: 403 });
      await base44.entities.AdventureModule.delete(module_id);
      return Response.json({ success: true });
    }

    return Response.json({ error: 'Unknown operation: ' + op }, { status: 400 });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});