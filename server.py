#!/usr/bin/env python3
"""
Diseños Luna — Local Development Server with Stripe Checkout API
Serves static landing page & handles /api/create-checkout-session and /api/get-checkout-session
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
        else:
            self.send_error(404, "Endpoint not found")

    def do_GET(self):
        if self.path.startswith('/api/get-checkout-session'):
            self.handle_get_checkout()
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

        package_type = body.get('packageType', 'Premium')
        client_name = body.get('clientName', '')
        client_phone = body.get('clientPhone', '')
        client_email = body.get('clientEmail', '')
        social_handle = body.get('socialHandle', '')
        preferred_contact = body.get('preferredContact', 'WhatsApp')
        event_type = body.get('eventType', '')
        celebrant_name = body.get('celebrantName', '')
        event_date = body.get('eventDate', '')

        is_basic = 'basic' in package_type.lower()
        unit_amount = 7000 if is_basic else 8500
        pkg_title = 'Diseños Luna — Basic Invitation Package' if is_basic else 'Diseños Luna — Premium Invitation Package'
        pkg_desc = 'Complete digital invitation with 3D envelope, schedule & maps links.' if is_basic else 'Full interactive experience with music, countdown, court of honor & extra photos.'

        # Determine origin
        host = self.headers.get('Host', f'localhost:{PORT}')
        origin = f'http://{host}'

        # If no real Stripe key is configured, provide a test session redirect for local verification
        if not STRIPE_SECRET_KEY or STRIPE_SECRET_KEY.startswith('sk_test_replace'):
            fake_session_id = f"test_cs_{int(unit_amount)}_{int(os.getpid())}"
            mock_url = f"{origin}/order.html?session_id={fake_session_id}&step=details"
            self.send_json_response({
                'url': mock_url,
                'id': fake_session_id,
                'is_test_mode': True,
                'notice': 'STRIPE_SECRET_KEY not set in .env. To enable real live Stripe checkout, add your sk_live_... key to .env'
            })
            return

        # Real Stripe API Call
        stripe_params = {
            'mode': 'payment',
            'payment_method_types[0]': 'card',
            'success_url': f"{origin}/order.html?session_id={{CHECKOUT_SESSION_ID}}&step=details",
            'cancel_url': f"{origin}/order.html?step=cancelled",
            'line_items[0][price_data][currency]': 'usd',
            'line_items[0][price_data][unit_amount]': str(unit_amount),
            'line_items[0][price_data][product_data][name]': pkg_title,
            'line_items[0][price_data][product_data][description]': pkg_desc,
            'line_items[0][quantity]': '1',
            'metadata[package_type]': 'Basic ($70)' if is_basic else 'Premium ($85)',
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
                    'id': stripe_data.get('id')
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
        session_id = qs.get('session_id', [''])[0]

        if not session_id:
            self.send_json_response({'error': 'Missing session_id parameter'}, 400)
            return

        if not STRIPE_SECRET_KEY or session_id.startswith('test_'):
            # Return mock session info for local test mode
            is_basic = '7000' in session_id
            self.send_json_response({
                'id': session_id,
                'payment_status': 'paid',
                'amount_total': 7000 if is_basic else 8500,
                'currency': 'usd',
                'metadata': {
                    'package_type': 'Basic ($70)' if is_basic else 'Premium ($85)'
                }
            })
            return

        # Real Stripe lookup
        req = urllib.request.Request(
            f'https://api.stripe.com/v1/checkout/sessions/{urllib.parse.quote(session_id)}',
            headers={'Authorization': f'Bearer {STRIPE_SECRET_KEY}'}
        )

        try:
            with urllib.request.urlopen(req) as response:
                stripe_data = json.loads(response.read().decode('utf-8'))
                self.send_json_response({
                    'id': stripe_data.get('id'),
                    'payment_status': stripe_data.get('payment_status'),
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
