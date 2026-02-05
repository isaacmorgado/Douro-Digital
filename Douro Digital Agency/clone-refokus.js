#!/usr/bin/env node

/**
 * Refokus Page Cloner
 * Clones Refokus service pages with all assets for Douro Digital
 */

const puppeteer = require('puppeteer');
const fs = require('fs').promises;
const path = require('path');
const https = require('https');
const http = require('http');
const { URL } = require('url');

const PAGES_TO_CLONE = [
  {
    url: 'https://www.refokus.com/branding',
    output: 'html/ai-consulting.html',
    service: 'AI Consulting',
    hero: {
      title: 'AI Strategy That Ships',
      description: 'From use-case identification to production deployment. AI roadmap, integration strategy, team training, and governance frameworks.'
    }
  },
  {
    url: 'https://www.refokus.com/creative-development',
    output: 'html/ai-solutions.html',
    service: 'AI Solutions',
    hero: {
      title: 'AI solutions that automate your business and crush the competition.',
      description: 'Custom AI integrations, intelligent agents, and automated workflows that eliminate manual work and scale your operations.'
    }
  },
  {
    url: 'https://www.refokus.com/webflow-development',
    output: 'html/custom-development.html',
    service: 'Custom Development',
    hero: {
      title: 'Custom Software. Your Infrastructure. Your Terms.',
      description: '100% ownership. 60% average cost reduction vs SaaS alternatives. Zero vendor lock-in. Switch, scale, or sell on your terms.'
    }
  }
];

const BASE_DIR = '/Users/imorgado/downloaded_sites';
const ASSET_DIRS = {
  css: path.join(BASE_DIR, 'css'),
  js: path.join(BASE_DIR, 'js'),
  images: path.join(BASE_DIR, 'images'),
  videos: path.join(BASE_DIR, 'videos'),
  fonts: path.join(BASE_DIR, 'fonts')
};

// Track downloaded assets to avoid duplicates
const downloadedAssets = new Set();

async function downloadFile(url, outputPath) {
  if (downloadedAssets.has(url)) {
    console.log(`  ↳ Already downloaded: ${path.basename(outputPath)}`);
    return;
  }

  return new Promise((resolve, reject) => {
    const proto = url.startsWith('https') ? https : http;

    proto.get(url, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        downloadFile(response.headers.location, outputPath).then(resolve).catch(reject);
        return;
      }

      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download ${url}: ${response.statusCode}`));
        return;
      }

      const fileStream = require('fs').createWriteStream(outputPath);
      response.pipe(fileStream);

      fileStream.on('finish', () => {
        fileStream.close();
        downloadedAssets.add(url);
        console.log(`  ✓ Downloaded: ${path.basename(outputPath)}`);
        resolve();
      });

      fileStream.on('error', reject);
    }).on('error', reject);
  });
}

async function extractAndDownloadAssets(html, baseUrl) {
  const assets = {
    css: [],
    js: [],
    images: [],
    videos: [],
    fonts: []
  };

  // Extract CSS links
  const cssRegex = /<link[^>]+href="([^"]+\.css[^"]*)"/gi;
  let match;
  while ((match = cssRegex.exec(html)) !== null) {
    const url = new URL(match[1], baseUrl).href;
    assets.css.push(url);
  }

  // Extract JS scripts
  const jsRegex = /<script[^>]+src="([^"]+\.js[^"]*)"/gi;
  while ((match = jsRegex.exec(html)) !== null) {
    const url = new URL(match[1], baseUrl).href;
    assets.js.push(url);
  }

  // Extract images
  const imgRegex = /<img[^>]+src="([^"]+)"/gi;
  while ((match = imgRegex.exec(html)) !== null) {
    const url = new URL(match[1], baseUrl).href;
    if (url.match(/\.(jpg|jpeg|png|gif|svg|webp)$/i)) {
      assets.images.push(url);
    }
  }

  // Extract videos
  const videoRegex = /<(?:video|source)[^>]+src="([^"]+)"/gi;
  while ((match = videoRegex.exec(html)) !== null) {
    const url = new URL(match[1], baseUrl).href;
    assets.videos.push(url);
  }

  // Extract background images from inline styles
  const bgRegex = /url\(['"]?([^'"()]+)['"]?\)/gi;
  while ((match = bgRegex.exec(html)) !== null) {
    try {
      const url = new URL(match[1], baseUrl).href;
      if (url.match(/\.(jpg|jpeg|png|gif|svg|webp)$/i)) {
        assets.images.push(url);
      }
    } catch (e) {
      // Skip invalid URLs
    }
  }

  console.log('\nAssets found:');
  console.log(`  CSS files: ${assets.css.length}`);
  console.log(`  JS files: ${assets.js.length}`);
  console.log(`  Images: ${assets.images.length}`);
  console.log(`  Videos: ${assets.videos.length}`);

  // Download assets
  console.log('\nDownloading assets...');

  for (const url of assets.css) {
    try {
      const filename = path.basename(new URL(url).pathname);
      await downloadFile(url, path.join(ASSET_DIRS.css, filename));
    } catch (e) {
      console.error(`  ✗ Failed to download CSS: ${url}`, e.message);
    }
  }

  for (const url of assets.js) {
    try {
      const filename = path.basename(new URL(url).pathname);
      await downloadFile(url, path.join(ASSET_DIRS.js, filename));
    } catch (e) {
      console.error(`  ✗ Failed to download JS: ${url}`, e.message);
    }
  }

  for (const url of assets.images) {
    try {
      const filename = path.basename(new URL(url).pathname);
      await downloadFile(url, path.join(ASSET_DIRS.images, filename));
    } catch (e) {
      console.error(`  ✗ Failed to download image: ${url}`, e.message);
    }
  }

  for (const url of assets.videos) {
    try {
      const filename = path.basename(new URL(url).pathname);
      await downloadFile(url, path.join(ASSET_DIRS.videos, filename));
    } catch (e) {
      console.error(`  ✗ Failed to download video: ${url}`, e.message);
    }
  }

  return assets;
}

function rewriteUrls(html) {
  let modified = html;

  // Rewrite CSS URLs to local
  modified = modified.replace(
    /href="https:\/\/cdn\.prod\.website-files\.com\/[^"]+\/css\/([^"]+\.css[^"]*)"/gi,
    'href="../css/$1"'
  );

  // Rewrite JS URLs to local
  modified = modified.replace(
    /src="https:\/\/cdn\.prod\.website-files\.com\/[^"]+\/js\/([^"]+\.js[^"]*)"/gi,
    'src="../js/$1"'
  );

  // Rewrite other JS URLs
  modified = modified.replace(
    /src="https:\/\/[^"]+refokus[^"]+\.js"/gi,
    (match) => {
      const filename = path.basename(match.replace(/"/g, ''));
      return `src="../js/${filename}"`;
    }
  );

  // Rewrite image URLs
  modified = modified.replace(
    /src="https:\/\/cdn\.prod\.website-files\.com\/[^"]+\/([^"]+\.(jpg|jpeg|png|gif|svg|webp))"/gi,
    'src="../images/$1"'
  );

  // Rewrite video URLs
  modified = modified.replace(
    /src="https:\/\/cdn\.prod\.website-files\.com\/[^"]+\/([^"]+\.(mp4|webm))"/gi,
    'src="../videos/$1"'
  );

  // Rewrite background image URLs in inline styles
  modified = modified.replace(
    /url\(['"]?https:\/\/cdn\.prod\.website-files\.com\/[^'"]+\/([^'"()]+\.(jpg|jpeg|png|gif|svg|webp))['"]?\)/gi,
    'url(../images/$1)'
  );

  return modified;
}

function rebrandPage(html, pageConfig) {
  let modified = html;

  // Replace Refokus with Douro Digital
  modified = modified.replace(/Refokus/g, 'Douro Digital');
  modified = modified.replace(/refokus/g, 'douro-digital');
  modified = modified.replace(/www\.refokus\.com/g, 'www.dourodigital.com');

  // Update meta tags
  modified = modified.replace(
    /<title>[^<]*<\/title>/i,
    `<title>${pageConfig.service} | Douro Digital</title>`
  );

  // Try to update hero section (this is fragile and may need manual adjustment)
  // We'll do a best-effort replacement

  return modified;
}

function removeProblematicScripts(html) {
  let modified = html;

  // Remove Intellimize scripts
  modified = modified.replace(
    /<script[^>]*intellimize[^>]*>[\s\S]*?<\/script>/gi,
    ''
  );

  // Remove anti-flicker CSS
  modified = modified.replace(
    /<style[^>]*anti-flicker[^>]*>[\s\S]*?<\/style>/gi,
    ''
  );

  // Remove external analytics
  modified = modified.replace(
    /<script[^>]*google-analytics[^>]*>[\s\S]*?<\/script>/gi,
    ''
  );
  modified = modified.replace(
    /<script[^>]*gtag[^>]*>[\s\S]*?<\/script>/gi,
    ''
  );

  return modified;
}

async function clonePage(pageConfig) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`Cloning: ${pageConfig.url}`);
  console.log(`Output: ${pageConfig.output}`);
  console.log(`${'='.repeat(60)}\n`);

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();

    // Set viewport
    await page.setViewport({ width: 1920, height: 1080 });

    console.log('Loading page...');
    await page.goto(pageConfig.url, {
      waitUntil: 'networkidle0',
      timeout: 60000
    });

    console.log('Waiting for content to render...');
    await new Promise(resolve => setTimeout(resolve, 3000));

    console.log('Extracting HTML...');
    let html = await page.content();

    console.log('Extracting and downloading assets...');
    await extractAndDownloadAssets(html, pageConfig.url);

    console.log('Rewriting URLs to local paths...');
    html = rewriteUrls(html);

    console.log('Removing problematic scripts...');
    html = removeProblematicScripts(html);

    console.log('Rebranding page...');
    html = rebrandPage(html, pageConfig);

    console.log('Saving HTML...');
    const outputPath = path.join(BASE_DIR, pageConfig.output);
    await fs.writeFile(outputPath, html, 'utf-8');

    console.log(`✓ Successfully cloned to: ${outputPath}`);

  } catch (error) {
    console.error(`✗ Error cloning page: ${error.message}`);
    throw error;
  } finally {
    await browser.close();
  }
}

async function main() {
  console.log('Refokus → Douro Digital Page Cloner');
  console.log('====================================\n');

  // Create asset directories
  console.log('Creating asset directories...');
  for (const dir of Object.values(ASSET_DIRS)) {
    await fs.mkdir(dir, { recursive: true });
    console.log(`  ✓ ${dir}`);
  }

  // Clone each page
  for (const pageConfig of PAGES_TO_CLONE) {
    await clonePage(pageConfig);
  }

  console.log('\n' + '='.repeat(60));
  console.log('All pages cloned successfully!');
  console.log('='.repeat(60));
  console.log('\nNext steps:');
  console.log('1. Update hero sections manually if needed');
  console.log('2. Test pages in browser');
  console.log('3. Apply WCAG accessibility fixes');
}

main().catch(console.error);
