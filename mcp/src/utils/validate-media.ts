import { createLogger } from './logger.js';
import https from 'https';
import http from 'http';
import { URL } from 'url';

const logger = createLogger('validate-media');

export interface MediaValidationResult {
  valid: boolean;
  url: string;
  error?: string;
  contentType?: string;
  fileSize?: number;
  isImage?: boolean;
  isVideo?: boolean;
  isAudio?: boolean;
}

/**
 * Validate that a URL exists and is the expected media type
 */
export async function validateMediaUrl(
  url: string,
  expectedType: 'image' | 'video' | 'audio'
): Promise<MediaValidationResult> {
  const result: MediaValidationResult = {
    valid: false,
    url,
  };

  try {
    // Skip validation for local file paths
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      logger.info('Skipping validation for local file path', { url });
      return {
        valid: true,
        url,
        contentType: 'local-file',
      };
    }

    // Parse URL
    try {
      new URL(url);
    } catch (e) {
      return {
        ...result,
        error: `Invalid URL format: ${url}`,
      };
    }

    // Make HEAD request to check if resource exists
    const response = await makeHeadRequest(url);

    if (!response.ok) {
      return {
        ...result,
        error: `URL returned ${response.statusCode}: ${url}`,
      };
    }

    const contentType = response.contentType?.toLowerCase() || '';
    const fileSize = response.contentLength;

    // Determine media type from content-type
    const isImage = contentType.startsWith('image/');
    const isVideo = contentType.startsWith('video/');
    const isAudio = contentType.startsWith('audio/');

    // Validate expected type matches actual type
    let typeMatches = false;
    switch (expectedType) {
      case 'image':
        typeMatches = isImage;
        break;
      case 'video':
        typeMatches = isVideo;
        break;
      case 'audio':
        typeMatches = isAudio;
        break;
    }

    if (!typeMatches) {
      return {
        ...result,
        contentType,
        fileSize,
        isImage,
        isVideo,
        isAudio,
        error: `Expected ${expectedType} but got content-type: ${contentType}`,
      };
    }

    // Success
    return {
      valid: true,
      url,
      contentType,
      fileSize,
      isImage,
      isVideo,
      isAudio,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logger.error('Media validation failed', { url, error: errorMessage });

    return {
      ...result,
      error: `Failed to validate URL: ${errorMessage}`,
    };
  }
}

interface HeadResponse {
  ok: boolean;
  statusCode: number;
  contentType?: string;
  contentLength?: number;
}

/**
 * Make a HEAD request to check if URL exists and get metadata
 */
function makeHeadRequest(url: string): Promise<HeadResponse> {
  return new Promise((resolve) => {
    const protocol = url.startsWith('https') ? https : http;
    const timeout = 10000; // 10 second timeout

    const request = protocol.request(
      url,
      {
        method: 'HEAD',
        timeout,
      },
      (response) => {
        // Follow redirects (3xx status codes)
        if (response.statusCode && response.statusCode >= 300 && response.statusCode < 400) {
          const location = response.headers.location;
          if (location) {
            logger.info('Following redirect', { from: url, to: location });
            resolve(makeHeadRequest(location));
            return;
          }
        }

        resolve({
          ok: response.statusCode === 200,
          statusCode: response.statusCode || 0,
          contentType: response.headers['content-type'],
          contentLength: response.headers['content-length']
            ? parseInt(response.headers['content-length'], 10)
            : undefined,
        });
      }
    );

    request.on('error', (error) => {
      logger.error('HEAD request failed', { url, error: error.message });
      resolve({
        ok: false,
        statusCode: 0,
      });
    });

    request.on('timeout', () => {
      request.destroy();
      logger.error('HEAD request timeout', { url });
      resolve({
        ok: false,
        statusCode: 0,
      });
    });

    request.end();
  });
}

/**
 * Validate all media URLs in a template
 */
export async function validateTemplateMedia(template: any): Promise<{
  valid: boolean;
  errors: string[];
  warnings: string[];
}> {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Find all image, video, and audio layers
  const mediaLayers: Array<{ id: string; type: string; url: string }> = [];

  if (template.composition?.scenes) {
    for (const scene of template.composition.scenes) {
      if (scene.layers) {
        for (const layer of scene.layers) {
          // Image layers
          if (layer.type === 'image' && layer.props?.src) {
            mediaLayers.push({
              id: layer.id,
              type: 'image',
              url: layer.props.src,
            });
          }

          // Video layers
          if (layer.type === 'video' && layer.props?.src) {
            mediaLayers.push({
              id: layer.id,
              type: 'video',
              url: layer.props.src,
            });
          }

          // Audio layers
          if (layer.type === 'audio' && layer.props?.src) {
            mediaLayers.push({
              id: layer.id,
              type: 'audio',
              url: layer.props.src,
            });
          }
        }
      }
    }
  }

  // Validate each media URL
  logger.info('Validating media URLs', { count: mediaLayers.length });

  for (const media of mediaLayers) {
    // Check for common invalid paths that AI might generate
    if (media.url.includes('/mnt/') || media.url.includes('/home/claude/')) {
      errors.push(
        `❌ Layer "${media.id}": Invalid path "${media.url}". On macOS, use HTTPS URLs for images (e.g., from Unsplash, Pexels, or Photomatic AI), not Linux-style paths like /mnt/ or /home/claude/`
      );
      continue;
    }

    if (media.url.startsWith('file://')) {
      errors.push(
        `❌ Layer "${media.id}": file:// URLs are blocked by browser security. Use HTTPS image URLs instead of: ${media.url}`
      );
      continue;
    }

    const result = await validateMediaUrl(media.url, media.type as any);

    if (!result.valid) {
      // Make error messages more AI-friendly
      let errorMsg = `❌ Layer "${media.id}" (${media.type}): ${result.error || 'Unknown error'}`;

      if (result.error?.includes('404')) {
        errorMsg += ' - Image not found at this URL. Use a different image URL.';
      } else if (result.error?.includes('403')) {
        errorMsg += ' - Access denied. This image URL may require authentication or has access restrictions.';
      } else if (result.error?.includes('content-type')) {
        errorMsg += ' - The URL does not point to a valid image/video file.';
      }

      errors.push(errorMsg);
    } else if (result.contentType === 'local-file') {
      warnings.push(
        `⚠️  Layer "${media.id}" uses local file path - ensure file exists: ${media.url}`
      );
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}
