/**
 * Minimal GIF89a/87a decoder.
 * Parses binary GIF data into frames with ImageData for canvas rendering.
 * No external dependencies — pure TypeScript.
 */

import type { GifMetadata, GifFrame } from '@rendervid/core';

/** Decoded GIF with frame image data. */
export interface DecodedGif {
  metadata: GifMetadata;
  frames: ImageData[];
}

/**
 * Decode a GIF from an ArrayBuffer.
 */
export function decodeGif(buffer: ArrayBuffer): DecodedGif {
  const data = new Uint8Array(buffer);
  let offset = 0;

  const read = (n: number): Uint8Array => {
    const slice = data.subarray(offset, offset + n);
    offset += n;
    return slice;
  };

  const readU8 = (): number => data[offset++];
  const readU16 = (): number => {
    const v = data[offset] | (data[offset + 1] << 8);
    offset += 2;
    return v;
  };

  // Header
  const sig = String.fromCharCode(...read(6));
  if (sig !== 'GIF87a' && sig !== 'GIF89a') {
    throw new Error(`Invalid GIF signature: ${sig}`);
  }

  // Logical Screen Descriptor
  const width = readU16();
  const height = readU16();
  const packed = readU8();
  const bgColorIndex = readU8();
  readU8(); // pixel aspect ratio

  const globalColorTableFlag = (packed >> 7) & 1;
  const globalColorTableSize = 1 << ((packed & 7) + 1);

  // Global Color Table
  let globalColorTable: Uint8Array | null = null;
  if (globalColorTableFlag) {
    globalColorTable = read(globalColorTableSize * 3);
  }

  const gifFrames: GifFrame[] = [];
  const frameImages: ImageData[] = [];

  // Composite canvas for frame disposal handling
  const canvas = new OffscreenCanvas(width, height);
  const ctx = canvas.getContext('2d')!;
  ctx.clearRect(0, 0, width, height);

  let prevCanvasState: ImageData | null = null;

  // Current frame state from GCE
  let delay = 100; // default 100ms
  let disposal = 0;
  let transparentIndex = -1;
  let hasTransparency = false;

  // Parse blocks
  while (offset < data.length) {
    const block = readU8();

    if (block === 0x3b) {
      // Trailer
      break;
    }

    if (block === 0x21) {
      // Extension
      const label = readU8();

      if (label === 0xf9) {
        // Graphics Control Extension
        readU8(); // block size (always 4)
        const gcePacked = readU8();
        delay = readU16() * 10; // centiseconds to ms
        if (delay === 0) delay = 100; // Default for 0-delay frames
        transparentIndex = readU8();
        readU8(); // terminator

        disposal = (gcePacked >> 2) & 7;
        hasTransparency = (gcePacked & 1) === 1;
      } else {
        // Skip other extensions (comment, application, etc.)
        skipSubBlocks();
      }
    } else if (block === 0x2c) {
      // Image Descriptor
      const frameX = readU16();
      const frameY = readU16();
      const frameW = readU16();
      const frameH = readU16();
      const imgPacked = readU8();

      const localColorTableFlag = (imgPacked >> 7) & 1;
      const interlaced = (imgPacked >> 6) & 1;
      const localColorTableSize = 1 << ((imgPacked & 7) + 1);

      let colorTable = globalColorTable;
      if (localColorTableFlag) {
        colorTable = read(localColorTableSize * 3);
      }

      if (!colorTable) {
        throw new Error('No color table available for frame');
      }

      // Handle disposal before drawing new frame
      if (disposal === 2) {
        // Restore to background
        ctx.clearRect(frameX, frameY, frameW, frameH);
      } else if (disposal === 3 && prevCanvasState) {
        // Restore to previous
        ctx.putImageData(prevCanvasState, 0, 0);
      }

      // Save state before drawing (for disposal method 3)
      if (disposal === 3) {
        prevCanvasState = ctx.getImageData(0, 0, width, height);
      }

      // LZW decode
      const minCodeSize = readU8();
      const compressedData = readSubBlocks();
      const pixels = lzwDecode(minCodeSize, compressedData, frameW * frameH);

      // Draw pixels onto canvas
      const frameImageData = ctx.createImageData(frameW, frameH);
      for (let i = 0; i < pixels.length; i++) {
        const colorIdx = pixels[i];
        if (hasTransparency && colorIdx === transparentIndex) {
          // Transparent pixel — leave as-is (0,0,0,0)
          continue;
        }
        const r = colorTable[colorIdx * 3];
        const g = colorTable[colorIdx * 3 + 1];
        const b = colorTable[colorIdx * 3 + 2];
        frameImageData.data[i * 4] = r;
        frameImageData.data[i * 4 + 1] = g;
        frameImageData.data[i * 4 + 2] = b;
        frameImageData.data[i * 4 + 3] = 255;
      }

      // Handle interlaced frames
      if (interlaced) {
        const deinterlaced = deinterlace(frameImageData, frameW, frameH);
        ctx.putImageData(deinterlaced, frameX, frameY);
      } else {
        ctx.putImageData(frameImageData, frameX, frameY);
      }

      // Capture the full composited frame
      const fullFrame = ctx.getImageData(0, 0, width, height);
      frameImages.push(fullFrame);

      gifFrames.push({
        index: gifFrames.length,
        delay,
        disposal,
      });

      // Reset per-frame state
      delay = 100;
      disposal = 0;
      transparentIndex = -1;
      hasTransparency = false;
    } else {
      // Unknown block, try to skip
      break;
    }
  }

  const totalDuration = gifFrames.reduce((sum, f) => sum + f.delay, 0);

  return {
    metadata: {
      width,
      height,
      frames: gifFrames,
      totalDuration,
      loopCount: 0, // Default infinite loop
    },
    frames: frameImages,
  };

  // ─── Helper functions ───

  function skipSubBlocks() {
    while (offset < data.length) {
      const size = readU8();
      if (size === 0) break;
      offset += size;
    }
  }

  function readSubBlocks(): Uint8Array {
    const chunks: Uint8Array[] = [];
    let totalSize = 0;
    while (offset < data.length) {
      const size = readU8();
      if (size === 0) break;
      chunks.push(data.subarray(offset, offset + size));
      totalSize += size;
      offset += size;
    }
    const result = new Uint8Array(totalSize);
    let pos = 0;
    for (const chunk of chunks) {
      result.set(chunk, pos);
      pos += chunk.length;
    }
    return result;
  }
}

/**
 * LZW decompression for GIF.
 */
function lzwDecode(minCodeSize: number, compressedData: Uint8Array, pixelCount: number): Uint8Array {
  const clearCode = 1 << minCodeSize;
  const eoiCode = clearCode + 1;

  let codeSize = minCodeSize + 1;
  let codeMask = (1 << codeSize) - 1;
  let nextCode = eoiCode + 1;

  // Code table: each entry is an array of color indices
  const table: number[][] = [];
  for (let i = 0; i < clearCode; i++) {
    table[i] = [i];
  }
  table[clearCode] = [];
  table[eoiCode] = [];

  const output = new Uint8Array(pixelCount);
  let outPos = 0;

  let bitPos = 0;
  let prevCode = -1;

  const readCode = (): number => {
    const bytePos = bitPos >> 3;
    const bitOffset = bitPos & 7;
    // Read up to 3 bytes to cover codes up to 12 bits
    let raw = compressedData[bytePos];
    if (bytePos + 1 < compressedData.length) raw |= compressedData[bytePos + 1] << 8;
    if (bytePos + 2 < compressedData.length) raw |= compressedData[bytePos + 2] << 16;
    bitPos += codeSize;
    return (raw >> bitOffset) & codeMask;
  };

  while (outPos < pixelCount) {
    const code = readCode();

    if (code === clearCode) {
      // Reset
      codeSize = minCodeSize + 1;
      codeMask = (1 << codeSize) - 1;
      nextCode = eoiCode + 1;
      table.length = eoiCode + 1;
      prevCode = -1;
      continue;
    }

    if (code === eoiCode) {
      break;
    }

    let entry: number[];
    if (code < nextCode) {
      entry = table[code];
    } else if (code === nextCode && prevCode >= 0) {
      entry = [...table[prevCode], table[prevCode][0]];
    } else {
      // Invalid code, bail out
      break;
    }

    // Output
    for (let i = 0; i < entry.length && outPos < pixelCount; i++) {
      output[outPos++] = entry[i];
    }

    // Add to table
    if (prevCode >= 0 && nextCode < 4096) {
      table[nextCode] = [...table[prevCode], entry[0]];
      nextCode++;

      if (nextCode > codeMask && codeSize < 12) {
        codeSize++;
        codeMask = (1 << codeSize) - 1;
      }
    }

    prevCode = code;
  }

  return output;
}

/**
 * Deinterlace an interlaced GIF frame.
 */
function deinterlace(imageData: ImageData, width: number, height: number): ImageData {
  const src = imageData.data;
  const dest = new Uint8ClampedArray(src.length);

  // GIF interlace passes: start row, row increment
  const passes = [
    [0, 8], // pass 1: every 8th row starting at 0
    [4, 8], // pass 2: every 8th row starting at 4
    [2, 4], // pass 3: every 4th row starting at 2
    [1, 2], // pass 4: every 2nd row starting at 1
  ];

  let srcRow = 0;
  for (const [start, step] of passes) {
    for (let y = start; y < height; y += step) {
      const srcOffset = srcRow * width * 4;
      const destOffset = y * width * 4;
      dest.set(src.subarray(srcOffset, srcOffset + width * 4), destOffset);
      srcRow++;
    }
  }

  return new ImageData(dest, width, height);
}
