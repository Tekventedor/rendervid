# NodeRenderer

Server-side video and image renderer using Puppeteer and FFmpeg.

## Requirements

- **Node.js** 20.0.0 or higher
- **FFmpeg** installed and in PATH
- **Puppeteer** (installed automatically)

## Import

```typescript
import {
  NodeRenderer,
  createNodeRenderer,
  type NodeRendererOptions,
  type VideoRenderOptions,
  type ImageRenderOptions,
} from '@rendervid/renderer-node';
```

## Creating a Renderer

### Factory Function

```typescript
const renderer = createNodeRenderer(options?: NodeRendererOptions);
```

### Class Constructor

```typescript
const renderer = new NodeRenderer(options?: NodeRendererOptions);
```

## Options

```typescript
interface NodeRendererOptions {
  // FFmpeg configuration
  ffmpegPath?: string;           // Path to ffmpeg binary (default: 'ffmpeg')
  ffprobePath?: string;          // Path to ffprobe binary (default: 'ffprobe')

  // Puppeteer configuration
  puppeteer?: PuppeteerLaunchOptions;

  // Performance
  maxConcurrentRenders?: number; // Max parallel renders (default: 4)
  frameQueueSize?: number;       // Frame buffer size (default: 30)

  // Custom components
  componentRegistry?: ComponentRegistry;

  // Debug
  debug?: boolean;
  keepTempFiles?: boolean;
}

interface PuppeteerLaunchOptions {
  headless?: boolean | 'new';
  args?: string[];
  executablePath?: string;
}
```

## Methods

### renderVideo()

Render a video from a template.

```typescript
async renderVideo(options: VideoRenderOptions): Promise<RenderResult>
```

**Parameters:**

```typescript
interface VideoRenderOptions {
  template: Template;
  inputs: Record<string, unknown>;
  output?: {
    format?: 'mp4' | 'webm' | 'mov' | 'gif';
    codec?: 'h264' | 'h265' | 'vp8' | 'vp9' | 'av1' | 'prores';
    quality?: 'draft' | 'standard' | 'high' | 'lossless';
    bitrate?: number;
    fps?: number;
    scale?: number;
    audioCodec?: 'aac' | 'mp3' | 'opus' | 'none';
    audioBitrate?: number;
    outputPath?: string;  // Save directly to file
  };
  renderId?: string;
}
```

**Returns:**

```typescript
interface RenderResult {
  success: boolean;
  data: Buffer;
  outputPath?: string;
  stats: {
    duration: number;
    frames: number;
    fps: number;
    fileSize: number;
    renderTime: number;
  };
}
```

**Example:**

```typescript
import { createNodeRenderer } from '@rendervid/renderer-node';
import { writeFileSync } from 'fs';

const renderer = createNodeRenderer();

const result = await renderer.renderVideo({
  template: myTemplate,
  inputs: { title: 'Hello World' },
  output: {
    format: 'mp4',
    codec: 'h264',
    quality: 'high',
  },
});

// Save to file
writeFileSync('output.mp4', result.data);
console.log(`Rendered in ${result.stats.renderTime}ms`);
```

### renderVideoWithProgress()

Render with progress updates.

```typescript
async renderVideoWithProgress(
  options: VideoRenderOptions,
  onProgress: (progress: RenderProgress) => void
): Promise<RenderResult>
```

**Example:**

```typescript
const result = await renderer.renderVideoWithProgress(
  { template, inputs },
  (progress) => {
    process.stdout.write(`\r${progress.phase}: ${progress.progress}%`);
  }
);
```

### renderImage()

Render a static image.

```typescript
async renderImage(options: ImageRenderOptions): Promise<RenderResult>
```

**Parameters:**

```typescript
interface ImageRenderOptions {
  template: Template;
  inputs: Record<string, unknown>;
  frame?: number;
  output?: {
    format?: 'png' | 'jpeg' | 'webp';
    quality?: number;
    scale?: number;
    outputPath?: string;
  };
}
```

**Example:**

```typescript
const result = await renderer.renderImage({
  template: myTemplate,
  inputs: { headline: 'Check this out!' },
  output: {
    format: 'png',
    scale: 2,
    outputPath: './thumbnail.png',
  },
});
```

### renderSequence()

Render a sequence of images (individual frames).

```typescript
async renderSequence(options: SequenceRenderOptions): Promise<RenderResult>
```

**Parameters:**

```typescript
interface SequenceRenderOptions {
  template: Template;
  inputs: Record<string, unknown>;
  output?: {
    format?: 'png' | 'jpeg';
    quality?: number;
    outputDir?: string;
    filePattern?: string;  // e.g., 'frame_%05d.png'
  };
  startFrame?: number;
  endFrame?: number;
}
```

**Example:**

```typescript
const result = await renderer.renderSequence({
  template,
  inputs,
  output: {
    format: 'png',
    outputDir: './frames',
    filePattern: 'frame_%05d.png',
  },
});
```

### cancelRender()

Cancel an in-progress render.

```typescript
cancelRender(renderId: string): void
```

### dispose()

Clean up resources.

```typescript
await renderer.dispose();
```

## FFmpeg Configuration

### Custom FFmpeg Path

```typescript
const renderer = createNodeRenderer({
  ffmpegPath: '/opt/ffmpeg/bin/ffmpeg',
  ffprobePath: '/opt/ffmpeg/bin/ffprobe',
});
```

### FFmpegConfig

```typescript
interface FFmpegConfig {
  path: string;
  args?: string[];
  threads?: number;
  preset?: 'ultrafast' | 'superfast' | 'veryfast' | 'faster' | 'fast' | 'medium' | 'slow' | 'slower' | 'veryslow';
  crf?: number;  // 0-51, lower = better quality
}
```

## Quality Presets

| Preset | CRF | Preset | Use Case |
|--------|-----|--------|----------|
| `draft` | 28 | ultrafast | Previews |
| `standard` | 23 | medium | General |
| `high` | 18 | slow | Final output |
| `lossless` | 0 | veryslow | Professional |

## Codec Support

| Codec | Format | Hardware Accel |
|-------|--------|----------------|
| `h264` | MP4 | NVIDIA, Intel, AMD |
| `h265` | MP4 | NVIDIA, Intel |
| `vp8` | WebM | No |
| `vp9` | WebM | No |
| `av1` | MP4/WebM | No |
| `prores` | MOV | No |

## Complete Example

```typescript
import { createNodeRenderer } from '@rendervid/renderer-node';
import { RendervidEngine } from '@rendervid/core';
import { writeFileSync } from 'fs';

async function main() {
  // Initialize
  const engine = new RendervidEngine();
  const renderer = createNodeRenderer({
    debug: true,
    maxConcurrentRenders: 2,
  });

  // Template
  const template = {
    name: 'Server Render Demo',
    output: { type: 'video', width: 1920, height: 1080, fps: 30, duration: 5 },
    inputs: [
      { key: 'title', type: 'string', label: 'Title', required: true },
    ],
    composition: {
      scenes: [{
        id: 'main',
        startFrame: 0,
        endFrame: 150,
        backgroundColor: '#1a1a2e',
        layers: [{
          id: 'title',
          type: 'text',
          position: { x: 160, y: 440 },
          size: { width: 1600, height: 200 },
          inputKey: 'title',
          props: { fontSize: 96, fontWeight: 'bold', color: '#ffffff', textAlign: 'center' },
          animations: [{ type: 'entrance', effect: 'fadeInUp', duration: 30 }]
        }]
      }]
    }
  };

  // Validate
  const validation = engine.validateTemplate(template);
  if (!validation.valid) {
    console.error('Invalid template:', validation.errors);
    process.exit(1);
  }

  // Render with progress
  console.log('Starting render...');

  const result = await renderer.renderVideoWithProgress(
    {
      template,
      inputs: { title: 'Server Rendered!' },
      output: {
        format: 'mp4',
        codec: 'h264',
        quality: 'high',
      },
    },
    (progress) => {
      const bar = '='.repeat(Math.floor(progress.progress / 2));
      const empty = ' '.repeat(50 - bar.length);
      process.stdout.write(`\r[${bar}${empty}] ${progress.progress}% - ${progress.phase}`);
    }
  );

  console.log('\n');

  if (result.success) {
    // Save to file
    writeFileSync('output.mp4', result.data);

    console.log('Render complete!');
    console.log(`  Duration: ${result.stats.duration}s`);
    console.log(`  Frames: ${result.stats.frames}`);
    console.log(`  File size: ${(result.stats.fileSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`  Render time: ${(result.stats.renderTime / 1000).toFixed(2)}s`);
  } else {
    console.error('Render failed');
  }

  // Cleanup
  await renderer.dispose();
}

main().catch(console.error);
```

## GIF Output

```typescript
const result = await renderer.renderVideo({
  template,
  inputs,
  output: {
    format: 'gif',
    scale: 0.5,  // 50% size for smaller file
  },
});
```

### GIF Options

```typescript
interface GifOptions {
  fps?: number;      // Output FPS (default: 15)
  scale?: number;    // Size multiplier
  colors?: number;   // Palette colors (default: 256)
  dither?: string;   // Dithering algorithm
  loop?: number;     // Loop count (0 = infinite)
}
```

## Batch Rendering

```typescript
async function batchRender(templates: Template[], inputSets: Record<string, unknown>[]) {
  const renderer = createNodeRenderer({ maxConcurrentRenders: 4 });

  const results = await Promise.all(
    templates.map((template, i) =>
      renderer.renderVideo({
        template,
        inputs: inputSets[i],
        output: { outputPath: `./output/video_${i}.mp4` },
      })
    )
  );

  await renderer.dispose();
  return results;
}
```

## Related Documentation

- [RendervidEngine](/api/core/engine) - Core engine
- [BrowserRenderer](/api/renderer-browser/renderer) - Client-side rendering
- [FFmpeg Documentation](https://ffmpeg.org/documentation.html) - FFmpeg reference
