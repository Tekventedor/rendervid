/**
 * MCP Server Integration Example
 *
 * Shows how to integrate cloud rendering into MCP tools
 */

import { CloudRenderer, loadDefaultProviderConfig } from '../src';
import type { Template } from '@rendervid/core';

/**
 * MCP tool: render_video_cloud
 *
 * Renders a video using cloud infrastructure for 10-50x speedup
 */
export async function renderVideoCloud(args: {
  template: Template;
  quality?: 'draft' | 'standard' | 'high';
  provider?: 'aws' | 'azure' | 'gcp';
  downloadToLocal?: boolean;
  outputPath?: string;
}): Promise<string> {
  const { template, quality = 'standard', provider, downloadToLocal = false, outputPath } = args;

  // Load provider config from environment
  const config = provider
    ? { provider, config: loadProviderConfig(provider) }
    : loadDefaultProviderConfig();

  const renderer = new CloudRenderer(config as any);

  console.log(`[MCP] Starting cloud render with ${config.provider}...`);

  const result = await renderer.renderVideo({
    template,
    quality,
    downloadToLocal,
    outputPath,
  });

  return JSON.stringify({
    success: result.success,
    jobId: result.jobId,
    storageUrl: result.storageUrl,
    localPath: result.localPath,
    duration: result.duration,
    fileSize: result.fileSize,
    renderTimeMs: result.renderTime,
    chunksRendered: result.chunksRendered,
    provider: config.provider,
  }, null, 2);
}

/**
 * MCP tool: render_video_cloud_async
 *
 * Starts async render and returns job ID
 */
export async function renderVideoCloudAsync(args: {
  template: Template;
  quality?: 'draft' | 'standard' | 'high';
  provider?: 'aws' | 'azure' | 'gcp';
}): Promise<string> {
  const { template, quality = 'standard', provider } = args;

  const config = provider
    ? { provider, config: loadProviderConfig(provider) }
    : loadDefaultProviderConfig();

  const renderer = new CloudRenderer(config as any);

  const jobId = await renderer.startRenderAsync({
    template,
    quality,
  });

  return JSON.stringify({
    jobId,
    provider: config.provider,
    status: 'queued',
    message: 'Use get_cloud_render_status to check progress',
  }, null, 2);
}

/**
 * MCP tool: get_cloud_render_status
 *
 * Check status of async render job
 */
export async function getCloudRenderStatus(args: {
  jobId: string;
  provider?: 'aws' | 'azure' | 'gcp';
}): Promise<string> {
  const { jobId, provider } = args;

  const config = provider
    ? { provider, config: loadProviderConfig(provider) }
    : loadDefaultProviderConfig();

  const renderer = new CloudRenderer(config as any);

  const status = await renderer.getJobStatus(jobId);

  return JSON.stringify({
    jobId: status.jobId,
    status: status.status,
    progress: `${status.progress.toFixed(1)}%`,
    chunksCompleted: status.chunksCompleted,
    chunksTotal: status.chunksTotal,
    storageUrl: status.storageUrl,
    error: status.error,
  }, null, 2);
}

function loadProviderConfig(provider: 'aws' | 'azure' | 'gcp') {
  switch (provider) {
    case 'aws':
      return {
        region: process.env.AWS_REGION!,
        s3Bucket: process.env.AWS_S3_BUCKET!,
      };
    case 'azure':
      return {
        subscriptionId: process.env.AZURE_SUBSCRIPTION_ID!,
        storageAccount: process.env.AZURE_STORAGE_ACCOUNT!,
        storageContainer: process.env.AZURE_STORAGE_CONTAINER!,
        storageConnectionString: process.env.AZURE_STORAGE_CONNECTION_STRING!,
      };
    case 'gcp':
      return {
        projectId: process.env.GCP_PROJECT_ID!,
        storageBucket: process.env.GCP_STORAGE_BUCKET!,
      };
  }
}
