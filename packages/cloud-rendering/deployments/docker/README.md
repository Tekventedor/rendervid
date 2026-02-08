# Docker Local Distributed Rendering

This directory contains Docker infrastructure for local distributed video rendering.

## Quick Start

### 1. Build Images

```bash
chmod +x build.sh
./build.sh
```

This creates:
- `rendervid-worker:latest` - Worker container with Chromium + FFmpeg
- `rendervid-merger:latest` - Merger container with FFmpeg

### 2. Use in Code

```typescript
import { CloudRenderer } from '@rendervid/cloud-rendering';

const renderer = new CloudRenderer({
  provider: 'docker',
  dockerConfig: {
    volumePath: './rendervid-jobs',
    workersCount: 4,
  },
});

const result = await renderer.renderVideo({
  template: myTemplate,
  quality: 'standard',
});
```

## Files

### Dockerfiles

- **worker.Dockerfile** - Worker container
  - Includes: Chromium, FFmpeg, Node.js 20
  - Purpose: Render video chunks in parallel

- **merger.Dockerfile** - Merger container
  - Includes: FFmpeg, Node.js 20
  - Purpose: Concatenate chunks into final video

### Scripts

- **scripts/worker.js** - Worker entry point
  - Renders frames using Chromium/Playwright
  - Encodes chunk with FFmpeg
  - Writes progress to disk

- **scripts/merger.js** - Merger entry point
  - Downloads all chunks
  - Concatenates with FFmpeg (copy codec, no re-encoding)
  - Writes completion marker

### Configuration

- **docker-compose.yml** - Docker Compose configuration
  - Defines services, networks, volumes
  - Resource limits (CPU, memory)
  - Environment variables

- **build.sh** - Build script
  - Builds both images
  - Tags as `latest`

## Architecture

```
Client App
    ↓
CloudRenderer (provider: 'docker')
    ↓
DockerBackend
    ├─ Job Queue (file-based)
    ├─ LocalStorage (filesystem)
    └─ Container Spawner
         ↓
    Worker Containers (N parallel)
    ├─ Download template from volume
    ├─ Render frames with Chromium
    ├─ Encode chunk with FFmpeg
    └─ Write to volume
         ↓
    Merger Container
    ├─ Download chunks from volume
    ├─ Concatenate with FFmpeg
    └─ Write final video to volume
         ↓
    Client App (download or use local path)
```

## Volume Structure

```
./rendervid-jobs/
├── queue/                      # Job queue state
│   └── render-*.json
│
└── rendervid/
    └── jobs/
        └── render-abc123/
            ├── template.json   # Template + inputs
            ├── manifest.json   # Job config
            ├── chunks/
            │   ├── chunk-0.mp4
            │   └── chunk-1.mp4
            ├── temp/
            │   └── chunk-0/
            │       └── frame-*.png
            ├── progress/
            │   └── worker-*.json
            ├── output.mp4      # Final video
            └── complete.json   # Completion marker
```

## Resource Configuration

Default limits per container:
- CPU: 1-2 cores
- Memory: 2-4 GB

To customize, edit `docker-compose.yml`:

```yaml
deploy:
  resources:
    limits:
      cpus: '4'
      memory: 8G
```

## Troubleshooting

### Issue: Network not found

```bash
docker network create rendervid-network
```

### Issue: Images not building

Check Docker daemon is running:
```bash
docker info
```

### Issue: Workers failing

Check logs:
```bash
docker ps | grep rendervid-worker
docker logs <container-id>
```

### Issue: Out of disk space

Clean up old jobs:
```bash
rm -rf ./rendervid-jobs/rendervid/jobs/*
```

## Performance Tips

1. **Increase workers** for faster rendering (if CPU/RAM available)
2. **Use SSD** for volume path (faster I/O)
3. **Use `quality: 'draft'`** for faster encoding
4. **Monitor resources** with `docker stats`

## Comparison: Docker vs Cloud

| Aspect | Docker | AWS/Azure/GCP |
|--------|--------|---------------|
| Cost | Free (local resources) | ~$0.02/min |
| Scaling | Limited by hardware | Auto-scale to 100+ |
| Cold start | ~1s | ~2-3s |
| Setup | Simple (run build.sh) | Complex (deploy infra) |
| Debugging | Easy (local logs) | Harder (cloud logs) |
| Best for | Dev, testing, low volume | Prod, high volume |

## Next Steps

- See [DEPLOYMENT_DOCKER.md](../../docs/DEPLOYMENT_DOCKER.md) for full guide
- Try [examples/docker-usage.ts](../../examples/docker-usage.ts)
- Compare with cloud providers using [examples/switch-providers.ts](../../examples/switch-providers.ts)
