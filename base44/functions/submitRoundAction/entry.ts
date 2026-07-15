import { createClientFromRequest } from 'npm:@base44/sdk@0.8.38';

const DM2_SYSTEMS = ['starwars','marvel','dcheroes','jamesbond','shadowrun','cyberpunk','traveller','ravenloft','oddnd','bxdnd','add2e','dnd35','dnd4e','dnd5e'];

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { campaign_id, action, character_id, is_agree } = await req.json();

    // Read all active characters using service role (bypasses any RLS, ensures full party)
    const characters = await base44.asServiceRole.entities.Character.filter(
      { campaign_id, status: 'active' }
    );

    const myChar = characters.find(c => c.id === character_id && c.created_by_id === user.id);
    if (!myChar) return Response.json({ error: 'Character not found' }, { status: 404 });

    // Re-read campaign to get latest pending_actions (avoid overwriting others)
    const camp = await base44.asServiceRole.entities.Campaign.get(campaign_id);

    // If DM is already processing, tell the client to wait
    if (camp.dm_processing) {
      const updatedAt = camp.updated_date ? new Date(camp.updated_date).getTime() : 0;
      const stale = updatedAt && Date.now() - updatedAt > 90000;
      if (!stale) {
        return Response.json({ status: 'dm_busy', pending_actions: camp.pending_actions || [] });
      }
      // Auto-reset stale dm_processing
      await base44.asServiceRole.entities.Campaign.update(campaign_id, {
        dm_processing: false, pending_actions: []
      });
    }

    const existingPending = Array.isArray(camp.pending_actions) ? camp.pending_actions : [];

    // Don't allow double-submission by the same character
    if (existingPending.some(a => a.character_id === character_id)) {
      const submittedIds = existingPending.map(a => a.character_id);
      const missing = characters.filter(c => !submittedIds.includes(c.id));
      return Response.json({
        status: 'waiting',
        pending_actions: existingPending,
        missing_count: missing.length,
        missing_names: missing.map(c => c.name)
      });
    }

    const newEntry = {
      character_id,
      character_name: myChar.name,
      action: action || '',
      is_agree: !!is_agree,
      submitted_at: new Date().toISOString()
    };

    const pending = [...existingPending, newEntry];
    await base44.asServiceRole.entities.Campaign.update(campaign_id, {
      pending_actions: pending, dm_processing: false
    });

    const submittedIds = pending.map(a => a.character_id);
    const missing = characters.filter(c => !submittedIds.includes(c.id));

    if (missing.length > 0) {
      return Response.json({
        status: 'waiting',
        pending_actions: pending,
        missing_count: missing.length,
        missing_names: missing.map(c => c.name)
      });
    }

    // All party members have acted — claim the DM invocation
    await base44.asServiceRole.entities.Campaign.update(campaign_id, { dm_processing: true });

    const combined = pending.map(a =>
      a.is_agree
        ? `${a.character_name} agrees and stands ready (no specific action this turn).`
        : `${a.character_name}: ${a.action}`
    ).join('\n');

    const dmFunc = DM2_SYSTEMS.includes(camp.game_system) ? 'dungeonMaster2' : 'dungeonMaster';

    return Response.json({
      status: 'all_in',
      combined_action: combined,
      dm_function: dmFunc,
      pending_actions: []
    });
  } catch (error) {
    console.error('submitRoundAction error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});