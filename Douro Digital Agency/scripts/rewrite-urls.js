#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const HTML_DIR = path.join(ROOT, 'html');
const CSS_DIR = path.join(ROOT, 'css');

// Asset directories to index
const ASSET_DIRS = ['images', 'videos', 'audio', 'other', 'css', 'js'];

// ── Step 1: Build filename index ──────────────────────────────────────────────
// Maps filename (raw and URL-decoded) → { dir, file } for lookup
function buildIndex() {
  const index = new Map();
  for (const dir of ASSET_DIRS) {
    const dirPath = path.join(ROOT, dir);
    if (!fs.existsSync(dirPath)) continue;
    for (const file of fs.readdirSync(dirPath)) {
      if (fs.statSync(path.join(dirPath, file)).isDirectory()) continue;
      index.set(file, { dir, file });
      // Also index URL-decoded version
      try {
        const decoded = decodeURIComponent(file);
        if (decoded !== file) index.set(decoded, { dir, file });
      } catch {}
      // Also index without URL encoding (encode the raw name)
      try {
        const encoded = encodeURIComponent(file);
        if (encoded !== file) index.set(encoded, { dir, file });
      } catch {}
    }
  }
  return index;
}

// ── Step 2: CDN pattern replacements ──────────────────────────────────────────

// Extract filename from a CDN URL path
function extractFilename(urlPath) {
  // Remove query string, but also try with query as part of filename
  // (some downloaded files have ?site= baked into filename as _site_)
  let clean = urlPath.split('?')[0];
  let query = urlPath.includes('?') ? urlPath.split('?')[1] : '';
  // Get last path segment
  const segments = clean.split('/').filter(Boolean);
  const base = segments[segments.length - 1] || null;
  // Return both the clean name and query-baked variants
  // Downloaded files bake query as: name_query with %3A→_3A and =→_
  let withQuery = null;
  if (query) {
    // Try the format used by the downloader: key_value with %XX preserved as _XX
    const bakedQuery = query.replace(/=/g, '_');
    withQuery = `${base}_${bakedQuery}`;
  }
  return { base, withQuery };
}

// Try multiple name variants against the index
function lookupIndex(name, index) {
  if (!name) return null;
  let entry = index.get(name);
  if (entry) return entry;
  try { entry = index.get(decodeURIComponent(name)); } catch {}
  if (entry) return entry;
  try { entry = index.get(encodeURIComponent(name)); } catch {}
  if (entry) return entry;
  // Try with %3A→_3A substitution (common in downloaded filenames)
  try {
    const variant = name.replace(/%3A/gi, '_3A');
    entry = index.get(variant);
    if (entry) return entry;
    entry = index.get(decodeURIComponent(variant));
    if (entry) return entry;
  } catch {}
  return null;
}

// Resolve a CDN URL to a local relative path (from html/ context)
function resolveFromHtml(filenameObj, index) {
  if (!filenameObj || !filenameObj.base) return null;

  // Try query-baked variant first (e.g., jquery...js_site_xxx)
  if (filenameObj.withQuery) {
    const entry = lookupIndex(filenameObj.withQuery, index);
    if (entry) return `../${entry.dir}/${entry.file}`;
  }
  // Then try base filename
  const entry = lookupIndex(filenameObj.base, index);
  if (entry) return `../${entry.dir}/${entry.file}`;
  return null;
}

// Resolve from CSS context (css/ dir)
function resolveFromCss(filenameObj, index) {
  if (!filenameObj || !filenameObj.base) return null;
  if (filenameObj.withQuery) {
    const entry = lookupIndex(filenameObj.withQuery, index);
    if (entry) return `../${entry.dir}/${entry.file}`;
  }
  const entry = lookupIndex(filenameObj.base, index);
  if (entry) return `../${entry.dir}/${entry.file}`;
  return null;
}

// All CDN origin patterns we need to rewrite
const CDN_PATTERNS = [
  // Webflow main CDN - CSS
  /https?:\/\/cdn\.prod\.website-files\.com\/[a-f0-9]+\/css\/([^\s"'<>]+)/g,
  // Webflow main CDN - JS
  /https?:\/\/cdn\.prod\.website-files\.com\/[a-f0-9]+\/js\/([^\s"'<>]+)/g,
  // Webflow main CDN - generic assets (images, fonts, JSON, etc.)
  /https?:\/\/cdn\.prod\.website-files\.com\/[a-f0-9]+\/([^\s"'<>]+)/g,
  // Webflow CDN with URL-encoded path segments
  /https?:\/\/cdn\.prod\.website-files\.com\/[a-f0-9%]+(?:%2F[a-f0-9%]+)*%2F([^\s"'<>]+)/g,
  // CloudFront - JS
  /https?:\/\/d3e54v103j8qbb\.cloudfront\.net\/js\/([^\s"'<>]+)/g,
  // CloudFront - img
  /https?:\/\/d3e54v103j8qbb\.cloudfront\.net\/img\/([^\s"'<>]+)/g,
  // CloudFront - static
  /https?:\/\/d3e54v103j8qbb\.cloudfront\.net\/static\/([^\s"'<>]+)/g,
  // Refokus files (videos)
  /https?:\/\/files\.refokus\.com\/storage\/v1\/object\/public\/[^/]+\/([^\s"'<>]+)/g,
  // Refokus CDN (audio)
  /https?:\/\/cdn\.refokus\.com\/[^/]+\/([^\s"'<>]+)/g,
  // cdnjs (slick)
  /https?:\/\/cdnjs\.cloudflare\.com\/ajax\/libs\/[^/]+\/[^/]+\/([^\s"'<>]+)/g,
  // jsdelivr (layout.css)
  /https?:\/\/cdn\.jsdelivr\.net\/gh\/[^/]+\/[^@]+@[^/]+\/([^\s"'<>]+)/g,
];

// ── Step 3: Process HTML files ────────────────────────────────────────────────
function processHtmlFiles(index) {
  const files = fs.readdirSync(HTML_DIR);
  let totalChanged = 0;

  for (const file of files) {
    const filePath = path.join(HTML_DIR, file);
    if (fs.statSync(filePath).isDirectory()) continue;

    let content = fs.readFileSync(filePath, 'utf-8');
    const original = content;

    // Replace all CDN URLs with local paths
    // Use a single mega-regex approach: find any CDN URL and resolve it
    // Match CDN URLs — allow () in filenames, stop at whitespace, quotes, angle brackets
    content = content.replace(
      /https?:\/\/(cdn\.prod\.website-files\.com|d3e54v103j8qbb\.cloudfront\.net|files\.refokus\.com|cdn\.refokus\.com|cdnjs\.cloudflare\.com|cdn\.jsdelivr\.net|cdn\.intellimize\.co|analytics\.ahrefs\.com)\/[^\s"'<>]+/g,
      (match) => {
        // Strip trailing &quot; or &amp; HTML entities captured by accident
        let url = match.replace(/&quot;.*$/, '').replace(/&amp;.*$/, '');

        const filename = extractFilename(url);
        if (!filename) return match;

        const local = resolveFromHtml(filename, index);
        if (local) {
          // Preserve the trailing HTML entity that was in the original
          const trailing = match.slice(url.length);
          return local + trailing;
        }

        // If we can't resolve, leave as-is
        return match;
      }
    );

    // Handle srcset attributes with multiple URLs
    content = content.replace(
      /srcset="([^"]+)"/g,
      (match, srcsetVal) => {
        const rewritten = srcsetVal.replace(
          /https?:\/\/[^\s,]+/g,
          (url) => {
            const filename = extractFilename(url);
            if (!filename) return url;
            return resolveFromHtml(filename, index) || url;
          }
        );
        return `srcset="${rewritten}"`;
      }
    );

    // Remove integrity and crossorigin attributes
    content = content.replace(/\s+integrity="[^"]*"/g, '');
    content = content.replace(/\s+crossorigin(?:="[^"]*")?/g, '');

    if (content !== original) {
      fs.writeFileSync(filePath, content, 'utf-8');
      totalChanged++;
      console.log(`  rewritten: html/${file}`);
    }
  }
  return totalChanged;
}

// ── Step 4: Process CSS files ─────────────────────────────────────────────────
function processCssFiles(index) {
  const files = fs.readdirSync(CSS_DIR);
  let totalChanged = 0;

  for (const file of files) {
    const filePath = path.join(CSS_DIR, file);
    if (fs.statSync(filePath).isDirectory()) continue;

    let content = fs.readFileSync(filePath, 'utf-8');
    const original = content;

    // Rewrite url() references — skip data: URIs
    content = content.replace(
      /url\((["']?)(https?:\/\/[^)"']+)\1\)/g,
      (match, quote, url) => {
        if (url.startsWith('data:')) return match;
        const filename = extractFilename(url);
        if (!filename) return match;
        const local = resolveFromCss(filename, index);
        if (local) return `url(${quote}${local}${quote})`;
        return match;
      }
    );

    if (content !== original) {
      fs.writeFileSync(filePath, content, 'utf-8');
      totalChanged++;
      console.log(`  rewritten: css/${file}`);
    }
  }
  return totalChanged;
}

// ── Main ──────────────────────────────────────────────────────────────────────
console.log('Building filename index...');
const index = buildIndex();
console.log(`  indexed ${index.size} entries across ${ASSET_DIRS.length} directories\n`);

console.log('Rewriting HTML files...');
const htmlChanged = processHtmlFiles(index);
console.log(`  ${htmlChanged} HTML files updated\n`);

console.log('Rewriting CSS files...');
const cssChanged = processCssFiles(index);
console.log(`  ${cssChanged} CSS files updated\n`);

console.log(`Done. ${htmlChanged + cssChanged} files rewritten.`);
