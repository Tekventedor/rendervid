/**
 * Example: Using Docker backend for local distributed rendering
 */

import { CloudRenderer } from '@rendervid/cloud-rendering';
import type { Template } from '@rendervid/core';

// Example template
const exampleTemplate: Template = {
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
        id: 'intro',
        startFrame: 0,
        endFrame: 149,
        layers: [
          {
            id: 'background',
            type: 'rectangle',
            position: { x: 0, y: 0 },
            size: { width: 1920, height: 1080 },
            props: {
              fill: '#2563eb',
            },
          },
          {
            id: 'title',
            type: 'text',
            position: { x: 960, y: 540 },
            size: { width: 1200, height: 200 },
            props: {
              text: 'Docker Distributed Rendering',
              fontSize: 72,
              fontWeight: 'bold',
              color: '#ffffff',
              textAlign: 'center',
            },
            animations: [
              {
                type: 'fadeIn',
                startFrame: 0,
                endFrame: 30,
              },
            ],
          },
        ],
      },
    ],
  },
};

async function dockerRenderingExample() {
  console.log('=== Docker Distributed Rendering Example ===\n');

  // Initialize Docker renderer
  const renderer = new CloudRenderer({
    provider: 'docker',
    dockerConfig: {
      volumePath: './rendervid-jobs',
      workersCount: 4,
      maxConcurrentJobs: 10,
    },
  });

  console.log('✓ Renderer initialized with Docker backend\n');

  // Example 1: Synchronous rendering
  console.log('Example 1: Synchronous rendering (wait for completion)...');

  const result = await renderer.renderVideo({
    template: exampleTemplate,
    quality: 'standard',
    downloadToLocal: true,
    outputPath: './output-docker-sync.mp4',
  });

  console.log('✓ Render complete!');
  console.log(`  Job ID: ${result.jobId}`);
  console.log(`  Duration: ${result.duration}s`);
  console.log(`  File size: ${(result.fileSize / 1024 / 1024).toFixed(2)} MB`);
  console.log(`  Render time: ${(result.renderTime / 1000).toFixed(1)}s`);
  console.log(`  Chunks: ${result.chunksRendered}`);
  console.log(`  Output: ${result.localPath}\n`);

  // Example 2: Async rendering with progress tracking
  console.log('Example 2: Async rendering with progress tracking...');

  const jobId = await renderer.startRenderAsync({
    template: exampleTemplate,
    quality: 'draft', // Faster for demo
  });

  console.log(`✓ Job started: ${jobId}`);
  console.log('Polling for completion...\n');

  while (true) {
    const status = await renderer.getJobStatus(jobId);

    console.log(
      `Progress: ${status.progress.toFixed(1)}% ` +
        `(${status.chunksCompleted}/${status.chunksTotal} chunks) ` +
        `[${status.status}]`
    );

    if (status.status === 'completed') {
      console.log(`\n✓ Render complete!`);
      console.log(`  Storage URL: ${status.storageUrl}`);
      break;
    }

    if (status.status === 'failed') {
      console.error(`\n✗ Render failed: ${status.error}`);
      break;
    }

    // Wait 2 seconds before next poll
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }

  // Example 3: Queue statistics
  console.log('\nExample 3: Queue statistics...');

  // @ts-ignore - DockerBackend specific method
  const stats = renderer.getBackend().getQueueStats();

  console.log('Queue stats:');
  console.log(`  Pending: ${stats.pending}`);
  console.log(`  Running: ${stats.running}`);
  console.log(`  Completed: ${stats.completed}`);
  console.log(`  Failed: ${stats.failed}`);
  console.log(`  Total: ${stats.total}`);

  // Example 4: Multiple concurrent jobs
  console.log('\nExample 4: Multiple concurrent jobs...');

  const jobs = await Promise.all([
    renderer.startRenderAsync({ template: exampleTemplate, quality: 'draft' }),
    renderer.startRenderAsync({ template: exampleTemplate, quality: 'draft' }),
    renderer.startRenderAsync({ template: exampleTemplate, quality: 'draft' }),
  ]);

  console.log(`✓ Started ${jobs.length} jobs concurrently`);
  console.log(`  Job IDs: ${jobs.join(', ')}`);

  // Wait for all to complete
  console.log('Waiting for all jobs to complete...\n');

  const results = await Promise.all(
    jobs.map(async (jobId) => {
      let status;
      do {
        status = await renderer.getJobStatus(jobId);
        await new Promise((resolve) => setTimeout(resolve, 2000));
      } while (status.status !== 'completed' && status.status !== 'failed');
      return status;
    })
  );

  const successCount = results.filter((r) => r.status === 'completed').length;
  console.log(`✓ All jobs finished: ${successCount}/${results.length} successful\n`);

  // Cleanup
  console.log('Shutting down...');
  // @ts-ignore - DockerBackend specific method
  await renderer.getBackend().shutdown();

  console.log('\n=== Example Complete ===');
}

// Run example
dockerRenderingExample().catch((error) => {
  console.error('Error:', error);
  process.exit(1);
});

// Export for use in other files
export { dockerRenderingExample, exampleTemplate };
