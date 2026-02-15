/**
 * GIF optimization utilities for estimating file sizes and selecting optimal settings.
 */

/**
 * GIF optimization preset configuration
 */
export interface GifOptimizationPreset {
  /** Maximum width */
  maxWidth: number;
  /** Maximum height */
  maxHeight: number;
  /** Frame rate */
  fps: number;
  /** Number of colors (2-256) */
  colors: number;
  /** Dithering algorithm */
  dither: 'none' | 'floyd_steinberg' | 'bayer';
  /** Target max file size in bytes */
  maxFileSize: number;
  /** Loop count (0 = infinite) */
  loop: number;
}

/**
 * Estimate GIF file size in bytes.
 *
 * GIF uses LZW compression, so the actual size depends heavily on content complexity.
 * This provides a rough upper-bound estimate assuming moderate compression.
 *
 * @param width - Frame width in pixels
 * @param height - Frame height in pixels
 * @param frameCount - Total number of frames
 * @param colors - Number of colors in palette (2-256)
 * @returns Estimated file size in bytes
 */
export function estimateGifFileSize(
  width: number,
  height: number,
  frameCount: number,
  colors: number = 256
): number {
  if (width <= 0 || height <= 0 || frameCount <= 0 || colors <= 0) {
    return 0;
  }

  const clampedColors = Math.min(256, Math.max(2, colors));

  // Bits per pixel based on color count (GIF uses LZW with variable code sizes)
  const bitsPerPixel = Math.ceil(Math.log2(clampedColors));

  // Raw frame size in bytes (uncompressed)
  const rawFrameSize = width * height * bitsPerPixel / 8;

  // GIF LZW compression ratio estimate (typically 40-60% of raw for animated GIFs)
  const compressionRatio = 0.5;

  // Per-frame overhead (frame descriptor, local color table possibility, etc.)
  const frameOverhead = 20;

  // Global overhead (header, global color table, etc.)
  const globalOverhead = 800 + clampedColors * 3;

  const estimatedSize =
    globalOverhead +
    frameCount * (rawFrameSize * compressionRatio + frameOverhead);

  return Math.ceil(estimatedSize);
}

/**
 * Calculate optimal number of colors to meet a target file size.
 *
 * Uses binary search to find the highest color count that keeps
 * the estimated file size under the target.
 *
 * @param targetSizeBytes - Target maximum file size in bytes
 * @param width - Frame width in pixels
 * @param height - Frame height in pixels
 * @param frameCount - Total number of frames
 * @returns Optimal number of colors (2-256)
 */
export function calculateOptimalColors(
  targetSizeBytes: number,
  width: number,
  height: number,
  frameCount: number
): number {
  if (targetSizeBytes <= 0 || width <= 0 || height <= 0 || frameCount <= 0) {
    return 2;
  }

  // Binary search for the highest color count that fits under target
  let low = 2;
  let high = 256;
  let result = 2;

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    const estimated = estimateGifFileSize(width, height, frameCount, mid);

    if (estimated <= targetSizeBytes) {
      result = mid;
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }

  return result;
}

/**
 * Get a GIF optimization preset for a specific purpose.
 *
 * @param purpose - The intended use case
 * @returns Preset configuration
 */
export function getGifOptimizationPreset(
  purpose: 'social' | 'web' | 'email'
): GifOptimizationPreset {
  switch (purpose) {
    case 'social':
      return {
        maxWidth: 480,
        maxHeight: 480,
        fps: 15,
        colors: 128,
        dither: 'floyd_steinberg',
        maxFileSize: 8 * 1024 * 1024, // 8MB (Twitter/X limit)
        loop: 0,
      };
    case 'web':
      return {
        maxWidth: 640,
        maxHeight: 480,
        fps: 20,
        colors: 256,
        dither: 'floyd_steinberg',
        maxFileSize: 5 * 1024 * 1024, // 5MB for web performance
        loop: 0,
      };
    case 'email':
      return {
        maxWidth: 320,
        maxHeight: 240,
        fps: 10,
        colors: 64,
        dither: 'bayer',
        maxFileSize: 1 * 1024 * 1024, // 1MB for email clients
        loop: 0,
      };
  }
}
