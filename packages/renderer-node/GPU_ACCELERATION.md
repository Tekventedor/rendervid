# GPU-Accelerated Video Encoding

Rendervid supports hardware-accelerated video encoding using GPU encoders from NVIDIA, Apple, Intel, and AMD. This can significantly speed up video rendering and reduce CPU usage.

## Features

- **Automatic GPU Detection**: Automatically detects and selects the best available GPU encoder
- **Multi-Vendor Support**: NVIDIA NVENC, Apple VideoToolbox, Intel Quick Sync Video, AMD AMF
- **Vendor-Specific Options**: Fine-tune encoding with vendor-specific parameters
- **Automatic Fallback**: Falls back to software encoding if GPU encoding fails
- **Full Type Safety**: Complete TypeScript support with proper types
- **Backward Compatible**: Works seamlessly with existing code

## Quick Start

### Automatic GPU Acceleration

The simplest way to use GPU acceleration is to enable it and let Rendervid auto-detect the best encoder:

```typescript
import { createFFmpegEncoder } from '@rendervid/renderer-node';

const encoder = createFFmpegEncoder();

await encoder.encodeToVideo({
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
});
```

### Check GPU Capabilities

Before encoding, you can check what GPU capabilities are available:

```typescript
import { detectGPUCapabilities, getGPUDescription } from '@rendervid/renderer-node';

const gpuInfo = await detectGPUCapabilities();

console.log(getGPUDescription(gpuInfo));
// Output: "NVIDIA GPU (RTX 3080) - h264_nvenc available"

if (gpuInfo.available) {
  console.log('Available encoders:', gpuInfo.encoders);
  console.log('Recommended encoder:', gpuInfo.recommendedEncoder);
}
```

## Supported GPU Vendors

### NVIDIA (NVENC)

NVIDIA GPUs with NVENC support provide excellent encoding performance.

**Supported Encoders:**
- `h264_nvenc` - H.264/AVC encoding
- `hevc_nvenc` - H.265/HEVC encoding

**Options:**

```typescript
hardwareAcceleration: {
  enabled: true,
  preferredEncoder: 'h264_nvenc',
  nvenc: {
    preset: 'p4',      // p1 (fastest) to p7 (slowest/best quality)
    tune: 'hq',        // 'hq' (high quality), 'll' (low latency), 'ull' (ultra low latency), 'lossless'
    rc: 'vbr',         // Rate control: 'constqp', 'vbr', 'cbr', 'vbr_minqp', 'll_2pass_quality', 'vbr_2pass'
  },
  fallbackToSoftware: true,
}
```

**Example:**

```typescript
await encoder.encodeToVideo({
  inputPattern: 'frames/frame-%05d.png',
  outputPath: 'output-nvenc.mp4',
  fps: 30,
  width: 1920,
  height: 1080,
  quality: 23,
  hardwareAcceleration: {
    enabled: true,
    preferredEncoder: 'h264_nvenc',
    nvenc: {
      preset: 'p4',  // Balanced quality/performance
      tune: 'hq',    // High quality
      rc: 'vbr',     // Variable bitrate
    },
  },
});
```

### Apple (VideoToolbox)

Apple Silicon Macs and newer Intel Macs support hardware encoding via VideoToolbox.

**Supported Encoders:**
- `h264_videotoolbox` - H.264/AVC encoding
- `hevc_videotoolbox` - H.265/HEVC encoding

**Options:**

```typescript
hardwareAcceleration: {
  enabled: true,
  preferredEncoder: 'h264_videotoolbox',
  videotoolbox: {
    allow_sw: true,    // Allow software fallback
    realtime: false,   // Enable realtime encoding (faster but lower quality)
  },
  fallbackToSoftware: true,
}
```

**Example:**

```typescript
await encoder.encodeToVideo({
  inputPattern: 'frames/frame-%05d.png',
  outputPath: 'output-videotoolbox.mp4',
  fps: 30,
  width: 1920,
  height: 1080,
  quality: 23,
  hardwareAcceleration: {
    enabled: true,
    preferredEncoder: 'h264_videotoolbox',
    videotoolbox: {
      allow_sw: true,
      realtime: false,
    },
  },
});
```

### Intel (Quick Sync Video)

Intel CPUs with integrated graphics support Quick Sync Video (QSV) for hardware encoding.

**Supported Encoders:**
- `h264_qsv` - H.264/AVC encoding
- `hevc_qsv` - H.265/HEVC encoding

**Options:**

```typescript
hardwareAcceleration: {
  enabled: true,
  preferredEncoder: 'h264_qsv',
  qsv: {
    preset: 'medium',     // 'veryfast', 'faster', 'fast', 'medium', 'slow', 'slower', 'veryslow'
    look_ahead: true,     // Enable look-ahead for better quality
  },
  fallbackToSoftware: true,
}
```

**Example:**

```typescript
await encoder.encodeToVideo({
  inputPattern: 'frames/frame-%05d.png',
  outputPath: 'output-qsv.mp4',
  fps: 30,
  width: 1920,
  height: 1080,
  quality: 23,
  hardwareAcceleration: {
    enabled: true,
    preferredEncoder: 'h264_qsv',
    qsv: {
      preset: 'medium',
      look_ahead: true,
    },
  },
});
```

### AMD (AMF)

AMD GPUs with AMF (Advanced Media Framework) support hardware encoding.

**Supported Encoders:**
- `h264_amf` - H.264/AVC encoding
- `hevc_amf` - H.265/HEVC encoding

**Options:**

```typescript
hardwareAcceleration: {
  enabled: true,
  preferredEncoder: 'h264_amf',
  amf: {
    quality: 'balanced',    // 'speed', 'balanced', 'quality'
    rc: 'vbr_latency',      // Rate control: 'cqp', 'cbr', 'vbr_peak', 'vbr_latency'
  },
  fallbackToSoftware: true,
}
```

**Example:**

```typescript
await encoder.encodeToVideo({
  inputPattern: 'frames/frame-%05d.png',
  outputPath: 'output-amf.mp4',
  fps: 30,
  width: 1920,
  height: 1080,
  quality: 23,
  hardwareAcceleration: {
    enabled: true,
    preferredEncoder: 'h264_amf',
    amf: {
      quality: 'balanced',
      rc: 'vbr_latency',
    },
  },
});
```

## Configuration Levels

You can configure GPU acceleration at two levels:

### 1. Config-Level (Encoder Instance)

Set default GPU settings when creating the encoder:

```typescript
const encoder = createFFmpegEncoder({
  hardwareAcceleration: {
    enabled: true,
    fallbackToSoftware: true,
  },
});

// These settings apply to all encode operations
await encoder.encodeToVideo({
  inputPattern: 'frames/frame-%05d.png',
  outputPath: 'output.mp4',
  fps: 30,
  width: 1920,
  height: 1080,
  quality: 23,
  // Uses config-level settings
});
```

### 2. Per-Encode (Encode Options)

Override settings for specific encode operations:

```typescript
const encoder = createFFmpegEncoder({
  hardwareAcceleration: {
    enabled: true,  // Default: enabled
  },
});

// Override for this specific encode
await encoder.encodeToVideo({
  inputPattern: 'frames/frame-%05d.png',
  outputPath: 'output.mp4',
  fps: 30,
  width: 1920,
  height: 1080,
  quality: 23,
  hardwareAcceleration: {
    enabled: true,
    preferredEncoder: 'h264_nvenc',  // Override: use specific encoder
    nvenc: {
      preset: 'p7',  // Override: use highest quality preset
    },
  },
});
```

Per-encode settings take precedence over config-level settings.

## Dynamic Encoder Selection

You can dynamically select the encoder based on detected GPU capabilities:

```typescript
import { detectGPUCapabilities, createFFmpegEncoder } from '@rendervid/renderer-node';

const gpuInfo = await detectGPUCapabilities();

let hwAccel;

if (!gpuInfo.available) {
  // No GPU, use software encoding
  hwAccel = { enabled: false };
} else {
  // Select encoder based on vendor
  switch (gpuInfo.vendor) {
    case 'nvidia':
      hwAccel = {
        enabled: true,
        preferredEncoder: 'h264_nvenc',
        nvenc: { preset: 'p4', tune: 'hq', rc: 'vbr' },
      };
      break;
    case 'apple':
      hwAccel = {
        enabled: true,
        preferredEncoder: 'h264_videotoolbox',
        videotoolbox: { allow_sw: true, realtime: false },
      };
      break;
    case 'intel':
      hwAccel = {
        enabled: true,
        preferredEncoder: 'h264_qsv',
        qsv: { preset: 'medium', look_ahead: true },
      };
      break;
    case 'amd':
      hwAccel = {
        enabled: true,
        preferredEncoder: 'h264_amf',
        amf: { quality: 'balanced', rc: 'vbr_latency' },
      };
      break;
  }
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
```

## Error Handling and Fallback

GPU encoding can fail for various reasons (driver issues, GPU busy, unsupported format, etc.). Rendervid provides automatic fallback to software encoding:

```typescript
await encoder.encodeToVideo({
  inputPattern: 'frames/frame-%05d.png',
  outputPath: 'output.mp4',
  fps: 30,
  width: 1920,
  height: 1080,
  quality: 23,
  hardwareAcceleration: {
    enabled: true,
    fallbackToSoftware: true,  // Automatically retry with software codec on GPU failure
  },
});
```

**Note:** Automatic fallback is only available in non-streaming mode. For streaming mode, GPU failures will result in an error being thrown.

## Logging

The encoder logs GPU-related information to help with debugging:

```
[FFmpegEncoder] Using recommended hardware encoder: h264_nvenc
[FFmpegEncoder] GPU acceleration enabled
[FFmpegEncoder] GPU vendor: nvidia
[FFmpegEncoder] GPU model: NVIDIA GeForce RTX 3080
[FFmpegEncoder] Starting video encoding...
[FFmpegEncoder] Resolution: 1920x1080
[FFmpegEncoder] Frame rate: 30
[FFmpegEncoder] Codec: h264_nvenc (hardware)
[FFmpegEncoder] Quality: 23
[FFmpegEncoder] NVENC options: preset=p4, tune=hq, rc=vbr, cq=23
[FFmpegEncoder] Encoding completed successfully
```

## API Reference

### Types

#### `HardwareAccelerationOptions`

```typescript
interface HardwareAccelerationOptions {
  /** Enable hardware acceleration (default: auto-detect) */
  enabled?: boolean;

  /** Preferred hardware encoder (auto-detect if not specified) */
  preferredEncoder?: HardwareEncoder;

  /** Fallback to software encoding if GPU unavailable (default: true) */
  fallbackToSoftware?: boolean;

  /** NVENC-specific options */
  nvenc?: {
    preset?: 'p1' | 'p2' | 'p3' | 'p4' | 'p5' | 'p6' | 'p7';
    tune?: 'hq' | 'll' | 'ull' | 'lossless';
    rc?: 'constqp' | 'vbr' | 'cbr' | 'vbr_minqp' | 'll_2pass_quality' | 'vbr_2pass';
  };

  /** VideoToolbox-specific options */
  videotoolbox?: {
    allow_sw?: boolean;
    realtime?: boolean;
  };

  /** Quick Sync Video-specific options */
  qsv?: {
    preset?: 'veryfast' | 'faster' | 'fast' | 'medium' | 'slow' | 'slower' | 'veryslow';
    look_ahead?: boolean;
  };

  /** AMD AMF-specific options */
  amf?: {
    quality?: 'speed' | 'balanced' | 'quality';
    rc?: 'cqp' | 'cbr' | 'vbr_peak' | 'vbr_latency';
  };
}
```

#### `HardwareEncoder`

```typescript
type HardwareEncoder =
  | 'h264_nvenc'          // NVIDIA NVENC H.264
  | 'hevc_nvenc'          // NVIDIA NVENC H.265
  | 'h264_videotoolbox'   // Apple VideoToolbox H.264
  | 'hevc_videotoolbox'   // Apple VideoToolbox H.265
  | 'h264_qsv'            // Intel Quick Sync Video H.264
  | 'hevc_qsv'            // Intel Quick Sync Video H.265
  | 'h264_amf'            // AMD AMF H.264
  | 'hevc_amf';           // AMD AMF H.265
```

#### `GPUInfo`

```typescript
interface GPUInfo {
  /** Whether GPU acceleration is available */
  available: boolean;

  /** Detected GPU vendor */
  vendor: GPUVendor;

  /** GPU model/name if detectable */
  model?: string;

  /** List of available hardware encoders */
  encoders: HardwareEncoder[];

  /** Recommended encoder for this system */
  recommendedEncoder?: HardwareEncoder;

  /** Error message if detection failed */
  error?: string;
}
```

### Functions

#### `detectGPUCapabilities(ffmpegPath?: string): Promise<GPUInfo>`

Detects GPU capabilities by querying FFmpeg for available hardware encoders.

```typescript
const gpuInfo = await detectGPUCapabilities();
console.log(gpuInfo.available); // true/false
console.log(gpuInfo.encoders); // ['h264_nvenc', 'hevc_nvenc']
```

#### `isGPUEncoderAvailable(encoder: HardwareEncoder, ffmpegPath?: string): Promise<boolean>`

Checks if a specific GPU encoder is available.

```typescript
const hasNvenc = await isGPUEncoderAvailable('h264_nvenc');
if (hasNvenc) {
  console.log('NVIDIA GPU encoding available');
}
```

#### `getGPUDescription(gpuInfo: GPUInfo): string`

Returns a human-readable description of GPU capabilities.

```typescript
const gpuInfo = await detectGPUCapabilities();
console.log(getGPUDescription(gpuInfo));
// "NVIDIA GPU (RTX 3080) - h264_nvenc available"
```

## Requirements

### FFmpeg with Hardware Encoding Support

Your FFmpeg installation must be compiled with support for your GPU's encoding library:

- **NVIDIA**: Requires `--enable-nvenc` (or `--enable-cuda` and `--enable-cuvid`)
- **Apple**: Requires `--enable-videotoolbox` (usually included on macOS)
- **Intel**: Requires `--enable-libmfx` or `--enable-qsv`
- **AMD**: Requires `--enable-amf`

Check your FFmpeg build:
```bash
ffmpeg -encoders | grep -E 'nvenc|videotoolbox|qsv|amf'
```

### GPU Drivers

Ensure you have the latest GPU drivers installed:
- **NVIDIA**: Latest NVIDIA drivers with NVENC support
- **Apple**: macOS 10.13 or later
- **Intel**: Latest Intel Graphics drivers
- **AMD**: Latest AMD drivers with AMF support

## Performance Tips

1. **Use Hardware Encoding When Possible**: GPU encoding is typically 3-5x faster than software encoding
2. **Balance Quality and Speed**: Use preset options to balance encoding speed and quality
3. **Monitor GPU Usage**: Ensure your GPU isn't overloaded with other tasks
4. **Test Different Settings**: Different settings work better for different content types
5. **Consider HEVC**: HEVC encoders provide better compression but slightly slower encoding

## Troubleshooting

### GPU Not Detected

If GPU detection fails:
1. Check FFmpeg is installed with hardware encoding support
2. Verify GPU drivers are up to date
3. Run `ffmpeg -encoders` to see available encoders
4. Check FFmpeg error logs for specific issues

### Encoding Fails with GPU

If GPU encoding fails:
1. Enable `fallbackToSoftware: true` for automatic retry
2. Check GPU isn't overloaded
3. Verify format/resolution is supported by hardware encoder
4. Try different encoder settings
5. Check FFmpeg logs for specific error messages

### Poor Quality

If output quality is poor:
1. Adjust the quality parameter (lower = better)
2. Use higher quality presets (e.g., NVENC p7 instead of p1)
3. Try different rate control modes (VBR usually better than CBR)
4. Consider using HEVC for better compression
5. Test software encoding for comparison

## Examples

See the `examples/` directory for complete working examples:

- `detect-gpu.js` - Detect GPU capabilities
- `gpu-encoding-demo.js` - Various encoding scenarios
- `gpu-encoding-types.ts` - TypeScript type examples

## License

Part of the Rendervid project. See the main LICENSE file for details.
