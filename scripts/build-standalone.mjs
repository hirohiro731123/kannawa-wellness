#!/usr/bin/env node

import fs from "node:fs/promises";
import path from "node:path";
import { createWriteStream } from "node:fs";
import { get as httpsGet } from "node:https";
import { get as httpGet } from "node:http";

const IMAGES = {
  "hero-kannawa":
    "https://d2xsxph8kpxj0f.cloudfront.net/310519663243504893/af5dDHaHNtaa3Lca6iH4uU/hero-kannawa-real_514534f2.webp",
  "handpan-onsen":
    "https://d2xsxph8kpxj0f.cloudfront.net/310519663243504893/af5dDHaHNtaa3Lca6iH4uU/handpan-onsen-8D33GGC5cnax8msifyhxx2.webp",
  "live-performance":
    "https://d2xsxph8kpxj0f.cloudfront.net/310519663243504893/af5dDHaHNtaa3Lca6iH4uU/live-performance-PzvBhSz7LHyeWk2BKqZJYs.webp",
  "workshop-scene":
    "https://d2xsxph8kpxj0f.cloudfront.net/310519663243504893/af5dDHaHNtaa3Lca6iH4uU/workshop-scene-JTN9X8bKJRmWVLuR2DqnTp.webp",
  "fire-festival":
    "https://d2xsxph8kpxj0f.cloudfront.net/310519663243504893/af5dDHaHNtaa3Lca6iH4uU/fire-festival-2ZYMBtXvvJzNK5DNFrj9xc.webp"
};

const cwd = process.cwd();
const sourceDistDir = path.resolve(process.env.SOURCE_DIST_DIR || path.join(cwd, "dist/public"));
const outputDir = path.resolve(process.env.STANDALONE_OUTPUT_DIR || path.join(cwd, "dist/standalone"));
const imagesDir = path.join(outputDir, "images");
const assetsDir = path.join(outputDir, "assets");

const replacements = {
  [IMAGES["hero-kannawa"]]: "/images/hero-kannawa.webp",
  [IMAGES["handpan-onsen"]]: "/images/handpan-onsen.webp",
  [IMAGES["live-performance"]]: "/images/live-performance.webp",
  [IMAGES["workshop-scene"]]: "/images/workshop-scene.webp",
  [IMAGES["fire-festival"]]: "/images/fire-festival.webp"
};

async function exists(targetPath) {
  try {
    await fs.access(targetPath);
    return true;
  } catch {
    return false;
  }
}

function downloadFile(url, filePath) {
  const getter = url.startsWith("https:") ? httpsGet : httpGet;
  return new Promise((resolve, reject) => {
    const req = getter(url, (res) => {
      if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        downloadFile(res.headers.location, filePath).then(resolve).catch(reject);
        return;
      }
      if (res.statusCode !== 200) {
        reject(new Error(`Request failed: ${url} (${res.statusCode ?? "unknown"})`));
        return;
      }
      const stream = createWriteStream(filePath);
      res.pipe(stream);
      stream.on("finish", () => stream.close(() => resolve()));
      stream.on("error", reject);
    });
    req.on("error", reject);
  });
}

async function listFilesRecursive(root) {
  const out = [];
  const entries = await fs.readdir(root, { withFileTypes: true });
  for (const entry of entries) {
    const abs = path.join(root, entry.name);
    if (entry.isDirectory()) out.push(...(await listFilesRecursive(abs)));
    else out.push(abs);
  }
  return out;
}

async function main() {
  const sourceAssetsDir = path.join(sourceDistDir, "assets");
  const sourceIndex = path.join(sourceDistDir, "index.html");
  if (!(await exists(sourceAssetsDir)) || !(await exists(sourceIndex))) {
    throw new Error(
      `Source build output not found.\nExpected:\n- ${sourceAssetsDir}\n- ${sourceIndex}\nRun your frontend build first or set SOURCE_DIST_DIR.`
    );
  }

  await fs.rm(outputDir, { recursive: true, force: true });
  await fs.mkdir(imagesDir, { recursive: true });
  await fs.mkdir(assetsDir, { recursive: true });

  console.log("=== Downloading images ===");
  for (const [name, url] of Object.entries(IMAGES)) {
    const filePath = path.join(imagesDir, `${name}.webp`);
    console.log(`  Downloading ${name}...`);
    await downloadFile(url, filePath);
  }

  console.log("\n=== Copying built assets ===");
  for (const entry of await fs.readdir(sourceAssetsDir, { withFileTypes: true })) {
    if (!entry.isFile()) continue;
    await fs.copyFile(path.join(sourceAssetsDir, entry.name), path.join(assetsDir, entry.name));
    console.log(`  Copied ${entry.name}`);
  }

  console.log("\n=== Rewriting JS bundle ===");
  for (const entry of await fs.readdir(assetsDir, { withFileTypes: true })) {
    if (!entry.isFile() || !entry.name.endsWith(".js")) continue;
    const jsPath = path.join(assetsDir, entry.name);
    let content = await fs.readFile(jsPath, "utf8");
    for (const [oldUrl, newPath] of Object.entries(replacements)) {
      content = content.split(oldUrl).join(newPath);
    }
    await fs.writeFile(jsPath, content, "utf8");
  }

  console.log("\n=== Creating clean index.html ===");
  let html = await fs.readFile(sourceIndex, "utf8");
  html = html.replace(/\s*<script src="\/__manus__\/debug-collector\.js"[^>]*><\/script>/g, "");
  html = html.replace(/\s*<script id="manus-runtime">[\s\S]*?<\/script>/g, "");
  html = html.replace(/\s*<script\s+defer\s+src="https:\/\/manus-analytics\.com\/umami"[^>]*><\/script>/g, "");
  await fs.writeFile(path.join(outputDir, "index.html"), html, "utf8");

  console.log("\n=== Verification ===");
  const issues = [];
  for (const filePath of await listFilesRecursive(outputDir)) {
    if (/\.(webp|png|jpg|jpeg)$/i.test(filePath)) continue;
    const content = await fs.readFile(filePath, "utf8");
    if (content.includes("cloudfront.net")) issues.push(filePath);
  }
  console.log(issues.length ? `  Found ${issues.length} issue(s)` : "  All clear! No external CloudFront references found.");
  console.log("\nDone!");
}

main().catch((error) => {
  console.error(error.message || error);
  process.exit(1);
});
