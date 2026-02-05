/**
 * Motion Blur Frame Renderer
 *
 * Orchestrates temporal sample generation and compositing for motion blur.
 * Calculates fractional frame times based on shutter angle and renders
 * multiple sub-frames that are then composited into the final blurred frame.
 */

import type { ResolvedMotionBlurConfig } from '@rendervid/core';
import { MotionBlurCompositor } from './motion-blur-compositor';
import type { FrameCapturer } from './frame-capturer';

/**
 * Configuration for motion blur rendering
 */
export interface MotionBlurRendererConfig {
  /** Motion blur configuration */
  motionBlur: ResolvedMotionBlurConfig;
  /** Frame width */
  width: number;
  /** Frame height */
  height: number;
}

/**
 * Motion blur frame renderer
 *
 * Handles temporal supersampling: renders multiple sub-frames at fractional
 * time offsets per output frame, then composites with weighted averaging.
 */
export class MotionBlurFrameRenderer {
  private config: MotionBlurRendererConfig;
  private compositor: MotionBlurCompositor;

  constructor(config: MotionBlurRendererConfig) {
    this.config = config;

    this.compositor = new MotionBlurCompositor({
      width: config.width,
      height: config.height,
      samples: config.motionBlur.samples,
    });
  }

  /**
   * Calculate temporal sample offsets for a frame
   *
   * Distributes samples evenly across the shutter window.
   * Shutter is centered around the frame time by default.
   *
   * Example (frame=10, samples=8, shutterAngle=180°):
   * - shutterFraction = 0.5 (half frame)
   * - shutterPhase = -0.5 (centered)
   * - shutterStart = -0.25
   * - shutterEnd = 0.25
   * - Returns: [9.75, 9.82, 9.89, 9.96, 10.04, 10.11, 10.18, 10.25]
   *
   * With stochastic=true, adds random jitter to reduce banding
   *
   * @param frame - Integer frame number to render
   * @returns Array of fractional frame times
   */
  private calculateSampleOffsets(frame: number): number[] {
    const { shutterAngle, samples, stochastic, blurAmount } = this.config.motionBlur;

    // Shutter fraction (0-1) based on angle
    let shutterFraction = shutterAngle / 360;

    // Apply blur amount multiplier
    shutterFraction *= blurAmount;

    // Shutter phase: -0.5 = centered around frame time
    // This matches cinematic cameras where exposure is centered on the frame
    const shutterPhase = -0.5;

    // Calculate shutter window
    const shutterStart = shutterPhase * shutterFraction;
    const shutterEnd = shutterStart + shutterFraction;

    // Distribute samples across shutter window
    const sampleTimes: number[] = [];
    const sampleSpacing = (shutterEnd - shutterStart) / (samples - 1);

    for (let i = 0; i < samples; i++) {
      // Normalized position (0 to 1) across sample range
      const t = i / (samples - 1);

      // Base offset relative to frame time
      let offset = shutterStart + t * (shutterEnd - shutterStart);

      // Add stochastic jitter if enabled
      if (stochastic && samples > 2) {
        // Use blue noise-like distribution (random but avoiding clumping)
        // Add jitter within ±50% of sample spacing
        const jitter = (Math.random() - 0.5) * sampleSpacing * 0.5;
        offset += jitter;

        // Clamp to shutter window
        offset = Math.max(shutterStart, Math.min(shutterEnd, offset));
      }

      sampleTimes.push(frame + offset);
    }

    // Sort to maintain temporal order (important for stochastic)
    if (stochastic) {
      sampleTimes.sort((a, b) => a - b);
    }

    return sampleTimes;
  }

  /**
   * Calculate optimal sample count for a frame based on motion
   *
   * @param frame - Frame number
   * @param capturer - Frame capturer
   * @param previousFrame - Previous frame buffer (optional)
   * @returns Optimal sample count
   */
  private async calculateOptimalSamples(
    frame: number,
    capturer: FrameCapturer,
    previousFrame?: Buffer
  ): Promise<number> {
    const { samples, minSamples, maxSamples, variableSampleRate, motionThreshold, preview } = this.config.motionBlur;

    // Preview mode: always use minimal samples
    if (preview) {
      return 2;
    }

    // Variable sample rate disabled: use configured samples
    if (!variableSampleRate) {
      return samples;
    }

    // Need previous frame to calculate motion
    if (!previousFrame) {
      return samples;
    }

    // Calculate motion magnitude
    const currentFrame = await capturer.captureFrame(frame);
    const motionMagnitude = await this.calculateFrameDifference(currentFrame, previousFrame);

    // Map motion magnitude to sample count
    // Low motion (< threshold): use minSamples
    // High motion (> threshold * 3): use maxSamples
    // In between: interpolate
    const effectiveMax = maxSamples || samples;
    const effectiveMin = minSamples;

    if (motionMagnitude < motionThreshold) {
      return effectiveMin;
    } else if (motionMagnitude > motionThreshold * 3) {
      return effectiveMax;
    } else {
      // Linear interpolation
      const t = (motionMagnitude - motionThreshold) / (motionThreshold * 2);
      return Math.round(effectiveMin + t * (effectiveMax - effectiveMin));
    }
  }

  /**
   * Render a motion-blurred frame by capturing and compositing samples
   *
   * @param frame - Integer frame number to render
   * @param capturer - Frame capturer to use for sub-frame rendering
   * @param previousFrame - Previous frame buffer (for variable sample rate)
   * @returns Composited motion-blurred frame buffer (PNG)
   */
  async renderBlurredFrame(
    frame: number,
    capturer: FrameCapturer,
    previousFrame?: Buffer
  ): Promise<Buffer> {
    // Determine optimal sample count
    const optimalSamples = await this.calculateOptimalSamples(frame, capturer, previousFrame);

    // Temporarily adjust compositor if sample count changed
    if (optimalSamples !== this.config.motionBlur.samples) {
      const originalSamples = this.compositor.getConfig().samples;
      this.compositor = new MotionBlurCompositor({
        width: this.config.width,
        height: this.config.height,
        samples: optimalSamples,
      });

      // Temporarily adjust our config
      const originalConfigSamples = this.config.motionBlur.samples;
      this.config.motionBlur.samples = optimalSamples;

      try {
        return await this.renderBlurredFrameInternal(frame, capturer);
      } finally {
        // Restore original config
        this.config.motionBlur.samples = originalConfigSamples;
        this.compositor = new MotionBlurCompositor({
          width: this.config.width,
          height: this.config.height,
          samples: originalSamples,
        });
      }
    }

    return this.renderBlurredFrameInternal(frame, capturer);
  }

  /**
   * Internal method to render blurred frame (after sample count is determined)
   */
  private async renderBlurredFrameInternal(
    frame: number,
    capturer: FrameCapturer
  ): Promise<Buffer> {
    // Calculate temporal sample offsets
    const sampleTimes = this.calculateSampleOffsets(frame);

    // Capture all samples
    const sampleBuffers: Buffer[] = [];
    for (const sampleTime of sampleTimes) {
      const buffer = await capturer.captureFrame(sampleTime);
      sampleBuffers.push(buffer);
    }

    // Composite samples into final frame
    const composited = await this.compositor.composite(sampleBuffers);

    return composited;
  }

  /**
   * Render a motion-blurred frame using multiple capturers in parallel
   *
   * Distributes sample rendering across multiple browser instances for
   * better performance when concurrency > 1.
   *
   * @param frame - Integer frame number to render
   * @param capturers - Array of frame capturers for parallel rendering
   * @param previousFrame - Previous frame buffer (for variable sample rate)
   * @returns Composited motion-blurred frame buffer (PNG)
   */
  async renderBlurredFrameParallel(
    frame: number,
    capturers: FrameCapturer[],
    previousFrame?: Buffer
  ): Promise<Buffer> {
    if (capturers.length === 0) {
      throw new Error('At least one capturer required');
    }

    // Determine optimal sample count
    const optimalSamples = await this.calculateOptimalSamples(frame, capturers[0], previousFrame);

    // Temporarily adjust compositor if sample count changed
    if (optimalSamples !== this.config.motionBlur.samples) {
      const originalSamples = this.compositor.getConfig().samples;
      this.compositor = new MotionBlurCompositor({
        width: this.config.width,
        height: this.config.height,
        samples: optimalSamples,
      });

      // Temporarily adjust our config
      const originalConfigSamples = this.config.motionBlur.samples;
      this.config.motionBlur.samples = optimalSamples;

      try {
        return await this.renderBlurredFrameParallelInternal(frame, capturers);
      } finally {
        // Restore original config
        this.config.motionBlur.samples = originalConfigSamples;
        this.compositor = new MotionBlurCompositor({
          width: this.config.width,
          height: this.config.height,
          samples: originalSamples,
        });
      }
    }

    return this.renderBlurredFrameParallelInternal(frame, capturers);
  }

  /**
   * Internal method for parallel rendering (after sample count is determined)
   */
  private async renderBlurredFrameParallelInternal(
    frame: number,
    capturers: FrameCapturer[]
  ): Promise<Buffer> {
    const { samples } = this.config.motionBlur;

    // Calculate temporal sample offsets
    const sampleTimes = this.calculateSampleOffsets(frame);

    // Distribute samples across capturers
    const sampleBuffers: Buffer[] = new Array(samples);
    const capturePromises: Promise<void>[] = [];

    for (let i = 0; i < samples; i++) {
      const capturerIndex = i % capturers.length;
      const capturer = capturers[capturerIndex];
      const sampleTime = sampleTimes[i];

      const promise = (async () => {
        sampleBuffers[i] = await capturer.captureFrame(sampleTime);
      })();

      capturePromises.push(promise);
    }

    // Wait for all samples to complete
    await Promise.all(capturePromises);

    // Composite samples into final frame
    const composited = await this.compositor.composite(sampleBuffers);

    return composited;
  }

  /**
   * Determine if motion blur should be applied to a frame
   *
   * When adaptive sampling is enabled, compares the current frame with the
   * previous frame to detect motion. Returns true if motion exceeds threshold.
   *
   * @param frame - Current frame number
   * @param capturer - Frame capturer
   * @param previousFrame - Previous rendered frame buffer (optional)
   * @returns True if motion blur should be applied with full samples
   */
  async shouldApplyMotionBlur(
    frame: number,
    capturer: FrameCapturer,
    previousFrame?: Buffer
  ): Promise<boolean> {
    const { adaptive, motionThreshold } = this.config.motionBlur;

    // If adaptive is disabled, always apply full blur
    if (!adaptive || !previousFrame) {
      return true;
    }

    // Capture current frame (single sample at frame time)
    const currentFrame = await capturer.captureFrame(frame);

    // Calculate pixel difference between current and previous frames
    const difference = await this.calculateFrameDifference(
      currentFrame,
      previousFrame
    );

    // Apply blur if difference exceeds threshold
    return difference >= motionThreshold;
  }

  /**
   * Calculate normalized difference between two frames
   *
   * Returns a value between 0 (identical) and 1 (completely different).
   * Uses mean absolute difference of pixel values.
   *
   * @param frame1 - First frame buffer
   * @param frame2 - Second frame buffer
   * @returns Normalized difference (0-1)
   */
  private async calculateFrameDifference(
    frame1: Buffer,
    frame2: Buffer
  ): Promise<number> {
    const { width, height } = this.config;

    // Import sharp (already imported at top)
    const sharp = (await import('sharp')).default;

    // Convert both frames to raw RGBA
    const raw1 = await sharp(frame1).ensureAlpha().raw().toBuffer();
    const raw2 = await sharp(frame2).ensureAlpha().raw().toBuffer();

    if (raw1.length !== raw2.length) {
      throw new Error('Frame buffers have different sizes');
    }

    // Calculate mean absolute difference
    let totalDiff = 0;
    for (let i = 0; i < raw1.length; i++) {
      totalDiff += Math.abs(raw1[i] - raw2[i]);
    }

    // Normalize to 0-1 range
    const maxDiff = raw1.length * 255; // Maximum possible difference
    const normalized = totalDiff / maxDiff;

    return normalized;
  }

  /**
   * Render a frame with adaptive sampling
   *
   * Automatically reduces sample count on static/slow-moving frames.
   *
   * @param frame - Frame number to render
   * @param capturer - Frame capturer
   * @param previousFrame - Previous rendered frame buffer (optional)
   * @returns Rendered frame buffer
   */
  async renderFrameAdaptive(
    frame: number,
    capturer: FrameCapturer,
    previousFrame?: Buffer
  ): Promise<Buffer> {
    const { adaptive, samples, minSamples } = this.config.motionBlur;

    if (!adaptive) {
      // No adaptive sampling, use full blur
      return this.renderBlurredFrame(frame, capturer);
    }

    // Check if motion blur is needed
    const needsFullBlur = await this.shouldApplyMotionBlur(
      frame,
      capturer,
      previousFrame
    );

    if (needsFullBlur) {
      // High motion: use full sample count
      return this.renderBlurredFrame(frame, capturer);
    } else {
      // Low motion: use reduced sample count
      // Temporarily adjust compositor config
      const originalSamples = this.compositor.getConfig().samples;

      this.compositor = new MotionBlurCompositor({
        width: this.config.width,
        height: this.config.height,
        samples: minSamples,
      });

      // Temporarily adjust our config
      const originalConfig = this.config.motionBlur.samples;
      this.config.motionBlur.samples = minSamples;

      try {
        const result = await this.renderBlurredFrame(frame, capturer);
        return result;
      } finally {
        // Restore original config
        this.config.motionBlur.samples = originalConfig;
        this.compositor = new MotionBlurCompositor({
          width: this.config.width,
          height: this.config.height,
          samples: originalSamples,
        });
      }
    }
  }

  /**
   * Get the configuration for this renderer
   */
  getConfig(): Readonly<MotionBlurRendererConfig> {
    return {
      ...this.config,
      motionBlur: { ...this.config.motionBlur },
    };
  }
}
