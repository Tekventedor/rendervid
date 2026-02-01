# RendervidEngine

The main entry point for the Rendervid library.

## Import

```typescript
import { RendervidEngine } from '@rendervid/core';
```

## Constructor

```typescript
const engine = new RendervidEngine(options?: EngineOptions);
```

### EngineOptions

```typescript
interface EngineOptions {
  renderer?: 'auto' | 'browser' | 'node';  // Renderer selection
  components?: ComponentRegistry;           // Custom component registry
  defaultFonts?: string[];                  // Fonts to preload
  googleFontsApiKey?: string;               // Google Fonts API key
  maxConcurrentRenders?: number;            // Max parallel renders
}
```

## Methods

### getCapabilities()

Returns the engine's capabilities for AI integration.

```typescript
const capabilities = engine.getCapabilities();
```

Returns: [`EngineCapabilities`](#enginecapabilities)

### validateTemplate()

Validate a template structure.

```typescript
const result = engine.validateTemplate(template);

if (result.valid) {
  console.log('Template is valid');
} else {
  console.error('Validation errors:', result.errors);
}
```

**Parameters:**
- `template: unknown` - The template to validate

**Returns:** [`ValidationResult`](#validationresult)

### validateInputs()

Validate input values against a template.

```typescript
const result = engine.validateInputs(template, inputs);

if (result.valid) {
  console.log('Inputs are valid');
} else {
  console.error('Input errors:', result.errors);
}
```

**Parameters:**
- `template: Template` - The template
- `inputs: Record<string, unknown>` - Input values

**Returns:** [`ValidationResult`](#validationresult)

### getTemplateSchema()

Get JSON Schema for template validation.

```typescript
const schema = engine.getTemplateSchema();
```

**Returns:** `JSONSchema7`

### getElementSchema()

Get JSON Schema for a specific layer type.

```typescript
const textSchema = engine.getElementSchema('text');
const shapeSchema = engine.getElementSchema('shape');
```

**Parameters:**
- `type: string` - Layer type name

**Returns:** `JSONSchema7 | null`

### renderVideo()

Render a video from a template.

::: warning
Requires `@rendervid/renderer-browser` or `@rendervid/renderer-node`
:::

```typescript
const result = await engine.renderVideo({
  template,
  inputs: { title: 'Hello World' },
  output: {
    format: 'mp4',
    quality: 'high',
  },
});
```

**Parameters:** [`RenderVideoOptions`](#rendervideooptions)

**Returns:** [`Promise<VideoResult>`](#videoresult)

### renderVideoWithProgress()

Render a video with progress updates.

```typescript
const result = await engine.renderVideoWithProgress(
  { template, inputs },
  (progress) => {
    console.log(`${progress.phase}: ${progress.progress}%`);
  }
);
```

**Parameters:**
- `options: RenderVideoOptions`
- `onProgress: (progress: RenderProgress) => void`

**Returns:** `Promise<VideoResult>`

### renderImage()

Render a static image from a template.

```typescript
const result = await engine.renderImage({
  template,
  inputs: { headline: 'Check this out!' },
  output: { format: 'png' },
});
```

**Parameters:** [`RenderImageOptions`](#renderimageoptions)

**Returns:** [`Promise<ImageResult>`](#imageresult)

### cancelRender()

Cancel an in-progress render.

```typescript
engine.cancelRender('render-123');
```

**Parameters:**
- `renderId: string` - The render ID

## Properties

### components

Access the component registry.

```typescript
// Register a component
engine.components.register('MyChart', MyChartComponent);

// Check if component exists
engine.components.has('MyChart');

// List all components
engine.components.list();
```

**Type:** [`ComponentRegistry`](#componentregistry)

## Types

### EngineCapabilities

```typescript
interface EngineCapabilities {
  version: string;
  elements: Record<string, ElementCapability>;
  customComponents: Record<string, ComponentInfo>;
  animations: {
    entrance: string[];
    exit: string[];
    emphasis: string[];
  };
  easings: string[];
  blendModes: string[];
  filters: string[];
  fonts: {
    builtin: string[];
    googleFonts: boolean;
    customFonts: boolean;
  };
  output: {
    video: {
      formats: string[];
      codecs: string[];
      maxWidth: number;
      maxHeight: number;
      maxDuration: number;
      maxFps: number;
    };
    image: {
      formats: string[];
      maxWidth: number;
      maxHeight: number;
    };
  };
  runtime: 'browser' | 'node';
  features: {
    tailwind: boolean;
    customComponents: boolean;
    webgl: boolean;
    webcodecs: boolean;
  };
}
```

### ValidationResult

```typescript
interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings?: ValidationWarning[];
}

interface ValidationError {
  path: string;
  message: string;
  code: string;
}
```

### RenderVideoOptions

```typescript
interface RenderVideoOptions {
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
  };
  renderId?: string;
}
```

### RenderImageOptions

```typescript
interface RenderImageOptions {
  template: Template;
  inputs: Record<string, unknown>;
  frame?: number;  // For video templates
  output?: {
    format?: 'png' | 'jpeg' | 'webp';
    quality?: number;  // 0-100 for jpeg/webp
    scale?: number;
  };
}
```

### VideoResult

```typescript
interface VideoResult {
  success: boolean;
  data: Blob | Buffer;
  dataUrl?: string;
  stats: {
    duration: number;
    frames: number;
    fps: number;
    fileSize: number;
  };
}
```

### ImageResult

```typescript
interface ImageResult {
  success: boolean;
  data: Blob | Buffer;
  dataUrl: string;
  width: number;
  height: number;
}
```

### RenderProgress

```typescript
interface RenderProgress {
  phase: 'loading' | 'rendering' | 'encoding';
  progress: number;  // 0-100
  currentFrame?: number;
  totalFrames?: number;
  estimatedTimeRemaining?: number;
  message?: string;
}
```

### ComponentRegistry

```typescript
interface ComponentRegistry {
  register(name: string, component: ComponentType, schema?: JSONSchema7): void;
  get(name: string): ComponentType | undefined;
  list(): ComponentInfo[];
  registerFromUrl(name: string, url: string): Promise<void>;
  unregister(name: string): boolean;
  has(name: string): boolean;
}
```

## Example: Complete Workflow

```typescript
import { RendervidEngine } from '@rendervid/core';
import { createBrowserRenderer } from '@rendervid/renderer-browser';

// Create engine
const engine = new RendervidEngine();

// Check capabilities
const caps = engine.getCapabilities();
console.log('Available animations:', caps.animations.entrance);

// Define template
const template = {
  name: 'Demo',
  output: { type: 'video', width: 1920, height: 1080, fps: 30, duration: 5 },
  inputs: [{ key: 'title', type: 'string', label: 'Title', required: true }],
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

// Validate template
const validation = engine.validateTemplate(template);
if (!validation.valid) {
  throw new Error(`Invalid template: ${validation.errors.map(e => e.message).join(', ')}`);
}

// Validate inputs
const inputs = { title: 'Hello World!' };
const inputValidation = engine.validateInputs(template, inputs);
if (!inputValidation.valid) {
  throw new Error(`Invalid inputs: ${inputValidation.errors.map(e => e.message).join(', ')}`);
}

// Render with browser renderer
const renderer = createBrowserRenderer();
const result = await renderer.renderVideo({
  template,
  inputs,
  output: { format: 'mp4', quality: 'high' }
});

// Download result
const blob = new Blob([result.data], { type: 'video/mp4' });
const url = URL.createObjectURL(blob);
```

## Related Documentation

- [Types](/api/core/types) - Core type definitions
- [Validation](/api/core/validation) - Validation system
- [Capabilities](/api/core/capabilities) - Capabilities API
