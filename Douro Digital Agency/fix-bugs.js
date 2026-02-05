#!/usr/bin/env node
/**
 * Fix all bugs from DEBUG_REPORT.md
 * - Replace CDN video URLs with local paths
 * - Remove /webflow-agency links (404)
 * - Remove unused 117556954.js preload
 */

const fs = require('fs');
const path = require('path');

const HTML_DIR = path.join(__dirname, 'html');
const HTML_FILES = fs.readdirSync(HTML_DIR)
  .filter(f => f.endsWith('.html'))
  .map(f => path.join(HTML_DIR, f));

let totalChanges = 0;

HTML_FILES.forEach(filePath => {
  const name = path.basename(filePath);
  let html = fs.readFileSync(filePath, 'utf-8');
  const original = html;
  let changes = [];

  // 1. Replace files.douro-digital.com video URLs with local paths
  // Pattern: https://files.douro-digital.com/storage/v1/object/public/Website%20Assets//FILENAME
  // Pattern: https://files.douro-digital.com/storage/v1/object/public/Website%20Assets/FILENAME
  // Pattern: https://files.douro-digital.com/storage/v1/object/public/Portfolio%20Videos//FILENAME
  // Pattern: https://files.douro-digital.com/storage/v1/object/public/Portfolio%20Videos/FILENAME
  const cdnFilesBefore = html;
  html = html.replace(
    /https:\/\/files\.douro-digital\.com\/storage\/v1\/object\/public\/[^"'\s]+/g,
    (match) => {
      const filename = decodeURIComponent(match.split('/').pop());
      return `../videos/${filename}`;
    }
  );
  if (html !== cdnFilesBefore) changes.push('Replaced files.douro-digital.com URLs');

  // Pattern: https://cdn.douro-digital.com/website/2024-assets/FILENAME
  const cdnBefore = html;
  html = html.replace(
    /https:\/\/cdn\.douro-digital\.com\/website\/[^"'\s]+/g,
    (match) => {
      const filename = decodeURIComponent(match.split('/').pop());
      return `../videos/${filename}`;
    }
  );
  if (html !== cdnBefore) changes.push('Replaced cdn.douro-digital.com URLs');

  // 2. Remove /webflow-agency nav mini-link (entire <a> block)
  const navLinkBefore = html;
  html = html.replace(
    /<a[^>]*href="\/webflow-agency"[^>]*class="c-mini-link_wrapper[^"]*"[^>]*>.*?<\/a>/g,
    ''
  );
  if (html !== navLinkBefore) changes.push('Removed /webflow-agency nav link');

  // 3. Replace inline /webflow-agency links with plain text
  const inlineLinkBefore = html;
  html = html.replace(
    /<a\s+href="\/webflow-agency"[^>]*>(.*?)<\/a>/g,
    '$1'
  );
  if (html !== inlineLinkBefore) changes.push('Unwrapped inline /webflow-agency links');

  // 4. Remove unused preload for 117556954.js
  const preloadBefore = html;
  html = html.replace(
    /<link[^>]*rel="preload"[^>]*href="[^"]*117556954\.js"[^>]*\/?>/g,
    ''
  );
  // Also try reverse attr order
  html = html.replace(
    /<link[^>]*href="[^"]*117556954\.js"[^>]*rel="preload"[^>]*\/?>/g,
    ''
  );
  if (html !== preloadBefore) changes.push('Removed 117556954.js preload');

  // 5. Remove intellimize preconnect (associated with unused 117556954)
  const preconnectBefore = html;
  html = html.replace(
    /<link[^>]*href="https:\/\/117556954\.intellimizeio\.com"[^>]*\/?>/g,
    ''
  );
  if (html !== preconnectBefore) changes.push('Removed intellimize preconnect');

  if (html !== original) {
    fs.writeFileSync(filePath, html, 'utf-8');
    totalChanges += changes.length;
    console.log(`${name}: ${changes.join(', ')}`);
  } else {
    console.log(`${name}: no changes needed`);
  }
});

console.log(`\nDone. ${totalChanges} total fixes applied across ${HTML_FILES.length} files.`);
