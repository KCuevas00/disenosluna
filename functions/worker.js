/**
 * Diseños Luna — Cloudflare Worker Entrypoint
 * 
 * Routes incoming /api/* traffic to the server-side Stripe handlers.
 * For all other routes, falls back to env.ASSETS to serve static website assets.
 */

import { onRequestPost as handleCreateCheckoutSession } from './api/create-checkout-session.js';
import { onRequestGet as handleGetCheckoutSession } from './api/get-checkout-session.js';
import { onRequestPost as handleStripeWebhook } from './api/stripe-webhook.js';
import { onRequestPost as handleCreateUpgradeSession, onRequestGet as handleGetCreateUpgradeInfo } from './api/create-upgrade-checkout-session.js';
import { onRequestGet as handleGetUpgradeSession } from './api/get-upgrade-session.js';

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const pathname = url.pathname;
    const method = request.method.toUpperCase();

    // Standard CORS headers for preflight requests
    if (method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization, stripe-signature'
        }
      });
    }

    const context = { request, env, ctx, params: {} };

    // 1. /api/create-checkout-session
    if (pathname === '/api/create-checkout-session') {
      if (method === 'POST') {
        return handleCreateCheckoutSession(context);
      }
      if (method === 'GET') {
        return new Response(JSON.stringify({
          status: 'active',
          endpoint: '/api/create-checkout-session',
          message: 'Diseños Luna Stripe API: Send a POST request with package and customer details to create a checkout session.'
        }), {
          status: 405,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 2. /api/get-checkout-session
    if (pathname === '/api/get-checkout-session') {
      if (method === 'GET') {
        return handleGetCheckoutSession(context);
      }
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 3. /api/stripe-webhook
    if (pathname === '/api/stripe-webhook') {
      if (method === 'POST') {
        return handleStripeWebhook(context);
      }
      if (method === 'GET') {
        return new Response(JSON.stringify({
          status: 'active',
          endpoint: '/api/stripe-webhook',
          message: 'Diseños Luna Stripe Webhook listener is online. Awaiting POST events from Stripe.'
        }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 4. /api/create-upgrade-checkout-session ($15 Basic -> Premium upgrade)
    if (pathname === '/api/create-upgrade-checkout-session') {
      if (method === 'POST') {
        return handleCreateUpgradeSession(context);
      }
      if (method === 'GET') {
        return handleGetCreateUpgradeInfo(context);
      }
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 5. /api/get-upgrade-session (Verify $15 upgrade payment)
    if (pathname === '/api/get-upgrade-session') {
      if (method === 'GET') {
        return handleGetUpgradeSession(context);
      }
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Default: Forward to static assets if request reached worker
    if (env.ASSETS && typeof env.ASSETS.fetch === 'function') {
      return env.ASSETS.fetch(request);
    }

    return new Response('Not Found', { status: 404 });
  }
};
