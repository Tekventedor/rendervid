#!/bin/bash

# Build Docker images for Rendervid distributed rendering

set -e

echo "Building Rendervid Docker images..."

# Get the repository root (3 levels up from this script)
REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../../.." && pwd)"

echo "Repository root: $REPO_ROOT"

# Build worker image
echo ""
echo "Building worker image..."
docker build \
  -f "$REPO_ROOT/packages/cloud-rendering/deployments/docker/worker.Dockerfile" \
  -t rendervid-worker:latest \
  "$REPO_ROOT"

echo "✓ Worker image built: rendervid-worker:latest"

# Build merger image
echo ""
echo "Building merger image..."
docker build \
  -f "$REPO_ROOT/packages/cloud-rendering/deployments/docker/merger.Dockerfile" \
  -t rendervid-merger:latest \
  "$REPO_ROOT"

echo "✓ Merger image built: rendervid-merger:latest"

echo ""
echo "✓ All images built successfully!"
echo ""
echo "Next steps:"
echo "  1. Create a volume directory: mkdir -p ./rendervid-jobs"
echo "  2. Use in your code:"
echo ""
echo "     const renderer = new CloudRenderer({"
echo "       provider: 'docker',"
echo "       dockerConfig: {"
echo "         volumePath: './rendervid-jobs',"
echo "         workersCount: 4,"
echo "       },"
echo "     });"
echo ""
