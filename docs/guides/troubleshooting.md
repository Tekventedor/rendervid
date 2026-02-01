# Troubleshooting Guide

Common issues and solutions when working with Rendervid.

## Template Validation Errors

### Invalid Layer Type

**Error:** `Invalid layer type: "custom-button"`

**Cause:** Using an unrecognized layer type.

**Solution:** Use only valid layer types:

```json
// Valid types: text, image, video, shape, audio, group, lottie, custom
{
  "type": "text"  // Correct
}
```

### Missing Required Fields

**Error:** `Missing required field: position`

**Cause:** Layer is missing required properties.

**Solution:** Include all required fields:

```json
{
  "id": "my-layer",
  "type": "text",
  "position": { "x": 0, "y": 0 },  // Required
  "size": { "width": 100, "height": 50 },  // Required
  "props": {}
}
```

### Invalid Animation Effect

**Error:** `Unknown animation effect: "fadeInOutUp"`

**Cause:** Using a non-existent animation preset.

**Solution:** Check available animations:

```typescript
const capabilities = engine.getCapabilities();
console.log(capabilities.animations.entrance); // List entrance effects
```

### Invalid Input Reference

**Error:** `Input key "titel" not found in inputs`

**Cause:** Typo in `inputKey` reference.

**Solution:** Verify input keys match:

```json
{
  "inputs": [
    { "key": "title", "type": "string" }  // Defined as "title"
  ],
  "composition": {
    "scenes": [{
      "layers": [{
        "inputKey": "title"  // Must match exactly
      }]
    }]
  }
}
```

## Rendering Issues

### Blank Output

**Symptoms:** Video renders but shows nothing.

**Possible Causes:**
1. Layers positioned outside canvas
2. Zero opacity
3. Invisible colors (white on white)
4. Incorrect z-order

**Solutions:**

```json
// Ensure layers are within bounds
{
  "output": { "width": 1920, "height": 1080 },
  "composition": {
    "scenes": [{
      "layers": [{
        "position": { "x": 0, "y": 0 },  // Within 0-1920, 0-1080
        "size": { "width": 500, "height": 200 }
      }]
    }]
  }
}
```

### Images Not Loading

**Error:** `Failed to load image: https://example.com/image.jpg`

**Causes:**
- Invalid URL
- CORS restrictions
- Network timeout

**Solutions:**

```typescript
// Check image accessibility
const img = new Image();
img.crossOrigin = 'anonymous';
img.onload = () => console.log('Image loaded');
img.onerror = () => console.log('Failed to load');
img.src = imageUrl;

// Use CORS proxy if needed
const proxiedUrl = `https://corsproxy.io/?${encodeURIComponent(imageUrl)}`;
```

### Font Not Rendering

**Symptoms:** Text appears in wrong font or system default.

**Causes:**
- Font not loaded
- Incorrect font family name
- Font not available in rendering environment

**Solutions:**

```typescript
// Preload fonts before rendering
await document.fonts.load('bold 48px "Inter"');

// Verify font is loaded
const loaded = document.fonts.check('48px "Inter"');
console.log('Font loaded:', loaded);

// Use web-safe fallbacks
{
  "fontFamily": "Inter, system-ui, -apple-system, sans-serif"
}
```

### Video Encoding Fails

**Error:** `Encoding failed: Unsupported codec`

**Causes:**
- Codec not supported in browser
- Missing encoder

**Solutions:**

```typescript
// Check supported codecs
const formats = await renderer.getSupportedFormats();
console.log(formats);

// Use widely supported format
const result = await renderer.renderVideo({
  template,
  inputs,
  output: { format: 'webm' }  // Most compatible
});
```

## Animation Issues

### Animation Not Playing

**Symptoms:** Elements appear static.

**Causes:**
1. Animation duration is 0
2. Scene too short for animation
3. Delay longer than scene

**Solutions:**

```json
{
  "scenes": [{
    "startFrame": 0,
    "endFrame": 150,  // 5 seconds at 30fps
    "layers": [{
      "animations": [{
        "type": "entrance",
        "effect": "fadeIn",
        "duration": 30,  // Must be > 0
        "delay": 0  // Must be < scene duration
      }]
    }]
  }]
}
```

### Jerky Animation

**Causes:**
- Low frame rate
- Missing easing
- Integer position values

**Solutions:**

```json
{
  "output": {
    "fps": 30  // Use 30 or 60 for smooth animation
  },
  "layers": [{
    "animations": [{
      "effect": "fadeInUp",
      "easing": "easeOutCubic"  // Add easing for smoothness
    }]
  }]
}
```

### Exit Animation Not Visible

**Cause:** Exit animation starts after scene ends.

**Solution:** Ensure exit animation completes within scene:

```json
{
  "scenes": [{
    "endFrame": 150,
    "layers": [{
      "animations": [
        { "type": "entrance", "duration": 30 },
        {
          "type": "exit",
          "duration": 30,
          "delay": 0  // Starts 30 frames before scene end
        }
      ]
    }]
  }]
}
```

## Custom Component Issues

### Component Not Found

**Error:** `Custom component "MyComponent" not registered`

**Cause:** Component not registered before rendering.

**Solution:**

```typescript
import { RendervidEngine } from '@rendervid/core';
import { MyComponent } from './components/MyComponent';

const engine = new RendervidEngine();

// Register before creating renderer
engine.components.register('MyComponent', MyComponent);

const renderer = createBrowserRenderer({
  componentRegistry: engine.components,
});
```

### Props Not Passed to Component

**Symptoms:** Component receives undefined props.

**Cause:** Props defined in wrong location.

**Solution:**

```json
{
  "type": "custom",
  "customComponent": {
    "name": "MyComponent",
    "props": {  // Props go here, not in layer.props
      "title": "Hello",
      "value": 42
    }
  },
  "props": {}  // This is for layer-level props, not component
}
```

### Component Re-renders Every Frame

**Cause:** Not using frame prop correctly.

**Solution:**

```tsx
// Component should be pure - same frame = same output
export function Counter({ target, frame }: Props) {
  // Calculate value based on frame, don't use state
  const progress = Math.min(frame / 60, 1);
  const value = Math.round(target * progress);

  return <span>{value}</span>;
}
```

## Memory Issues

### Out of Memory Error

**Causes:**
- Large images
- Long videos
- Too many layers
- Memory leaks

**Solutions:**

```typescript
// Reduce resolution for development
const template = {
  ...originalTemplate,
  output: {
    ...originalTemplate.output,
    width: 960,  // Half resolution
    height: 540,
  },
};

// Clear cache between renders
renderer.clearCache();

// Dispose renderer when done
renderer.dispose();
```

### Browser Tab Crashes

**Cause:** Rendering exceeds browser memory limits.

**Solutions:**

1. Use Node.js renderer for large videos
2. Reduce template complexity
3. Split into shorter segments

```typescript
// Split long video into segments
const segmentDuration = 30; // 30 seconds each
const segments = [];

for (let i = 0; i < totalDuration; i += segmentDuration) {
  const segment = await renderer.renderVideo({
    template: { ...template, output: { ...template.output, duration: segmentDuration } },
    inputs,
  });
  segments.push(segment);
}

// Combine segments
const final = await combineSegments(segments);
```

## CORS Issues

### Cross-Origin Image Blocked

**Error:** `Access to image has been blocked by CORS policy`

**Solutions:**

```typescript
// Option 1: Use images with CORS headers
// Ensure server sends: Access-Control-Allow-Origin: *

// Option 2: Use base64 encoded images
const base64 = await imageToBase64(imageUrl);
const dataUrl = `data:image/png;base64,${base64}`;

// Option 3: Use CORS proxy
const proxiedUrl = `https://corsproxy.io/?${encodeURIComponent(originalUrl)}`;
```

## Debug Mode

Enable debug logging:

```typescript
const engine = new RendervidEngine({
  debug: true,
});

const renderer = createBrowserRenderer({
  debug: true,
  onDebug: (message) => console.log('[Rendervid]', message),
});
```

## Getting Help

If you're still stuck:

1. Check the [examples](/examples/) for working templates
2. Validate your template with `engine.validateTemplate()`
3. Enable debug mode to see detailed logs
4. Check browser console for errors
5. Open an issue on GitHub with:
   - Template JSON
   - Error message
   - Rendervid version
   - Browser/Node.js version

## Related Documentation

- [Validation API](/api/core/validation)
- [Template Schema](/templates/schema)
- [Examples](/examples/)
