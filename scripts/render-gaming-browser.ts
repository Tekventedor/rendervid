#!/usr/bin/env node
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import puppeteer from 'puppeteer';

const examples = [
  'examples/physics/falling-boxes/template.json',
  'examples/particles/explosion-mvp/template.json',
  'examples/animations/keyframe-cube/template.json',
  'examples/behaviors/orbiting-cube/template.json',
];

async function renderExample(templatePath: string) {
  console.log(`\n📹 Rendering: ${templatePath}`);
  
  const template = JSON.parse(readFileSync(templatePath, 'utf-8'));
  
  const browser = await puppeteer.launch({
    headless: false, // Run with visible browser for WebGL
    args: ['--enable-gpu', '--enable-webgl']
  });
  
  const page = await browser.newPage();
  
  // Load renderer page
  await page.goto('http://localhost:5181'); // Player playground
  
  // Wait for render to complete
  await page.waitForTimeout(template.output.duration * 1000 + 2000);
  
  await browser.close();
  
  console.log(`✅ Rendered ${templatePath}`);
}

async function main() {
  console.log('Start player playground first: cd packages/player-playground && pnpm dev');
  console.log('Press Enter when ready...');
  
  for (const example of examples) {
    await renderExample(example);
  }
}

main().catch(console.error);

