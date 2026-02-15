/**
 * Template CLI Utilities
 *
 * Helper functions for CLI commands related to template
 * initialization, validation, and registry interaction.
 */

import * as fs from 'fs';
import * as path from 'path';
import type { TemplateManifest, RegistrySearchResult } from '../types/registry';
import type { ValidationResult } from '../validation/validator';
import { validateManifest, TEMPLATE_CATEGORIES } from './template-packager';
import { RegistryClient } from './registry-client';

/**
 * Options for template initialization.
 */
export interface InitTemplateOptions {
  /** Template package name */
  name?: string;
  /** Template category */
  category?: string;
  /** Template description */
  description?: string;
  /** Author name */
  authorName?: string;
  /** Author URL */
  authorUrl?: string;
  /** License */
  license?: string;
  /** Output width */
  width?: number;
  /** Output height */
  height?: number;
  /** Frames per second */
  fps?: number;
  /** Duration in seconds */
  duration?: number;
}

/**
 * Initialize a new template directory with a scaffold template.json.
 *
 * Creates a template.json manifest file in the specified directory
 * with sensible defaults that can be customized.
 */
export async function initTemplate(
  dir: string,
  options?: InitTemplateOptions,
): Promise<void> {
  // Ensure directory exists
  fs.mkdirSync(dir, { recursive: true });

  const templateJsonPath = path.join(dir, 'template.json');
  if (fs.existsSync(templateJsonPath)) {
    throw new Error(`template.json already exists in ${dir}`);
  }

  const dirName = path.basename(dir);
  const name = options?.name || dirName.toLowerCase().replace(/\s+/g, '-');

  const manifest: TemplateManifest = {
    name,
    version: '1.0.0',
    description: options?.description || `A rendervid template: ${name}`,
    author: {
      name: options?.authorName || 'Your Name',
      url: options?.authorUrl,
    },
    license: options?.license || 'MIT',
    tags: [],
    category: options?.category || 'other',
    rendervid: {
      minVersion: '1.0.0',
      resolution: {
        width: options?.width || 1920,
        height: options?.height || 1080,
      },
      duration: `${options?.duration || 5}s`,
      fps: options?.fps || 30,
    },
    inputs: {},
    files: ['template.json'],
  };

  // Write template.json
  fs.writeFileSync(
    templateJsonPath,
    JSON.stringify(manifest, null, 2) + '\n',
    'utf-8',
  );

  // Create a basic composition template alongside the manifest
  const compositionPath = path.join(dir, 'composition.json');
  if (!fs.existsSync(compositionPath)) {
    const composition = {
      name: manifest.description,
      output: {
        type: 'video',
        width: manifest.rendervid.resolution.width,
        height: manifest.rendervid.resolution.height,
        fps: manifest.rendervid.fps,
        duration: options?.duration || 5,
      },
      inputs: [],
      composition: {
        scenes: [
          {
            id: 'scene-1',
            startFrame: 0,
            endFrame: (options?.duration || 5) * (options?.fps || 30),
            layers: [],
          },
        ],
      },
    };

    fs.writeFileSync(
      compositionPath,
      JSON.stringify(composition, null, 2) + '\n',
      'utf-8',
    );
  }
}

/**
 * Validate a template directory.
 *
 * Checks that the directory contains a valid template.json manifest
 * and that all referenced files exist.
 */
export async function validateTemplateDir(dir: string): Promise<ValidationResult> {
  const errors: ValidationResult['errors'] = [];
  const warnings: ValidationResult['warnings'] = [];

  // Check directory exists
  if (!fs.existsSync(dir)) {
    return {
      valid: false,
      errors: [
        {
          code: 'DIR_NOT_FOUND',
          message: `Directory not found: ${dir}`,
          path: '',
        },
      ],
      warnings: [],
    };
  }

  // Check template.json exists
  const manifestPath = path.join(dir, 'template.json');
  if (!fs.existsSync(manifestPath)) {
    return {
      valid: false,
      errors: [
        {
          code: 'MANIFEST_NOT_FOUND',
          message: 'No template.json found in directory',
          path: 'template.json',
        },
      ],
      warnings: [],
    };
  }

  // Parse manifest
  let manifest: TemplateManifest;
  try {
    const content = fs.readFileSync(manifestPath, 'utf-8');
    manifest = JSON.parse(content) as TemplateManifest;
  } catch (err) {
    return {
      valid: false,
      errors: [
        {
          code: 'INVALID_JSON',
          message: `Failed to parse template.json: ${err instanceof Error ? err.message : String(err)}`,
          path: 'template.json',
        },
      ],
      warnings: [],
    };
  }

  // Validate manifest content
  const manifestValidation = validateManifest(manifest);
  errors.push(...manifestValidation.errors);
  warnings.push(...manifestValidation.warnings);

  // Check that referenced files exist
  if (manifest.files && Array.isArray(manifest.files)) {
    for (const file of manifest.files) {
      const filePath = path.join(dir, file);
      if (!fs.existsSync(filePath)) {
        errors.push({
          code: 'FILE_NOT_FOUND',
          message: `Referenced file not found: ${file}`,
          path: `files[${manifest.files.indexOf(file)}]`,
        });
      }
    }
  }

  // Check preview files exist (if specified)
  if (manifest.preview) {
    const previewFields: (keyof NonNullable<TemplateManifest['preview']>)[] = [
      'thumbnail',
      'video',
      'gif',
    ];
    for (const field of previewFields) {
      const value = manifest.preview[field];
      if (value && !value.startsWith('http://') && !value.startsWith('https://')) {
        const previewPath = path.join(dir, value);
        if (!fs.existsSync(previewPath)) {
          warnings.push({
            code: 'PREVIEW_NOT_FOUND',
            message: `Preview file not found: ${value}`,
            path: `preview.${field}`,
            suggestion: 'Ensure the file exists or use an absolute URL',
          });
        }
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Search for templates in the registry.
 *
 * A convenience wrapper around RegistryClient.search() for CLI use.
 */
export async function searchTemplates(
  query: string,
  registryUrl: string,
  options?: { tags?: string[]; category?: string; limit?: number },
): Promise<RegistrySearchResult[]> {
  const client = new RegistryClient({ registryUrl });
  return client.search(query, options);
}

/**
 * Get available template categories.
 */
export function getAvailableCategories(): readonly string[] {
  return TEMPLATE_CATEGORIES;
}
