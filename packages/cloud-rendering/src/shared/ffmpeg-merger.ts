import { spawn } from 'child_process';
import { writeFileSync, unlinkSync } from 'fs';
import { join } from 'path';

/**
 * Options for merging video chunks
 */
export interface MergeChunksOptions {
  /** Array of chunk file paths in order */
  chunkPaths: string[];

  /** Output file path */
  outputPath: string;

  /** FFmpeg binary path (for cloud environments) */
  ffmpegPath?: string;

  /** Temporary directory for concat list */
  tempDir?: string;
}

/**
 * Merge video chunks using FFmpeg concat demuxer
 *
 * Uses FFmpeg's concat demuxer with copy codec to avoid re-encoding.
 * This ensures perfect quality and fast merging.
 *
 * @param options - Merge options
 * @returns Promise that resolves when merging is complete
 */
export async function mergeChunks(options: MergeChunksOptions): Promise<void> {
  const {
    chunkPaths,
    outputPath,
    ffmpegPath = 'ffmpeg',
    tempDir = '/tmp',
  } = options;

  if (chunkPaths.length === 0) {
    throw new Error('No chunks to merge');
  }

  // Create concat demuxer file
  const concatListPath = join(tempDir, `concat-${Date.now()}.txt`);
  const concatList = chunkPaths.map((path) => `file '${path}'`).join('\n');
  writeFileSync(concatListPath, concatList, 'utf-8');

  try {
    // Run FFmpeg to concatenate chunks
    const args = [
      '-y', // Overwrite output file
      '-f', 'concat',
      '-safe', '0',
      '-i', concatListPath,
      '-c', 'copy', // Copy codec (no re-encoding)
      '-movflags', '+faststart', // Enable streaming
      outputPath,
    ];

    await runFFmpeg(ffmpegPath, args);
  } finally {
    // Clean up concat list file
    try {
      unlinkSync(concatListPath);
    } catch {
      // Ignore cleanup errors
    }
  }
}

/**
 * Add audio to a video file
 */
export interface AddAudioOptions {
  /** Video file path */
  videoPath: string;

  /** Audio file path */
  audioPath: string;

  /** Output file path */
  outputPath: string;

  /** Audio duration to trim (seconds) */
  audioDuration?: number;

  /** FFmpeg binary path */
  ffmpegPath?: string;
}

/**
 * Add audio to video with precise trimming
 */
export async function addAudioToVideo(options: AddAudioOptions): Promise<void> {
  const { videoPath, audioPath, outputPath, audioDuration, ffmpegPath = 'ffmpeg' } = options;

  const args = [
    '-y', // Overwrite output file
    '-i', videoPath,
    '-i', audioPath,
    '-c:v', 'copy', // Copy video codec
    '-c:a', 'aac', // Encode audio to AAC
    '-b:a', '192k', // Audio bitrate
  ];

  // Trim audio if duration specified
  if (audioDuration) {
    args.push('-t', audioDuration.toString());
  }

  // Map both streams and enable faststart
  args.push('-map', '0:v:0', '-map', '1:a:0', '-movflags', '+faststart', outputPath);

  await runFFmpeg(ffmpegPath, args);
}

/**
 * Run FFmpeg command
 */
function runFFmpeg(ffmpegPath: string, args: string[]): Promise<void> {
  return new Promise((resolve, reject) => {
    const process = spawn(ffmpegPath, args, {
      stdio: ['ignore', 'pipe', 'pipe'],
    });

    let stderr = '';

    process.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    process.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`FFmpeg exited with code ${code}\n${stderr}`));
      }
    });

    process.on('error', (error) => {
      reject(error);
    });
  });
}

/**
 * Get video duration using ffprobe
 */
export async function getVideoDuration(videoPath: string, ffprobePath = 'ffprobe'): Promise<number> {
  return new Promise((resolve, reject) => {
    const process = spawn(ffprobePath, [
      '-v',
      'error',
      '-show_entries',
      'format=duration',
      '-of',
      'default=noprint_wrappers=1:nokey=1',
      videoPath,
    ]);

    let stdout = '';

    process.stdout.on('data', (data) => {
      stdout += data.toString();
    });

    process.on('close', (code) => {
      if (code === 0) {
        const duration = parseFloat(stdout.trim());
        resolve(duration);
      } else {
        reject(new Error(`ffprobe exited with code ${code}`));
      }
    });

    process.on('error', (error) => {
      reject(error);
    });
  });
}
