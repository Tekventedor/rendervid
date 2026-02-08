#!/usr/bin/env node
/**
 * CLI Tool Example
 *
 * Command-line tool for cloud rendering
 */

import { CloudRenderer } from '../src';
import { readFileSync, writeFileSync } from 'fs';
import type { Template } from '@rendervid/core';

async function main() {
  const args = process.argv.slice(2);

  if (args.length < 1) {
    console.log(`
Usage: rendervid-cloud <command> [options]

Commands:
  render <template.json>         Render video synchronously
  start <template.json>          Start async render
  status <jobId>                 Check render status
  cancel <jobId>                 Cancel render

Options:
  --provider <aws|azure|gcp>     Cloud provider (default: aws)
  --quality <draft|standard|high> Quality preset (default: standard)
  --output <path>                Output file path

Examples:
  rendervid-cloud render template.json --output video.mp4
  rendervid-cloud start template.json --provider azure
  rendervid-cloud status render-abc123
`);
    process.exit(1);
  }

  const command = args[0];
  const provider = getArg('--provider', 'aws') as 'aws' | 'azure' | 'gcp';
  const quality = getArg('--quality', 'standard') as 'draft' | 'standard' | 'high';
  const output = getArg('--output');

  const renderer = new CloudRenderer({
    provider,
    ...(provider === 'aws' && {
      awsConfig: {
        region: process.env.AWS_REGION!,
        s3Bucket: process.env.AWS_S3_BUCKET!,
      },
    }),
    ...(provider === 'azure' && {
      azureConfig: {
        subscriptionId: process.env.AZURE_SUBSCRIPTION_ID!,
        storageAccount: process.env.AZURE_STORAGE_ACCOUNT!,
        storageContainer: process.env.AZURE_STORAGE_CONTAINER!,
        storageConnectionString: process.env.AZURE_STORAGE_CONNECTION_STRING!,
      },
    }),
    ...(provider === 'gcp' && {
      gcpConfig: {
        projectId: process.env.GCP_PROJECT_ID!,
        storageBucket: process.env.GCP_STORAGE_BUCKET!,
      },
    }),
  });

  switch (command) {
    case 'render': {
      const templatePath = args[1];
      if (!templatePath) {
        console.error('Error: Template file required');
        process.exit(1);
      }

      const template = JSON.parse(readFileSync(templatePath, 'utf-8')) as Template;

      console.log(`Starting render with ${provider}...`);

      const result = await renderer.renderVideo({
        template,
        quality,
        downloadToLocal: !!output,
        outputPath: output,
      });

      console.log(`✓ Render complete!`);
      console.log(`  Job ID: ${result.jobId}`);
      console.log(`  Duration: ${result.duration}s`);
      console.log(`  File size: ${(result.fileSize / 1024 / 1024).toFixed(2)} MB`);
      console.log(`  Render time: ${(result.renderTime / 1000).toFixed(2)}s`);
      console.log(`  Chunks: ${result.chunksRendered}`);
      console.log(`  Storage URL: ${result.storageUrl}`);
      if (output) {
        console.log(`  Local file: ${output}`);
      }
      break;
    }

    case 'start': {
      const templatePath = args[1];
      if (!templatePath) {
        console.error('Error: Template file required');
        process.exit(1);
      }

      const template = JSON.parse(readFileSync(templatePath, 'utf-8')) as Template;

      const jobId = await renderer.startRenderAsync({
        template,
        quality,
      });

      console.log(`✓ Render started!`);
      console.log(`  Job ID: ${jobId}`);
      console.log(`  Provider: ${provider}`);
      console.log(`\nCheck status with: rendervid-cloud status ${jobId}`);

      // Save job ID to file
      writeFileSync('.last-job-id', jobId);
      break;
    }

    case 'status': {
      let jobId = args[1];

      if (!jobId && existsSync('.last-job-id')) {
        jobId = readFileSync('.last-job-id', 'utf-8').trim();
        console.log(`Using last job ID: ${jobId}`);
      }

      if (!jobId) {
        console.error('Error: Job ID required');
        process.exit(1);
      }

      const status = await renderer.getJobStatus(jobId);

      console.log(`Job ${jobId}:`);
      console.log(`  Status: ${status.status}`);
      console.log(`  Progress: ${status.progress.toFixed(1)}%`);
      console.log(`  Chunks: ${status.chunksCompleted}/${status.chunksTotal}`);

      if (status.storageUrl) {
        console.log(`  Storage URL: ${status.storageUrl}`);
      }

      if (status.error) {
        console.log(`  Error: ${status.error}`);
      }
      break;
    }

    case 'cancel': {
      const jobId = args[1];

      if (!jobId) {
        console.error('Error: Job ID required');
        process.exit(1);
      }

      await renderer.cancelJob(jobId);
      console.log(`✓ Job ${jobId} cancelled`);
      break;
    }

    default:
      console.error(`Unknown command: ${command}`);
      process.exit(1);
  }
}

function getArg(name: string, defaultValue?: string): string | undefined {
  const args = process.argv.slice(2);
  const index = args.indexOf(name);
  return index !== -1 ? args[index + 1] : defaultValue;
}

function existsSync(path: string): boolean {
  try {
    readFileSync(path);
    return true;
  } catch {
    return false;
  }
}

main().catch((error) => {
  console.error('Error:', error.message);
  process.exit(1);
});
