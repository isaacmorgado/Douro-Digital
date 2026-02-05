#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const FILES = [
  'html/ai-consulting.html',
  'html/ai-solutions.html',
  'html/custom-development.html'
];

const OVERRIDE_CSS_LINK = '<link href="../css/douro-digital-overrides.css" rel="stylesheet" type="text/css">';

FILES.forEach(file => {
  const filePath = path.join('/Users/imorgado/downloaded_sites', file);
  let html = fs.readFileSync(filePath, 'utf-8');

  // Inject the override CSS after the main CSS
  if (!html.includes('douro-digital-overrides.css')) {
    html = html.replace(
      /(<link href="\.\.\/css\/refokus-24-new\.shared[^"]+\.min\.css"[^>]+>)/,
      `$1\n${OVERRIDE_CSS_LINK}`
    );

    fs.writeFileSync(filePath, html, 'utf-8');
    console.log(`✓ Injected overrides into ${file}`);
  } else {
    console.log(`  Already has overrides: ${file}`);
  }
});

console.log('\nAll files updated with WCAG accessibility overrides!');
