# Docker Local Distributed Rendering - Deployment Guide

This guide shows how to set up local distributed rendering using Docker containers, with the same API as cloud providers.

## Overview

The Docker backend provides:
- **Local distributed rendering** - No cloud costs
- **Same API** as AWS/Azure/GCP - Switch providers with config change
- **Job queue** - Handles multiple concurrent render requests
- **Resource limits** - Control CPU and memory per worker
- **Easy debugging** - Direct access to logs and files

## Architecture

```
Client Application
    ↓
CloudRenderer (provider: 'docker')
    ↓
DockerBackend + JobQueue
    ↓
Worker Containers (N parallel)
    ↓
Merger Container
    ↓
Local filesystem (./rendervid-jobs)
```

## Prerequisites

- Docker installed (version 20.10+)
- Docker Compose (usually included with Docker Desktop)
- 8GB+ RAM recommended
- Node.js 18+ (for client application)

## Quick Start

### 1. Build Docker Images

```bash
cd packages/cloud-rendering/deployments/docker
chmod +x build.sh
./build.sh
```

This builds two images:
- `rendervid-worker:latest` - Renders video chunks
- `rendervid-merger:latest` - Concatenates chunks

### 2. Create Volume Directory

```bash
mkdir -p ./rendervid-jobs
```

This directory will store:
- Job templates and manifests
- Video chunks
- Final rendered videos
- Progress tracking files

### 3. Use in Your Code

```typescript
import { CloudRenderer } from '@rendervid/cloud-rendering';

const renderer = new CloudRenderer({
  provider: 'docker',
  dockerConfig: {
    volumePath: './rendervid-jobs',
    workersCount: 4,  // Number of parallel workers
    maxConcurrentJobs: 10,  // Max jobs in queue
  },
});

// Same API as cloud providers!
const result = await renderer.renderVideo({
  template: myTemplate,
  quality: 'standard',
  downloadToLocal: true,
  outputPath: './output.mp4',
});

console.log(`Rendered in ${result.renderTime}ms`);
```

## Configuration Options

### DockerConfig

```typescript
interface DockerConfig {
  /** Number of worker containers to spawn (default: 4) */
  workersCount?: number;

  /** Local volume path for job storage (required) */
  volumePath: string;

  /** Docker network name (default: 'rendervid-network') */
  networkName?: string;

  /** Docker Compose project name (default: 'rendervid') */
  projectName?: string;

  /** Maximum concurrent jobs (default: 10) */
  maxConcurrentJobs?: number;

  /** Job queue check interval in ms (default: 2000) */
  queueCheckInterval?: number;

  /** Worker container image (default: 'rendervid-worker:latest') */
  workerImage?: string;

  /** Merger container image (default: 'rendervid-merger:latest') */
  mergerImage?: string;
}
```

### Quality Presets

Same as cloud providers:

| Preset   | Workers | Frames/Chunk | Speed      |
|----------|---------|--------------|------------|
| draft    | 10      | 50           | Fastest    |
| standard | 20      | 30           | Balanced   |
| high     | 50      | 20           | Best       |

## Job Queue

The Docker backend includes a file-based job queue to handle multiple concurrent render requests:

### Queue Features

- **Max concurrent jobs**: Limit running jobs to avoid overloading system
- **Priority support**: Higher priority jobs processed first
- **FIFO within priority**: Oldest jobs processed first within same priority
- **Automatic cleanup**: Old completed jobs cleaned up after 24 hours

### Queue API

```typescript
const backend = renderer.getBackend() as DockerBackend;

// Get queue statistics
const stats = backend.getQueueStats();
console.log(stats);
// {
//   pending: 5,
//   running: 2,
//   completed: 10,
//   failed: 1,
//   total: 18
// }
```

### Queue Workflow

1. Job submitted via `startRenderAsync()`
2. Job added to queue with status='pending'
3. Queue processor checks every 2 seconds (configurable)
4. If `running < maxConcurrentJobs`, dequeue next job
5. Spawn worker containers for job
6. Mark job as 'running'
7. When all chunks complete, spawn merger
8. Mark job as 'completed'

## Resource Limits

By default, each container gets:
- **CPU**: 1-2 cores
- **Memory**: 2-4 GB

To customize, edit `docker-compose.yml`:

```yaml
services:
  worker:
    deploy:
      resources:
        limits:
          cpus: '4'      # Max 4 cores
          memory: 8G     # Max 8GB RAM
        reservations:
          cpus: '2'      # Reserve 2 cores
          memory: 4G     # Reserve 4GB RAM
```

## Directory Structure

```
./rendervid-jobs/
├── queue/                      # Job queue state
│   ├── render-abc123.json      # Queue job metadata
│   └── render-def456.json
│
└── rendervid/
    └── jobs/
        └── render-abc123/
            ├── template.json   # Template with inputs
            ├── manifest.json   # Job configuration
            ├── chunks/
            │   ├── chunk-0.mp4
            │   └── chunk-1.mp4
            ├── progress/
            │   ├── worker-0.json
            │   └── worker-1.json
            ├── output.mp4      # Final video
            └── complete.json   # Completion marker
```

## Monitoring

### View Logs

```bash
# Worker logs (replace container name)
docker logs rendervid-worker-render-abc123-0

# Merger logs
docker logs rendervid-merger-render-abc123
```

### Check Running Containers

```bash
docker ps | grep rendervid
```

### Monitor Queue

```typescript
setInterval(() => {
  const stats = backend.getQueueStats();
  console.log(`Queue: ${stats.pending} pending, ${stats.running} running`);
}, 5000);
```

## Performance

### Local vs Cloud

**Docker Backend (Local)**:
- ✅ No cloud costs
- ✅ Faster cold start (no function initialization)
- ✅ Direct filesystem access
- ❌ Limited by local resources
- ❌ No auto-scaling

**Cloud Backend (AWS/Azure/GCP)**:
- ✅ Unlimited scaling (100+ workers)
- ✅ No local resource usage
- ❌ Cloud costs (~$0.02/min)
- ❌ Slower cold start (1-3 seconds)

### Benchmarks

On a MacBook Pro (M1, 16GB RAM):

| Video Duration | Workers | Render Time | vs Local |
|----------------|---------|-------------|----------|
| 10 seconds     | 4       | 15-20 sec   | 4-5x     |
| 1 minute       | 4       | 60-90 sec   | 3-4x     |
| 5 minutes      | 8       | 4-6 min     | 5-7x     |

## Troubleshooting

### Issue: Containers fail to start

**Symptom**: `Error response from daemon: network rendervid-network not found`

**Fix**: Create network manually:
```bash
docker network create rendervid-network
```

### Issue: Out of memory

**Symptom**: Worker containers killed with exit code 137

**Fix**: Reduce `workersCount` or increase Docker memory limit in Docker Desktop settings.

### Issue: Slow rendering

**Symptom**: Rendering slower than expected

**Fixes**:
- Increase `workersCount` (if RAM available)
- Use `quality: 'draft'` for faster encoding
- Check Docker resource limits

### Issue: Port conflicts

**Symptom**: `bind: address already in use`

**Fix**: Change network name in config:
```typescript
dockerConfig: {
  networkName: 'rendervid-network-2',
}
```

## Cleanup

### Remove Containers

```bash
# Stop all rendervid containers
docker ps | grep rendervid | awk '{print $1}' | xargs docker stop

# Remove stopped containers
docker container prune -f
```

### Remove Images

```bash
docker rmi rendervid-worker:latest rendervid-merger:latest
```

### Remove Network

```bash
docker network rm rendervid-network
```

### Clean Job Files

```bash
# Remove old jobs (older than 7 days)
find ./rendervid-jobs -type f -mtime +7 -delete
```

## Comparison: Docker vs Cloud

### When to Use Docker

✅ Development and testing
✅ Low-volume rendering (< 100 videos/day)
✅ On-premise requirements
✅ Cost-sensitive projects
✅ Need for debugging

### When to Use Cloud

✅ Production workloads
✅ High-volume rendering (1000+ videos/day)
✅ Need auto-scaling
✅ Global distribution
✅ No local infrastructure

## Example: Switch Between Docker and Cloud

```typescript
// Use Docker for development
const devRenderer = new CloudRenderer({
  provider: 'docker',
  dockerConfig: {
    volumePath: './rendervid-jobs',
    workersCount: 4,
  },
});

// Use AWS for production (same API!)
const prodRenderer = new CloudRenderer({
  provider: 'aws',
  awsConfig: {
    region: 'us-east-1',
    s3Bucket: 'my-renders',
  },
});

// Same code works for both
async function renderVideo(renderer, template) {
  return await renderer.renderVideo({
    template,
    quality: 'standard',
  });
}
```

## Next Steps

- Try rendering a test video with Docker backend
- Monitor queue statistics during high load
- Benchmark performance on your hardware
- Consider cloud backend for production scaling

## Support

- [Docker Documentation](https://docs.docker.com/)
- [Troubleshooting Guide](./TROUBLESHOOTING.md)
- [GitHub Issues](https://github.com/rendervid/rendervid/issues)
