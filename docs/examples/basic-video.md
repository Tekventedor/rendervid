# Basic Video Example

Step-by-step guide to creating your first video with Rendervid.

## What We'll Build

A 5-second video with:
- Gradient background
- Animated title text
- Subtitle with staggered animation
- Fade out at the end

## Step 1: Set Up the Template Structure

```json
{
  "name": "Welcome Video",
  "description": "A simple welcome video with animated text",
  "version": "1.0.0",
  "output": {
    "type": "video",
    "width": 1920,
    "height": 1080,
    "fps": 30,
    "duration": 5
  },
  "inputs": [],
  "composition": {
    "scenes": []
  }
}
```

## Step 2: Add Inputs

Define what can be customized:

```json
{
  "inputs": [
    {
      "key": "title",
      "type": "string",
      "label": "Title",
      "description": "Main headline text",
      "required": true,
      "default": "Welcome"
    },
    {
      "key": "subtitle",
      "type": "string",
      "label": "Subtitle",
      "description": "Secondary text below the title",
      "required": false,
      "default": "To our presentation"
    },
    {
      "key": "primaryColor",
      "type": "color",
      "label": "Primary Color",
      "description": "Main accent color",
      "required": false,
      "default": "#3B82F6"
    }
  ]
}
```

## Step 3: Create the Background

Add a gradient background layer:

```json
{
  "composition": {
    "scenes": [{
      "id": "main",
      "startFrame": 0,
      "endFrame": 150,
      "layers": [
        {
          "id": "background",
          "type": "shape",
          "position": { "x": 0, "y": 0 },
          "size": { "width": 1920, "height": 1080 },
          "props": {
            "shape": "rectangle",
            "gradient": {
              "type": "linear",
              "colors": [
                { "offset": 0, "color": "#0F172A" },
                { "offset": 1, "color": "#1E293B" }
              ],
              "angle": 135
            }
          }
        }
      ]
    }]
  }
}
```

## Step 4: Add the Title

Add animated title text:

```json
{
  "id": "title",
  "type": "text",
  "position": { "x": 160, "y": 400 },
  "size": { "width": 1600, "height": 150 },
  "inputKey": "title",
  "props": {
    "fontSize": 96,
    "fontWeight": "bold",
    "fontFamily": "Inter, system-ui, sans-serif",
    "textAlign": "center"
  },
  "style": {
    "textColor": "{{primaryColor}}"
  },
  "animations": [
    {
      "type": "entrance",
      "effect": "fadeInUp",
      "delay": 0,
      "duration": 30,
      "easing": "easeOutCubic"
    },
    {
      "type": "exit",
      "effect": "fadeOut",
      "delay": 0,
      "duration": 20
    }
  ]
}
```

## Step 5: Add the Subtitle

Add subtitle with staggered animation:

```json
{
  "id": "subtitle",
  "type": "text",
  "position": { "x": 160, "y": 560 },
  "size": { "width": 1600, "height": 80 },
  "inputKey": "subtitle",
  "props": {
    "fontSize": 36,
    "fontFamily": "Inter, system-ui, sans-serif",
    "color": "#94A3B8",
    "textAlign": "center"
  },
  "animations": [
    {
      "type": "entrance",
      "effect": "fadeIn",
      "delay": 20,
      "duration": 25
    },
    {
      "type": "exit",
      "effect": "fadeOut",
      "delay": 0,
      "duration": 20
    }
  ]
}
```

## Complete Template

```json
{
  "name": "Welcome Video",
  "description": "A simple welcome video with animated text",
  "version": "1.0.0",
  "output": {
    "type": "video",
    "width": 1920,
    "height": 1080,
    "fps": 30,
    "duration": 5
  },
  "inputs": [
    {
      "key": "title",
      "type": "string",
      "label": "Title",
      "description": "Main headline text",
      "required": true,
      "default": "Welcome"
    },
    {
      "key": "subtitle",
      "type": "string",
      "label": "Subtitle",
      "description": "Secondary text",
      "required": false,
      "default": "To our presentation"
    },
    {
      "key": "primaryColor",
      "type": "color",
      "label": "Primary Color",
      "description": "Main accent color",
      "required": false,
      "default": "#3B82F6"
    }
  ],
  "defaults": {
    "title": "Welcome",
    "subtitle": "To our presentation",
    "primaryColor": "#3B82F6"
  },
  "composition": {
    "scenes": [
      {
        "id": "main",
        "startFrame": 0,
        "endFrame": 150,
        "layers": [
          {
            "id": "background",
            "type": "shape",
            "position": { "x": 0, "y": 0 },
            "size": { "width": 1920, "height": 1080 },
            "props": {
              "shape": "rectangle",
              "gradient": {
                "type": "linear",
                "colors": [
                  { "offset": 0, "color": "#0F172A" },
                  { "offset": 1, "color": "#1E293B" }
                ],
                "angle": 135
              }
            }
          },
          {
            "id": "title",
            "type": "text",
            "position": { "x": 160, "y": 400 },
            "size": { "width": 1600, "height": 150 },
            "inputKey": "title",
            "props": {
              "fontSize": 96,
              "fontWeight": "bold",
              "fontFamily": "Inter, system-ui, sans-serif",
              "textAlign": "center"
            },
            "style": {
              "textColor": "{{primaryColor}}"
            },
            "animations": [
              {
                "type": "entrance",
                "effect": "fadeInUp",
                "delay": 0,
                "duration": 30,
                "easing": "easeOutCubic"
              },
              {
                "type": "exit",
                "effect": "fadeOut",
                "delay": 0,
                "duration": 20
              }
            ]
          },
          {
            "id": "subtitle",
            "type": "text",
            "position": { "x": 160, "y": 560 },
            "size": { "width": 1600, "height": 80 },
            "inputKey": "subtitle",
            "props": {
              "fontSize": 36,
              "fontFamily": "Inter, system-ui, sans-serif",
              "color": "#94A3B8",
              "textAlign": "center"
            },
            "animations": [
              {
                "type": "entrance",
                "effect": "fadeIn",
                "delay": 20,
                "duration": 25
              },
              {
                "type": "exit",
                "effect": "fadeOut",
                "delay": 0,
                "duration": 20
              }
            ]
          }
        ]
      }
    ]
  }
}
```

## Rendering the Video

### Browser

```typescript
import { RendervidEngine } from '@rendervid/core';
import { createBrowserRenderer } from '@rendervid/renderer-browser';

const engine = new RendervidEngine();
const renderer = createBrowserRenderer();

const template = { /* template from above */ };

// Validate
const validation = engine.validateTemplate(template);
if (!validation.valid) {
  console.error('Errors:', validation.errors);
  return;
}

// Render
const result = await renderer.renderVideo({
  template,
  inputs: {
    title: 'Hello World!',
    subtitle: 'My first Rendervid video',
    primaryColor: '#EC4899',
  },
  output: { format: 'mp4', quality: 'high' },
});

// Download
const blob = new Blob([result.data], { type: 'video/mp4' });
const url = URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url;
a.download = 'welcome.mp4';
a.click();
```

### Node.js

```typescript
import { RendervidEngine } from '@rendervid/core';
import { createNodeRenderer } from '@rendervid/renderer-node';
import { writeFileSync } from 'fs';

const engine = new RendervidEngine();
const renderer = createNodeRenderer();

const template = { /* template from above */ };

const result = await renderer.renderVideo({
  template,
  inputs: {
    title: 'Hello World!',
    subtitle: 'My first Rendervid video',
    primaryColor: '#EC4899',
  },
  output: { format: 'mp4', quality: 'high' },
});

writeFileSync('welcome.mp4', result.data);
console.log('Video saved!');
```

## Variations

### Change Animation Style

Replace `fadeInUp` with:
- `scaleIn` - Scale up from center
- `slideInLeft` - Slide from left
- `bounceIn` - Bouncy entrance
- `typewriter` - Character by character

### Add Multiple Scenes

```json
{
  "composition": {
    "scenes": [
      {
        "id": "intro",
        "startFrame": 0,
        "endFrame": 90,
        "layers": [/* intro layers */],
        "transition": { "type": "fade", "duration": 15 }
      },
      {
        "id": "main",
        "startFrame": 90,
        "endFrame": 150,
        "layers": [/* main layers */]
      }
    ]
  }
}
```

### Add Background Music

```json
{
  "id": "music",
  "type": "audio",
  "position": { "x": 0, "y": 0 },
  "size": { "width": 0, "height": 0 },
  "props": {
    "src": "https://example.com/music.mp3",
    "volume": 0.3,
    "fadeIn": 30,
    "fadeOut": 30
  }
}
```

## Next Steps

- [Social Media Templates](/examples/social-media)
- [Animation Reference](/templates/animations)
- [Adding Custom Components](/examples/custom-component)
