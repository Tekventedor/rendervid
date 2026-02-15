import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  isWebCodecsSupported,
  getRecommendedCodec,
  createWebCodecsEncoder,
} from '../webcodecs';

describe('isWebCodecsSupported', () => {
  beforeEach(() => {
    // Clean up globals
    delete (global as any).VideoEncoder;
    delete (global as any).VideoFrame;
    delete (global as any).EncodedVideoChunk;
  });

  it('should return false when WebCodecs APIs are not available', () => {
    expect(isWebCodecsSupported()).toBe(false);
  });

  it('should return true when all WebCodecs APIs are available', () => {
    (global as any).VideoEncoder = function () {};
    (global as any).VideoFrame = function () {};
    (global as any).EncodedVideoChunk = function () {};
    expect(isWebCodecsSupported()).toBe(true);
  });

  it('should return false when only some APIs are available', () => {
    (global as any).VideoEncoder = function () {};
    // VideoFrame and EncodedVideoChunk are missing
    expect(isWebCodecsSupported()).toBe(false);
  });
});

describe('getRecommendedCodec', () => {
  it('should return H.264 Baseline for 1080p and below', () => {
    expect(getRecommendedCodec(1920, 1080)).toBe('avc1.42001f');
    expect(getRecommendedCodec(1280, 720)).toBe('avc1.42001f');
    expect(getRecommendedCodec(640, 480)).toBe('avc1.42001f');
  });

  it('should return H.264 High Profile for 4K', () => {
    expect(getRecommendedCodec(3840, 2160)).toBe('avc1.640028');
    expect(getRecommendedCodec(2560, 1440)).toBe('avc1.640028');
  });

  it('should return VP9 for larger than 4K', () => {
    expect(getRecommendedCodec(7680, 4320)).toBe('vp09.00.10.08');
    expect(getRecommendedCodec(5120, 2880)).toBe('vp09.00.10.08');
  });
});

describe('createWebCodecsEncoder', () => {
  it('should return an encoder object with all methods', () => {
    const encoder = createWebCodecsEncoder({
      width: 1920,
      height: 1080,
      fps: 30,
    });

    expect(encoder.isSupported).toBeTypeOf('function');
    expect(encoder.initialize).toBeTypeOf('function');
    expect(encoder.encodeFrame).toBeTypeOf('function');
    expect(encoder.flush).toBeTypeOf('function');
    expect(encoder.getChunks).toBeTypeOf('function');
    expect(encoder.close).toBeTypeOf('function');
    expect(encoder.getConfig).toBeTypeOf('function');
  });

  it('should return correct config', () => {
    const encoder = createWebCodecsEncoder({
      width: 1920,
      height: 1080,
      fps: 30,
      bitrate: 5_000_000,
      codec: 'avc1.42001f',
    });

    const config = encoder.getConfig();
    expect(config.width).toBe(1920);
    expect(config.height).toBe(1080);
    expect(config.framerate).toBe(30);
    expect(config.bitrate).toBe(5_000_000);
    expect(config.codec).toBe('avc1.42001f');
  });

  it('should use default bitrate when not specified', () => {
    const encoder = createWebCodecsEncoder({
      width: 1920,
      height: 1080,
      fps: 30,
    });
    const config = encoder.getConfig();
    // Default bitrate = width * height * fps * 0.1
    expect(config.bitrate).toBe(1920 * 1080 * 30 * 0.1);
  });

  it('should use recommended codec when not specified', () => {
    const encoder = createWebCodecsEncoder({
      width: 1920,
      height: 1080,
      fps: 30,
    });
    const config = encoder.getConfig();
    expect(config.codec).toBe('avc1.42001f');
  });

  it('should return false for isSupported when WebCodecs not available', () => {
    delete (global as any).VideoEncoder;
    const encoder = createWebCodecsEncoder({
      width: 1920,
      height: 1080,
      fps: 30,
    });
    expect(encoder.isSupported()).toBe(false);
  });

  it('should return empty chunks initially', () => {
    const encoder = createWebCodecsEncoder({
      width: 1920,
      height: 1080,
      fps: 30,
    });
    expect(encoder.getChunks()).toEqual([]);
  });

  it('should throw when initialize is called without WebCodecs support', async () => {
    delete (global as any).VideoEncoder;
    const encoder = createWebCodecsEncoder({
      width: 1920,
      height: 1080,
      fps: 30,
    });
    await expect(encoder.initialize()).rejects.toThrow('WebCodecs is not supported');
  });

  it('should throw when encodeFrame is called without initialization', async () => {
    const encoder = createWebCodecsEncoder({
      width: 1920,
      height: 1080,
      fps: 30,
    });
    await expect(encoder.encodeFrame({} as any, 0)).rejects.toThrow('Encoder not initialized');
  });

  it('should throw when flush is called without initialization', async () => {
    const encoder = createWebCodecsEncoder({
      width: 1920,
      height: 1080,
      fps: 30,
    });
    await expect(encoder.flush()).rejects.toThrow('Encoder not initialized');
  });

  it('should handle close gracefully when not initialized', () => {
    const encoder = createWebCodecsEncoder({
      width: 1920,
      height: 1080,
      fps: 30,
    });
    // Should not throw
    encoder.close();
    expect(encoder.getChunks()).toEqual([]);
  });

  it('should set hardware acceleration preference', () => {
    const encoder = createWebCodecsEncoder({
      width: 1920,
      height: 1080,
      fps: 30,
      hardwareAcceleration: 'prefer-software',
    });
    const config = encoder.getConfig();
    expect(config.hardwareAcceleration).toBe('prefer-software');
  });

  it('should set latency mode', () => {
    const encoder = createWebCodecsEncoder({
      width: 1920,
      height: 1080,
      fps: 30,
      latencyMode: 'realtime',
    });
    const config = encoder.getConfig();
    expect(config.latencyMode).toBe('realtime');
  });

  it('should include AVC format for H.264 codecs', () => {
    const encoder = createWebCodecsEncoder({
      width: 1920,
      height: 1080,
      fps: 30,
      codec: 'avc1.42001f',
    });
    const config = encoder.getConfig();
    expect(config.avc).toEqual({ format: 'avc' });
  });

  it('should not include AVC format for non-H.264 codecs', () => {
    const encoder = createWebCodecsEncoder({
      width: 1920,
      height: 1080,
      fps: 30,
      codec: 'vp09.00.10.08',
    });
    const config = encoder.getConfig();
    expect(config.avc).toBeUndefined();
  });
});
