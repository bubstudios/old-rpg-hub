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

      const gameSystem = body.game_system === 'starfrontiers' ? 'starfrontiers' : body.game_system === 'boothill' ? 'boothill' : body.game_system === 'gammaworld' ? 'gammaworld' : 'add1e';
      const isSF = gameSystem === 'starfrontiers';
      const isBH = gameSystem === 'boothill';
      const isGW = gameSystem === 'gammaworld';

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