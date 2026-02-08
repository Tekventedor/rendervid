# Quick Start: Docker Local Rendering

Get distributed video rendering running locally in **5 minutes** with zero cloud costs.

## Prerequisites

- Docker installed (version 20.10+)
- Node.js 18+
- 8GB+ RAM recommended

## Step 1: Build Docker Images (2 minutes)

```bash
cd packages/cloud-rendering/deployments/docker
chmod +x build.sh
./build.sh
```

This builds:
- `rendervid-worker:latest` - Renders video chunks
- `rendervid-merger:latest` - Concatenates chunks

## Step 2: Create Volume Directory

```bash
mkdir -p ./rendervid-jobs
```

## Step 3: Use in Your Code

```typescript
import { CloudRenderer } from '@rendervid/cloud-rendering';
import type { Template } from '@rendervid/core';

const template: Template = {
  output: {
    type: 'video',
    width: 1920,
    height: 1080,
    fps: 30,
    duration: 5,
  },
  composition: {
    scenes: [
      {
        id: 'main',
        startFrame: 0,
        endFrame: 149,
        layers: [
          {
            id: 'text',
            type: 'text',
            position: { x: 960, y: 540 },
            size: { width: 1000, height: 200 },
            props: {
              text: 'Hello Docker!',
              fontSize: 72,
              color: '#ffffff',
            },
          },
        ],
      },
    ],
  },
};

// Initialize renderer
const renderer = new CloudRenderer({
  provider: 'docker',
  dockerConfig: {
    volumePath: './rendervid-jobs',
    workersCount: 4,
  },
});

// Render video
const result = await renderer.renderVideo({
  template,
  quality: 'standard',
  downloadToLocal: true,
  outputPath: './output.mp4',
});

console.log(`✓ Rendered in ${result.renderTime}ms`);
console.log(`✓ Output: ${result.localPath}`);
```

## Step 4: Run Your Code

```bash
npx tsx my-render.ts
```

## That's It!

Your video will be rendered using 4 parallel Docker containers and saved to `./output.mp4`.

## What Happens Under the Hood

1. **Job queued** - Added to local file-based queue
2. **Workers spawned** - 4 Docker containers render chunks in parallel
3. **Chunks encoded** - Each worker renders 30-50 frames and encodes with FFmpeg
4. **Merger invoked** - Single container concatenates chunks
5. **Video ready** - Final output at `./output.mp4`

## Queue Management

Handle multiple concurrent renders:

```typescript
// Start 3 renders concurrently
const jobs = await Promise.all([
  renderer.startRenderAsync({ template: t1 }),
  renderer.startRenderAsync({ template: t2 }),
  renderer.startRenderAsync({ template: t3 }),
]);

// Queue processes them based on maxConcurrentJobs setting
```

## Switch to Cloud Later

Same API works with cloud providers:

```typescript
// Development (Docker)
const devRenderer = new CloudRenderer({
  provider: 'docker',
  dockerConfig: { volumePath: './rendervid-jobs' },
});

// Production (AWS)
const prodRenderer = new CloudRenderer({
  provider: 'aws',
  awsConfig: { region: 'us-east-1', s3Bucket: 'my-bucket' },
});

// Same code works for both!
await devRenderer.renderVideo({ template });
await prodRenderer.renderVideo({ template });
```

## Configuration Options

```typescript
dockerConfig: {
  volumePath: './rendervid-jobs',    // Required
  workersCount: 4,                    // Parallel workers (default: 4)
  maxConcurrentJobs: 10,              // Queue limit (default: 10)
  queueCheckInterval: 2000,           // Poll interval ms (default: 2000)
}
```

## Troubleshooting

### Error: Network not found

```bash
docker network create rendervid-network
```

### Error: Images not found

```bash
cd deployments/docker
./build.sh
```

### Error: Out of memory

Reduce workers:
```typescript
workersCount: 2  // Instead of 4
```

## Performance Tips

1. **More workers** = faster (if CPU/RAM available)
2. **SSD storage** = faster I/O
3. **`quality: 'draft'`** = faster encoding
4. **Monitor with**: `docker stats`

## Cost Comparison

| Provider | Cost/min | Setup Time |
|----------|----------|------------|
| Docker   | **$0**   | 5 minutes  |
| AWS      | ~$0.02   | 2 hours    |

**Recommendation**: Use Docker for development, AWS for production.

## Next Steps

- [Full deployment guide](./docs/DEPLOYMENT_DOCKER.md)
- [Examples](./examples/docker-usage.ts)
- [Switch providers](./examples/switch-providers.ts)
- [Implementation details](./DOCKER_IMPLEMENTATION.md)

## Support

- [GitHub Issues](https://github.com/rendervid/rendervid/issues)
- [Documentation](./docs/)
- [Examples](./examples/)

---

**Ready to scale?** Switch to cloud providers with the same API:
- [AWS Deployment Guide](./docs/DEPLOYMENT_AWS.md)
- [Azure Deployment Guide](./docs/DEPLOYMENT_AZURE.md)
- [GCP Deployment Guide](./docs/DEPLOYMENT_GCP.md)
