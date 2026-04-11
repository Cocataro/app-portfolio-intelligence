#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// --- CLI parsing ---
const args = process.argv.slice(2);
const flags = new Set(args.filter(a => a.startsWith('--')));
const variant = args.find(a => !a.startsWith('--'));

if (!variant) {
  console.error('Usage: node ship.js <variant> [flags]');
  console.error('Example: node ship.js pcos');
  console.error('Flags: --build-only --mockups-only --pdf-only --listing-only --deploy-only');
  process.exit(1);
}

const configPath = path.join(__dirname, 'configs', variant + '.json');
if (!fs.existsSync(configPath)) {
  console.error('Config not found: ' + configPath);
  process.exit(1);
}

const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
const distDir = path.join(__dirname, 'dist');
const htmlPath = path.join(distDir, variant + '.html');

const runAll = flags.size === 0;
const shouldRun = (flag) => runAll || flags.has(flag);

// --- Helpers ---
function banner(step, label) {
  console.log('\n' + '='.repeat(50));
  console.log(`  Step ${step}: ${label}`);
  console.log('='.repeat(50));
}

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

// --- Step 1: Build ---
async function stepBuild() {
  banner(1, 'Build');
  try {
    const output = execSync(`node "${path.join(__dirname, 'build.js')}" ${variant}`, {
      encoding: 'utf8',
      cwd: __dirname
    });
    console.log(output.trim());
    if (!fs.existsSync(htmlPath)) {
      throw new Error('Build output not found: ' + htmlPath);
    }
    console.log('Build: OK');
  } catch (err) {
    console.error('Build failed:', err.message);
    process.exit(1);
  }
}

// --- Step 2: Mockups ---
async function stepMockups() {
  banner(2, 'Mockups');

  let puppeteer;
  try {
    puppeteer = require('puppeteer');
  } catch {
    console.log('Puppeteer not installed. Skipping mockups.');
    return;
  }

  const mockupDir = path.join(distDir, 'mockups');
  ensureDir(mockupDir);

  const views = [
    { name: 'quick-log', nav: 'log' },
    { name: 'calendar', nav: 'calendar' },
    { name: 'charts', nav: 'charts' }
  ];

  const sizes = [
    { name: 'desktop', width: 1280, height: 800 },
    { name: 'mobile', width: 375, height: 812 }
  ];

  let browser;
  try {
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
    });
  } catch (err) {
    console.log('Chrome not available. Skipping mockups.');
    console.log('  (Install Chrome/Chromium system dependencies to enable mockups)');
    return;
  }

  try {
    for (const size of sizes) {
      for (const view of views) {
        const page = await browser.newPage();
        await page.setViewport({ width: size.width, height: size.height });
        await page.goto('file://' + htmlPath, { waitUntil: 'networkidle0' });

        // Navigate to the target view by clicking its nav button
        await page.evaluate((navId) => {
          const btn = document.querySelector(`[data-view="${navId}"]`);
          if (btn) btn.click();
        }, view.nav);

        // Wait for view to render
        await new Promise(r => setTimeout(r, 500));

        const filename = `${variant}-${view.name}-${size.name}.png`;
        await page.screenshot({
          path: path.join(mockupDir, filename),
          fullPage: false
        });
        console.log('  Screenshot: ' + filename);
        await page.close();
      }
    }
    console.log('Mockups: OK (' + (views.length * sizes.length) + ' screenshots)');
  } finally {
    await browser.close();
  }
}

// --- Step 3: PDF Instructions ---
async function stepPdf() {
  banner(3, 'PDF Instructions');

  let puppeteer;
  try {
    puppeteer = require('puppeteer');
  } catch {
    console.log('Puppeteer not installed. Skipping PDF.');
    return;
  }

  let browser;
  try {
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
    });
  } catch {
    console.log('Chrome not available. Skipping PDF.');
    return;
  }

  try {
    const page = await browser.newPage();

    const pdfHtml = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif; color: #2D2A2E; line-height: 1.5; padding: 40px; max-width: 700px; margin: 0 auto; }
  h1 { font-size: 22px; color: ${config.theme.primary}; margin-bottom: 6px; }
  h2 { font-size: 16px; color: ${config.theme.primaryDark}; margin-top: 22px; margin-bottom: 8px; border-bottom: 1px solid #ddd; padding-bottom: 4px; }
  p, li { font-size: 13px; margin-bottom: 4px; }
  ul { padding-left: 20px; }
  .tagline { font-size: 14px; color: #6B636B; margin-bottom: 16px; }
  .disclaimer { margin-top: 20px; padding: 10px; background: #f5f5f5; border-radius: 6px; font-size: 11px; color: #888; }
  .footer { margin-top: 16px; text-align: center; font-size: 11px; color: #aaa; }
</style>
</head>
<body>
  <h1>${config.name}</h1>
  <p class="tagline">${config.tagline}</p>

  <h2>How to use your tracker</h2>
  <ul>
    <li><strong>Quick Log:</strong> Tap symptom buttons, set your pain level, add triggers, medications, and notes. Hit Save. Takes under 30 seconds.</li>
    <li><strong>Calendar:</strong> See your month at a glance. Days are color-coded by pain level. Tap any day to view or edit that entry.</li>
    <li><strong>Charts:</strong> After a few days of logging, see pain trends, symptom frequency, and trigger-symptom patterns as visual charts.</li>
    <li><strong>Insights:</strong> After 7+ days of data, get plain-English observations about your patterns — what triggers correlate with symptoms, medication impact, and cycle patterns.</li>
    <li><strong>Reports:</strong> Generate a printable summary for your doctor, export your data as CSV, or back up/restore as JSON.</li>
  </ul>

  <h2>How to back up your data</h2>
  <ul>
    <li>Go to the <strong>Reports</strong> view and tap <strong>Export JSON Backup</strong>.</li>
    <li>Save the downloaded file somewhere safe (cloud drive, USB, email to yourself).</li>
    <li>To restore, tap <strong>Import JSON Backup</strong> and select your file.</li>
    <li>Your data never leaves your device unless you export it yourself.</li>
  </ul>

  <h2>FAQ</h2>
  <ul>
    <li><strong>Is my data private?</strong> Yes. Everything is stored only on your device in your browser's local storage. No accounts, no cloud, no tracking.</li>
    <li><strong>What if I clear my browser data?</strong> Your tracker data will be lost. Use the JSON backup feature regularly.</li>
    <li><strong>Can I use this on my phone?</strong> Yes. Open the HTML file in any modern browser. It is fully responsive.</li>
    <li><strong>Does this work offline?</strong> Yes. Once opened, it works without any internet connection.</li>
    <li><strong>Can I share my data with my doctor?</strong> Yes. Use the Reports view to generate a printable summary or CSV export.</li>
  </ul>

  <div class="disclaimer">
    <strong>Medical Disclaimer:</strong> This tracker is for personal wellness logging only. It does not provide medical advice, diagnosis, or treatment. Always consult a qualified healthcare provider for medical decisions.
  </div>

  <p class="footer">${config.name} &mdash; Your data stays on your device.</p>
</body>
</html>`;

    await page.setContent(pdfHtml, { waitUntil: 'networkidle0' });

    const pdfPath = path.join(distDir, variant + '-instructions.pdf');
    await page.pdf({
      path: pdfPath,
      format: 'Letter',
      printBackground: true,
      margin: { top: '0.4in', bottom: '0.4in', left: '0.5in', right: '0.5in' }
    });

    const sizeKB = (fs.statSync(pdfPath).size / 1024).toFixed(1);
    console.log('  PDF: ' + pdfPath + ' (' + sizeKB + ' KB)');
    console.log('PDF: OK');
    await page.close();
  } finally {
    await browser.close();
  }
}

// --- Step 4: Listing Copy ---
function stepListing() {
  banner(4, 'Listing Copy');

  const symptoms = config.symptoms.slice(0, 6).join(', ');
  const triggers = config.triggers.slice(0, 4).join(', ');
  const meds = config.medications.slice(0, 4).join(', ');

  // Build SEO keywords (13+)
  const keywords = [
    config.variant.toUpperCase(),
    config.variant.toUpperCase() + ' tracker',
    'symptom tracker',
    'health tracker',
    'wellness tracker',
    'period tracker',
    'cycle tracker',
    'pain tracker',
    'digital health',
    'privacy health app',
    'offline tracker',
    'no account health',
    'symptom diary',
    'medication tracker',
    'trigger tracker'
  ];

  const listing = `${config.name}
${config.tagline}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

WHAT YOU GET
• One HTML file — your complete ${config.name}
• Works in any browser (Chrome, Firefox, Safari, Edge)
• One-page PDF instruction guide
• Lifetime use, no subscriptions

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

FEATURES
• Quick daily logging — symptoms, pain level, triggers, medications, and notes in under 30 seconds
• Calendar view — color-coded month grid to spot patterns at a glance
• Charts & visualizations — pain trends, symptom frequency bars, trigger-symptom heatmap
• Smart Insights — plain-English pattern analysis after 7+ days of data
• Doctor-ready reports — printable summaries with date ranges and trends
• CSV export — your data in spreadsheet format
• JSON backup & restore — never lose your data

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

TRACKS
• Symptoms: ${symptoms}, and more
• Triggers: ${triggers}, and more
• Medications: ${meds}, and more
• Pain level (0-10 scale)
• Cycle phases and day tracking
• Free-form notes

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PRIVACY PROMISE
Your data is stored ONLY on your device. This tracker:
✓ Has no accounts or logins
✓ Makes zero network requests
✓ Never sends data anywhere
✓ Works completely offline
✓ Requires no app installation

Your health data belongs to you. Period.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

HOW IT WORKS
1. Download the HTML file
2. Open it in your browser
3. Start logging — that's it!

Your data saves automatically in your browser's local storage. Back up anytime with the built-in JSON export.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

DESIGN
• Beautiful, calm interface — no guilt, no streaks, no gamification
• Dark mode (auto-detects your system preference + manual toggle)
• Fully responsive — works on phone, tablet, and desktop
• Accessible — keyboard navigation, screen reader support, WCAG AA contrast

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

FAQ
Q: Is my data safe?
A: Yes. Everything stays in your browser. Nothing is ever sent online.

Q: What if I clear my browser?
A: Use the JSON backup feature to save your data. You can restore it anytime.

Q: Can I use this on multiple devices?
A: Yes — use JSON export/import to transfer data between devices.

Q: Do I need internet to use this?
A: No. Once you open the file, it works completely offline.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

MEDICAL DISCLAIMER
This tracker is for personal wellness logging only. It does not provide medical advice, diagnosis, or treatment. Always consult a qualified healthcare provider for medical decisions.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Keywords: ${keywords.join(', ')}
`;

  const listingPath = path.join(distDir, 'listing-' + variant + '.txt');
  fs.writeFileSync(listingPath, listing, 'utf8');

  const keywordCount = keywords.length;
  console.log('  Listing: ' + listingPath);
  console.log('  SEO keywords: ' + keywordCount);
  if (keywordCount < 13) {
    console.error('  WARNING: Less than 13 SEO keywords!');
  }
  console.log('Listing: OK');
}

// --- Step 5: Deploy ---
async function stepDeploy() {
  banner(5, 'Deploy');

  // Check for Vercel CLI
  try {
    execSync('which vercel', { encoding: 'utf8', stdio: 'pipe' });
  } catch {
    console.log('Vercel CLI not found. Skipping deploy.');
    console.log('  Install with: npm i -g vercel');
    return;
  }

  // Check for Vercel token
  const hasToken = process.env.VERCEL_TOKEN || false;
  if (!hasToken) {
    try {
      // Try deploying with existing auth
      const output = execSync(`vercel deploy --prod "${distDir}" --yes`, {
        encoding: 'utf8',
        cwd: __dirname,
        timeout: 120000
      });
      console.log(output.trim());
      console.log('Deploy: OK');
    } catch (err) {
      console.log('Deploy failed (auth may be needed). Skipping.');
      console.log('  Run: vercel login');
    }
  } else {
    try {
      const output = execSync(
        `vercel deploy --prod "${distDir}" --yes --token "${process.env.VERCEL_TOKEN}"`,
        { encoding: 'utf8', cwd: __dirname, timeout: 120000 }
      );
      console.log(output.trim());
      console.log('Deploy: OK');
    } catch (err) {
      console.error('Deploy failed:', err.message);
    }
  }
}

// --- Main ---
async function main() {
  console.log('Shipping: ' + config.name + ' (' + variant + ')');
  console.log('Time: ' + new Date().toISOString());

  const steps = [];
  if (shouldRun('--build-only')) steps.push(stepBuild);
  if (shouldRun('--mockups-only')) steps.push(stepMockups);
  if (shouldRun('--pdf-only')) steps.push(stepPdf);
  if (shouldRun('--listing-only')) steps.push(stepListing);
  if (shouldRun('--deploy-only')) steps.push(stepDeploy);

  for (const step of steps) {
    await step();
  }

  console.log('\n' + '='.repeat(50));
  console.log('  Ship complete!');
  console.log('='.repeat(50));
  console.log('Output: ' + distDir);
}

main().catch(err => {
  console.error('Ship failed:', err.message);
  process.exit(1);
});
