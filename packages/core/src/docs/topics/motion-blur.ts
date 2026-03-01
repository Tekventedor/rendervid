import type { DocResult } from '../types.js';
import { TIPS } from '../descriptions.js';

export function getMotionBlurDocs(): DocResult {
  return {
    topic: 'motion-blur',
    title: 'Motion Blur',
    description: 'Cinematic motion blur via temporal supersampling. Can be configured globally, per-scene, or per-layer.',
    properties: {
      enabled: { type: 'boolean', required: true, description: 'Enable/disable motion blur' },
      quality: { type: '"low" | "medium" | "high" | "ultra"', description: 'Quality preset (overrides samples/shutterAngle)', default: 'medium' },
      samples: { type: 'number', description: 'Temporal samples per frame (higher = smoother)', default: 10, range: '2-32' },
      shutterAngle: { type: 'number', description: 'Shutter angle in degrees. 180° = cinematic, 360° = max blur', default: 180, range: '0-360' },
      adaptive: { type: 'boolean', description: 'Reduce samples on static frames (saves 30-50%)', default: false },
      minSamples: { type: 'number', description: 'Minimum samples for adaptive mode', default: 3, range: '2-32' },
      motionThreshold: { type: 'number', description: 'Motion detection sensitivity for adaptive', default: 0.01, range: '0.0001-1.0' },
      stochastic: { type: 'boolean', description: 'Random sampling to reduce banding artifacts', default: false },
      blurAmount: { type: 'number', description: 'Blur multiplier', default: 1.0, range: '0-2' },
      blurAxis: { type: '"x" | "y" | "both"', description: 'Blur direction', default: 'both' },
      variableSampleRate: { type: 'boolean', description: 'Auto-adjust samples based on motion magnitude', default: false },
      maxSamples: { type: 'number', description: 'Maximum samples for variable rate mode', range: '2-32' },
      preview: { type: 'boolean', description: 'Preview mode: 2 samples for fast iteration', default: false },
    },
    sections: [
      {
        title: 'Quality Presets',
        description: 'Quick presets that set samples and shutterAngle',
        properties: {
          low: { type: 'preset', description: '5 samples, 180° shutter. ~5× render time' },
          medium: { type: 'preset', description: '10 samples, 180° shutter. ~10× render time' },
          high: { type: 'preset', description: '16 samples, 180° shutter. ~16× render time' },
          ultra: { type: 'preset', description: '32 samples, 180° shutter. ~32× render time' },
        },
      },
      {
        title: 'Configuration Hierarchy',
        description: 'Motion blur merges: layer > scene > global (render tool parameter)',
        tips: [
          'Set on render_video/start_render_async motionBlur parameter for global',
          'Set on scene.motionBlur for scene-level override',
          'Set on layer.motionBlur for layer-level override',
          'Any config with enabled: false disables blur at that level',
        ],
      },
    ],
    examples: [
      { description: 'Simple quality preset', motionBlur: { enabled: true, quality: 'medium' } },
      { description: 'Optimized high quality', motionBlur: { enabled: true, quality: 'high', adaptive: true, stochastic: true } },
      { description: 'Preview mode', motionBlur: { enabled: true, preview: true } },
    ],
    tips: TIPS.motionBlur,
    seeAlso: ['layer'],
  };
}
