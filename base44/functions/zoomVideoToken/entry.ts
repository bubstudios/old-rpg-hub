import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json().catch(() => ({}));
    const sessionName = body.session_name;
    const roleType = body.role_type ?? 0;

    if (!sessionName) return Response.json({ error: 'session_name required' }, { status: 400 });

    const sdkKey = Deno.env.get('ZOOM_SDK_KEY');
    const sdkSecret = Deno.env.get('ZOOM_SDK_SECRET');

    if (!sdkKey || !sdkSecret) {
      return Response.json({ error: 'Zoom credentials not configured' }, { status: 500 });
    }

    const iat = Math.floor(Date.now() / 1000) - 30;
    const exp = iat + (60 * 60 * 2);

    const headerObj = { alg: 'HS256', typ: 'JWT' };
    const payloadObj = {
      app_key: sdkKey,
      tpc: sessionName,
      role_type: roleType,
      version: 1,
      iat,
      exp,
      user_key: user.id
    };

    const enc = new TextEncoder();

    function b64url(bytes) {
      let binary = '';
      for (let i = 0; i < bytes.length; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
      return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    }

    const headerB64 = b64url(enc.encode(JSON.stringify(headerObj)));
    const payloadB64 = b64url(enc.encode(JSON.stringify(payloadObj)));

    const key = await crypto.subtle.importKey(
      'raw',
      enc.encode(sdkSecret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );

    const sigBuf = await crypto.subtle.sign(
      'HMAC',
      key,
      enc.encode(`${headerB64}.${payloadB64}`)
    );

    const sigB64 = b64url(new Uint8Array(sigBuf));
    const token = `${headerB64}.${payloadB64}.${sigB64}`;

    return Response.json({ token, session_name: sessionName });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});