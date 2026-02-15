import type {
  Template,
  Layer,
  LayerType,
  AudioData,
  TextLayer,
  ImageLayer,
  VideoLayer,
  ShapeLayer,
  AudioLayer,
  GroupLayer,
  GifLayer,
} from '@rendervid/core';

/**
 * Options for creating mock audio data.
 */
export interface MockAudioOptions {
  /** Duration in seconds (default: 5) */
  duration?: number;
  /** Sample rate in Hz (default: 44100) */
  sampleRate?: number;
  /** Number of channels (default: 2) */
  channels?: number;
}

/**
 * Create mock audio data for testing audio-related features.
 *
 * Generates silent audio data with the specified parameters.
 * The channel data contains zeros (silence) by default.
 */
export function createMockAudioData(options?: MockAudioOptions): AudioData {
  const duration = options?.duration ?? 5;
  const sampleRate = options?.sampleRate ?? 44100;
  const channels = options?.channels ?? 2;
  const length = Math.floor(duration * sampleRate);

  const channelData: Float32Array[] = [];
  for (let i = 0; i < channels; i++) {
    channelData.push(new Float32Array(length));
  }

  return {
    channelData,
    sampleRate,
    numberOfChannels: channels,
    durationInSeconds: duration,
    length,
  };
}

/**
 * Create a mock template with sensible defaults.
 *
 * @param overrides - Partial template fields to override defaults
 * @returns A valid Template object
 */
export function createMockTemplate(overrides?: Partial<Template>): Template {
  return {
    name: 'Mock Template',
    output: {
      type: 'video',
      width: 1920,
      height: 1080,
      fps: 30,
      duration: 10,
    },
    inputs: [],
    composition: {
      scenes: [
        {
          id: 'scene-1',
          startFrame: 0,
          endFrame: 300,
          layers: [],
        },
      ],
    },
    ...overrides,
  };
}

/**
 * Create a mock layer of a given type with sensible defaults.
 *
 * @param type - The layer type to create
 * @param overrides - Partial layer fields to override defaults
 * @returns A valid Layer object of the specified type
 */
export function createMockLayer<T extends LayerType>(
  type: T,
  overrides?: Partial<Layer>
): Layer {
  const base = {
    id: `mock-${type}-${Date.now()}`,
    position: { x: 0, y: 0 },
    size: { width: 100, height: 100 },
    ...overrides,
  };

  switch (type) {
    case 'text':
      return {
        ...base,
        type: 'text',
        props: { text: 'Mock Text' },
        ...(overrides as Partial<TextLayer>),
      } as TextLayer;

    case 'image':
      return {
        ...base,
        type: 'image',
        props: { src: 'https://example.com/image.png' },
        ...(overrides as Partial<ImageLayer>),
      } as ImageLayer;

    case 'video':
      return {
        ...base,
        type: 'video',
        props: { src: 'https://example.com/video.mp4' },
        ...(overrides as Partial<VideoLayer>),
      } as VideoLayer;

    case 'shape':
      return {
        ...base,
        type: 'shape',
        props: { shape: 'rectangle', fill: '#ff0000' },
        ...(overrides as Partial<ShapeLayer>),
      } as ShapeLayer;

    case 'audio':
      return {
        ...base,
        type: 'audio',
        props: { src: 'https://example.com/audio.mp3' },
        ...(overrides as Partial<AudioLayer>),
      } as AudioLayer;

    case 'group':
      return {
        ...base,
        type: 'group',
        props: {},
        children: [],
        ...(overrides as Partial<GroupLayer>),
      } as GroupLayer;

    case 'gif':
      return {
        ...base,
        type: 'gif',
        props: { src: 'https://example.com/animation.gif' },
        ...(overrides as Partial<GifLayer>),
      } as GifLayer;

    case 'lottie':
      return {
        ...base,
        type: 'lottie',
        props: { data: {} },
        ...overrides,
      } as Layer;

    case 'custom':
      return {
        ...base,
        type: 'custom',
        props: {},
        customComponent: { name: 'MockComponent', props: {} },
        ...overrides,
      } as Layer;

    case 'three':
      return {
        ...base,
        type: 'three',
        props: {
          camera: { type: 'perspective', fov: 75, near: 0.1, far: 1000 },
          meshes: [],
        },
        ...overrides,
      } as Layer;

    default:
      return {
        ...base,
        type,
        props: {},
        ...overrides,
      } as Layer;
  }
}
