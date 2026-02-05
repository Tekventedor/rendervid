#!/bin/bash
# Generate preview images and GIFs from example videos

echo "Generating preview images and GIFs..."
echo

# Check if FFmpeg is available
if ! command -v ffmpeg &> /dev/null; then
    echo "Error: FFmpeg is required but not installed"
    exit 1
fi

# Extract key frame from basic example
if [ -f "basic.mp4" ]; then
    echo "Extracting preview frame from basic.mp4..."
    ffmpeg -i basic.mp4 -vf "select=eq(n\,45)" -vframes 1 -y preview.png
    echo "✓ Created preview.png"
fi

# Extract key frame from no-blur example
if [ -f "basic-no-blur.mp4" ]; then
    echo "Extracting preview frame from basic-no-blur.mp4..."
    ffmpeg -i basic-no-blur.mp4 -vf "select=eq(n\,45)" -vframes 1 -y preview-no-blur.png
    echo "✓ Created preview-no-blur.png"
fi

# Create comparison GIF
if [ -f "comparison.mp4" ]; then
    echo "Creating comparison GIF..."
    ffmpeg -i comparison.mp4 -vf "fps=15,scale=960:-1:flags=lanczos" -loop 0 -y comparison.gif
    echo "✓ Created comparison.gif"
fi

# Create basic animation GIF
if [ -f "basic.mp4" ]; then
    echo "Creating basic animation GIF..."
    ffmpeg -i basic.mp4 -vf "fps=15,scale=960:-1:flags=lanczos" -loop 0 -y basic.gif
    echo "✓ Created basic.gif"
fi

# Create advanced features GIF
if [ -f "advanced.mp4" ]; then
    echo "Creating advanced features GIF..."
    ffmpeg -i advanced.mp4 -vf "fps=12,scale=960:-1:flags=lanczos" -loop 0 -y advanced.gif
    echo "✓ Created advanced.gif"
fi

echo
echo "Preview generation complete!"
echo
echo "Generated files:"
ls -lh *.png *.gif 2>/dev/null || echo "  (No preview files generated yet - run render-examples.mjs first)"
