/**
 * Docker API Server
 *
 * Express.js server for Docker-based local video rendering.
 * Uses Docker containers for distributed rendering without cloud dependencies.
 */

import express from 'express';
import { resolve } from 'path';
import { CloudRenderer } from '../src';
import type { Template } from '@rendervid/core';

const app = express();
app.use(express.json({ limit: '50mb' }));

// Configure Docker backend
const volumePath = resolve(process.env.VOLUME_PATH || './rendervid-jobs');

const renderer = new CloudRenderer({
  provider: 'docker',
  dockerConfig: {
    volumePath,
    workersCount: parseInt(process.env.WORKERS_COUNT || '4'),
    networkName: process.env.NETWORK_NAME || 'rendervid-network',
    projectName: process.env.PROJECT_NAME || 'rendervid',
    maxConcurrentJobs: parseInt(process.env.MAX_CONCURRENT_JOBS || '10'),
  },
});

console.log(`Docker renderer initialized with volume: ${volumePath}`);

// POST /render - Synchronous render (blocks until complete)
app.post('/render', async (req, res) => {
  try {
    const { template, quality } = req.body as {
      template: Template;
      quality?: 'draft' | 'standard' | 'high';
    };

    if (!template) {
      res.status(400).json({ success: false, error: 'template is required' });
      return;
    }

    console.log(`[API] Starting synchronous render: ${template.output.width}x${template.output.height} @ ${template.output.fps}fps`);

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
      chunksRendered: result.chunksRendered,
    });
  } catch (error) {
    console.error('[API] Render error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : String(error),
    });
  }
});

// POST /render/async - Start async render (returns immediately)
app.post('/render/async', async (req, res) => {
  try {
    const { template, quality } = req.body as {
      template: Template;
      quality?: 'draft' | 'standard' | 'high';
    };

    if (!template) {
      res.status(400).json({ success: false, error: 'template is required' });
      return;
    }

    console.log(`[API] Starting async render: ${template.output.width}x${template.output.height} @ ${template.output.fps}fps`);

    const jobId = await renderer.startRenderAsync({
      template,
      quality,
    });

    res.json({
      success: true,
      jobId,
      statusUrl: `/render/${jobId}`,
    });
  } catch (error) {
    console.error('[API] Async render error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : String(error),
    });
  }
});

// GET /render/:jobId - Poll job status
app.get('/render/:jobId', async (req, res) => {
  try {
    const { jobId } = req.params;
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

// DELETE /render/:jobId - Cancel job
app.delete('/render/:jobId', async (req, res) => {
  try {
    const { jobId } = req.params;
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

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', provider: 'docker', volumePath });
});

const PORT = parseInt(process.env.PORT || '3000');
app.listen(PORT, () => {
  console.log(`Docker rendering API server running on port ${PORT}`);
  console.log(`Volume path: ${volumePath}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});
