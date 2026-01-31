import html2canvas from 'html2canvas';

export interface CaptureOptions {
  /** Target element to capture */
  element: HTMLElement;
  /** Output width */
  width: number;
  /** Output height */
  height: number;
  /** Background color (default: transparent) */
  backgroundColor?: string;
  /** Scale factor for high-DPI capture */
  scale?: number;
  /** Whether to use CORS for images */
  useCORS?: boolean;
  /** Proxy URL for cross-origin images */
  proxy?: string;
}

export interface CaptureResult {
  /** Captured canvas element */
  canvas: HTMLCanvasElement;
  /** Capture time in milliseconds */
  captureTime: number;
}

export interface FrameCapturer {
  /** Capture a single frame */
  captureFrame(options: CaptureOptions): Promise<CaptureResult>;
  /** Capture frame as ImageData */
  captureFrameData(options: CaptureOptions): Promise<ImageData>;
  /** Capture frame as Blob */
  captureFrameBlob(options: CaptureOptions, format?: string, quality?: number): Promise<Blob>;
  /** Capture frame as data URL */
  captureFrameDataURL(options: CaptureOptions, format?: string, quality?: number): Promise<string>;
}

/**
 * Frame capturer using html2canvas for DOM-to-canvas conversion.
 */
export function createFrameCapturer(): FrameCapturer {
  async function captureFrame(options: CaptureOptions): Promise<CaptureResult> {
    const startTime = performance.now();

    const canvas = await html2canvas(options.element, {
      width: options.width,
      height: options.height,
      backgroundColor: options.backgroundColor ?? null,
      scale: options.scale ?? 1,
      useCORS: options.useCORS ?? true,
      proxy: options.proxy,
      logging: false,
      allowTaint: false,
      foreignObjectRendering: false,
      // Optimize for video rendering
      imageTimeout: 15000,
      removeContainer: true,
    });

    const captureTime = performance.now() - startTime;

    return { canvas, captureTime };
  }

  async function captureFrameData(options: CaptureOptions): Promise<ImageData> {
    const { canvas } = await captureFrame(options);
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Failed to get 2D context from canvas');
    }
    return ctx.getImageData(0, 0, canvas.width, canvas.height);
  }

  async function captureFrameBlob(
    options: CaptureOptions,
    format = 'image/png',
    quality = 0.95
  ): Promise<Blob> {
    const { canvas } = await captureFrame(options);
    return new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Failed to create blob from canvas'));
          }
        },
        format,
        quality
      );
    });
  }

  async function captureFrameDataURL(
    options: CaptureOptions,
    format = 'image/png',
    quality = 0.95
  ): Promise<string> {
    const { canvas } = await captureFrame(options);
    return canvas.toDataURL(format, quality);
  }

  return {
    captureFrame,
    captureFrameData,
    captureFrameBlob,
    captureFrameDataURL,
  };
}

/**
 * Optimized capturer using OffscreenCanvas for better performance.
 * Falls back to regular canvas if OffscreenCanvas is not supported.
 */
export function createOffscreenCapturer(): FrameCapturer {
  const supportsOffscreen = typeof OffscreenCanvas !== 'undefined';

  if (!supportsOffscreen) {
    console.warn('OffscreenCanvas not supported, falling back to regular canvas');
    return createFrameCapturer();
  }

  // For now, we use the regular capturer since html2canvas doesn't support OffscreenCanvas
  // In the future, we could implement a custom DOM renderer for OffscreenCanvas
  return createFrameCapturer();
}
