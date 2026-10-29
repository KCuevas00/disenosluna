"""
Cloudflare R2 Media Uploader for Diseños Luna
Usage:
  python r2_upload.py <local_file_or_directory> [--prefix <remote_prefix>]

Examples:
  python r2_upload.py vianneytostado/photos --prefix vianneytostado/photos
  python r2_upload.py vianneytostado/music/song.m4a --prefix vianneytostado/music/song.m4a
"""

import sys
import os
import mimetypes
import argparse
from pathlib import Path
import boto3

def load_env():
    env = {}
    env_path = Path(__file__).parent / ".env"
    if not env_path.exists():
        print("Error: .env file not found!")
        sys.exit(1)
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
    if ext in custom_types:
        return custom_types[ext]
    mime, _ = mimetypes.guess_type(file_path)
    return mime or "application/octet-stream"

def upload_single_file(s3, bucket, public_domain, local_path, remote_key):
    content_type = guess_content_type(local_path)
    file_size_mb = os.path.getsize(local_path) / (1024 * 1024)
    print(f"Uploading {local_path} ({file_size_mb:.2f} MB) -> {remote_key}...")
    
    with open(local_path, "rb") as f:
        s3.put_object(
            Bucket=bucket,
            Key=remote_key,
            Body=f,
            ContentType=content_type,
            CacheControl="public, max-age=31536000, immutable"
        )
    public_url = f"{public_domain.rstrip('/')}/{remote_key}"
    print(f"  [OK] Live at: {public_url}")
    return public_url

def main():
    parser = argparse.ArgumentParser(description="Upload media to Cloudflare R2")
    parser.add_argument("path", help="Local file or folder to upload")
    parser.add_argument("--prefix", help="Remote key or directory prefix", default=None)
    args = parser.parse_args()

    env = load_env()
    s3 = get_s3_client(env)
    bucket = env["R2_BUCKET_NAME"]
    public_domain = env.get("R2_PUBLIC_DOMAIN", "https://media.disenosluna.com")

    target = Path(args.path)
    if not target.exists():
        print(f"Error: Path '{target}' does not exist.")
        sys.exit(1)

    if target.is_file():
        remote_key = args.prefix if args.prefix else target.name
        remote_key = remote_key.replace("\\", "/").lstrip("/")
        upload_single_file(s3, bucket, public_domain, target, remote_key)
    else:
        prefix = args.prefix if args.prefix else target.name
        prefix = prefix.replace("\\", "/").strip("/")
        files = [p for p in target.rglob("*") if p.is_file()]
        print(f"Uploading {len(files)} file(s) from '{target}' to R2 prefix '{prefix}/'...")
        for file in files:
            rel = file.relative_to(target).as_posix()
            remote_key = f"{prefix}/{rel}"
            upload_single_file(s3, bucket, public_domain, file, remote_key)
        print(f"\nAll files successfully synced to {public_domain}/{prefix}/")

if __name__ == "__main__":
    main()

