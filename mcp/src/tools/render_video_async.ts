import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { createNodeRenderer } from '@rendervid/renderer-node';
import type { Template } from '@rendervid/core';
import { createDefaultComponentDefaultsManager, validateMotionBlurConfig } from '@rendervid/core';
import { RenderVideoInputSchema } from '../types.js';
import { createLogger } from '../utils/logger.js';
import { preprocessTemplateFiles } from '../utils/template-preprocessor.js';
import { jobManager } from '../utils/job-manager.js';
import * as os from 'os';
import * as path from 'path';

const logger = createLogger('render_video_async');

export const startRenderAsyncTool = {
  name: 'start_render_async',
  description: `Start a video render in the background (async). Use this for long videos (>30 seconds) that would timeout with render_video.

WHEN TO USE:
- Videos longer than 30 seconds
- High quality renders that take several minutes
- Multiple videos rendering in parallel
- Any render that might take more than 60 seconds
- Videos with motion blur (especially high sample counts)

RETURNS IMMEDIATELY with a job ID. Use check_render_status to monitor progress.

All parameters same as render_video. See render_video for complete documentation.

MOTION BLUR NOTE:
Motion blur multiplies render time by sample count (10 samples = 10× slower).
For motion-blurred videos, use start_render_async instead of render_video to avoid timeout.`,
  inputSchema: zodToJsonSchema(RenderVideoInputSchema),
};

export const checkRenderStatusTool = {
  name: 'check_render_status',
  description: `Check the status of an async video render job started with start_render_async.

RETURNS:
- status: "queued" | "rendering" | "completed" | "failed"
- progress: percentage (0-100)
- currentFrame / totalFrames
- eta: estimated time remaining (seconds)
- outputPath: available when completed
- error: available if failed`,
  inputSchema: zodToJsonSchema(z.object({
    jobId: z.string().describe('Job ID returned from start_render_async'),
  })),
};

export const listRenderJobsTool = {
  name: 'list_render_jobs',
  description: `List all render jobs (active and recent).

USEFUL FOR:
- Checking what renders are currently running
- Finding completed renders
- Debugging failed renders`,
  inputSchema: zodToJsonSchema(z.object({
    activeOnly: z.boolean().optional().default(false).describe('Only show active (queued/rendering) jobs'),
  })),
};

export async function executeStartRenderAsync(args: unknown): Promise<string> {
  try {
    const input = RenderVideoInputSchema.parse(args);

    // Validate motion blur configuration if provided
    if (input.motionBlur) {
      const motionBlurErrors = validateMotionBlurConfig(input.motionBlur);
      if (motionBlurErrors.length > 0) {
        logger.error('Invalid motion blur configuration', { errors: motionBlurErrors });
        return JSON.stringify({
          success: false,
          error: 'Invalid motion blur configuration',
          details: motionBlurErrors,
          suggestion: 'Check motion blur parameters: samples (2-32), shutterAngle (0-360), minSamples ≤ samples, motionThreshold (0.0001-1.0)',
        }, null, 2);
      }
    }

    // Validate output path
    let outputPath = input.outputPath;
    if (outputPath.startsWith('~/')) {
      outputPath = path.join(os.homedir(), outputPath.slice(2));
    }

    if (os.platform() === 'darwin' && outputPath.startsWith('/home/')) {
      const filename = path.basename(outputPath);
      const pathParts = outputPath.split('/').filter(Boolean);

      if (pathParts.includes('Downloads')) {
        outputPath = path.join(os.homedir(), 'Downloads', filename);
      } else if (pathParts.includes('Desktop')) {
        outputPath = path.join(os.homedir(), 'Desktop', filename);
      } else if (pathParts.includes('Documents')) {
        outputPath = path.join(os.homedir(), 'Documents', filename);
      } else {
        outputPath = path.join(os.homedir(), 'Downloads', filename);
      }
    }

    // Create job
    const jobId = jobManager.createJob(
      input.template,
      input.inputs || {},
      {
        outputPath,
        format: input.format,
        quality: input.quality,
        renderWaitTime: input.renderWaitTime,
        motionBlur: input.motionBlur,
      }
    );

    logger.info('Created async render job', { jobId, outputPath });

    // Start render in background (don't await)
    executeRenderInBackground(jobId).catch(error => {
      logger.error('Background render failed', { jobId, error });
    });

    return JSON.stringify({
      success: true,
      jobId,
      message: 'Render started in background',
      tip: `Use check_render_status with jobId="${jobId}" to monitor progress`,
    }, null, 2);
  } catch (error) {
    logger.error('Failed to start async render', { error });
    return JSON.stringify({
      success: false,
      error: error instanceof Error ? error.message : String(error),
    }, null, 2);
  }
}

export async function executeCheckRenderStatus(args: unknown): Promise<string> {
  try {
    const { jobId } = z.object({ jobId: z.string() }).parse(args);

    const job = jobManager.getJob(jobId);
    if (!job) {
      return JSON.stringify({
        success: false,
        error: 'Job not found',
        jobId,
      }, null, 2);
    }

    const response: any = {
      success: true,
      jobId: job.id,
      status: job.status,
      progress: job.progress.toFixed(1) + '%',
      phase: job.phase,
    };

    if (job.currentFrame && job.totalFrames) {
      response.frame = `${job.currentFrame}/${job.totalFrames}`;
    }

    if (job.eta) {
      response.eta = `${job.eta.toFixed(0)}s`;
    }

    if (job.status === 'completed') {
      const renderTimeMs = job.endTime! - job.startTime;
      const duration = (renderTimeMs / 1000).toFixed(2);
      response.outputPath = job.outputPath;
      response.renderTimeMs = renderTimeMs; // Exact render time in milliseconds (for cost computation)
      response.renderTime = `${duration}s`;
      response.message = 'Render completed successfully';
    }

    if (job.status === 'failed') {
      response.error = job.error;
      response.message = 'Render failed';
    }

    if (job.status === 'queued') {
      response.message = 'Waiting to start...';
    }

    if (job.status === 'rendering') {
      response.message = 'Rendering in progress...';
    }

    return JSON.stringify(response, null, 2);
  } catch (error) {
    return JSON.stringify({
      success: false,
      error: error instanceof Error ? error.message : String(error),
    }, null, 2);
  }
}

export async function executeListRenderJobs(args: unknown): Promise<string> {
  try {
    const { activeOnly } = z.object({
      activeOnly: z.boolean().optional().default(false),
    }).parse(args);

    const jobs = activeOnly ? jobManager.getActiveJobs() : jobManager.getAllJobs();

    if (jobs.length === 0) {
      return JSON.stringify({
        success: true,
        jobs: [],
        message: activeOnly ? 'No active jobs' : 'No jobs found',
      }, null, 2);
    }

    const jobList = jobs.map(job => {
      const result: any = {
        jobId: job.id,
        status: job.status,
        progress: job.progress.toFixed(1) + '%',
        phase: job.phase,
      };

      if (job.currentFrame && job.totalFrames) {
        result.frame = `${job.currentFrame}/${job.totalFrames}`;
      }

      if (job.eta) {
        result.eta = `${job.eta.toFixed(0)}s`;
      }

      if (job.status === 'completed') {
        result.outputPath = job.outputPath;
      }

      if (job.status === 'failed') {
        result.error = job.error;
      }

      const ageSeconds = Math.floor((Date.now() - job.startTime) / 1000);
      result.age = ageSeconds < 60 ? `${ageSeconds}s ago` : `${Math.floor(ageSeconds / 60)}m ago`;

      return result;
    });

    return JSON.stringify({
      success: true,
      count: jobList.length,
      jobs: jobList,
    }, null, 2);
  } catch (error) {
    return JSON.stringify({
      success: false,
      error: error instanceof Error ? error.message : String(error),
    }, null, 2);
  }
}

/**
 * Execute render in background
 */
async function executeRenderInBackground(jobId: string): Promise<void> {
  const job = jobManager.getJob(jobId);
  if (!job) return;

  try {
    logger.info('Starting background render', { jobId });

    // Preprocess template
    const preprocessResult = await preprocessTemplateFiles(job.template, {
      maxBase64SizeKB: 500,
    });

    if (preprocessResult.errors.length > 0) {
      throw new Error(`Preprocessing failed: ${preprocessResult.errors.join(', ')}`);
    }

    // Create renderer
    const defaultsManager = createDefaultComponentDefaultsManager();
    const renderer = createNodeRenderer({
      componentDefaultsManager: defaultsManager as any,
    });

    // Get codec settings
    const codecSettings = getCodecSettings(
      job.renderOptions.format || 'mp4',
      job.renderOptions.quality || 'high'
    );

    // Merge inputs
    const mergedInputs = {
      ...(job.template.defaults || {}),
      ...job.inputs,
    };

    // Auto-adjust renderWaitTime based on template content
    let renderWaitTime = job.renderOptions.renderWaitTime || 100;
    const hasMediaLayers = detectMediaLayers(preprocessResult.template);

    if (hasMediaLayers && !job.renderOptions.renderWaitTime) {
      // Template has images/videos and user didn't specify renderWaitTime
      // Use 500ms to ensure media loads properly
      renderWaitTime = 500;
      logger.info('Auto-adjusted renderWaitTime for media layers', {
        jobId,
        from: 100,
        to: 500,
        reason: 'Template contains image/video/audio layers',
      });
    }

    // Render with progress tracking
    const result = await renderer.renderVideo({
      template: preprocessResult.template as Template,
      inputs: mergedInputs,
      outputPath: job.renderOptions.outputPath,
      codec: codecSettings.codec,
      quality: codecSettings.quality,
      renderWaitTime: renderWaitTime,
      motionBlur: job.renderOptions.motionBlur,
      onProgress: (progress: any) => {
        jobManager.updateProgress(jobId, {
          phase: progress.phase,
          percent: progress.percent,
          currentFrame: progress.currentFrame,
          totalFrames: progress.totalFrames,
          eta: progress.eta,
        });

        logger.info('Render progress', {
          jobId,
          phase: progress.phase,
          percent: progress.percent?.toFixed(1),
          frame: `${progress.currentFrame}/${progress.totalFrames}`,
        });
      },
    });

    if (!result.success) {
      throw new Error(result.error || 'Render failed');
    }

    jobManager.completeJob(jobId, result.outputPath);
    logger.info('Background render completed', { jobId, outputPath: result.outputPath });
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    jobManager.failJob(jobId, errorMsg);
    logger.error('Background render failed', { jobId, error: errorMsg });
  }
}

/**
 * Detect if template has media layers (image, video, audio)
 * Used to auto-adjust renderWaitTime for proper media loading
 */
function detectMediaLayers(template: any): boolean {
  if (!template?.composition?.scenes) return false;

  for (const scene of template.composition.scenes) {
    if (!scene.layers) continue;

    for (const layer of scene.layers) {
      if (layer.type === 'image' || layer.type === 'video' || layer.type === 'audio') {
        return true;
      }
    }
  }

  return false;
}

function getCodecSettings(format: string, quality: string): {
  codec: 'libx264' | 'libx265' | 'libvpx' | 'libvpx-vp9' | 'prores';
  quality: number;
} {
  const codecMap: Record<string, 'libx264' | 'libx265' | 'libvpx' | 'libvpx-vp9' | 'prores'> = {
    mp4: 'libx264',
    webm: 'libvpx-vp9',
    mov: 'libx264',
    gif: 'libx264',
  };

  const qualityMap: Record<string, number> = {
    draft: 28,
    standard: 23,
    high: 18,
    lossless: 0,
  };

  return {
    codec: codecMap[format] || 'libx264',
    quality: qualityMap[quality] || 23,
  };
}
