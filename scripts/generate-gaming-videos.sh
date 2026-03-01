#!/bin/bash
# Generate videos for all gaming examples

set -e

echo "🎬 Generating videos for gaming examples..."

EXAMPLES=(
  "examples/physics/falling-boxes"
  "examples/particles/explosion-mvp"
  "examples/animations/keyframe-cube"
  "examples/behaviors/orbiting-cube"
  "examples/particles/fire-explosion"
  "examples/animations/complex-path"
  "examples/behaviors/complex-motion"
  "examples/physics/collision-demo"
)

for example in "${EXAMPLES[@]}"; do
  echo ""
  echo "📹 Rendering: $example"
  
  if [ ! -f "$example/template.json" ]; then
    echo "⚠️  Skipping - no template.json found"
    continue
  fi
  
  # Render video using renderer-node
  cd "$example"
  
  # Create render script
  cat > render.ts << 'EOF'
import { createNodeRenderer } from '@rendervid/renderer-node';
import * as fs from 'fs';
import * as path from 'path';

async function render() {
  const template = JSON.parse(fs.readFileSync('template.json', 'utf-8'));
  
  console.log('Rendering video...');
  const renderer = createNodeRenderer();
  
  try {
    const result = await renderer.renderVideo({
      template,
      output: {
        path: 'output.mp4',
        format: 'mp4',
        quality: 'high'
      }
    });
    
    console.log('✅ Video rendered:', result.path);
    
    // Generate GIF
    console.log('Creating GIF...');
    const { execSync } = require('child_process');
    execSync(`ffmpeg -i output.mp4 -vf "fps=30,scale=640:-1:flags=lanczos" -c:v gif output.gif`, {
      stdio: 'inherit'
    });
    console.log('✅ GIF created');
    
  } catch (error) {
    console.error('❌ Render failed:', error);
    process.exit(1);
  }
}

render();
EOF
  
  # Run render
  npx tsx render.ts || echo "⚠️  Render failed for $example"
  
  # Clean up
  rm -f render.ts
  
  cd - > /dev/null
done

echo ""
echo "✅ All videos generated!"
