/**
 * GPU-Accelerated Encoding Type Examples
 *
 * This file demonstrates the TypeScript types and interfaces for GPU acceleration.
 * It shows how to properly type your encoding options with hardware acceleration.
 */

import {
  createFFmpegEncoder,
  detectGPUCapabilities,
  type FFmpegEncoder,
  type EncodeOptions,
  type HardwareAccelerationOptions,
  type FFmpegConfig,
  type GPUInfo,
  type HardwareEncoder,
} from '../src/index';

// ============================================================================
// Example 1: Basic GPU Acceleration with Type Safety
// ============================================================================

async function basicGPUEncoding(): Promise<void> {
  const encoder: FFmpegEncoder = createFFmpegEncoder();

  const options: EncodeOptions = {
    inputPattern: 'frames/frame-%05d.png',
    outputPath: 'output.mp4',
    fps: 30,
    width: 1920,
    height: 1080,
    quality: 23,
    hardwareAcceleration: {
      enabled: true,
      fallbackToSoftware: true,
    },
  };

  await encoder.encodeToVideo(options);
}

// ============================================================================
// Example 2: NVIDIA NVENC with Full Type Safety
// ============================================================================

async function nvencEncoding(): Promise<void> {
  const encoder = createFFmpegEncoder();

  const hwAccel: HardwareAccelerationOptions = {
    enabled: true,
    preferredEncoder: 'h264_nvenc',
    fallbackToSoftware: true,
    nvenc: {
      preset: 'p4', // Type-safe preset options
      tune: 'hq', // Type-safe tune options
      rc: 'vbr', // Type-safe rate control options
    },
  };

  const options: EncodeOptions = {
    inputPattern: 'frames/frame-%05d.png',
    outputPath: 'output-nvenc.mp4',
    fps: 30,
    width: 1920,
    height: 1080,
    quality: 23,
    hardwareAcceleration: hwAccel,
  };

  await encoder.encodeToVideo(options);
}

// ============================================================================
// Example 3: Apple VideoToolbox with Full Type Safety
// ============================================================================

async function videotoolboxEncoding(): Promise<void> {
  const encoder = createFFmpegEncoder();

  const hwAccel: HardwareAccelerationOptions = {
    enabled: true,
    preferredEncoder: 'h264_videotoolbox',
    fallbackToSoftware: true,
    videotoolbox: {
      allow_sw: true,
      realtime: false,
    },
  };

  const options: EncodeOptions = {
    inputPattern: 'frames/frame-%05d.png',
    outputPath: 'output-videotoolbox.mp4',
    fps: 30,
    width: 1920,
    height: 1080,
    quality: 23,
    hardwareAcceleration: hwAccel,
  };

  await encoder.encodeToVideo(options);
}

// ============================================================================
// Example 4: Intel QSV with Full Type Safety
// ============================================================================

async function qsvEncoding(): Promise<void> {
  const encoder = createFFmpegEncoder();

  const hwAccel: HardwareAccelerationOptions = {
    enabled: true,
    preferredEncoder: 'h264_qsv',
    fallbackToSoftware: true,
    qsv: {
      preset: 'medium',
      look_ahead: true,
    },
  };

  const options: EncodeOptions = {
    inputPattern: 'frames/frame-%05d.png',
    outputPath: 'output-qsv.mp4',
    fps: 30,
    width: 1920,
    height: 1080,
    quality: 23,
    hardwareAcceleration: hwAccel,
  };

  await encoder.encodeToVideo(options);
}

// ============================================================================
// Example 5: AMD AMF with Full Type Safety
// ============================================================================

async function amfEncoding(): Promise<void> {
  const encoder = createFFmpegEncoder();

  const hwAccel: HardwareAccelerationOptions = {
    enabled: true,
    preferredEncoder: 'h264_amf',
    fallbackToSoftware: true,
    amf: {
      quality: 'balanced',
      rc: 'vbr_latency',
    },
  };

  const options: EncodeOptions = {
    inputPattern: 'frames/frame-%05d.png',
    outputPath: 'output-amf.mp4',
    fps: 30,
    width: 1920,
    height: 1080,
    quality: 23,
    hardwareAcceleration: hwAccel,
  };

  await encoder.encodeToVideo(options);
}

// ============================================================================
// Example 6: Config-Level Hardware Acceleration
// ============================================================================

async function configLevelAcceleration(): Promise<void> {
  const config: FFmpegConfig = {
    ffmpegPath: '/usr/local/bin/ffmpeg',
    hardwareAcceleration: {
      enabled: true,
      fallbackToSoftware: true,
    },
  };

  const encoder = createFFmpegEncoder(config);

  // Hardware acceleration settings from config will be used
  const options: EncodeOptions = {
    inputPattern: 'frames/frame-%05d.png',
    outputPath: 'output.mp4',
    fps: 30,
    width: 1920,
    height: 1080,
    quality: 23,
  };

  await encoder.encodeToVideo(options);
}

// ============================================================================
// Example 7: Dynamic Encoder Selection Based on GPU Detection
// ============================================================================

async function dynamicEncoderSelection(): Promise<void> {
  // Detect GPU capabilities first
  const gpuInfo: GPUInfo = await detectGPUCapabilities();

  if (!gpuInfo.available) {
    console.log('No GPU available, using software encoding');
    const encoder = createFFmpegEncoder();
    await encoder.encodeToVideo({
      inputPattern: 'frames/frame-%05d.png',
      outputPath: 'output.mp4',
      fps: 30,
      width: 1920,
      height: 1080,
      codec: 'libx264',
      quality: 23,
      hardwareAcceleration: {
        enabled: false,
      },
    });
    return;
  }

  // Select encoder based on vendor
  let hwAccel: HardwareAccelerationOptions;

  switch (gpuInfo.vendor) {
    case 'nvidia':
      hwAccel = {
        enabled: true,
        preferredEncoder: 'h264_nvenc',
        nvenc: {
          preset: 'p4',
          tune: 'hq',
          rc: 'vbr',
        },
        fallbackToSoftware: true,
      };
      break;

    case 'apple':
      hwAccel = {
        enabled: true,
        preferredEncoder: 'h264_videotoolbox',
        videotoolbox: {
          allow_sw: true,
          realtime: false,
        },
        fallbackToSoftware: true,
      };
      break;

    case 'intel':
      hwAccel = {
        enabled: true,
        preferredEncoder: 'h264_qsv',
        qsv: {
          preset: 'medium',
          look_ahead: true,
        },
        fallbackToSoftware: true,
      };
      break;

    case 'amd':
      hwAccel = {
        enabled: true,
        preferredEncoder: 'h264_amf',
        amf: {
          quality: 'balanced',
          rc: 'vbr_latency',
        },
        fallbackToSoftware: true,
      };
      break;

    default:
      // Unknown vendor, use auto-detection
      hwAccel = {
        enabled: true,
        fallbackToSoftware: true,
      };
  }

  const encoder = createFFmpegEncoder();
  await encoder.encodeToVideo({
    inputPattern: 'frames/frame-%05d.png',
    outputPath: 'output.mp4',
    fps: 30,
    width: 1920,
    height: 1080,
    quality: 23,
    hardwareAcceleration: hwAccel,
  });
}

// ============================================================================
// Example 8: HEVC (H.265) Encoding with GPU
// ============================================================================

async function hevcGPUEncoding(): Promise<void> {
  const gpuInfo = await detectGPUCapabilities();

  // Find HEVC encoder
  const hevcEncoder = gpuInfo.encoders.find(e => e.includes('hevc')) as HardwareEncoder | undefined;

  if (!hevcEncoder) {
    console.log('No HEVC GPU encoder available');
    return;
  }

  const encoder = createFFmpegEncoder();
  const options: EncodeOptions = {
    inputPattern: 'frames/frame-%05d.png',
    outputPath: 'output-hevc.mp4',
    fps: 30,
    width: 1920,
    height: 1080,
    quality: 23,
    hardwareAcceleration: {
      enabled: true,
      preferredEncoder: hevcEncoder,
      fallbackToSoftware: true,
    },
  };

  await encoder.encodeToVideo(options);
}

// ============================================================================
// Example 9: Per-Vendor Optimal Settings
// ============================================================================

async function vendorOptimalSettings(): Promise<void> {
  const gpuInfo = await detectGPUCapabilities();
  const encoder = createFFmpegEncoder();

  // Optimal settings for each vendor
  const optimalSettings: Record<string, HardwareAccelerationOptions> = {
    nvidia: {
      enabled: true,
      preferredEncoder: 'h264_nvenc',
      nvenc: {
        preset: 'p4', // Balanced
        tune: 'hq', // High quality
        rc: 'vbr', // Variable bitrate for better quality
      },
      fallbackToSoftware: true,
    },
    apple: {
      enabled: true,
      preferredEncoder: 'h264_videotoolbox',
      videotoolbox: {
        allow_sw: true,
        realtime: false, // Better quality
      },
      fallbackToSoftware: true,
    },
    intel: {
      enabled: true,
      preferredEncoder: 'h264_qsv',
      qsv: {
        preset: 'slow', // Better quality
        look_ahead: true, // Improved rate control
      },
      fallbackToSoftware: true,
    },
    amd: {
      enabled: true,
      preferredEncoder: 'h264_amf',
      amf: {
        quality: 'quality', // Prioritize quality
        rc: 'vbr_peak', // Peak constrained VBR
      },
      fallbackToSoftware: true,
    },
  };

  const hwAccel = optimalSettings[gpuInfo.vendor] || {
    enabled: true,
    fallbackToSoftware: true,
  };

  await encoder.encodeToVideo({
    inputPattern: 'frames/frame-%05d.png',
    outputPath: 'output-optimal.mp4',
    fps: 30,
    width: 1920,
    height: 1080,
    quality: 23,
    hardwareAcceleration: hwAccel,
  });
}

// ============================================================================
// Main function showing all examples
// ============================================================================

async function main(): Promise<void> {
  console.log('GPU Encoding Type Examples');
  console.log('This file demonstrates TypeScript types for GPU acceleration');
  console.log('See the function implementations for usage examples');

  // Detect GPU
  const gpuInfo = await detectGPUCapabilities();
  console.log('\nDetected GPU:', gpuInfo.vendor);
  console.log('Available encoders:', gpuInfo.encoders);
  console.log('Recommended encoder:', gpuInfo.recommendedEncoder);

  // All examples are demonstrated above
  // Uncomment to run specific examples:
  // await basicGPUEncoding();
  // await nvencEncoding();
  // await videotoolboxEncoding();
  // await qsvEncoding();
  // await amfEncoding();
  // await configLevelAcceleration();
  // await dynamicEncoderSelection();
  // await hevcGPUEncoding();
  // await vendorOptimalSettings();
}

// Run if executed directly
if (require.main === module) {
  main().catch(console.error);
}

// Export examples for documentation
export {
  basicGPUEncoding,
  nvencEncoding,
  videotoolboxEncoding,
  qsvEncoding,
  amfEncoding,
  configLevelAcceleration,
  dynamicEncoderSelection,
  hevcGPUEncoding,
  vendorOptimalSettings,
};
