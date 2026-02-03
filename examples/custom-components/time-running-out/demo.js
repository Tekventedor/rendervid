#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Load the template
const templatePath = path.join(__dirname, 'time-running-out.json');
const template = JSON.parse(fs.readFileSync(templatePath, 'utf-8'));

console.log('═══════════════════════════════════════════════════════════════');
console.log('  Time Running Out - Custom Component Demo');
console.log('═══════════════════════════════════════════════════════════════\n');

console.log('📋 Template Details:');
console.log('  Name:', template.name);
console.log('  Description:', template.description);
console.log('  Resolution:', `${template.output.width}x${template.output.height}`);
console.log('  FPS:', template.output.fps);
console.log('  Duration:', `${template.output.duration}s`);
console.log('  Total Frames:', template.output.fps * template.output.duration);

console.log('\n🎨 Custom Components:');
Object.entries(template.customComponents || {}).forEach(([name, def]) => {
  console.log(`  • ${name} (${def.type})`);
  console.log(`    Description: ${def.description || 'N/A'}`);
  if (def.type === 'inline') {
    console.log(`    Code Length: ${def.code.length} characters`);
  }
});

console.log('\n🎬 Scene Composition:');
console.log(`  Scenes: ${template.composition.scenes.length}`);
console.log(`  Total Layers: ${template.composition.scenes[0].layers.length}`);
console.log('  Layers:');
template.composition.scenes[0].layers.forEach(layer => {
  const typeInfo = layer.type === 'custom'
    ? `custom (${layer.customComponent.name})`
    : layer.type;
  console.log(`    • ${layer.id}: ${typeInfo}`);
  if (layer.type === 'custom') {
    console.log(`      Props: ${JSON.stringify(layer.customComponent.props)}`);
  }
});

console.log('\n🔧 Custom Component Code Preview:');
console.log('─────────────────────────────────────────────────────────────');
const clockCode = template.customComponents.FastClock.code;
// Format the code for display (add line breaks at logical points)
const formattedCode = clockCode
  .replace(/function FastClock\(props\) \{/, 'function FastClock(props) {\n  ')
  .replace(/const /g, '\n  const ')
  .replace(/for \(let/g, '\n  for (let')
  .replace(/return React\.createElement/g, '\n  return React.createElement')
  .replace(/\}\}/g, '}\n}')
  .slice(0, 800); // Show first 800 chars
console.log(formattedCode + '\n  ...[truncated]...\n}');
console.log('─────────────────────────────────────────────────────────────');

console.log('\n✨ Features Demonstrated:');
console.log('  ✓ Inline custom component with React code');
console.log('  ✓ Frame-based animation (time calculation)');
console.log('  ✓ SVG rendering (analog clock face)');
console.log('  ✓ Component reusability (same clock, different colors)');
console.log('  ✓ Props customization (speed, color)');
console.log('  ✓ Integration with built-in layers (text, shapes)');
console.log('  ✓ Animations (entrance effects, pulse)');
console.log('  ✓ Layered composition (6 layers total)');

console.log('\n📊 Performance Specs:');
console.log(`  • Clock Speed: 20x real-time`);
console.log(`  • Frame Rate: 60 FPS (smooth animation)`);
console.log(`  • Total Render: 480 frames`);
console.log(`  • Components: 2 clocks + 2 text layers + 2 glow effects`);

console.log('\n🎯 Usage:');
console.log('  This template demonstrates the power of inline custom components.');
console.log('  The FastClock component is defined as React code directly in the');
console.log('  template and can be used multiple times with different props.');
console.log('');
console.log('  To render this video, use:');
console.log('    pnpm --filter @rendervid/renderer-browser run demo');
console.log('  or integrate with the MCP server:');
console.log('    render_video tool with this template');

console.log('\n═══════════════════════════════════════════════════════════════\n');
