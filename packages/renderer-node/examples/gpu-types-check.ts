/**
 * Type-checking example to verify GPU detection types are properly exported
 *
 * This file is not meant to be executed, only type-checked.
 * Run: npx tsc --noEmit examples/gpu-types-check.ts
 */

import type {
  GPUConfig,
  GPUInfo,
  GPUVendor,
  HardwareEncoder,
  NodeRendererOptions,
} from '../src/index';

import {
  detectGPUCapabilities,
  isGPUEncoderAvailable,
  getGPUDescription,
  createNodeRenderer,
} from '../src/index';

// Test GPUConfig interface
const gpuConfig: GPUConfig = {
  enabled: true,
  preferredEncoder: 'h264_nvenc',
  fallbackToSoftware: true,
};

// Test GPUInfo interface
const gpuInfo: GPUInfo = {
  available: true,
  vendor: 'nvidia',
  model: 'RTX 3080',
  encoders: ['h264_nvenc', 'hevc_nvenc'],
  recommendedEncoder: 'h264_nvenc',
};

// Test GPUVendor type
const vendors: GPUVendor[] = ['nvidia', 'apple', 'intel', 'amd', 'unknown'];

// Test HardwareEncoder type
const encoders: HardwareEncoder[] = [
  'h264_nvenc',
  'hevc_nvenc',
  'h264_videotoolbox',
  'hevc_videotoolbox',
  'h264_qsv',
  'hevc_qsv',
  'h264_amf',
  'hevc_amf',
];

// Test function signatures
async function testDetection() {
  // detectGPUCapabilities
  const info1: GPUInfo = await detectGPUCapabilities();
  const info2: GPUInfo = await detectGPUCapabilities('/custom/ffmpeg');

  // isGPUEncoderAvailable
  const available1: boolean = await isGPUEncoderAvailable('h264_nvenc');
  const available2: boolean = await isGPUEncoderAvailable('h264_nvenc', '/custom/ffmpeg');

  // getGPUDescription
  const description: string = getGPUDescription(info1);

  return { info1, info2, available1, available2, description };
}

// Test NodeRendererOptions with GPU config
const rendererOptions: NodeRendererOptions = {
  gpu: {
    enabled: true,
    preferredEncoder: 'h264_videotoolbox',
    fallbackToSoftware: true,
  },
  ffmpeg: {
    ffmpegPath: '/usr/local/bin/ffmpeg',
  },
  tempDir: '/tmp',
  concurrency: 4,
};

// Test createNodeRenderer with GPU options
const renderer = createNodeRenderer(rendererOptions);

// All vendor values should be valid
const validVendor: GPUVendor = 'nvidia';
const validVendor2: GPUVendor = 'apple';
const validVendor3: GPUVendor = 'intel';
const validVendor4: GPUVendor = 'amd';
const validVendor5: GPUVendor = 'unknown';

// All encoder values should be valid
const validEncoder1: HardwareEncoder = 'h264_nvenc';
const validEncoder2: HardwareEncoder = 'h264_videotoolbox';
const validEncoder3: HardwareEncoder = 'h264_qsv';
const validEncoder4: HardwareEncoder = 'h264_amf';

console.log('Type checking passed!');
