/**
 * Batch export all example templates to animated SVG files.
 * Also prints a report of which templates have unsupported layers.
 *
 * Usage: npx tsx scripts/export-all-svgs.ts
 */
import { readFileSync, writeFileSync, readdirSync, statSync, existsSync } from 'fs';
import { join, relative } from 'path';
import { exportAnimatedSvg } from '../packages/core/src/export/svg-exporter';
import type { UnsupportedLayerInfo } from '../packages/core/src/export/svg-exporter';
import type { Template, Layer } from '../packages/core/src/types';

interface ExportResult {
  path: string;
  name: string;
  svgFile: string;
  unsupported: UnsupportedLayerInfo[];
  supported: number;
  totalLayers: number;
}

function findTemplates(dir: string): string[] {
  const results: string[] = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      results.push(...findTemplates(full));
    } else if (entry === 'template.json') {
      results.push(full);
    }
  }
  return results;
}

function collectLayers(layers: Layer[]): Layer[] {
  const all: Layer[] = [];
  for (const layer of layers) {
    all.push(layer);
    if (layer.type === 'group' && 'children' in layer) {
      all.push(...collectLayers((layer as any).children));
    }
  }
  return all;
}

const examplesDir = join(__dirname, '..', 'examples');
const templates = findTemplates(examplesDir).sort();

console.log(`Found ${templates.length} templates\n`);

const results: ExportResult[] = [];

for (const templatePath of templates) {
  const dir = join(templatePath, '..');
  const relPath = relative(examplesDir, dir);

  try {
    const raw = readFileSync(templatePath, 'utf-8');
    const template: Template = JSON.parse(raw);

    // Collect all layers to count totals
    const allLayers: Layer[] = [];
    for (const scene of template.composition.scenes) {
      allLayers.push(...collectLayers(scene.layers));
    }

    // Export SVG — result includes unsupported layer info
    const result = exportAnimatedSvg(template);
    const svgPath = join(dir, 'preview.svg');
    writeFileSync(svgPath, result.svg, 'utf-8');

    const unsupported = result.unsupportedLayers;
    const supported = allLayers.length - unsupported.length;

    results.push({
      path: relPath,
      name: template.name,
      svgFile: svgPath,
      unsupported,
      supported,
      totalLayers: allLayers.length,
    });

    const status = unsupported.length === 0
      ? 'OK'
      : unsupported.length === allLayers.length
        ? 'SKIP (all unsupported)'
        : `PARTIAL (${supported}/${allLayers.length} layers)`;

    console.log(`  ${status.padEnd(30)} ${relPath}`);

    if (unsupported.length > 0) {
      for (const u of unsupported) {
        console.log(`    - ${u.type}: ${u.name || u.id} — ${u.reason}`);
      }
    }
  } catch (err) {
    console.error(`  ERROR ${relPath}: ${err instanceof Error ? err.message : err}`);
  }
}

// Summary
const full = results.filter(r => r.unsupported.length === 0);
const partial = results.filter(r => r.unsupported.length > 0 && r.supported > 0);
const empty = results.filter(r => r.supported === 0);

console.log(`\n${'='.repeat(60)}`);
console.log(`SUMMARY`);
console.log(`  Total templates: ${results.length}`);
console.log(`  Full SVG support: ${full.length}`);
console.log(`  Partial support:  ${partial.length}`);
console.log(`  No supported layers: ${empty.length}`);
console.log(`  SVG files written: ${results.length}`);
