import { ComponentRegistry } from './ComponentRegistry';
import {
  Text,
  GradientText,
  Image,
  Shape,
  Container,
  Counter,
  ProgressBar,
  Typewriter,
  Fade,
  Slide,
  Scale,
  Rotate,
} from '../components';
import { AuroraBackground, WaveBackground } from '../backgrounds';
import { SVGDrawing, TypewriterEffect, GlitchEffect, MetaBalls, ParticleSystem, LottieAnimation, ThreeScene } from '../effects';

/**
 * Create and return the default component registry with all built-in components
 *
 * @returns A ComponentRegistry instance with all built-in components registered
 *
 * @example
 * ```typescript
 * import { createDefaultRegistry } from '@rendervid/components';
 *
 * const registry = createDefaultRegistry();
 * const TextComponent = registry.get('text');
 * ```
 */
export function createDefaultRegistry(): ComponentRegistry {
  const registry = new ComponentRegistry();

  // Basic components
  registry.register(Text, {
    id: 'text',
    name: 'Text',
    description: 'Renders styled text with customizable typography options',
    category: 'basic',
    tags: ['text', 'typography', 'label'],
    animated: false,
    exampleProps: {
      text: 'Hello World',
      fontSize: 32,
      color: '#ffffff',
      fontFamily: 'Arial',
    },
    version: '0.1.0',
  });

  registry.register(GradientText, {
    id: 'gradient-text',
    name: 'Gradient Text',
    description: 'Renders text with gradient fill colors',
    category: 'basic',
    tags: ['text', 'typography', 'gradient', 'colorful'],
    animated: false,
    exampleProps: {
      text: 'Gradient Text',
      colors: ['#ff0080', '#7928ca', '#4c00ff'],
      fontSize: 48,
      angle: 45,
    },
    version: '0.1.0',
  });

  registry.register(Image, {
    id: 'image',
    name: 'Image',
    description: 'Displays an image with various fit and positioning options',
    category: 'media',
    tags: ['image', 'media', 'photo', 'picture'],
    animated: false,
    exampleProps: {
      src: 'https://example.com/image.jpg',
      fit: 'cover',
      borderRadius: 8,
    },
    version: '0.1.0',
  });

  registry.register(Shape, {
    id: 'shape',
    name: 'Shape',
    description: 'Renders geometric shapes (rectangle, circle, triangle, star, polygon)',
    category: 'basic',
    tags: ['shape', 'geometry', 'graphics', 'svg'],
    animated: false,
    exampleProps: {
      shape: 'circle',
      fill: '#ff0080',
      style: { width: 100, height: 100 },
    },
    version: '0.1.0',
  });

  registry.register(Container, {
    id: 'container',
    name: 'Container',
    description: 'A flexible container for layout with flexbox support',
    category: 'basic',
    tags: ['layout', 'container', 'wrapper', 'flex'],
    animated: false,
    exampleProps: {
      width: 400,
      height: 300,
      backgroundColor: '#1a1a1a',
      padding: 20,
      borderRadius: 8,
    },
    version: '0.1.0',
  });

  // Animated components
  registry.register(Counter, {
    id: 'counter',
    name: 'Counter',
    description: 'Animates a number from one value to another',
    category: 'animated',
    tags: ['counter', 'number', 'animation', 'numeric'],
    animated: true,
    exampleProps: {
      from: 0,
      to: 100,
      frame: 0,
      totalFrames: 60,
      decimals: 0,
      suffix: '%',
    },
    version: '0.1.0',
  });

  registry.register(ProgressBar, {
    id: 'progress-bar',
    name: 'Progress Bar',
    description: 'Displays an animated progress bar',
    category: 'animated',
    tags: ['progress', 'bar', 'loading', 'indicator'],
    animated: true,
    exampleProps: {
      value: 0.75,
      frame: 0,
      totalFrames: 60,
      color: '#00ff00',
      height: 20,
      animated: true,
    },
    version: '0.1.0',
  });

  registry.register(Typewriter, {
    id: 'typewriter',
    name: 'Typewriter',
    description: 'Animates text with a typewriter effect',
    category: 'animated',
    tags: ['typewriter', 'text', 'typing', 'animation'],
    animated: true,
    exampleProps: {
      text: 'Hello, World!',
      frame: 0,
      totalFrames: 60,
      speed: 2,
      showCursor: true,
    },
    version: '0.1.0',
  });

  // Animation wrappers
  registry.register(Fade, {
    id: 'fade',
    name: 'Fade',
    description: 'Fades content in, out, or both',
    category: 'animation-wrapper',
    tags: ['fade', 'opacity', 'animation', 'transition'],
    animated: true,
    exampleProps: {
      direction: 'in',
      duration: 30,
      delay: 0,
      frame: 0,
    },
    version: '0.1.0',
  });

  registry.register(Slide, {
    id: 'slide',
    name: 'Slide',
    description: 'Slides content in from a direction',
    category: 'animation-wrapper',
    tags: ['slide', 'move', 'animation', 'transition'],
    animated: true,
    exampleProps: {
      from: 'left',
      distance: 100,
      duration: 30,
      frame: 0,
      fade: true,
    },
    version: '0.1.0',
  });

  registry.register(Scale, {
    id: 'scale',
    name: 'Scale',
    description: 'Scales content with animation',
    category: 'animation-wrapper',
    tags: ['scale', 'zoom', 'animation', 'transform'],
    animated: true,
    exampleProps: {
      from: 0,
      to: 1,
      duration: 30,
      frame: 0,
    },
    version: '0.1.0',
  });

  registry.register(Rotate, {
    id: 'rotate',
    name: 'Rotate',
    description: 'Rotates content with animation',
    category: 'animation-wrapper',
    tags: ['rotate', 'spin', 'animation', 'transform'],
    animated: true,
    exampleProps: {
      from: 0,
      to: 360,
      duration: 60,
      frame: 0,
    },
    version: '0.1.0',
  });

  // Background components
  registry.register(AuroraBackground, {
    id: 'aurora-background',
    name: 'Aurora Background',
    description: 'Flowing gradient aurora/northern lights effect with organic motion',
    category: 'background',
    tags: ['aurora', 'background', 'animated', 'gradient', 'northern-lights', 'glow'],
    animated: true,
    exampleProps: {
      frame: 0,
      totalFrames: 300,
      fps: 30,
      colors: ['#667eea', '#764ba2', '#f093fb', '#84fab0', '#8fd3f4'],
      speed: 1,
      blur: 40,
      opacity: 0.5,
      width: '100%',
      height: '100%',
    },
    version: '0.1.0',
  });

  registry.register(WaveBackground, {
    id: 'wave-background',
    name: 'Wave Background',
    description: 'Animated fluid wave background with customizable layers and colors',
    category: 'background',
    tags: ['wave', 'background', 'animated', 'fluid', 'ocean', 'water'],
    animated: true,
    exampleProps: {
      frame: 0,
      fps: 30,
      colors: ['#667eea', '#764ba2', '#f093fb'],
      waveCount: 3,
      amplitude: 50,
      frequency: 0.02,
      speed: 0.5,
      direction: 'bottom',
      opacity: 1,
    },
    version: '0.1.0',
  });

  // Effect components
  registry.register(SVGDrawing, {
    id: 'svg-drawing',
    name: 'SVG Drawing',
    description: 'Animates SVG path drawing with stroke-dasharray (like Vivus.js)',
    category: 'effect',
    tags: ['svg', 'drawing', 'animation', 'path', 'stroke', 'vivus', 'sketch'],
    animated: true,
    exampleProps: {
      duration: 2,
      mode: 'sync',
      strokeColor: '#00ff00',
      strokeWidth: 2,
      delay: 0.1,
      easing: 'ease-in-out',
      frame: 0,
      fps: 30,
    },
    version: '0.1.0',
  });

  registry.register(TypewriterEffect, {
    id: 'typewriter-effect',
    name: 'Typewriter Effect',
    description: 'Enhanced typewriter effect with cursor, backspace, word-by-word mode, and sound pulse',
    category: 'effect',
    tags: ['typewriter', 'typing', 'text', 'animation', 'cursor', 'effect'],
    animated: true,
    exampleProps: {
      text: 'Hello, World!',
      frame: 0,
      fps: 30,
      speed: 'normal',
      cursor: true,
      cursorStyle: 'bar',
      cursorColor: '#00ff00',
      mode: 'characters',
      startDelay: 0,
      loop: false,
      fontSize: 24,
      color: '#ffffff',
      fontFamily: 'monospace',
      cursorBlinkRate: 15,
      soundPulse: false,
    },
    version: '0.1.0',
  });


  registry.register(ParticleSystem, {
    id: 'particle-system',
    name: 'Particle System',
    description: 'Frame-aware particle system with multiple types, directions, and effects',
    category: 'effect',
    tags: ['particles', 'animation', 'effects', 'physics', 'connections'],
    animated: true,
    exampleProps: {
      frame: 0,
      fps: 30,
      count: 50,
      type: 'circle',
      color: '#ffffff',
      size: 3,
      speed: 2,
      direction: 'up',
      connections: true,
      connectionDistance: 100,
      width: 1920,
      height: 1080,
    },
    version: '0.1.0',
  });

  registry.register(GlitchEffect, {
    id: 'glitch-effect',
    name: 'Glitch Effect',
    description: 'Creates digital distortion effects with multiple glitch types',
    category: 'effect',
    tags: ['glitch', 'distortion', 'digital', 'vhs', 'corruption', 'effect', 'animation'],
    animated: true,
    exampleProps: {
      type: 'rgb-split',
      intensity: 0.5,
      frequency: 0.1,
      duration: 100,
      frame: 0,
      fps: 30,
    },
    version: '0.1.0',
  });

  registry.register(LottieAnimation, {
    id: 'lottie-animation',
    name: 'Lottie Animation',
    description: 'Renders Lottie/After Effects animations with frame-accurate playback',
    category: 'effect',
    tags: ['lottie', 'after-effects', 'animation', 'json', 'bodymovin'],
    animated: true,
    exampleProps: {
      src: 'https://assets.example.com/animation.json',
      frame: 0,
      totalFrames: 120,
      speed: 1,
      loop: true,
      width: '100%',
      height: '100%',
    },
    version: '0.1.0',
  });

  registry.register(MetaBalls, {
    id: 'metaballs',
    name: 'MetaBalls',
    description: 'Smooth morphing blob animations that merge together when close',
    category: 'effect',
    tags: ['metaballs', 'blobs', 'morphing', 'fluid', 'organic', 'animation', 'effects'],
    animated: true,
    exampleProps: {
      count: 5,
      colors: ['#ff0080', '#7928ca', '#4c00ff'],
      size: 80,
      speed: 1,
      blur: 40,
      movement: 'orbit',
      backgroundColor: '#000000',
      frame: 0,
      totalFrames: 300,
      fps: 30,
      width: '100%',
      height: '100%',
    },
    version: '0.1.0',
  });

  registry.register(ThreeScene, {
    id: 'three-scene',
    name: 'Three Scene',
    description: '3D scene renderer with basic geometries (box, sphere, torus, plane) using CSS 3D transforms',
    category: 'effect',
    tags: ['3d', '3d-rendering', 'geometry', 'scene', 'box', 'sphere', 'torus', 'animation'],
    animated: true,
    exampleProps: {
      geometry: 'box',
      color: '#4c00ff',
      rotation: { y: 1 },
      scale: 1,
      frame: 0,
      fps: 30,
      cameraDistance: 500,
      lighting: 'directional',
      width: 400,
      height: 400,
    },
    version: '0.1.0',
  });

  return registry;
}

/**
 * Default global component registry instance
 *
 * This is a singleton instance that is created on first access.
 * You can use this directly or create your own registry instance.
 *
 * @example
 * ```typescript
 * import { defaultRegistry } from '@rendervid/components';
 *
 * // Get a component
 * const Text = defaultRegistry.get('text');
 *
 * // List all animated components
 * const animated = defaultRegistry.list({ animated: true });
 * ```
 */
let defaultRegistryInstance: ComponentRegistry | null = null;

export function getDefaultRegistry(): ComponentRegistry {
  if (!defaultRegistryInstance) {
    defaultRegistryInstance = createDefaultRegistry();
  }
  return defaultRegistryInstance;
}

/**
 * Reset the default registry
 *
 * This will clear the cached default registry instance,
 * forcing it to be recreated on next access.
 * Useful for testing or if you need to reinitialize.
 *
 * @example
 * ```typescript
 * import { resetDefaultRegistry } from '@rendervid/components';
 *
 * resetDefaultRegistry();
 * ```
 */
export function resetDefaultRegistry(): void {
  defaultRegistryInstance = null;
}

// Export the default registry as a getter for convenience
export const defaultRegistry = getDefaultRegistry();
