#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const HTML_DIR = path.resolve(__dirname, '..', 'html');

const REMOVALS = [
  // Google Tag Manager script blocks
  /<script[^>]*googletagmanager\.com[^>]*>[\s\S]*?<\/script>/gi,
  /<script[^>]*>[^<]*gtag\([^<]*<\/script>/gi,

  // Google Analytics / gtag inline
  /<script[^>]*>[^<]*function gtag[^<]*<\/script>/gi,
  /<script[^>]*>[^<]*GoogleAnalyticsObject[^<]*<\/script>/gi,

  // Ahrefs analytics
  /<script[^>]*analytics\.ahrefs\.com[^>]*><\/script>/gi,
  /<script[^>]*analytics\.ahrefs\.com[^>]*>[\s\S]*?<\/script>/gi,
  /<meta[^>]*ahrefs-site-verification[^>]*\/?>/gi,

  // Intellimize - scripts, preloads, preconnects, anti-flicker
  /<script[^>]*cdn\.intellimize\.co[^>]*>[\s\S]*?<\/script>/gi,
  /<script[^>]*>[^<]*intellimize[^<]*<\/script>/gi,
  /<link[^>]*cdn\.intellimize\.co[^>]*\/?>/gi,
  /<link[^>]*intellimize[^>]*\/?>/gi,
  /<style>[^<]*\.anti-flicker[^<]*<\/style>/gi,
  /<script[^>]*>[^<]*anti-flicker[^<]*<\/script>/gi,
  /<script[^>]*>[^<]*intellimize_opt_out[^<]*<\/script>/gi,
  /<script[^>]*>[^<]*intellimize_data_tracking[^<]*<\/script>/gi,

  // Finsweet cookie consent / components config
  /<script[^>]*finsweet[^>]*>[\s\S]*?<\/script>/gi,
  /<script[^>]*finsweetcomponentsconfig[^>]*>[\s\S]*?<\/script>/gi,
  /<script[^>]*fs-cc[^>]*>[\s\S]*?<\/script>/gi,

  // data-wf-hidden-variation style block
  /<style>\[data-wf-hidden-variation\][^<]*<\/style>/gi,
];

let totalChanged = 0;
const files = fs.readdirSync(HTML_DIR);

for (const file of files) {
  const filePath = path.join(HTML_DIR, file);
  if (fs.statSync(filePath).isDirectory()) continue;

  let content = fs.readFileSync(filePath, 'utf-8');
  const original = content;

  // Apply all removal patterns
  for (const pattern of REMOVALS) {
    // Reset lastIndex for global regexes
    pattern.lastIndex = 0;
    content = content.replace(pattern, '');
  }

  // Remove data-wf-intellimize-customer-id attribute from <html> tag
  content = content.replace(
    /\s+data-wf-intellimize-customer-id="[^"]*"/g,
    ''
  );

  // Clean up multiple blank lines left behind
  content = content.replace(/\n{3,}/g, '\n\n');

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf-8');
    totalChanged++;
    console.log(`  stripped: html/${file}`);
  }
}

console.log(`\nDone. Stripped analytics from ${totalChanged} files.`);
