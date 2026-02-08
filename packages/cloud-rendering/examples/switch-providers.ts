/**
 * Example: Switch between Docker and Cloud providers with same API
 *
 * Shows how easy it is to change rendering backend based on environment
 */

import { CloudRenderer } from '@rendervid/cloud-rendering';
import type { Template } from '@rendervid/core';

const exampleTemplate: Template = {
  output: {
    type: 'video',
    width: 1920,
    height: 1080,
    fps: 30,
    duration: 3,
  },
  composition: {
    scenes: [
      {
        id: 'main',
        startFrame: 0,
        endFrame: 89,
        layers: [
          {
            id: 'text',
            type: 'text',
            position: { x: 960, y: 540 },
            size: { width: 1000, height: 200 },
            props: {
              text: 'Multi-Provider Rendering',
              fontSize: 64,
              fontWeight: 'bold',
              color: '#ffffff',
              textAlign: 'center',
            },
          },
        ],
      },
    ],
  },
};

/**
 * Create renderer based on environment
 */
function createRenderer(env: 'development' | 'staging' | 'production') {
  switch (env) {
    case 'development':
      // Use Docker for local development (no cloud costs)
      return new CloudRenderer({
        provider: 'docker',
        dockerConfig: {
          volumePath: './rendervid-jobs',
          workersCount: 4,
          maxConcurrentJobs: 5,
        },
      });

    case 'staging':
      // Use AWS Lambda for staging (auto-scaling)
      return new CloudRenderer({
        provider: 'aws',
        awsConfig: {
          region: process.env.AWS_REGION || 'us-east-1',
          s3Bucket: process.env.AWS_S3_BUCKET || 'rendervid-staging',
          s3Prefix: 'staging',
        },
      });

    case 'production':
      // Use AWS Lambda for production (high reliability)
      return new CloudRenderer({
        provider: 'aws',
        awsConfig: {
          region: process.env.AWS_REGION || 'us-east-1',
          s3Bucket: process.env.AWS_S3_BUCKET || 'rendervid-prod',
          s3Prefix: 'production',
        },
      });

    default:
      throw new Error(`Unknown environment: ${env}`);
  }
}

/**
 * Render function that works with any provider
 */
async function renderVideo(
  renderer: CloudRenderer,
  template: Template,
  quality: 'draft' | 'standard' | 'high'
) {
  const provider = renderer.getProvider();

  console.log(`\n=== Rendering with ${provider} ===\n`);

  const startTime = Date.now();

  const result = await renderer.renderVideo({
    template,
    quality,
    downloadToLocal: true,
    outputPath: `./output-${provider}.mp4`,
  });

  const totalTime = Date.now() - startTime;

  console.log(`\n✓ Render complete with ${provider}:`);
  console.log(`  Provider: ${provider}`);
  console.log(`  Job ID: ${result.jobId}`);
  console.log(`  Duration: ${result.duration}s`);
  console.log(`  File size: ${(result.fileSize / 1024 / 1024).toFixed(2)} MB`);
  console.log(`  Render time: ${(result.renderTime / 1000).toFixed(1)}s`);
  console.log(`  Total time: ${(totalTime / 1000).toFixed(1)}s`);
  console.log(`  Chunks: ${result.chunksRendered}`);
  console.log(`  Output: ${result.localPath}`);

  return result;
}

/**
 * Main example
 */
async function main() {
  console.log('=== Multi-Provider Rendering Example ===');

  // Get environment from env var or default to development
  const env = (process.env.NODE_ENV as any) || 'development';

  console.log(`\nEnvironment: ${env}`);

  // Create renderer for current environment
  const renderer = createRenderer(env);

  console.log(`Provider: ${renderer.getProvider()}`);

  // Render video (same code works for all providers!)
  await renderVideo(renderer, exampleTemplate, 'draft');

  // Example: Compare Docker vs Cloud
  if (env === 'development') {
    console.log('\n=== Performance Comparison ===\n');

    // Render with Docker
    const dockerRenderer = createRenderer('development');
    const dockerStart = Date.now();
    await renderVideo(dockerRenderer, exampleTemplate, 'draft');
    const dockerTime = Date.now() - dockerStart;

    // Render with AWS (if credentials available)
    if (process.env.AWS_S3_BUCKET) {
      const awsRenderer = createRenderer('staging');
      const awsStart = Date.now();
      await renderVideo(awsRenderer, exampleTemplate, 'draft');
      const awsTime = Date.now() - awsStart;

      console.log('\n=== Comparison ===');
      console.log(`Docker: ${(dockerTime / 1000).toFixed(1)}s`);
      console.log(`AWS: ${(awsTime / 1000).toFixed(1)}s`);
      console.log(
        `AWS was ${(dockerTime / awsTime).toFixed(1)}x ${awsTime < dockerTime ? 'faster' : 'slower'}`
      );
    }
  }

  console.log('\n=== Example Complete ===\n');
}

// Run example
main().catch((error) => {
  console.error('Error:', error);
  process.exit(1);
});

// Export for use in other files
export { createRenderer, renderVideo };
