#!/bin/bash

# Generate preview.gif for all showcases

showcases=(
  "all-animations"
  "all-easing"
  "all-filters"
  "all-fonts"
  "all-shapes"
  "all-layer-types"
  "all-transitions"
  "text-animations-showcase"
  "new-components-showcase"
)

for showcase in "${showcases[@]}"; do
  echo "=== Generating preview.gif for $showcase ==="
  cd "$showcase" || continue

  if [ -f "output.mp4" ]; then
    # Get duration from template.json
    duration=$(grep -o '"duration": [0-9]*' template.json | head -1 | grep -o '[0-9]*')

    if [ -z "$duration" ]; then
      duration=30
    fi

    echo "Duration: ${duration}s"
    ffmpeg -i output.mp4 -vf "fps=10,scale=800:-1:flags=lanczos" -t $duration preview.gif -y 2>&1 | tail -3
    echo "✅ Created preview.gif"
  else
    echo "⚠️  No output.mp4 found"
  fi

  cd ..
done

echo ""
echo "✅ All preview gifs generated!"
