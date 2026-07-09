import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

const SESSION_PRICES = {
  solo: { name: "Solo Session — 4 Hours (Old RPG Hub)", price: "9.99" },
  table: { name: "Table Session — 4 Hours (Old RPG Hub)", price: "17.99" }
};

Deno.serve(async (req) => {
  try {
    const body = await req.json();
    const { session_type, campaign_id } = body;

    if (!session_type || !SESSION_PRICES[session_type]) {
      return Response.json({ error: 'Invalid session type. Use "solo" or "table".' }, { status: 400 });
    }
    if (!campaign_id) {
      return Response.json({ error: 'campaign_id required' }, { status: 400 });
    }

    const base44 = createClientFromRequest(req);

    // Try auth first (app is login-gated), fall back to body
    let userId = body.user_id;
    try {
      const user = await base44.auth.me();
      if (user) userId = user.id;
    } catch (e) { /* not authenticated — use body.user_id */ }

    if (!userId) {
      return Response.json({ error: 'User authentication required' }, { status: 401 });
    }

    const origin = req.headers.get('Origin') || req.headers.get('origin') || 'https://old-rpg-hub.com';
    const item = SESSION_PRICES[session_type];

    const apiKey = Deno.env.get("WIX_PAYMENTS_API_KEY");
    const siteId = Deno.env.get("WIX_PAYMENTS_SITE_ID");
    if (!apiKey || !siteId) {
      console.error("Missing WIX_PAYMENTS_API_KEY or WIX_PAYMENTS_SITE_ID");
      return Response.json({ error: 'Payment integration not configured' }, { status: 500 });
    }

    const wixResponse = await fetch(
      "https://www.wixapis.com/payments/platform/v1/checkout-sessions/construct",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": apiKey,
          "wix-site-id": siteId,
        },
        body: JSON.stringify({
          cart: {
            items: [{
              name: item.name,
              quantity: 1,
              price: item.price,
            }],
          },
          callbackUrls: {
            postFlowUrl: `${origin}/`,
            thankYouPageUrl: `${origin}/session-complete`,
          },
        }),
      }
    );

    const data = await wixResponse.json();
    if (!wixResponse.ok) {
      console.error("Wix checkout error:", JSON.stringify(data));
      const msg = data?.details?.applicationError?.description || 'Failed to create checkout session';
      return Response.json({ error: msg }, { status: 500 });
    }

    const checkoutSession = data.checkoutSession;
    if (!checkoutSession || !checkoutSession.redirectUrl) {
      console.error("Wix checkout missing redirectUrl:", JSON.stringify(data));
      return Response.json({ error: 'Checkout session creation failed' }, { status: 500 });
    }

    // Store pending SessionBlock for webhook to match
    await base44.asServiceRole.entities.SessionBlock.create({
      user_id: userId,
      campaign_id,
      session_type,
      price: parseFloat(item.price),
      checkout_id: checkoutSession.id,
      status: "pending",
    });

    return Response.json({ redirectUrl: checkoutSession.redirectUrl });
  } catch (error) {
    console.error("create-checkout error:", error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});