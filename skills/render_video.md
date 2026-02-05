---
name: render_video
description: "Generate a video file from a Rendervid JSON template. Use for videos ≤30 seconds. For longer videos, use start_render_async."
tags: [video, rendering, templates, generation, json, mcp, rendervid]
category: rendering
---

# render_video

Generate a video file from a Rendervid JSON template. Use for videos ≤30 seconds. For longer videos, use start_render_async.

USE FOR:
Social media content (Instagram Reels, TikTok, YouTube Shorts), product demonstrations,
promotional videos, explainer animations, tutorial videos, video ads, portfolio showcases,
event announcements, presentations, marketing campaigns

OUTPUT CONFIGURATION (YOU CHOOSE):
- Format: MP4 (default/best), WebM (web), MOV (macOS)
- Quality: draft (fast preview), standard (balanced), high (production - default), lossless (uncompressed)
- Resolution: Choose based on platform:
  * TikTok/Reels/Shorts: 1080x1920 (9:16 portrait)
  * YouTube/Instagram: 1920x1080 (16:9 landscape)
  * Twitter: 1280x720 (smaller, faster)
  * Max: 7680x4320 (8K)
- FPS: 24 (cinematic), 30 (standard/default), 60 (smooth)
- renderWaitTime: **AUTO-ADJUSTED** (100ms for text-only, 500ms for images/video automatically)
  * Manual override: 100 (fast), 200 (safer), 500+ (complex media)
  * 💡 TIP: If images don't appear, increase to 800-1000ms

⚠️ CRITICAL: Images require time to load!
- Server automatically uses 500ms renderWaitTime when images/videos detected
- If images still don't appear: manually set "renderWaitTime": 800
- Text-only templates use 100ms (fast)

⚠️ TIMEOUT WARNING: Videos >30s may timeout (60s MCP limit). Use start_render_async for longer videos.

⚠️ CRITICAL: Pass template as JSON OBJECT, not string
❌ WRONG: { "template": "{\"name\":\"Video\"}" }
✅ CORRECT: { "template": {"name": "Video"} }

⚠️ ALWAYS VALIDATE FIRST
Workflow: validate_template → fix errors → render_video
Prevents: 404 image errors, syntax issues, wasted render time

⚠️ REQUIRED TEMPLATE FIELDS (ALWAYS INCLUDE):
{
  "name": "string",           // Template name (REQUIRED)
  "output": { ... },           // Output configuration (REQUIRED)
  "inputs": [],                // Input definitions array (REQUIRED - use empty array [] if no dynamic inputs)
  "composition": { ... }       // Scenes and layers (REQUIRED)
}

❌ COMMON ERROR: Missing "inputs" field
✅ FIX: Always include "inputs": [] even if you have no dynamic variables

CRITICAL TEMPLATE RULES:

1. TIMING IS IN FRAMES, NOT SECONDS
   - At 30 fps: 30 frames = 1 second, 150 frames = 5 seconds
   - duration: 5 means 5 SECONDS (converted to frames internally)
   - startFrame: 0, endFrame: 150 means frames 0-150 (5 seconds at 30fps)
   - Animation delay/duration are in FRAMES: delay: 30 = 1 second delay

2. ALL LAYERS MUST HAVE position AND size
   - position: { x: number, y: number } (pixels from top-left)
   - size: { width: number, height: number } (pixels)
   - Example: position: { x: 0, y: 0 }, size: { width: 1920, height: 1080 }

3. LAYER PROPERTIES GO IN props OBJECT
   - Correct: "props": { "text": "Hello", "fontSize": 48, "color": "#ffffff" }
   - Wrong: "text": "Hello", "fontSize": 48 (these must be inside props)

4. INPUTS FIELD IS ALWAYS REQUIRED
   - MUST include "inputs" field in template (even if empty: "inputs": [])
   - For static videos with no variables: "inputs": []
   - For dynamic videos with {{variables}}: define each input with ALL fields:
     * key: unique identifier (string)
     * type: "string" | "number" | "boolean" | "color"
     * label: display name (string)
     * description: what this input does (string) - REQUIRED
     * required: true/false (boolean) - REQUIRED
     * default: default value - REQUIRED
   - Example: { "key": "title", "type": "string", "label": "Title", "description": "Main title text", "required": true, "default": "Hello" }

5. ANIMATIONS USE FRAME-BASED TIMING
   - type: "entrance" | "exit" | "emphasis"
   - effect: "fadeIn", "slideUp", "scaleIn", etc.
   - delay: number (frames to wait before starting)
   - duration: number (frames the animation lasts)
   - Example: { "type": "entrance", "effect": "fadeIn", "delay": 30, "duration": 20 }
     This means: wait 1 second (30 frames), then fade in over 0.67 seconds (20 frames)

COMPLETE TEMPLATE STRUCTURE (Static - No Variables):
{
  "name": "Video Name",
  "output": {
    "type": "video",
    "width": 1920,
    "height": 1080,
    "fps": 30,
    "duration": 5
  },
  "inputs": [],
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
              "fill": "#2563eb"
            }
          },
          {
            "id": "title",
            "type": "text",
            "position": { "x": 160, "y": 440 },
            "size": { "width": 1600, "height": 200 },
            "props": {
              "text": "Hello World",
              "fontSize": 72,
              "fontWeight": "bold",
              "color": "#ffffff",
              "textAlign": "center"
            }
          }
        ]
      }
    ]
  }
}

COMPLETE TEMPLATE STRUCTURE (Dynamic - With Variables):
{
  "name": "Video Name",
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
      "label": "Title Text",
      "description": "Main title text to display",
      "required": true,
      "default": "Hello World"
    }
  ],
  "defaults": {
    "title": "Hello World"
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
              "fill": "#2563eb"
            }
          },
          {
            "id": "title",
            "type": "text",
            "position": { "x": 160, "y": 440 },
            "size": { "width": 1600, "height": 200 },
            "props": {
              "text": "{{title}}",
              "fontSize": 72,
              "fontWeight": "bold",
              "color": "#ffffff",
              "textAlign": "center"
            },
            "animations": [
              {
                "type": "entrance",
                "effect": "fadeIn",
                "delay": 30,
                "duration": 20,
                "easing": "easeOutCubic"
              }
            ]
          }
        ]
      }
    ]
  }
}

NEED MORE DETAILS? Use these tools for just-in-time documentation:
- get_component_docs({ componentType: "text" }) - Detailed component/layer documentation
- get_animation_docs({ animationType: "entrance" }) - Animation effects reference
- get_easing_docs({ category: "out" }) - Easing functions guide
- get_capabilities({}) - Full list of available features
- list_examples({}) - Browse example templates

LAYER TYPES: text, image, shape, video, audio, custom
ANIMATION TYPES: entrance, exit, emphasis
EASING CATEGORIES: basic, in, out (recommended), inout, back, bounce, elastic

⚠️ CRITICAL: ANIMATION RESTRICTIONS - CAUSES BLACK SCENES IF VIOLATED

**SUPPORTED ANIMATIONS ONLY:**
✅ SAFE (Standard entrance/exit effects):
- fadeIn, fadeOut (opacity transitions)
- slideInUp, slideInDown, slideInLeft, slideInRight, slideOutUp, slideOutDown, slideOutLeft, slideOutRight (position transitions)
- scaleIn, scaleOut (size transitions)

❌ NEVER USE (Will create BLACK SCENES):
- Custom keyframe animations with "type": "custom"
- Animations that change size or position in keyframes
- Complex transform animations
- CSS-based animations

**ANIMATION STRUCTURE (REQUIRED FORMAT):**
{
  "animations": [
    {
      "type": "entrance",        // or "exit"
      "effect": "fadeIn",        // Use supported effects only
      "delay": 30,               // Frames to wait before starting
      "duration": 20,            // Frames the animation lasts
      "easing": "easeOutCubic"   // Optional easing function
    }
  ]
}

**EXAMPLE - SMOOTH SCENE TRANSITIONS:**
// Scene 1 elements - fade out before scene ends
{
  "animations": [
    {
      "type": "entrance",
      "effect": "fadeIn",
      "delay": 15,
      "duration": 20
    },
    {
      "type": "exit",
      "effect": "fadeOut",
      "delay": 130,    // Start fade 20 frames before scene end (if scene is 150 frames)
      "duration": 20
    }
  ]
}

// Scene 2 background - fade in at scene start
{
  "animations": [
    {
      "type": "entrance",
      "effect": "fadeIn",
      "delay": 0,       // Start immediately
      "duration": 20
    }
  ]
}

⚠️ CRITICAL: POSITIONING RULES - ELEMENTS MUST BE VISIBLE

**CANVAS BOUNDS (Example for 1080x1920 vertical video):**
- Width: 0 to 1080 (pixels)
- Height: 0 to 1920 (pixels)
- Origin: Top-left corner (0, 0)

**SAFE POSITIONING ZONES:**

    +-------------------------+ y: 0
    |    Title Area (Safe)    | y: 100-400
    |-------------------------|
    |                         |
    |   Main Content Area     | y: 400-1500
    |      (Safe Zone)        |
    |                         |
    |-------------------------|
    |   Bottom Area (Safe)    | y: 1500-1800
    +-------------------------+ y: 1920
     x: 0               x: 1080

❌ COMMON POSITIONING ERRORS (Causes invisible/black content):
- Negative positions: x: -100 or y: -50
- Beyond canvas: y: 2000 for 1920px height video
- Partially off-screen: x: 1000 with width: 200 (goes to x: 1200, exceeds 1080)

✅ CORRECT POSITIONING:
- Title: { "x": 90, "y": 200 } with size { "width": 900, "height": 100 }
- Main content: { "x": 100, "y": 500 } with size { "width": 880, "height": 800 }
- Always ensure: x + width ≤ canvas width, y + height ≤ canvas height

⚠️ CRITICAL: VIDEO BACKGROUNDS - AVOID LOOP FLASH

**THE PROBLEM:** If scene duration > video source duration, video loops and causes visible flash/jump

**THE SOLUTION:** Make scene duration EXACTLY match video source duration

**EXAMPLE:**
- Video source: 5 seconds
- FPS: 30
- Scene frames: 5 × 30 = 150 frames
- Scene config: startFrame: 0, endFrame: 150 (exactly 5 seconds)

❌ WRONG (Causes flash):
{
  "startFrame": 0,
  "endFrame": 225,    // 7.5 seconds - video will loop at 5s and flash!
  "layers": [{
    "type": "video",
    "props": {
      "src": "/path/to/5-second-video.mp4",
      "loop": true    // Will cause visible flash at 5s mark
    }
  }]
}

✅ CORRECT (No flash):
{
  "startFrame": 0,
  "endFrame": 150,    // Exactly 5 seconds - no loop needed!
  "layers": [{
    "type": "video",
    "props": {
      "src": "/path/to/5-second-video.mp4",
      "muted": true    // Loop not needed when duration matches
    }
  }]
}

⚠️ QUALITY SETTINGS - FOR PRODUCTION VIDEOS

**WHEN TO USE HIGH QUALITY:**
Use "quality": "high" for:
- Final production videos
- Client deliverables
- Videos with text that must be sharp
- Videos for large screens

**OUTPUT:**
- Uses software encoding (libx264) - slower but excellent quality
- Bitrate: 8-10 Mbps (file size: ~8-12 MB for 15s video)
- No compression artifacts
- Crystal clear text and images

**WHEN TO USE STANDARD QUALITY:**
Use "quality": "standard" (default) for:
- Quick previews
- Social media content (compressed by platforms anyway)
- Drafts and iterations

**OUTPUT:**
- Uses hardware encoding (faster)
- Bitrate: ~1-2 Mbps (file size: ~1-2 MB for 15s video)
- Good enough for most uses
- Faster render times

CUSTOM COMPONENTS (ADVANCED - For animated counters, charts, particles, etc.):

**CRITICAL JSX RESTRICTION - READ CAREFULLY:**
Custom components MUST use React.createElement(), NOT JSX syntax!

❌ WRONG (JSX - Will create BLACK VIDEO):
"code": "import React from 'react'; export default function Counter({ frame }) { return <div>{frame}</div>; }"

✅ CORRECT (React.createElement):
"code": "function Counter(props) { return React.createElement('div', null, props.frame); }"

**RULES FOR INLINE CUSTOM COMPONENTS:**
1. ✅ Use React.createElement() - NEVER use JSX (<div>, </div>, etc.)
2. ✅ Plain function: function ComponentName(props) { ... }
3. ✅ Access props: props.frame, props.fps, props.layerSize
4. ❌ NO imports: no "import React" or "import anything"
5. ❌ NO exports: no "export default" or "export"
6. ❌ NO async/await, side effects, or external libraries
7. ✅ React is globally available - just use React.createElement()

**COMPONENT PROPS (automatically provided):**
{
  frame: number,           // Current frame (0, 1, 2, ...)
  fps: number,            // Frames per second (30, 60)
  sceneDuration: number,  // Total frames in scene
  layerSize: {
    width: number,
    height: number
  },
  // + your custom props from customComponent.props
}

**SIMPLE CUSTOM COMPONENT EXAMPLE:**
{
  "customComponents": {
    "AnimatedCounter": {
      "type": "inline",
      "code": "function AnimatedCounter(props) { const duration = 2 * props.fps; const progress = Math.min(props.frame / duration, 1); const value = Math.floor(props.from + (props.to - props.from) * progress); return React.createElement('div', { style: { fontSize: '72px', fontWeight: 'bold', color: '#00ffff' } }, value); }"
    }
  },
  "composition": {
    "scenes": [{
      "layers": [{
        "id": "counter",
        "type": "custom",
        "position": { "x": 960, "y": 540 },
        "size": { "width": 400, "height": 200 },
        "customComponent": {
          "name": "AnimatedCounter",
          "props": {
            "from": 0,
            "to": 100
          }
        }
      }]
    }]
  }
}

**JSX TO React.createElement CONVERSION:**

Simple element:
JSX: <div>Hello</div>
→ React.createElement('div', null, 'Hello')

With props:
JSX: <div style={{color: 'red'}}>Hello</div>
→ React.createElement('div', { style: { color: 'red' } }, 'Hello')

Nested elements:
JSX: <div><span>{value}</span></div>
→ React.createElement('div', null, React.createElement('span', null, value))

Multiple children:
JSX: <div><p>A</p><p>B</p></div>
→ React.createElement('div', null, React.createElement('p', null, 'A'), React.createElement('p', null, 'B'))

**WHEN TO USE CUSTOM COMPONENTS:**
✓ Animated counters (0 → 100)
✓ Timers and clocks
✓ Particle effects
✓ Custom charts/graphs
✓ Progress bars
✓ Complex animations beyond built-in effects

For simple text/images/shapes, use built-in layer types instead!

VIDEO LAYER EXAMPLE (FOR VIDEO BACKGROUNDS):
{
  "id": "background-video",
  "type": "video",
  "position": { "x": 0, "y": 0 },
  "size": { "width": 1920, "height": 1080 },
  "props": {
    "src": "/path/to/video.mp4",
    "fit": "cover",
    "loop": true,
    "muted": true,
    "playbackRate": 1,
    "startTime": 0
  }
}

WHEN TO USE VIDEO LAYERS:
✓ Use for animated backgrounds (loops, motion footage)
✓ Local file paths: "/Users/name/Downloads/video.mp4" (absolute paths only)
✓ Always set "muted": true for background videos
✓ Use "loop": true to repeat the video
✓ Layer order matters: video background should be FIRST layer (rendered behind text/shapes)

IMAGE LAYER EXAMPLE (REQUIRED FOR PROMOTIONAL VIDEOS):
{
  "id": "product-photo",
  "type": "image",
  "position": { "x": 100, "y": 100 },
  "size": { "width": 800, "height": 600 },
  "props": {
    "src": "https://www.photomaticai.com/images/.../image.webp",
    "fit": "cover"
  }
}

⚠️ IMAGE SOURCE OPTIONS:

✅ LOCAL FILES - AUTOMATICALLY HANDLED (Recommended for local development):
   - MCP server automatically converts local files to base64 data URLs
   - Absolute paths: "/Users/name/Downloads/image.jpg"
   - Tilde paths: "~/Downloads/image.jpg" (auto-expands to home directory)
   - Works on macOS, Linux, Windows
   - **AUTO-RESIZE**: Files > 500 KB automatically resized to ~30-50 KB for optimal performance
   - **BASE64**: Converted to data URLs seamlessly (no HTTP server needed)
   - No internet connection required
   - All formats: JPG, PNG, WebP, GIF, BMP, SVG
   - ⚠️ Use absolute paths, NOT relative paths like "./image.jpg"

✅ HTTPS URLs (Recommended for production):
   - Unsplash: "https://images.unsplash.com/photo-..."
   - Pexels: "https://images.pexels.com/photos/..."
   - Photomatic AI: "https://www.photomaticai.com/images/processed/..."
   - Any accessible HTTPS image URL

✅ DATA URLs (Advanced):
   - Base64: "data:image/png;base64,iVBORw0KG..."
   - Local files are automatically converted to data URLs

❌ WRONG: These will FAIL:
   - "/mnt/user-data/uploads/image.webp" (Linux path, invalid on macOS)
   - "/home/claude/image.webp" (Linux path, invalid on macOS)
   - "C:\Users\name\image.jpg" (Windows path, use forward slashes)
   - "./image.webp" or "../images/photo.jpg" (relative paths not supported)

🎯 AUTOMATIC IMAGE RESIZING:
   - Large images (> 500 KB) are automatically resized
   - Example: 1154 KB → 36 KB (preserves quality and aspect ratio)
   - Ensures fast loading and no browser issues
   - WebP files converted to JPEG for better compatibility

WHEN TO USE IMAGE LAYERS:
✓ ALWAYS include image layers for: promotional videos, product showcases, portfolios, presentations
✓ If creating a promo for "Product X", include actual Product X images - not just text/shapes
✓ Use Photomatic AI URLs: https://www.photomaticai.com/images/processed/...
✓ Multiple images make videos more engaging: add 2-5 image layers showing different angles/features

CRITICAL FOR IMAGE/VIDEO RENDERING:
When your template includes image or video layers, set: "renderWaitTime": 500
Media is pre-loaded during initialization, but a wait ensures proper rendering.
Example: { "template": {...}, "renderWaitTime": 500 }
Note: Video layers need 500-1000ms; images need 300-500ms; simple text templates: 100-200ms

COMMON MISTAKES TO AVOID:
❌ MISSING "inputs" FIELD - THIS IS THE #1 ERROR! Always include "inputs": [] even for static templates
❌ Creating promotional videos with ONLY text and shapes - MUST include image layers showing the actual product/content
❌ Using seconds for animation timing (use frames!)
❌ Missing size property on layers
❌ Putting layer props outside props object
❌ Missing required fields in input definitions (description, required, default)
❌ Using wrong position values (position is top-left corner, not center)
❌ endFrame less than or equal to startFrame
❌ DUPLICATE LAYER IDS: Layer IDs must be unique across ALL scenes (use "scene1-bg", "scene2-bg" not "background" in every scene)

TEMPLATE VARIABLES:
✓ Use {{variableName}} in props to reference inputs: "text": "{{title}}"
✓ Define the variable in defaults: "defaults": { "title": "Hello" }
✓ Note: "UNUSED_INPUT" warnings appear even when using {{variables}} - these can be ignored
❌ Animation delay + duration exceeding scene duration

## When to Use

Use this tool when you need to:
- Generate video files from JSON templates
- Create animated content programmatically
- Export videos in various formats (MP4, WebM, MOV, GIF)
- Apply custom animations and effects

## Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `template` | object | ✓ |  |
| `inputs` | object |  | Template variables. Example: {"title": "Hello World"} |
| `outputPath` | string | ✓ | Output file path. Use ~/Downloads/, ~/Desktop/, or ~/Documents/ on macOS |
| `format` | string |  | Video format. mp4 = Best compatibility (default), webm = Web optimized, mov = macOS native |
| `quality` | string |  | Quality preset. draft = Fast preview, standard = Balanced, high = Production (default), lossless = Uncompressed |
| `fps` | integer |  | Override template fps. Common: 24 = Film, 30 = Standard, 60 = Smooth |
| `renderWaitTime` | integer |  | Wait time in ms before capturing frames. 100 = fast/default, 200 = text-only, 500-800 = with complex images/videos |


## Input Schema

```json
{
  "type": "object",
  "properties": {
    "template": {
      "type": "object",
      "properties": {
        "name": {
          "type": "string"
        },
        "description": {
          "type": "string"
        },
        "version": {
          "type": "string"
        },
        "output": {
          "type": "object",
          "properties": {
            "type": {
              "type": "string",
              "enum": [
                "video",
                "image"
              ]
            },
            "width": {
              "type": "integer",
              "exclusiveMinimum": 0
            },
            "height": {
              "type": "integer",
              "exclusiveMinimum": 0
            },
            "fps": {
              "type": "integer",
              "exclusiveMinimum": 0
            },
            "duration": {
              "type": "number",
              "exclusiveMinimum": 0
            }
          },
          "required": [
            "type",
            "width",
            "height"
          ],
          "additionalProperties": false
        },
        "inputs": {
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "key": {
                "type": "string"
              },
              "type": {
                "type": "string"
              },
              "label": {
                "type": "string"
              },
              "description": {
                "type": "string"
              },
              "required": {
                "type": "boolean"
              },
              "default": {}
            },
            "required": [
              "key",
              "type",
              "label"
            ],
            "additionalProperties": false
          }
        },
        "defaults": {
          "type": "object",
          "additionalProperties": {}
        },
        "composition": {
          "type": "object",
          "properties": {
            "scenes": {
              "type": "array"
            }
          },
          "required": [
            "scenes"
          ],
          "additionalProperties": false
        }
      },
      "required": [
        "name",
        "output",
        "composition"
      ],
      "additionalProperties": false
    },
    "inputs": {
      "type": "object",
      "additionalProperties": {},
      "default": {},
      "description": "Template variables. Example: {\"title\": \"Hello World\"}"
    },
    "outputPath": {
      "type": "string",
      "description": "Output file path. Use ~/Downloads/, ~/Desktop/, or ~/Documents/ on macOS"
    },
    "format": {
      "type": "string",
      "enum": [
        "mp4",
        "webm",
        "mov",
        "gif"
      ],
      "default": "mp4",
      "description": "Video format. mp4 = Best compatibility (default), webm = Web optimized, mov = macOS native"
    },
    "quality": {
      "type": "string",
      "enum": [
        "draft",
        "standard",
        "high",
        "lossless"
      ],
      "default": "high",
      "description": "Quality preset. draft = Fast preview, standard = Balanced, high = Production (default), lossless = Uncompressed"
    },
    "fps": {
      "type": "integer",
      "exclusiveMinimum": 0,
      "description": "Override template fps. Common: 24 = Film, 30 = Standard, 60 = Smooth"
    },
    "renderWaitTime": {
      "type": "integer",
      "exclusiveMinimum": 0,
      "default": 100,
      "description": "Wait time in ms before capturing frames. 100 = fast/default, 200 = text-only, 500-800 = with complex images/videos"
    }
  },
  "required": [
    "template",
    "outputPath"
  ],
  "additionalProperties": false,
  "$schema": "http://json-schema.org/draft-07/schema#"
}
```

## Examples

### Basic Video Generation

```json
{
  "template": {
    "name": "Hello World",
    "output": {
      "type": "video",
      "width": 1920,
      "height": 1080,
      "fps": 30,
      "duration": 5
    },
    "composition": {
      "scenes": [{
        "id": "main",
        "startFrame": 0,
        "endFrame": 150,
        "layers": [{
          "id": "text",
          "type": "text",
          "props": { "text": "Hello World!" }
        }]
      }]
    }
  },
  "inputs": {},
  "format": "mp4",
  "quality": "high"
}
```

## Related Tools

- [`render_image`](./render_image.md)
- [`validate_template`](./validate_template.md)
- [`get_example`](./get_example.md)

## Error Handling

This tool provides detailed error messages when:
- Invalid template structure
- Missing required parameters
- Unsupported formats or options
- File system errors

Always check the returned error messages for troubleshooting guidance.

## Best Practices

- Validate templates before rendering to catch errors early
- Use appropriate quality settings for your use case
- Monitor file sizes for web delivery
- Handle errors gracefully in production
