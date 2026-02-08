import { describe, it, expect } from 'vitest';
import { ComponentPropsResolver } from '../component-defaults-integration';
import { ComponentDefaultsManager } from '../component-defaults';
import type { CustomLayer } from '../types/layer';

function makeCustomLayer(overrides: Partial<CustomLayer> = {}): CustomLayer {
  return {
    id: 'custom-1',
    type: 'custom',
    position: { x: 0, y: 0 },
    size: { width: 800, height: 600 },
    customComponent: {
      name: 'TestComponent',
      props: {},
    },
    props: {},
    ...overrides,
  };
}

describe('ComponentPropsResolver', () => {
  describe('constructor', () => {
    it('should create resolver with default manager', () => {
      const resolver = new ComponentPropsResolver();
      expect(resolver.getManager()).toBeInstanceOf(ComponentDefaultsManager);
    });

    it('should accept custom manager', () => {
      const manager = new ComponentDefaultsManager();
      manager.register('CustomComp', { name: 'CustomComp' });
      const resolver = new ComponentPropsResolver(manager);
      expect(resolver.getManager().getConfig('CustomComp')).toBeDefined();
    });
  });

  describe('resolveLayerProps', () => {
    it('should resolve props for a custom layer', () => {
      const resolver = new ComponentPropsResolver();
      const layer = makeCustomLayer({
        customComponent: {
          name: 'AnimatedLineChart',
          props: { colors: ['#ff0000'] },
        },
      });

      const result = resolver.resolveLayerProps(layer, 10, 30, 300, 90, 800, 600);

      expect(result.isValid).toBe(true);
      expect(result.props.frame).toBe(10);
      expect(result.props.fps).toBe(30);
      expect(result.props.totalFrames).toBe(300);
      expect(result.props.sceneDuration).toBe(90);
      expect(result.props.layerSize).toEqual({ width: 800, height: 600 });
      expect(result.props.colors).toEqual(['#ff0000']);
    });

    it('should return empty valid result for non-custom layer', () => {
      const resolver = new ComponentPropsResolver();
      const layer = {
        id: 'text-1',
        type: 'text' as const,
        position: { x: 0, y: 0 },
        size: { width: 800, height: 100 },
        props: { text: 'hello' },
      } as any;

      const result = resolver.resolveLayerProps(layer, 0, 30, 300, 90, 800, 100);

      expect(result.isValid).toBe(true);
      expect(result.props).toEqual({});
      expect(result.errors).toHaveLength(0);
    });

    it('should return empty valid result for custom layer without customComponent', () => {
      const resolver = new ComponentPropsResolver();
      const layer = {
        id: 'custom-1',
        type: 'custom' as const,
        position: { x: 0, y: 0 },
        size: { width: 800, height: 600 },
        props: {},
        // no customComponent
      } as any;

      const result = resolver.resolveLayerProps(layer, 0, 30, 300, 90, 800, 600);
      expect(result.isValid).toBe(true);
      expect(result.props).toEqual({});
    });

    it('should handle layer with no customComponent.props', () => {
      const resolver = new ComponentPropsResolver();
      const layer = makeCustomLayer({
        customComponent: {
          name: 'SomeComp',
          // props is undefined
        } as any,
      });

      const result = resolver.resolveLayerProps(layer, 0, 30, 300, 90, 800, 600);
      expect(result.isValid).toBe(true);
      expect(result.props.frame).toBe(0);
    });
  });

  describe('registerComponent', () => {
    it('should register a component through the resolver', () => {
      const resolver = new ComponentPropsResolver();
      resolver.registerComponent('NewComp', {
        name: 'NewComp',
        defaults: {
          optional: { color: 'blue' },
        },
      });

      const layer = makeCustomLayer({
        customComponent: {
          name: 'NewComp',
          props: {},
        },
      });

      const result = resolver.resolveLayerProps(layer, 0, 30, 300, 90, 800, 600);
      expect(result.props.color).toBe('blue');
    });
  });

  describe('getManager', () => {
    it('should return the underlying manager', () => {
      const manager = new ComponentDefaultsManager();
      const resolver = new ComponentPropsResolver(manager);
      expect(resolver.getManager()).toBe(manager);
    });
  });
});
