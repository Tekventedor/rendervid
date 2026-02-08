import { spawn } from 'child_process';
import { writeFileSync, unlinkSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';

/**
 * Options for encoding a video chunk
 */
export interface EncodeChunkOptions {
  /** Array of PNG frame buffers */
  frames: Buffer[];

  /** Frame rate (fps) */
  fps: number;

  /** Output file path */
  outputPath: string;

  /** Video codec (default: 'libx264') */
  codec?: string;

  /** Quality preset (default: 'medium') */
  preset?: 'ultrafast' | 'superfast' | 'veryfast' | 'faster' | 'fast' | 'medium' | 'slow' | 'slower' | 'veryslow';

  /** CRF quality (0-51, lower is better, default: 23) */
  crf?: number;

  /** Pixel format (default: 'yuv420p') */
  pixelFormat?: string;

  /** FFmpeg binary path (for cloud environments) */
  ffmpegPath?: string;

  /** Temporary directory for frames */
  tempDir?: string;
}

/**
 * Encode frames into a video chunk using FFmpeg
 *
 * @param options - Encoding options
 * @returns Promise that resolves when encoding is complete
 */
export async function encodeChunk(options: EncodeChunkOptions): Promise<void> {
  const {
    frames,
    fps,
    outputPath,
    codec = 'libx264',
    preset = 'medium',
    crf = 23,
    pixelFormat = 'yuv420p',
    ffmpegPath = 'ffmpeg',
    tempDir = '/tmp/rendervid-frames',
  } = options;

  // Create temp directory for frames
  if (!existsSync(tempDir)) {
    mkdirSync(tempDir, { recursive: true });
  }

  // Write frames to temp directory
  const frameFiles: string[] = [];
  for (let i = 0; i < frames.length; i++) {
    const framePath = join(tempDir, `frame-${String(i).padStart(6, '0')}.png`);
    writeFileSync(framePath, frames[i]);
    frameFiles.push(framePath);
  }

  try {
    // Run FFmpeg to encode frames
    const framePattern = join(tempDir, 'frame-%06d.png');

    const args = [
      '-y', // Overwrite output file
      '-framerate', fps.toString(),
      '-i', framePattern,
      '-c:v', codec,
      '-preset', preset,
      '-crf', crf.toString(),
      '-pix_fmt', pixelFormat,
      '-movflags', '+faststart', // Enable streaming
      outputPath,
    ];

    await runFFmpeg(ffmpegPath, args);
  } finally {
    // Clean up frame files
    for (const framePath of frameFiles) {
      try {
        unlinkSync(framePath);
      } catch {
        // Ignore cleanup errors
      }
    }
  }
}

/**
 * Run FFmpeg command
 */
function runFFmpeg(ffmpegPath: string, args: string[]): Promise<void> {
  return new Promise((resolve, reject) => {
    const process = spawn(ffmpegPath, args, {
      stdio: ['ignore', 'pipe', 'pipe'],
    });

    let stderr = '';

    process.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    process.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`FFmpeg exited with code ${code}\n${stderr}`));
      }
    });

    process.on('error', (error) => {
      reject(error);
    });
  });
}

/**
 * Get FFmpeg preset based on quality setting
 */
export function getPresetForQuality(
  quality: 'draft' | 'standard' | 'high'
): EncodeChunkOptions['preset'] {
  switch (quality) {
    case 'draft':
      return 'ultrafast';
    case 'standard':
      return 'medium';
    case 'high':
      return 'slow';
  }
}

/**
 * Get CRF value based on quality setting
 */
export function getCRFForQuality(quality: 'draft' | 'standard' | 'high'): number {
  switch (quality) {
    case 'draft':
      return 28; // Lower quality, faster
    case 'standard':
      return 23; // Balanced
    case 'high':
      return 18; // High quality, slower
  }
}
