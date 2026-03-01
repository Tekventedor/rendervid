/**
 * Human-curated descriptions, tips, and recommendations for documentation.
 * This is the single maintenance file for authored content.
 * Everything else is derived from TypeScript types and runtime registries.
 */

/** Layer type one-line descriptions */
export const LAYER_DESCRIPTIONS: Record<string, string> = {
  text: 'Rich text with typography, fonts, alignment, spans, and text effects',
  image: 'Display images with fit modes (cover, contain, fill)',
  video: 'Video playback with timing, speed, and volume controls',
  shape: 'Geometric shapes: rectangle, ellipse, polygon, star, SVG path',
  audio: 'Audio playback with effects chain, volume envelope, and stereo pan',
  group: 'Container for organizing and clipping child layers',
  lottie: 'Lottie/Bodymovin JSON animations with speed and direction control',
  gif: 'Animated GIF images with frame-synced playback',
  caption: 'Subtitles/captions with SRT/VTT parsing and timed display',
  canvas: 'Programmatic 2D drawing with paths, gradients, shapes, and text',
  three: '3D scenes with cameras, lights, meshes, materials, and shaders',
  custom: 'Custom React components for advanced effects and animations',
};

/** Transition type descriptions */
export const TRANSITION_DESCRIPTIONS: Record<string, string> = {
  cut: 'Instant switch between scenes (no animation)',
  fade: 'Crossfade between scenes',
  slide: 'Slide new scene in from a direction',
  wipe: 'Wipe new scene across from a direction',
  zoom: 'Zoom in or out to reveal new scene',
  rotate: 'Rotate to reveal new scene',
  flip: '3D flip effect between scenes',
  blur: 'Blur transition between scenes',
  circle: 'Circular reveal/iris effect',
  push: 'Push old scene out while new scene enters',
  crosszoom: 'Cross zoom effect between scenes',
  glitch: 'Digital glitch effect transition',
  dissolve: 'Dissolve/pixelate between scenes',
  cube: '3D cube rotation between scenes',
  swirl: 'Swirl/spiral effect between scenes',
  'diagonal-wipe': 'Diagonal wipe across the screen',
  iris: 'Iris in/out circular transition',
};

/** Filter type descriptions with value info */
export const FILTER_DESCRIPTIONS: Record<string, { description: string; unit: string; default: string; range: string }> = {
  blur: { description: 'Gaussian blur', unit: 'pixels', default: '0', range: '0+' },
  brightness: { description: 'Brightness adjustment', unit: 'multiplier', default: '1', range: '0+' },
  contrast: { description: 'Contrast adjustment', unit: 'multiplier', default: '1', range: '0+' },
  grayscale: { description: 'Convert to grayscale', unit: 'percentage', default: '0', range: '0-100' },
  'hue-rotate': { description: 'Rotate hue', unit: 'degrees', default: '0', range: '0-360' },
  invert: { description: 'Invert colors', unit: 'percentage', default: '0', range: '0-100' },
  opacity: { description: 'Layer opacity via filter', unit: 'multiplier', default: '1', range: '0-1' },
  saturate: { description: 'Color saturation', unit: 'multiplier', default: '1', range: '0+' },
  sepia: { description: 'Sepia tone effect', unit: 'percentage', default: '0', range: '0-100' },
  'drop-shadow': { description: 'Drop shadow effect', unit: 'CSS shadow string', default: 'none', range: 'N/A' },
};

/** Easing category descriptions */
export const EASING_CATEGORY_DESCRIPTIONS: Record<string, string> = {
  linear: 'Constant speed, no acceleration',
  quad: 'Quadratic curve - gentle acceleration/deceleration',
  cubic: 'Cubic curve - smooth and natural (most commonly used)',
  quart: 'Quartic curve - strong acceleration/deceleration',
  quint: 'Quintic curve - very strong acceleration/deceleration',
  sine: 'Sinusoidal curve - gentle and flowing',
  expo: 'Exponential curve - dramatic acceleration/deceleration',
  circ: 'Circular curve - natural and smooth',
  back: 'Overshoot and return - anticipation/follow-through',
  elastic: 'Spring/elastic physics - bouncy oscillation',
  bounce: 'Bouncing ball physics',
};

/** Easing recommendations for common use cases */
export const EASING_RECOMMENDATIONS: Record<string, string> = {
  'entrance-animations': 'easeOutCubic (smooth) or easeOutBack (playful)',
  'exit-animations': 'easeInCubic',
  'emphasis-animations': 'easeInOutCubic or easeInOutSine',
  'playful-ui': 'easeOutBack or easeOutBounce',
  'smooth-professional': 'easeOutCubic or easeOutQuad',
  'mechanical-motion': 'linear',
  'dramatic-effect': 'easeOutExpo or easeInExpo',
};

/** Tips for common topics */
export const TIPS = {
  template: [
    'Always include "inputs": [] even for static templates with no variables',
    'Duration is in seconds. Frame counts = fps x duration',
    'Use validate_template before rendering to catch errors early',
  ],
  scene: [
    'Scenes should not overlap in frame ranges',
    'Transition duration is subtracted from the gap between scenes',
    'Use backgroundColor on scenes for solid backgrounds',
  ],
  layer: [
    'All layers require id, type, position, and size',
    'Layer IDs must be unique across ALL scenes',
    'position is the top-left corner, not center',
    'Use "from" and "duration" (in frames) to control when layers appear within a scene',
    'Animations delay/duration are in FRAMES (30 frames = 1 second at 30fps)',
  ],
  animations: [
    'Timing is in FRAMES, not seconds. At 30fps: 30 frames = 1 second',
    'Use entrance + exit animations together for smooth scene transitions',
    'easeOutCubic is the best default for entrance animations',
    'Emphasis animations can loop: set loop: -1 for infinite',
  ],
  text: [
    'Use spans[] for rich text with mixed styles within one text layer',
    'Set maxLines + overflow: "ellipsis" to truncate long text',
    'verticalAlign: "middle" centers text vertically in the layer',
  ],
  video: [
    'Set muted: true for background videos',
    'Match scene duration to video duration to avoid loop flash',
    'Use startTime to skip to a specific point in the video',
  ],
  custom: [
    'Use React.createElement(), NOT JSX syntax',
    'Components receive frame, fps, sceneDuration, layerSize automatically',
    'No imports, exports, or side effects allowed in inline code',
    'Components must be deterministic: same frame = same output',
  ],
  motionBlur: [
    'Render time = base time x sample count',
    'Use adaptive: true to save 30-50% on mixed content',
    'Use preview: true during development for fast iteration',
    'For long videos with motion blur, use start_render_async',
  ],
};
