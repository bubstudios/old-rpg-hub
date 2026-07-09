import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

const BLOCK_DURATION_MS = 4 * 60 * 60 * 1000; // 4 hours
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
      // For getStatus, try to look up user by body user_id
      if (bodyUserId) {
        userId = bodyUserId;
        try {
          const u = await admin.entities.User.get(bodyUserId);
          if (u) userEmail = u.email;
        } catch (e2) { /* ignore */ }
      }
    }

    // ── getStatus: check billing access and timer ──
    if (op === 'getStatus') {
      const freeFriends = (campaign.free_friend_emails || []).map(e => e.toLowerCase());
      const isFreeFriend = !!(userEmail && freeFriends.includes(userEmail.toLowerCase()));

      // Find all active blocks for this campaign
      const blocks = await admin.entities.SessionBlock.filter(
        { campaign_id, status: 'active' },
        'created_date', 20
      );

      const now = Date.now();

      // Expire any blocks whose timer has run out
      for (const b of blocks) {
        if (b.started_at && b.expires_at && now >= new Date(b.expires_at).getTime()) {
          await admin.entities.SessionBlock.update(b.id, { status: 'expired' });
        }
      }

      // Re-filter to only truly active (unexpired) blocks
      const activeBlocks = blocks.filter(b =>
        !b.started_at || !b.expires_at || now < new Date(b.expires_at).getTime()
      );

      const running = activeBlocks.find(b => b.started_at && b.expires_at);
      const unstarted = activeBlocks.filter(b => !b.started_at);

      let activeBlock = null;

      if (running) {
        // Extend running block by 4h per unstarted block (one-click extend)
        if (unstarted.length > 0) {
          const extension = unstarted.length * BLOCK_DURATION_MS;
          const newExpiry = new Date(
            new Date(running.expires_at).getTime() + extension
          ).toISOString();
          await admin.entities.SessionBlock.update(running.id, { expires_at: newExpiry });
          running.expires_at = newExpiry;
          for (const b of unstarted) {
            await admin.entities.SessionBlock.update(b.id, { status: 'expired' });
          }
        }
        activeBlock = running;
      } else if (unstarted.length > 0) {
        // Start the first unstarted block — merge all unstarted into one timer
        const totalDuration = unstarted.length * BLOCK_DURATION_MS;
        const startedAt = new Date().toISOString();
        const expiresAt = new Date(now + totalDuration).toISOString();
        const first = unstarted[0];
        await admin.entities.SessionBlock.update(first.id, {
          started_at: startedAt,
          expires_at: expiresAt
        });
        for (let i = 1; i < unstarted.length; i++) {
          await admin.entities.SessionBlock.update(unstarted[i].id, { status: 'expired' });
        }
        first.started_at = startedAt;
        first.expires_at = expiresAt;
        activeBlock = first;
      }

      // Determine access
      let hasAccess = false;
      if (isFreeFriend) {
        hasAccess = true;
      } else if (activeBlock) {
        if (activeBlock.session_type === 'solo') {
          hasAccess = activeBlock.user_id === userId;
        } else {
          hasAccess = true; // table block covers everyone
        }
      }

      // Check for pending (payment processing) blocks
      let isPending = false;
      if (!hasAccess) {
        const pendingBlocks = await admin.entities.SessionBlock.filter(
          { campaign_id, status: 'pending' },
          '-created_date', 5
        );
        isPending = pendingBlocks.length > 0;
      }

      const remainingMs = activeBlock?.expires_at
        ? Math.max(0, new Date(activeBlock.expires_at).getTime() - now)
        : 0;

      return Response.json({
        has_access: hasAccess,
        pending: isPending,
        remaining_seconds: Math.floor(remainingMs / 1000),
        block_type: isFreeFriend ? 'free_friend' : (activeBlock?.session_type || null),
        expires_at: activeBlock?.expires_at || null,
        is_owner: campaign.created_by_id === userId
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