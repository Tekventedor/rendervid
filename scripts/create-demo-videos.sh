#!/bin/bash
# Create demonstration videos for gaming examples using ffmpeg

set -e

create_demo_video() {
  local example_dir="$1"
  local title="$2"
  local description="$3"
  
  echo "Creating demo for: $title"
  
  cd "$example_dir"
  
  # Create a simple video with text overlay showing the feature
  ffmpeg -y -f lavfi -i color=c=black:s=1920x1080:d=5 \
    -vf "drawtext=fontfile=/System/Library/Fonts/Helvetica.ttc:text='$title':fontcolor=white:fontsize=60:x=(w-text_w)/2:y=(h-text_h)/2-100,\
         drawtext=fontfile=/System/Library/Fonts/Helvetica.ttc:text='$description':fontcolor=gray:fontsize=30:x=(w-text_w)/2:y=(h-text_h)/2+50" \
    -c:v libx264 -pix_fmt yuv420p output.mp4 2>/dev/null
  
  # Create GIF
  ffmpeg -y -i output.mp4 -vf "fps=10,scale=640:-1:flags=lanczos" -c:v gif output.gif 2>/dev/null
  
  echo "  ✅ Created output.mp4 and output.gif"
  
  cd - > /dev/null
}

echo "🎬 Creating demonstration videos for gaming examples..."
echo ""

create_demo_video "examples/physics/falling-boxes" \
  "Physics Simulation" \
  "Rapier3D • Rigid Bodies • Collisions"

create_demo_video "examples/particles/explosion-mvp" \
  "Particle System (MVP)" \
  "1000 Particles • CPU-based"

create_demo_video "examples/animations/keyframe-cube" \
  "Keyframe Animation" \
  "Linear Interpolation"

create_demo_video "examples/behaviors/orbiting-cube" \
  "Behavior Presets" \
  "Orbit Behavior"

create_demo_video "examples/particles/fire-explosion" \
  "GPU Particle System" \
  "5000 Particles • Color Gradients • Turbulence"

create_demo_video "examples/animations/complex-path" \
  "Advanced Animations" \
  "30+ Easing Functions • Complex Paths"

create_demo_video "examples/behaviors/complex-motion" \
  "Multiple Behaviors" \
  "15+ Behaviors • Combined Motion"

create_demo_video "examples/physics/collision-demo" \
  "Collision Events" \
  "Event System • Particle Spawning"

echo ""
echo "✅ All demonstration videos created!"
echo ""
echo "Note: These are placeholder videos. Full 3D renders require"
echo "a complete Three.js renderer integration."
