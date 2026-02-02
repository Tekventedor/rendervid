#!/bin/bash

# Generate videos for examples that are missing them

EXAMPLES_DIR="/Users/viktorzeman/work/rendervid/examples"

# Categories with missing videos
CATEGORIES=("3d" "backgrounds" "effects")

# Social media examples that are missing (image templates)
SOCIAL_MEDIA_MISSING=("linkedin-banner" "twitter-card" "youtube-thumbnail")

echo "Generating videos for missing examples..."
echo ""

# Process 3d, backgrounds, and effects categories
for category in "${CATEGORIES[@]}"; do
  if [ -d "$EXAMPLES_DIR/$category" ]; then
    echo "=== Processing $category examples ==="
    for example_dir in "$EXAMPLES_DIR/$category"/*/ ; do
      if [ -d "$example_dir" ]; then
        example=$(basename "$example_dir")
        template="$example_dir/template.json"
        output="$example_dir/output.mp4"

        if [ -f "$template" ] && [ ! -f "$output" ]; then
          echo "  Generating: $category/$example"
          cd "$EXAMPLES_DIR/.." && node scripts/generate-videos.js "$category/$example" 2>&1 | grep -E "✅|❌|Error" || echo "  ⏩ Processed"
        fi
      fi
    done
    echo ""
  fi
done

echo "Done!"
