# Image Sequence Export

Export templates as sequences of individual image frames with configurable naming, parallel capture, and manifest generation.

## Features

- Configurable naming patterns with token support (`{number}`, `{name}`, `{hash}`)
- Multiple format support: PNG, JPEG, WebP
- Parallel frame capture for faster exports
- Frame range selection with validation
- Progress reporting with ETA
- JSON manifest file generation
- Prefix/suffix support for filenames

## Quick Start

```typescript
import { createImageSequenceExporter } from '@rendervid/renderer-node';

const exporter = createImageSequenceExporter();

const result = await exporter.export({
  template,
  outputDir: './frames',
  format: 'png',
  onProgress: (progress) => {
    console.log(`${progress.percent.toFixed(1)}% complete`);
  },
});
```

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `template` | `Template` | required | The template to render |
| `inputs` | `Record<string, unknown>` | `{}` | Input values for template variables |
| `outputDir` | `string` | required | Output directory path |
| `namingPattern` | `string` | `'frame-{number}'` | Filename pattern with tokens |
| `prefix` | `string` | `''` | Prefix for filenames |
| `suffix` | `string` | `''` | Suffix for filenames (before extension) |
| `format` | `'png' \| 'jpeg' \| 'webp'` | `'png'` | Image format |
| `quality` | `number` | `90` | Quality for lossy formats (0-100) |
| `startFrame` | `number` | `0` | Start frame |
| `endFrame` | `number` | total frames | End frame |
| `concurrency` | `number` | `1` | Number of parallel browser instances |
| `generateManifest` | `boolean` | `false` | Generate a JSON manifest file |
| `onProgress` | `function` | - | Progress callback |

## Naming Patterns

The `namingPattern` option supports the following tokens:

- `{number}` - Zero-padded frame number (5 digits, e.g., `00042`)
- `{name}` - Sanitized template name (special characters replaced with `_`)
- `{hash}` - Short MD5 hash unique to each frame (8 hex characters)

Printf-style patterns are also supported: `%05d`, `%03d`, etc.

### Examples

```typescript
// Default: frame-00000.png, frame-00001.png, ...
{ namingPattern: 'frame-{number}' }

// With template name: my_video-00000.png, my_video-00001.png, ...
{ namingPattern: '{name}-{number}' }

// Hash-based: a1b2c3d4.png, e5f6a7b8.png, ...
{ namingPattern: '{hash}' }

// Printf-style: frame_00000.png, frame_00001.png, ...
{ namingPattern: 'frame_%05d' }

// With prefix and suffix: render_frame-00000_v2.png
{ namingPattern: 'frame-{number}', prefix: 'render_', suffix: '_v2' }
```

## Parallel Capture

Use the `concurrency` option to capture frames in parallel using multiple browser instances:

```typescript
const result = await exporter.export({
  template,
  outputDir: './frames',
  concurrency: 4, // Use 4 browser instances
});
```

## Manifest File

When `generateManifest` is enabled, a `manifest.json` file is written to the output directory:

```json
{
  "templateName": "My Template",
  "width": 1920,
  "height": 1080,
  "fps": 30,
  "format": "png",
  "quality": 90,
  "totalFrames": 90,
  "startFrame": 0,
  "endFrame": 90,
  "totalSize": 12345678,
  "exportedAt": "2026-01-01T00:00:00.000Z",
  "frames": [
    {
      "frame": 0,
      "filename": "frame-00000.png",
      "fileSize": 137234,
      "format": "png"
    }
  ]
}
```

## Frame Range

Export a subset of frames:

```typescript
const result = await exporter.export({
  template,
  outputDir: './frames',
  startFrame: 30,
  endFrame: 60,
});
```

Frame ranges are validated before rendering starts. Invalid ranges (negative start, end before start, beyond total frames) return an error result without launching a browser.
