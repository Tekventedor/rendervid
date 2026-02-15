import { describe, it, expect } from 'vitest';
import type {
  AudioEffect,
  EQEffect,
  ReverbEffect,
  CompressorEffect,
  DelayEffect,
  GainEffect,
  LowPassFilter,
  HighPassFilter,
  VolumeKeyframe,
  VolumeEnvelope,
  AudioMixerTrack,
  AudioMixerConfig,
} from '../types/audio-effects';

describe('Audio Effects Types', () => {
  describe('EQEffect', () => {
    it('should construct a valid EQ effect with multiple bands', () => {
      const eq: EQEffect = {
        type: 'eq',
        bands: [
          { frequency: 100, gain: 3, Q: 1.0, type: 'lowshelf' },
          { frequency: 1000, gain: -2, Q: 1.4, type: 'peaking' },
          { frequency: 8000, gain: 5, Q: 0.7, type: 'highshelf' },
        ],
      };

      expect(eq.type).toBe('eq');
      expect(eq.bands).toHaveLength(3);
      expect(eq.bands[0].type).toBe('lowshelf');
      expect(eq.bands[1].frequency).toBe(1000);
      expect(eq.bands[2].gain).toBe(5);
    });
  });

  describe('ReverbEffect', () => {
    it('should construct a valid reverb effect', () => {
      const reverb: ReverbEffect = {
        type: 'reverb',
        roomSize: 0.7,
        damping: 0.5,
        wetDry: 0.3,
      };

      expect(reverb.type).toBe('reverb');
      expect(reverb.roomSize).toBe(0.7);
      expect(reverb.damping).toBe(0.5);
      expect(reverb.wetDry).toBe(0.3);
    });
  });

  describe('CompressorEffect', () => {
    it('should construct a valid compressor effect', () => {
      const comp: CompressorEffect = {
        type: 'compressor',
        threshold: -20,
        ratio: 4,
        attack: 5,
        release: 100,
        knee: 6,
      };

      expect(comp.type).toBe('compressor');
      expect(comp.threshold).toBe(-20);
      expect(comp.ratio).toBe(4);
      expect(comp.attack).toBe(5);
      expect(comp.release).toBe(100);
      expect(comp.knee).toBe(6);
    });
  });

  describe('DelayEffect', () => {
    it('should construct a valid delay effect', () => {
      const delay: DelayEffect = {
        type: 'delay',
        time: 250,
        feedback: 0.4,
        wetDry: 0.3,
      };

      expect(delay.type).toBe('delay');
      expect(delay.time).toBe(250);
      expect(delay.feedback).toBe(0.4);
    });
  });

  describe('GainEffect', () => {
    it('should construct a valid gain effect', () => {
      const gain: GainEffect = {
        type: 'gain',
        value: 0.8,
      };

      expect(gain.type).toBe('gain');
      expect(gain.value).toBe(0.8);
    });
  });

  describe('LowPassFilter', () => {
    it('should construct a valid lowpass filter', () => {
      const lp: LowPassFilter = {
        type: 'lowpass',
        frequency: 2000,
        Q: 0.707,
      };

      expect(lp.type).toBe('lowpass');
      expect(lp.frequency).toBe(2000);
      expect(lp.Q).toBe(0.707);
    });
  });

  describe('HighPassFilter', () => {
    it('should construct a valid highpass filter', () => {
      const hp: HighPassFilter = {
        type: 'highpass',
        frequency: 80,
        Q: 1.0,
      };

      expect(hp.type).toBe('highpass');
      expect(hp.frequency).toBe(80);
    });
  });

  describe('AudioEffect union type', () => {
    it('should accept all effect types', () => {
      const effects: AudioEffect[] = [
        { type: 'eq', bands: [{ frequency: 1000, gain: 3, Q: 1, type: 'peaking' }] },
        { type: 'reverb', roomSize: 0.5, damping: 0.5, wetDry: 0.3 },
        { type: 'compressor', threshold: -20, ratio: 4, attack: 5, release: 100, knee: 6 },
        { type: 'delay', time: 200, feedback: 0.3, wetDry: 0.2 },
        { type: 'gain', value: 1.5 },
        { type: 'lowpass', frequency: 5000, Q: 0.707 },
        { type: 'highpass', frequency: 100, Q: 0.707 },
      ];

      expect(effects).toHaveLength(7);
      expect(effects.map((e) => e.type)).toEqual([
        'eq', 'reverb', 'compressor', 'delay', 'gain', 'lowpass', 'highpass',
      ]);
    });
  });

  describe('VolumeKeyframe', () => {
    it('should construct volume keyframes with optional easing', () => {
      const keyframes: VolumeKeyframe[] = [
        { frame: 0, volume: 0 },
        { frame: 30, volume: 1.0, easing: 'easeInOut' },
        { frame: 120, volume: 1.0 },
        { frame: 150, volume: 0, easing: 'easeOut' },
      ];

      expect(keyframes).toHaveLength(4);
      expect(keyframes[0].volume).toBe(0);
      expect(keyframes[1].easing).toBe('easeInOut');
      expect(keyframes[2].easing).toBeUndefined();
    });
  });

  describe('VolumeEnvelope', () => {
    it('should wrap keyframes in an envelope', () => {
      const envelope: VolumeEnvelope = {
        keyframes: [
          { frame: 0, volume: 0 },
          { frame: 30, volume: 1 },
        ],
      };

      expect(envelope.keyframes).toHaveLength(2);
    });
  });

  describe('AudioMixerTrack', () => {
    it('should construct a complete mixer track', () => {
      const track: AudioMixerTrack = {
        src: '/audio/music.mp3',
        volume: 0.8,
        pan: -0.3,
        effects: [
          { type: 'eq', bands: [{ frequency: 100, gain: -3, Q: 1.0, type: 'lowshelf' }] },
          { type: 'compressor', threshold: -18, ratio: 3, attack: 10, release: 200, knee: 4 },
        ],
        startTime: 0,
        endTime: 60,
        fadeIn: 2,
        fadeOut: 3,
      };

      expect(track.src).toBe('/audio/music.mp3');
      expect(track.volume).toBe(0.8);
      expect(track.pan).toBe(-0.3);
      expect(track.effects).toHaveLength(2);
      expect(track.fadeIn).toBe(2);
      expect(track.fadeOut).toBe(3);
    });

    it('should allow track without optional fields', () => {
      const track: AudioMixerTrack = {
        src: '/audio/voiceover.wav',
        volume: 1.0,
        pan: 0,
        effects: [],
        startTime: 5,
      };

      expect(track.endTime).toBeUndefined();
      expect(track.fadeIn).toBeUndefined();
      expect(track.fadeOut).toBeUndefined();
    });
  });

  describe('AudioMixerConfig', () => {
    it('should construct a full mixer configuration', () => {
      const config: AudioMixerConfig = {
        tracks: [
          {
            src: '/audio/music.mp3',
            volume: 0.6,
            pan: 0,
            effects: [
              { type: 'eq', bands: [{ frequency: 80, gain: 2, Q: 0.7, type: 'lowshelf' }] },
            ],
            startTime: 0,
          },
          {
            src: '/audio/voiceover.wav',
            volume: 1.0,
            pan: 0,
            effects: [
              { type: 'compressor', threshold: -15, ratio: 3, attack: 5, release: 150, knee: 5 },
              { type: 'highpass', frequency: 80, Q: 0.707 },
            ],
            startTime: 2,
            fadeIn: 0.5,
          },
          {
            src: '/audio/sfx.wav',
            volume: 0.4,
            pan: 0.5,
            effects: [],
            startTime: 10,
            endTime: 12,
          },
        ],
        masterVolume: 0.9,
        masterEffects: [
          { type: 'compressor', threshold: -10, ratio: 2, attack: 10, release: 200, knee: 6 },
        ],
      };

      expect(config.tracks).toHaveLength(3);
      expect(config.masterVolume).toBe(0.9);
      expect(config.masterEffects).toHaveLength(1);
      expect(config.masterEffects[0].type).toBe('compressor');
    });

    it('should allow empty tracks and effects', () => {
      const config: AudioMixerConfig = {
        tracks: [],
        masterVolume: 1.0,
        masterEffects: [],
      };

      expect(config.tracks).toHaveLength(0);
      expect(config.masterEffects).toHaveLength(0);
    });
  });
});
