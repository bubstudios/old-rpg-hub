import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

const BLOCK_DURATION_MS = 4 * 60 * 60 * 1000; // 4 hours
const PAUSE_THRESHOLD_MS = 5 * 60 * 1000; // 5 min — gaps larger than this mean the user stepped away
const MAX_FREE_FRIENDS = 3;

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const admin = base44.asServiceRole;
    const body = await req.json();
    const { op, campaign_id, email, user_id: bodyUserId } = body;

    if (!campaign_id) {
      return Response.json({ error: 'campaign_id required' }, { status: 400 });
    }

    const campaign = await admin.entities.Campaign.get(campaign_id);
    if (!campaign) {
      return Response.json({ error: 'Campaign not found' }, { status: 404 });
    }

    // Resolve current user
    let userId = bodyUserId || null;
    let userEmail = null;
    try {
      const user = await base44.auth.me();
      if (user) {
        userId = user.id;
        userEmail = user.email;
      }
    } catch (e) { /* not authenticated — use body fallback */ }

    if (!userId && (op === 'getStatus')) {
      if (bodyUserId) {
        userId = bodyUserId;
        try {
          const u = await admin.entities.User.get(bodyUserId);
          if (u) userEmail = u.email;
        } catch (e2) { /* ignore */ }
      }
    }

    // ── getStatus: check billing access and timer ──
    // Time is a GLOBAL, PAUSABLE balance:
    //   • Solo blocks follow the user across ALL campaigns (not just where purchased)
    //   • Table blocks are scoped to the campaign they were bought for
    //   • The timer only counts down while the user is actively playing (polling).
    //     If the gap since the last poll exceeds 5 minutes, time is paused.
    if (op === 'getStatus') {
      const freeFriends = (campaign.free_friend_emails || []).map(e => e.toLowerCase());
      const isFreeFriend = !!(userEmail && freeFriends.includes(userEmail.toLowerCase()));
      const isOwner = campaign.created_by_id === userId;
      const now = Date.now();

      // 1. ALL active solo blocks for this user (global — any campaign)
      const soloBlocks = userId
        ? await admin.entities.SessionBlock.filter({ user_id: userId, session_type: 'solo', status: 'active' }, 'created_date', 50)
        : [];

      // 2. Active table blocks for THIS campaign only
      const tableBlocks = await admin.entities.SessionBlock.filter({ campaign_id, session_type: 'table', status: 'active' }, 'created_date', 20);

      // 3. Process pausable timer for each block
      async function processBlock(b) {
        let remaining = b.remaining_ms;
        // Migrate old blocks that don't have remaining_ms yet
        if (remaining == null) {
          if (b.started_at && b.expires_at) {
            remaining = Math.max(0, new Date(b.expires_at).getTime() - now);
          } else {
            remaining = BLOCK_DURATION_MS;
          }
        }
        // If the block was ticking, count elapsed time — but only if the gap is small
        // (a large gap means the user stepped away → time paused)
        if (b.last_active_at) {
          const elapsed = now - new Date(b.last_active_at).getTime();
          if (elapsed > 0 && elapsed < PAUSE_THRESHOLD_MS) {
            remaining = Math.max(0, remaining - elapsed);
          }
        }
        // Expire if drained
        if (remaining <= 0) {
          await admin.entities.SessionBlock.update(b.id, { status: 'expired', remaining_ms: 0, last_active_at: null });
          return { id: b.id, remaining_ms: 0, expired: true };
        }
        return { id: b.id, remaining_ms: remaining, expired: false };
      }

      const processedSolo = [];
      for (const b of soloBlocks) processedSolo.push(await processBlock(b));
      const processedTable = [];
      for (const b of tableBlocks) processedTable.push(await processBlock(b));

      // 4. Mark the first active block as "currently ticking" (last_active_at = now)
      const activeSolo = processedSolo.filter(b => !b.expired);
      const activeTable = processedTable.filter(b => !b.expired);

      if (activeSolo.length > 0) {
        await admin.entities.SessionBlock.update(activeSolo[0].id, {
          last_active_at: new Date(now).toISOString(),
          remaining_ms: activeSolo[0].remaining_ms
        });
      }
      if (activeTable.length > 0) {
        await admin.entities.SessionBlock.update(activeTable[0].id, {
          last_active_at: new Date(now).toISOString(),
          remaining_ms: activeTable[0].remaining_ms
        });
      }

      // 5. Total remaining = sum across all active blocks (solo global + table for this campaign)
      const totalRemainingMs = [...activeSolo, ...activeTable].reduce((sum, b) => sum + b.remaining_ms, 0);

      let hasAccess = false;
      let blockType = null;
      if (isFreeFriend) {
        hasAccess = true;
        blockType = 'free_friend';
      } else if (totalRemainingMs > 0) {
        hasAccess = true;
        blockType = activeTable.length > 0 ? 'table' : 'solo';
      }

      // Check for pending (payment processing) blocks
      let isPending = false;
      if (!hasAccess) {
        const pendingSolo = userId
          ? await admin.entities.SessionBlock.filter({ user_id: userId, session_type: 'solo', status: 'pending' }, '-created_date', 5)
          : [];
        const pendingTable = await admin.entities.SessionBlock.filter({ campaign_id, session_type: 'table', status: 'pending' }, '-created_date', 5);
        isPending = pendingSolo.length > 0 || pendingTable.length > 0;
      }

      return Response.json({
        has_access: hasAccess,
        pending: isPending,
        remaining_seconds: Math.floor(totalRemainingMs / 1000),
        block_type: blockType,
        is_owner: isOwner
      });
    }

    // ── Free friend management (host only) ──
    const isOwner = campaign.created_by_id === userId;
    if (!isOwner) {
      return Response.json({ error: 'Only the host can manage free friends' }, { status: 403 });
    }

    if (op === 'getFreeFriends') {
      return Response.json({ free_friend_emails: campaign.free_friend_emails || [] });
    }

    if (op === 'addFreeFriend') {
      if (!email || !email.trim()) {
        return Response.json({ error: 'Email required' }, { status: 400 });
      }
      const cleanEmail = email.trim().toLowerCase();
      const friends = (campaign.free_friend_emails || []).map(e => e.toLowerCase());
      if (friends.length >= MAX_FREE_FRIENDS) {
        return Response.json({ error: `Maximum ${MAX_FREE_FRIENDS} free friends allowed` }, { status: 400 });
      }
      if (friends.includes(cleanEmail)) {
        return Response.json({ error: 'Friend already added' }, { status: 400 });
      }
      friends.push(cleanEmail);
      await admin.entities.Campaign.update(campaign_id, { free_friend_emails: friends });
      return Response.json({ free_friend_emails: friends });
    }

    if (op === 'removeFreeFriend') {
      const cleanEmail = (email || '').trim().toLowerCase();
      const friends = (campaign.free_friend_emails || []).filter(
        e => e.toLowerCase() !== cleanEmail
      );
      await admin.entities.Campaign.update(campaign_id, { free_friend_emails: friends });
      return Response.json({ free_friend_emails: friends });
    }

    return Response.json({ error: 'Unknown op' }, { status: 400 });
  } catch (error) {
    console.error("sessionBilling error:", error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});