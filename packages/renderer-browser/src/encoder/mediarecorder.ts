export interface MediaRecorderEncoderOptions {
  /** Canvas to record from */
  canvas: HTMLCanvasElement;
  /** Frame rate */
  fps: number;
  /** Video bitrate in bits per second */
  videoBitrate?: number;
  /** Audio bitrate in bits per second */
  audioBitrate?: number;
  /** MIME type (default: 'video/webm;codecs=vp9') */
  mimeType?: string;
  /** Audio tracks to include */
  audioTracks?: MediaStreamTrack[];
}

export interface MediaRecorderEncoder {
  /** Check if the MIME type is supported */
  isSupported(): boolean;
  /** Start recording */
  start(): void;
  /** Stop recording */
  stop(): Promise<Blob>;
  /** Pause recording */
  pause(): void;
  /** Resume recording */
  resume(): void;
  /** Get current state */
  getState(): RecordingState;
  /** Add audio track */
  addAudioTrack(track: MediaStreamTrack): void;
}

/**
 * Get the best supported MIME type for video recording.
 */
export function getBestMimeType(): string {
  const types = [
    'video/webm;codecs=vp9,opus',
    'video/webm;codecs=vp9',
    'video/webm;codecs=vp8,opus',
    'video/webm;codecs=vp8',
    'video/webm',
    'video/mp4;codecs=avc1,mp4a.40.2',
    'video/mp4',
  ];

  for (const type of types) {
    if (MediaRecorder.isTypeSupported(type)) {
      return type;
    }
  }

  return 'video/webm';
}

/**
 * Check if MediaRecorder is supported.
 */
export function isMediaRecorderSupported(): boolean {
  return typeof MediaRecorder !== 'undefined';
}

/**
 * Create a MediaRecorder-based video encoder.
 * This is a fallback for browsers that don't support WebCodecs.
 */
export function createMediaRecorderEncoder(
  options: MediaRecorderEncoderOptions
): MediaRecorderEncoder {
  const {
    canvas,
    fps,
    videoBitrate = 5_000_000,
    audioBitrate = 128_000,
    mimeType = getBestMimeType(),
    audioTracks = [],
  } = options;

  let mediaRecorder: MediaRecorder | null = null;
  let stream: MediaStream | null = null;
  const chunks: Blob[] = [];

  function isSupported(): boolean {
    return isMediaRecorderSupported() && MediaRecorder.isTypeSupported(mimeType);
  }

  function createStream(): MediaStream {
    // Get video stream from canvas
    const videoStream = canvas.captureStream(fps);
    const combinedStream = new MediaStream();

    // Add video tracks
    for (const track of videoStream.getVideoTracks()) {
      combinedStream.addTrack(track);
    }

    // Add audio tracks
    for (const track of audioTracks) {
      combinedStream.addTrack(track);
    }

    return combinedStream;
  }

  function start(): void {
    if (mediaRecorder) {
      throw new Error('Recording already in progress');
    }

    stream = createStream();

    mediaRecorder = new MediaRecorder(stream, {
      mimeType,
      videoBitsPerSecond: videoBitrate,
      audioBitsPerSecond: audioBitrate,
    });

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        chunks.push(event.data);
      }
    };

    mediaRecorder.start(100); // Collect data every 100ms
  }

  function stop(): Promise<Blob> {
    return new Promise((resolve, reject) => {
      if (!mediaRecorder) {
        reject(new Error('No recording in progress'));
        return;
      }

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: mimeType });
        chunks.length = 0;

        // Stop all tracks
        if (stream) {
          for (const track of stream.getTracks()) {
            track.stop();
          }
          stream = null;
        }

        mediaRecorder = null;
        resolve(blob);
      };

      mediaRecorder.onerror = (event) => {
        reject(new Error(`MediaRecorder error: ${event}`));
      };

      mediaRecorder.stop();
    });
  }

  function pause(): void {
    if (mediaRecorder && mediaRecorder.state === 'recording') {
      mediaRecorder.pause();
    }
  }

  function resume(): void {
    if (mediaRecorder && mediaRecorder.state === 'paused') {
      mediaRecorder.resume();
    }
  }

  function getState(): RecordingState {
    return mediaRecorder?.state ?? 'inactive';
  }

  function addAudioTrack(track: MediaStreamTrack): void {
    if (stream) {
      stream.addTrack(track);
    } else {
      audioTracks.push(track);
    }
  }

  return {
    isSupported,
    start,
    stop,
    pause,
    resume,
    getState,
    addAudioTrack,
  };
}

/**
 * Create a canvas-based frame-by-frame recorder.
 * This provides more control over frame timing compared to MediaRecorder.
 */
export interface FrameByFrameRecorderOptions {
  /** Output width */
  width: number;
  /** Output height */
  height: number;
  /** Frame rate */
  fps: number;
  /** MIME type for frames (default: 'image/webp') */
  frameMimeType?: string;
  /** Frame quality (0-1) */
  frameQuality?: number;
}

export interface FrameByFrameRecorder {
  /** Add a frame */
  addFrame(canvas: HTMLCanvasElement): Promise<void>;
  /** Get all frames as blobs */
  getFrames(): Blob[];
  /** Get frame count */
  getFrameCount(): number;
  /** Clear all frames */
  clear(): void;
}

export function createFrameByFrameRecorder(
  options: FrameByFrameRecorderOptions
): FrameByFrameRecorder {
  const { frameMimeType = 'image/webp', frameQuality = 0.9 } = options;

  const frames: Blob[] = [];

  async function addFrame(canvas: HTMLCanvasElement): Promise<void> {
    return new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (blob) {
            frames.push(blob);
            resolve();
          } else {
            reject(new Error('Failed to create frame blob'));
          }
        },
        frameMimeType,
        frameQuality
      );
    });
  }

  function getFrames(): Blob[] {
    return [...frames];
  }

  function getFrameCount(): number {
    return frames.length;
  }

  function clear(): void {
    frames.length = 0;
  }

  return {
    addFrame,
    getFrames,
    getFrameCount,
    clear,
  };
}
