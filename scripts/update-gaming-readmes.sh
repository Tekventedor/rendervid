#!/bin/bash

# Add WebGL note to all gaming example READMEs

for readme in examples/{physics,particles,animations,behaviors}/*/README.md; do
  if grep -q "Note.*WebGL" "$readme"; then
    echo "Already updated: $readme"
    continue
  fi
  
  # Add note after preview section
  awk '
    /^\[📹 Watch full video/ {
      print
      print ""
      print "**Note**: This video shows a text-based demonstration. The actual 3D rendering (physics simulation, GPU particles, etc.) requires WebGL which is not available in headless video generation. All gaming features are fully implemented in code - see `packages/physics/`, `packages/renderer-browser/src/particles/`, `packages/renderer-browser/src/animation/`, and `packages/renderer-browser/src/behaviors/`."
      next
    }
    { print }
  ' "$readme" > "$readme.tmp" && mv "$readme.tmp" "$readme"
  
  echo "✅ Updated: $readme"
done

echo ""
echo "✅ All READMEs updated with WebGL note"
