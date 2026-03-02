import { createNodeRenderer } from '../packages/renderer-node/src/index';
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';

const examples = [
  'examples/physics/falling-boxes/template.json',
  'examples/particles/explosion-mvp/template.json',
  'examples/animations/keyframe-cube/template.json',
  'examples/behaviors/orbiting-cube/template.json',
];

async function renderExample(templatePath: string) {
  console.log(`\n📹 Rendering: ${templatePath}`);
  
  const template = JSON.parse(readFileSync(templatePath, 'utf-8'));
  const dir = dirname(templatePath);
  const outputPath = join(dir, 'output.mp4');
  
  const renderer = createNodeRenderer({
    playwrightOptions: {
      headless: false // Enable WebGL by running visible browser
    }
  });
  
  await renderer.renderVideo({
    template,
    outputPath,
    quality: 23
  });
  
  console.log(`✅ ${outputPath}`);
}

async function main() {
  console.log('🎬 Rendering gaming examples with visible browser (WebGL enabled)\n');
  
  for (const example of examples) {
    await renderExample(example);
  }
  
  console.log('\n✅ All examples rendered!');
}

main().catch(console.error);
