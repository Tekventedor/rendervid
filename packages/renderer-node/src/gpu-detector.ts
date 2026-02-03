import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

/**
 * GPU vendor types
 */
export type GPUVendor = 'nvidia' | 'apple' | 'intel' | 'amd' | 'unknown';

/**
 * Hardware encoder types supported by FFmpeg
 */
export type HardwareEncoder =
  | 'h264_nvenc'      // NVIDIA NVENC
  | 'hevc_nvenc'      // NVIDIA NVENC (H.265)
  | 'h264_videotoolbox' // Apple VideoToolbox
  | 'hevc_videotoolbox' // Apple VideoToolbox (H.265)
  | 'h264_qsv'        // Intel Quick Sync Video
  | 'hevc_qsv'        // Intel Quick Sync Video (H.265)
  | 'h264_amf'        // AMD Advanced Media Framework
  | 'hevc_amf';       // AMD Advanced Media Framework (H.265)

/**
 * Information about detected GPU capabilities
 */
export interface GPUInfo {
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

/**
 * Platform information for GPU detection
 */
interface PlatformInfo {
  platform: NodeJS.Platform;
  arch: string;
}

/**
 * Detect GPU capabilities by checking available FFmpeg encoders
 *
 * This function queries FFmpeg to determine which hardware encoders are available
 * on the system. It does not directly query GPU hardware, but instead checks what
 * FFmpeg has been compiled with and can access.
 *
 * @param ffmpegPath - Optional custom path to FFmpeg binary
 * @returns Promise with GPU information including available encoders
 *
 * @example
 * ```typescript
 * const gpuInfo = await detectGPUCapabilities();
 * if (gpuInfo.available) {
 *   console.log(`GPU acceleration available via ${gpuInfo.recommendedEncoder}`);
 * }
 * ```
 */
export async function detectGPUCapabilities(ffmpegPath: string = 'ffmpeg'): Promise<GPUInfo> {
  try {
    // Get platform information
    const platformInfo: PlatformInfo = {
      platform: process.platform,
      arch: process.arch,
    };

    // Query FFmpeg for available encoders
    const { stdout } = await execAsync(`${ffmpegPath} -hide_banner -encoders`);

    // Parse available encoders from FFmpeg output
    const availableEncoders = parseFFmpegEncoders(stdout);

    // Detect GPU vendor based on platform and available encoders
    const vendor = detectGPUVendor(platformInfo, availableEncoders);

    // Filter for hardware video encoders we support
    const hardwareEncoders = filterHardwareEncoders(availableEncoders);

    // Determine recommended encoder based on vendor and availability
    const recommendedEncoder = selectRecommendedEncoder(vendor, hardwareEncoders);

    // Try to get GPU model name (best effort, platform-dependent)
    const model = await detectGPUModel(platformInfo, vendor);

    return {
      available: hardwareEncoders.length > 0,
      vendor,
      model,
      encoders: hardwareEncoders,
      recommendedEncoder,
    };
  } catch (error) {
    // If detection fails, return graceful fallback
    return {
      available: false,
      vendor: 'unknown',
      encoders: [],
      error: error instanceof Error ? error.message : 'Failed to detect GPU capabilities',
    };
  }
}

/**
 * Check if a specific GPU encoder is available on the system
 *
 * This is a convenience function for checking a single encoder without
 * running full GPU detection.
 *
 * @param encoder - The hardware encoder to check for
 * @param ffmpegPath - Optional custom path to FFmpeg binary
 * @returns Promise<boolean> indicating if encoder is available
 *
 * @example
 * ```typescript
 * const hasNvenc = await isGPUEncoderAvailable('h264_nvenc');
 * if (hasNvenc) {
 *   console.log('NVIDIA GPU encoding available');
 * }
 * ```
 */
export async function isGPUEncoderAvailable(
  encoder: HardwareEncoder,
  ffmpegPath: string = 'ffmpeg'
): Promise<boolean> {
  try {
    const { stdout } = await execAsync(`${ffmpegPath} -hide_banner -encoders`);
    const encoderRegex = new RegExp(`^\\s*V.*${encoder}`, 'm');
    return encoderRegex.test(stdout);
  } catch (error) {
    // If FFmpeg query fails, assume encoder not available
    return false;
  }
}

/**
 * Parse FFmpeg encoder output to extract encoder names
 */
function parseFFmpegEncoders(output: string): string[] {
  const encoders: string[] = [];
  const lines = output.split('\n');

  for (const line of lines) {
    // FFmpeg encoder format: " V..... libx264   libx264 H.264 / AVC / MPEG-4 AVC / MPEG-4 part 10"
    // or with flags: " V....D h264_videotoolbox    VideoToolbox H.264 Encoder"
    // We're looking for lines starting with V (video encoders)
    // Flags can be: . (none), D (direct), F (frame-level), S (slice-level), etc.
    const match = line.match(/^\s*V[.\sAEFSXBDILH]*\s+(\S+)/);
    if (match) {
      encoders.push(match[1]);
    }
  }

  return encoders;
}

/**
 * Filter for hardware encoders we support
 */
function filterHardwareEncoders(encoders: string[]): HardwareEncoder[] {
  const supportedEncoders: HardwareEncoder[] = [
    'h264_nvenc',
    'hevc_nvenc',
    'h264_videotoolbox',
    'hevc_videotoolbox',
    'h264_qsv',
    'hevc_qsv',
    'h264_amf',
    'hevc_amf',
  ];

  return encoders.filter((encoder): encoder is HardwareEncoder =>
    supportedEncoders.includes(encoder as HardwareEncoder)
  );
}

/**
 * Detect GPU vendor based on platform and available encoders
 */
function detectGPUVendor(
  platformInfo: PlatformInfo,
  encoders: string[]
): GPUVendor {
  // Apple Silicon or macOS with VideoToolbox
  if (platformInfo.platform === 'darwin') {
    if (encoders.some(e => e.includes('videotoolbox'))) {
      return 'apple';
    }
  }

  // NVIDIA GPUs
  if (encoders.some(e => e.includes('nvenc'))) {
    return 'nvidia';
  }

  // Intel GPUs
  if (encoders.some(e => e.includes('qsv'))) {
    return 'intel';
  }

  // AMD GPUs
  if (encoders.some(e => e.includes('amf'))) {
    return 'amd';
  }

  return 'unknown';
}

/**
 * Select the recommended encoder based on vendor and available encoders
 */
function selectRecommendedEncoder(
  vendor: GPUVendor,
  encoders: HardwareEncoder[]
): HardwareEncoder | undefined {
  if (encoders.length === 0) {
    return undefined;
  }

  // Priority order by vendor
  const priorityMap: Record<GPUVendor, HardwareEncoder[]> = {
    nvidia: ['h264_nvenc', 'hevc_nvenc'],
    apple: ['h264_videotoolbox', 'hevc_videotoolbox'],
    intel: ['h264_qsv', 'hevc_qsv'],
    amd: ['h264_amf', 'hevc_amf'],
    unknown: ['h264_nvenc', 'h264_videotoolbox', 'h264_qsv', 'h264_amf'],
  };

  const priorities = priorityMap[vendor];

  // Find first available encoder from priority list
  for (const preferredEncoder of priorities) {
    if (encoders.includes(preferredEncoder)) {
      return preferredEncoder;
    }
  }

  // Fallback to first available encoder
  return encoders[0];
}

/**
 * Attempt to detect GPU model name (best effort, platform-dependent)
 */
async function detectGPUModel(
  platformInfo: PlatformInfo,
  vendor: GPUVendor
): Promise<string | undefined> {
  try {
    switch (platformInfo.platform) {
      case 'darwin':
        return await detectMacGPUModel();
      case 'linux':
        return await detectLinuxGPUModel(vendor);
      case 'win32':
        return await detectWindowsGPUModel();
      default:
        return undefined;
    }
  } catch {
    // If model detection fails, continue without it
    return undefined;
  }
}

/**
 * Detect GPU model on macOS using system_profiler
 */
async function detectMacGPUModel(): Promise<string | undefined> {
  try {
    const { stdout } = await execAsync('system_profiler SPDisplaysDataType');
    const match = stdout.match(/Chipset Model:\s*(.+)/);
    return match ? match[1].trim() : undefined;
  } catch {
    return undefined;
  }
}

/**
 * Detect GPU model on Linux
 */
async function detectLinuxGPUModel(vendor: GPUVendor): Promise<string | undefined> {
  try {
    if (vendor === 'nvidia') {
      // Try nvidia-smi for NVIDIA GPUs
      const { stdout } = await execAsync('nvidia-smi --query-gpu=name --format=csv,noheader');
      return stdout.trim();
    } else {
      // Try lspci for other GPUs
      const { stdout } = await execAsync('lspci | grep -i vga');
      const match = stdout.match(/VGA compatible controller:\s*(.+)/);
      return match ? match[1].trim() : undefined;
    }
  } catch {
    return undefined;
  }
}

/**
 * Detect GPU model on Windows using WMIC
 */
async function detectWindowsGPUModel(): Promise<string | undefined> {
  try {
    const { stdout } = await execAsync('wmic path win32_VideoController get name');
    const lines = stdout.split('\n').filter(line => line.trim() && line !== 'Name');
    return lines[0]?.trim();
  } catch {
    return undefined;
  }
}

/**
 * Get a human-readable description of GPU capabilities
 *
 * @param gpuInfo - GPU information from detectGPUCapabilities
 * @returns A formatted string describing the GPU setup
 *
 * @example
 * ```typescript
 * const gpuInfo = await detectGPUCapabilities();
 * console.log(getGPUDescription(gpuInfo));
 * // Output: "NVIDIA GPU (RTX 3080) - h264_nvenc available"
 * ```
 */
export function getGPUDescription(gpuInfo: GPUInfo): string {
  if (!gpuInfo.available) {
    return `GPU acceleration not available${gpuInfo.error ? `: ${gpuInfo.error}` : ''}`;
  }

  const vendorName = gpuInfo.vendor.toUpperCase();
  const modelInfo = gpuInfo.model ? ` (${gpuInfo.model})` : '';
  const encoderInfo = gpuInfo.recommendedEncoder
    ? ` - ${gpuInfo.recommendedEncoder} available`
    : ` - ${gpuInfo.encoders.length} encoder(s) available`;

  return `${vendorName} GPU${modelInfo}${encoderInfo}`;
}
