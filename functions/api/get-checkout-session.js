/**
 * Cloudflare Pages Function: /api/get-checkout-session
 * Server-Side Stripe Payment Verification Endpoint
 *
 * Security & Anti-Spoofing:
 * - Queries Stripe's live API server-to-server using STRIPE_SECRET_KEY.
 * - Enforces session.payment_status === 'paid'.
 * - If unpaid, cancelled, or pending, access is denied (HTTP 402 Payment Required).
 * - A customer CANNOT bypass this by modifying client-side URL parameters.
 */

export async function onRequestGet(context) {
  try {
    const { request, env } = context;
    const url = new URL(request.url);
    const sessionId = url.searchParams.get('session_id');

    if (!sessionId || !sessionId.trim()) {
      return new Response(JSON.stringify({ 
        error: 'Missing session_id parameter.' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const stripeKey = env.STRIPE_SECRET_KEY || '';
    if (!stripeKey) {
      return new Response(JSON.stringify({ 
        error: 'STRIPE_SECRET_KEY is not configured in Cloudflare Environment Variables.' 
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const stripeRes = await fetch(`https://api.stripe.com/v1/checkout/sessions/${encodeURIComponent(sessionId.trim())}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${stripeKey}`
      }
    });

    const session = await stripeRes.json();

    if (!stripeRes.ok) {
      return new Response(JSON.stringify({ 
        error: session.error?.message || 'Invalid or expired Stripe Checkout session.' 
      }), {
        status: stripeRes.status,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // STRICT PAYMENT STATUS VERIFICATION
    if (session.payment_status !== 'paid') {
      return new Response(JSON.stringify({
        verified: false,
        payment_status: session.payment_status || 'unpaid',
        status: session.status || 'open',
        error: 'Payment has not been completed or verified by Stripe.'
      }), {
        status: 402, // 402 Payment Required
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Payment is verified paid by Stripe!
    return new Response(JSON.stringify({
      verified: true,
      id: session.id,
      payment_status: session.payment_status,
      status: session.status,
      amount_total: session.amount_total,
      currency: session.currency,
      customer_email: session.customer_details?.email || session.customer_email || '',
      metadata: session.metadata || {}
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
