/**
 * Basic usage example for @rendervid/cloud-rendering
 *
 * This example shows how to render a video using AWS Lambda.
 */

import { CloudRenderer } from '../src';
import type { Template } from '@rendervid/core';

// Example template (simplified)
const myTemplate: Template = {
  output: {
    width: 1920,
    height: 1080,
    fps: 30,
    duration: 5, // 5 seconds
  },
  composition: {
    scenes: [
      {
        id: 'intro',
        frames: 150, // 5 seconds * 30 fps
        layers: [
          {
            type: 'text',
            props: {
              text: 'Hello, Cloud Rendering!',
              x: 960,
              y: 540,
              fontSize: 72,
              fontFamily: 'Arial',
              color: '#ffffff',
            },
            animation: {
              type: 'fadeIn',
              duration: 30,
            },
          },
        ],
      },
    ],
  },
};

async function main() {
  console.log('=== Cloud Rendering Example ===\n');

  // Initialize cloud renderer
  const renderer = new CloudRenderer({
    provider: 'aws',
    awsConfig: {
      region: process.env.AWS_REGION || 'us-east-1',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      },
      s3Bucket: process.env.AWS_S3_BUCKET || 'rendervid-renders',
      s3Prefix: 'rendervid',
    },
  });

  console.log('Provider:', renderer.getProvider());
  console.log('');

  // Example 1: Synchronous render (wait for completion)
  console.log('Example 1: Synchronous render');
  console.log('------------------------------');

  try {
    const result = await renderer.renderVideo({
      template: myTemplate,
      quality: 'standard',
      downloadToLocal: true,
      outputPath: './output/example-sync.mp4',
    });

    console.log('✅ Render complete!');
    console.log(`  - Duration: ${result.duration}s`);
    console.log(`  - File size: ${(result.fileSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`  - Render time: ${(result.renderTime / 1000).toFixed(2)}s`);
    console.log(`  - Chunks rendered: ${result.chunksRendered}`);
    console.log(`  - Storage URL: ${result.storageUrl}`);
    console.log(`  - Local path: ${result.localPath}`);
  } catch (error) {
    console.error('❌ Render failed:', error);
  }

  console.log('');

  // Example 2: Async render with progress tracking
  console.log('Example 2: Async render with progress');
  console.log('--------------------------------------');

  try {
    const jobId = await renderer.startRenderAsync({
      template: myTemplate,
      quality: 'high',
    });

    console.log(`Job started: ${jobId}`);
    console.log('');

    // Poll for completion
    let lastProgress = -1;
    while (true) {
      const status = await renderer.getJobStatus(jobId);

      // Show progress updates
      if (status.progress !== lastProgress) {
        console.log(
          `[${status.status.toUpperCase()}] Progress: ${status.progress.toFixed(1)}% ` +
            `(${status.chunksCompleted}/${status.chunksTotal} chunks)`
        );
        lastProgress = status.progress;
      }

      // Check if done
      if (status.status === 'completed') {
        console.log('');
        console.log('✅ Render complete!');
        console.log(`  - Storage URL: ${status.storageUrl}`);

        // Download to local
        await renderer.downloadVideo(status.storageUrl!, './output/example-async.mp4');
        console.log('  - Downloaded to: ./output/example-async.mp4');
        break;
      }

      if (status.status === 'failed') {
        console.error('');
        console.error('❌ Render failed:', status.error);
        break;
      }

      // Wait 5 seconds before next poll
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }
  } catch (error) {
    console.error('❌ Render failed:', error);
  }

  console.log('');
  console.log('=== Examples Complete ===');
}

// Run examples
if (require.main === module) {
  main().catch(console.error);
}

export { main };
