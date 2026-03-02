#!/bin/bash
set -e

# Start Xvfb on display :99
export DISPLAY=:99
Xvfb :99 -screen 0 1920x1080x24 -ac +extension GLX +render -noreset &
XVFB_PID=$!

echo "Started Xvfb with PID: $XVFB_PID"
sleep 2

# Render gaming examples with real Chrome + WebGL
cd "$(dirname "$0")/.."
npx tsx scripts/render-gaming-xvfb.ts

# Cleanup
kill $XVFB_PID 2>/dev/null || true
echo "Done!"
