#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const variant = process.argv[2];
if (!variant) {
  console.error('Usage: node build.js <variant>');
  console.error('Example: node build.js pcos');
  process.exit(1);
}

const configPath = path.join(__dirname, 'configs', variant + '.json');
if (!fs.existsSync(configPath)) {
  console.error('Config not found: ' + configPath);
  process.exit(1);
}

const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
const template = fs.readFileSync(path.join(__dirname, 'src', 'template.html'), 'utf8');
const styles = fs.readFileSync(path.join(__dirname, 'src', 'styles.css'), 'utf8');

// Read component scripts in dependency order
const componentOrder = [
  'storage.js',
  'theme.js',
  'navigation.js',
  'settings.js',
  'quick-log.js',
  'calendar.js',
  'charts.js',
  'insights.js',
  'reports.js'
];

let scripts = '';
for (const comp of componentOrder) {
  const compPath = path.join(__dirname, 'src', 'components', comp);
  if (fs.existsSync(compPath)) {
    scripts += fs.readFileSync(compPath, 'utf8') + '\n\n';
  }
}

// Add main app.js last
const appPath = path.join(__dirname, 'src', 'app.js');
if (fs.existsSync(appPath)) {
  scripts += fs.readFileSync(appPath, 'utf8');
}

// Build the HTML
let html = template;
html = html.replace('{{APP_NAME}}', config.name);
html = html.replace('{{APP_NAME}}', config.name); // title tag instance
html = html.replace('{{STYLES}}', styles);
html = html.replace('{{CONFIG_JSON}}', JSON.stringify(config));
html = html.replace('{{SCRIPTS}}', scripts);

// Write output
const distDir = path.join(__dirname, 'dist');
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

const outPath = path.join(distDir, variant + '.html');
fs.writeFileSync(outPath, html, 'utf8');

const sizeKB = (Buffer.byteLength(html, 'utf8') / 1024).toFixed(1);
console.log('Built: ' + outPath);
console.log('Size: ' + sizeKB + ' KB');

if (parseFloat(sizeKB) > 250) {
  console.error('WARNING: File exceeds 250KB limit!');
  process.exit(1);
}

console.log('Done.');
