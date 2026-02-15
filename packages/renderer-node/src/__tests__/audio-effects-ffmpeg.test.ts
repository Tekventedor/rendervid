import { describe, it, expect } from 'vitest';
import {
  buildAudioFilterGraph,
  buildTrackFilterChain,
  effectsToFFmpegFilters,
  volumeEnvelopeToFFmpeg,
  eqToFFmpeg,
  reverbToFFmpeg,
  compressorToFFmpeg,
  delayToFFmpeg,
  gainToFFmpeg,
  lowpassToFFmpeg,
  highpassToFFmpeg,
} from '../audio-effects-ffmpeg';
import type {
  AudioMixerConfig,
  AudioMixerTrack,
  EQEffect,
  ReverbEffect,
  CompressorEffect,
  DelayEffect,
  GainEffect,
  LowPassFilter,
  HighPassFilter,
  VolumeKeyframe,
} from '@rendervid/core';

describe('Audio Effects FFmpeg Converter', () => {
  // ─── Individual Effect Converters ──────────────────────────

  describe('eqToFFmpeg', () => {
    it('should convert peaking band to equalizer filter', () => {
      const eq: EQEffect = {
        type: 'eq',
        bands: [{ frequency: 1000, gain: 3, Q: 1.4, type: 'peaking' }],
      };
      const result = eqToFFmpeg(eq);
      expect(result).toHaveLength(1);
      expect(result[0]).toBe('equalizer=f=1000:width_type=q:width=1.4:g=3');
    });

    it('should convert lowshelf band correctly', () => {
      const eq: EQEffect = {
        type: 'eq',
        bands: [{ frequency: 200, gain: -3, Q: 0.7, type: 'lowshelf' }],
      };
      const result = eqToFFmpeg(eq);
      expect(result[0]).toContain('lowshelf');
      expect(result[0]).toContain('f=200');
    });

    it('should convert highshelf band correctly', () => {
      const eq: EQEffect = {
        type: 'eq',
        bands: [{ frequency: 8000, gain: 5, Q: 0.7, type: 'highshelf' }],
      };
      const result = eqToFFmpeg(eq);
      expect(result[0]).toContain('highshelf');
      expect(result[0]).toContain('f=8000');
    });

    it('should produce one filter per band', () => {
      const eq: EQEffect = {
        type: 'eq',
        bands: [
          { frequency: 100, gain: 2, Q: 1, type: 'lowshelf' },
          { frequency: 1000, gain: -1, Q: 1.4, type: 'peaking' },
          { frequency: 8000, gain: 3, Q: 0.7, type: 'highshelf' },
        ],
      };
      const result = eqToFFmpeg(eq);
      expect(result).toHaveLength(3);
    });
  });

  describe('reverbToFFmpeg', () => {
    it('should convert reverb to aecho filter', () => {
      const reverb: ReverbEffect = {
        type: 'reverb',
        roomSize: 0.5,
        damping: 0.5,
        wetDry: 0.3,
      };
      const result = reverbToFFmpeg(reverb);
      expect(result).toContain('aecho=');
      // Should contain numeric parameters separated by colons
      const parts = result.replace('aecho=', '').split(':');
      expect(parts).toHaveLength(4);
      // All parts should be valid numbers
      parts.forEach((p) => expect(Number(p)).not.toBeNaN());
    });

    it('should handle extreme roomSize values', () => {
      const small = reverbToFFmpeg({ type: 'reverb', roomSize: 0, damping: 0.5, wetDry: 0.3 });
      const large = reverbToFFmpeg({ type: 'reverb', roomSize: 1, damping: 0.5, wetDry: 0.3 });
      // Different room sizes should produce different delay values
      expect(small).not.toBe(large);
    });
  });

  describe('compressorToFFmpeg', () => {
    it('should convert compressor to acompressor filter', () => {
      const comp: CompressorEffect = {
        type: 'compressor',
        threshold: -20,
        ratio: 4,
        attack: 5,
        release: 100,
        knee: 6,
      };
      const result = compressorToFFmpeg(comp);
      expect(result).toContain('acompressor=');
      expect(result).toContain('threshold=-20dB');
      expect(result).toContain('ratio=4');
      expect(result).toContain('attack=0.005'); // 5ms -> 0.005s
      expect(result).toContain('release=0.1'); // 100ms -> 0.1s
      expect(result).toContain('knee=6dB');
    });
  });

  describe('delayToFFmpeg', () => {
    it('should convert delay to adelay filter', () => {
      const delay: DelayEffect = {
        type: 'delay',
        time: 250,
        feedback: 0.4,
        wetDry: 0.3,
      };
      const result = delayToFFmpeg(delay);
      expect(result).toBe('adelay=250|250');
    });
  });

  describe('gainToFFmpeg', () => {
    it('should convert gain to volume filter', () => {
      const gain: GainEffect = { type: 'gain', value: 0.8 };
      const result = gainToFFmpeg(gain);
      expect(result).toBe('volume=0.8');
    });

    it('should handle unity gain', () => {
      const gain: GainEffect = { type: 'gain', value: 1.0 };
      const result = gainToFFmpeg(gain);
      expect(result).toBe('volume=1');
    });
  });

  describe('lowpassToFFmpeg', () => {
    it('should convert lowpass filter correctly', () => {
      const lp: LowPassFilter = { type: 'lowpass', frequency: 2000, Q: 0.707 };
      const result = lowpassToFFmpeg(lp);
      expect(result).toBe('lowpass=f=2000:width_type=q:width=0.707');
    });
  });

  describe('highpassToFFmpeg', () => {
    it('should convert highpass filter correctly', () => {
      const hp: HighPassFilter = { type: 'highpass', frequency: 80, Q: 1.0 };
      const result = highpassToFFmpeg(hp);
      expect(result).toBe('highpass=f=80:width_type=q:width=1');
    });
  });

  // ─── Effect Chain Converter ────────────────────────────────

  describe('effectsToFFmpegFilters', () => {
    it('should convert an empty effects array', () => {
      const result = effectsToFFmpegFilters([]);
      expect(result).toEqual([]);
    });

    it('should convert a mixed effects chain', () => {
      const result = effectsToFFmpegFilters([
        { type: 'highpass', frequency: 80, Q: 0.707 },
        { type: 'eq', bands: [{ frequency: 1000, gain: 2, Q: 1.4, type: 'peaking' }] },
        { type: 'compressor', threshold: -18, ratio: 3, attack: 10, release: 200, knee: 4 },
        { type: 'gain', value: 0.9 },
      ]);

      expect(result).toHaveLength(4);
      expect(result[0]).toContain('highpass');
      expect(result[1]).toContain('equalizer');
      expect(result[2]).toContain('acompressor');
      expect(result[3]).toBe('volume=0.9');
    });
  });

  // ─── Volume Envelope Converter ─────────────────────────────

  describe('volumeEnvelopeToFFmpeg', () => {
    it('should handle empty keyframes', () => {
      const result = volumeEnvelopeToFFmpeg([], 30);
      expect(result).toBe('volume=1.0');
    });

    it('should handle single keyframe', () => {
      const result = volumeEnvelopeToFFmpeg([{ frame: 0, volume: 0.5 }], 30);
      expect(result).toBe('volume=0.5');
    });

    it('should produce a valid volume expression for multiple keyframes', () => {
      const keyframes: VolumeKeyframe[] = [
        { frame: 0, volume: 0 },
        { frame: 30, volume: 1.0 },
        { frame: 120, volume: 1.0 },
        { frame: 150, volume: 0 },
      ];
      const result = volumeEnvelopeToFFmpeg(keyframes, 30);

      // Should use the volume filter with an expression
      expect(result).toContain('volume=');
      expect(result).toContain('eval=frame');
      // Should contain if() expressions for interpolation
      expect(result).toContain('if(lt(t,');
    });

    it('should sort keyframes by frame number', () => {
      const keyframes: VolumeKeyframe[] = [
        { frame: 60, volume: 1.0 },
        { frame: 0, volume: 0 },
        { frame: 30, volume: 0.5 },
      ];
      const result = volumeEnvelopeToFFmpeg(keyframes, 30);
      // Should produce a valid expression regardless of input order
      expect(result).toContain('volume=');
    });
  });

  // ─── Track Filter Chain Builder ────────────────────────────

  describe('buildTrackFilterChain', () => {
    it('should build a basic track with no effects', () => {
      const track: AudioMixerTrack = {
        src: '/audio/test.mp3',
        volume: 1.0,
        pan: 0,
        effects: [],
        startTime: 0,
      };
      const result = buildTrackFilterChain(track, '[0:a]', '[track0]');
      expect(result).toContain('[0:a]');
      expect(result).toContain('[track0]');
      expect(result).toContain('anull');
    });

    it('should include volume filter when not unity', () => {
      const track: AudioMixerTrack = {
        src: '/audio/test.mp3',
        volume: 0.5,
        pan: 0,
        effects: [],
        startTime: 0,
      };
      const result = buildTrackFilterChain(track, '[0:a]', '[track0]');
      expect(result).toContain('volume=0.5');
    });

    it('should include fade filters', () => {
      const track: AudioMixerTrack = {
        src: '/audio/test.mp3',
        volume: 1.0,
        pan: 0,
        effects: [],
        startTime: 0,
        endTime: 10,
        fadeIn: 1,
        fadeOut: 2,
      };
      const result = buildTrackFilterChain(track, '[0:a]', '[track0]');
      expect(result).toContain('afade=t=in');
      expect(result).toContain('afade=t=out');
    });

    it('should include pan filter for non-center pan', () => {
      const track: AudioMixerTrack = {
        src: '/audio/test.mp3',
        volume: 1.0,
        pan: -0.5,
        effects: [],
        startTime: 0,
      };
      const result = buildTrackFilterChain(track, '[0:a]', '[track0]');
      expect(result).toContain('pan=stereo');
    });

    it('should include effect filters', () => {
      const track: AudioMixerTrack = {
        src: '/audio/test.mp3',
        volume: 1.0,
        pan: 0,
        effects: [
          { type: 'highpass', frequency: 80, Q: 0.707 },
          { type: 'gain', value: 1.2 },
        ],
        startTime: 0,
      };
      const result = buildTrackFilterChain(track, '[0:a]', '[track0]');
      expect(result).toContain('highpass');
      expect(result).toContain('volume=1.2');
    });
  });

  // ─── Full Audio Filter Graph Builder ───────────────────────

  describe('buildAudioFilterGraph', () => {
    it('should handle empty tracks', () => {
      const config: AudioMixerConfig = {
        tracks: [],
        masterVolume: 1.0,
        masterEffects: [],
      };
      const result = buildAudioFilterGraph(config);
      expect(result).toContain('anullsrc');
    });

    it('should build a single-track filter graph', () => {
      const config: AudioMixerConfig = {
        tracks: [
          {
            src: '/audio/music.mp3',
            volume: 0.8,
            pan: 0,
            effects: [],
            startTime: 0,
          },
        ],
        masterVolume: 1.0,
        masterEffects: [],
      };
      const result = buildAudioFilterGraph(config);
      expect(result).toContain('[0:a]');
      expect(result).toContain('volume=0.8');
      expect(result).toContain('[aout]');
    });

    it('should build a single-track graph with master volume', () => {
      const config: AudioMixerConfig = {
        tracks: [
          {
            src: '/audio/music.mp3',
            volume: 1.0,
            pan: 0,
            effects: [],
            startTime: 0,
          },
        ],
        masterVolume: 0.7,
        masterEffects: [],
      };
      const result = buildAudioFilterGraph(config);
      expect(result).toContain('volume=0.7');
    });

    it('should build a multi-track filter graph with amix', () => {
      const config: AudioMixerConfig = {
        tracks: [
          {
            src: '/audio/music.mp3',
            volume: 0.6,
            pan: 0,
            effects: [],
            startTime: 0,
          },
          {
            src: '/audio/voiceover.wav',
            volume: 1.0,
            pan: 0,
            effects: [],
            startTime: 0,
          },
        ],
        masterVolume: 1.0,
        masterEffects: [],
      };
      const result = buildAudioFilterGraph(config);

      // Should contain track processing
      expect(result).toContain('[0:a]');
      expect(result).toContain('[1:a]');
      expect(result).toContain('[track0]');
      expect(result).toContain('[track1]');

      // Should contain amix
      expect(result).toContain('amix=inputs=2');
      expect(result).toContain('duration=longest');

      // Should contain output label
      expect(result).toContain('[aout]');
    });

    it('should apply master effects to mixed output', () => {
      const config: AudioMixerConfig = {
        tracks: [
          {
            src: '/audio/a.mp3',
            volume: 1.0,
            pan: 0,
            effects: [],
            startTime: 0,
          },
          {
            src: '/audio/b.mp3',
            volume: 1.0,
            pan: 0,
            effects: [],
            startTime: 0,
          },
        ],
        masterVolume: 0.9,
        masterEffects: [
          { type: 'compressor', threshold: -10, ratio: 2, attack: 10, release: 200, knee: 6 },
        ],
      };
      const result = buildAudioFilterGraph(config);
      expect(result).toContain('acompressor');
      expect(result).toContain('volume=0.9');
      expect(result).toContain('[mixed]');
      expect(result).toContain('[aout]');
    });

    it('should handle a complex multi-track setup', () => {
      const config: AudioMixerConfig = {
        tracks: [
          {
            src: '/audio/music.mp3',
            volume: 0.5,
            pan: 0,
            effects: [
              { type: 'eq', bands: [{ frequency: 80, gain: 3, Q: 0.7, type: 'lowshelf' }] },
            ],
            startTime: 0,
            fadeIn: 2,
          },
          {
            src: '/audio/voice.wav',
            volume: 1.0,
            pan: 0,
            effects: [
              { type: 'highpass', frequency: 100, Q: 0.707 },
              { type: 'compressor', threshold: -18, ratio: 3, attack: 5, release: 150, knee: 4 },
            ],
            startTime: 1,
          },
          {
            src: '/audio/sfx.wav',
            volume: 0.3,
            pan: 0.7,
            effects: [],
            startTime: 5,
            endTime: 8,
            fadeOut: 1,
          },
        ],
        masterVolume: 0.85,
        masterEffects: [
          { type: 'lowpass', frequency: 18000, Q: 0.707 },
        ],
      };

      const result = buildAudioFilterGraph(config);

      // Should be a semicolon-separated filter graph
      const chains = result.split(';');
      expect(chains.length).toBeGreaterThanOrEqual(4); // 3 tracks + mix + master

      // Verify structure
      expect(result).toContain('amix=inputs=3');
      expect(result).toContain('[aout]');
    });

    it('should produce a valid single-track graph with no modifications', () => {
      const config: AudioMixerConfig = {
        tracks: [
          {
            src: '/audio/pass.mp3',
            volume: 1.0,
            pan: 0,
            effects: [],
            startTime: 0,
          },
        ],
        masterVolume: 1.0,
        masterEffects: [],
      };
      const result = buildAudioFilterGraph(config);
      // Should just be a passthrough
      expect(result).toContain('[0:a]');
      expect(result).toContain('anull');
      expect(result).toContain('[aout]');
    });
  });
});
