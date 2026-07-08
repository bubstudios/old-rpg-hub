import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

const SYSTEM_LABELS = {
  add1e: 'AD&D 1st Edition', starfrontiers: 'Star Frontiers', gammaworld: 'Gamma World',
  boothill: 'Boot Hill', indianajones: 'Indiana Jones', spelljammer: 'Spelljammer (AD&D 2e)',
  darksun: 'Dark Sun (AD&D 2e)', topsecret: 'Top Secret', greyhawk: 'Greyhawk (AD&D 1e)',
  forgottenrealms: 'Forgotten Realms (AD&D)', hollowworld: 'Hollow World (BECMI)',
  conan: 'Hyborian Age (Conan)', redsonja: 'Hyborian Age (Red Sonja)', buckrogers: 'Buck Rogers XXVc',
  ghostbusters: 'Ghostbusters (D6 System)', gangbusters: 'Gangbusters', legionofdoom: 'Legion of Doom',
  starwars: 'Star Wars (WEG D6)', marvel: 'Marvel Super Heroes (FASERIP)', dcheroes: 'DC Heroes (Mayfair)',
  jamesbond: 'James Bond 007', shadowrun: 'Shadowrun', cyberpunk: 'Cyberpunk',
  traveller: 'Traveller', ravenloft: 'Ravenloft (AD&D 2e)', oddnd: 'Original D&D (1974)',
  bxdnd: 'B/X D&D', add2e: 'AD&D 2nd Edition', dnd35: 'D&D 3.5', dnd4e: 'D&D 4e', dnd5e: 'D&D 5e'
};

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const { campaign_id } = body;
    if (!campaign_id) return Response.json({ error: 'campaign_id required' }, { status: 400 });

    const admin = base44.asServiceRole;
    const campaign = await admin.entities.Campaign.get(campaign_id);
    if (!campaign) return Response.json({ error: 'Campaign not found' }, { status: 404 });

    const gs = campaign.game_system || 'add1e';
    const systemLabel = SYSTEM_LABELS[gs] || 'AD&D 1st Edition';
    const dmTitle = ['starwars', 'marvel', 'dcheroes', 'jamesbond', 'shadowrun', 'cyberpunk', 'traveller'].includes(gs) ? 'Game Master' : 'Dungeon Master';
    const currencyLabel = ['starfrontiers', 'buckrogers', 'traveller'].includes(gs) ? 'credits' : gs === 'gammaworld' ? 'domars' : gs === 'darksun' ? 'ceramic pieces' : 'gold';

    // Bound "this session" to entries after the last ended session
    const priorSessions = await admin.entities.Session.filter({ campaign_id }, '-created_date', 50);
    const lastSession = priorSessions[0] || null;
    const sinceDate = lastSession && lastSession.ended_at ? lastSession.ended_at : null;

    const recentEntries = await admin.entities.JournalEntry.filter({ campaign_id }, '-created_date', 120);
    let sessionEntries = recentEntries.reverse();
    if (sinceDate) {
      const idx = sessionEntries.findIndex(e => e.created_date && e.created_date > sinceDate);
      sessionEntries = idx >= 0 ? sessionEntries.slice(idx) : [];
    }

    let transcript = sessionEntries.map(e => {
      if (e.entry_type === 'dice_roll') {
        const rolls = (e.dice_rolls || []).map(r => `${r.description || r.die}: ${r.total}${r.result ? ' (' + r.result + ')' : ''}`).join(', ');
        return `Roll (${e.acting_character_name || 'Party'}): ${rolls || e.narration || ''}`;
      }
      if (e.entry_type === 'discussion') return `(OOC) ${e.acting_character_name || 'Party'}: ${e.narration || ''}`;
      if (e.entry_type === 'action' || e.player_action) return `${e.acting_character_name || 'Party'}: ${e.player_action || ''}`;
      if (e.narration) return `${dmTitle}: ${String(e.narration).substring(0, 500)}`;
      return '';
    }).filter(Boolean).join('\n');
    if (transcript.length > 8000) transcript = transcript.slice(0, 8000) + '\n...[transcript truncated]';

    const characters = await admin.entities.Character.filter({ campaign_id, status: 'active' });
    const partyState = characters.map(c => `${c.name} (${c.race} ${c.character_class}, Lvl ${c.level}, HP ${c.hp_current}/${c.hp_max}, XP ${c.xp}, ${currencyLabel} ${c.gold})`).join('; ');

    let npcRoster = 'none';
    try {
      const npcs = await admin.entities.NPC.filter({ campaign_id });
      npcRoster = npcs.map(n => `${n.name} [${n.disposition || 'unknown'}]${n.what_we_know ? ' — ' + String(n.what_we_know).replace(/\n/g, '; ').substring(0, 200) : ''}`).join('; ') || 'none';
    } catch (e) { /* NPC entity unavailable */ }

    const sessionLoot = await admin.entities.LootRecord.filter({ campaign_id }, '-created_date', 50);
    const lootThisSession = sinceDate ? sessionLoot.filter(l => l.created_date && l.created_date > sinceDate) : sessionLoot;
    const lootSummary = lootThisSession.map(l => `${l.item_name || 'unknown'} (${l.gold || 0} ${currencyLabel}, from ${l.source || 'unknown'})`).join('; ');

    const sessionDeaths = await admin.entities.DeathRecord.filter({ campaign_id }, '-created_date', 20);
    const deathsThisSession = sinceDate ? sessionDeaths.filter(d => d.created_date && d.created_date > sinceDate) : sessionDeaths;
    const deathsSummary = deathsThisSession.map(d => `${d.character_name} (${d.cause_of_death || 'unknown'})`).join('; ');

    const xpThisSession = sessionEntries.reduce((sum, e) => sum + (Number(e.xp_awarded) || 0), 0);

    const prompt = `You are the ${dmTitle} wrapping up a play session of "${campaign.name}" (${systemLabel}). Compile a session chronicle from the events below.

## Session Events (transcript, oldest to newest)
${transcript || '(No actions were taken this session.)'}

## Party State (end of session)
${partyState || 'No active characters.'}

## NPCs Encountered / Known
${npcRoster}

## Treasure Found This Session
${lootSummary || 'None.'}

## Casualties This Session
${deathsSummary || 'None.'}

## Current Scene (from campaign state)
${campaign.current_scene || 'Unknown.'}

Produce a JSON object with these fields — write in vivid, in-world prose as the ${dmTitle} summarizing for the party:
- title: a short, evocative session title (3-6 words)
- recap: a 2-4 paragraph narrative recap of what happened this session
- rewards_summary: a summary of XP earned and any rewards, favors, or boons gained (XP total this session: ${xpThisSession})
- treasure_summary: a list of treasure/${currencyLabel}/gear gained this session (or "None" if nothing)
- npc_changes: notable NPC developments — new NPCs met, relationships shifted, deaths, revelations (or "None")
- unresolved_clues: open threads, mysteries, and plot hooks still unresolved
- current_location: where the party is right now at session's end (one sentence)
- next_session_hook: a one-to-two sentence cliffhanger or hook to draw the party back next session`;

    const llmResponse = await base44.integrations.Core.InvokeLLM({
      prompt,
      response_json_schema: {
        type: "object",
        properties: {
          title: { type: "string" },
          recap: { type: "string" },
          rewards_summary: { type: "string" },
          treasure_summary: { type: "string" },
          npc_changes: { type: "string" },
          unresolved_clues: { type: "string" },
          current_location: { type: "string" },
          next_session_hook: { type: "string" }
        },
        required: ["title", "recap"]
      },
      model: "claude_sonnet_4_6"
    });

    let result = llmResponse;
    if (typeof result === 'string') {
      try { result = JSON.parse(result); } catch { const m = result.match(/\{[\s\S]*\}/); result = m ? JSON.parse(m[0]) : { title: 'Session Ended', recap: result }; }
    }
    if (result && result.response && typeof result.response === 'object') result = result.response;
    if (!result || typeof result !== 'object') result = { title: 'Session Ended', recap: 'The session concludes.' };

    const sessionNumber = (priorSessions.length || 0) + 1;
    const nowIso = new Date().toISOString();
    const startedAt = sinceDate || (sessionEntries[0] && sessionEntries[0].created_date) || nowIso;

    const session = await base44.entities.Session.create({
      campaign_id,
      session_number: sessionNumber,
      title: (result.title || `Session ${sessionNumber}`).trim(),
      summary: result.recap || '',
      status: 'closed',
      started_at: startedAt,
      ended_at: nowIso,
      xp_awarded: xpThisSession,
      recap: result.recap || '',
      rewards_summary: result.rewards_summary || '',
      treasure_summary: result.treasure_summary || '',
      npc_changes: result.npc_changes || '',
      unresolved_clues: result.unresolved_clues || '',
      current_location: result.current_location || '',
      next_session_hook: result.next_session_hook || ''
    });

    return Response.json({ session });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});