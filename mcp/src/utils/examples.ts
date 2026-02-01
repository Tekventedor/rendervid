import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import type { ExampleMetadata } from '../types.js';
import { createLogger } from './logger.js';

const logger = createLogger('examples');

/**
 * Get the examples directory path
 */
export function getExamplesDir(): string {
  // MCP server is in /mcp/, examples are in /examples/
  const currentDir = path.dirname(fileURLToPath(import.meta.url));
  const mcpRoot = path.resolve(currentDir, '../..');
  return path.resolve(mcpRoot, '../examples');
}

/**
 * Get all example categories
 */
export async function getExampleCategories(): Promise<string[]> {
  const examplesDir = getExamplesDir();

  try {
    const entries = await fs.readdir(examplesDir, { withFileTypes: true });
    const categories = entries
      .filter(entry => entry.isDirectory())
      .map(entry => entry.name)
      .filter(name => !name.startsWith('_') && !name.startsWith('.'));

    return categories.sort();
  } catch (error) {
    logger.error('Failed to read examples directory', { error });
    return [];
  }
}

/**
 * Get examples in a category
 */
export async function getExamplesInCategory(category: string): Promise<string[]> {
  const categoryDir = path.join(getExamplesDir(), category);

  try {
    const stat = await fs.stat(categoryDir);
    if (!stat.isDirectory()) {
      return [];
    }

    const entries = await fs.readdir(categoryDir, { withFileTypes: true });
    const examples = entries
      .filter(entry => entry.isDirectory())
      .map(entry => entry.name)
      .filter(name => !name.startsWith('_') && !name.startsWith('.'));

    return examples.sort();
  } catch (error) {
    logger.debug('Category not found or error reading', { category, error });
    return [];
  }
}

/**
 * Read example template
 */
export async function readExampleTemplate(examplePath: string): Promise<unknown> {
  const examplesDir = getExamplesDir();
  const templatePath = path.join(examplesDir, examplePath, 'template.json');

  try {
    const content = await fs.readFile(templatePath, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    throw new Error(`Failed to read template at ${examplePath}: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Read example README
 */
export async function readExampleReadme(examplePath: string): Promise<string | null> {
  const examplesDir = getExamplesDir();
  const readmePath = path.join(examplesDir, examplePath, 'README.md');

  try {
    return await fs.readFile(readmePath, 'utf-8');
  } catch (error) {
    logger.debug('README not found', { examplePath });
    return null;
  }
}

/**
 * Get example metadata
 */
export async function getExampleMetadata(category: string, exampleName: string): Promise<ExampleMetadata | null> {
  const examplePath = `${category}/${exampleName}`;

  try {
    const template = await readExampleTemplate(examplePath) as {
      name?: string;
      description?: string;
      output?: {
        type?: 'video' | 'image';
        width?: number;
        height?: number;
      };
    };

    const readme = await readExampleReadme(examplePath);

    // Extract description from README if available
    let description = template.description || '';
    if (readme && !description) {
      const lines = readme.split('\n');
      const descLine = lines.find(line => line.trim() && !line.startsWith('#'));
      description = descLine?.trim() || '';
    }

    const outputType = template.output?.type || 'video';
    const width = template.output?.width || 1920;
    const height = template.output?.height || 1080;
    const dimensions = `${width}x${height}`;

    return {
      name: template.name || exampleName,
      category,
      path: examplePath,
      description,
      outputType,
      dimensions,
    };
  } catch (error) {
    logger.debug('Failed to read example metadata', { examplePath, error });
    return null;
  }
}

/**
 * List all examples with metadata
 */
export async function listAllExamples(categoryFilter?: string): Promise<ExampleMetadata[]> {
  const categories = await getExampleCategories();
  const filteredCategories = categoryFilter
    ? categories.filter(cat => cat === categoryFilter)
    : categories;

  const examples: ExampleMetadata[] = [];

  for (const category of filteredCategories) {
    const exampleNames = await getExamplesInCategory(category);

    for (const exampleName of exampleNames) {
      const metadata = await getExampleMetadata(category, exampleName);
      if (metadata) {
        examples.push(metadata);
      }
    }
  }

  return examples;
}

/**
 * Check if example exists
 */
export async function exampleExists(examplePath: string): Promise<boolean> {
  const examplesDir = getExamplesDir();
  const templatePath = path.join(examplesDir, examplePath, 'template.json');

  try {
    await fs.access(templatePath);
    return true;
  } catch {
    return false;
  }
}
