import { describe, it, expect, vi } from 'vitest';
import {
  createWebMMuxer,
  arrayBufferToBlob,
  downloadBlob,
  downloadArrayBuffer,
} from '../muxer';

// Mock mp4-muxer since it requires browser APIs
vi.mock('mp4-muxer', () => ({
  Muxer: vi.fn().mockImplementation(() => ({
    addVideoChunk: vi.fn(),
    addAudioChunk: vi.fn(),
    finalize: vi.fn(),
  })),
  ArrayBufferTarget: vi.fn().mockImplementation(() => ({
    buffer: new ArrayBuffer(0),
  })),
}));

describe('createWebMMuxer', () => {
  it('should create a muxer with all methods', () => {
    const muxer = createWebMMuxer({ width: 1920, height: 1080, fps: 30 });

    expect(muxer.addVideoChunk).toBeTypeOf('function');
    expect(muxer.addAudioChunk).toBeTypeOf('function');
    expect(muxer.finalize).toBeTypeOf('function');
    expect(muxer.getEstimatedSize).toBeTypeOf('function');
  });

  it('should start with estimated size of 0', () => {
    const muxer = createWebMMuxer({ width: 1920, height: 1080, fps: 30 });
    expect(muxer.getEstimatedSize()).toBe(0);
  });

  it('should accumulate video chunks and update estimated size', () => {
    const muxer = createWebMMuxer({ width: 1920, height: 1080, fps: 30 });

    const chunk = {
      data: new Uint8Array([1, 2, 3, 4, 5]),
      timestamp: 0,
      duration: 33333,
      isKeyframe: true,
    };
    muxer.addVideoChunk(chunk);

    // Size should be > 0 after adding a chunk (with 10% overhead)
    expect(muxer.getEstimatedSize()).toBe(Math.ceil(5 * 1.1));
  });

  it('should accumulate audio chunks and update estimated size', () => {
    const muxer = createWebMMuxer({ width: 1920, height: 1080, fps: 30 });

    const audioChunk = {
      data: new Uint8Array([10, 20, 30]),
      timestamp: 0,
      duration: 10000,
    };
    muxer.addAudioChunk(audioChunk);

    expect(muxer.getEstimatedSize()).toBe(Math.ceil(3 * 1.1));
  });

  it('should combine video and audio sizes in estimate', () => {
    const muxer = createWebMMuxer({ width: 1920, height: 1080, fps: 30 });

    muxer.addVideoChunk({
      data: new Uint8Array(100),
      timestamp: 0,
      duration: 33333,
      isKeyframe: true,
    });

    muxer.addAudioChunk({
      data: new Uint8Array(50),
      timestamp: 0,
      duration: 10000,
    });

    expect(muxer.getEstimatedSize()).toBe(Math.ceil((100 + 50) * 1.1));
  });

  it('should return concatenated video data on finalize', () => {
    const muxer = createWebMMuxer({ width: 1920, height: 1080, fps: 30 });

    muxer.addVideoChunk({
      data: new Uint8Array([1, 2, 3]),
      timestamp: 0,
      duration: 33333,
      isKeyframe: true,
    });

    muxer.addVideoChunk({
      data: new Uint8Array([4, 5, 6]),
      timestamp: 33333,
      duration: 33333,
      isKeyframe: false,
    });

    const result = muxer.finalize();
    expect(result).toEqual(new Uint8Array([1, 2, 3, 4, 5, 6]));
  });
});

describe('arrayBufferToBlob', () => {
  it('should convert ArrayBuffer to Blob with correct MIME type', () => {
    const buffer = new Uint8Array([1, 2, 3]).buffer;
    const blob = arrayBufferToBlob(buffer, 'video/mp4');
    expect(blob).toBeInstanceOf(Blob);
    expect(blob.type).toBe('video/mp4');
    expect(blob.size).toBe(3);
  });
});

describe('downloadBlob', () => {
  it('should create a download link and trigger click', () => {
    const createObjectURLMock = vi.fn(() => 'blob:mock-url');
    const revokeObjectURLMock = vi.fn();
    const clickMock = vi.fn();

    global.URL.createObjectURL = createObjectURLMock;
    global.URL.revokeObjectURL = revokeObjectURLMock;

    const mockLink = {
      href: '',
      download: '',
      click: clickMock,
    };

    vi.spyOn(document, 'createElement').mockReturnValue(mockLink as any);

    const blob = new Blob(['test'], { type: 'video/mp4' });
    downloadBlob(blob, 'output.mp4');

    expect(createObjectURLMock).toHaveBeenCalledWith(blob);
    expect(mockLink.href).toBe('blob:mock-url');
    expect(mockLink.download).toBe('output.mp4');
    expect(clickMock).toHaveBeenCalled();
    expect(revokeObjectURLMock).toHaveBeenCalledWith('blob:mock-url');

    vi.restoreAllMocks();
  });
});

describe('downloadArrayBuffer', () => {
  it('should convert to blob and download', () => {
    const createObjectURLMock = vi.fn(() => 'blob:mock-url');
    const revokeObjectURLMock = vi.fn();
    const clickMock = vi.fn();

    global.URL.createObjectURL = createObjectURLMock;
    global.URL.revokeObjectURL = revokeObjectURLMock;

    const mockLink = {
      href: '',
      download: '',
      click: clickMock,
    };
    vi.spyOn(document, 'createElement').mockReturnValue(mockLink as any);

    const buffer = new Uint8Array([1, 2, 3]).buffer;
    downloadArrayBuffer(buffer, 'video.mp4', 'video/mp4');

    expect(clickMock).toHaveBeenCalled();
    expect(mockLink.download).toBe('video.mp4');

    vi.restoreAllMocks();
  });
});
