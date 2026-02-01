# Browser Encoder Utilities

Low-level encoding utilities for advanced use cases.

## Frame Capturing

### createFrameCapturer

Create a frame capturer for capturing canvas frames.

```typescript
import { createFrameCapturer } from '@rendervid/renderer-browser';

const capturer = createFrameCapturer({
  canvas: myCanvas,
  fps: 30,
  format: 'png',
});

// Capture a frame
const frame = await capturer.capture();

// Dispose
capturer.dispose();
```

### CaptureOptions

```typescript
interface CaptureOptions {
  canvas: HTMLCanvasElement;
  fps?: number;
  format?: 'png' | 'jpeg' | 'webp';
  quality?: number;
}
```

## WebCodecs Encoder

### createWebCodecsEncoder

Create a WebCodecs-based video encoder for high-performance encoding.

```typescript
import {
  createWebCodecsEncoder,
  isWebCodecsSupported,
} from '@rendervid/renderer-browser';

if (!isWebCodecsSupported()) {
  throw new Error('WebCodecs not supported');
}

const encoder = await createWebCodecsEncoder({
  width: 1920,
  height: 1080,
  fps: 30,
  codec: 'avc1.42001E',  // H.264
  bitrate: 5_000_000,
});

// Encode frames
for (const frameData of frames) {
  await encoder.encodeFrame(frameData, timestamp);
}

// Finish and get output
const chunks = await encoder.finish();

encoder.dispose();
```

### WebCodecsEncoderOptions

```typescript
interface WebCodecsEncoderOptions {
  width: number;
  height: number;
  fps: number;
  codec: string;
  bitrate?: number;
  hardwareAcceleration?: 'prefer-hardware' | 'prefer-software' | 'no-preference';
  latencyMode?: 'quality' | 'realtime';
}
```

### Supported Codecs

| Codec ID | Format | Description |
|----------|--------|-------------|
| `avc1.42001E` | H.264 | Baseline profile |
| `avc1.4D001E` | H.264 | Main profile |
| `avc1.64001E` | H.264 | High profile |
| `vp8` | VP8 | WebM |
| `vp09.00.10.08` | VP9 | WebM |

### canvasToVideoFrame

Convert canvas to VideoFrame.

```typescript
import { canvasToVideoFrame } from '@rendervid/renderer-browser';

const videoFrame = canvasToVideoFrame(canvas, {
  timestamp: 0,
  duration: 33333,  // microseconds (30fps)
});
```

## MediaRecorder Encoder

### createMediaRecorderEncoder

Create a MediaRecorder-based encoder (fallback for browsers without WebCodecs).

```typescript
import { createMediaRecorderEncoder } from '@rendervid/renderer-browser';

const encoder = createMediaRecorderEncoder({
  canvas: myCanvas,
  mimeType: 'video/webm; codecs=vp8',
  videoBitsPerSecond: 5_000_000,
});

// Start recording
encoder.start();

// Draw frames to canvas...
await drawFrame(0);
await new Promise(r => setTimeout(r, 33)); // Wait for frame time

// Stop and get output
const blob = await encoder.stop();
```

### MediaRecorderEncoderOptions

```typescript
interface MediaRecorderEncoderOptions {
  canvas: HTMLCanvasElement;
  mimeType?: string;
  videoBitsPerSecond?: number;
  audioBitsPerSecond?: number;
}
```

### getBestMimeType

Get the best supported MIME type.

```typescript
import { getBestMimeType } from '@rendervid/renderer-browser';

const mimeType = getBestMimeType();
// Returns: 'video/webm; codecs=vp9' or 'video/webm; codecs=vp8' etc.
```

### isMediaRecorderSupported

Check MediaRecorder support.

```typescript
import { isMediaRecorderSupported } from '@rendervid/renderer-browser';

if (isMediaRecorderSupported('video/webm')) {
  console.log('WebM recording supported');
}
```

## Muxers

### createMp4Muxer

Create an MP4 muxer for combining video and audio.

```typescript
import { createMp4Muxer } from '@rendervid/renderer-browser';

const muxer = createMp4Muxer({
  width: 1920,
  height: 1080,
  fps: 30,
});

// Add video chunks
for (const chunk of videoChunks) {
  muxer.addVideoChunk(chunk);
}

// Add audio chunks (optional)
for (const chunk of audioChunks) {
  muxer.addAudioChunk(chunk);
}

// Finalize
const mp4Data = await muxer.finalize();
```

### createWebMMuxer

Create a WebM muxer.

```typescript
import { createWebMMuxer } from '@rendervid/renderer-browser';

const muxer = createWebMMuxer({
  width: 1920,
  height: 1080,
  fps: 30,
  videoCodec: 'vp9',
});

// Add chunks and finalize...
```

### MuxerOptions

```typescript
interface MuxerOptions {
  width: number;
  height: number;
  fps: number;
  videoCodec?: string;
  audioCodec?: string;
  audioBitrate?: number;
}
```

## Utility Functions

### downloadBlob

Download a blob as a file.

```typescript
import { downloadBlob } from '@rendervid/renderer-browser';

downloadBlob(videoBlob, 'my-video.mp4');
```

### downloadArrayBuffer

Download an ArrayBuffer as a file.

```typescript
import { downloadArrayBuffer } from '@rendervid/renderer-browser';

downloadArrayBuffer(mp4Data, 'my-video.mp4', 'video/mp4');
```

### blobToArrayBuffer

Convert Blob to ArrayBuffer.

```typescript
import { blobToArrayBuffer } from '@rendervid/renderer-browser';

const arrayBuffer = await blobToArrayBuffer(blob);
```

### arrayBufferToBlob

Convert ArrayBuffer to Blob.

```typescript
import { arrayBufferToBlob } from '@rendervid/renderer-browser';

const blob = arrayBufferToBlob(arrayBuffer, 'video/mp4');
```

## Advanced Example: Custom Encoding Pipeline

```typescript
import {
  createFrameCapturer,
  createWebCodecsEncoder,
  createMp4Muxer,
  isWebCodecsSupported,
  downloadArrayBuffer,
} from '@rendervid/renderer-browser';

async function customRender(template, inputs) {
  // Setup canvas
  const canvas = document.createElement('canvas');
  canvas.width = template.output.width;
  canvas.height = template.output.height;
  const ctx = canvas.getContext('2d');

  // Check WebCodecs support
  if (!isWebCodecsSupported()) {
    throw new Error('WebCodecs required');
  }

  // Create encoder
  const encoder = await createWebCodecsEncoder({
    width: template.output.width,
    height: template.output.height,
    fps: template.output.fps,
    codec: 'avc1.64001E',  // H.264 High Profile
    bitrate: 8_000_000,
    hardwareAcceleration: 'prefer-hardware',
  });

  // Create muxer
  const muxer = createMp4Muxer({
    width: template.output.width,
    height: template.output.height,
    fps: template.output.fps,
  });

  // Render each frame
  const totalFrames = template.output.fps * template.output.duration;
  const frameDuration = 1_000_000 / template.output.fps;  // microseconds

  for (let frame = 0; frame < totalFrames; frame++) {
    // Render frame to canvas
    await renderFrameToCanvas(ctx, template, inputs, frame);

    // Encode frame
    const timestamp = frame * frameDuration;
    const chunks = await encoder.encodeFrame(canvas, timestamp);

    // Add to muxer
    for (const chunk of chunks) {
      muxer.addVideoChunk(chunk);
    }

    // Progress callback
    console.log(`Frame ${frame + 1}/${totalFrames}`);
  }

  // Finish encoding
  const finalChunks = await encoder.finish();
  for (const chunk of finalChunks) {
    muxer.addVideoChunk(chunk);
  }

  // Finalize muxer
  const mp4Data = await muxer.finalize();

  // Cleanup
  encoder.dispose();

  // Download
  downloadArrayBuffer(mp4Data, 'custom-render.mp4', 'video/mp4');

  return mp4Data;
}
```

## Related Documentation

- [BrowserRenderer](/api/renderer-browser/renderer) - High-level renderer
- [NodeRenderer](/api/renderer-node/renderer) - Server-side rendering
