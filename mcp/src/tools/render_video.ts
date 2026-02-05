import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { createNodeRenderer } from '@rendervid/renderer-node';
import type { Template } from '@rendervid/core';
import { RendervidEngine, createDefaultComponentDefaultsManager } from '@rendervid/core';
import { RenderVideoInputSchema } from '../types.js';
import { createLogger } from '../utils/logger.js';
import { preprocessTemplateFiles } from '../utils/template-preprocessor.js';
import { validateTemplateForRendering } from '../utils/template-validator.js';
import { validateRenderedVideo } from '../utils/post-render-validator.js';
import * as os from 'os';
import * as path from 'path';

const logger = createLogger('render_video');

export const renderVideoTool = {
  name: 'render_video',
  description: `Generate a video file from a Rendervid JSON template. Use for videos ≤30 seconds. For longer videos, use start_render_async.

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
❌ WRONG: { "template": "{\\"name\\":\\"Video\\"}" }
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
   - "C:\\Users\\name\\image.jpg" (Windows path, use forward slashes)
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
❌ Animation delay + duration exceeding scene duration`,
  inputSchema: zodToJsonSchema(RenderVideoInputSchema),
};

export async function executeRenderVideo(args: unknown): Promise<string> {
  try {
    // Validate input
    const input = RenderVideoInputSchema.parse(args);

    // Handle case where template is passed as a JSON string instead of object
    if (typeof input.template === 'string') {
      logger.error('Template was passed as string instead of object');
      return JSON.stringify({
        success: false,
        error: 'TEMPLATE_FORMAT_ERROR',
        message: 'Template must be a JSON object, not a string.',
        howToFix: 'Instead of: {"template": "{\\"name\\":\\"...\\"}"}, use: {"template": {"name": "..."}}',
        details: 'The template parameter should be a JavaScript object, not a JSON string. Remove the surrounding quotes and escape characters.',
      }, null, 2);
    }

    // Validate and fix output path for macOS
    let outputPath = input.outputPath;
    let pathWasCorrected = false;
    let pathCorrectionMessage = '';

    // Expand tilde in path
    if (outputPath.startsWith('~/')) {
      outputPath = path.join(os.homedir(), outputPath.slice(2));
    }

    if (os.platform() === 'darwin' && outputPath.startsWith('/home/')) {
      // On macOS, /home/ paths don't exist - convert to proper macOS path
      const filename = path.basename(outputPath);
      const pathParts = outputPath.split('/').filter(Boolean);

      // Try to detect common user directories
      if (pathParts.includes('Downloads')) {
        outputPath = path.join(os.homedir(), 'Downloads', filename);
        pathCorrectionMessage = `Path corrected: /home/claude/Downloads → ${os.homedir()}/Downloads`;
      } else if (pathParts.includes('Desktop')) {
        outputPath = path.join(os.homedir(), 'Desktop', filename);
        pathCorrectionMessage = `Path corrected: /home/claude/Desktop → ${os.homedir()}/Desktop`;
      } else if (pathParts.includes('Documents')) {
        outputPath = path.join(os.homedir(), 'Documents', filename);
        pathCorrectionMessage = `Path corrected: /home/claude/Documents → ${os.homedir()}/Documents`;
      } else {
        // Default to Downloads
        outputPath = path.join(os.homedir(), 'Downloads', filename);
        pathCorrectionMessage = `Path corrected: ${input.outputPath} → ${outputPath} (using Downloads folder)`;
      }

      pathWasCorrected = true;

      logger.warn('Invalid path detected and corrected', {
        originalPath: input.outputPath,
        correctedPath: outputPath,
        reason: 'macOS does not use /home/ paths. Converted to proper macOS user directory.',
      });
    }

    // Validate template before rendering
    logger.info('Validating template');
    let validation: { valid: boolean; errors?: any[]; warnings?: any[] };

    try {
      const engine = new RendervidEngine();
      validation = engine.validateTemplate(input.template);
    } catch (validationError) {
      logger.error('Template validation threw an exception', { error: validationError });

      return JSON.stringify({
        success: false,
        error: 'Template validation failed with an unexpected error',
        details: validationError instanceof Error ? validationError.message : String(validationError),
        suggestion: 'This may indicate a malformed template structure. Please check the template format.',
      }, null, 2);
    }

    if (!validation.valid) {
      logger.warn('Template validation failed', {
        errorCount: validation.errors?.length || 0,
      });

      return JSON.stringify({
        success: false,
        error: 'Template validation failed. Please fix the errors and try again.',
        validation: {
          errors: validation.errors || [],
          warnings: validation.warnings || [],
          suggestions: generateValidationSuggestions(validation.errors || []),
        },
      }, null, 2);
    }

    if (validation.warnings && validation.warnings.length > 0) {
      logger.info('Template has warnings', {
        warningCount: validation.warnings.length,
        warnings: validation.warnings,
      });
    }

    // Preprocess template to convert local files to data URLs
    logger.info('Preprocessing template files');
    const preprocessResult = await preprocessTemplateFiles(input.template, {
      maxBase64SizeKB: 500,
    });

    // Log conversions
    if (preprocessResult.conversions.length > 0) {
      logger.info('File conversions completed', {
        count: preprocessResult.conversions.length,
        conversions: preprocessResult.conversions.map(c => ({
          layerId: c.layerId,
          originalPath: c.originalPath,
          originalSize: `${c.originalSizeKB.toFixed(1)} KB`,
          finalSize: `${c.finalSizeKB.toFixed(1)} KB`,
          wasResized: c.wasResized,
        })),
      });
    }

    // Log warnings
    if (preprocessResult.warnings.length > 0) {
      logger.warn('File preprocessing warnings', { warnings: preprocessResult.warnings });
    }

    // Handle preprocessing errors
    if (preprocessResult.errors.length > 0) {
      logger.error('File preprocessing failed', { errors: preprocessResult.errors });
      return JSON.stringify({
        success: false,
        error: 'Failed to preprocess template files',
        details: preprocessResult.errors,
        suggestion: 'Check that all local file paths are valid and accessible.',
      }, null, 2);
    }

    const processedTemplate = preprocessResult.template;

    // Validate template for common rendering issues
    logger.info('Validating template for rendering issues');
    const renderValidation = validateTemplateForRendering(processedTemplate);

    // Log validation issues
    if (renderValidation.issues.length > 0) {
      const errors = renderValidation.issues.filter(i => i.severity === 'error');
      const warnings = renderValidation.issues.filter(i => i.severity === 'warning');

      if (errors.length > 0) {
        logger.error('Template has critical issues that will cause rendering problems', {
          errorCount: errors.length,
          errors: errors.map(e => ({
            code: e.code,
            message: e.message,
            fix: e.fix,
            location: e.location,
          })),
        });

        return JSON.stringify({
          success: false,
          error: 'Template validation failed - will cause rendering issues',
          issues: {
            errors: errors.map(e => ({
              code: e.code,
              message: e.message,
              fix: e.fix,
              location: e.location,
            })),
            warnings: warnings.map(w => ({
              code: w.code,
              message: w.message,
              fix: w.fix,
              location: w.location,
            })),
          },
          suggestion: 'Fix the errors listed above before rendering. Common issues: unsupported animations (use fadeIn/fadeOut instead of custom keyframes), elements positioned outside canvas bounds, invalid scene timing.',
        }, null, 2);
      }

      if (warnings.length > 0) {
        logger.warn('Template has warnings', {
          warningCount: warnings.length,
          warnings: warnings.map(w => ({
            code: w.code,
            message: w.message,
            fix: w.fix,
            location: w.location,
          })),
        });
      }
    }

    // Auto-adjust renderWaitTime based on template content
    let renderWaitTime = input.renderWaitTime ?? 100;
    const hasMediaLayers = detectMediaLayers(processedTemplate);

    if (hasMediaLayers && !input.renderWaitTime) {
      // Template has images/videos and user didn't specify renderWaitTime
      // Use 500ms to ensure media loads properly
      renderWaitTime = 500;
      logger.info('Auto-adjusted renderWaitTime for media layers', {
        from: 100,
        to: 500,
        reason: 'Template contains image/video/audio layers',
      });
    }

    logger.info('Starting video render', {
      outputPath: outputPath,
      format: input.format,
      quality: input.quality,
      renderWaitTime,
    });

    // Create component defaults manager with pre-configured components
    // This ensures all custom components receive proper defaults and validation
    let renderer: any;
    try {
      const defaultsManager = createDefaultComponentDefaultsManager();

      // Create renderer with component defaults enabled
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      renderer = createNodeRenderer({
        componentDefaultsManager: defaultsManager as any,
      });
    } catch (rendererError) {
      logger.error('Failed to create renderer', { error: rendererError });

      return JSON.stringify({
        success: false,
        error: 'Failed to initialize video renderer',
        details: rendererError instanceof Error ? rendererError.message : String(rendererError),
        suggestion: 'This may indicate a system configuration issue. Ensure ffmpeg and required dependencies are installed.',
      }, null, 2);
    }

    // Map quality to codec settings
    const codecSettings = getCodecSettings(input.format, input.quality);

    // Merge inputs with template defaults
    const mergedInputs = {
      ...(input.template.defaults || {}),
      ...input.inputs,
    };

    // Render video with timeout protection
    let result: any;
    try {
      result = await renderer.renderVideo({
        template: processedTemplate as Template,
        inputs: mergedInputs,
        outputPath: outputPath,
        codec: codecSettings.codec,
        quality: codecSettings.quality,
        renderWaitTime: renderWaitTime,
        onProgress: (progress: any) => {
          logger.info('Render progress', {
            phase: progress.phase,
            percent: progress.percent?.toFixed(1),
            frame: `${progress.currentFrame}/${progress.totalFrames}`,
            eta: progress.eta ? `${progress.eta.toFixed(1)}s` : undefined,
          });
        },
      });
    } catch (renderError) {
      logger.error('Video rendering threw an exception', { error: renderError });

      return JSON.stringify({
        success: false,
        error: 'Video rendering failed',
        details: renderError instanceof Error ? renderError.message : String(renderError),
        suggestion: 'Check template structure, ensure all media URLs are accessible, and verify system resources.',
      }, null, 2);
    }

    if (!result.success) {
      logger.error('Video rendering returned failure', { error: result.error });

      return JSON.stringify({
        success: false,
        error: result.error || 'Video rendering failed',
        details: 'The renderer completed but reported a failure status.',
      }, null, 2);
    }

    logger.info('Video render complete', {
      outputPath: result.outputPath,
      duration: result.duration,
      fileSize: formatFileSize(result.fileSize),
      renderTime: `${(result.renderTime / 1000).toFixed(2)}s`,
    });

    // Post-render validation to detect black scenes
    logger.info('Running post-render validation');
    const postValidation = await validateRenderedVideo(
      result.outputPath,
      result.duration,
      result.fps || 30
    );

    if (postValidation.hasIssues) {
      logger.warn('Post-render validation detected issues', {
        blackScenes: postValidation.blackScenes,
        lowQuality: postValidation.lowQuality,
        suggestions: postValidation.suggestions,
      });
    }

    const response: any = {
      success: true,
      message: `Video rendered successfully to ${result.outputPath}`,
      output: {
        path: result.outputPath,
        duration: result.duration,
        fileSize: result.fileSize,
        fileSizeFormatted: formatFileSize(result.fileSize),
        width: result.width,
        height: result.height,
        frameCount: result.frameCount,
        renderTimeMs: result.renderTime, // Exact render time in milliseconds (for cost computation)
        renderTime: result.renderTime, // Backwards compatibility
        renderTimeFormatted: `${(result.renderTime / 1000).toFixed(2)}s`,
      },
    };

    // Add path correction info if applicable
    if (pathWasCorrected) {
      response.pathInfo = {
        corrected: true,
        message: pathCorrectionMessage,
        actualPath: result.outputPath,
        note: 'File saved to your macOS user directory. You can find it in Finder.',
      };
    }

    // Add validation warnings if any issues detected
    if (postValidation.hasIssues) {
      response.validation = {
        hasIssues: true,
        blackScenes: postValidation.blackScenes.length > 0 ? {
          frames: postValidation.blackScenes,
          message: '⚠️ BLACK SCENES DETECTED - Video may have invisible content',
        } : undefined,
        lowQuality: postValidation.lowQuality ? {
          message: 'Video file size is smaller than expected - may indicate compression issues',
        } : undefined,
        suggestions: postValidation.suggestions,
      };

      // Update message to alert about issues
      response.message = `Video rendered but validation detected issues. Check validation field for details. ${result.outputPath}`;
    }

    return JSON.stringify(response, null, 2);
  } catch (error) {
    logger.error('Video render failed', { error });

    const errorMessage = error instanceof Error ? error.message : String(error);

    // Check for common errors and provide helpful messages
    if (errorMessage.includes('ENOENT') || errorMessage.includes('no such file')) {
      return JSON.stringify({
        success: false,
        error: 'Output directory does not exist. Please create the directory first or use an absolute path.',
        details: errorMessage,
      }, null, 2);
    }

    if (errorMessage.includes('ffmpeg')) {
      return JSON.stringify({
        success: false,
        error: 'FFmpeg not found. Please install FFmpeg to render videos.',
        details: errorMessage,
      }, null, 2);
    }

    if (error instanceof z.ZodError) {
      const validationErrors = error.errors.map(e => ({
        path: e.path.join('.'),
        message: e.message,
        received: (e as any).received,
      }));

      return JSON.stringify({
        success: false,
        error: 'Invalid input parameters. Please fix the errors below and try again.',
        validationErrors,
        help: {
          outputPath: 'Must be a string path where the video file will be saved',
          format: 'Must be one of: mp4, webm, mov, gif',
          quality: 'Must be one of: draft, standard, high, lossless',
          template: 'Must be a valid Rendervid template object with name, output, and composition',
          inputs: 'Optional object mapping input keys to values',
        },
      }, null, 2);
    }

    return JSON.stringify({
      success: false,
      error: errorMessage,
    }, null, 2);
  }
}

/**
 * Detect if template has media layers (image, video, audio)
 * Used to auto-adjust renderWaitTime for proper media loading
 */
function detectMediaLayers(template: any): boolean {
  if (!template?.composition?.scenes) return false;

  for (const scene of template.composition.scenes) {
    if (!scene.layers) continue;

    for (const layer of scene.layers) {
      if (layer.type === 'image' || layer.type === 'video' || layer.type === 'audio') {
        return true;
      }
    }
  }

  return false;
}

function getCodecSettings(format: string, quality: string): { codec: 'libx264' | 'libx265' | 'libvpx' | 'libvpx-vp9' | 'prores'; quality: number } {
  // Map format and quality to codec settings
  const codecMap: Record<string, 'libx264' | 'libx265' | 'libvpx' | 'libvpx-vp9' | 'prores'> = {
    mp4: 'libx264',
    webm: 'libvpx-vp9',
    mov: 'libx264',
    gif: 'libx264', // GIF not directly supported by these codecs, will need special handling
  };

  const qualityMap: Record<string, number> = {
    draft: 28,      // Lower quality, faster
    standard: 23,   // Balanced
    high: 18,       // Higher quality
    lossless: 0,    // Lossless
  };

  return {
    codec: codecMap[format] || 'libx264',
    quality: qualityMap[quality] || 23,
  };
}

function formatFileSize(bytes: number | undefined): string {
  if (!bytes) return '0 B';

  const units = ['B', 'KB', 'MB', 'GB'];
  let size = bytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${size.toFixed(2)} ${units[unitIndex]}`;
}

function generateValidationSuggestions(errors: Array<{ path?: string; message: string }>): string[] {
  const suggestions: string[] = [];

  for (const error of errors) {
    const path = error.path || '';
    const message = error.message.toLowerCase();

    // Check for duplicate layer IDs
    if (message.includes('duplicate') || message.includes('unique') || message.includes('id')) {
      suggestions.push('DUPLICATE LAYER IDS: Each layer must have a unique ID within ALL scenes. Use descriptive IDs like "scene1-background", "scene2-background" instead of just "background".');
    }

    // Check for unused inputs
    if (message.includes('unused') || message.includes('not used')) {
      suggestions.push('UNUSED INPUTS: If you\'re using {{variableName}} in props, this warning is a false positive and can be ignored. Otherwise, either add {{variableName}} references in layer props or remove unused inputs from the inputs array.');
    }

    // Provide helpful suggestions based on common errors
    if (message.includes('required') && path.includes('output')) {
      suggestions.push('Ensure output object has required properties: type, width, height. For video output, also include fps and duration.');
    }

    if (message.includes('composition')) {
      suggestions.push('Check that composition object exists and has a scenes array with at least one scene.');
    }

    if (message.includes('scene') && message.includes('frame')) {
      suggestions.push('Verify scene frame ranges: startFrame must be less than endFrame. Calculate endFrame = fps * duration for the scene.');
    }

    if (message.includes('layer')) {
      suggestions.push('Each layer must have: id (unique string), type (text/image/shape/video/audio/custom), position {x, y}, and size {width, height}.');
    }

    if (message.includes('animation')) {
      suggestions.push('Animation structure: type (entrance/exit/emphasis), effect (fadeIn/slideUp/etc), startFrame, endFrame, easing (optional).');
    }

    if (message.includes('input') && !message.includes('invalid')) {
      suggestions.push('Input definitions need: key (string), type (string/number/boolean/color), label (string), and optional default value.');
    }

    if (message.includes('fps')) {
      suggestions.push('FPS must be a positive integer, typically 24, 30, or 60 for video output.');
    }

    if (message.includes('duration')) {
      suggestions.push('Duration must be a positive number in seconds. Total frames = fps * duration.');
    }

    if (message.includes('width') || message.includes('height')) {
      suggestions.push('Width and height must be positive integers (pixels). Common resolutions: 1920x1080 (Full HD), 1280x720 (HD), 3840x2160 (4K).');
    }

    if (message.includes('position')) {
      suggestions.push('Position requires x and y coordinates (numbers). Origin (0,0) is top-left corner.');
    }

    if (message.includes('size')) {
      suggestions.push('Size requires width and height (positive numbers). Dimensions are in pixels.');
    }

    if (message.includes('color')) {
      suggestions.push('Color formats: "#RRGGBB" hex, "rgb(r,g,b)", "rgba(r,g,b,a)", or CSS color names.');
    }

    if (message.includes('font')) {
      suggestions.push('Use built-in fonts (Inter, Roboto, etc.) or any Google Fonts name. Set fontFamily property on text layers.');
    }

    if (message.includes('src') || message.includes('url')) {
      suggestions.push('Image/video src must be a valid URL (http/https) or local file path. Ensure the resource is accessible.');
    }
  }

  // Remove duplicates
  return [...new Set(suggestions)];
}
