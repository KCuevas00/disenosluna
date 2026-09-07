/**
 * Cloudflare Pages Function: /api/create-checkout-session
 * Server-authoritative Stripe Checkout Session Creator
 *
 * Security & Integrity:
 * - Server determines price strictly based on selected package (Basic = $70.00, Premium = $85.00).
 *   Browser cannot alter or tamper with the price.
 * - Attaches complete customer & event metadata to Stripe Session for payment-to-order linkage.
 * - Uses STRIPE_SECRET_KEY from Cloudflare Environment Secrets (never exposed to client).
 */

export async function onRequestPost(context) {
  try {
    const { request, env } = context;
    const origin = new URL(request.url).origin;
    const body = await request.json();

    const stripeKey = env.STRIPE_SECRET_KEY || '';
    if (!stripeKey) {
      return new Response(JSON.stringify({ 
        error: 'STRIPE_SECRET_KEY is not configured in Cloudflare Environment Variables.' 
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const {
      packageType = '',
      clientName = '',
      clientPhone = '',
      clientEmail = '',
      socialHandle = '',
      preferredContact = 'WhatsApp',
      eventType = '',
      celebrantName = '',
      eventDate = '',
    } = body;

    // Validate required fields server-side
    if (!clientName.trim() || !clientEmail.trim() || !clientPhone.trim() || !celebrantName.trim() || !eventDate.trim() || !eventType.trim()) {
      return new Response(JSON.stringify({ 
        error: 'Missing required customer or event fields. Please fill out all required fields.' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // SERVER-AUTHORITATIVE PRICING: Determine price strictly on server
    const normalizedPkg = packageType.toLowerCase().trim();
    let unitAmount;
    let packageName;
    let packageDesc;
    let verifiedPkgType;

    if (normalizedPkg.includes('basic')) {
      unitAmount = 7000; // $70.00 USD in cents
      verifiedPkgType = 'Basic ($70)';
      packageName = 'Diseños Luna — Basic Invitation Package';
      packageDesc = 'Complete digital invitation with 3D opening envelope, photo centerpiece, event timeline, Google/Apple Maps links, and online RSVP.';
    } else if (normalizedPkg.includes('premium')) {
      unitAmount = 8500; // $85.00 USD in cents
      verifiedPkgType = 'Premium ($85)';
      packageName = 'Diseños Luna — Premium Invitation Package';
      packageDesc = 'Full interactive digital invitation with song of choice, live countdown, falling celebration petals, court of honor roster, and extra photo gallery.';
    } else {
      return new Response(JSON.stringify({ 
        error: 'Invalid package selected. Allowed packages are Basic ($70) and Premium ($85).' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const orderRef = `DL-${Date.now().toString(36).toUpperCase()}`;

    // Construct form-urlencoded payload for official Stripe REST API
    const params = new URLSearchParams();
    params.append('mode', 'payment');
    params.append('payment_method_types[0]', 'card');
    if (clientEmail) {
      params.append('customer_email', clientEmail.trim());
    }
    params.append('client_reference_id', orderRef);
    params.append('success_url', `${origin}/order.html?session_id={CHECKOUT_SESSION_ID}&step=details`);
    params.append('cancel_url', `${origin}/order.html?step=cancelled`);

    // Line item (strictly server-enforced amount)
    params.append('line_items[0][price_data][currency]', 'usd');
    params.append('line_items[0][price_data][unit_amount]', unitAmount.toString());
    params.append('line_items[0][price_data][product_data][name]', packageName);
    params.append('line_items[0][price_data][product_data][description]', packageDesc);
    params.append('line_items[0][quantity]', '1');

    // Rich metadata attached to the Stripe charge for live order fulfillment
    params.append('metadata[order_ref]', orderRef);
    params.append('metadata[package_type]', verifiedPkgType);
    params.append('metadata[client_name]', clientName.trim());
    params.append('metadata[client_phone]', clientPhone.trim());
    params.append('metadata[client_email]', clientEmail.trim());
    params.append('metadata[social_handle]', (socialHandle || '').trim());
    params.append('metadata[preferred_contact]', preferredContact);
    params.append('metadata[event_type]', eventType.trim());
    params.append('metadata[celebrant_name]', celebrantName.trim());
    params.append('metadata[event_date]', eventDate.trim());

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
        error: stripeData.error?.message || 'Failed to create Stripe Checkout session.' 
      }), {
        status: stripeRes.status,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ 
      url: stripeData.url, 
      id: stripeData.id,
      order_ref: orderRef
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
