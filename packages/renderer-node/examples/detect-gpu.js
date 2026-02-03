/**
 * GPU Detection Example
 *
 * This example demonstrates how to detect GPU capabilities
 * for hardware-accelerated video encoding.
 *
 * Run with: node examples/detect-gpu.js
 */

const { detectGPUCapabilities, isGPUEncoderAvailable, getGPUDescription } = require('../dist/index.js');

async function main() {
  console.log('=== GPU Detection Demo ===\n');

  // Detect all GPU capabilities
  console.log('1. Detecting GPU capabilities...');
  const gpuInfo = await detectGPUCapabilities();

  console.log('\nGPU Information:');
  console.log('-'.repeat(50));
  console.log(`Available: ${gpuInfo.available}`);
  console.log(`Vendor: ${gpuInfo.vendor}`);
  if (gpuInfo.model) {
    console.log(`Model: ${gpuInfo.model}`);
  }
  console.log(`Encoders: ${gpuInfo.encoders.join(', ') || 'none'}`);
  if (gpuInfo.recommendedEncoder) {
    console.log(`Recommended: ${gpuInfo.recommendedEncoder}`);
  }
  if (gpuInfo.error) {
    console.log(`Error: ${gpuInfo.error}`);
  }

  // Get human-readable description
  console.log('\n2. GPU Description:');
  console.log('-'.repeat(50));
  console.log(getGPUDescription(gpuInfo));

  // Check specific encoders
  console.log('\n3. Checking specific encoders:');
  console.log('-'.repeat(50));

  const encodersToCheck = [
    'h264_nvenc',
    'h264_videotoolbox',
    'h264_qsv',
    'h264_amf',
  ];

  for (const encoder of encodersToCheck) {
    const available = await isGPUEncoderAvailable(encoder);
    const status = available ? '✓ Available' : '✗ Not available';
    console.log(`${encoder.padEnd(20)}: ${status}`);
  }

  // Recommendations
  console.log('\n4. Recommendations:');
  console.log('-'.repeat(50));
  if (gpuInfo.available && gpuInfo.recommendedEncoder) {
    console.log(`Use GPU encoding with: ${gpuInfo.recommendedEncoder}`);
    console.log('This will provide faster rendering with lower CPU usage.');
  } else {
    console.log('GPU encoding not available.');
    console.log('Will use software encoding (libx264).');
    console.log('Consider installing GPU drivers or FFmpeg with hardware acceleration.');
  }

  console.log('\n=== Detection Complete ===\n');
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
