"""
Cloudflare R2 Client Migration Script for Diseños Luna
Uploads client media to R2, rewrites HTML references to R2 CDN,
and updates .gitignore / .assetsignore.
"""

import sys
import os
import re
from pathlib import Path
import subprocess
import boto3

def load_env():
    env = {}
    env_path = Path(__file__).parent / ".env"
    with open(env_path, "r", encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if line and not line.startswith("#") and "=" in line:
                k, v = line.split("=", 1)
                env[k.strip()] = v.strip()
    return env

def get_s3_client(env):
    return boto3.client(
        "s3",
        endpoint_url=env["R2_ENDPOINT_URL"],
        aws_access_key_id=env["R2_ACCESS_KEY_ID"],
        aws_secret_access_key=env["R2_SECRET_ACCESS_KEY"],
        region_name="auto",
    )

def guess_content_type(file_path):
    ext = Path(file_path).suffix.lower()
    custom_types = {
        ".m4a": "audio/mp4",
        ".mp3": "audio/mpeg",
        ".webm": "video/webm",
        ".webp": "image/webp",
        ".svg": "image/svg+xml",
        ".jpg": "image/jpeg",
        ".jpeg": "image/jpeg",
        ".png": "image/png",
    }
    return custom_types.get(ext, "application/octet-stream")

def upload_folder(s3, bucket, public_domain, local_folder, remote_prefix):
    folder_path = Path(local_folder)
    if not folder_path.exists():
        return
    files = [f for f in folder_path.rglob("*") if f.is_file()]
    print(f"Uploading {len(files)} file(s) from {local_folder} to {remote_prefix}/...")
    for f in files:
        rel = f.relative_to(folder_path).as_posix()
        remote_key = f"{remote_prefix}/{rel}".strip("/")
        content_type = guess_content_type(f)
        size_mb = f.stat().st_size / (1024 * 1024)
        with open(f, "rb") as stream:
            s3.put_object(
                Bucket=bucket,
                Key=remote_key,
                Body=stream,
                ContentType=content_type,
                CacheControl="public, max-age=31536000, immutable"
            )
        print(f"  [OK] {rel} ({size_mb:.2f} MB)")

def update_index_html(client_folder, public_domain):
    html_path = Path(client_folder) / "index.html"
    if not html_path.exists():
        return
    with open(html_path, "r", encoding="utf-8") as f:
        content = f.read()

    # Normalize BOM
    if content.startswith("\ufeff"):
        content = content[1:]

    cdn_base = f"{public_domain.rstrip('/')}/{client_folder}"

    # 1. Replace existing full domain OG/Twitter image links
    content = re.sub(
        rf'https://disenosluna\.com/{client_folder}/photos/',
        f'{cdn_base}/photos/',
        content,
        flags=re.IGNORECASE
    )

    # 2. Replace relative photos/ and music/ paths in src and content
    content = content.replace('="photos/', f'="{cdn_base}/photos/')
    content = content.replace("='photos/", f"='{cdn_base}/photos/")
    content = content.replace('="music/', f'="{cdn_base}/music/')
    content = content.replace("='music/", f"='{cdn_base}/music/")

    with open(html_path, "w", encoding="utf-8") as f:
        f.write(content)
    print(f"  [OK] Updated {html_path} with R2 CDN links")

def append_to_ignore_file(file_name, rules):
    path = Path(file_name)
    existing = path.read_text(encoding="utf-8") if path.exists() else ""
    to_add = [r for r in rules if r not in existing]
    if to_add:
        with open(path, "a", encoding="utf-8") as f:
            f.write("\n" + "\n".join(to_add) + "\n")
        print(f"  [OK] Added rules to {file_name}")

def migrate_client(client_name):
    print(f"\n==========================================")
    print(f"MIGRATING: {client_name}")
    print(f"==========================================")
    
    env = load_env()
    s3 = get_s3_client(env)
    bucket = env["R2_BUCKET_NAME"]
    public_domain = env.get("R2_PUBLIC_DOMAIN", "https://media.disenosluna.com")

    # 1. Upload photos
    photos_dir = Path(client_name) / "photos"
    if photos_dir.exists():
        upload_folder(s3, bucket, public_domain, photos_dir, f"{client_name}/photos")

    # 2. Upload music
    music_dir = Path(client_name) / "music"
    if music_dir.exists():
        upload_folder(s3, bucket, public_domain, music_dir, f"{client_name}/music")

    # 3. Update HTML
    update_index_html(client_name, public_domain)

    # 4. Add to ignore files
    rules = [
        f"{client_name}/photos/",
        f"{client_name}/music/",
    ]
    append_to_ignore_file(".gitignore", rules)
    append_to_ignore_file(".assetsignore", rules)

    # 5. Untrack from git
    cmd = ["git", "rm", "--cached", "-r"]
    if photos_dir.exists():
        cmd.append(f"{client_name}/photos")
    if music_dir.exists():
        cmd.append(f"{client_name}/music")
    
    subprocess.run(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    print(f"  [OK] Untracked media from Git tracking for {client_name}")
    print(f"Migration for {client_name} finished successfully!")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python migrate_to_r2.py <client_name_1> [client_name_2 ...]")
        sys.exit(1)
    for c in sys.argv[1:]:
        migrate_client(c)
