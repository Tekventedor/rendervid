import { describe, it, expect } from 'vitest';
import {
  ComponentDefaultsManager,
  createDefaultComponentDefaultsManager,
  type FrameAwareProps,
} from '../component-defaults';

const makeFrameData = (overrides: Partial<FrameAwareProps> = {}): FrameAwareProps => ({
  frame: 0,
  fps: 30,
  totalFrames: 300,
  layerSize: { width: 1920, height: 1080 },
  sceneDuration: 90,
  ...overrides,
});

describe('ComponentDefaultsManager', () => {
  describe('register / getConfig / unregister', () => {
    it('should register and retrieve a component config', () => {
      const manager = new ComponentDefaultsManager();
      manager.register('Foo', {
        name: 'Foo',
        description: 'A foo component',
      });

      const config = manager.getConfig('Foo');
      expect(config).toBeDefined();
      expect(config!.name).toBe('Foo');
      expect(config!.description).toBe('A foo component');
    });

    it('should return undefined for unregistered component', () => {
      const manager = new ComponentDefaultsManager();
      expect(manager.getConfig('DoesNotExist')).toBeUndefined();
    });

    it('should unregister a component', () => {
      const manager = new ComponentDefaultsManager();
      manager.register('Bar', { name: 'Bar' });
      expect(manager.unregister('Bar')).toBe(true);
      expect(manager.getConfig('Bar')).toBeUndefined();
    });

    it('should return false when unregistering non-existent component', () => {
      const manager = new ComponentDefaultsManager();
      expect(manager.unregister('Nope')).toBe(false);
    });
  });

  describe('getDefaults', () => {
    it('should return default frame-aware defaults for unregistered component', () => {
      const manager = new ComponentDefaultsManager();
      const defaults = manager.getDefaults('Unknown');
      expect(defaults.optional).toBeDefined();
      expect(defaults.optional!.animationDuration).toBe(3);
      expect(defaults.optional!.easing).toBe('easeOutCubic');
    });

    it('should return merged defaults for registered component', () => {
      const manager = new ComponentDefaultsManager();
      manager.register('Chart', {
        name: 'Chart',
        defaults: {
          optional: { colors: ['#ff0000'] },
        },
      });

      const defaults = manager.getDefaults('Chart');
      expect(defaults.optional).toBeDefined();
      expect(defaults.optional!.colors).toEqual(['#ff0000']);
    });
  });

  describe('getSchema', () => {
    it('should return schema for a registered component', () => {
      const manager = new ComponentDefaultsManager();
      manager.register('Widget', {
        name: 'Widget',
        schema: {
          properties: {
            size: { type: 'number', minimum: 1 },
          },
        },
      });

      const schema = manager.getSchema('Widget');
      expect(schema).toBeDefined();
      expect((schema as any).properties.size.type).toBe('number');
    });

    it('should return undefined for unregistered component', () => {
      const manager = new ComponentDefaultsManager();
      expect(manager.getSchema('Nope')).toBeUndefined();
    });
  });

  describe('resolveProps', () => {
    it('should merge defaults with layer props and inject frame data', () => {
      const manager = new ComponentDefaultsManager();
      manager.register('MyComp', {
        name: 'MyComp',
        defaults: {
          optional: { color: '#000', speed: 1 },
        },
      });

      const result = manager.resolveProps(
        'MyComp',
        { color: '#fff' },
        makeFrameData()
      );

      expect(result.isValid).toBe(true);
      expect(result.props.color).toBe('#fff'); // overridden
      expect(result.props.speed).toBe(1); // from defaults
      expect(result.props.frame).toBe(0); // injected
      expect(result.props.fps).toBe(30); // injected
      expect(result.props.totalFrames).toBe(300); // injected
      expect(result.props.layerSize).toEqual({ width: 1920, height: 1080 });
    });

    it('should respect excludeAutoInject', () => {
      const manager = new ComponentDefaultsManager();
      manager.register('NoFrame', {
        name: 'NoFrame',
        defaults: {
          excludeAutoInject: ['frame', 'fps'],
        },
      });

      const result = manager.resolveProps('NoFrame', {}, makeFrameData());
      expect(result.props.frame).toBeUndefined();
      expect(result.props.fps).toBeUndefined();
      expect(result.props.totalFrames).toBe(300); // not excluded
    });

    it('should validate against schema and report type errors', () => {
      const manager = new ComponentDefaultsManager();
      manager.register('Strict', {
        name: 'Strict',
        schema: {
          properties: {
            count: { type: 'number' },
          },
        },
      });

      const result = manager.resolveProps(
        'Strict',
        { count: 'not a number' },
        makeFrameData()
      );

      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors.some(e => e.property === 'count')).toBe(true);
      expect(result.isValid).toBe(false);
    });

    it('should validate number range constraints', () => {
      const manager = new ComponentDefaultsManager();
      manager.register('Ranged', {
        name: 'Ranged',
        schema: {
          properties: {
            opacity: { type: 'number', minimum: 0, maximum: 1 },
          },
        },
      });

      const result = manager.resolveProps(
        'Ranged',
        { opacity: 5 },
        makeFrameData()
      );

      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.property === 'opacity')).toBe(true);
    });

    it('should validate string length constraints', () => {
      const manager = new ComponentDefaultsManager();
      manager.register('StringComp', {
        name: 'StringComp',
        schema: {
          properties: {
            label: { type: 'string', minLength: 2, maxLength: 10 },
          },
        },
      });

      const tooShort = manager.resolveProps(
        'StringComp',
        { label: 'a' },
        makeFrameData()
      );
      expect(tooShort.isValid).toBe(false);

      const tooLong = manager.resolveProps(
        'StringComp',
        { label: 'this is way too long string' },
        makeFrameData()
      );
      expect(tooLong.isValid).toBe(false);

      const justRight = manager.resolveProps(
        'StringComp',
        { label: 'hello' },
        makeFrameData()
      );
      // justRight may still have warnings from other injected props, but label should be fine
      expect(justRight.errors.filter(e => e.property === 'label')).toHaveLength(0);
    });

    it('should validate enum constraints', () => {
      const manager = new ComponentDefaultsManager();
      manager.register('EnumComp', {
        name: 'EnumComp',
        schema: {
          properties: {
            mode: { type: 'string', enum: ['fast', 'slow'] },
          },
        },
      });

      const result = manager.resolveProps(
        'EnumComp',
        { mode: 'invalid' },
        makeFrameData()
      );
      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.property === 'mode')).toBe(true);
    });

    it('should produce warnings for unknown properties with additionalProperties false', () => {
      const manager = new ComponentDefaultsManager();
      manager.register('Strict2', {
        name: 'Strict2',
        schema: {
          properties: {},
          additionalProperties: false,
        },
      });

      const result = manager.resolveProps(
        'Strict2',
        { unknownProp: 'hello' },
        makeFrameData()
      );
      expect(result.warnings.length).toBeGreaterThan(0);
    });

    it('should resolve props for unregistered component using global defaults', () => {
      const manager = new ComponentDefaultsManager();
      const result = manager.resolveProps('Unregistered', {}, makeFrameData());
      expect(result.isValid).toBe(true);
      expect(result.props.animationDuration).toBe(3);
      expect(result.props.frame).toBe(0);
    });

    it('should handle union type schemas (array of types)', () => {
      const manager = new ComponentDefaultsManager();
      manager.register('UnionComp', {
        name: 'UnionComp',
        schema: {
          properties: {
            value: { type: ['string', 'number'] },
          },
        },
      });

      const withString = manager.resolveProps(
        'UnionComp',
        { value: 'hello' },
        makeFrameData()
      );
      expect(withString.errors.filter(e => e.property === 'value')).toHaveLength(0);

      const withNumber = manager.resolveProps(
        'UnionComp',
        { value: 42 },
        makeFrameData()
      );
      expect(withNumber.errors.filter(e => e.property === 'value')).toHaveLength(0);
    });
  });

  describe('mergeProps', () => {
    it('should merge multiple prop sets with proper precedence', () => {
      const manager = new ComponentDefaultsManager();
      manager.register('MergeComp', {
        name: 'MergeComp',
        defaults: {
          optional: { a: 1, b: 2, c: 3 },
          required: { d: 4 },
        },
      });

      const merged = manager.mergeProps(
        'MergeComp',
        { a: 10 },
        { b: 20 }
      );

      expect(merged.a).toBe(10); // overridden by first prop set
      expect(merged.b).toBe(20); // overridden by second prop set
      expect(merged.c).toBe(3);  // from optional defaults
      expect(merged.d).toBe(4);  // from required defaults
    });

    it('should use global defaults for unregistered component', () => {
      const manager = new ComponentDefaultsManager();
      const merged = manager.mergeProps('Unregistered', { custom: 'value' });
      expect(merged.animationDuration).toBe(3);
      expect(merged.custom).toBe('value');
    });
  });

  describe('listComponents', () => {
    it('should list all registered components', () => {
      const manager = new ComponentDefaultsManager();
      manager.register('A', { name: 'A', description: 'Component A' });
      manager.register('B', {
        name: 'B',
        schema: { properties: {} },
      });

      const list = manager.listComponents();
      expect(list).toHaveLength(2);
      expect(list.find(c => c.name === 'A')!.hasDefaults).toBe(true);
      expect(list.find(c => c.name === 'A')!.description).toBe('Component A');
      expect(list.find(c => c.name === 'B')!.hasSchema).toBe(true);
    });

    it('should return empty list when no components registered', () => {
      const manager = new ComponentDefaultsManager();
      expect(manager.listComponents()).toHaveLength(0);
    });
  });
});

describe('createDefaultComponentDefaultsManager', () => {
  it('should create manager with pre-registered components', () => {
    const manager = createDefaultComponentDefaultsManager();
    const list = manager.listComponents();
    expect(list.length).toBeGreaterThanOrEqual(3);

    const names = list.map(c => c.name);
    expect(names).toContain('AnimatedLineChart');
    expect(names).toContain('AuroraBackground');
    expect(names).toContain('WaveBackground');
  });

  it('should resolve AnimatedLineChart props with defaults', () => {
    const manager = createDefaultComponentDefaultsManager();
    const result = manager.resolveProps(
      'AnimatedLineChart',
      { colors: ['#ff0000'] },
      makeFrameData()
    );

    expect(result.props.colors).toEqual(['#ff0000']);
    expect(result.props.showGrid).toBe(true); // from defaults
    expect(result.props.frame).toBe(0); // injected
  });

  it('should validate AuroraBackground props against schema', () => {
    const manager = createDefaultComponentDefaultsManager();
    const result = manager.resolveProps(
      'AuroraBackground',
      { speed: 5 }, // exceeds maximum of 2
      makeFrameData()
    );

    expect(result.errors.some(e => e.property === 'speed')).toBe(true);
  });
});
