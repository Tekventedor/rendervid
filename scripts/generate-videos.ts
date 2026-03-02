import { createNodeRenderer } from '@rendervid/renderer-node';
import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

const EXAMPLES = [
  'examples/physics/falling-boxes',
  'examples/particles/explosion-mvp',
  'examples/animations/keyframe-cube',
  'examples/behaviors/orbiting-cube',
  'examples/particles/fire-explosion',
  'examples/animations/complex-path',
  'examples/behaviors/complex-motion',
  'examples/physics/collision-demo',
];

async function generateVideo(examplePath: string) {
  console.log(`\n📹 Rendering: ${examplePath}`);
  
  const templatePath = path.join(examplePath, 'template.json');
  const outputPath = path.join(examplePath, 'output.mp4');
  const gifPath = path.join(examplePath, 'output.gif');
  
  if (!fs.existsSync(templatePath)) {
    console.log(`⚠️  Skipping - no template.json found`);
    return;
  }
  
  try {
    const template = JSON.parse(fs.readFileSync(templatePath, 'utf-8'));
    
    console.log('  Creating renderer...');
    const renderer = createNodeRenderer();
    
    console.log('  Rendering video...');
    await renderer.renderVideo({
      template,
      output: {
        path: outputPath,
        format: 'mp4',
        quality: 'high',
      },
    });
    
    console.log(`  ✅ Video saved: ${outputPath}`);
    
    // Generate GIF
    console.log('  Creating GIF...');
    execSync(
      `ffmpeg -y -i "${outputPath}" -vf "fps=15,scale=640:-1:flags=lanczos" -c:v gif "${gifPath}"`,
      { stdio: 'pipe' }
    );
    console.log(`  ✅ GIF saved: ${gifPath}`);
    
  } catch (error) {
    console.error(`  ❌ Failed:`, error instanceof Error ? error.message : error);
  }
}

async function main() {
  console.log('🎬 Generating videos for gaming examples...\n');
  
  for (const example of EXAMPLES) {
    await generateVideo(example);
  }
  
  console.log('\n✅ All videos generated!');
}

main().catch(console.error);
