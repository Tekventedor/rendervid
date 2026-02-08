/**
 * REST API Server Example
 *
 * Express.js server with cloud rendering endpoints
 */

import express from 'express';
import { CloudRenderer } from '../src';
import type { Template } from '@rendervid/core';

const app = express();
app.use(express.json({ limit: '50mb' }));

// Store active renderers (in production, use Redis or similar)
const renderers = new Map<string, CloudRenderer>();

function getRenderer(provider: 'aws' | 'azure' | 'gcp'): CloudRenderer {
  if (!renderers.has(provider)) {
    const config = loadConfig(provider);
    renderers.set(provider, new CloudRenderer(config as any));
  }
  return renderers.get(provider)!;
}

function loadConfig(provider: 'aws' | 'azure' | 'gcp') {
  // Same as MCP example
  switch (provider) {
    case 'aws':
      return {
        provider: 'aws' as const,
        awsConfig: {
          region: process.env.AWS_REGION!,
          s3Bucket: process.env.AWS_S3_BUCKET!,
        },
      };
    case 'azure':
      return {
        provider: 'azure' as const,
        azureConfig: {
          subscriptionId: process.env.AZURE_SUBSCRIPTION_ID!,
          storageAccount: process.env.AZURE_STORAGE_ACCOUNT!,
          storageContainer: process.env.AZURE_STORAGE_CONTAINER!,
          storageConnectionString: process.env.AZURE_STORAGE_CONNECTION_STRING!,
        },
      };
    case 'gcp':
      return {
        provider: 'gcp' as const,
        gcpConfig: {
          projectId: process.env.GCP_PROJECT_ID!,
          storageBucket: process.env.GCP_STORAGE_BUCKET!,
        },
      };
  }
}

// POST /render - Synchronous render
app.post('/render', async (req, res) => {
  try {
    const { template, quality, provider = 'aws' } = req.body as {
      template: Template;
      quality?: 'draft' | 'standard' | 'high';
      provider?: 'aws' | 'azure' | 'gcp';
    };

    const renderer = getRenderer(provider);

    const result = await renderer.renderVideo({
      template,
      quality,
    });

    res.json({
      success: true,
      jobId: result.jobId,
      storageUrl: result.storageUrl,
      duration: result.duration,
      fileSize: result.fileSize,
      renderTime: result.renderTime,
      provider,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : String(error),
    });
  }
});

// POST /render/async - Start async render
app.post('/render/async', async (req, res) => {
  try {
    const { template, quality, provider = 'aws' } = req.body;

    const renderer = getRenderer(provider);

    const jobId = await renderer.startRenderAsync({
      template,
      quality,
    });

    res.json({
      success: true,
      jobId,
      provider,
      statusUrl: `/render/${jobId}`,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : String(error),
    });
  }
});

// GET /render/:jobId - Get render status
app.get('/render/:jobId', async (req, res) => {
  try {
    const { jobId } = req.params;
    const { provider = 'aws' } = req.query;

    const renderer = getRenderer(provider as any);

    const status = await renderer.getJobStatus(jobId);

    res.json({
      success: true,
      jobId: status.jobId,
      status: status.status,
      progress: status.progress,
      chunksCompleted: status.chunksCompleted,
      chunksTotal: status.chunksTotal,
      storageUrl: status.storageUrl,
      error: status.error,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : String(error),
    });
  }
});

// DELETE /render/:jobId - Cancel render
app.delete('/render/:jobId', async (req, res) => {
  try {
    const { jobId } = req.params;
    const { provider = 'aws' } = req.query;

    const renderer = getRenderer(provider as any);

    await renderer.cancelJob(jobId);

    res.json({
      success: true,
      message: `Job ${jobId} cancelled`,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : String(error),
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Cloud rendering API server running on port ${PORT}`);
});
