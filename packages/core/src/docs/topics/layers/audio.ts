import type { DocResult } from '../../types.js';

export function getAudioLayerDocs(): DocResult {
  return {
    topic: 'layer/audio',
    title: 'Audio Layer',
    description: 'Audio playback with effects chain, volume envelope, and stereo panning. Audio layers do not need position or size.',
    properties: {
      src: { type: 'string', required: true, description: 'Audio source URL or local file path', example: 'https://example.com/music.mp3' },
      volume: { type: 'number', description: 'Volume level', default: 1, range: '0-1' },
      loop: { type: 'boolean', description: 'Loop audio playback', default: false },
      startTime: { type: 'number', description: 'Start playback at this time in seconds', default: 0 },
      fadeIn: { type: 'number', description: 'Fade in duration in frames', example: 30 },
      fadeOut: { type: 'number', description: 'Fade out duration in frames', example: 60 },
      pan: { type: 'number', description: 'Stereo pan position', range: '-1 (left) to 1 (right)', default: 0 },
      effects: { type: 'AudioEffect[]', description: 'Audio effects chain' },
      volumeEnvelope: { type: 'VolumeKeyframe[]', description: 'Volume automation keyframes' },
    },
    sections: [
      {
        title: 'Audio Effects',
        description: 'Effects that can be applied in the effects chain',
        properties: {
          eq: { type: 'EQEffect', description: 'Parametric equalizer with frequency bands' },
          reverb: { type: 'ReverbEffect', description: 'Reverb with roomSize, damping, wetDry' },
          compressor: { type: 'CompressorEffect', description: 'Dynamic range compressor' },
          delay: { type: 'DelayEffect', description: 'Delay with feedback' },
          gain: { type: 'GainEffect', description: 'Volume/gain adjustment' },
          lowpass: { type: 'LowPassFilter', description: 'Low-pass filter with frequency and Q' },
          highpass: { type: 'HighPassFilter', description: 'High-pass filter with frequency and Q' },
        },
      },
      {
        title: 'Volume Envelope',
        description: 'Automate volume over time with keyframes',
        properties: {
          frame: { type: 'number', required: true, description: 'Frame number' },
          volume: { type: 'number', required: true, description: 'Volume at this frame', range: '0-1' },
          easing: { type: 'string', description: 'Easing to next keyframe', default: 'linear' },
        },
      },
    ],
    tips: [
      'Audio layers do not need position or size properties',
      'Use fadeIn/fadeOut for smooth audio transitions',
      'Use volumeEnvelope for precise volume automation',
    ],
    examples: [
      {
        description: 'Background music with fade',
        layer: {
          id: 'music', type: 'audio',
          position: { x: 0, y: 0 }, size: { width: 0, height: 0 },
          props: { src: 'https://example.com/music.mp3', volume: 0.3, loop: true, fadeIn: 30, fadeOut: 60 },
        },
      },
    ],
    seeAlso: ['layer', 'layer/video'],
  };
}
