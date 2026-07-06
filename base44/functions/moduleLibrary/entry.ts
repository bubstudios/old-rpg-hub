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

      const gameSystem = body.game_system === 'starfrontiers' ? 'starfrontiers' : 'add1e';
      const isSF = gameSystem === 'starfrontiers';

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
- Be thorough — better too much detail than too little. The DM needs room-by-room content.
- Preserve exact numbers (damage, HP, save values, treasure amounts).
- If the document is not an adventure module, still extract whatever useful content exists and note that.
- Write in clear prose. This brief will be injected into the DM's instructions.`;

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
        model: "claude_sonnet_4_6"
      });

      let ext = extraction;
      if (typeof ext === 'string') { try { ext = JSON.parse(ext); } catch { ext = {}; } }
      if (ext && ext.brief && typeof ext.brief === 'object') ext = ext.brief;

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