#!/usr/bin/env python3
"""
capture_og_preview.py
Starts a local HTTP server and uses headless Google Chrome with 2x retina
scaling to capture the landing envelope, downsampling to crisp 1200x630.
"""
import sys
import os
import time
import subprocess
from PIL import Image

def capture_og(project_dir, port=8099):
    abs_dir = os.path.abspath(project_dir)
    server_cmd = [sys.executable, "-m", "http.server", str(port), "--directory", abs_dir]
    server_proc = subprocess.Popen(server_cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    time.sleep(1.2)

    chrome_bin = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
    if not os.path.exists(chrome_bin):
        # Fallback to standard PATH search
        chrome_bin = "google-chrome"

    raw_shot = os.path.join(abs_dir, "temp_og_shot.png")
    chrome_cmd = [
        chrome_bin,
        "--headless=new",
        "--disable-gpu",
        "--force-device-scale-factor=2",
        "--window-size=1200,630",
        f"--screenshot={raw_shot}",
        f"http://localhost:{port}/index.html?og_preview=1"
    ]

    try:
        subprocess.run(chrome_cmd, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    finally:
        server_proc.terminate()
        server_proc.wait()

    if not os.path.exists(raw_shot):
        print(f"Error: Screenshot was not generated at {raw_shot}")
        sys.exit(1)

    im = Image.open(raw_shot)
    im_1200 = im.resize((1200, 630), Image.Resampling.LANCZOS)

    photos_dir = os.path.join(abs_dir, "photos")
    os.makedirs(photos_dir, exist_ok=True)

    jpg_path = os.path.join(photos_dir, "og-preview.jpg")
    png_path = os.path.join(photos_dir, "og-preview.png")

    im_1200.convert('RGB').save(jpg_path, quality=94, optimize=True)
    im_1200.save(png_path, optimize=True)

    os.remove(raw_shot)
    print(f"Successfully generated 1200x630 preview:\n  - {jpg_path}\n  - {png_path}")

if __name__ == '__main__':
    if len(sys.argv) < 2:
        print("Usage: python3 capture_og_preview.py <project_directory> [port]")
        sys.exit(1)

    p_dir = sys.argv[1]
    p_port = int(sys.argv[2]) if len(sys.argv) > 2 else 8099
    capture_og(p_dir, p_port)
