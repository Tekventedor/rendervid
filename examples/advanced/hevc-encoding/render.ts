import path from 'path';
import { createNodeRenderer } from '@rendervid/renderer-node';
import template from './template.json';

async function main() {
  const renderer = createNodeRenderer();

  // Basic HEVC encoding using the 'hevc' alias
  console.log('Rendering with HEVC codec (alias)...');
  const result = await renderer.renderVideo({
    template: template as any,
    outputPath: path.join(__dirname, 'output-hevc.mp4'),
    codec: 'hevc',
    onProgress: (progress) => {
      console.log(`[${progress.phase}] ${progress.percent.toFixed(1)}%`);
    },
  });
  console.log('Result:', result.success ? 'Success' : `Failed: ${result.error}`);

  // HEVC with explicit libx265 codec and custom quality
  console.log('\nRendering with libx265 codec and custom CRF...');
  const result2 = await renderer.renderVideo({
    template: template as any,
    outputPath: path.join(__dirname, 'output-hevc-hq.mp4'),
    codec: 'libx265',
    quality: 22, // Lower CRF = higher quality
    preset: 'slow', // Slower preset = better compression
    onProgress: (progress) => {
      console.log(`[${progress.phase}] ${progress.percent.toFixed(1)}%`);
    },
  });
  console.log('Result:', result2.success ? 'Success' : `Failed: ${result2.error}`);

  // HEVC with hardware acceleration (auto-detect)
  console.log('\nRendering with HEVC + hardware acceleration...');
  const hwRenderer = createNodeRenderer({
    gpu: {
      encoding: 'auto',
      fallback: true,
    },
  });

  const result3 = await hwRenderer.renderVideo({
    template: template as any,
    outputPath: path.join(__dirname, 'output-hevc-hw.mp4'),
    codec: 'hevc',
    onProgress: (progress) => {
      console.log(`[${progress.phase}] ${progress.percent.toFixed(1)}%`);
    },
  });
  console.log('Result:', result3.success ? 'Success' : `Failed: ${result3.error}`);
}

main().catch(console.error);
