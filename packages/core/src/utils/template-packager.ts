/**
 * Template Packager
 *
 * Utilities for validating, packaging, and unpacking template packages
 * for the template registry/marketplace.
 */

import type { Template } from '../types/template';
import type { TemplateManifest } from '../types/registry';
import type { ValidationResult } from '../validation/validator';
import * as fs from 'fs';
import * as path from 'path';
import * as zlib from 'zlib';

// Re-export for convenience
export type { TemplateManifest } from '../types/registry';

/**
 * Required fields in a TemplateManifest.
 */
const REQUIRED_MANIFEST_FIELDS: (keyof TemplateManifest)[] = [
  'name',
  'version',
  'description',
  'author',
  'license',
  'tags',
  'category',
  'rendervid',
  'inputs',
  'files',
];

/**
 * Valid template categories.
 */
export const TEMPLATE_CATEGORIES = [
  'social-media',
  'presentation',
  'marketing',
  'education',
  'entertainment',
  'e-commerce',
  'news',
  'sports',
  'music',
  'corporate',
  'event',
  'real-estate',
  'other',
] as const;

export type TemplateCategory = (typeof TEMPLATE_CATEGORIES)[number];

/**
 * Validate a TemplateManifest for completeness and correctness.
 */
export function validateManifest(manifest: TemplateManifest): ValidationResult {
  const errors: ValidationResult['errors'] = [];
  const warnings: ValidationResult['warnings'] = [];

  // Check required fields
  for (const field of REQUIRED_MANIFEST_FIELDS) {
    if (manifest[field] === undefined || manifest[field] === null) {
      errors.push({
        code: 'MISSING_FIELD',
        message: `Missing required field: ${field}`,
        path: field,
      });
    }
  }

  // Validate name format: @scope/name or simple-name
  if (manifest.name) {
    const namePattern = /^(@[a-z0-9-]+\/)?[a-z0-9-]+$/;
    if (!namePattern.test(manifest.name)) {
      errors.push({
        code: 'INVALID_NAME',
        message:
          'Name must be lowercase alphanumeric with hyphens, optionally scoped (e.g. @scope/name)',
        path: 'name',
        expected: '@scope/template-name or template-name',
        actual: manifest.name,
      });
    }
  }

  // Validate version (semver)
  if (manifest.version) {
    const semverPattern = /^\d+\.\d+\.\d+(-[a-zA-Z0-9.]+)?(\+[a-zA-Z0-9.]+)?$/;
    if (!semverPattern.test(manifest.version)) {
      errors.push({
        code: 'INVALID_VERSION',
        message: 'Version must follow semantic versioning (e.g. 1.0.0)',
        path: 'version',
        expected: 'X.Y.Z',
        actual: manifest.version,
      });
    }
  }

  // Validate author
  if (manifest.author) {
    if (!manifest.author.name || typeof manifest.author.name !== 'string') {
      errors.push({
        code: 'INVALID_AUTHOR',
        message: 'Author must have a name string',
        path: 'author.name',
      });
    }
  }

  // Validate rendervid config
  if (manifest.rendervid) {
    const rv = manifest.rendervid;
    if (!rv.minVersion) {
      errors.push({
        code: 'MISSING_FIELD',
        message: 'rendervid.minVersion is required',
        path: 'rendervid.minVersion',
      });
    }
    if (!rv.resolution || !rv.resolution.width || !rv.resolution.height) {
      errors.push({
        code: 'INVALID_RESOLUTION',
        message: 'rendervid.resolution must have width and height',
        path: 'rendervid.resolution',
      });
    }
    if (rv.fps && (rv.fps < 1 || rv.fps > 120)) {
      warnings.push({
        code: 'UNUSUAL_FPS',
        message: `FPS value ${rv.fps} is unusual`,
        path: 'rendervid.fps',
        suggestion: 'Common values are 24, 30, or 60',
      });
    }
  }

  // Validate tags
  if (manifest.tags && !Array.isArray(manifest.tags)) {
    errors.push({
      code: 'INVALID_TAGS',
      message: 'Tags must be an array of strings',
      path: 'tags',
    });
  }

  // Validate category
  if (manifest.category && !TEMPLATE_CATEGORIES.includes(manifest.category as TemplateCategory)) {
    warnings.push({
      code: 'UNKNOWN_CATEGORY',
      message: `Unknown category: ${manifest.category}`,
      path: 'category',
      suggestion: `Valid categories: ${TEMPLATE_CATEGORIES.join(', ')}`,
    });
  }

  // Validate files list
  if (manifest.files && Array.isArray(manifest.files)) {
    if (manifest.files.length === 0) {
      errors.push({
        code: 'EMPTY_FILES',
        message: 'Files list must contain at least one file',
        path: 'files',
      });
    }
    const hasTemplateJson = manifest.files.some(
      (f) => f === 'template.json' || f.endsWith('/template.json'),
    );
    if (!hasTemplateJson) {
      warnings.push({
        code: 'MISSING_TEMPLATE_JSON',
        message: 'Files list should include template.json',
        path: 'files',
        suggestion: 'Add template.json to the files array',
      });
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Simple TAR archive creator.
 * Creates a tar-like buffer from a list of file entries.
 */
function createTarBuffer(entries: Array<{ name: string; content: Buffer }>): Buffer {
  const blocks: Buffer[] = [];

  for (const entry of entries) {
    // Create a 512-byte header
    const header = Buffer.alloc(512);
    // File name (up to 100 bytes)
    header.write(entry.name.slice(0, 100), 0, 100, 'utf-8');
    // File mode
    header.write('0000644\0', 100, 8, 'utf-8');
    // Owner/Group UID/GID
    header.write('0001000\0', 108, 8, 'utf-8');
    header.write('0001000\0', 116, 8, 'utf-8');
    // File size in octal
    const sizeOctal = entry.content.length.toString(8).padStart(11, '0');
    header.write(sizeOctal + '\0', 124, 12, 'utf-8');
    // Modification time
    const mtime = Math.floor(Date.now() / 1000)
      .toString(8)
      .padStart(11, '0');
    header.write(mtime + '\0', 136, 12, 'utf-8');
    // Type flag: regular file
    header.write('0', 156, 1, 'utf-8');
    // Checksum placeholder (spaces)
    header.write('        ', 148, 8, 'utf-8');

    // Calculate checksum
    let checksum = 0;
    for (let i = 0; i < 512; i++) {
      checksum += header[i];
    }
    const checksumStr = checksum.toString(8).padStart(6, '0') + '\0 ';
    header.write(checksumStr, 148, 8, 'utf-8');

    blocks.push(header);
    blocks.push(entry.content);

    // Pad to 512-byte boundary
    const remainder = entry.content.length % 512;
    if (remainder > 0) {
      blocks.push(Buffer.alloc(512 - remainder));
    }
  }

  // End of archive marker (two 512-byte blocks of zeros)
  blocks.push(Buffer.alloc(1024));

  return Buffer.concat(blocks);
}

/**
 * Simple TAR archive extractor.
 * Extracts file entries from a tar buffer.
 */
function extractTarBuffer(tarBuffer: Buffer): Array<{ name: string; content: Buffer }> {
  const entries: Array<{ name: string; content: Buffer }> = [];
  let offset = 0;

  while (offset < tarBuffer.length - 512) {
    const header = tarBuffer.subarray(offset, offset + 512);

    // Check for end-of-archive marker (all zeros)
    let allZero = true;
    for (let i = 0; i < 512; i++) {
      if (header[i] !== 0) {
        allZero = false;
        break;
      }
    }
    if (allZero) break;

    // Read file name (null-terminated)
    let nameEnd = 0;
    while (nameEnd < 100 && header[nameEnd] !== 0) nameEnd++;
    const name = header.subarray(0, nameEnd).toString('utf-8');

    // Read file size (octal)
    const sizeStr = header.subarray(124, 135).toString('utf-8').trim();
    const size = parseInt(sizeStr, 8);

    offset += 512;

    // Read file content
    const content = tarBuffer.subarray(offset, offset + size);
    entries.push({ name, content: Buffer.from(content) });

    // Skip to next 512-byte boundary
    offset += size;
    const remainder = size % 512;
    if (remainder > 0) {
      offset += 512 - remainder;
    }
  }

  return entries;
}

/**
 * Package a template directory into a gzipped tarball.
 *
 * Reads the template directory, validates the manifest, and creates
 * a .tar.gz buffer suitable for publishing to the registry.
 */
export async function packageTemplate(
  dir: string,
): Promise<{ tarball: Buffer; manifest: TemplateManifest }> {
  const manifestPath = path.join(dir, 'template.json');

  if (!fs.existsSync(manifestPath)) {
    throw new Error(`No template.json found in ${dir}`);
  }

  const manifestContent = fs.readFileSync(manifestPath, 'utf-8');
  let manifest: TemplateManifest;
  try {
    manifest = JSON.parse(manifestContent) as TemplateManifest;
  } catch {
    throw new Error('Failed to parse template.json: invalid JSON');
  }

  // Validate manifest
  const validation = validateManifest(manifest);
  if (!validation.valid) {
    const errorMessages = validation.errors.map((e) => `  - ${e.message}`).join('\n');
    throw new Error(`Invalid manifest:\n${errorMessages}`);
  }

  // Collect files
  const filesToPackage = manifest.files && manifest.files.length > 0
    ? manifest.files
    : collectFiles(dir);

  const entries: Array<{ name: string; content: Buffer }> = [];
  for (const file of filesToPackage) {
    const filePath = path.join(dir, file);
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath);
      entries.push({ name: file, content });
    }
  }

  // Always include template.json
  if (!filesToPackage.includes('template.json')) {
    entries.unshift({
      name: 'template.json',
      content: Buffer.from(manifestContent, 'utf-8'),
    });
  }

  // Create tar, then gzip
  const tarBuffer = createTarBuffer(entries);
  const tarball = await new Promise<Buffer>((resolve, reject) => {
    zlib.gzip(tarBuffer, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });

  return { tarball, manifest };
}

/**
 * Collect all files in a directory (excluding node_modules, .git, etc.)
 */
function collectFiles(dir: string, prefix = ''): string[] {
  const files: string[] = [];
  const IGNORED = new Set(['node_modules', '.git', '.DS_Store', 'dist', 'build']);

  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (IGNORED.has(entry.name)) continue;
    const relativePath = prefix ? `${prefix}/${entry.name}` : entry.name;
    if (entry.isDirectory()) {
      files.push(...collectFiles(path.join(dir, entry.name), relativePath));
    } else {
      files.push(relativePath);
    }
  }

  return files;
}

/**
 * Unpack a gzipped tarball into a target directory.
 *
 * Extracts the template package and returns the manifest.
 */
export async function unpackTemplate(
  tarball: Buffer,
  targetDir: string,
): Promise<TemplateManifest> {
  // Gunzip first
  const tarBuffer = await new Promise<Buffer>((resolve, reject) => {
    zlib.gunzip(tarball, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });

  // Extract tar entries
  const entries = extractTarBuffer(tarBuffer);

  // Ensure target directory exists
  fs.mkdirSync(targetDir, { recursive: true });

  let manifest: TemplateManifest | null = null;

  for (const entry of entries) {
    const filePath = path.join(targetDir, entry.name);
    const fileDir = path.dirname(filePath);

    // Ensure parent directory exists
    fs.mkdirSync(fileDir, { recursive: true });

    // Write file
    fs.writeFileSync(filePath, entry.content);

    // Parse manifest if this is template.json
    if (entry.name === 'template.json') {
      manifest = JSON.parse(entry.content.toString('utf-8')) as TemplateManifest;
    }
  }

  if (!manifest) {
    throw new Error('No template.json found in package');
  }

  return manifest;
}

/**
 * Generate a TemplateManifest from an existing Template object.
 *
 * Creates a manifest suitable for publishing based on the template's
 * configuration, with optional overrides.
 */
export function generateManifest(
  template: Template,
  options?: Partial<TemplateManifest>,
): TemplateManifest {
  const duration = template.output.duration
    ? `${template.output.duration}s`
    : '0s';

  const inputs: TemplateManifest['inputs'] = {};
  if (template.inputs) {
    for (const input of template.inputs) {
      inputs[input.key] = {
        type: input.type,
        required: input.required,
        default: input.default,
        description: input.label || input.key,
      };
    }
  }

  const manifest: TemplateManifest = {
    name: options?.name || template.name.toLowerCase().replace(/\s+/g, '-'),
    version: options?.version || template.version || '1.0.0',
    description: options?.description || template.description || '',
    author: options?.author || {
      name: template.author?.name || 'Unknown',
      url: template.author?.url,
    },
    license: options?.license || 'MIT',
    tags: options?.tags || template.tags || [],
    category: options?.category || 'other',
    rendervid: options?.rendervid || {
      minVersion: '1.0.0',
      resolution: {
        width: template.output.width,
        height: template.output.height,
      },
      duration,
      fps: template.output.fps || 30,
    },
    inputs,
    files: options?.files || ['template.json'],
    ...(options?.preview && { preview: options.preview }),
    ...(options?.repository && { repository: options.repository }),
  };

  return manifest;
}
