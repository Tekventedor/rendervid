import type { Keyframe, AnimationPreset, Size } from '../types';

/**
 * Preset animation generator options.
 */
export interface PresetOptions {
  /** Animation duration in frames */
  duration: number;
  /** Easing function */
  easing?: string;
  /** Layer size (for calculating offsets) */
  layerSize?: Size;
  /** Canvas size (for calculating offsets) */
  canvasSize?: Size;
}

/**
 * Preset animation definition.
 */
export interface PresetDefinition {
  /** Preset name */
  name: AnimationPreset;
  /** Animation category */
  type: 'entrance' | 'exit' | 'emphasis';
  /** Default duration in frames */
  defaultDuration: number;
  /** Default easing */
  defaultEasing: string;
  /** Generate keyframes for this animation */
  generate: (options: PresetOptions) => Keyframe[];
}

// ═══════════════════════════════════════════════════════════════
// ENTRANCE ANIMATIONS
// ═══════════════════════════════════════════════════════════════

const fadeIn: PresetDefinition = {
  name: 'fadeIn',
  type: 'entrance',
  defaultDuration: 30,
  defaultEasing: 'easeOutCubic',
  generate: ({ duration, easing = 'easeOutCubic' }) => [
    { frame: 0, properties: { opacity: 0 }, easing },
    { frame: duration, properties: { opacity: 1 } },
  ],
};

const fadeInUp: PresetDefinition = {
  name: 'fadeInUp',
  type: 'entrance',
  defaultDuration: 30,
  defaultEasing: 'easeOutCubic',
  generate: ({ duration, easing = 'easeOutCubic' }) => [
    { frame: 0, properties: { opacity: 0, y: 50 }, easing },
    { frame: duration, properties: { opacity: 1, y: 0 } },
  ],
};

const fadeInDown: PresetDefinition = {
  name: 'fadeInDown',
  type: 'entrance',
  defaultDuration: 30,
  defaultEasing: 'easeOutCubic',
  generate: ({ duration, easing = 'easeOutCubic' }) => [
    { frame: 0, properties: { opacity: 0, y: -50 }, easing },
    { frame: duration, properties: { opacity: 1, y: 0 } },
  ],
};

const fadeInLeft: PresetDefinition = {
  name: 'fadeInLeft',
  type: 'entrance',
  defaultDuration: 30,
  defaultEasing: 'easeOutCubic',
  generate: ({ duration, easing = 'easeOutCubic' }) => [
    { frame: 0, properties: { opacity: 0, x: -50 }, easing },
    { frame: duration, properties: { opacity: 1, x: 0 } },
  ],
};

const fadeInRight: PresetDefinition = {
  name: 'fadeInRight',
  type: 'entrance',
  defaultDuration: 30,
  defaultEasing: 'easeOutCubic',
  generate: ({ duration, easing = 'easeOutCubic' }) => [
    { frame: 0, properties: { opacity: 0, x: 50 }, easing },
    { frame: duration, properties: { opacity: 1, x: 0 } },
  ],
};

const slideInUp: PresetDefinition = {
  name: 'slideInUp',
  type: 'entrance',
  defaultDuration: 30,
  defaultEasing: 'easeOutCubic',
  generate: ({ duration, easing = 'easeOutCubic', canvasSize }) => {
    const offset = canvasSize?.height ?? 500;
    return [
      { frame: 0, properties: { y: offset }, easing },
      { frame: duration, properties: { y: 0 } },
    ];
  },
};

const slideInDown: PresetDefinition = {
  name: 'slideInDown',
  type: 'entrance',
  defaultDuration: 30,
  defaultEasing: 'easeOutCubic',
  generate: ({ duration, easing = 'easeOutCubic', canvasSize }) => {
    const offset = -(canvasSize?.height ?? 500);
    return [
      { frame: 0, properties: { y: offset }, easing },
      { frame: duration, properties: { y: 0 } },
    ];
  },
};

const slideInLeft: PresetDefinition = {
  name: 'slideInLeft',
  type: 'entrance',
  defaultDuration: 30,
  defaultEasing: 'easeOutCubic',
  generate: ({ duration, easing = 'easeOutCubic', canvasSize }) => {
    const offset = -(canvasSize?.width ?? 500);
    return [
      { frame: 0, properties: { x: offset }, easing },
      { frame: duration, properties: { x: 0 } },
    ];
  },
};

const slideInRight: PresetDefinition = {
  name: 'slideInRight',
  type: 'entrance',
  defaultDuration: 30,
  defaultEasing: 'easeOutCubic',
  generate: ({ duration, easing = 'easeOutCubic', canvasSize }) => {
    const offset = canvasSize?.width ?? 500;
    return [
      { frame: 0, properties: { x: offset }, easing },
      { frame: duration, properties: { x: 0 } },
    ];
  },
};

const scaleIn: PresetDefinition = {
  name: 'scaleIn',
  type: 'entrance',
  defaultDuration: 30,
  defaultEasing: 'easeOutCubic',
  generate: ({ duration, easing = 'easeOutCubic' }) => [
    { frame: 0, properties: { opacity: 0, scaleX: 0, scaleY: 0 }, easing },
    { frame: duration, properties: { opacity: 1, scaleX: 1, scaleY: 1 } },
  ],
};

const zoomIn: PresetDefinition = {
  name: 'zoomIn',
  type: 'entrance',
  defaultDuration: 30,
  defaultEasing: 'easeOutCubic',
  generate: ({ duration, easing = 'easeOutCubic' }) => [
    { frame: 0, properties: { opacity: 0, scaleX: 0.3, scaleY: 0.3 }, easing },
    { frame: duration, properties: { opacity: 1, scaleX: 1, scaleY: 1 } },
  ],
};

const rotateIn: PresetDefinition = {
  name: 'rotateIn',
  type: 'entrance',
  defaultDuration: 30,
  defaultEasing: 'easeOutCubic',
  generate: ({ duration, easing = 'easeOutCubic' }) => [
    { frame: 0, properties: { opacity: 0, rotation: -180 }, easing },
    { frame: duration, properties: { opacity: 1, rotation: 0 } },
  ],
};

const bounceIn: PresetDefinition = {
  name: 'bounceIn',
  type: 'entrance',
  defaultDuration: 45,
  defaultEasing: 'easeOutBounce',
  generate: ({ duration, easing = 'easeOutBounce' }) => [
    { frame: 0, properties: { opacity: 0, scaleX: 0.3, scaleY: 0.3 }, easing },
    { frame: duration, properties: { opacity: 1, scaleX: 1, scaleY: 1 } },
  ],
};

// ═══════════════════════════════════════════════════════════════
// EXIT ANIMATIONS
// ═══════════════════════════════════════════════════════════════

const fadeOut: PresetDefinition = {
  name: 'fadeOut',
  type: 'exit',
  defaultDuration: 30,
  defaultEasing: 'easeInCubic',
  generate: ({ duration, easing = 'easeInCubic' }) => [
    { frame: 0, properties: { opacity: 1 }, easing },
    { frame: duration, properties: { opacity: 0 } },
  ],
};

const fadeOutUp: PresetDefinition = {
  name: 'fadeOutUp',
  type: 'exit',
  defaultDuration: 30,
  defaultEasing: 'easeInCubic',
  generate: ({ duration, easing = 'easeInCubic' }) => [
    { frame: 0, properties: { opacity: 1, y: 0 }, easing },
    { frame: duration, properties: { opacity: 0, y: -50 } },
  ],
};

const fadeOutDown: PresetDefinition = {
  name: 'fadeOutDown',
  type: 'exit',
  defaultDuration: 30,
  defaultEasing: 'easeInCubic',
  generate: ({ duration, easing = 'easeInCubic' }) => [
    { frame: 0, properties: { opacity: 1, y: 0 }, easing },
    { frame: duration, properties: { opacity: 0, y: 50 } },
  ],
};

const scaleOut: PresetDefinition = {
  name: 'scaleOut',
  type: 'exit',
  defaultDuration: 30,
  defaultEasing: 'easeInCubic',
  generate: ({ duration, easing = 'easeInCubic' }) => [
    { frame: 0, properties: { opacity: 1, scaleX: 1, scaleY: 1 }, easing },
    { frame: duration, properties: { opacity: 0, scaleX: 0, scaleY: 0 } },
  ],
};

const zoomOut: PresetDefinition = {
  name: 'zoomOut',
  type: 'exit',
  defaultDuration: 30,
  defaultEasing: 'easeInCubic',
  generate: ({ duration, easing = 'easeInCubic' }) => [
    { frame: 0, properties: { opacity: 1, scaleX: 1, scaleY: 1 }, easing },
    { frame: duration, properties: { opacity: 0, scaleX: 0.3, scaleY: 0.3 } },
  ],
};

// ═══════════════════════════════════════════════════════════════
// EMPHASIS ANIMATIONS
// ═══════════════════════════════════════════════════════════════

const pulse: PresetDefinition = {
  name: 'pulse',
  type: 'emphasis',
  defaultDuration: 30,
  defaultEasing: 'easeInOutSine',
  generate: ({ duration, easing = 'easeInOutSine' }) => [
    { frame: 0, properties: { scaleX: 1, scaleY: 1 }, easing },
    { frame: duration / 2, properties: { scaleX: 1.1, scaleY: 1.1 }, easing },
    { frame: duration, properties: { scaleX: 1, scaleY: 1 } },
  ],
};

const shake: PresetDefinition = {
  name: 'shake',
  type: 'emphasis',
  defaultDuration: 30,
  defaultEasing: 'linear',
  generate: ({ duration }) => {
    const step = duration / 10;
    return [
      { frame: 0, properties: { x: 0 } },
      { frame: step, properties: { x: -10 } },
      { frame: step * 2, properties: { x: 10 } },
      { frame: step * 3, properties: { x: -10 } },
      { frame: step * 4, properties: { x: 10 } },
      { frame: step * 5, properties: { x: -10 } },
      { frame: step * 6, properties: { x: 10 } },
      { frame: step * 7, properties: { x: -10 } },
      { frame: step * 8, properties: { x: 10 } },
      { frame: step * 9, properties: { x: -5 } },
      { frame: duration, properties: { x: 0 } },
    ];
  },
};

const bounce: PresetDefinition = {
  name: 'bounce',
  type: 'emphasis',
  defaultDuration: 30,
  defaultEasing: 'easeOutBounce',
  generate: ({ duration, easing = 'easeOutBounce' }) => [
    { frame: 0, properties: { y: 0 }, easing },
    { frame: duration / 3, properties: { y: -30 }, easing },
    { frame: duration, properties: { y: 0 } },
  ],
};

const spin: PresetDefinition = {
  name: 'spin',
  type: 'emphasis',
  defaultDuration: 30,
  defaultEasing: 'linear',
  generate: ({ duration, easing = 'linear' }) => [
    { frame: 0, properties: { rotation: 0 }, easing },
    { frame: duration, properties: { rotation: 360 } },
  ],
};

const heartbeat: PresetDefinition = {
  name: 'heartbeat',
  type: 'emphasis',
  defaultDuration: 30,
  defaultEasing: 'easeInOutSine',
  generate: ({ duration, easing = 'easeInOutSine' }) => [
    { frame: 0, properties: { scaleX: 1, scaleY: 1 }, easing },
    { frame: duration * 0.14, properties: { scaleX: 1.3, scaleY: 1.3 }, easing },
    { frame: duration * 0.28, properties: { scaleX: 1, scaleY: 1 }, easing },
    { frame: duration * 0.42, properties: { scaleX: 1.3, scaleY: 1.3 }, easing },
    { frame: duration * 0.7, properties: { scaleX: 1, scaleY: 1 } },
    { frame: duration, properties: { scaleX: 1, scaleY: 1 } },
  ],
};

const float: PresetDefinition = {
  name: 'float',
  type: 'emphasis',
  defaultDuration: 60,
  defaultEasing: 'easeInOutSine',
  generate: ({ duration, easing = 'easeInOutSine' }) => [
    { frame: 0, properties: { y: 0 }, easing },
    { frame: duration / 2, properties: { y: -10 }, easing },
    { frame: duration, properties: { y: 0 } },
  ],
};

// ═══════════════════════════════════════════════════════════════
// ADDITIONAL ENTRANCE ANIMATIONS
// ═══════════════════════════════════════════════════════════════

const flipInX: PresetDefinition = {
  name: 'flipInX',
  type: 'entrance',
  defaultDuration: 30,
  defaultEasing: 'easeOutCubic',
  generate: ({ duration, easing = 'easeOutCubic' }) => [
    { frame: 0, properties: { opacity: 0, scaleY: 0, rotation: 90 }, easing },
    { frame: duration, properties: { opacity: 1, scaleY: 1, rotation: 0 } },
  ],
};

const flipInY: PresetDefinition = {
  name: 'flipInY',
  type: 'entrance',
  defaultDuration: 30,
  defaultEasing: 'easeOutCubic',
  generate: ({ duration, easing = 'easeOutCubic' }) => [
    { frame: 0, properties: { opacity: 0, scaleX: 0, rotation: 90 }, easing },
    { frame: duration, properties: { opacity: 1, scaleX: 1, rotation: 0 } },
  ],
};

const rollIn: PresetDefinition = {
  name: 'rollIn',
  type: 'entrance',
  defaultDuration: 35,
  defaultEasing: 'easeOutCubic',
  generate: ({ duration, easing = 'easeOutCubic', canvasSize }) => {
    const offset = -(canvasSize?.width ?? 500);
    return [
      { frame: 0, properties: { opacity: 0, x: offset, rotation: -120 }, easing },
      { frame: duration, properties: { opacity: 1, x: 0, rotation: 0 } },
    ];
  },
};

const lightSpeedIn: PresetDefinition = {
  name: 'lightSpeedIn',
  type: 'entrance',
  defaultDuration: 25,
  defaultEasing: 'easeOutQuint',
  generate: ({ duration, easing = 'easeOutQuint', canvasSize }) => {
    const offset = canvasSize?.width ?? 500;
    return [
      { frame: 0, properties: { opacity: 0, x: offset, scaleX: 1.5 }, easing },
      { frame: duration, properties: { opacity: 1, x: 0, scaleX: 1 } },
    ];
  },
};

const swingIn: PresetDefinition = {
  name: 'swingIn',
  type: 'entrance',
  defaultDuration: 40,
  defaultEasing: 'easeOutElastic',
  generate: ({ duration, easing = 'easeOutElastic' }) => [
    { frame: 0, properties: { opacity: 0, rotation: -45 }, easing },
    { frame: duration, properties: { opacity: 1, rotation: 0 } },
  ],
};

const backIn: PresetDefinition = {
  name: 'backIn',
  type: 'entrance',
  defaultDuration: 30,
  defaultEasing: 'easeOutBack',
  generate: ({ duration, easing = 'easeOutBack' }) => [
    { frame: 0, properties: { opacity: 0, scaleX: 0.7, scaleY: 0.7 }, easing },
    { frame: duration, properties: { opacity: 1, scaleX: 1, scaleY: 1 } },
  ],
};

const elasticIn: PresetDefinition = {
  name: 'elasticIn',
  type: 'entrance',
  defaultDuration: 45,
  defaultEasing: 'easeOutElastic',
  generate: ({ duration, easing = 'easeOutElastic' }) => [
    { frame: 0, properties: { opacity: 0, scaleX: 0.3, scaleY: 0.3 }, easing },
    { frame: duration, properties: { opacity: 1, scaleX: 1, scaleY: 1 } },
  ],
};

const slideInFromTopLeft: PresetDefinition = {
  name: 'slideInFromTopLeft',
  type: 'entrance',
  defaultDuration: 30,
  defaultEasing: 'easeOutCubic',
  generate: ({ duration, easing = 'easeOutCubic', canvasSize }) => {
    const offsetX = -(canvasSize?.width ?? 500);
    const offsetY = -(canvasSize?.height ?? 500);
    return [
      { frame: 0, properties: { x: offsetX, y: offsetY }, easing },
      { frame: duration, properties: { x: 0, y: 0 } },
    ];
  },
};

const slideInFromTopRight: PresetDefinition = {
  name: 'slideInFromTopRight',
  type: 'entrance',
  defaultDuration: 30,
  defaultEasing: 'easeOutCubic',
  generate: ({ duration, easing = 'easeOutCubic', canvasSize }) => {
    const offsetX = canvasSize?.width ?? 500;
    const offsetY = -(canvasSize?.height ?? 500);
    return [
      { frame: 0, properties: { x: offsetX, y: offsetY }, easing },
      { frame: duration, properties: { x: 0, y: 0 } },
    ];
  },
};

const slideInFromBottomLeft: PresetDefinition = {
  name: 'slideInFromBottomLeft',
  type: 'entrance',
  defaultDuration: 30,
  defaultEasing: 'easeOutCubic',
  generate: ({ duration, easing = 'easeOutCubic', canvasSize }) => {
    const offsetX = -(canvasSize?.width ?? 500);
    const offsetY = canvasSize?.height ?? 500;
    return [
      { frame: 0, properties: { x: offsetX, y: offsetY }, easing },
      { frame: duration, properties: { x: 0, y: 0 } },
    ];
  },
};

const slideInFromBottomRight: PresetDefinition = {
  name: 'slideInFromBottomRight',
  type: 'entrance',
  defaultDuration: 30,
  defaultEasing: 'easeOutCubic',
  generate: ({ duration, easing = 'easeOutCubic', canvasSize }) => {
    const offsetX = canvasSize?.width ?? 500;
    const offsetY = canvasSize?.height ?? 500;
    return [
      { frame: 0, properties: { x: offsetX, y: offsetY }, easing },
      { frame: duration, properties: { x: 0, y: 0 } },
    ];
  },
};

// ═══════════════════════════════════════════════════════════════
// ADDITIONAL EXIT ANIMATIONS
// ═══════════════════════════════════════════════════════════════

const flipOutX: PresetDefinition = {
  name: 'flipOutX',
  type: 'exit',
  defaultDuration: 30,
  defaultEasing: 'easeInCubic',
  generate: ({ duration, easing = 'easeInCubic' }) => [
    { frame: 0, properties: { opacity: 1, scaleY: 1, rotation: 0 }, easing },
    { frame: duration, properties: { opacity: 0, scaleY: 0, rotation: -90 } },
  ],
};

const flipOutY: PresetDefinition = {
  name: 'flipOutY',
  type: 'exit',
  defaultDuration: 30,
  defaultEasing: 'easeInCubic',
  generate: ({ duration, easing = 'easeInCubic' }) => [
    { frame: 0, properties: { opacity: 1, scaleX: 1, rotation: 0 }, easing },
    { frame: duration, properties: { opacity: 0, scaleX: 0, rotation: -90 } },
  ],
};

const rollOut: PresetDefinition = {
  name: 'rollOut',
  type: 'exit',
  defaultDuration: 35,
  defaultEasing: 'easeInCubic',
  generate: ({ duration, easing = 'easeInCubic', canvasSize }) => {
    const offset = canvasSize?.width ?? 500;
    return [
      { frame: 0, properties: { opacity: 1, x: 0, rotation: 0 }, easing },
      { frame: duration, properties: { opacity: 0, x: offset, rotation: 120 } },
    ];
  },
};

const lightSpeedOut: PresetDefinition = {
  name: 'lightSpeedOut',
  type: 'exit',
  defaultDuration: 25,
  defaultEasing: 'easeInQuint',
  generate: ({ duration, easing = 'easeInQuint', canvasSize }) => {
    const offset = canvasSize?.width ?? 500;
    return [
      { frame: 0, properties: { opacity: 1, x: 0, scaleX: 1 }, easing },
      { frame: duration, properties: { opacity: 0, x: offset, scaleX: 0.7 } },
    ];
  },
};

const swingOut: PresetDefinition = {
  name: 'swingOut',
  type: 'exit',
  defaultDuration: 40,
  defaultEasing: 'easeInElastic',
  generate: ({ duration, easing = 'easeInElastic' }) => [
    { frame: 0, properties: { opacity: 1, rotation: 0 }, easing },
    { frame: duration, properties: { opacity: 0, rotation: 45 } },
  ],
};

const backOut: PresetDefinition = {
  name: 'backOut',
  type: 'exit',
  defaultDuration: 30,
  defaultEasing: 'easeInBack',
  generate: ({ duration, easing = 'easeInBack' }) => [
    { frame: 0, properties: { opacity: 1, scaleX: 1, scaleY: 1 }, easing },
    { frame: duration, properties: { opacity: 0, scaleX: 0.7, scaleY: 0.7 } },
  ],
};

const elasticOut: PresetDefinition = {
  name: 'elasticOut',
  type: 'exit',
  defaultDuration: 45,
  defaultEasing: 'easeInElastic',
  generate: ({ duration, easing = 'easeInElastic' }) => [
    { frame: 0, properties: { opacity: 1, scaleX: 1, scaleY: 1 }, easing },
    { frame: duration, properties: { opacity: 0, scaleX: 0.3, scaleY: 0.3 } },
  ],
};

const fadeOutLeft: PresetDefinition = {
  name: 'fadeOutLeft',
  type: 'exit',
  defaultDuration: 30,
  defaultEasing: 'easeInCubic',
  generate: ({ duration, easing = 'easeInCubic' }) => [
    { frame: 0, properties: { opacity: 1, x: 0 }, easing },
    { frame: duration, properties: { opacity: 0, x: -50 } },
  ],
};

const fadeOutRight: PresetDefinition = {
  name: 'fadeOutRight',
  type: 'exit',
  defaultDuration: 30,
  defaultEasing: 'easeInCubic',
  generate: ({ duration, easing = 'easeInCubic' }) => [
    { frame: 0, properties: { opacity: 1, x: 0 }, easing },
    { frame: duration, properties: { opacity: 0, x: 50 } },
  ],
};

// ═══════════════════════════════════════════════════════════════
// ADDITIONAL EMPHASIS ANIMATIONS
// ═══════════════════════════════════════════════════════════════

const wobble: PresetDefinition = {
  name: 'wobble',
  type: 'emphasis',
  defaultDuration: 40,
  defaultEasing: 'linear',
  generate: ({ duration }) => {
    const step = duration / 8;
    return [
      { frame: 0, properties: { x: 0, rotation: 0 } },
      { frame: step, properties: { x: -10, rotation: -5 } },
      { frame: step * 2, properties: { x: 10, rotation: 5 } },
      { frame: step * 3, properties: { x: -8, rotation: -3 } },
      { frame: step * 4, properties: { x: 8, rotation: 3 } },
      { frame: step * 5, properties: { x: -5, rotation: -2 } },
      { frame: step * 6, properties: { x: 5, rotation: 2 } },
      { frame: step * 7, properties: { x: -2, rotation: -1 } },
      { frame: duration, properties: { x: 0, rotation: 0 } },
    ];
  },
};

const flash: PresetDefinition = {
  name: 'flash',
  type: 'emphasis',
  defaultDuration: 20,
  defaultEasing: 'linear',
  generate: ({ duration }) => {
    const step = duration / 4;
    return [
      { frame: 0, properties: { opacity: 1 } },
      { frame: step, properties: { opacity: 0 } },
      { frame: step * 2, properties: { opacity: 1 } },
      { frame: step * 3, properties: { opacity: 0 } },
      { frame: duration, properties: { opacity: 1 } },
    ];
  },
};

const jello: PresetDefinition = {
  name: 'jello',
  type: 'emphasis',
  defaultDuration: 40,
  defaultEasing: 'easeInOutSine',
  generate: ({ duration, easing = 'easeInOutSine' }) => {
    const step = duration / 6;
    return [
      { frame: 0, properties: { scaleX: 1, scaleY: 1 }, easing },
      { frame: step, properties: { scaleX: 0.9, scaleY: 1.1 }, easing },
      { frame: step * 2, properties: { scaleX: 1.1, scaleY: 0.9 }, easing },
      { frame: step * 3, properties: { scaleX: 0.95, scaleY: 1.05 }, easing },
      { frame: step * 4, properties: { scaleX: 1.05, scaleY: 0.95 }, easing },
      { frame: step * 5, properties: { scaleX: 0.98, scaleY: 1.02 }, easing },
      { frame: duration, properties: { scaleX: 1, scaleY: 1 } },
    ];
  },
};

const rubberBand: PresetDefinition = {
  name: 'rubberBand',
  type: 'emphasis',
  defaultDuration: 40,
  defaultEasing: 'easeInOutSine',
  generate: ({ duration, easing = 'easeInOutSine' }) => {
    const step = duration / 6;
    return [
      { frame: 0, properties: { scaleX: 1, scaleY: 1 }, easing },
      { frame: step, properties: { scaleX: 1.25, scaleY: 0.75 }, easing },
      { frame: step * 2, properties: { scaleX: 0.75, scaleY: 1.25 }, easing },
      { frame: step * 3, properties: { scaleX: 1.15, scaleY: 0.85 }, easing },
      { frame: step * 4, properties: { scaleX: 0.95, scaleY: 1.05 }, easing },
      { frame: step * 5, properties: { scaleX: 1.05, scaleY: 0.95 }, easing },
      { frame: duration, properties: { scaleX: 1, scaleY: 1 } },
    ];
  },
};

const tada: PresetDefinition = {
  name: 'tada',
  type: 'emphasis',
  defaultDuration: 40,
  defaultEasing: 'easeInOutSine',
  generate: ({ duration, easing = 'easeInOutSine' }) => {
    const step = duration / 10;
    return [
      { frame: 0, properties: { scaleX: 1, scaleY: 1, rotation: 0 }, easing },
      { frame: step, properties: { scaleX: 0.9, scaleY: 0.9, rotation: -3 }, easing },
      { frame: step * 2, properties: { scaleX: 0.9, scaleY: 0.9, rotation: -3 }, easing },
      { frame: step * 3, properties: { scaleX: 1.1, scaleY: 1.1, rotation: 3 }, easing },
      { frame: step * 4, properties: { scaleX: 1.1, scaleY: 1.1, rotation: -3 }, easing },
      { frame: step * 5, properties: { scaleX: 1.1, scaleY: 1.1, rotation: 3 }, easing },
      { frame: step * 6, properties: { scaleX: 1.1, scaleY: 1.1, rotation: -3 }, easing },
      { frame: step * 7, properties: { scaleX: 1.1, scaleY: 1.1, rotation: 3 }, easing },
      { frame: step * 8, properties: { scaleX: 1.1, scaleY: 1.1, rotation: -3 }, easing },
      { frame: step * 9, properties: { scaleX: 1.1, scaleY: 1.1, rotation: 3 }, easing },
      { frame: duration, properties: { scaleX: 1, scaleY: 1, rotation: 0 } },
    ];
  },
};

const swing: PresetDefinition = {
  name: 'swing',
  type: 'emphasis',
  defaultDuration: 40,
  defaultEasing: 'easeInOutSine',
  generate: ({ duration, easing = 'easeInOutSine' }) => {
    const step = duration / 4;
    return [
      { frame: 0, properties: { rotation: 0 }, easing },
      { frame: step, properties: { rotation: 15 }, easing },
      { frame: step * 2, properties: { rotation: -10 }, easing },
      { frame: step * 3, properties: { rotation: 5 }, easing },
      { frame: duration, properties: { rotation: 0 } },
    ];
  },
};

// ═══════════════════════════════════════════════════════════════
// PRESET REGISTRY
// ═══════════════════════════════════════════════════════════════

/**
 * All preset animations.
 */
export const presets: Record<string, PresetDefinition> = {
  // Entrance - Basic
  fadeIn,
  fadeInUp,
  fadeInDown,
  fadeInLeft,
  fadeInRight,
  slideInUp,
  slideInDown,
  slideInLeft,
  slideInRight,
  scaleIn,
  zoomIn,
  rotateIn,
  bounceIn,
  // Entrance - Advanced
  flipInX,
  flipInY,
  rollIn,
  lightSpeedIn,
  swingIn,
  backIn,
  elasticIn,
  slideInFromTopLeft,
  slideInFromTopRight,
  slideInFromBottomLeft,
  slideInFromBottomRight,
  // Exit - Basic
  fadeOut,
  fadeOutUp,
  fadeOutDown,
  fadeOutLeft,
  fadeOutRight,
  scaleOut,
  zoomOut,
  // Exit - Advanced
  flipOutX,
  flipOutY,
  rollOut,
  lightSpeedOut,
  swingOut,
  backOut,
  elasticOut,
  // Emphasis
  pulse,
  shake,
  bounce,
  spin,
  heartbeat,
  float,
  wobble,
  flash,
  jello,
  rubberBand,
  tada,
  swing,
};

/**
 * Get a preset by name.
 */
export function getPreset(name: string): PresetDefinition | undefined {
  return presets[name];
}

/**
 * Get all preset names.
 */
export function getAllPresetNames(): string[] {
  return Object.keys(presets);
}

/**
 * Get presets by category.
 */
export function getPresetsByType(type: 'entrance' | 'exit' | 'emphasis'): PresetDefinition[] {
  return Object.values(presets).filter((p) => p.type === type);
}

/**
 * Generate keyframes for a preset animation.
 */
export function generatePresetKeyframes(
  name: string,
  options: PresetOptions
): Keyframe[] {
  const preset = presets[name];
  if (!preset) return [];
  return preset.generate(options);
}
