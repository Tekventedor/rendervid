import ffmpeg from 'fluent-ffmpeg';
import { createWriteStream, promises as fs } from 'fs';
import path from 'path';
import type { FFmpegConfig, RenderProgress } from './types';

/**
 * Options for FFmpeg encoding
 */
export interface EncodeOptions {
  /** Input frame directory or pattern */
  inputPattern: string;
  /** Output file path */
  outputPath: string;
  /** Frame rate */
  fps: number;
  /** Width */
  width: number;
  /** Height */
  height: number;
  /** Video codec */
  codec?: 'libx264' | 'libx265' | 'libvpx' | 'libvpx-vp9' | 'prores';
  /** Quality CRF (0-51) */
  quality?: number;
  /** Pixel format */
  pixelFormat?: string;
  /** Audio file to include */
  audioFile?: string;
  /** Audio codec */
  audioCodec?: 'aac' | 'mp3' | 'opus' | 'none';
  /** Audio bitrate */
  audioBitrate?: string;
  /** Progress callback */
  onProgress?: (progress: RenderProgress) => void;
  /** Start time for progress calculation */
  startTime?: number;
  /** Total frames for progress calculation */
  totalFrames?: number;
}

/**
 * Options for creating GIF
 */
export interface GifOptions {
  /** Input frame directory or pattern */
  inputPattern: string;
  /** Output file path */
  outputPath: string;
  /** Frame rate */
  fps: number;
  /** Width (optional, for scaling) */
  width?: number;
  /** Height (optional, for scaling) */
  height?: number;
  /** Number of colors (2-256, default: 256) */
  colors?: number;
  /** Dithering algorithm */
  dither?: 'none' | 'floyd_steinberg' | 'bayer';
}

/**
 * FFmpeg encoder class
 */
export class FFmpegEncoder {
  private config: FFmpegConfig;

  constructor(config: FFmpegConfig = {}) {
    this.config = config;

    // Set custom paths if provided
    if (config.ffmpegPath) {
      ffmpeg.setFfmpegPath(config.ffmpegPath);
    }
    if (config.ffprobePath) {
      ffmpeg.setFfprobePath(config.ffprobePath);
    }
  }

  /**
   * Encode frames to video
   */
  async encodeToVideo(options: EncodeOptions): Promise<void> {
    const {
      inputPattern,
      outputPath,
      fps,
      width,
      height,
      codec = 'libx264',
      quality = 23,
      pixelFormat = 'yuv420p',
      audioFile,
      audioCodec = 'aac',
      audioBitrate = '128k',
      onProgress,
      startTime = Date.now(),
      totalFrames = 0,
    } = options;

    return new Promise((resolve, reject) => {
      let command = ffmpeg()
        .input(inputPattern)
        .inputFPS(fps)
        .videoCodec(codec)
        .outputOptions([
          `-crf ${quality}`,
          `-pix_fmt ${pixelFormat}`,
          `-preset medium`,
        ])
        .size(`${width}x${height}`);

      // Add audio if provided
      if (audioFile && audioCodec !== 'none') {
        command = command
          .input(audioFile)
          .audioCodec(audioCodec)
          .audioBitrate(audioBitrate);
      }

      command
        .output(outputPath)
        .on('progress', (progress) => {
          if (onProgress && totalFrames > 0) {
            const elapsed = (Date.now() - startTime) / 1000;
            const currentFrame = progress.frames || 0;
            const percent = (currentFrame / totalFrames) * 100;
            const fps = progress.currentFps || currentFrame / elapsed;
            const remainingFrames = totalFrames - currentFrame;
            const eta = fps > 0 ? remainingFrames / fps : undefined;

            onProgress({
              phase: 'encoding',
              currentFrame,
              totalFrames,
              percent: Math.min(100, percent),
              eta,
              elapsed,
              fps,
            });
          }
        })
        .on('error', (err) => {
          reject(new Error(`FFmpeg error: ${err.message}`));
        })
        .on('end', () => {
          resolve();
        })
        .run();
    });
  }

  /**
   * Encode frames to GIF
   */
  async encodeToGif(options: GifOptions): Promise<void> {
    const {
      inputPattern,
      outputPath,
      fps,
      width,
      height,
      colors = 256,
      dither = 'floyd_steinberg',
    } = options;

    // Create a palette first for better quality
    const tempDir = path.dirname(outputPath);
    const palettePath = path.join(tempDir, 'palette.png');

    // Generate palette
    await new Promise<void>((resolve, reject) => {
      let filterStr = `fps=${fps}`;
      if (width || height) {
        filterStr += `,scale=${width || -1}:${height || -1}:flags=lanczos`;
      }
      filterStr += `,palettegen=max_colors=${colors}`;

      ffmpeg()
        .input(inputPattern)
        .inputFPS(fps)
        .complexFilter(filterStr)
        .output(palettePath)
        .on('error', reject)
        .on('end', () => resolve())
        .run();
    });

    // Generate GIF using palette
    await new Promise<void>((resolve, reject) => {
      let filterStr = `fps=${fps}`;
      if (width || height) {
        filterStr += `,scale=${width || -1}:${height || -1}:flags=lanczos`;
      }

      const ditherStr = dither === 'none' ? '' : `:dither=${dither}`;
      const paletteFilter = `[0:v][1:v]paletteuse${ditherStr}`;

      ffmpeg()
        .input(inputPattern)
        .inputFPS(fps)
        .input(palettePath)
        .complexFilter([filterStr, paletteFilter].join(';'))
        .output(outputPath)
        .on('error', reject)
        .on('end', () => resolve())
        .run();
    });

    // Clean up palette file
    await fs.unlink(palettePath).catch(() => {});
  }

  /**
   * Get video duration using FFprobe
   */
  async getVideoDuration(filePath: string): Promise<number> {
    return new Promise((resolve, reject) => {
      ffmpeg.ffprobe(filePath, (err, metadata) => {
        if (err) {
          reject(err);
        } else {
          resolve(metadata.format.duration || 0);
        }
      });
    });
  }

  /**
   * Get file size
   */
  async getFileSize(filePath: string): Promise<number> {
    const stats = await fs.stat(filePath);
    return stats.size;
  }

  /**
   * Check if FFmpeg is available
   */
  async checkFFmpeg(): Promise<boolean> {
    return new Promise((resolve) => {
      ffmpeg.getAvailableFormats((err) => {
        resolve(!err);
      });
    });
  }
}

/**
 * Create an FFmpeg encoder
 */
export function createFFmpegEncoder(config: FFmpegConfig = {}): FFmpegEncoder {
  return new FFmpegEncoder(config);
}
