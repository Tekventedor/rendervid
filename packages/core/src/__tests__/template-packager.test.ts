import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';
import * as zlib from 'zlib';
import type { TemplateManifest } from '../types/registry';
import type { Template } from '../types/template';
import {
  validateManifest,
  packageTemplate,
  unpackTemplate,
  generateManifest,
  TEMPLATE_CATEGORIES,
} from '../utils/template-packager';

// Mock fs module
vi.mock('fs', () => ({
  existsSync: vi.fn(),
  readFileSync: vi.fn(),
  writeFileSync: vi.fn(),
  mkdirSync: vi.fn(),
  readdirSync: vi.fn(),
}));

// Mock zlib module
vi.mock('zlib', () => ({
  gzip: vi.fn(),
  gunzip: vi.fn(),
}));

function createValidManifest(overrides?: Partial<TemplateManifest>): TemplateManifest {
  return {
    name: '@test/my-template',
    version: '1.0.0',
    description: 'A test template',
    author: { name: 'Test Author', url: 'https://example.com' },
    license: 'MIT',
    tags: ['test', 'demo'],
    category: 'social-media',
    rendervid: {
      minVersion: '1.0.0',
      resolution: { width: 1920, height: 1080 },
      duration: '5s',
      fps: 30,
    },
    inputs: {
      title: { type: 'string', required: true, description: 'The title text' },
    },
    files: ['template.json', 'assets/logo.png'],
    ...overrides,
  };
}

describe('validateManifest', () => {
  it('should validate a correct manifest', () => {
    const manifest = createValidManifest();
    const result = validateManifest(manifest);
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('should reject manifest with missing required fields', () => {
    const manifest = { name: 'test' } as unknown as TemplateManifest;
    const result = validateManifest(manifest);
    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
    expect(result.errors.some((e) => e.code === 'MISSING_FIELD')).toBe(true);
  });

  it('should reject invalid name format', () => {
    const manifest = createValidManifest({ name: 'Invalid Name!' });
    const result = validateManifest(manifest);
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.code === 'INVALID_NAME')).toBe(true);
  });

  it('should accept valid scoped names', () => {
    const manifest = createValidManifest({ name: '@my-scope/template-name' });
    const result = validateManifest(manifest);
    expect(result.valid).toBe(true);
  });

  it('should accept valid unscoped names', () => {
    const manifest = createValidManifest({ name: 'simple-template' });
    const result = validateManifest(manifest);
    expect(result.valid).toBe(true);
  });

  it('should reject invalid version format', () => {
    const manifest = createValidManifest({ version: 'not-semver' });
    const result = validateManifest(manifest);
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.code === 'INVALID_VERSION')).toBe(true);
  });

  it('should accept valid semver versions', () => {
    const manifest = createValidManifest({ version: '2.1.3-beta.1' });
    const result = validateManifest(manifest);
    expect(result.valid).toBe(true);
  });

  it('should reject manifest with missing author name', () => {
    const manifest = createValidManifest({
      author: { name: '' } as TemplateManifest['author'],
    });
    const result = validateManifest(manifest);
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.code === 'INVALID_AUTHOR')).toBe(true);
  });

  it('should reject empty files list', () => {
    const manifest = createValidManifest({ files: [] });
    const result = validateManifest(manifest);
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.code === 'EMPTY_FILES')).toBe(true);
  });

  it('should warn about missing template.json in files', () => {
    const manifest = createValidManifest({ files: ['src/index.ts'] });
    const result = validateManifest(manifest);
    expect(result.valid).toBe(true);
    expect(result.warnings.some((w) => w.code === 'MISSING_TEMPLATE_JSON')).toBe(true);
  });

  it('should warn about unknown category', () => {
    const manifest = createValidManifest({ category: 'unknown-category' });
    const result = validateManifest(manifest);
    expect(result.valid).toBe(true);
    expect(result.warnings.some((w) => w.code === 'UNKNOWN_CATEGORY')).toBe(true);
  });

  it('should warn about unusual FPS values', () => {
    const manifest = createValidManifest({
      rendervid: {
        minVersion: '1.0.0',
        resolution: { width: 1920, height: 1080 },
        duration: '5s',
        fps: 200,
      },
    });
    const result = validateManifest(manifest);
    expect(result.warnings.some((w) => w.code === 'UNUSUAL_FPS')).toBe(true);
  });

  it('should reject missing rendervid.minVersion', () => {
    const manifest = createValidManifest({
      rendervid: {
        minVersion: '',
        resolution: { width: 1920, height: 1080 },
        duration: '5s',
        fps: 30,
      },
    });
    const result = validateManifest(manifest);
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.path === 'rendervid.minVersion')).toBe(true);
  });
});

describe('TEMPLATE_CATEGORIES', () => {
  it('should include common categories', () => {
    expect(TEMPLATE_CATEGORIES).toContain('social-media');
    expect(TEMPLATE_CATEGORIES).toContain('presentation');
    expect(TEMPLATE_CATEGORIES).toContain('marketing');
    expect(TEMPLATE_CATEGORIES).toContain('other');
  });

  it('should be a readonly array', () => {
    expect(Array.isArray(TEMPLATE_CATEGORIES)).toBe(true);
    expect(TEMPLATE_CATEGORIES.length).toBeGreaterThan(0);
  });
});

describe('packageTemplate', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should throw if template.json does not exist', async () => {
    vi.mocked(fs.existsSync).mockReturnValue(false);
    await expect(packageTemplate('/some/dir')).rejects.toThrow('No template.json found');
  });

  it('should throw if template.json is invalid JSON', async () => {
    vi.mocked(fs.existsSync).mockReturnValue(true);
    vi.mocked(fs.readFileSync).mockReturnValue('not json' as any);
    await expect(packageTemplate('/some/dir')).rejects.toThrow('invalid JSON');
  });

  it('should throw if manifest is invalid', async () => {
    vi.mocked(fs.existsSync).mockReturnValue(true);
    vi.mocked(fs.readFileSync).mockReturnValue(JSON.stringify({ name: 'test' }) as any);
    await expect(packageTemplate('/some/dir')).rejects.toThrow('Invalid manifest');
  });

  it('should package a valid template directory', async () => {
    const manifest = createValidManifest();

    vi.mocked(fs.existsSync).mockReturnValue(true);
    vi.mocked(fs.readFileSync).mockImplementation((filePath: any) => {
      if (String(filePath).endsWith('template.json')) {
        return Buffer.from(JSON.stringify(manifest)) as any;
      }
      return Buffer.from('file content') as any;
    });

    // Mock gzip to return a buffer
    vi.mocked(zlib.gzip).mockImplementation((_data: any, callback: any) => {
      callback(null, Buffer.from('gzipped-data'));
      return undefined as any;
    });

    const result = await packageTemplate('/some/dir');
    expect(result.manifest).toEqual(manifest);
    expect(result.tarball).toBeInstanceOf(Buffer);
  });
});

describe('unpackTemplate', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should throw if tarball has no template.json', async () => {
    // Mock gunzip to return a buffer with empty tar (just end-of-archive marker)
    vi.mocked(zlib.gunzip).mockImplementation((_data: any, callback: any) => {
      callback(null, Buffer.alloc(1024)); // empty tar
      return undefined as any;
    });

    vi.mocked(fs.mkdirSync).mockReturnValue(undefined);

    await expect(unpackTemplate(Buffer.from('test'), '/target')).rejects.toThrow(
      'No template.json found in package',
    );
  });
});

describe('generateManifest', () => {
  const baseTemplate: Template = {
    name: 'My Cool Template',
    description: 'A cool template for videos',
    version: '2.0.0',
    author: { name: 'John Doe', url: 'https://johndoe.com' },
    tags: ['cool', 'video'],
    output: {
      type: 'video',
      width: 1920,
      height: 1080,
      fps: 30,
      duration: 10,
    },
    inputs: [
      {
        key: 'title',
        type: 'string',
        label: 'Title',
        required: true,
        default: 'Hello',
      },
      {
        key: 'color',
        type: 'color',
        label: 'Background Color',
      },
    ],
    composition: {
      scenes: [{ id: 'scene-1', startFrame: 0, endFrame: 300, layers: [] }],
    },
  };

  it('should generate a manifest from a template', () => {
    const manifest = generateManifest(baseTemplate);

    expect(manifest.name).toBe('my-cool-template');
    expect(manifest.version).toBe('2.0.0');
    expect(manifest.description).toBe('A cool template for videos');
    expect(manifest.author.name).toBe('John Doe');
    expect(manifest.rendervid.resolution.width).toBe(1920);
    expect(manifest.rendervid.resolution.height).toBe(1080);
    expect(manifest.rendervid.fps).toBe(30);
    expect(manifest.rendervid.duration).toBe('10s');
    expect(manifest.tags).toEqual(['cool', 'video']);
  });

  it('should map inputs correctly', () => {
    const manifest = generateManifest(baseTemplate);

    expect(manifest.inputs.title).toEqual({
      type: 'string',
      required: true,
      default: 'Hello',
      description: 'Title',
    });
    expect(manifest.inputs.color).toEqual({
      type: 'color',
      required: undefined,
      default: undefined,
      description: 'Background Color',
    });
  });

  it('should allow overrides via options', () => {
    const manifest = generateManifest(baseTemplate, {
      name: '@custom/override-name',
      version: '3.0.0',
      category: 'marketing',
      license: 'Apache-2.0',
    });

    expect(manifest.name).toBe('@custom/override-name');
    expect(manifest.version).toBe('3.0.0');
    expect(manifest.category).toBe('marketing');
    expect(manifest.license).toBe('Apache-2.0');
  });

  it('should handle template without optional fields', () => {
    const minimalTemplate: Template = {
      name: 'Minimal',
      output: { type: 'video', width: 1280, height: 720 },
      inputs: [],
      composition: {
        scenes: [{ id: 's1', startFrame: 0, endFrame: 30, layers: [] }],
      },
    };

    const manifest = generateManifest(minimalTemplate);
    expect(manifest.name).toBe('minimal');
    expect(manifest.version).toBe('1.0.0');
    expect(manifest.description).toBe('');
    expect(manifest.author.name).toBe('Unknown');
    expect(manifest.rendervid.duration).toBe('0s');
    expect(manifest.rendervid.fps).toBe(30);
  });

  it('should include preview and repository when provided', () => {
    const manifest = generateManifest(baseTemplate, {
      preview: { thumbnail: 'thumb.png', video: 'preview.mp4' },
      repository: 'https://github.com/test/template',
    });

    expect(manifest.preview?.thumbnail).toBe('thumb.png');
    expect(manifest.preview?.video).toBe('preview.mp4');
    expect(manifest.repository).toBe('https://github.com/test/template');
  });
});
