import { readFileSync, existsSync, unlinkSync } from 'fs';
import { join } from 'path';
import * as os from 'os';
import { execSync } from 'child_process';

/**
 * Configuration options for template preprocessing
 */
export interface PreprocessOptions {
  /** Maximum file size in KB for base64 encoding (default: 500) */
  maxBase64SizeKB?: number;
}

/**
 * Information about a file conversion
 */
export interface ConversionLog {
  /** Original file path */
  originalPath: string;
  /** Layer ID that was modified */
  layerId: string;
  /** Original file size in KB */
  originalSizeKB: number;
  /** Final file size in KB */
  finalSizeKB: number;
  /** Whether the file was resized */
  wasResized: boolean;
  /** Final data URL length */
  dataUrlLength: number;
}

/**
 * Result of template preprocessing
 */
export interface PreprocessResult {
  /** Modified template with local files converted to data URLs */
  template: any;
  /** Log of all conversions performed */
  conversions: ConversionLog[];
  /** Non-fatal warnings */
  warnings: string[];
  /** Fatal errors (empty array if successful) */
  errors: string[];
}

/**
 * Preprocess a template by converting local file paths to data URLs
 * This allows local images to work without an HTTP server or file:// URLs
 * Large images (> maxBase64SizeKB) are automatically resized
 *
 * @param template - The template to preprocess
 * @param options - Preprocessing options
 * @returns PreprocessResult with modified template and conversion logs
 */
export async function preprocessTemplateFiles(
  template: any,
  options?: PreprocessOptions
): Promise<PreprocessResult> {
  const maxSizeKB = options?.maxBase64SizeKB ?? 500;

  // Deep clone template to avoid mutation
  const processedTemplate = JSON.parse(JSON.stringify(template));

  const conversions: ConversionLog[] = [];
  const warnings: string[] = [];
  const errors: string[] = [];

  if (!processedTemplate.composition?.scenes) {
    return {
      template: processedTemplate,
      conversions,
      warnings,
      errors,
    };
  }

  for (const scene of processedTemplate.composition.scenes) {
    if (!scene.layers) continue;

    for (const layer of scene.layers) {
      // Only process media layers with src prop
      if ((layer.type === 'image' || layer.type === 'video' || layer.type === 'audio') && layer.props?.src) {
        const src = String(layer.props.src);

        // Skip if already a data URL or HTTP URL
        if (src.startsWith('data:') || src.startsWith('http://') || src.startsWith('https://')) {
          continue;
        }

        // Expand and normalize path
        let normalizedPath = src;
        if (src.startsWith('~/')) {
          normalizedPath = expandTildePath(src);
        } else if (src.startsWith('file://')) {
          normalizedPath = src.replace('file://', '');
        } else if (!src.startsWith('/')) {
          // Relative path - warn and skip
          warnings.push(`Relative path detected in layer "${layer.id}": ${src}. Use absolute paths instead.`);
          continue;
        }

        // Convert local file to data URL
        if (normalizedPath.startsWith('/') && existsSync(normalizedPath)) {
          try {
            // Only resize images, not videos or audio
            const isImage = layer.type === 'image';
            const fileData = readFileSync(normalizedPath);
            const fileSizeKB = fileData.length / 1024;

            let finalData = fileData;
            let finalPath = normalizedPath;
            let wasResized = false;

            // Auto-resize images larger than maxBase64SizeKB
            if (isImage && fileSizeKB > maxSizeKB) {
              const resizedPath = resizeImage(normalizedPath, maxSizeKB);

              if (resizedPath) {
                finalData = readFileSync(resizedPath);
                finalPath = resizedPath;
                wasResized = true;

                // Clean up temp file
                try {
                  unlinkSync(resizedPath);
                } catch (e) {
                  // Ignore cleanup errors
                }
              } else {
                warnings.push(`Failed to resize image in layer "${layer.id}": ${src}. Using original (may cause issues).`);
              }
            }

            const base64 = finalData.toString('base64');
            const mimeType = getMimeType(finalPath);
            const dataUrl = `data:${mimeType};base64,${base64}`;

            // Update layer with data URL
            layer.props.src = dataUrl;

            // Log conversion
            conversions.push({
              originalPath: src,
              layerId: layer.id,
              originalSizeKB: fileSizeKB,
              finalSizeKB: finalData.length / 1024,
              wasResized,
              dataUrlLength: dataUrl.length,
            });
          } catch (error) {
            const errorMsg = `Failed to read local file in layer "${layer.id}": ${normalizedPath} - ${error instanceof Error ? error.message : String(error)}`;
            errors.push(errorMsg);
          }
        } else if (normalizedPath.startsWith('/')) {
          // Path looks local but file doesn't exist
          errors.push(`File not found in layer "${layer.id}": ${normalizedPath}`);
        }
      }
    }
  }

  return {
    template: processedTemplate,
    conversions,
    warnings,
    errors,
  };
}

/**
 * Expand tilde (~) in path to home directory
 */
function expandTildePath(path: string): string {
  if (path.startsWith('~/')) {
    return join(os.homedir(), path.slice(2));
  }
  return path;
}

/**
 * Resize an image to be under the target size in KB
 * Returns path to resized temp file, or null if resize failed
 */
function resizeImage(imagePath: string, targetSizeKB: number): string | null {
  try {
    const tempDir = os.tmpdir();
    const timestamp = Date.now();
    const ext = imagePath.split('.').pop()?.toLowerCase() || 'jpg';
    const outputExt = ext === 'webp' ? 'jpg' : ext; // Convert webp to jpg for better compatibility
    const tempPath = join(tempDir, `rendervid-resize-${timestamp}.${outputExt}`);

    // Start with width=800 and adjust quality to hit target size
    // Most images will be under 500KB at 800px width with quality 85
    let width = 800;
    let quality = 85;

    // For very large files, start with smaller dimensions
    const originalSizeKB = readFileSync(imagePath).length / 1024;
    if (originalSizeKB > 2000) {
      width = 600;
      quality = 80;
    }

    // Build ffmpeg command
    // -vf scale: resize maintaining aspect ratio
    // -q:v: quality (2-31, lower is better)
    const qualityFlag = quality === 85 ? 5 : Math.floor((100 - quality) / 3);

    execSync(
      `ffmpeg -i "${imagePath}" -vf scale=${width}:-1 -q:v ${qualityFlag} "${tempPath}" -y 2>&1`,
      { stdio: 'pipe' }
    );

    // Check if we hit the target size
    if (existsSync(tempPath)) {
      const resizedSizeKB = readFileSync(tempPath).length / 1024;

      // If still too large, try smaller dimensions
      if (resizedSizeKB > targetSizeKB && width > 400) {
        unlinkSync(tempPath);
        const smallerWidth = 500;
        execSync(
          `ffmpeg -i "${imagePath}" -vf scale=${smallerWidth}:-1 -q:v ${qualityFlag} "${tempPath}" -y 2>&1`,
          { stdio: 'pipe' }
        );
      }

      return tempPath;
    }

    return null;
  } catch (error) {
    return null;
  }
}

/**
 * Get MIME type from file extension
 */
function getMimeType(filePath: string): string {
  const ext = filePath.split('.').pop()?.toLowerCase();
  const mimeTypes: Record<string, string> = {
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    gif: 'image/gif',
    webp: 'image/webp',
    svg: 'image/svg+xml',
    bmp: 'image/bmp',
    mp4: 'video/mp4',
    webm: 'video/webm',
    mov: 'video/quicktime',
    avi: 'video/x-msvideo',
    mp3: 'audio/mpeg',
    wav: 'audio/wav',
    ogg: 'audio/ogg',
    m4a: 'audio/mp4',
  };
  return mimeTypes[ext || ''] || 'application/octet-stream';
}
