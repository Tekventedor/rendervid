/**
 * Minimal browser-side GIF encoder with LZW compression.
 * No external dependencies - self-contained implementation.
 *
 * Supports:
 * - Animated GIF generation from ImageData frames
 * - Configurable frame rate via delay
 * - Median cut color quantization (256 colors max)
 * - LZW compression per GIF spec
 */

export interface GifEncoderOptions {
  /** Width of the GIF in pixels */
  width: number;
  /** Height of the GIF in pixels */
  height: number;
  /** Frames per second */
  fps: number;
  /** Color quantization quality (1-30, lower = better quality but slower). Default: 10 */
  quality?: number;
}

export interface GifEncoder {
  /** Add a frame from ImageData */
  addFrame(imageData: ImageData): void;
  /** Finalize and return the GIF as a Blob */
  finish(): Blob;
}

/**
 * Create a GIF encoder instance.
 */
export function createGifEncoder(options: GifEncoderOptions): GifEncoder {
  const { width, height, fps, quality = 10 } = options;
  const delay = Math.round(100 / fps); // GIF delay is in centiseconds
  const sampleInterval = Math.max(1, Math.min(30, quality));

  const outputData: number[] = [];
  let frameIndex = 0;

  // --- Byte writing helpers ---

  function writeByte(b: number): void {
    outputData.push(b & 0xff);
  }

  function writeShort(s: number): void {
    writeByte(s & 0xff);
    writeByte((s >> 8) & 0xff);
  }

  function writeBytes(bytes: number[]): void {
    for (let i = 0; i < bytes.length; i++) {
      outputData.push(bytes[i]);
    }
  }

  function writeString(s: string): void {
    for (let i = 0; i < s.length; i++) {
      outputData.push(s.charCodeAt(i));
    }
  }

  // --- Color quantization (median cut) ---

  interface ColorBox {
    colors: number[][];
    rMin: number;
    rMax: number;
    gMin: number;
    gMax: number;
    bMin: number;
    bMax: number;
  }

  function computeBox(colors: number[][]): ColorBox {
    let rMin = 255, rMax = 0, gMin = 255, gMax = 0, bMin = 255, bMax = 0;
    for (let i = 0; i < colors.length; i++) {
      const c = colors[i];
      if (c[0] < rMin) rMin = c[0];
      if (c[0] > rMax) rMax = c[0];
      if (c[1] < gMin) gMin = c[1];
      if (c[1] > gMax) gMax = c[1];
      if (c[2] < bMin) bMin = c[2];
      if (c[2] > bMax) bMax = c[2];
    }
    return { colors, rMin, rMax, gMin, gMax, bMin, bMax };
  }

  function splitBox(box: ColorBox): [ColorBox, ColorBox] {
    const rRange = box.rMax - box.rMin;
    const gRange = box.gMax - box.gMin;
    const bRange = box.bMax - box.bMin;

    let sortIndex: number;
    if (rRange >= gRange && rRange >= bRange) {
      sortIndex = 0;
    } else if (gRange >= rRange && gRange >= bRange) {
      sortIndex = 1;
    } else {
      sortIndex = 2;
    }

    box.colors.sort((a, b) => a[sortIndex] - b[sortIndex]);
    const mid = Math.floor(box.colors.length / 2);
    return [
      computeBox(box.colors.slice(0, mid)),
      computeBox(box.colors.slice(mid)),
    ];
  }

  function medianCut(pixels: Uint8ClampedArray, numColors: number, sample: number): number[][] {
    // Sample pixels
    const colors: number[][] = [];
    for (let i = 0; i < pixels.length; i += 4 * sample) {
      colors.push([pixels[i], pixels[i + 1], pixels[i + 2]]);
    }

    if (colors.length === 0) {
      // Return a black palette if no pixels
      const palette: number[][] = [];
      for (let i = 0; i < numColors; i++) {
        palette.push([0, 0, 0]);
      }
      return palette;
    }

    // Start with one box containing all colors
    let boxes: ColorBox[] = [computeBox(colors)];

    // Split boxes until we have enough
    while (boxes.length < numColors) {
      // Find the box with the largest volume to split
      let maxVolume = -1;
      let maxIndex = 0;
      for (let i = 0; i < boxes.length; i++) {
        const b = boxes[i];
        if (b.colors.length < 2) continue;
        const volume = (b.rMax - b.rMin) * (b.gMax - b.gMin) * (b.bMax - b.bMin);
        if (volume > maxVolume) {
          maxVolume = volume;
          maxIndex = i;
        }
      }

      if (maxVolume <= 0 || boxes[maxIndex].colors.length < 2) break;

      const [a, b] = splitBox(boxes[maxIndex]);
      boxes.splice(maxIndex, 1, a, b);
    }

    // Compute average color per box
    const palette: number[][] = [];
    for (const box of boxes) {
      let rSum = 0, gSum = 0, bSum = 0;
      for (const c of box.colors) {
        rSum += c[0];
        gSum += c[1];
        bSum += c[2];
      }
      const n = box.colors.length;
      palette.push([
        Math.round(rSum / n),
        Math.round(gSum / n),
        Math.round(bSum / n),
      ]);
    }

    // Pad palette to numColors
    while (palette.length < numColors) {
      palette.push([0, 0, 0]);
    }

    return palette;
  }

  function findClosestColor(palette: number[][], r: number, g: number, b: number): number {
    let minDist = Infinity;
    let minIndex = 0;
    for (let i = 0; i < palette.length; i++) {
      const pr = palette[i][0];
      const pg = palette[i][1];
      const pb = palette[i][2];
      const dist = (r - pr) * (r - pr) + (g - pg) * (g - pg) + (b - pb) * (b - pb);
      if (dist < minDist) {
        minDist = dist;
        minIndex = i;
        if (dist === 0) break;
      }
    }
    return minIndex;
  }

  function indexPixels(pixels: Uint8ClampedArray, palette: number[][]): Uint8Array {
    const numPixels = pixels.length / 4;
    const indexed = new Uint8Array(numPixels);
    for (let i = 0; i < numPixels; i++) {
      const offset = i * 4;
      indexed[i] = findClosestColor(
        palette,
        pixels[offset],
        pixels[offset + 1],
        pixels[offset + 2]
      );
    }
    return indexed;
  }

  // --- LZW Compression ---

  function lzwEncode(indexedPixels: Uint8Array, colorDepth: number): number[] {
    const minCodeSize = Math.max(2, colorDepth);
    const clearCode = 1 << minCodeSize;
    const eoiCode = clearCode + 1;

    let codeSize = minCodeSize + 1;
    let nextCode = eoiCode + 1;
    const maxCodeSize = 12;
    const maxCode = 1 << maxCodeSize;

    // Use a Map for the code table: key is a string representation
    const codeTable = new Map<string, number>();

    // Initialize code table with single-character codes
    function initTable(): void {
      codeTable.clear();
      for (let i = 0; i < clearCode; i++) {
        codeTable.set(String(i), i);
      }
      nextCode = eoiCode + 1;
      codeSize = minCodeSize + 1;
    }

    // Bit packing
    const output: number[] = [];
    let bitBuffer = 0;
    let bitCount = 0;

    function emitCode(code: number): void {
      bitBuffer |= code << bitCount;
      bitCount += codeSize;

      while (bitCount >= 8) {
        output.push(bitBuffer & 0xff);
        bitBuffer >>= 8;
        bitCount -= 8;
      }
    }

    initTable();
    emitCode(clearCode);

    if (indexedPixels.length === 0) {
      emitCode(eoiCode);
      if (bitCount > 0) {
        output.push(bitBuffer & 0xff);
      }
      return output;
    }

    let current = String(indexedPixels[0]);

    for (let i = 1; i < indexedPixels.length; i++) {
      const pixel = indexedPixels[i];
      const combined = current + ',' + pixel;

      if (codeTable.has(combined)) {
        current = combined;
      } else {
        emitCode(codeTable.get(current)!);

        if (nextCode < maxCode) {
          codeTable.set(combined, nextCode);
          nextCode++;

          if (nextCode > (1 << codeSize) && codeSize < maxCodeSize) {
            codeSize++;
          }
        } else {
          // Table full, emit clear code and reset
          emitCode(clearCode);
          initTable();
        }

        current = String(pixel);
      }
    }

    // Emit the last code
    emitCode(codeTable.get(current)!);
    emitCode(eoiCode);

    // Flush remaining bits
    if (bitCount > 0) {
      output.push(bitBuffer & 0xff);
    }

    return output;
  }

  function writeSubBlocks(data: number[]): void {
    let offset = 0;
    while (offset < data.length) {
      const blockSize = Math.min(255, data.length - offset);
      writeByte(blockSize);
      for (let i = 0; i < blockSize; i++) {
        writeByte(data[offset + i]);
      }
      offset += blockSize;
    }
    writeByte(0); // Block terminator
  }

  // --- GIF structure writing ---

  function writeHeader(): void {
    writeString('GIF89a');
  }

  function writeLogicalScreenDescriptor(palette: number[][]): void {
    writeShort(width);
    writeShort(height);

    // Packed field: global color table flag (1), color resolution (7), sort flag (0), size of GCT (7)
    // 8 bits per color channel, 256 colors = size field of 7 (2^(7+1) = 256)
    const packed = 0x80 | // Global Color Table flag
                   (7 << 4) | // Color resolution (8 bits)
                   0x00 | // Sort flag
                   7; // Size of Global Color Table (log2(256) - 1)
    writeByte(packed);
    writeByte(0); // Background color index
    writeByte(0); // Pixel aspect ratio

    // Write Global Color Table
    for (let i = 0; i < 256; i++) {
      if (i < palette.length) {
        writeByte(palette[i][0]);
        writeByte(palette[i][1]);
        writeByte(palette[i][2]);
      } else {
        writeByte(0);
        writeByte(0);
        writeByte(0);
      }
    }
  }

  function writeNetscapeExt(): void {
    writeByte(0x21); // Extension introducer
    writeByte(0xff); // Application extension label
    writeByte(11); // Block size
    writeString('NETSCAPE2.0');
    writeByte(3); // Sub-block size
    writeByte(1); // Sub-block ID
    writeShort(0); // Loop count (0 = infinite)
    writeByte(0); // Block terminator
  }

  function writeGraphicControlExt(): void {
    writeByte(0x21); // Extension introducer
    writeByte(0xf9); // Graphic Control Label
    writeByte(4); // Block size
    writeByte(0x00); // Packed byte: no disposal, no user input, no transparency
    writeShort(delay); // Delay time in centiseconds
    writeByte(0); // Transparent color index
    writeByte(0); // Block terminator
  }

  function writeImageDescriptor(): void {
    writeByte(0x2c); // Image separator
    writeShort(0); // Left
    writeShort(0); // Top
    writeShort(width);
    writeShort(height);
    writeByte(0x00); // Packed byte: no local color table, not interlaced
  }

  function writeImageData(indexedPixels: Uint8Array): void {
    const minCodeSize = 8; // 256 colors
    writeByte(minCodeSize);

    const lzwData = lzwEncode(indexedPixels, minCodeSize);
    writeSubBlocks(lzwData);
  }

  function writeTrailer(): void {
    writeByte(0x3b); // GIF Trailer
  }

  // --- Public API ---

  let globalPalette: number[][] | null = null;
  let headerWritten = false;

  return {
    addFrame(imageData: ImageData): void {
      const pixels = imageData.data;

      if (frameIndex === 0) {
        // Build global palette from first frame
        globalPalette = medianCut(pixels, 256, sampleInterval);

        writeHeader();
        writeLogicalScreenDescriptor(globalPalette);
        writeNetscapeExt();
        headerWritten = true;
      }

      if (!globalPalette || !headerWritten) {
        throw new Error('GIF encoder: header not written');
      }

      // Map pixels to palette indices
      const indexedPixels = indexPixels(pixels, globalPalette);

      // Write frame
      writeGraphicControlExt();
      writeImageDescriptor();
      writeImageData(indexedPixels);

      frameIndex++;
    },

    finish(): Blob {
      if (frameIndex === 0) {
        throw new Error('GIF encoder: no frames added');
      }

      writeTrailer();

      const buffer = new Uint8Array(outputData);
      return new Blob([buffer], { type: 'image/gif' });
    },
  };
}
