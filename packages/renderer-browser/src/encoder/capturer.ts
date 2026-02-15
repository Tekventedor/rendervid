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
 * Snapshot WebGL canvases from the live DOM and paint them onto matching
 * canvases in the html2canvas clone. This avoids touching the live DOM
 * (which would destroy the WebGL context).
 */
function snapshotWebGLCanvases(
  liveRoot: HTMLElement,
): Map<HTMLCanvasElement, ImageData> {
  const snapshots = new Map<HTMLCanvasElement, ImageData>();

  const canvases = liveRoot.querySelectorAll('canvas');
  for (const original of canvases) {
    // Get the existing WebGL context (do NOT create a new one)
    const gl =
      (original as any).__webglContext ??
      original.getContext('webgl2') ??
      original.getContext('webgl');
    if (!gl) continue;

    const w = original.width;
    const h = original.height;
    if (w === 0 || h === 0) continue;

    const pixels = new Uint8Array(w * h * 4);
    gl.readPixels(0, 0, w, h, gl.RGBA, gl.UNSIGNED_BYTE, pixels);

    // WebGL readPixels returns bottom-up; flip vertically
    const rowSize = w * 4;
    const tempRow = new Uint8Array(rowSize);
    for (let y = 0; y < Math.floor(h / 2); y++) {
      const topOffset = y * rowSize;
      const botOffset = (h - 1 - y) * rowSize;
      tempRow.set(pixels.subarray(topOffset, topOffset + rowSize));
      pixels.copyWithin(topOffset, botOffset, botOffset + rowSize);
      pixels.set(tempRow, botOffset);
    }

    const imageData = new ImageData(new Uint8ClampedArray(pixels.buffer), w, h);
    snapshots.set(original, imageData);
  }

  return snapshots;
}

/**
 * In the cloned document, find canvases that correspond to WebGL originals
 * and paint the snapshot data onto them (as 2D canvases).
 */
function applyWebGLSnapshots(
  liveRoot: HTMLElement,
  clonedRoot: HTMLElement,
  snapshots: Map<HTMLCanvasElement, ImageData>,
): void {
  if (snapshots.size === 0) return;

  const liveCanvases = Array.from(liveRoot.querySelectorAll('canvas'));
  const clonedCanvases = Array.from(clonedRoot.querySelectorAll('canvas'));

  for (let i = 0; i < liveCanvases.length; i++) {
    const imageData = snapshots.get(liveCanvases[i]);
    if (!imageData || !clonedCanvases[i]) continue;

    const clonedCanvas = clonedCanvases[i];
    clonedCanvas.width = imageData.width;
    clonedCanvas.height = imageData.height;
    const ctx = clonedCanvas.getContext('2d');
    if (ctx) {
      ctx.putImageData(imageData, 0, 0);
    }
  }
}

/**
 * Frame capturer using html2canvas for DOM-to-canvas conversion.
 */
export function createFrameCapturer(): FrameCapturer {
  async function captureFrame(options: CaptureOptions): Promise<CaptureResult> {
    const startTime = performance.now();

    // Snapshot WebGL canvases from the live DOM before html2canvas clones it
    const snapshots = snapshotWebGLCanvases(options.element);

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
      imageTimeout: 15000,
      removeContainer: true,
      onclone: (_doc: Document, clonedElement: HTMLElement) => {
        // Paint WebGL snapshots onto the cloned canvases
        applyWebGLSnapshots(options.element, clonedElement, snapshots);
      },
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
    console.error('OffscreenCanvas not supported, falling back to regular canvas');
    return createFrameCapturer();
  }

  // For now, we use the regular capturer since html2canvas doesn't support OffscreenCanvas
  // In the future, we could implement a custom DOM renderer for OffscreenCanvas
  return createFrameCapturer();
}
