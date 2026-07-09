import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';
import jwt from 'npm:jsonwebtoken@9.0.2';

Deno.serve(async (req) => {
  try {
    const requestBody = await req.text();
    const publicKey = Deno.env.get("WIX_PAYMENTS_WEBHOOK_PUBLIC_KEY");
    if (!publicKey) {
      console.error("Missing WIX_PAYMENTS_WEBHOOK_PUBLIC_KEY secret");
      return Response.json({ error: 'Webhook not configured' }, { status: 500 });
    }

    // Step 1: Verify JWT signature — fail closed if verification fails
    let rawPayload;
    try {
      rawPayload = jwt.verify(requestBody, publicKey, { algorithms: ["RS256"] });
    } catch (e) {
      console.error("JWT verification failed:", e.message);
      return Response.json({ error: 'Invalid signature' }, { status: 401 });
    }

    // Step 2: Parse double-nested JSON (WebhookEnvelope -> event data)
    const event = JSON.parse(rawPayload.data);
    const eventData = JSON.parse(event.data);

    const base44 = createClientFromRequest(req);
    const admin = base44.asServiceRole;

    if (event.eventType === "wix.ecom.v1.order_approved") {
      const order = eventData.actionEvent.body.order;
      const checkoutId = order.checkoutId;

      // Find the pending SessionBlock by checkout_id
      const pendingBlocks = await admin.entities.SessionBlock.filter({
        checkout_id: checkoutId,
        status: "pending"
      });

      if (pendingBlocks.length > 0) {
        const block = pendingBlocks[0];
        await admin.entities.SessionBlock.update(block.id, {
          status: "active",
          order_id: order.id,
          remaining_ms: 4 * 60 * 60 * 1000,
        });
        console.log(`SessionBlock ${block.id} activated — order ${order.id}, type ${block.session_type}`);
      } else {
        console.log(`No pending block for checkout_id ${checkoutId} (may already be processed)`);
      }
    } else {
      console.log(`Unhandled webhook event type: ${event.eventType}`);
    }

    return Response.json({ received: true });
  } catch (error) {
    console.error("Webhook handler error:", error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});