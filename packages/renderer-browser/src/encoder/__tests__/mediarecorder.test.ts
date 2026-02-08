import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  isMediaRecorderSupported,
  getBestMimeType,
  createFrameByFrameRecorder,
} from '../mediarecorder';

describe('isMediaRecorderSupported', () => {
  const originalMediaRecorder = (global as any).MediaRecorder;

  afterEach(() => {
    if (originalMediaRecorder) {
      (global as any).MediaRecorder = originalMediaRecorder;
    } else {
      delete (global as any).MediaRecorder;
    }
  });

  it('should return true when MediaRecorder is defined', () => {
    (global as any).MediaRecorder = function () {};
    expect(isMediaRecorderSupported()).toBe(true);
  });

  it('should return false when MediaRecorder is undefined', () => {
    delete (global as any).MediaRecorder;
    expect(isMediaRecorderSupported()).toBe(false);
  });
});

describe('getBestMimeType', () => {
  const originalMediaRecorder = (global as any).MediaRecorder;

  afterEach(() => {
    if (originalMediaRecorder) {
      (global as any).MediaRecorder = originalMediaRecorder;
    } else {
      delete (global as any).MediaRecorder;
    }
  });

  it('should return a supported MIME type', () => {
    (global as any).MediaRecorder = {
      isTypeSupported: vi.fn((type: string) => type === 'video/webm;codecs=vp9'),
    };
    expect(getBestMimeType()).toBe('video/webm;codecs=vp9');
  });

  it('should fallback to video/webm if no specific type is supported', () => {
    (global as any).MediaRecorder = {
      isTypeSupported: vi.fn(() => false),
    };
    expect(getBestMimeType()).toBe('video/webm');
  });

  it('should prefer vp9,opus first', () => {
    (global as any).MediaRecorder = {
      isTypeSupported: vi.fn((type: string) =>
        type === 'video/webm;codecs=vp9,opus' ||
        type === 'video/webm;codecs=vp8'
      ),
    };
    expect(getBestMimeType()).toBe('video/webm;codecs=vp9,opus');
  });
});

describe('createFrameByFrameRecorder', () => {
  it('should create a recorder with all methods', () => {
    const recorder = createFrameByFrameRecorder({
      width: 1920,
      height: 1080,
      fps: 30,
    });

    expect(recorder.addFrame).toBeTypeOf('function');
    expect(recorder.getFrames).toBeTypeOf('function');
    expect(recorder.getFrameCount).toBeTypeOf('function');
    expect(recorder.clear).toBeTypeOf('function');
  });

  it('should start with zero frames', () => {
    const recorder = createFrameByFrameRecorder({
      width: 1920,
      height: 1080,
      fps: 30,
    });
    expect(recorder.getFrameCount()).toBe(0);
    expect(recorder.getFrames()).toEqual([]);
  });

  it('should add frames via canvas.toBlob', async () => {
    const recorder = createFrameByFrameRecorder({
      width: 100,
      height: 100,
      fps: 30,
    });

    // Create a mock canvas that calls toBlob callback with a blob
    const mockCanvas = {
      toBlob: vi.fn((callback: (blob: Blob | null) => void, _type: string, _quality: number) => {
        callback(new Blob(['frame-data'], { type: 'image/webp' }));
      }),
    } as unknown as HTMLCanvasElement;

    await recorder.addFrame(mockCanvas);
    expect(recorder.getFrameCount()).toBe(1);
    expect(recorder.getFrames()).toHaveLength(1);
  });

  it('should reject if toBlob returns null', async () => {
    const recorder = createFrameByFrameRecorder({
      width: 100,
      height: 100,
      fps: 30,
    });

    const mockCanvas = {
      toBlob: vi.fn((callback: (blob: Blob | null) => void) => {
        callback(null);
      }),
    } as unknown as HTMLCanvasElement;

    await expect(recorder.addFrame(mockCanvas)).rejects.toThrow('Failed to create frame blob');
  });

  it('should accumulate multiple frames', async () => {
    const recorder = createFrameByFrameRecorder({
      width: 100,
      height: 100,
      fps: 30,
    });

    const mockCanvas = {
      toBlob: vi.fn((callback: (blob: Blob | null) => void) => {
        callback(new Blob(['data'], { type: 'image/webp' }));
      }),
    } as unknown as HTMLCanvasElement;

    await recorder.addFrame(mockCanvas);
    await recorder.addFrame(mockCanvas);
    await recorder.addFrame(mockCanvas);

    expect(recorder.getFrameCount()).toBe(3);
    expect(recorder.getFrames()).toHaveLength(3);
  });

  it('should clear all frames', async () => {
    const recorder = createFrameByFrameRecorder({
      width: 100,
      height: 100,
      fps: 30,
    });

    const mockCanvas = {
      toBlob: vi.fn((callback: (blob: Blob | null) => void) => {
        callback(new Blob(['data']));
      }),
    } as unknown as HTMLCanvasElement;

    await recorder.addFrame(mockCanvas);
    await recorder.addFrame(mockCanvas);
    expect(recorder.getFrameCount()).toBe(2);

    recorder.clear();
    expect(recorder.getFrameCount()).toBe(0);
    expect(recorder.getFrames()).toEqual([]);
  });

  it('should return a copy of frames array', async () => {
    const recorder = createFrameByFrameRecorder({
      width: 100,
      height: 100,
      fps: 30,
    });

    const mockCanvas = {
      toBlob: vi.fn((callback: (blob: Blob | null) => void) => {
        callback(new Blob(['data']));
      }),
    } as unknown as HTMLCanvasElement;

    await recorder.addFrame(mockCanvas);

    const frames1 = recorder.getFrames();
    const frames2 = recorder.getFrames();
    expect(frames1).not.toBe(frames2);
    expect(frames1).toEqual(frames2);
  });

  it('should use custom frameMimeType and frameQuality', async () => {
    const recorder = createFrameByFrameRecorder({
      width: 100,
      height: 100,
      fps: 30,
      frameMimeType: 'image/png',
      frameQuality: 1.0,
    });

    const mockCanvas = {
      toBlob: vi.fn((callback: (blob: Blob | null) => void, type: string, quality: number) => {
        // Verify the correct mime type and quality are passed
        expect(type).toBe('image/png');
        expect(quality).toBe(1.0);
        callback(new Blob(['data'], { type }));
      }),
    } as unknown as HTMLCanvasElement;

    await recorder.addFrame(mockCanvas);
    expect(recorder.getFrameCount()).toBe(1);
  });
});
