# BrowserRenderer

Browser-based video and image renderer using WebCodecs and Canvas API.

## Import

```typescript
import {
  BrowserRenderer,
  createBrowserRenderer,
  type BrowserRendererOptions,
} from '@rendervid/renderer-browser';
```

## Creating a Renderer

### Factory Function

```typescript
const renderer = createBrowserRenderer(options?: BrowserRendererOptions);
```

### Class Constructor

```typescript
const renderer = new BrowserRenderer(options?: BrowserRendererOptions);
```

## Options

```typescript
interface BrowserRendererOptions {
  // Encoding
  encoder?: 'webcodecs' | 'mediarecorder' | 'auto';
  hardwareAcceleration?: 'prefer-hardware' | 'prefer-software' | 'no-preference';

  // Quality
  quality?: 'draft' | 'standard' | 'high' | 'lossless';

  // Custom component registry
  componentRegistry?: ComponentRegistry;

  // Font loading
  googleFontsApiKey?: string;
  preloadFonts?: string[];

  // Debug
  debug?: boolean;
}
```

## Methods

### renderVideo()

Render a video from a template.

```typescript
async renderVideo(options: RenderVideoOptions): Promise<VideoResult>
```

**Parameters:**

```typescript
interface RenderVideoOptions {
  template: Template;
  inputs: Record<string, unknown>;
  output?: {
    format?: 'mp4' | 'webm' | 'gif';
    codec?: 'h264' | 'vp8' | 'vp9';
    quality?: 'draft' | 'standard' | 'high' | 'lossless';
    bitrate?: number;
    fps?: number;
    scale?: number;
    audioCodec?: 'aac' | 'mp3' | 'opus' | 'none';
    audioBitrate?: number;
  };
  renderId?: string;
}
```

**Returns:**

```typescript
interface VideoResult {
  success: boolean;
  data: Blob;
  dataUrl?: string;
  stats: {
    duration: number;
    frames: number;
    fps: number;
    fileSize: number;
  };
}
```

**Example:**

```typescript
const renderer = createBrowserRenderer();

const result = await renderer.renderVideo({
  template: myTemplate,
  inputs: { title: 'Hello World' },
  output: {
    format: 'mp4',
    quality: 'high',
  },
});

// Download the video
const blob = new Blob([result.data], { type: 'video/mp4' });
const url = URL.createObjectURL(blob);
const link = document.createElement('a');
link.href = url;
link.download = 'video.mp4';
link.click();
```

### renderVideoWithProgress()

Render with progress updates.

```typescript
async renderVideoWithProgress(
  options: RenderVideoOptions,
  onProgress: (progress: RenderProgress) => void
): Promise<VideoResult>
```

**Example:**

```typescript
const result = await renderer.renderVideoWithProgress(
  { template, inputs },
  (progress) => {
    console.log(`${progress.phase}: ${progress.progress}%`);
    if (progress.currentFrame) {
      console.log(`Frame ${progress.currentFrame}/${progress.totalFrames}`);
    }
  }
);
```

### renderImage()

Render a static image.

```typescript
async renderImage(options: RenderImageOptions): Promise<ImageResult>
```

**Parameters:**

```typescript
interface RenderImageOptions {
  template: Template;
  inputs: Record<string, unknown>;
  frame?: number;  // For video templates, which frame to render
  output?: {
    format?: 'png' | 'jpeg' | 'webp';
    quality?: number;  // 0-100 for jpeg/webp
    scale?: number;
  };
}
```

**Returns:**

```typescript
interface ImageResult {
  success: boolean;
  data: Blob;
  dataUrl: string;
  width: number;
  height: number;
}
```

**Example:**

```typescript
const result = await renderer.renderImage({
  template: myTemplate,
  inputs: { headline: 'Check this out!' },
  output: {
    format: 'png',
    scale: 2,  // 2x resolution
  },
});

// Display the image
const img = document.createElement('img');
img.src = result.dataUrl;
document.body.appendChild(img);
```

### cancelRender()

Cancel an in-progress render.

```typescript
cancelRender(renderId: string): void
```

**Example:**

```typescript
const renderId = 'my-render-123';

// Start render
const renderPromise = renderer.renderVideo({
  template,
  inputs,
  renderId,
});

// Cancel after 5 seconds
setTimeout(() => {
  renderer.cancelRender(renderId);
}, 5000);

try {
  await renderPromise;
} catch (error) {
  if (error.message === 'Render cancelled') {
    console.log('Render was cancelled');
  }
}
```

## Encoder Detection

### Check WebCodecs Support

```typescript
import { isWebCodecsSupported } from '@rendervid/renderer-browser';

if (isWebCodecsSupported()) {
  console.log('WebCodecs available - optimal performance');
} else {
  console.log('Using MediaRecorder fallback');
}
```

### Get Recommended Codec

```typescript
import { getRecommendedCodec } from '@rendervid/renderer-browser';

const codec = await getRecommendedCodec({
  width: 1920,
  height: 1080,
  preferHardware: true,
});
// Returns: 'avc1.42001E' (H.264) or 'vp8' etc.
```

## Quality Presets

| Preset | Description | Use Case |
|--------|-------------|----------|
| `draft` | Low quality, fast encoding | Previews |
| `standard` | Balanced quality/speed | General use |
| `high` | High quality, slower | Final output |
| `lossless` | Maximum quality | Professional |

## Format Support

| Format | Video Codecs | Audio Codecs | Browser Support |
|--------|-------------|--------------|-----------------|
| `mp4` | H.264 | AAC | All browsers |
| `webm` | VP8, VP9 | Opus | Chrome, Firefox |
| `gif` | - | - | All browsers |

## Complete Example

```typescript
import { createBrowserRenderer } from '@rendervid/renderer-browser';
import { RendervidEngine } from '@rendervid/core';

// Setup
const engine = new RendervidEngine();
const renderer = createBrowserRenderer({
  encoder: 'auto',
  quality: 'high',
});

// Template
const template = {
  name: 'Demo',
  output: { type: 'video', width: 1920, height: 1080, fps: 30, duration: 5 },
  inputs: [
    { key: 'title', type: 'string', label: 'Title', required: true }
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
  throw new Error('Invalid template');
}

// Render with progress
const result = await renderer.renderVideoWithProgress(
  {
    template,
    inputs: { title: 'Hello World!' },
    output: { format: 'mp4', quality: 'high' },
    renderId: 'demo-render',
  },
  (progress) => {
    const progressBar = document.getElementById('progress');
    progressBar.style.width = `${progress.progress}%`;
    progressBar.textContent = `${progress.phase}: ${progress.progress}%`;
  }
);

// Download
const blob = new Blob([result.data], { type: 'video/mp4' });
const url = URL.createObjectURL(blob);

const link = document.createElement('a');
link.href = url;
link.download = 'hello-world.mp4';
document.body.appendChild(link);
link.click();
link.remove();

URL.revokeObjectURL(url);

console.log(`Video rendered: ${result.stats.duration}s, ${result.stats.fileSize} bytes`);
```

## Related Documentation

- [RendervidEngine](/api/core/engine) - Core engine
- [Encoder](/api/renderer-browser/encoder) - Encoder utilities
- [NodeRenderer](/api/renderer-node/renderer) - Server-side rendering
