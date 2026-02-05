/**
 * Motion Blur Compositor
 *
 * Composites multiple temporal samples into a single motion-blurred frame
 * using weighted averaging with Sharp for high-performance image processing.
 */

import sharp from 'sharp';

/**
 * Configuration for the compositor
 */
export interface CompositorConfig {
  /** Output frame width */
  width: number;
  /** Output frame height */
  height: number;
  /** Number of samples to composite */
  samples: number;
}

/**
 * Motion blur compositor using Sharp for frame composition
 */
export class MotionBlurCompositor {
  private config: CompositorConfig;
  private channelCount = 4; // RGBA

  constructor(config: CompositorConfig) {
    this.config = config;
  }

  /**
   * Composite multiple sample buffers with weighted averaging
   *
   * Algorithm:
   * 1. Convert all PNG buffers to raw RGBA
   * 2. Accumulate pixels in Float32Array (avoid rounding errors)
   * 3. Average: pixel[i] = sum(samples[i]) / N
   * 4. Convert back to PNG
   *
   * @param sampleBuffers - Array of PNG buffers (one per sample)
   * @returns Composited PNG buffer
   */
  async composite(sampleBuffers: Buffer[]): Promise<Buffer> {
    const { width, height, samples } = this.config;

    // Fast path: single sample just returns input
    if (sampleBuffers.length === 1) {
      return sampleBuffers[0];
    }

    if (sampleBuffers.length !== samples) {
      throw new Error(
        `Expected ${samples} sample buffers, got ${sampleBuffers.length}`
      );
    }

    const pixelCount = width * height;
    const bufferSize = pixelCount * this.channelCount;

    // Accumulator for weighted averaging (use Float32 to avoid rounding errors)
    const accumulator = new Float32Array(bufferSize);

    // Convert all samples to raw RGBA and accumulate
    for (let i = 0; i < sampleBuffers.length; i++) {
      const rawBuffer = await sharp(sampleBuffers[i])
        .ensureAlpha() // Ensure RGBA format
        .raw()
        .toBuffer();

      // Add to accumulator
      for (let j = 0; j < bufferSize; j++) {
        accumulator[j] += rawBuffer[j];
      }
    }

    // Average the accumulated values
    const weight = 1.0 / samples;
    const averaged = new Uint8Array(bufferSize);

    for (let i = 0; i < bufferSize; i++) {
      averaged[i] = Math.round(accumulator[i] * weight);
    }

    // Convert averaged buffer back to PNG
    const result = await sharp(Buffer.from(averaged.buffer), {
      raw: {
        width,
        height,
        channels: this.channelCount,
      },
    })
      .png()
      .toBuffer();

    return result;
  }

  /**
   * Get the configuration for this compositor
   */
  getConfig(): Readonly<CompositorConfig> {
    return { ...this.config };
  }
}
