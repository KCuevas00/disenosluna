/**
 * Cloudflare Pages Function: /api/get-checkout-session
 * Retrieves Stripe Checkout Session details and metadata upon customer return.
 */

export async function onRequestGet(context) {
  try {
    const { request, env } = context;
    const url = new URL(request.url);
    const sessionId = url.searchParams.get('session_id');

    if (!sessionId) {
      return new Response(JSON.stringify({ error: 'Missing session_id parameter' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const stripeKey = env.STRIPE_SECRET_KEY || '';
    if (!stripeKey) {
      return new Response(JSON.stringify({ 
        error: 'STRIPE_SECRET_KEY is not set in environment variables.' 
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const stripeRes = await fetch(`https://api.stripe.com/v1/checkout/sessions/${encodeURIComponent(sessionId)}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${stripeKey}`
      }
    });

    const session = await stripeRes.json();

    if (!stripeRes.ok) {
      return new Response(JSON.stringify({ error: session.error?.message || 'Failed to retrieve Stripe session' }), {
        status: stripeRes.status,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Return safe public session data
    return new Response(JSON.stringify({
      id: session.id,
      payment_status: session.payment_status,
      customer_email: session.customer_details?.email || session.customer_email || '',
      amount_total: session.amount_total,
      currency: session.currency,
      metadata: session.metadata || {}
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message || 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
