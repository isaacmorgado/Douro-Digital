#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const FILES = [
  'html/ai-consulting.html',
  'html/ai-solutions.html',
  'html/custom-development.html'
];

const VIDEO_REPLACEMENTS = {
  'https://files.douro-digital.com/storage/v1/object/public/Website%20Assets//venture.webm': '../videos/venture.webm',
  'https://files.douro-digital.com/storage/v1/object/public/Portfolio%20Videos//goodroots-169.webm': '../videos/goodroots-169.webm',
  'https://files.douro-digital.com/storage/v1/object/public/Portfolio%20Videos/brightwave-169.webm': '../videos/brightwave-169.webm',
  'https://files.douro-digital.com/storage/v1/object/public/Portfolio%20Videos/allvoices-169.webm': '../videos/allvoices-169.webm',
  'https://files.douro-digital.com/storage/v1/object/public/Portfolio%20Videos/maniv-169.webm': '../videos/maniv-169.webm',
  'https://cdn.douro-digital.com/website/2024-assets/stripes-large.webm': '../videos/stripes-large.webm'
};

const SCRIPT_REPLACEMENTS = {
  'https://js.douro-digital.com': '../js'
};

FILES.forEach(file => {
  const filePath = path.join('/Users/imorgado/downloaded_sites', file);
  let html = fs.readFileSync(filePath, 'utf-8');

  console.log(`\nProcessing: ${file}`);

  // Replace video URLs
  Object.entries(VIDEO_REPLACEMENTS).forEach(([old, newPath]) => {
    if (html.includes(old)) {
      html = html.replace(new RegExp(old, 'g'), newPath);
      console.log(`  ✓ Replaced video: ${old.split('/').pop()}`);
    }
  });

  // Replace script URLs
  Object.entries(SCRIPT_REPLACEMENTS).forEach(([old, newPath]) => {
    if (html.includes(old)) {
      html = html.replace(new RegExp(old, 'g'), newPath);
      console.log(`  ✓ Replaced script URL: ${old}`);
    }
  });

  // Remove webflow-tools reference (not needed)
  if (html.includes('webflow-tools.douro-digital.com')) {
    html = html.replace(/https:\/\/www\.webflow-tools\.douro-digital\.com\//g, '');
    console.log(`  ✓ Removed webflow-tools reference`);
  }

  fs.writeFileSync(filePath, html, 'utf-8');
  console.log(`  ✓ Saved`);
});

console.log('\n✅ All external URLs replaced with local paths!\n');
