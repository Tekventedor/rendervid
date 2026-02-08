import ffmpeg from 'fluent-ffmpeg';
import { createWriteStream, promises as fs } from 'fs';
import path from 'path';
import { spawn } from 'child_process';
import type { FFmpegConfig, RenderProgress } from './types';
import { detectGPUCapabilities, type GPUInfo, type HardwareEncoder } from './gpu-detector';

/**
 * Hardware acceleration options for specific GPU encoders
 */
export interface HardwareAccelerationOptions {
  /** Enable hardware acceleration (default: auto-detect) */
  enabled?: boolean;
  /** Preferred hardware encoder (auto-detect if not specified) */
  preferredEncoder?: HardwareEncoder;
  /** Fallback to software encoding if GPU unavailable (default: true) */
  fallbackToSoftware?: boolean;
  /** NVENC-specific options */
  nvenc?: {
    /** Encoding preset (default: 'p4') */
    preset?: 'p1' | 'p2' | 'p3' | 'p4' | 'p5' | 'p6' | 'p7';
    /** Tuning preset (default: 'hq') */
    tune?: 'hq' | 'll' | 'ull' | 'lossless';
    /** Rate control mode (default: 'vbr') */
    rc?: 'constqp' | 'vbr' | 'cbr' | 'vbr_minqp' | 'll_2pass_quality' | 'vbr_2pass';
  };
  /** VideoToolbox-specific options */
  videotoolbox?: {
    /** Allow software encoding fallback (default: true) */
    allow_sw?: boolean;
    /** Enable realtime encoding (default: false) */
    realtime?: boolean;
  };
  /** Quick Sync Video-specific options */
  qsv?: {
    /** Encoding preset (default: 'medium') */
    preset?: 'veryfast' | 'faster' | 'fast' | 'medium' | 'slow' | 'slower' | 'veryslow';
    /** Enable look ahead (default: true) */
    look_ahead?: boolean;
  };
  /** AMD AMF-specific options */
  amf?: {
    /** Encoding quality (default: 'balanced') */
    quality?: 'speed' | 'balanced' | 'quality';
    /** Rate control mode (default: 'vbr_latency') */
    rc?: 'cqp' | 'cbr' | 'vbr_peak' | 'vbr_latency';
  };
}

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
  codec?: 'libx264' | 'libx265' | 'libvpx' | 'libvpx-vp9' | 'libaom-av1' | 'prores';
  /** Quality CRF (0-51) */
  quality?: number;
  /** Video bitrate (e.g., '8M', '10M'). Overrides quality/CRF when specified. */
  bitrate?: string;
  /** Encoding preset for libx264/libx265 (default: 'medium'). Use 'slow' or 'veryslow' for better quality. */
  preset?: 'ultrafast' | 'superfast' | 'veryfast' | 'faster' | 'fast' | 'medium' | 'slow' | 'slower' | 'veryslow';
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
  /** Hardware acceleration options */
  hardwareAcceleration?: HardwareAccelerationOptions;
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
  private gpuInfo: GPUInfo | null = null;
  private gpuDetected = false;

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
   * Detect GPU capabilities (cached after first call)
   */
  private async detectGPU(): Promise<GPUInfo> {
    if (this.gpuDetected) {
      return this.gpuInfo!;
    }

    this.gpuInfo = await detectGPUCapabilities(this.config.ffmpegPath);
    this.gpuDetected = true;

    return this.gpuInfo;
  }

  /**
   * Merge config-level and option-level hardware acceleration settings
   */
  private mergeHardwareAccelerationOptions(
    optionLevel?: HardwareAccelerationOptions
  ): HardwareAccelerationOptions | undefined {
    const configLevel = this.config.hardwareAcceleration;

    if (!configLevel && !optionLevel) {
      return undefined;
    }

    // Option-level settings override config-level settings
    return {
      enabled: optionLevel?.enabled ?? configLevel?.enabled,
      preferredEncoder: optionLevel?.preferredEncoder ?? configLevel?.preferredEncoder,
      fallbackToSoftware: optionLevel?.fallbackToSoftware ?? configLevel?.fallbackToSoftware,
      nvenc: optionLevel?.nvenc,
      videotoolbox: optionLevel?.videotoolbox,
      qsv: optionLevel?.qsv,
      amf: optionLevel?.amf,
    };
  }

  /**
   * Select the appropriate encoder based on GPU capabilities and user preferences
   */
  private async selectEncoder(
    options: EncodeOptions,
    gpuInfo: GPUInfo
  ): Promise<{ codec: string; isHardware: boolean }> {
    const hwAccel = this.mergeHardwareAccelerationOptions(options.hardwareAcceleration);
    const requestedCodec = options.codec || 'libx264';

    // If hardware acceleration is explicitly disabled, use software codec
    if (hwAccel?.enabled === false) {
      this.log('Hardware acceleration explicitly disabled, using software codec:', requestedCodec);
      return { codec: requestedCodec, isHardware: false };
    }

    // If no GPU available, use software codec
    if (!gpuInfo.available) {
      this.log('No GPU acceleration available, using software codec:', requestedCodec);
      if (gpuInfo.error) {
        this.log('GPU detection error:', gpuInfo.error);
      }
      return { codec: requestedCodec, isHardware: false };
    }

    // Try to select hardware encoder
    let selectedEncoder: HardwareEncoder | undefined;

    // Use preferred encoder if specified and available
    if (hwAccel?.preferredEncoder && gpuInfo.encoders.includes(hwAccel.preferredEncoder)) {
      selectedEncoder = hwAccel.preferredEncoder;
      this.log('Using preferred hardware encoder:', selectedEncoder);
    } else if (gpuInfo.recommendedEncoder) {
      // Use recommended encoder
      selectedEncoder = gpuInfo.recommendedEncoder;
      this.log('Using recommended hardware encoder:', selectedEncoder);
    }

    // If we have a hardware encoder, use it
    if (selectedEncoder) {
      this.log('GPU acceleration enabled');
      this.log('GPU vendor:', gpuInfo.vendor);
      if (gpuInfo.model) {
        this.log('GPU model:', gpuInfo.model);
      }
      return { codec: selectedEncoder, isHardware: true };
    }

    // Fallback to software codec
    const fallback = hwAccel?.fallbackToSoftware !== false;
    if (fallback) {
      this.log('No suitable hardware encoder found, falling back to software codec:', requestedCodec);
      return { codec: requestedCodec, isHardware: false };
    } else {
      throw new Error('Hardware acceleration requested but no suitable encoder found');
    }
  }

  /**
   * Get hardware-specific encoder options
   */
  private getHardwareEncoderOptions(
    encoder: HardwareEncoder,
    quality: number,
    hwAccel?: HardwareAccelerationOptions
  ): string[] {
    const options: string[] = [];

    if (encoder.includes('nvenc')) {
      // NVIDIA NVENC options
      const nvencOpts = hwAccel?.nvenc || {};
      const preset = nvencOpts.preset || 'p4'; // p4 is balanced quality/performance
      const tune = nvencOpts.tune || 'hq'; // high quality
      const rc = nvencOpts.rc || 'vbr'; // variable bitrate

      options.push(
        `-preset ${preset}`,
        `-tune ${tune}`,
        `-rc ${rc}`,
        `-cq ${quality}` // Constant quality mode (similar to CRF)
      );

      this.log(`NVENC options: preset=${preset}, tune=${tune}, rc=${rc}, cq=${quality}`);
    } else if (encoder.includes('videotoolbox')) {
      // Apple VideoToolbox options
      const vtOpts = hwAccel?.videotoolbox || {};
      const allowSw = vtOpts.allow_sw !== false ? 1 : 0;
      const realtime = vtOpts.realtime ? 1 : 0;

      options.push(
        `-b:v 0`, // Use quality-based encoding
        `-q:v ${quality}` // Quality (1-100, lower is better)
      );

      if (allowSw) {
        options.push(`-allow_sw ${allowSw}`);
      }
      if (realtime) {
        options.push(`-realtime ${realtime}`);
      }

      this.log(`VideoToolbox options: quality=${quality}, allow_sw=${allowSw}, realtime=${realtime}`);
    } else if (encoder.includes('qsv')) {
      // Intel Quick Sync Video options
      const qsvOpts = hwAccel?.qsv || {};
      const preset = qsvOpts.preset || 'medium';
      const lookAhead = qsvOpts.look_ahead !== false ? 1 : 0;

      options.push(
        `-preset ${preset}`,
        `-global_quality ${quality * 2}` // QSV quality scale is different (0-51 -> 0-102)
      );

      if (lookAhead) {
        options.push(`-look_ahead ${lookAhead}`);
      }

      this.log(`QSV options: preset=${preset}, global_quality=${quality * 2}, look_ahead=${lookAhead}`);
    } else if (encoder.includes('amf')) {
      // AMD AMF options
      const amfOpts = hwAccel?.amf || {};
      const quality = amfOpts.quality || 'balanced';
      const rc = amfOpts.rc || 'vbr_latency';

      options.push(
        `-quality ${quality}`,
        `-rc ${rc}`,
        `-qp_i ${quality}`,
        `-qp_p ${quality}`
      );

      this.log(`AMF options: quality=${quality}, rc=${rc}`);
    }

    return options;
  }

  /**
   * Log message (can be overridden for custom logging)
   */
  private log(...args: unknown[]): void {
    console.error('[FFmpegEncoder]', ...args);
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
      bitrate,
      preset = 'medium',
      pixelFormat = 'yuv420p',
      audioFile,
      audioCodec = 'aac',
      audioBitrate = '128k',
      onProgress,
      startTime = Date.now(),
      totalFrames = 0,
      hardwareAcceleration,
    } = options;

    // Detect GPU capabilities and select encoder
    const gpuInfo = await this.detectGPU();
    const { codec: selectedCodec, isHardware } = await this.selectEncoder(options, gpuInfo);
    const mergedHwAccel = this.mergeHardwareAccelerationOptions(hardwareAcceleration);

    this.log('Starting video encoding...');
    this.log('Resolution:', `${width}x${height}`);
    this.log('Frame rate:', fps);
    this.log('Codec:', selectedCodec, isHardware ? '(hardware)' : '(software)');
    this.log('Quality:', quality);

    return new Promise((resolve, reject) => {
      // Use prores_ks as the actual FFmpeg encoder for ProRes
      const ffmpegCodec = selectedCodec === 'prores' ? 'prores_ks' : selectedCodec;

      let command = ffmpeg()
        .input(inputPattern)
        .inputFPS(fps)
        .videoCodec(ffmpegCodec);

      // Configure codec-specific options
      const outputOptions: string[] = [];

      if (isHardware) {
        // Hardware encoder options
        const hwOptions = this.getHardwareEncoderOptions(
          selectedCodec as HardwareEncoder,
          quality,
          mergedHwAccel
        );
        outputOptions.push(...hwOptions);

        // Pixel format for hardware encoders
        if (selectedCodec.includes('nvenc')) {
          outputOptions.push(`-pix_fmt ${pixelFormat}`);
        } else if (selectedCodec.includes('videotoolbox')) {
          // VideoToolbox prefers nv12
          outputOptions.push(`-pix_fmt nv12`);
        } else if (selectedCodec.includes('qsv')) {
          // QSV prefers nv12
          outputOptions.push(`-pix_fmt nv12`);
        } else if (selectedCodec.includes('amf')) {
          outputOptions.push(`-pix_fmt ${pixelFormat}`);
        }
      } else {
        // Software encoder options
        if (codec === 'prores') {
          // ProRes 4444 with alpha support
          outputOptions.push(
            `-profile:v 4444`,
            `-pix_fmt yuva444p10le`,
            `-vendor apl0`
          );
        } else if (codec === 'libaom-av1') {
          // AV1 specific options
          if (bitrate) {
            outputOptions.push(`-b:v ${bitrate}`);
          } else {
            outputOptions.push(
              `-crf ${quality}`,
              `-b:v 0` // Use constant quality mode
            );
          }
          outputOptions.push(
            `-cpu-used 4`, // Encoding speed (0-8, higher is faster)
            `-row-mt 1`, // Enable row-based multithreading
            `-pix_fmt ${pixelFormat}`
          );
        } else {
          // Default options for other codecs (libx264, libx265, etc.)
          if (bitrate) {
            outputOptions.push(`-b:v ${bitrate}`);
          } else {
            outputOptions.push(
              `-crf ${quality}`,
              `-b:v 0` // Use constant quality mode
            );
          }
          outputOptions.push(
            `-pix_fmt ${pixelFormat}`,
            `-preset ${preset}`
          );
        }
      }

      command = command
        .outputOptions(outputOptions)
        .size(`${width}x${height}`);

      // Add metadata
      command = command
        .outputOptions([
          '-metadata', 'title=Generated by Rendervid',
          '-metadata', 'artist=Rendervid by FlowHunt.io',
          '-metadata', 'comment=Created with Rendervid - https://flowhunt.io',
          '-metadata', 'encoder=Rendervid',
        ]);

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
          const errorMsg = `FFmpeg error: ${err.message}`;
          this.log('Encoding failed:', errorMsg);

          // If hardware encoding failed and fallback is enabled, retry with software
          if (isHardware && mergedHwAccel?.fallbackToSoftware !== false) {
            this.log('Hardware encoding failed, retrying with software codec...');

            // Retry with software codec
            this.encodeToVideo({
              ...options,
              hardwareAcceleration: { ...mergedHwAccel, enabled: false },
            })
              .then(resolve)
              .catch(reject);
          } else {
            reject(new Error(errorMsg));
          }
        })
        .on('end', () => {
          this.log('Encoding completed successfully');
          resolve();
        })
        .run();
    });
  }

  /**
   * Encode frames to video using streaming (pipe frames directly to FFmpeg stdin)
   */
  async encodeToVideoStream(
    frameIterator: AsyncIterableIterator<Buffer>,
    options: Omit<EncodeOptions, 'inputPattern'>
  ): Promise<void> {
    const {
      outputPath,
      fps,
      width,
      height,
      codec = 'libx264',
      quality = 23,
      bitrate,
      preset = 'medium',
      pixelFormat = 'yuv420p',
      audioFile,
      audioCodec = 'aac',
      audioBitrate = '128k',
      onProgress,
      startTime = Date.now(),
      totalFrames = 0,
      hardwareAcceleration,
    } = options;

    // Detect GPU capabilities and select encoder
    const gpuInfo = await this.detectGPU();
    const { codec: selectedCodec, isHardware } = await this.selectEncoder(
      { ...options, inputPattern: '' } as EncodeOptions,
      gpuInfo
    );
    const mergedHwAccel = this.mergeHardwareAccelerationOptions(hardwareAcceleration);

    this.log('Starting video encoding (streaming mode)...');
    this.log('Resolution:', `${width}x${height}`);
    this.log('Frame rate:', fps);
    this.log('Codec:', selectedCodec, isHardware ? '(hardware)' : '(software)');
    this.log('Quality:', quality);

    return new Promise((resolve, reject) => {
      // Build FFmpeg command arguments
      const args: string[] = [
        '-f', 'image2pipe',
        '-c:v', 'png',
        '-r', fps.toString(),
        '-i', 'pipe:0', // Read from stdin
      ];

      // Add audio if provided
      if (audioFile && audioCodec !== 'none') {
        args.push('-i', audioFile);
        args.push('-c:a', audioCodec);
        args.push('-b:a', audioBitrate);
      }

      // Add video codec
      args.push('-c:v', selectedCodec);

      // Add codec-specific options
      if (isHardware) {
        // Hardware encoder options
        const hwOptions = this.getHardwareEncoderOptions(
          selectedCodec as HardwareEncoder,
          quality,
          mergedHwAccel
        );

        // Convert options to args format
        for (const option of hwOptions) {
          const parts = option.split(' ');
          args.push(...parts);
        }

        // Pixel format for hardware encoders
        if (selectedCodec.includes('nvenc')) {
          args.push('-pix_fmt', pixelFormat);
        } else if (selectedCodec.includes('videotoolbox')) {
          args.push('-pix_fmt', 'nv12');
        } else if (selectedCodec.includes('qsv')) {
          args.push('-pix_fmt', 'nv12');
        } else if (selectedCodec.includes('amf')) {
          args.push('-pix_fmt', pixelFormat);
        }
      } else {
        // Software encoder options
        if (codec === 'prores') {
          // ProRes 4444 with alpha support
          args.push(
            '-profile:v', '4444',
            '-pix_fmt', 'yuva444p10le',
            '-vendor', 'apl0'
          );
        } else if (codec === 'libaom-av1') {
          if (bitrate) {
            args.push('-b:v', bitrate);
          } else {
            args.push('-crf', quality.toString(), '-b:v', '0');
          }
          args.push(
            '-cpu-used', '4',
            '-row-mt', '1',
            '-pix_fmt', pixelFormat
          );
        } else {
          if (bitrate) {
            args.push('-b:v', bitrate);
          } else {
            args.push('-crf', quality.toString(), '-b:v', '0');
          }
          args.push(
            '-pix_fmt', pixelFormat,
            '-preset', preset
          );
        }
      }

      // Add metadata
      args.push(
        '-metadata', 'title=Generated by Rendervid',
        '-metadata', 'artist=Rendervid by FlowHunt.io',
        '-metadata', 'comment=Created with Rendervid - https://flowhunt.io',
        '-metadata', 'encoder=Rendervid'
      );

      args.push(
        '-s', `${width}x${height}`,
        '-y', // Overwrite output file
        outputPath
      );

      // Spawn FFmpeg process
      const ffmpegPath = this.config.ffmpegPath || 'ffmpeg';
      const process = spawn(ffmpegPath, args);

      let currentFrame = 0;
      let encoding = true;

      // Handle stderr for progress reporting
      process.stderr.on('data', (data: Buffer) => {
        const output = data.toString();

        // Parse frame number from FFmpeg output
        const frameMatch = output.match(/frame=\s*(\d+)/);
        if (frameMatch && onProgress && totalFrames > 0) {
          currentFrame = parseInt(frameMatch[1], 10);
          const elapsed = (Date.now() - startTime) / 1000;
          const percent = (currentFrame / totalFrames) * 100;
          const fps = currentFrame / elapsed;
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
      });

      // Handle process errors
      process.on('error', (err) => {
        encoding = false;
        const errorMsg = `FFmpeg process error: ${err.message}`;
        this.log('Encoding failed:', errorMsg);

        // If hardware encoding failed and fallback is enabled, retry with software
        if (isHardware && mergedHwAccel?.fallbackToSoftware !== false) {
          this.log('Hardware encoding failed, retrying with software codec...');

          // Retry with software codec
          // Note: We can't retry streaming mode easily, so we reject and let caller handle
          reject(new Error(`${errorMsg} (streaming mode cannot auto-retry)`));
        } else {
          reject(new Error(errorMsg));
        }
      });

      process.on('exit', (code) => {
        encoding = false;
        if (code === 0) {
          this.log('Encoding completed successfully');
          resolve();
        } else {
          const errorMsg = `FFmpeg exited with code ${code}`;
          this.log('Encoding failed:', errorMsg);

          // If hardware encoding failed and fallback is enabled
          if (isHardware && mergedHwAccel?.fallbackToSoftware !== false) {
            this.log('Hardware encoding failed, but cannot retry in streaming mode');
            reject(new Error(`${errorMsg} (streaming mode cannot auto-retry, please disable hardware acceleration or use non-streaming mode)`));
          } else {
            reject(new Error(errorMsg));
          }
        }
      });

      // Pipe frames to FFmpeg stdin
      (async () => {
        try {
          for await (const frameBuffer of frameIterator) {
            if (!encoding) break;

            // Write frame to stdin
            const written = process.stdin.write(frameBuffer);

            // If buffer is full, wait for drain event
            if (!written) {
              await new Promise<void>((resolve) => {
                process.stdin.once('drain', resolve);
              });
            }
          }

          // Close stdin to signal end of input
          process.stdin.end();
        } catch (err) {
          reject(err);
          process.kill();
        }
      })();
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
   * Add metadata to an image file
   */
  async addImageMetadata(filePath: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const tempPath = `${filePath}.tmp`;

      ffmpeg(filePath)
        .outputOptions([
          '-metadata', 'title=Generated by Rendervid',
          '-metadata', 'artist=Rendervid by FlowHunt.io',
          '-metadata', 'comment=Created with Rendervid - https://flowhunt.io',
          '-metadata', 'Software=Rendervid',
        ])
        .output(tempPath)
        .on('error', (err) => {
          reject(new Error(`Failed to add metadata: ${err.message}`));
        })
        .on('end', async () => {
          try {
            // Replace original with metadata version
            await fs.unlink(filePath);
            await fs.rename(tempPath, filePath);
            resolve();
          } catch (err) {
            reject(err);
          }
        })
        .run();
    });
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
