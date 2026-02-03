# GPU Detection Infrastructure

This document describes Phase 1 of GPU acceleration implementation: GPU Detection Infrastructure.

## Overview

The GPU detection system automatically identifies available hardware encoders on the system by querying FFmpeg for supported video encoders. This allows Rendervid to use hardware-accelerated encoding when available, significantly improving rendering performance.

## Supported Hardware Encoders

### NVIDIA (NVENC)
- **h264_nvenc** - H.264 encoding via NVIDIA NVENC
- **hevc_nvenc** - H.265/HEVC encoding via NVIDIA NVENC
- **Platforms**: Windows, Linux
- **Requirements**: NVIDIA GPU with NVENC support, CUDA drivers

### Apple (VideoToolbox)
- **h264_videotoolbox** - H.264 encoding via Apple VideoToolbox
- **hevc_videotoolbox** - H.265/HEVC encoding via Apple VideoToolbox
- **Platforms**: macOS
- **Requirements**: Apple Silicon (M1/M2/M3) or Intel Mac with VideoToolbox

### Intel (Quick Sync Video)
- **h264_qsv** - H.264 encoding via Intel Quick Sync Video
- **hevc_qsv** - H.265/HEVC encoding via Intel Quick Sync Video
- **Platforms**: Windows, Linux
- **Requirements**: Intel CPU with integrated graphics (6th gen or newer)

### AMD (AMF)
- **h264_amf** - H.264 encoding via AMD Advanced Media Framework
- **hevc_amf** - H.265/HEVC encoding via AMD Advanced Media Framework
- **Platforms**: Windows
- **Requirements**: AMD GPU with AMF support

## API Reference

### detectGPUCapabilities()

Detects all available GPU capabilities by querying FFmpeg encoders.

```typescript
async function detectGPUCapabilities(
  ffmpegPath?: string
): Promise<GPUInfo>
```

**Parameters:**
- `ffmpegPath` (optional) - Custom path to FFmpeg binary (default: 'ffmpeg')

**Returns:** `Promise<GPUInfo>` with the following properties:
- `available` - Whether GPU acceleration is available
- `vendor` - GPU vendor ('nvidia', 'apple', 'intel', 'amd', 'unknown')
- `model` - GPU model name (if detectable)
- `encoders` - Array of available hardware encoders
- `recommendedEncoder` - Recommended encoder for this system
- `error` - Error message if detection failed

**Example:**
```typescript
import { detectGPUCapabilities } from '@rendervid/renderer-node';

const gpuInfo = await detectGPUCapabilities();

if (gpuInfo.available) {
  console.log(`GPU: ${gpuInfo.vendor} ${gpuInfo.model}`);
  console.log(`Encoders: ${gpuInfo.encoders.join(', ')}`);
  console.log(`Recommended: ${gpuInfo.recommendedEncoder}`);
} else {
  console.log('GPU acceleration not available');
  if (gpuInfo.error) {
    console.error('Error:', gpuInfo.error);
  }
}
```

### isGPUEncoderAvailable()

Checks if a specific hardware encoder is available.

```typescript
async function isGPUEncoderAvailable(
  encoder: HardwareEncoder,
  ffmpegPath?: string
): Promise<boolean>
```

**Parameters:**
- `encoder` - Hardware encoder to check ('h264_nvenc', 'h264_videotoolbox', etc.)
- `ffmpegPath` (optional) - Custom path to FFmpeg binary

**Returns:** `Promise<boolean>` indicating if encoder is available

**Example:**
```typescript
import { isGPUEncoderAvailable } from '@rendervid/renderer-node';

// Check for NVIDIA NVENC
const hasNvenc = await isGPUEncoderAvailable('h264_nvenc');
if (hasNvenc) {
  console.log('NVIDIA GPU encoding available');
}

// Check for Apple VideoToolbox
const hasVideoToolbox = await isGPUEncoderAvailable('h264_videotoolbox');
if (hasVideoToolbox) {
  console.log('Apple VideoToolbox encoding available');
}
```

### getGPUDescription()

Gets a human-readable description of GPU capabilities.

```typescript
function getGPUDescription(gpuInfo: GPUInfo): string
```

**Parameters:**
- `gpuInfo` - GPU information from `detectGPUCapabilities()`

**Returns:** Formatted string describing the GPU setup

**Example:**
```typescript
import { detectGPUCapabilities, getGPUDescription } from '@rendervid/renderer-node';

const gpuInfo = await detectGPUCapabilities();
console.log(getGPUDescription(gpuInfo));
// Output: "NVIDIA GPU (RTX 3080) - h264_nvenc available"
// or: "APPLE GPU (Apple M1) - h264_videotoolbox available"
// or: "GPU acceleration not available"
```

## Type Definitions

### GPUInfo

```typescript
interface GPUInfo {
  available: boolean;
  vendor: 'nvidia' | 'apple' | 'intel' | 'amd' | 'unknown';
  model?: string;
  encoders: string[];
  recommendedEncoder?: string;
  error?: string;
}
```

### GPUConfig

```typescript
interface GPUConfig {
  enabled?: boolean;
  preferredEncoder?: 'h264_nvenc' | 'h264_videotoolbox' | 'h264_qsv' | 'h264_amf';
  fallbackToSoftware?: boolean;
}
```

### HardwareEncoder

```typescript
type HardwareEncoder =
  | 'h264_nvenc'
  | 'hevc_nvenc'
  | 'h264_videotoolbox'
  | 'hevc_videotoolbox'
  | 'h264_qsv'
  | 'hevc_qsv'
  | 'h264_amf'
  | 'hevc_amf';
```

## Usage with NodeRenderer

While Phase 1 only provides detection infrastructure, you can use it to determine encoding capabilities:

```typescript
import {
  createNodeRenderer,
  detectGPUCapabilities
} from '@rendervid/renderer-node';

// Detect GPU capabilities
const gpuInfo = await detectGPUCapabilities();

// Create renderer
const renderer = createNodeRenderer({
  gpu: {
    enabled: gpuInfo.available,
    preferredEncoder: gpuInfo.recommendedEncoder,
    fallbackToSoftware: true,
  }
});

// Note: Actual GPU encoding will be implemented in Phase 2
```

## Detection Logic

The GPU detection follows this process:

1. **Query FFmpeg**: Execute `ffmpeg -hide_banner -encoders` to get available encoders
2. **Parse Output**: Extract video encoder names from FFmpeg output
3. **Filter Hardware Encoders**: Identify hardware encoders we support
4. **Detect Vendor**: Determine GPU vendor based on available encoders and platform
5. **Recommend Encoder**: Select best encoder based on vendor and availability
6. **Detect Model**: Attempt to get GPU model name (platform-dependent)

### Vendor Priority

When multiple hardware encoders are available:
1. **macOS**: Apple VideoToolbox (highest priority)
2. **Others**: NVIDIA > Intel > AMD

### Model Detection

GPU model detection is best-effort and platform-dependent:

**macOS:**
```bash
system_profiler SPDisplaysDataType
```

**Linux:**
```bash
nvidia-smi --query-gpu=name --format=csv,noheader  # NVIDIA
lspci | grep -i vga  # Other GPUs
```

**Windows:**
```cmd
wmic path win32_VideoController get name
```

## Error Handling

The detection system handles errors gracefully:

- If FFmpeg is not found, returns `available: false` with error message
- If FFmpeg output is malformed, returns `available: false`
- If GPU model detection fails, continues without model info
- All functions have proper try-catch blocks for robustness

## Performance

- **Initial detection**: 100-500ms (depends on system)
- **Single encoder check**: 50-200ms
- **Recommended usage**: Cache results, detect once at startup

## Examples

See `/packages/renderer-node/examples/detect-gpu.js` for a complete working example.

Run with:
```bash
cd packages/renderer-node
node examples/detect-gpu.js
```

## Testing

Run the test suite:
```bash
cd packages/renderer-node
pnpm test gpu-detector
```

The test suite includes:
- Detection for all supported vendors (NVIDIA, Apple, Intel, AMD)
- Single encoder availability checks
- Error handling scenarios
- Edge cases (empty output, malformed output, etc.)
- Platform-specific detection logic
- Custom FFmpeg path support

## Troubleshooting

### No GPU detected but hardware is present

**Check FFmpeg compilation:**
```bash
ffmpeg -hide_banner -encoders | grep -E "(nvenc|videotoolbox|qsv|amf)"
```

If no hardware encoders appear, FFmpeg needs to be recompiled with hardware acceleration support.

**Installation guides:**
- **NVIDIA**: Install CUDA toolkit and FFmpeg with `--enable-nvenc`
- **Apple**: FFmpeg should include VideoToolbox support by default on macOS
- **Intel**: Install Intel Media SDK and FFmpeg with `--enable-libmfx`
- **AMD**: Install AMD AMF SDK and FFmpeg with `--enable-amf`

### Wrong encoder recommended

You can override the recommendation:
```typescript
const gpuInfo = await detectGPUCapabilities();
// Manually select different encoder
const preferredEncoder = 'h264_qsv'; // Use Intel QSV instead
```

### Detection is slow

Cache the detection results:
```typescript
let cachedGPUInfo: GPUInfo | null = null;

async function getGPUInfo(): Promise<GPUInfo> {
  if (!cachedGPUInfo) {
    cachedGPUInfo = await detectGPUCapabilities();
  }
  return cachedGPUInfo;
}
```

## Future Enhancements (Phase 2+)

- **Phase 2**: Actual GPU-accelerated encoding in FFmpegEncoder
- **Phase 3**: Automatic codec selection based on detected GPU
- **Phase 4**: GPU quality/speed presets
- **Phase 5**: Multi-GPU support and load balancing

## Related Documentation

- [FFmpeg Hardware Acceleration](https://trac.ffmpeg.org/wiki/HWAccelIntro)
- [NVIDIA NVENC](https://developer.nvidia.com/nvidia-video-codec-sdk)
- [Apple VideoToolbox](https://developer.apple.com/documentation/videotoolbox)
- [Intel Quick Sync Video](https://www.intel.com/content/www/us/en/architecture-and-technology/quick-sync-video/quick-sync-video-general.html)

## License

Same as Rendervid project - see LICENSE file in repository root.
