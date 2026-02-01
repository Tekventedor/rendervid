# Social Media Templates

Ready-to-use templates for popular social media platforms.

## Platform Dimensions

| Platform | Dimensions | Aspect Ratio | Use Case |
|----------|------------|--------------|----------|
| Instagram Story | 1080 x 1920 | 9:16 | Stories, Reels |
| Instagram Post | 1080 x 1080 | 1:1 | Feed posts |
| Instagram Landscape | 1080 x 566 | 1.91:1 | Landscape posts |
| TikTok | 1080 x 1920 | 9:16 | TikTok videos |
| YouTube Thumbnail | 1280 x 720 | 16:9 | Thumbnails |
| YouTube Short | 1080 x 1920 | 9:16 | YouTube Shorts |
| Twitter Card | 1200 x 630 | 1.91:1 | Link previews |
| LinkedIn Banner | 1584 x 396 | 4:1 | Profile banner |
| Facebook Cover | 820 x 312 | 2.63:1 | Page cover |

## Instagram Story Template

```json
{
  "name": "Instagram Story",
  "output": {
    "type": "video",
    "width": 1080,
    "height": 1920,
    "fps": 30,
    "duration": 8
  },
  "inputs": [
    { "key": "headline", "type": "string", "label": "Headline", "required": true },
    { "key": "subtext", "type": "string", "label": "Subtext", "required": false },
    { "key": "backgroundImage", "type": "url", "label": "Background", "required": false },
    { "key": "accentColor", "type": "color", "label": "Accent", "required": false, "default": "#EC4899" }
  ],
  "composition": {
    "scenes": [{
      "id": "main",
      "startFrame": 0,
      "endFrame": 240,
      "backgroundColor": "#0F172A",
      "layers": [
        {
          "id": "bg-image",
          "type": "image",
          "position": { "x": 0, "y": 0 },
          "size": { "width": 1080, "height": 1920 },
          "inputKey": "backgroundImage",
          "props": { "fit": "cover" },
          "filters": [{ "type": "brightness", "value": 0.4 }]
        },
        {
          "id": "gradient-overlay",
          "type": "shape",
          "position": { "x": 0, "y": 960 },
          "size": { "width": 1080, "height": 960 },
          "props": {
            "shape": "rectangle",
            "gradient": {
              "type": "linear",
              "colors": [
                { "offset": 0, "color": "transparent" },
                { "offset": 1, "color": "rgba(0,0,0,0.8)" }
              ],
              "angle": 180
            }
          }
        },
        {
          "id": "headline",
          "type": "text",
          "position": { "x": 60, "y": 1400 },
          "size": { "width": 960, "height": 300 },
          "inputKey": "headline",
          "props": {
            "fontSize": 72,
            "fontWeight": "bold",
            "color": "#FFFFFF",
            "lineHeight": 1.1
          },
          "animations": [
            { "type": "entrance", "effect": "fadeInUp", "duration": 25, "easing": "easeOutCubic" }
          ]
        },
        {
          "id": "subtext",
          "type": "text",
          "position": { "x": 60, "y": 1720 },
          "size": { "width": 960, "height": 100 },
          "inputKey": "subtext",
          "props": {
            "fontSize": 28,
            "color": "#94A3B8"
          },
          "animations": [
            { "type": "entrance", "effect": "fadeIn", "delay": 15, "duration": 20 }
          ]
        },
        {
          "id": "swipe-indicator",
          "type": "text",
          "position": { "x": 440, "y": 1850 },
          "size": { "width": 200, "height": 40 },
          "props": {
            "text": "Swipe Up",
            "fontSize": 16,
            "textAlign": "center"
          },
          "style": { "textColor": "{{accentColor}}" },
          "animations": [
            { "type": "emphasis", "effect": "float", "delay": 40, "duration": 60, "loop": -1 }
          ]
        }
      ]
    }]
  }
}
```

## Instagram Post Template

```json
{
  "name": "Instagram Post",
  "output": {
    "type": "video",
    "width": 1080,
    "height": 1080,
    "fps": 30,
    "duration": 6
  },
  "inputs": [
    { "key": "title", "type": "string", "label": "Title", "required": true },
    { "key": "description", "type": "string", "label": "Description", "required": false },
    { "key": "image", "type": "url", "label": "Image", "required": true }
  ],
  "composition": {
    "scenes": [{
      "id": "main",
      "startFrame": 0,
      "endFrame": 180,
      "backgroundColor": "#FFFFFF",
      "layers": [
        {
          "id": "image",
          "type": "image",
          "position": { "x": 0, "y": 0 },
          "size": { "width": 1080, "height": 720 },
          "inputKey": "image",
          "props": { "fit": "cover" },
          "animations": [
            { "type": "keyframe", "duration": 180, "keyframes": [
              { "frame": 0, "properties": { "scaleX": 1, "scaleY": 1 } },
              { "frame": 180, "properties": { "scaleX": 1.05, "scaleY": 1.05 } }
            ]}
          ]
        },
        {
          "id": "text-bg",
          "type": "shape",
          "position": { "x": 0, "y": 720 },
          "size": { "width": 1080, "height": 360 },
          "props": { "shape": "rectangle", "fill": "#FFFFFF" }
        },
        {
          "id": "title",
          "type": "text",
          "position": { "x": 60, "y": 760 },
          "size": { "width": 960, "height": 100 },
          "inputKey": "title",
          "props": {
            "fontSize": 42,
            "fontWeight": "bold",
            "color": "#0F172A"
          },
          "animations": [
            { "type": "entrance", "effect": "fadeInUp", "delay": 10, "duration": 20 }
          ]
        },
        {
          "id": "description",
          "type": "text",
          "position": { "x": 60, "y": 870 },
          "size": { "width": 960, "height": 150 },
          "inputKey": "description",
          "props": {
            "fontSize": 24,
            "color": "#64748B",
            "lineHeight": 1.4
          },
          "animations": [
            { "type": "entrance", "effect": "fadeIn", "delay": 25, "duration": 20 }
          ]
        }
      ]
    }]
  }
}
```

## YouTube Thumbnail Template

```json
{
  "name": "YouTube Thumbnail",
  "output": {
    "type": "image",
    "width": 1280,
    "height": 720
  },
  "inputs": [
    { "key": "title", "type": "string", "label": "Title", "required": true },
    { "key": "backgroundImage", "type": "url", "label": "Background", "required": true },
    { "key": "badge", "type": "string", "label": "Badge Text", "required": false }
  ],
  "composition": {
    "scenes": [{
      "id": "main",
      "startFrame": 0,
      "endFrame": 1,
      "layers": [
        {
          "id": "background",
          "type": "image",
          "position": { "x": 0, "y": 0 },
          "size": { "width": 1280, "height": 720 },
          "inputKey": "backgroundImage",
          "props": { "fit": "cover" }
        },
        {
          "id": "overlay",
          "type": "shape",
          "position": { "x": 0, "y": 0 },
          "size": { "width": 1280, "height": 720 },
          "props": {
            "shape": "rectangle",
            "gradient": {
              "type": "linear",
              "colors": [
                { "offset": 0, "color": "rgba(0,0,0,0)" },
                { "offset": 0.6, "color": "rgba(0,0,0,0.3)" },
                { "offset": 1, "color": "rgba(0,0,0,0.8)" }
              ],
              "angle": 0
            }
          }
        },
        {
          "id": "title",
          "type": "text",
          "position": { "x": 40, "y": 500 },
          "size": { "width": 1000, "height": 200 },
          "inputKey": "title",
          "props": {
            "fontSize": 64,
            "fontWeight": "900",
            "color": "#FFFFFF",
            "lineHeight": 1.1,
            "stroke": { "color": "#000000", "width": 3 }
          }
        },
        {
          "id": "badge",
          "type": "group",
          "position": { "x": 1080, "y": 40 },
          "size": { "width": 160, "height": 50 },
          "props": { "clip": false },
          "children": [
            {
              "id": "badge-bg",
              "type": "shape",
              "position": { "x": 0, "y": 0 },
              "size": { "width": 160, "height": 50 },
              "props": { "shape": "rectangle", "fill": "#EF4444", "borderRadius": 8 }
            },
            {
              "id": "badge-text",
              "type": "text",
              "position": { "x": 0, "y": 8 },
              "size": { "width": 160, "height": 34 },
              "inputKey": "badge",
              "props": {
                "fontSize": 24,
                "fontWeight": "bold",
                "color": "#FFFFFF",
                "textAlign": "center"
              }
            }
          ]
        }
      ]
    }]
  }
}
```

## TikTok Video Template

```json
{
  "name": "TikTok Video",
  "output": {
    "type": "video",
    "width": 1080,
    "height": 1920,
    "fps": 30,
    "duration": 10
  },
  "inputs": [
    { "key": "hook", "type": "string", "label": "Hook Text", "required": true },
    { "key": "points", "type": "array", "label": "Points", "required": true }
  ],
  "composition": {
    "scenes": [
      {
        "id": "hook",
        "startFrame": 0,
        "endFrame": 90,
        "backgroundColor": "#000000",
        "layers": [
          {
            "id": "hook-text",
            "type": "text",
            "position": { "x": 60, "y": 800 },
            "size": { "width": 960, "height": 320 },
            "inputKey": "hook",
            "props": {
              "fontSize": 64,
              "fontWeight": "bold",
              "color": "#FFFFFF",
              "textAlign": "center",
              "lineHeight": 1.2
            },
            "animations": [
              { "type": "entrance", "effect": "scaleIn", "duration": 20, "easing": "easeOutBack" }
            ]
          }
        ],
        "transition": { "type": "fade", "duration": 15 }
      },
      {
        "id": "content",
        "startFrame": 90,
        "endFrame": 300,
        "backgroundColor": "#0F172A",
        "layers": []
      }
    ]
  }
}
```

## Usage

### Browser Rendering

```typescript
import { createBrowserRenderer } from '@rendervid/renderer-browser';

const renderer = createBrowserRenderer();

const result = await renderer.renderVideo({
  template: instagramStoryTemplate,
  inputs: {
    headline: 'New Collection\nNow Available',
    subtext: 'Shop the latest styles',
    backgroundImage: 'https://example.com/fashion.jpg',
    accentColor: '#EC4899',
  },
  output: { format: 'mp4', quality: 'high' },
});
```

### Node.js Rendering

```typescript
import { createNodeRenderer } from '@rendervid/renderer-node';

const renderer = createNodeRenderer();

const result = await renderer.renderImage({
  template: youtubeThumbnailTemplate,
  inputs: {
    title: '10 Tips You NEED\nTo Know!',
    backgroundImage: 'https://example.com/bg.jpg',
    badge: 'NEW',
  },
  output: { format: 'png' },
});
```

## Tips for Social Media

1. **Use safe zones** - Keep important content away from edges
2. **High contrast text** - Ensure readability on small screens
3. **Bold typography** - Grab attention in feeds
4. **Short durations** - Match platform expectations (8-15s)
5. **Platform-specific features** - Consider swipe up CTAs, sound indicators

## Related Documentation

- [Examples Overview](/examples/)
- [Animation Reference](/templates/animations)
- [Template Schema](/templates/schema)
