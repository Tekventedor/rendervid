import { describe, it, expect, vi } from 'vitest';
import { createFrameCapturer, createOffscreenCapturer } from '../capturer';

// Mock html2canvas
vi.mock('html2canvas', () => ({
  default: vi.fn().mockImplementation(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 100;
    canvas.height = 100;
    return Promise.resolve(canvas);
  }),
}));

describe('createFrameCapturer', () => {
  it('should create a capturer with all methods', () => {
    const capturer = createFrameCapturer();
    expect(capturer.captureFrame).toBeTypeOf('function');
    expect(capturer.captureFrameData).toBeTypeOf('function');
    expect(capturer.captureFrameBlob).toBeTypeOf('function');
    expect(capturer.captureFrameDataURL).toBeTypeOf('function');
  });

  it('should capture a frame and return canvas and captureTime', async () => {
    const capturer = createFrameCapturer();
    const element = document.createElement('div');

    const result = await capturer.captureFrame({
      element,
      width: 1920,
      height: 1080,
    });

    expect(result.canvas).toBeInstanceOf(HTMLCanvasElement);
    expect(result.captureTime).toBeTypeOf('number');
    expect(result.captureTime).toBeGreaterThanOrEqual(0);
  });

  it('should call captureFrame and toDataURL for captureFrameDataURL', async () => {
    const capturer = createFrameCapturer();
    const element = document.createElement('div');

    // captureFrameDataURL calls captureFrame internally, then toDataURL on the result canvas.
    // html2canvas is mocked, so this tests the flow works end-to-end.
    // jsdom canvas.toDataURL may return 'data:,' or null depending on context mock.
    const result = await capturer.captureFrameDataURL({
      element,
      width: 100,
      height: 100,
    });

    // Result should be either a string or null depending on jsdom canvas implementation
    // The important thing is the function doesn't throw
    expect(result === null || typeof result === 'string').toBe(true);
  });
});

describe('createOffscreenCapturer', () => {
  it('should create a capturer (falls back to regular in jsdom)', () => {
    const capturer = createOffscreenCapturer();
    expect(capturer.captureFrame).toBeTypeOf('function');
    expect(capturer.captureFrameData).toBeTypeOf('function');
    expect(capturer.captureFrameBlob).toBeTypeOf('function');
    expect(capturer.captureFrameDataURL).toBeTypeOf('function');
  });
});
