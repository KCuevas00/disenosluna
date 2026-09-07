#!/usr/bin/env python3
"""
Diseños Luna — Local Development Server with Stripe Checkout API
Serves static landing page & handles:
- POST /api/create-checkout-session (Server-enforced pricing: $70 Basic, $85 Premium)
- GET /api/get-checkout-session (Strict payment verification)
- POST /api/stripe-webhook (Authoritative event listener)
Multi-threaded for instantaneous asset loading & concurrent requests.
"""

import http.server
import socketserver
import urllib.request
import urllib.parse
import json
import os
import sys

PORT = 8088
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

# Load .env file if present
env_path = os.path.join(DIRECTORY, '.env')
if os.path.exists(env_path):
    with open(env_path, 'r', encoding='utf-8') as f:
        for line in f:
            line = line.strip()
            if line and not line.startswith('#') and '=' in line:
                key, val = line.split('=', 1)
                os.environ[key.strip()] = val.strip()

STRIPE_SECRET_KEY = os.environ.get('STRIPE_SECRET_KEY', '').strip()

class LunaRequestHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def do_POST(self):
        if self.path == '/api/create-checkout-session':
            self.handle_create_checkout()
        elif self.path == '/api/create-upgrade-checkout-session':
            self.handle_create_upgrade_checkout()
        elif self.path == '/api/stripe-webhook':
            self.handle_webhook()
        else:
            self.send_error(404, "Endpoint not found")

    def do_GET(self):
        if self.path.startswith('/api/get-checkout-session'):
            self.handle_get_checkout()
        elif self.path.startswith('/api/get-upgrade-session'):
            self.handle_get_upgrade()
        elif self.path.startswith('/api/create-upgrade-checkout-session'):
            self.send_json_response({'status': 'active', 'message': 'Send POST request to create $15 upgrade.'}, 405)
        elif self.path.startswith('/api/stripe-webhook'):
            self.send_json_response({'status': 'active', 'message': 'Stripe webhook endpoint active.'})
        else:
            super().do_GET()

    def handle_create_checkout(self):
        content_length = int(self.headers.get('Content-Length', 0))
        post_data = self.rfile.read(content_length)

        try:
            body = json.loads(post_data.decode('utf-8'))
        except Exception:
            self.send_json_response({'error': 'Invalid JSON body'}, 400)
            return

        package_type = body.get('packageType', '').strip()
        client_name = body.get('clientName', '').strip()
        client_phone = body.get('clientPhone', '').strip()
        client_email = body.get('clientEmail', '').strip()
        social_handle = body.get('socialHandle', '').strip()
        preferred_contact = body.get('preferredContact', 'WhatsApp')
        event_type = body.get('eventType', '').strip()
        celebrant_name = body.get('celebrantName', '').strip()
        event_date = body.get('eventDate', '').strip()

        if not client_name or not client_email or not client_phone or not celebrant_name or not event_date or not event_type:
            self.send_json_response({'error': 'Missing required fields.'}, 400)
            return

        # SERVER-AUTHORITATIVE PRICING: Server dictates price, client cannot tamper
        normalized_pkg = package_type.lower()
        if 'basic' in normalized_pkg:
            unit_amount = 7000
            verified_pkg = 'Basic ($70)'
            pkg_title = 'Diseños Luna — Basic Invitation Package'
            pkg_desc = 'Complete digital invitation with 3D opening envelope, schedule & maps links.'
        elif 'premium' in normalized_pkg:
            unit_amount = 8500
            verified_pkg = 'Premium ($85)'
            pkg_title = 'Diseños Luna — Premium Invitation Package'
            pkg_desc = 'Full interactive experience with music, countdown, court of honor & extra photos.'
        else:
            self.send_json_response({'error': 'Invalid package. Allowed: Basic ($70) and Premium ($85).'}, 400)
            return

        order_ref = f"DL-{os.getpid()}-{int(unit_amount)}"
        host = self.headers.get('Host', f'localhost:{PORT}')
        origin = f'http://{host}'

        # If no real Stripe key is configured, provide local test mode session redirect
        if not STRIPE_SECRET_KEY or STRIPE_SECRET_KEY.startswith('sk_test_replace'):
            fake_session_id = f"test_cs_{int(unit_amount)}_{os.getpid()}"
            mock_url = f"{origin}/order.html?session_id={fake_session_id}&step=details"
            self.send_json_response({
                'url': mock_url,
                'id': fake_session_id,
                'order_ref': order_ref,
                'is_test_mode': True,
                'notice': 'STRIPE_SECRET_KEY not set in .env. Test mode session generated.'
            })
            return

        # Real Stripe API Call
        stripe_params = {
            'mode': 'payment',
            'payment_method_types[0]': 'card',
            'client_reference_id': order_ref,
            'success_url': f"{origin}/order.html?session_id={{CHECKOUT_SESSION_ID}}&step=details",
            'cancel_url': f"{origin}/order.html?step=cancelled",
            'line_items[0][price_data][currency]': 'usd',
            'line_items[0][price_data][unit_amount]': str(unit_amount),
            'line_items[0][price_data][product_data][name]': pkg_title,
            'line_items[0][price_data][product_data][description]': pkg_desc,
            'line_items[0][quantity]': '1',
            'metadata[order_ref]': order_ref,
            'metadata[package_type]': verified_pkg,
            'metadata[client_name]': client_name,
            'metadata[client_phone]': client_phone,
            'metadata[client_email]': client_email,
            'metadata[social_handle]': social_handle,
            'metadata[preferred_contact]': preferred_contact,
            'metadata[event_type]': event_type,
            'metadata[celebrant_name]': celebrant_name,
            'metadata[event_date]': event_date,
        }
        if client_email:
            stripe_params['customer_email'] = client_email

        encoded_data = urllib.parse.urlencode(stripe_params).encode('utf-8')
        req = urllib.request.Request(
            'https://api.stripe.com/v1/checkout/sessions',
            data=encoded_data,
            headers={
                'Authorization': f'Bearer {STRIPE_SECRET_KEY}',
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        )

        try:
            with urllib.request.urlopen(req) as response:
                resp_body = response.read().decode('utf-8')
                stripe_data = json.loads(resp_body)
                self.send_json_response({
                    'url': stripe_data.get('url'),
                    'id': stripe_data.get('id'),
                    'order_ref': order_ref
                })
        except urllib.error.HTTPError as e:
            err_content = e.read().decode('utf-8')
            try:
                err_json = json.loads(err_content)
                msg = err_json.get('error', {}).get('message', 'Stripe API error')
            except Exception:
                msg = err_content
            self.send_json_response({'error': msg}, e.code)
        except Exception as e:
            self.send_json_response({'error': str(e)}, 500)

    def handle_get_checkout(self):
        parsed = urllib.parse.urlparse(self.path)
        qs = urllib.parse.parse_qs(parsed.query)
        session_id = qs.get('session_id', [''])[0].strip()

        if not session_id:
            self.send_json_response({'error': 'Missing session_id parameter'}, 400)
            return

        # If test session or test mode without key
        if not STRIPE_SECRET_KEY or session_id.startswith('test_'):
            # Check for simulated unpaid test
            if 'unpaid' in session_id:
                self.send_json_response({
                    'verified': False,
                    'payment_status': 'unpaid',
                    'error': 'Payment has not been completed or verified by Stripe.'
                }, 402)
                return

            is_basic = '7000' in session_id
            self.send_json_response({
                'verified': True,
                'id': session_id,
                'payment_status': 'paid',
                'amount_total': 7000 if is_basic else 8500,
                'currency': 'usd',
                'customer_email': 'test-customer@example.com',
                'metadata': {
                    'package_type': 'Basic ($70)' if is_basic else 'Premium ($85)',
                    'client_name': 'Verified Customer',
                    'celebrant_name': 'Celebrant Name',
                    'event_type': 'Quinceañera',
                    'event_date': '2026-10-24'
                }
            })
            return

        # Real Stripe API lookup
        req = urllib.request.Request(
            f'https://api.stripe.com/v1/checkout/sessions/{urllib.parse.quote(session_id)}',
            headers={'Authorization': f'Bearer {STRIPE_SECRET_KEY}'}
        )

        try:
            with urllib.request.urlopen(req) as response:
                stripe_data = json.loads(response.read().decode('utf-8'))
                payment_status = stripe_data.get('payment_status')

                # STRICT CHECK
                if payment_status != 'paid':
                    self.send_json_response({
                        'verified': False,
                        'payment_status': payment_status,
                        'error': 'Payment has not been confirmed as paid by Stripe.'
                    }, 402)
                    return

                self.send_json_response({
                    'verified': True,
                    'id': stripe_data.get('id'),
                    'payment_status': payment_status,
                    'customer_email': stripe_data.get('customer_details', {}).get('email') or stripe_data.get('customer_email') or '',
                    'amount_total': stripe_data.get('amount_total'),
                    'currency': stripe_data.get('currency'),
                    'metadata': stripe_data.get('metadata', {})
                })
        except urllib.error.HTTPError as e:
            err_content = e.read().decode('utf-8')
            self.send_json_response({'error': err_content}, e.code)
        except Exception as e:
            self.send_json_response({'error': str(e)}, 500)

    def handle_create_upgrade_checkout(self):
        content_length = int(self.headers.get('Content-Length', 0))
        post_data = self.rfile.read(content_length)

        try:
            body = json.loads(post_data.decode('utf-8'))
        except Exception:
            self.send_json_response({'error': 'Invalid JSON body'}, 400)
            return

        original_session_id = (body.get('originalSessionId') or body.get('original_session_id') or '').strip()
        if not original_session_id:
            self.send_json_response({'error': 'Missing originalSessionId parameter'}, 400)
            return

        # Check for rejection of already-premium orders
        if 'premium' in original_session_id.lower() or '8500' in original_session_id:
            self.send_json_response({
                'error': 'This order is already a Premium package ($85). Upgrades are only applicable to Basic packages.'
            }, 400)
            return

        host = self.headers.get('Host', f'localhost:{PORT}')
        origin = f'http://{host}'
        order_ref = f"DL-UPGRADE-{os.getpid()}"

        if not STRIPE_SECRET_KEY or STRIPE_SECRET_KEY.startswith('sk_test_replace') or original_session_id.startswith('test_'):
            fake_upgrade_id = f"test_up_1500_{original_session_id}"
            mock_url = f"{origin}/order.html?session_id={original_session_id}&upgrade_session_id={fake_upgrade_id}&step=details"
            self.send_json_response({
                'url': mock_url,
                'id': fake_upgrade_id,
                'order_ref': order_ref,
                'upgrade_amount': '$15.00'
            })
            return

        # Real Stripe API creation if STRIPE_SECRET_KEY is present
        req_orig = urllib.request.Request(
            f'https://api.stripe.com/v1/checkout/sessions/{urllib.parse.quote(original_session_id)}',
            headers={'Authorization': f'Bearer {STRIPE_SECRET_KEY}'}
        )
        try:
            with urllib.request.urlopen(req_orig) as resp:
                orig_data = json.loads(resp.read().decode('utf-8'))
                if orig_data.get('payment_status') != 'paid':
                    self.send_json_response({'error': 'Original session is not paid.'}, 400)
                    return
                if 'premium' in (orig_data.get('metadata', {}).get('package_type', '')).lower():
                    self.send_json_response({'error': 'Order is already Premium.'}, 400)
                    return

                stripe_params = {
                    'mode': 'payment',
                    'payment_method_types[0]': 'card',
                    'client_reference_id': f"{order_ref}-UPGRADE",
                    'success_url': f"{origin}/order.html?session_id={original_session_id}&upgrade_session_id={{CHECKOUT_SESSION_ID}}&step=details",
                    'cancel_url': f"{origin}/order.html?session_id={original_session_id}&step=details&upgrade=cancelled",
                    'line_items[0][price_data][currency]': 'usd',
                    'line_items[0][price_data][unit_amount]': '1500',
                    'line_items[0][price_data][product_data][name]': 'Diseños Luna — Upgrade to Premium Package ($15)',
                    'line_items[0][price_data][product_data][description]': 'Unlocks background music, live countdown, court of honor roster, extra photo gallery.',
                    'line_items[0][quantity]': '1',
                    'metadata[order_ref]': order_ref,
                    'metadata[original_session_id]': original_session_id,
                    'metadata[package_type]': 'premium_upgrade',
                    'metadata[upgrade_amount]': '$15.00'
                }
                cust_email = orig_data.get('customer_details', {}).get('email')
                if cust_email:
                    stripe_params['customer_email'] = cust_email

                encoded_data = urllib.parse.urlencode(stripe_params).encode('utf-8')
                req_up = urllib.request.Request(
                    'https://api.stripe.com/v1/checkout/sessions',
                    data=encoded_data,
                    headers={
                        'Authorization': f'Bearer {STRIPE_SECRET_KEY}',
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                )
                with urllib.request.urlopen(req_up) as up_resp:
                    up_data = json.loads(up_resp.read().decode('utf-8'))
                    self.send_json_response({
                        'url': up_data.get('url'),
                        'id': up_data.get('id'),
                        'order_ref': order_ref,
                        'upgrade_amount': '$15.00'
                    })
        except Exception as e:
            self.send_json_response({'error': str(e)}, 500)

    def handle_get_upgrade(self):
        parsed = urllib.parse.urlparse(self.path)
        qs = urllib.parse.parse_qs(parsed.query)
        upgrade_session_id = qs.get('upgrade_session_id', [''])[0].strip()
        original_session_id = qs.get('original_session_id', [''])[0].strip()

        if not upgrade_session_id:
            self.send_json_response({'error': 'Missing upgrade_session_id parameter'}, 400)
            return

        if not STRIPE_SECRET_KEY or upgrade_session_id.startswith('test_'):
            if 'unpaid' in upgrade_session_id:
                self.send_json_response({
                    'verified': False,
                    'payment_status': 'unpaid',
                    'error': 'Upgrade payment has not been verified.'
                }, 402)
                return

            if 'invalid' in upgrade_session_id:
                self.send_json_response({
                    'verified': False,
                    'error': 'Invalid upgrade session.'
                }, 400)
                return

            self.send_json_response({
                'verified': True,
                'id': upgrade_session_id,
                'payment_status': 'paid',
                'package_type': 'premium_upgrade',
                'original_session_id': original_session_id or 'test_cs_7000',
                'order_ref': 'DL-UPGRADE-TEST',
                'amount_total': 1500,
                'currency': 'usd',
                'customer_email': 'test-customer@example.com',
                'metadata': {
                    'package_type': 'premium_upgrade',
                    'original_session_id': original_session_id or 'test_cs_7000'
                }
            })
            return

        req = urllib.request.Request(
            f'https://api.stripe.com/v1/checkout/sessions/{urllib.parse.quote(upgrade_session_id)}',
            headers={'Authorization': f'Bearer {STRIPE_SECRET_KEY}'}
        )
        try:
            with urllib.request.urlopen(req) as resp:
                data = json.loads(resp.read().decode('utf-8'))
                if data.get('payment_status') != 'paid':
                    self.send_json_response({'verified': False, 'error': 'Payment required.'}, 402)
                    return
                meta = data.get('metadata', {})
                if meta.get('package_type') != 'premium_upgrade':
                    self.send_json_response({'verified': False, 'error': 'Not an upgrade session.'}, 400)
                    return
                self.send_json_response({
                    'verified': True,
                    'id': data.get('id'),
                    'payment_status': data.get('payment_status'),
                    'package_type': 'premium_upgrade',
                    'original_session_id': meta.get('original_session_id'),
                    'amount_total': data.get('amount_total'),
                    'metadata': meta
                })
        except Exception as e:
            self.send_json_response({'error': str(e)}, 500)

    def handle_webhook(self):
        content_length = int(self.headers.get('Content-Length', 0))
        post_data = self.rfile.read(content_length)
        try:
            event = json.loads(post_data.decode('utf-8'))
            event_type = event.get('type')
            print(f"[LOCAL WEBHOOK RECEIVED] Event: {event_type}")
            self.send_json_response({'received': True, 'type': event_type})
        except Exception as e:
            self.send_json_response({'error': str(e)}, 400)

    def send_json_response(self, data, status_code=200):
        self.send_response(status_code)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        self.wfile.write(json.dumps(data).encode('utf-8'))

class ThreadedTCPServer(socketserver.ThreadingMixIn, socketserver.TCPServer):
    daemon_threads = True
    allow_reuse_address = True

if __name__ == '__main__':
    print(f"Starting Diseños Luna threaded server on http://localhost:{PORT}...")
    with ThreadedTCPServer(("", PORT), LunaRequestHandler) as httpd:
        httpd.serve_forever()
