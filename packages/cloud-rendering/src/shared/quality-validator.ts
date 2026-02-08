/**
 * Quality validation utilities for rendered videos
 */

import { spawn } from 'child_process';
import { existsSync } from 'fs';

export interface VideoQualityMetrics {
  duration: number;
  fps: number;
  resolution: { width: number; height: number };
  bitrate: number;
  hasAudio: boolean;
  fileSize: number;
}

/**
 * Extract video quality metrics using ffprobe
 */
export async function getVideoMetrics(videoPath: string): Promise<VideoQualityMetrics> {
  if (!existsSync(videoPath)) {
    throw new Error(`Video file not found: ${videoPath}`);
  }

  return new Promise((resolve, reject) => {
    const ffprobe = spawn('ffprobe', [
      '-v',
      'quiet',
      '-print_format',
      'json',
      '-show_format',
      '-show_streams',
      videoPath,
    ]);

    let stdout = '';
    let stderr = '';

    ffprobe.stdout.on('data', (data) => {
      stdout += data.toString();
    });

    ffprobe.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    ffprobe.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(`ffprobe failed: ${stderr}`));
        return;
      }

      try {
        const data = JSON.parse(stdout);

        const videoStream = data.streams.find((s: any) => s.codec_type === 'video');
        const audioStream = data.streams.find((s: any) => s.codec_type === 'audio');

        const metrics: VideoQualityMetrics = {
          duration: parseFloat(data.format.duration),
          fps: eval(videoStream.r_frame_rate), // e.g., "30/1" -> 30
          resolution: {
            width: videoStream.width,
            height: videoStream.height,
          },
          bitrate: parseInt(data.format.bit_rate),
          hasAudio: !!audioStream,
          fileSize: parseInt(data.format.size),
        };

        resolve(metrics);
      } catch (error) {
        reject(error);
      }
    });
  });
}

/**
 * Validate video quality meets minimum standards
 */
export function validateVideoQuality(
  metrics: VideoQualityMetrics,
  expected: Partial<VideoQualityMetrics>
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (expected.duration && Math.abs(metrics.duration - expected.duration) > 0.1) {
    errors.push(
      `Duration mismatch: expected ${expected.duration}s, got ${metrics.duration}s`
    );
  }

  if (expected.fps && metrics.fps !== expected.fps) {
    errors.push(`FPS mismatch: expected ${expected.fps}, got ${metrics.fps}`);
  }

  if (expected.resolution) {
    if (metrics.resolution.width !== expected.resolution.width) {
      errors.push(
        `Width mismatch: expected ${expected.resolution.width}, got ${metrics.resolution.width}`
      );
    }
    if (metrics.resolution.height !== expected.resolution.height) {
      errors.push(
        `Height mismatch: expected ${expected.resolution.height}, got ${metrics.resolution.height}`
      );
    }
  }

  if (expected.hasAudio !== undefined && metrics.hasAudio !== expected.hasAudio) {
    errors.push(`Audio mismatch: expected ${expected.hasAudio}, got ${metrics.hasAudio}`);
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
