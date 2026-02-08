import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock external dependencies
vi.mock('html2canvas', () => ({
  default: vi.fn().mockResolvedValue(document.createElement('canvas')),
}));

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

vi.mock('@rendervid/core', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@rendervid/core')>();
  return {
    ...actual,
    getDefaultRegistry: vi.fn(() => ({
      register: vi.fn(),
      get: vi.fn(),
      list: vi.fn(() => []),
      has: vi.fn(() => false),
    })),
    TemplateProcessor: class MockTemplateProcessor {
      loadCustomComponents = vi.fn().mockResolvedValue(undefined);
      resolveInputs = vi.fn((t: any) => t);
    },
    FontManager: class MockFontManager {
      loadFonts = vi.fn().mockResolvedValue({ loaded: [], failed: [], loadTime: 0 });
    },
  };
});

import { BrowserRenderer, createBrowserRenderer } from '../BrowserRenderer';

describe('BrowserRenderer', () => {
  it('should create an instance', () => {
    const renderer = new BrowserRenderer();
    expect(renderer).toBeInstanceOf(BrowserRenderer);
  });

  it('should create instance with custom container', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    const renderer = new BrowserRenderer({ container });
    expect(renderer).toBeInstanceOf(BrowserRenderer);
    document.body.removeChild(container);
  });

  it('should expose getRegistry', () => {
    const renderer = new BrowserRenderer();
    const registry = renderer.getRegistry();
    expect(registry).toBeTruthy();
    expect(registry.register).toBeTypeOf('function');
  });

  it('should register custom components', () => {
    const renderer = new BrowserRenderer();
    const mockComponent = () => null;
    renderer.registerComponent('MyComponent', mockComponent);
    expect(renderer.getRegistry().register).toHaveBeenCalled();
  });

  it('should check WebCodecs support', () => {
    const renderer = new BrowserRenderer();
    // In jsdom, WebCodecs is not available
    expect(renderer.isWebCodecsSupported()).toBe(false);
  });

  it('should throw if renderVideo is called while already rendering', async () => {
    const renderer = new BrowserRenderer();

    // Access private isRendering via any
    (renderer as any).isRendering = true;

    await expect(
      renderer.renderVideo({
        template: {
          output: { width: 1920, height: 1080, fps: 30 },
          composition: { scenes: [] },
        } as any,
      })
    ).rejects.toThrow('Renderer is already rendering');
  });

  it('should throw if renderImage is called while already rendering', async () => {
    const renderer = new BrowserRenderer();
    (renderer as any).isRendering = true;

    await expect(
      renderer.renderImage({
        template: {
          output: { width: 1920, height: 1080, fps: 30 },
          composition: { scenes: [{ id: 's1', startFrame: 0, endFrame: 30, layers: [] }] },
        } as any,
      })
    ).rejects.toThrow('Renderer is already rendering');
  });

  it('should dispose without error', () => {
    const renderer = new BrowserRenderer();
    expect(() => renderer.dispose()).not.toThrow();
  });

  it('should dispose with an active root', () => {
    const renderer = new BrowserRenderer();
    // Simulate having a root
    (renderer as any).root = {
      unmount: vi.fn(),
    };
    renderer.dispose();
    expect((renderer as any).root).toBeNull();
  });
});

describe('createBrowserRenderer', () => {
  it('should create a BrowserRenderer instance', () => {
    const renderer = createBrowserRenderer();
    expect(renderer).toBeInstanceOf(BrowserRenderer);
  });

  it('should pass options to the constructor', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    const renderer = createBrowserRenderer({ container });
    expect(renderer).toBeInstanceOf(BrowserRenderer);
    document.body.removeChild(container);
  });
});
