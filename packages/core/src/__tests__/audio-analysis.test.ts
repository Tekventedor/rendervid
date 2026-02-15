import { describe, it, expect } from 'vitest';
import {
  detectBeats,
  getBeatAtFrame,
  getFrequencyBands,
  getAmplitudeEnvelope,
} from '../utils/audio-analysis';
import type { AudioData } from '../utils/audio';

// ─── Helpers ─────────────────────────────────────────────────────────────────

function createMockAudioData(opts: {
  sampleRate?: number;
  durationSeconds?: number;
  generator?: (i: number, sampleRate: number) => number;
}): AudioData {
  const sampleRate = opts.sampleRate ?? 44100;
  const duration = opts.durationSeconds ?? 2;
  const length = Math.floor(sampleRate * duration);
  const generator = opts.generator ?? (() => 0);

  const channelData = new Float32Array(length);
  for (let i = 0; i < length; i++) {
    channelData[i] = generator(i, sampleRate);
  }

  return {
    channelData: [channelData],
    sampleRate,
    numberOfChannels: 1,
    durationInSeconds: duration,
    length,
  };
}

function createSineWave(frequency: number, amplitude: number = 0.5) {
  return (i: number, sampleRate: number) =>
    amplitude * Math.sin((2 * Math.PI * frequency * i) / sampleRate);
}

function createBeatPattern() {
  // Generate audio with periodic loud bursts (simulated beats)
  return (i: number, sampleRate: number) => {
    const time = i / sampleRate;
    const beatInterval = 0.5; // beat every 0.5 seconds
    const beatDuration = 0.05; // each beat lasts 50ms
    const timeInBeat = time % beatInterval;
    if (timeInBeat < beatDuration) {
      // Loud burst during beat
      return 0.9 * Math.sin((2 * Math.PI * 200 * i) / sampleRate);
    }
    // Quiet background
    return 0.02 * Math.sin((2 * Math.PI * 200 * i) / sampleRate);
  };
}

// ─── Beat Detection Tests ────────────────────────────────────────────────────

describe('detectBeats', () => {
  it('should return an empty array for silence', () => {
    const audio = createMockAudioData({ generator: () => 0 });
    const beats = detectBeats(audio);
    expect(beats).toEqual([]);
  });

  it('should detect beats in a periodic beat pattern', () => {
    const audio = createMockAudioData({
      durationSeconds: 3,
      generator: createBeatPattern(),
    });
    const beats = detectBeats(audio, { threshold: 1.3, sensitivity: 0.7 });
    // With beats every 0.5s over 3 seconds, we expect roughly 5-6 beats
    expect(beats.length).toBeGreaterThan(2);
    expect(beats.length).toBeLessThan(10);
  });

  it('should return beats with valid intensity values (0-1)', () => {
    const audio = createMockAudioData({
      durationSeconds: 2,
      generator: createBeatPattern(),
    });
    const beats = detectBeats(audio, { sensitivity: 0.7 });
    for (const beat of beats) {
      expect(beat.intensity).toBeGreaterThanOrEqual(0);
      expect(beat.intensity).toBeLessThanOrEqual(1);
    }
  });

  it('should return beats sorted by time', () => {
    const audio = createMockAudioData({
      durationSeconds: 3,
      generator: createBeatPattern(),
    });
    const beats = detectBeats(audio, { sensitivity: 0.7 });
    for (let i = 1; i < beats.length; i++) {
      expect(beats[i].time).toBeGreaterThan(beats[i - 1].time);
    }
  });

  it('should respect minInterval option', () => {
    const audio = createMockAudioData({
      durationSeconds: 2,
      generator: createBeatPattern(),
    });
    const beats = detectBeats(audio, { minInterval: 0.8, sensitivity: 0.7 });
    for (let i = 1; i < beats.length; i++) {
      expect(beats[i].time - beats[i - 1].time).toBeGreaterThanOrEqual(0.7); // allow small margin
    }
  });

  it('should detect fewer beats with lower sensitivity', () => {
    const audio = createMockAudioData({
      durationSeconds: 3,
      generator: createBeatPattern(),
    });
    const highSens = detectBeats(audio, { sensitivity: 0.9 });
    const lowSens = detectBeats(audio, { sensitivity: 0.1 });
    expect(highSens.length).toBeGreaterThanOrEqual(lowSens.length);
  });
});

// ─── getBeatAtFrame Tests ────────────────────────────────────────────────────

describe('getBeatAtFrame', () => {
  const mockBeats = [
    { frame: 0, time: 0.5, intensity: 1.0 },
    { frame: 0, time: 1.0, intensity: 0.8 },
    { frame: 0, time: 1.5, intensity: 0.6 },
  ];

  it('should return 0 for empty beats array', () => {
    expect(getBeatAtFrame([], 15, 30)).toBe(0);
  });

  it('should return high intensity at beat position', () => {
    // At frame 15 (0.5s at 30fps), there's a beat with intensity 1.0
    const intensity = getBeatAtFrame(mockBeats, 15, 30);
    expect(intensity).toBeGreaterThan(0.5);
  });

  it('should decay intensity after beat', () => {
    const atBeat = getBeatAtFrame(mockBeats, 15, 30);
    const afterBeat = getBeatAtFrame(mockBeats, 20, 30);
    expect(atBeat).toBeGreaterThan(afterBeat);
  });

  it('should return 0 before any beat occurs', () => {
    const intensity = getBeatAtFrame(mockBeats, 0, 30);
    expect(intensity).toBe(0);
  });

  it('should return values between 0 and 1', () => {
    for (let frame = 0; frame < 90; frame++) {
      const intensity = getBeatAtFrame(mockBeats, frame, 30);
      expect(intensity).toBeGreaterThanOrEqual(0);
      expect(intensity).toBeLessThanOrEqual(1);
    }
  });
});

// ─── getFrequencyBands Tests ─────────────────────────────────────────────────

describe('getFrequencyBands', () => {
  it('should return default 7 frequency bands', () => {
    const audio = createMockAudioData({
      generator: createSineWave(440),
    });
    const bands = getFrequencyBands(audio, 15, 30);
    expect(bands).toHaveLength(7);
  });

  it('should return bands with correct names', () => {
    const audio = createMockAudioData({
      generator: createSineWave(440),
    });
    const bands = getFrequencyBands(audio, 15, 30);
    const names = bands.map((b) => b.name);
    expect(names).toEqual([
      'sub-bass',
      'bass',
      'low-mid',
      'mid',
      'high-mid',
      'presence',
      'brilliance',
    ]);
  });

  it('should return normalized energy values (0-1)', () => {
    const audio = createMockAudioData({
      generator: createSineWave(440),
    });
    const bands = getFrequencyBands(audio, 15, 30);
    for (const band of bands) {
      expect(band.energy).toBeGreaterThanOrEqual(0);
      expect(band.energy).toBeLessThanOrEqual(1);
    }
  });

  it('should show energy in the mid band for a 440Hz tone', () => {
    const audio = createMockAudioData({
      generator: createSineWave(440, 0.8),
    });
    const bands = getFrequencyBands(audio, 15, 30);
    // 440Hz falls in low-mid (250-500) or mid (500-2000) range
    const lowMid = bands.find((b) => b.name === 'low-mid')!;
    const mid = bands.find((b) => b.name === 'mid')!;
    const subBass = bands.find((b) => b.name === 'sub-bass')!;
    // The 440Hz tone should produce more energy in low-mid/mid than sub-bass
    expect(lowMid.energy + mid.energy).toBeGreaterThan(subBass.energy);
  });

  it('should accept custom frequency bands', () => {
    const audio = createMockAudioData({
      generator: createSineWave(1000),
    });
    const customBands = [
      { name: 'low', minFreq: 20, maxFreq: 500 },
      { name: 'high', minFreq: 500, maxFreq: 20000 },
    ];
    const bands = getFrequencyBands(audio, 15, 30, customBands);
    expect(bands).toHaveLength(2);
    expect(bands[0].name).toBe('low');
    expect(bands[1].name).toBe('high');
  });

  it('should return zero energy for silence', () => {
    const audio = createMockAudioData({ generator: () => 0 });
    const bands = getFrequencyBands(audio, 15, 30);
    for (const band of bands) {
      expect(band.energy).toBe(0);
    }
  });
});

// ─── getAmplitudeEnvelope Tests ──────────────────────────────────────────────

describe('getAmplitudeEnvelope', () => {
  it('should return 0 for silence', () => {
    const audio = createMockAudioData({ generator: () => 0 });
    const amplitude = getAmplitudeEnvelope(audio, 15, 30);
    expect(amplitude).toBe(0);
  });

  it('should return a positive value for a sine wave', () => {
    const audio = createMockAudioData({
      generator: createSineWave(440, 0.5),
    });
    const amplitude = getAmplitudeEnvelope(audio, 15, 30);
    expect(amplitude).toBeGreaterThan(0);
  });

  it('should return values between 0 and 1', () => {
    const audio = createMockAudioData({
      generator: createSineWave(440, 0.8),
    });
    for (let frame = 0; frame < 60; frame++) {
      const amplitude = getAmplitudeEnvelope(audio, frame, 30);
      expect(amplitude).toBeGreaterThanOrEqual(0);
      expect(amplitude).toBeLessThanOrEqual(1);
    }
  });

  it('should reflect louder audio with higher amplitude', () => {
    const quietAudio = createMockAudioData({
      generator: createSineWave(440, 0.1),
    });
    const loudAudio = createMockAudioData({
      generator: createSineWave(440, 0.8),
    });
    const quietAmplitude = getAmplitudeEnvelope(quietAudio, 15, 30);
    const loudAmplitude = getAmplitudeEnvelope(loudAudio, 15, 30);
    expect(loudAmplitude).toBeGreaterThan(quietAmplitude);
  });

  it('should accept custom window size', () => {
    const audio = createMockAudioData({
      generator: createSineWave(440),
    });
    // Should not throw with custom window size
    const amplitude = getAmplitudeEnvelope(audio, 15, 30, 2048);
    expect(amplitude).toBeGreaterThanOrEqual(0);
    expect(amplitude).toBeLessThanOrEqual(1);
  });

  it('should handle frame beyond audio duration gracefully', () => {
    const audio = createMockAudioData({
      durationSeconds: 1,
      generator: createSineWave(440),
    });
    // Frame 90 at 30fps = 3 seconds, but audio is only 1 second
    const amplitude = getAmplitudeEnvelope(audio, 90, 30);
    expect(amplitude).toBeGreaterThanOrEqual(0);
    expect(amplitude).toBeLessThanOrEqual(1);
  });
});
