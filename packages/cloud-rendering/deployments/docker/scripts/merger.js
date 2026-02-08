#!/usr/bin/env node

/**
 * Docker merger script
 * Concatenates video chunks into final output
 * Supports both MP4 (H.264) and MOV (ProRes) formats
 */

const { readFileSync, writeFileSync, readdirSync, existsSync, statSync } = require('fs');
const { join } = require('path');
const { spawn } = require('child_process');

const DATA_PATH = '/data';

async function main() {
  const jobId = process.env.JOB_ID;

  console.log(`[Merger] Starting merge for job ${jobId}`);

  // Load manifest
  const manifestPath = join(DATA_PATH, 'rendervid', 'jobs', jobId, 'manifest.json');
  const manifest = JSON.parse(readFileSync(manifestPath, 'utf-8'));

  // Determine format from manifest
  const codec = manifest.codec || manifest.template.output.codec || 'libx264';
  const isProRes = codec === 'prores' || codec === 'prores_ks';
  const fileExt = isProRes ? 'mov' : 'mp4';

  console.log(`[Merger] Output format: ${fileExt} (codec: ${codec})`);

  // Get all chunks
  const chunksDir = join(DATA_PATH, 'rendervid', 'jobs', jobId, 'chunks');
  const chunkPattern = new RegExp(`chunk-(\\d+)\\.${fileExt}`);
  const chunks = readdirSync(chunksDir)
    .filter((f) => f.endsWith(`.${fileExt}`))
    .sort((a, b) => {
      const aNum = parseInt(a.match(chunkPattern)?.[1] || '0');
      const bNum = parseInt(b.match(chunkPattern)?.[1] || '0');
      return aNum - bNum;
    });

  console.log(`[Merger] Found ${chunks.length} chunks to merge`);

  // Create concat file
  const concatFilePath = join(DATA_PATH, 'rendervid', 'jobs', jobId, 'concat.txt');
  const concatContent = chunks.map((chunk) => `file 'chunks/${chunk}'`).join('\n');
  writeFileSync(concatFilePath, concatContent);

  // Merge with FFmpeg
  const outputPath = join(DATA_PATH, 'rendervid', 'jobs', jobId, `output.${fileExt}`);

  const ffmpegArgs = [
    '-f', 'concat',
    '-safe', '0',
    '-i', concatFilePath,
  ];

  if (isProRes) {
    // For ProRes, re-encode to ensure consistent stream parameters
    ffmpegArgs.push(
      '-c:v', 'prores_ks',
      '-profile:v', '4444',
      '-pix_fmt', 'yuva444p10le',
      '-vendor', 'apl0'
    );
  } else {
    // For H.264, stream copy is safe
    ffmpegArgs.push('-c', 'copy');
  }

  ffmpegArgs.push('-y', outputPath);

  await new Promise((resolve, reject) => {
    const ffmpeg = spawn('ffmpeg', ffmpegArgs);

    ffmpeg.stderr.on('data', (data) => {
      const line = data.toString();
      if (line.includes('frame=')) {
        process.stdout.write('.');
      }
    });

    ffmpeg.on('close', (code) => {
      if (code === 0) {
        console.log(`\n[Merger] Video merged successfully`);
        resolve();
      } else {
        reject(new Error(`FFmpeg merge failed with code ${code}`));
      }
    });
  });

  // Get file stats
  const stats = statSync(outputPath);
  const duration = manifest.template.output.duration || 0;

  // Write completion marker
  const completionPath = join(DATA_PATH, 'rendervid', 'jobs', jobId, 'complete.json');
  writeFileSync(
    completionPath,
    JSON.stringify({
      status: 'completed',
      outputUrl: `file://${outputPath}`,
      outputFormat: fileExt,
      fileSize: stats.size,
      duration,
      renderTime: 0, // Calculated by backend
      chunksRendered: chunks.length,
      completedAt: new Date().toISOString(),
    })
  );

  console.log(`[Merger] Job ${jobId} complete`);
}

main().catch((error) => {
  console.error('[Merger] Error:', error);
  process.exit(1);
});
