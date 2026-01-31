import { describe, it, expect } from 'vitest';
import {
  getCompositionDuration,
  getSceneAtFrame,
  validateSceneOrder,
  filterToCSS,
  filtersToCSS,
} from '../types';
import type {
  Template,
  Scene,
  Composition,
  Layer,
  ImageLayer,
  VideoLayer,
  TextLayer,
  ShapeLayer,
  AudioLayer,
  GroupLayer,
  LottieLayer,
  CustomLayer,
  LayerStyle,
  Filter,
} from '../types';

describe('Composition Utilities', () => {
  const createScene = (id: string, startFrame: number, endFrame: number): Scene => ({
    id,
    startFrame,
    endFrame,
    layers: [],
  });

  it('should calculate composition duration', () => {
    const composition: Composition = {
      scenes: [
        createScene('1', 0, 90),
        createScene('2', 90, 180),
        createScene('3', 180, 270),
      ],
    };

    expect(getCompositionDuration(composition)).toBe(270);
  });

  it('should return 0 for empty composition', () => {
    const composition: Composition = { scenes: [] };
    expect(getCompositionDuration(composition)).toBe(0);
  });

  it('should get scene at specific frame', () => {
    const composition: Composition = {
      scenes: [
        createScene('1', 0, 90),
        createScene('2', 90, 180),
        createScene('3', 180, 270),
      ],
    };

    expect(getSceneAtFrame(composition, 45)?.id).toBe('1');
    expect(getSceneAtFrame(composition, 90)?.id).toBe('2');
    expect(getSceneAtFrame(composition, 180)?.id).toBe('3');
    expect(getSceneAtFrame(composition, 269)?.id).toBe('3');
  });

  it('should return undefined for frame outside scenes', () => {
    const composition: Composition = {
      scenes: [createScene('1', 0, 90)],
    };

    expect(getSceneAtFrame(composition, -1)).toBeUndefined();
    expect(getSceneAtFrame(composition, 100)).toBeUndefined();
  });

  it('should validate scene order', () => {
    const validScenes = [
      createScene('1', 0, 90),
      createScene('2', 90, 180),
    ];
    expect(validateSceneOrder(validScenes)).toBe(true);
  });

  it('should detect overlapping scenes', () => {
    const overlappingScenes = [
      createScene('1', 0, 100),
      createScene('2', 50, 150), // Overlaps with scene 1
    ];
    expect(validateSceneOrder(overlappingScenes)).toBe(false);
  });

  it('should detect gap in scenes', () => {
    const gappedScenes = [
      createScene('1', 0, 90),
      createScene('2', 100, 180), // Gap from 90-100
    ];
    // Gaps are allowed
    expect(validateSceneOrder(gappedScenes)).toBe(true);
  });
});

describe('Layer Types', () => {
  it('should create valid image layer', () => {
    const layer: ImageLayer = {
      id: 'img-1',
      type: 'image',
      position: { x: 0, y: 0 },
      size: { width: 800, height: 600 },
      props: {
        src: 'https://example.com/image.jpg',
        fit: 'cover',
      },
    };

    expect(layer.type).toBe('image');
    expect(layer.props.src).toBeDefined();
  });

  it('should create valid video layer', () => {
    const layer: VideoLayer = {
      id: 'vid-1',
      type: 'video',
      position: { x: 0, y: 0 },
      size: { width: 1920, height: 1080 },
      props: {
        src: 'https://example.com/video.mp4',
        volume: 0.8,
        loop: true,
        muted: false,
      },
    };

    expect(layer.type).toBe('video');
    expect(layer.props.volume).toBe(0.8);
  });

  it('should create valid text layer', () => {
    const layer: TextLayer = {
      id: 'txt-1',
      type: 'text',
      position: { x: 100, y: 100 },
      size: { width: 800, height: 100 },
      props: {
        text: 'Hello World',
        fontSize: 48,
        fontWeight: 'bold',
        color: '#ffffff',
        textAlign: 'center',
        verticalAlign: 'middle',
      },
    };

    expect(layer.type).toBe('text');
    expect(layer.props.text).toBe('Hello World');
  });

  it('should create valid shape layer', () => {
    const layer: ShapeLayer = {
      id: 'shape-1',
      type: 'shape',
      position: { x: 100, y: 100 },
      size: { width: 200, height: 200 },
      props: {
        shape: 'rectangle',
        fill: '#3B82F6',
        stroke: '#1E40AF',
        strokeWidth: 2,
        borderRadius: 16,
      },
    };

    expect(layer.type).toBe('shape');
    expect(layer.props.shape).toBe('rectangle');
  });

  it('should create valid audio layer', () => {
    const layer: AudioLayer = {
      id: 'audio-1',
      type: 'audio',
      position: { x: 0, y: 0 },
      size: { width: 0, height: 0 },
      props: {
        src: 'https://example.com/audio.mp3',
        volume: 1,
        loop: false,
        fadeIn: 0.5,
        fadeOut: 1,
      },
    };

    expect(layer.type).toBe('audio');
    expect(layer.props.fadeIn).toBe(0.5);
  });

  it('should create valid group layer', () => {
    const childLayer: TextLayer = {
      id: 'child-1',
      type: 'text',
      position: { x: 0, y: 0 },
      size: { width: 200, height: 50 },
      props: { text: 'Child' },
    };

    const layer: GroupLayer = {
      id: 'group-1',
      type: 'group',
      position: { x: 100, y: 100 },
      size: { width: 400, height: 300 },
      props: {
        clip: true,
      },
      children: [childLayer],
    };

    expect(layer.type).toBe('group');
    expect(layer.children?.length).toBe(1);
  });

  it('should create valid lottie layer', () => {
    const layer: LottieLayer = {
      id: 'lottie-1',
      type: 'lottie',
      position: { x: 100, y: 100 },
      size: { width: 200, height: 200 },
      props: {
        data: 'https://example.com/animation.json',
        loop: true,
        speed: 1,
        direction: 1,
      },
    };

    expect(layer.type).toBe('lottie');
    expect(layer.props.loop).toBe(true);
  });

  it('should create valid custom layer', () => {
    const layer: CustomLayer = {
      id: 'custom-1',
      type: 'custom',
      position: { x: 100, y: 100 },
      size: { width: 400, height: 300 },
      customComponent: {
        name: 'MyChart',
        props: {
          data: [1, 2, 3, 4, 5],
          color: '#ff0000',
        },
      },
      props: {},
    };

    expect(layer.type).toBe('custom');
    expect(layer.customComponent?.name).toBe('MyChart');
  });
});

describe('Layer Style', () => {
  it('should create valid layer style with spacing', () => {
    const style: LayerStyle = {
      padding: 16,
      paddingX: 24,
      paddingY: 12,
      margin: 8,
      marginX: 16,
    };

    expect(style.padding).toBe(16);
    expect(style.paddingX).toBe(24);
  });

  it('should create valid layer style with borders', () => {
    const style: LayerStyle = {
      borderRadius: 'lg',
      borderWidth: 2,
      borderColor: '#000000',
      borderStyle: 'solid',
    };

    expect(style.borderRadius).toBe('lg');
    expect(style.borderStyle).toBe('solid');
  });

  it('should create valid layer style with background', () => {
    const style: LayerStyle = {
      backgroundColor: '#ffffff',
      backgroundGradient: {
        type: 'linear',
        from: '#ff0000',
        via: '#00ff00',
        to: '#0000ff',
        direction: 45,
      },
    };

    expect(style.backgroundColor).toBe('#ffffff');
    expect(style.backgroundGradient?.type).toBe('linear');
  });

  it('should create valid layer style with typography', () => {
    const style: LayerStyle = {
      fontFamily: 'Inter',
      fontSize: 24,
      fontWeight: 'bold',
      lineHeight: 1.5,
      letterSpacing: 1,
      textAlign: 'center',
      textColor: '#333333',
    };

    expect(style.fontWeight).toBe('bold');
    expect(style.textAlign).toBe('center');
  });

  it('should create valid layer style with effects', () => {
    const style: LayerStyle = {
      blur: 'md',
      brightness: 120,
      contrast: 90,
      grayscale: 50,
      saturate: 150,
      sepia: 10,
      hueRotate: 180,
    };

    expect(style.blur).toBe('md');
    expect(style.brightness).toBe(120);
  });

  it('should create valid layer style with layout', () => {
    const style: LayerStyle = {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      gap: 16,
    };

    expect(style.display).toBe('flex');
    expect(style.justifyContent).toBe('center');
  });
});

describe('Filters', () => {
  it('should convert blur filter to CSS', () => {
    const filter: Filter = { type: 'blur', value: 10 };
    expect(filterToCSS(filter)).toBe('blur(10px)');
  });

  it('should convert brightness filter to CSS', () => {
    const filter: Filter = { type: 'brightness', value: 1.5 };
    expect(filterToCSS(filter)).toBe('brightness(1.5)');
  });

  it('should convert contrast filter to CSS', () => {
    const filter: Filter = { type: 'contrast', value: 0.8 };
    expect(filterToCSS(filter)).toBe('contrast(0.8)');
  });

  it('should convert grayscale filter to CSS', () => {
    const filter: Filter = { type: 'grayscale', value: 100 };
    expect(filterToCSS(filter)).toBe('grayscale(100%)');
  });

  it('should convert hue-rotate filter to CSS', () => {
    const filter: Filter = { type: 'hue-rotate', value: 90 };
    expect(filterToCSS(filter)).toBe('hue-rotate(90deg)');
  });

  it('should convert saturate filter to CSS', () => {
    const filter: Filter = { type: 'saturate', value: 2 };
    expect(filterToCSS(filter)).toBe('saturate(2)');
  });

  it('should convert sepia filter to CSS', () => {
    const filter: Filter = { type: 'sepia', value: 50 };
    expect(filterToCSS(filter)).toBe('sepia(50%)');
  });

  it('should convert opacity filter to CSS', () => {
    const filter: Filter = { type: 'opacity', value: 0.75 };
    expect(filterToCSS(filter)).toBe('opacity(0.75)');
  });

  it('should convert invert filter to CSS', () => {
    const filter: Filter = { type: 'invert', value: 100 };
    expect(filterToCSS(filter)).toBe('invert(100%)');
  });

  it('should convert multiple filters to CSS', () => {
    const filters: Filter[] = [
      { type: 'blur', value: 5 },
      { type: 'brightness', value: 1.2 },
      { type: 'contrast', value: 1.1 },
    ];
    expect(filtersToCSS(filters)).toBe('blur(5px) brightness(1.2) contrast(1.1)');
  });

  it('should handle empty filter array', () => {
    expect(filtersToCSS([])).toBe('');
  });

  it('should convert drop-shadow filter to CSS', () => {
    const filter: Filter = { type: 'drop-shadow', value: '2px 4px 6px black' };
    expect(filterToCSS(filter)).toBe('drop-shadow(2px 4px 6px black)');
  });
});

describe('Template Structure', () => {
  it('should create valid minimal template', () => {
    const template: Template = {
      name: 'My Template',
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
    };

    expect(template.name).toBe('My Template');
    expect(template.output.type).toBe('video');
    expect(template.composition.scenes.length).toBe(1);
  });

  it('should create valid template with inputs', () => {
    const template: Template = {
      name: 'Template with Inputs',
      output: {
        type: 'video',
        width: 1920,
        height: 1080,
      },
      inputs: [
        {
          key: 'title',
          type: 'string',
          label: 'Title',
          required: true,
          default: 'Hello World',
        },
        {
          key: 'backgroundColor',
          type: 'color',
          label: 'Background Color',
          default: '#000000',
        },
        {
          key: 'imageUrl',
          type: 'image',
          label: 'Background Image',
        },
        {
          key: 'duration',
          type: 'number',
          label: 'Duration',
          validation: {
            min: 1,
            max: 60,
          },
        },
      ],
      defaults: {
        title: 'Default Title',
        backgroundColor: '#ffffff',
      },
      composition: {
        scenes: [],
      },
    };

    expect(template.inputs.length).toBe(4);
    expect(template.defaults?.title).toBe('Default Title');
  });

  it('should create valid image template', () => {
    const template: Template = {
      name: 'Image Template',
      output: {
        type: 'image',
        width: 1200,
        height: 630,
      },
      inputs: [],
      composition: {
        scenes: [
          {
            id: 'scene-1',
            startFrame: 0,
            endFrame: 1,
            layers: [
              {
                id: 'bg',
                type: 'shape',
                position: { x: 0, y: 0 },
                size: { width: 1200, height: 630 },
                props: {
                  shape: 'rectangle',
                  fill: '#3B82F6',
                },
              },
            ],
          },
        ],
      },
    };

    expect(template.output.type).toBe('image');
    expect(template.output.fps).toBeUndefined();
  });
});
