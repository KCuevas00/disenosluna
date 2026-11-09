#!/usr/bin/env python3
"""
validate_project.py
Validates HTML tag balance, checks JS syntax with node, and scans for any
leftover placeholder names from older templates.
"""
import sys
import os
import re
import html.parser
import subprocess

class HTMLValidator(html.parser.HTMLParser):
    def __init__(self):
        super().__init__()
        self.tags = []
        self.errors = []
        self.void_tags = {'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr'}

    def handle_starttag(self, tag, attrs):
        if tag not in self.void_tags:
            self.tags.append(tag)

    def handle_endtag(self, tag):
        if tag not in self.void_tags:
            if not self.tags:
                self.errors.append(f"Unexpected closing tag </{tag}>")
            else:
                last = self.tags.pop()
                if last != tag:
                    self.errors.append(f"Mismatched tag: expected </{last}>, found </{tag}>")

def validate_project(project_dir):
    abs_dir = os.path.abspath(project_dir)
    html_path = os.path.join(abs_dir, "index.html")
    js_path = os.path.join(abs_dir, "main.js")

    all_passed = True

    # 1. HTML Validation
    print("--- 1. Validating HTML Structure ---")
    if not os.path.exists(html_path):
        print(f"Error: {html_path} does not exist.")
        all_passed = False
    else:
        validator = HTMLValidator()
        with open(html_path, "r", encoding="utf-8") as f:
            validator.feed(f.read())

        if validator.errors or validator.tags:
            all_passed = False
            for err in validator.errors:
                print(f"  [HTML Error] {err}")
            if validator.tags:
                print(f"  [HTML Error] Unclosed tags: {validator.tags}")
        else:
            print("  ✓ HTML tag balance OK!")

    # 2. JavaScript Syntax Validation
    print("\n--- 2. Validating JavaScript Syntax ---")
    if os.path.exists(js_path):
        res = subprocess.run(["node", "-c", js_path], capture_output=True, text=True)
        if res.returncode != 0:
            all_passed = False
            print(f"  [JS Syntax Error] {res.stderr}")
        else:
            print("  ✓ JavaScript syntax valid!")
    else:
        print(f"  (main.js not found in {abs_dir})")

    # 3. Check for leftover template names
    print("\n--- 3. Scanning for Leftover Template Names ---")
    old_names = [
        r'\balondra\b', r'\bitzel\b', r'\bcardenas\b', r'\bcárdenas\b',
        r'\bmerelin\b', r'\bnunez\b', r'\bnuñez\b',
        r'\belizabeth\b', r'\bcastro\b',
        r'\bvianney\b', r'\btostado\b',
        r'\bcharra\b'
    ]
    name_regex = re.compile('|'.join(old_names), re.IGNORECASE)

    found_matches = []
    for fname in ["index.html", "main.js", "event.ics", "style.css"]:
        fpath = os.path.join(abs_dir, fname)
        if os.path.exists(fpath):
            with open(fpath, "r", encoding="utf-8", errors="ignore") as f:
                for idx, line in enumerate(f, 1):
                    # ignore CSS comments containing old notes if not relevant
                    m = name_regex.search(line)
                    if m:
                        found_matches.append((fname, idx, line.strip()))

    if found_matches:
        print(f"  ⚠️ Warning: Found {len(found_matches)} potential leftover references:")
        for fname, lnum, line in found_matches[:10]:
            print(f"    - {fname}:{lnum}: {line}")
    else:
        print("  ✓ Zero leftover template names found!")

    # 4. Check Package Tier Conformity (Basic vs Premium)
    print("\n--- 4. Checking Package Tier Conformity (Basic vs Premium) ---")
    readme_path = os.path.join(abs_dir, "README.md")
    pkg_tier = None
    if os.path.exists(readme_path):
        with open(readme_path, "r", encoding="utf-8", errors="ignore") as f:
            content = f.read().lower()
            if "basic" in content:
                pkg_tier = "basic"
            elif "premium" in content:
                pkg_tier = "premium"

    if os.path.exists(html_path):
        with open(html_path, "r", encoding="utf-8", errors="ignore") as f:
            html_content = f.read()

        if pkg_tier == "basic":
            print("  Detected Package: BASIC ($55)")
            issues = []
            if "<audio" in html_content or 'audio-control-bar' in html_content:
                issues.append("Found <audio> or audio-control-bar (Music is Premium only)")
            if 'class="countdown-section"' in html_content or 'id="countdown"' in html_content:
                issues.append("Found countdown section (Live Countdown is Premium only)")
            if 'class="floating-lang-bar"' in html_content:
                issues.append("Found floating language switcher (Bilingual is Premium only)")
            if 'class="court-section"' in html_content or 'id="court"' in html_content:
                issues.append("Found court of honor section (Court is Premium only)")

            if issues:
                for issue in issues:
                    print(f"  ⚠️ Package Mismatch: {issue}")
            else:
                print("  ✓ Basic package tier verified (No premium audio, countdown, court, or lang toggle).")
        elif pkg_tier == "premium":
            print("  Detected Package: PREMIUM ($70)")
            missing = []
            if "<audio" not in html_content and 'audio-control-bar' not in html_content:
                missing.append("Missing <audio> or audio-control-bar (Required in Premium)")
            if 'countdown' not in html_content:
                missing.append("Missing countdown section (Expected in Premium)")
            if missing:
                for m in missing:
                    print(f"  ⚠️ Package Missing Feature: {m}")
            else:
                print("  ✓ Premium package tier verified (Audio and interactive features present).")
        else:
            print("  (Package tier not specified in README.md — skipping tier-specific checks)")

    print("\n" + ("=" * 45))
    if all_passed:
        print("🎉 ALL PROJECT VALIDATIONS PASSED!")
    else:
        print("❌ SOME VALIDATIONS FAILED - Review errors above.")
    print("=" * 45)

if __name__ == '__main__':
    if len(sys.argv) < 2:
        print("Usage: python3 validate_project.py <project_directory>")
        sys.exit(1)

    validate_project(sys.argv[1])
