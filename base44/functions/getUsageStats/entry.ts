import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
    if (user.role !== 'admin') return Response.json({ error: 'Forbidden — admin only' }, { status: 403 });

    const CREDITS_PER_TURN = 15;

    // Fetch narration entries (each = 1 DM function call), most recent first
    const entries = await base44.asServiceRole.entities.JournalEntry.filter(
      { entry_type: 'narration' },
      '-created_date',
      5000
    );

    // Fetch characters to map character name -> user id
    const characters = await base44.asServiceRole.entities.Character.list();
    const charNameToUserId = {};
    for (const c of characters) {
      if (c.name && c.created_by_id) {
        charNameToUserId[c.name] = c.created_by_id;
      }
    }

    // Fetch users for display names (may fail if restricted; fall back to character names)
    let userIdToName = {};
    try {
      const users = await base44.asServiceRole.entities.User.list();
      for (const u of users) {
        userIdToName[u.id] = u.full_name || u.email || 'Unknown';
      }
    } catch (e) { /* fall back to character names */ }

    // Current calendar month boundary
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const monthEntries = entries.filter(e => new Date(e.created_date) >= monthStart);

    const groupByUser = (list) => {
      const map = {};
      for (const e of list) {
        const charName = e.acting_character_name || 'Unknown';
        const userId = charNameToUserId[charName];
        const displayName = userId ? (userIdToName[userId] || charName) : charName;
        if (!map[displayName]) map[displayName] = { name: displayName, turns: 0, characters: new Set() };
        map[displayName].turns++;
        if (charName !== 'Unknown') map[displayName].characters.add(charName);
      }
      return Object.values(map)
        .map(({ name, turns, characters }) => ({
          name,
          turns,
          estimatedCredits: turns * CREDITS_PER_TURN,
          characterNames: [...characters]
        }))
        .sort((a, b) => b.turns - a.turns);
    };

    return Response.json({
      thisMonth: {
        totalTurns: monthEntries.length,
        estimatedCredits: monthEntries.length * CREDITS_PER_TURN,
        perUser: groupByUser(monthEntries)
      },
      allTime: {
        totalTurns: entries.length,
        estimatedCredits: entries.length * CREDITS_PER_TURN,
        perUser: groupByUser(entries)
      }
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});