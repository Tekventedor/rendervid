#!/bin/bash
# Create placeholder video files for gaming examples

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
  echo "Creating placeholders for $example"
  
  # Create placeholder files
  touch "$example/output.mp4"
  touch "$example/output.gif"
  
  # Add to .gitignore if not already there
  if [ -f "$example/.gitignore" ]; then
    grep -q "output.mp4" "$example/.gitignore" || echo "output.mp4" >> "$example/.gitignore"
    grep -q "output.gif" "$example/.gitignore" || echo "output.gif" >> "$example/.gitignore"
  else
    echo "output.mp4" > "$example/.gitignore"
    echo "output.gif" >> "$example/.gitignore"
  fi
done

echo "✅ Placeholders created"
