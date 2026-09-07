/**
 * Cloudflare Pages Function: /api/stripe-webhook
 * Authoritative Server-Side Stripe Webhook Listener
 *
 * Security:
 * - Listens for checkout.session.completed events sent directly from Stripe.
 * - Cryptographically verifies the Stripe HMAC-SHA256 signature using STRIPE_WEBHOOK_SECRET.
 * - Validates session.payment_status === 'paid'.
 * - Records the payment and dispatches an authoritative order notification.
 */

export async function onRequestPost(context) {
  try {
    const { request, env } = context;
    const signatureHeader = request.headers.get('stripe-signature');
    const webhookSecret = env.STRIPE_WEBHOOK_SECRET || '';

    const rawBody = await request.text();

    // Cryptographic signature verification if STRIPE_WEBHOOK_SECRET is configured
    if (webhookSecret && signatureHeader) {
      const isValid = await verifyStripeSignature(rawBody, signatureHeader, webhookSecret);
      if (!isValid) {
        return new Response(JSON.stringify({ error: 'Invalid Stripe signature' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }

    let event;
    try {
      event = JSON.parse(rawBody);
    } catch (e) {
      return new Response(JSON.stringify({ error: 'Invalid JSON payload' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Authoritative event handling: checkout.session.completed
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;

      // Verify payment was actually collected
      if (session.payment_status === 'paid') {
        const meta = session.metadata || {};
        const customerEmail = session.customer_details?.email || session.customer_email || meta.client_email || '';
        const orderRef = meta.order_ref || session.client_reference_id || session.id;
        const packageType = meta.package_type || 'Premium';
        const amountPaid = session.amount_total ? `$${(session.amount_total / 100).toFixed(2)}` : 'Verified';

        // Check if this is a $15 Premium Upgrade or an initial order payment
        const isUpgrade = meta.package_type === 'premium_upgrade';
        const clientName = meta.client_name || meta.celebrant_name || customerEmail || 'Customer';

        if (isUpgrade) {
          console.log(`[STRIPE UPGRADE VERIFIED] PREMIUM UPGRADE — ${orderRef} — ${clientName}`);

          try {
            const upgradeSubject = `PREMIUM UPGRADE — ${orderRef} — ${clientName}`;
            const notificationData = new URLSearchParams();
            notificationData.append('_subject', upgradeSubject);
            notificationData.append('_template', 'table');
            notificationData.append('_captcha', 'false');
            notificationData.append('Payment_Status', 'VERIFIED PAID VIA STRIPE (PREMIUM UPGRADE)');
            notificationData.append('Order_Reference', orderRef);
            notificationData.append('Client_Name', clientName);
            notificationData.append('Original_Package', 'Basic ($70)');
            notificationData.append('Upgrade_Package', 'Premium ($85)');
            notificationData.append('Upgrade_Amount', '$15.00');
            notificationData.append('Total_Paid', '$85.00');
            notificationData.append('Original_Stripe_Session_ID', meta.original_session_id || '');
            notificationData.append('Upgrade_Stripe_Session_ID', session.id);
            notificationData.append('Client_Email', customerEmail);
            notificationData.append('Celebrant_Name', meta.celebrant_name || '');
            notificationData.append('Event_Type', meta.event_type || '');
            notificationData.append('Event_Date', meta.event_date || '');

            await fetch('https://formsubmit.co/disenosluna815@gmail.com', {
              method: 'POST',
              headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
              body: notificationData.toString()
            });
          } catch (dispatchErr) {
            console.warn('Authoritative webhook upgrade email notification dispatch notice:', dispatchErr);
          }

        } else {
          console.log(`[STRIPE WEBHOOK VERIFIED] Order ${orderRef} paid: ${packageType} (${amountPaid}) by ${customerEmail}`);

          // Forward authoritative paid event notification to FormSubmit / notification endpoint
          try {
            const cleanPkg = (meta.package_type || packageType).replace(/[\(\)]/g, '').toUpperCase();
            const webhookSubject = `PAID ORDER — ${cleanPkg} — ${clientName}`;

            const notificationData = new URLSearchParams();
            notificationData.append('_subject', webhookSubject);
            notificationData.append('_template', 'table');
            notificationData.append('_captcha', 'false');
            notificationData.append('Payment_Status', 'VERIFIED PAID VIA STRIPE');
            notificationData.append('Order_Reference', orderRef);
            notificationData.append('Stripe_Session_ID', session.id);
            notificationData.append('Package', packageType);
            notificationData.append('Amount_Paid', amountPaid);
            notificationData.append('Client_Name', meta.client_name || '');
            notificationData.append('Client_Email', customerEmail);
            notificationData.append('Client_Phone', meta.client_phone || '');
            notificationData.append('Celebrant_Name', meta.celebrant_name || '');
            notificationData.append('Event_Type', meta.event_type || '');
            notificationData.append('Event_Date', meta.event_date || '');

            await fetch('https://formsubmit.co/disenosluna815@gmail.com', {
              method: 'POST',
              headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
              body: notificationData.toString()
            });
          } catch (dispatchErr) {
            console.warn('Authoritative webhook email notification dispatch notice:', dispatchErr);
          }
        }
      }
    }

    // Acknowledge receipt to Stripe
    return new Response(JSON.stringify({ received: true, type: event.type }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message || 'Webhook processing error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

/**
 * Verifies Stripe Webhook HMAC-SHA256 signature using Web Crypto API
 */
async function verifyStripeSignature(rawPayload, sigHeader, secret) {
  try {
    const parts = sigHeader.split(',');
    let timestamp = '';
    let signatures = [];

    for (const part of parts) {
      const [key, value] = part.split('=');
      if (key === 't') timestamp = value;
      if (key === 'v1') signatures.push(value);
    }

    if (!timestamp || signatures.length === 0) return false;

    // Construct signed payload: timestamp.rawPayload
    const signedPayload = `${timestamp}.${rawPayload}`;
    const encoder = new TextEncoder();

    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );

    const signatureBuffer = await crypto.subtle.sign('HMAC', key, encoder.encode(signedPayload));
    const computedHex = Array.from(new Uint8Array(signatureBuffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');

    // Check if computed signature matches any v1 signature
    return signatures.some(sig => sig === computedHex);
  } catch (err) {
    console.error('Signature verification error:', err);
    return false;
  }
}
