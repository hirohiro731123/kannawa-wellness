#!/usr/bin/env python3
"""
Download all CDN images and rewrite the built JS bundle to use local paths.
Creates a fully self-contained upload package for Little Server.
"""
import os
import re
import shutil
import subprocess
import urllib.request

# CDN image URLs from Home.tsx
IMAGES = {
    "hero-kannawa": "https://d2xsxph8kpxj0f.cloudfront.net/310519663243504893/af5dDHaHNtaa3Lca6iH4uU/hero-kannawa-real_514534f2.webp",
    "handpan-onsen": "https://d2xsxph8kpxj0f.cloudfront.net/310519663243504893/af5dDHaHNtaa3Lca6iH4uU/handpan-onsen-8D33GGC5cnax8msifyhxx2.webp",
    "live-performance": "https://d2xsxph8kpxj0f.cloudfront.net/310519663243504893/af5dDHaHNtaa3Lca6iH4uU/live-performance-PzvBhSz7LHyeWk2BKqZJYs.webp",
    "workshop-scene": "https://d2xsxph8kpxj0f.cloudfront.net/310519663243504893/af5dDHaHNtaa3Lca6iH4uU/workshop-scene-JTN9X8bKJRmWVLuR2DqnTp.webp",
    "fire-festival": "https://d2xsxph8kpxj0f.cloudfront.net/310519663243504893/af5dDHaHNtaa3Lca6iH4uU/fire-festival-2ZYMBtXvvJzNK5DNFrj9xc.webp",
}

OUTPUT_DIR = "/home/ubuntu/kannawa-standalone"
IMAGES_DIR = os.path.join(OUTPUT_DIR, "images")
ASSETS_DIR = os.path.join(OUTPUT_DIR, "assets")

# Clean and create output directory
if os.path.exists(OUTPUT_DIR):
    shutil.rmtree(OUTPUT_DIR)
os.makedirs(IMAGES_DIR, exist_ok=True)
os.makedirs(ASSETS_DIR, exist_ok=True)

# Step 1: Download all images
print("=== Downloading images ===")
for name, url in IMAGES.items():
    filename = f"{name}.webp"
    filepath = os.path.join(IMAGES_DIR, filename)
    print(f"  Downloading {name}...")
    urllib.request.urlretrieve(url, filepath)
    size = os.path.getsize(filepath)
    print(f"  -> {filepath} ({size:,} bytes)")

# Step 2: Copy built assets
print("\n=== Copying built assets ===")
src_assets = "/home/ubuntu/kannawa-handpan/dist/public/assets"
for f in os.listdir(src_assets):
    src = os.path.join(src_assets, f)
    dst = os.path.join(ASSETS_DIR, f)
    shutil.copy2(src, dst)
    print(f"  Copied {f}")

# Step 3: Rewrite JS bundle to use local image paths
print("\n=== Rewriting JS bundle ===")
js_files = [f for f in os.listdir(ASSETS_DIR) if f.endswith('.js')]
for js_file in js_files:
    js_path = os.path.join(ASSETS_DIR, js_file)
    with open(js_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Replace each CDN URL with local path
    replacements = {
        IMAGES["hero-kannawa"]: "/images/hero-kannawa.webp",
        IMAGES["handpan-onsen"]: "/images/handpan-onsen.webp",
        IMAGES["live-performance"]: "/images/live-performance.webp",
        IMAGES["workshop-scene"]: "/images/workshop-scene.webp",
        IMAGES["fire-festival"]: "/images/fire-festival.webp",
    }
    
    for old_url, new_path in replacements.items():
        if old_url in content:
            content = content.replace(old_url, new_path)
            print(f"  Replaced: {old_url[:60]}... -> {new_path}")
        else:
            print(f"  WARNING: URL not found in JS: {old_url[:60]}...")
    
    with open(js_path, 'w', encoding='utf-8') as f:
        f.write(content)

# Step 4: Create clean index.html
print("\n=== Creating clean index.html ===")
with open("/home/ubuntu/kannawa-handpan/dist/public/index.html", 'r', encoding='utf-8') as f:
    html = f.read()

# Remove manus debug collector script
html = re.sub(r'\s*<script src="/__manus__/debug-collector\.js"[^>]*></script>', '', html)

# Remove manus runtime inline script
html = re.sub(r'\s*<script id="manus-runtime">.*?</script>', '', html, flags=re.DOTALL)

# Remove manus analytics script
html = re.sub(r'\s*<script\s+defer\s+src="https://manus-analytics\.com/umami"[^>]*></script>', '', html)

with open(os.path.join(OUTPUT_DIR, "index.html"), 'w', encoding='utf-8') as f:
    f.write(html)

# Step 5: Verify no manus/cloudfront references remain
print("\n=== Verification ===")
all_files = []
for root, dirs, files in os.walk(OUTPUT_DIR):
    for f in files:
        all_files.append(os.path.join(root, f))

issues = []
for filepath in all_files:
    if filepath.endswith(('.webp', '.png', '.jpg')):
        continue
    with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()
    
    if 'cloudfront.net' in content:
        issues.append(f"  ISSUE: {filepath} still contains cloudfront.net reference")
    if 'manus' in content.lower() and '__manus__' in content:
        issues.append(f"  ISSUE: {filepath} still contains __manus__ reference")
    if 'manus-analytics' in content:
        issues.append(f"  ISSUE: {filepath} still contains manus-analytics reference")

if issues:
    for issue in issues:
        print(issue)
else:
    print("  All clear! No external Manus/CloudFront references found.")

# Step 6: List final file structure
print("\n=== Final file structure ===")
for root, dirs, files in os.walk(OUTPUT_DIR):
    level = root.replace(OUTPUT_DIR, '').count(os.sep)
    indent = '  ' * level
    print(f"{indent}{os.path.basename(root)}/")
    subindent = '  ' * (level + 1)
    for f in sorted(files):
        size = os.path.getsize(os.path.join(root, f))
        print(f"{subindent}{f} ({size:,} bytes)")

print("\nDone!")
