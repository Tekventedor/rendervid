/**
 * Post-render validation to detect black scenes and other issues
 */

import { execSync } from 'child_process';
import { existsSync } from 'fs';
import { createLogger } from './logger.js';

const logger = createLogger('post-render-validator');

export interface PostRenderValidationResult {
  hasIssues: boolean;
  blackScenes: number[];
  lowQuality: boolean;
  suggestions: string[];
}

/**
 * Validate rendered video by extracting sample frames
 */
export async function validateRenderedVideo(
  videoPath: string,
  expectedDuration: number,
  fps: number = 30
): Promise<PostRenderValidationResult> {
  const result: PostRenderValidationResult = {
    hasIssues: false,
    blackScenes: [],
    lowQuality: false,
    suggestions: [],
  };

  if (!existsSync(videoPath)) {
    logger.error('Video file does not exist:', videoPath);
    return result;
  }

  try {
    // Get video file size
    const stats = require('fs').statSync(videoPath);
    const sizeMB = stats.size / 1024 / 1024;

    // Check for unusually small file size (indicates black scenes or compression issues)
    const expectedMinSize = (expectedDuration / 15) * 0.5; // At least 0.5MB per 15 seconds
    if (sizeMB < expectedMinSize) {
      result.hasIssues = true;
      result.lowQuality = true;
      result.suggestions.push(
        `Video file is unusually small (${sizeMB.toFixed(2)} MB). This often indicates black scenes or over-compression. Expected at least ${expectedMinSize.toFixed(2)} MB.`
      );
    }

    // Extract sample frames from different parts of the video
    const framesToCheck = [
      0, // Start
      Math.floor(fps * expectedDuration * 0.25), // 25%
      Math.floor(fps * expectedDuration * 0.5), // 50%
      Math.floor(fps * expectedDuration * 0.75), // 75%
    ];

    for (const frameNum of framesToCheck) {
      try {
        // Extract frame to temp file
        const tempFramePath = `/tmp/frame-check-${frameNum}.png`;

        // Extract frame
        execSync(
          `ffmpeg -i "${videoPath}" -vf "select='eq(n,${frameNum})'" -frames:v 1 -update 1 "${tempFramePath}" -y 2>&1 | grep -v "deprecated"`,
          { stdio: 'pipe' }
        );

        // Check frame file size
        if (existsSync(tempFramePath)) {
          const frameStats = require('fs').statSync(tempFramePath);
          const frameSizeKB = frameStats.size / 1024;

          // Black frames are typically very small (< 15 KB for 1920x1080)
          if (frameSizeKB < 15) {
            result.hasIssues = true;
            result.blackScenes.push(frameNum);

            // Try to clean up
            try {
              require('fs').unlinkSync(tempFramePath);
            } catch (e) {
              // Ignore cleanup errors
            }
          }
        }
      } catch (error) {
        logger.warn('Failed to extract frame', { frameNum, error });
      }
    }

    // Add suggestions based on detected issues
    if (result.blackScenes.length > 0) {
      const sceneNumbers = result.blackScenes.map(f => Math.floor(f / fps)).join(', ');
      result.suggestions.push(
        `⚠️ BLACK SCENES DETECTED at frame(s): ${result.blackScenes.join(', ')} (around ${sceneNumbers} seconds)`
      );
      result.suggestions.push(
        'Common causes:'
      );
      result.suggestions.push(
        '  1. Unsupported animations (custom keyframes) - Use fadeIn/fadeOut instead'
      );
      result.suggestions.push(
        '  2. Elements positioned outside canvas bounds - Check x/y coordinates'
      );
      result.suggestions.push(
        '  3. Invalid gradient syntax - Check CSS gradient format'
      );
      result.suggestions.push(
        '  4. Media files not loading - Increase renderWaitTime to 800ms'
      );
      result.suggestions.push(
        'Fix: Extract the black frame to inspect: ffmpeg -i video.mp4 -vf "select=\'eq(n,' + result.blackScenes[0] + ')\'" -frames:v 1 frame.png'
      );
    }

    if (result.lowQuality && result.blackScenes.length === 0) {
      result.suggestions.push(
        'Video quality may be low. Consider using "quality": "high" for better results.'
      );
    }

  } catch (error) {
    logger.error('Post-render validation failed', { error });
  }

  return result;
}
