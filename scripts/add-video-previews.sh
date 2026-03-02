#!/bin/bash

# Add video preview sections to all gaming example READMEs

add_preview() {
  local readme="$1"
  
  if [ ! -f "$readme" ]; then
    return
  fi
  
  # Check if preview already exists
  if grep -q "## Preview" "$readme"; then
    echo "Preview already exists in $readme"
    return
  fi
  
  # Insert preview section after first heading
  awk '
    /^## / && !inserted {
      print "## Preview\n"
      print "![Demo](output.gif)\n"
      print "[📹 Watch full video (MP4)](output.mp4)\n"
      inserted=1
    }
    { print }
  ' "$readme" > "$readme.tmp" && mv "$readme.tmp" "$readme"
  
  echo "✅ Added preview to $readme"
}

# Update all gaming example READMEs
add_preview "examples/particles/explosion-mvp/README.md"
add_preview "examples/animations/keyframe-cube/README.md"
add_preview "examples/behaviors/orbiting-cube/README.md"
add_preview "examples/particles/fire-explosion/README.md"
add_preview "examples/animations/complex-path/README.md"
add_preview "examples/behaviors/complex-motion/README.md"
add_preview "examples/physics/collision-demo/README.md"

echo "✅ All READMEs updated"
