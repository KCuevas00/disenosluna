/**
 * Cloudflare Pages Function: /api/create-checkout-session
 * Creates a Stripe Checkout Session for Basic ($70) or Premium ($85) invitation packages.
 */

export async function onRequestPost(context) {
  try {
    const { request, env } = context;
    const origin = new URL(request.url).origin;
    const body = await request.json();

    const stripeKey = env.STRIPE_SECRET_KEY || '';
    if (!stripeKey) {
      return new Response(JSON.stringify({ 
        error: 'STRIPE_SECRET_KEY is not set in environment variables. Please add it to your Cloudflare Pages settings.' 
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const {
      packageType = 'Premium',
      clientName = '',
      clientPhone = '',
      clientEmail = '',
      socialHandle = '',
      preferredContact = 'WhatsApp',
      eventType = '',
      celebrantName = '',
      eventDate = '',
    } = body;

    const isBasic = packageType.toLowerCase().includes('basic');
    const unitAmount = isBasic ? 7000 : 8500; // in cents: $70.00 vs $85.00
    const packageName = isBasic ? 'Diseños Luna — Basic Invitation Package' : 'Diseños Luna — Premium Invitation Package';
    const packageDesc = isBasic
      ? 'Complete digital invitation with 3D envelope, photo centerpiece, event schedule & maps links.'
      : 'Full interactive experience with background music, countdown, falling petals, court of honor & extra photos.';

    // Construct form-urlencoded body for Stripe REST API
    const params = new URLSearchParams();
    params.append('mode', 'payment');
    params.append('payment_method_types[0]', 'card');
    if (clientEmail) {
      params.append('customer_email', clientEmail);
    }
    params.append('success_url', `${origin}/order.html?session_id={CHECKOUT_SESSION_ID}&step=details`);
    params.append('cancel_url', `${origin}/order.html?step=cancelled`);

    // Line items
    params.append('line_items[0][price_data][currency]', 'usd');
    params.append('line_items[0][price_data][unit_amount]', unitAmount.toString());
    params.append('line_items[0][price_data][product_data][name]', packageName);
    params.append('line_items[0][price_data][product_data][description]', packageDesc);
    params.append('line_items[0][quantity]', '1');

    // Metadata to associate payment with customer order
    params.append('metadata[package_type]', isBasic ? 'Basic ($70)' : 'Premium ($85)');
    params.append('metadata[client_name]', clientName);
    params.append('metadata[client_phone]', clientPhone);
    params.append('metadata[client_email]', clientEmail);
    params.append('metadata[social_handle]', socialHandle);
    params.append('metadata[preferred_contact]', preferredContact);
    params.append('metadata[event_type]', eventType);
    params.append('metadata[celebrant_name]', celebrantName);
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
      return new Response(JSON.stringify({ error: stripeData.error?.message || 'Failed to create Stripe session' }), {
        status: stripeRes.status,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ url: stripeData.url, id: stripeData.id }), {
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
