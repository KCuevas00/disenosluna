#!/usr/bin/env python3
"""
recolor_florals.py
Smoothly shifts foliage and wax seal hues to match a target color family while
preserving warm gold branches, champagne details, and transparency.
"""
import sys
import colorsys
from PIL import Image

def smoothstep(edge0, edge1, x):
    t = max(0.0, min(1.0, (x - edge0) / (edge1 - edge0)))
    return t * t * (3.0 - 2.0 * t)

def recolor_floral_divider(image_path, target_hue_deg, sat_factor=0.48, lightness_boost=1.15):
    im = Image.open(image_path).convert('RGBA')
    w, h = im.size
    pixels = im.load()

    new_im = Image.new('RGBA', (w, h))
    new_pixels = new_im.load()

    for y in range(h):
        for x in range(w):
            r, g, b, a = pixels[x, y]
            if a == 0:
                new_pixels[x, y] = (0, 0, 0, 0)
                continue

            h_v, l_v, s_v = colorsys.rgb_to_hls(r/255.0, g/255.0, b/255.0)
            h_deg = h_v * 360.0

            # Foliage green detection (approx 62 to 152 deg)
            if h_deg < 62.0 or h_deg > 152.0 or s_v < 0.08:
                new_pixels[x, y] = (r, g, b, a)
                continue

            # Smoothstep transition weight
            if h_deg < 78.0:
                weight = smoothstep(62.0, 78.0, h_deg)
            elif h_deg > 138.0:
                weight = 1.0 - smoothstep(138.0, 152.0, h_deg)
            else:
                weight = 1.0

            # Compute target values
            target_h_deg = target_hue_deg + (h_deg - 114.4) * 0.35
            target_h = (target_h_deg % 360.0) / 360.0
            target_s = max(0.12, min(0.38, s_v * sat_factor))
            target_l = min(0.85, 0.10 + (l_v ** 0.58) * lightness_boost)

            final_h = h_v * (1.0 - weight) + target_h * weight
            final_s = s_v * (1.0 - weight) + target_s * weight
            final_l = l_v * (1.0 - weight) + target_l * weight

            nr, ng, nb = colorsys.hls_to_rgb(final_h, final_l, final_s)
            new_pixels[x, y] = (int(round(nr*255)), int(round(ng*255)), int(round(nb*255)), a)

    new_im.save(image_path, format='PNG')
    print(f"Recolored floral divider: {image_path} (Target Hue: {target_hue_deg}°)")

def recolor_wax_seal(seal_path, target_hue_deg):
    im = Image.open(seal_path).convert('RGBA')
    w, h = im.size
    pixels = im.load()

    new_im = Image.new('RGBA', (w, h))
    new_pixels = new_im.load()

    for y in range(h):
        for x in range(w):
            r, g, b, a = pixels[x, y]
            if a == 0:
                new_pixels[x, y] = (0, 0, 0, 0)
                continue

            h_v, l_v, s_v = colorsys.rgb_to_hls(r/255.0, g/255.0, b/255.0)
            h_deg = h_v * 360.0

            if 50 <= h_deg <= 130 and s_v > 0.05:
                delta = target_hue_deg - 75.0
                new_h = ((h_deg + delta * 0.75) % 360.0) / 360.0
                new_s = min(0.35, s_v * 0.95)
                new_l = min(0.85, l_v * 1.05)
                nr, ng, nb = colorsys.hls_to_rgb(new_h, new_l, new_s)
                new_pixels[x, y] = (int(round(nr*255)), int(round(ng*255)), int(round(nb*255)), a)
            else:
                new_pixels[x, y] = (r, g, b, a)

    new_im.save(seal_path, format='PNG')
    print(f"Recolored wax seal: {seal_path} (Target Hue: {target_hue_deg}°)")

if __name__ == '__main__':
    if len(sys.argv) < 3:
        print("Usage: python3 recolor_florals.py <image_path> <target_hue_deg> [wax_seal_path]")
        sys.exit(1)

    floral_file = sys.argv[1]
    hue = float(sys.argv[2])
    recolor_floral_divider(floral_file, hue)

    if len(sys.argv) >= 4:
        recolor_wax_seal(sys.argv[3], hue)
