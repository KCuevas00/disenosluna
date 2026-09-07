/**
 * Cloudflare Worker Function: /api/get-upgrade-session
 * Server-Side Stripe Payment Verification Endpoint for $15 Premium Upgrades
 *
 * Security & Anti-Spoofing:
 * - Queries Stripe's live API server-to-server using STRIPE_SECRET_KEY.
 * - Enforces session.payment_status === 'paid'.
 * - Enforces metadata.package_type === 'premium_upgrade'.
 * - Validates original_session_id matches if provided.
 * - A customer CANNOT declare themselves upgraded via client-side JavaScript or URL tampering.
 */

export async function onRequestGet(context) {
  try {
    const { request, env } = context;
    const url = new URL(request.url);
    const upgradeSessionId = (url.searchParams.get('upgrade_session_id') || '').trim();
    const originalSessionId = (url.searchParams.get('original_session_id') || '').trim();

    if (!upgradeSessionId) {
      return new Response(JSON.stringify({
        verified: false,
        error: 'Missing upgrade_session_id parameter.'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const stripeKey = env.STRIPE_SECRET_KEY || '';
    if (!stripeKey) {
      return new Response(JSON.stringify({
        verified: false,
        error: 'STRIPE_SECRET_KEY is not configured in Cloudflare Environment Variables.'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const stripeRes = await fetch(`https://api.stripe.com/v1/checkout/sessions/${encodeURIComponent(upgradeSessionId)}`, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${stripeKey}` }
    });

    const session = await stripeRes.json();
    if (!stripeRes.ok) {
      return new Response(JSON.stringify({
        verified: false,
        error: session.error?.message || 'Invalid or expired Stripe upgrade session.'
      }), {
        status: stripeRes.status,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 1. Strict Payment Status Check
    if (session.payment_status !== 'paid') {
      return new Response(JSON.stringify({
        verified: false,
        payment_status: session.payment_status || 'unpaid',
        status: session.status || 'open',
        error: 'Upgrade payment has not been completed or verified by Stripe.'
      }), {
        status: 402, // 402 Payment Required
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 2. Strict Package Type Check
    const meta = session.metadata || {};
    if (meta.package_type !== 'premium_upgrade') {
      return new Response(JSON.stringify({
        verified: false,
        error: 'This checkout session is not a Premium upgrade session.'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 3. Optional Original Session Association Check
    if (originalSessionId && meta.original_session_id && meta.original_session_id !== originalSessionId) {
      return new Response(JSON.stringify({
        verified: false,
        error: 'Upgrade session does not match the current original order.'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Upgrade is 100% verified paid by Stripe!
    return new Response(JSON.stringify({
      verified: true,
      id: session.id,
      payment_status: session.payment_status,
      package_type: 'premium_upgrade',
      original_session_id: meta.original_session_id || '',
      order_ref: meta.order_ref || '',
      amount_total: session.amount_total, // 1500
      currency: session.currency,
      customer_email: session.customer_details?.email || session.customer_email || '',
      metadata: meta
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (err) {
    return new Response(JSON.stringify({ verified: false, error: err.message || 'Internal server error.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
