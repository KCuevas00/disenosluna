#!/usr/bin/env python3
"""
Diseños Luna — Local Development Static Server
Serves static website files (HTML, CSS, JS, assets) with multi-threading for fast previewing.
"""

import http.server
import socketserver
import os

PORT = 8088
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

class LunaRequestHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

class ThreadedTCPServer(socketserver.ThreadingMixIn, socketserver.TCPServer):
    daemon_threads = True
    allow_reuse_address = True

if __name__ == '__main__':
    print(f"Starting Diseños Luna local server on http://localhost:{PORT}...")
    with ThreadedTCPServer(("", PORT), LunaRequestHandler) as httpd:
        httpd.serve_forever()
