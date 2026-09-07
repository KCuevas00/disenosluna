/**
 * Cloudflare Worker Function: /api/create-upgrade-checkout-session
 * Server-Authoritative Stripe Checkout Session Creator for Basic -> Premium Upgrades
 *
 * Security & Integrity:
 * - Strictly server-enforced $15.00 USD price. Browser cannot alter or tamper with price.
 * - Retrieves original session directly from Stripe using STRIPE_SECRET_KEY.
 * - Verifies original session is paid (payment_status === 'paid').
 * - Verifies original order was Basic. Rejects if order is already Premium or ineligible.
 * - Attaches original_session_id, order_ref, and customer metadata to the upgrade checkout session.
 */

export async function onRequestPost(context) {
  try {
    const { request, env } = context;
    const origin = new URL(request.url).origin;
    const body = await request.json().catch(() => ({}));

    const stripeKey = env.STRIPE_SECRET_KEY || '';
    if (!stripeKey) {
      return new Response(JSON.stringify({
        error: 'STRIPE_SECRET_KEY is not configured in Cloudflare Environment Variables.'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const originalSessionId = (body.originalSessionId || body.original_session_id || '').trim();
    if (!originalSessionId) {
      return new Response(JSON.stringify({
        error: 'Missing originalSessionId parameter. An existing paid Basic order is required to upgrade.'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 1. Fetch original checkout session from Stripe
    const originalRes = await fetch(`https://api.stripe.com/v1/checkout/sessions/${encodeURIComponent(originalSessionId)}`, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${stripeKey}` }
    });

    const originalSession = await originalRes.json();
    if (!originalRes.ok) {
      return new Response(JSON.stringify({
        error: originalSession.error?.message || 'Invalid or expired original Stripe session.'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 2. Verify original session is paid
    if (originalSession.payment_status !== 'paid') {
      return new Response(JSON.stringify({
        error: 'The original order has not been completed or verified by Stripe. Payment is required before upgrading.'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 3. Verify original package was Basic (prevent double upgrade or upgrading an already Premium package)
    const origMeta = originalSession.metadata || {};
    const origPackage = (origMeta.package_type || '').toLowerCase();

    if (origPackage.includes('premium')) {
      return new Response(JSON.stringify({
        error: 'This order is already a Premium package ($85). Upgrades are only applicable to Basic packages.'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Extract customer and order reference
    const orderRef = origMeta.order_ref || originalSession.client_reference_id || `DL-${Date.now().toString(36).toUpperCase()}`;
    const clientName = origMeta.client_name || origMeta.celebrant_name || 'Customer';
    const clientEmail = originalSession.customer_details?.email || originalSession.customer_email || origMeta.client_email || '';
    const celebrantName = origMeta.celebrant_name || '';
    const eventDate = origMeta.event_date || '';
    const eventType = origMeta.event_type || '';

    // 4. Construct server-authoritative $15.00 upgrade checkout session
    const UPGRADE_AMOUNT_CENTS = 1500; // Exactly $15.00 USD
    const params = new URLSearchParams();
    params.append('mode', 'payment');
    params.append('payment_method_types[0]', 'card');
    if (clientEmail) {
      params.append('customer_email', clientEmail.trim());
    }
    params.append('client_reference_id', `${orderRef}-UPGRADE`);

    // Return to the invitation details page with both original and upgrade session IDs
    params.append('success_url', `${origin}/order.html?session_id=${encodeURIComponent(originalSession.id)}&upgrade_session_id={CHECKOUT_SESSION_ID}&step=details`);
    params.append('cancel_url', `${origin}/order.html?session_id=${encodeURIComponent(originalSession.id)}&step=details&upgrade=cancelled`);

    // Line item: strictly hardcoded $15.00 USD
    params.append('line_items[0][price_data][currency]', 'usd');
    params.append('line_items[0][price_data][unit_amount]', UPGRADE_AMOUNT_CENTS.toString());
    params.append('line_items[0][price_data][product_data][name]', 'Diseños Luna — Upgrade to Premium Package ($15)');
    params.append('line_items[0][price_data][product_data][description]', 'Unlocks background music, live event countdown, court of honor roster, extra photo gallery, and premium customization.');
    params.append('line_items[0][quantity]', '1');

    // Rich metadata linking this upgrade to the original order
    params.append('metadata[order_ref]', orderRef);
    params.append('metadata[original_session_id]', originalSession.id);
    params.append('metadata[package_type]', 'premium_upgrade');
    params.append('metadata[upgrade_amount]', '$15.00');
    params.append('metadata[client_name]', clientName);
    params.append('metadata[client_email]', clientEmail);
    params.append('metadata[celebrant_name]', celebrantName);
    params.append('metadata[event_type]', eventType);
    params.append('metadata[event_date]', eventDate);

    const stripeRes = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${stripeKey}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: params.toString()
    });

    const stripeData = await stripeRes.json();
    if (!stripeRes.ok) {
      return new Response(JSON.stringify({
        error: stripeData.error?.message || 'Failed to create upgrade Stripe Checkout session.'
      }), {
        status: stripeRes.status,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({
      url: stripeData.url,
      id: stripeData.id,
      order_ref: orderRef,
      upgrade_amount: '$15.00'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message || 'Internal server error.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export async function onRequestGet(context) {
  return new Response(JSON.stringify({
    status: 'active',
    endpoint: '/api/create-upgrade-checkout-session',
    message: 'Diseños Luna Upgrade API: Send a POST request with { originalSessionId } to create a $15 Premium upgrade checkout session.'
  }), {
    status: 405,
    headers: { 'Content-Type': 'application/json' }
  });
}
