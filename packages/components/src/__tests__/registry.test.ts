import { describe, it, expect, beforeEach } from 'vitest';
import React from 'react';
import {
  ComponentRegistry,
} from '../registry/ComponentRegistry';
import type { ComponentMetadata } from '../registry/ComponentRegistry';

// A simple dummy component for testing
const DummyComponent: React.FC<{ text?: string }> = () => null;
const AnotherComponent: React.FC = () => null;

const dummyMetadata: ComponentMetadata = {
  id: 'dummy',
  name: 'Dummy',
  description: 'A dummy component for testing',
  category: 'basic',
  tags: ['test', 'dummy'],
  animated: false,
};

describe('ComponentRegistry', () => {
  let registry: ComponentRegistry;

  beforeEach(() => {
    registry = new ComponentRegistry();
  });

  describe('register', () => {
    it('should register a component', () => {
      registry.register(DummyComponent, dummyMetadata);
      expect(registry.has('dummy')).toBe(true);
    });

    it('should throw when registering duplicate id', () => {
      registry.register(DummyComponent, dummyMetadata);
      expect(() => registry.register(AnotherComponent, dummyMetadata)).toThrow(
        'Component with id "dummy" is already registered'
      );
    });
  });

  describe('get', () => {
    it('should return the component by id', () => {
      registry.register(DummyComponent, dummyMetadata);
      expect(registry.get('dummy')).toBe(DummyComponent);
    });

    it('should return undefined for unregistered id', () => {
      expect(registry.get('nonexistent')).toBeUndefined();
    });
  });

  describe('getMetadata', () => {
    it('should return metadata for a registered component', () => {
      registry.register(DummyComponent, dummyMetadata);
      const metadata = registry.getMetadata('dummy');
      expect(metadata).toEqual(dummyMetadata);
    });

    it('should return undefined for unregistered id', () => {
      expect(registry.getMetadata('nonexistent')).toBeUndefined();
    });
  });

  describe('getWithMetadata', () => {
    it('should return both component and metadata', () => {
      registry.register(DummyComponent, dummyMetadata);
      const entry = registry.getWithMetadata('dummy');
      expect(entry).toBeDefined();
      expect(entry!.component).toBe(DummyComponent);
      expect(entry!.metadata).toEqual(dummyMetadata);
    });

    it('should return undefined for unregistered id', () => {
      expect(registry.getWithMetadata('nonexistent')).toBeUndefined();
    });
  });

  describe('has', () => {
    it('should return true for registered component', () => {
      registry.register(DummyComponent, dummyMetadata);
      expect(registry.has('dummy')).toBe(true);
    });

    it('should return false for unregistered component', () => {
      expect(registry.has('nonexistent')).toBe(false);
    });
  });

  describe('unregister', () => {
    it('should unregister a component', () => {
      registry.register(DummyComponent, dummyMetadata);
      expect(registry.unregister('dummy')).toBe(true);
      expect(registry.has('dummy')).toBe(false);
    });

    it('should return false when unregistering nonexistent component', () => {
      expect(registry.unregister('nonexistent')).toBe(false);
    });
  });

  describe('list', () => {
    beforeEach(() => {
      registry.register(DummyComponent, {
        id: 'basic-1',
        name: 'Basic One',
        description: 'A basic component',
        category: 'basic',
        tags: ['basic', 'text'],
        animated: false,
      });
      registry.register(AnotherComponent, {
        id: 'effect-1',
        name: 'Effect One',
        description: 'An effect component',
        category: 'effect',
        tags: ['animation', 'effect'],
        animated: true,
      });
      registry.register(DummyComponent, {
        id: 'animated-1',
        name: 'Animated One',
        description: 'An animated component',
        category: 'animated',
        tags: ['animation', 'counter'],
        animated: true,
      });
    });

    it('should list all components when no options provided', () => {
      const all = registry.list();
      expect(all).toHaveLength(3);
    });

    it('should filter by category', () => {
      const basic = registry.list({ category: 'basic' });
      expect(basic).toHaveLength(1);
      expect(basic[0].metadata.id).toBe('basic-1');
    });

    it('should filter by animated status', () => {
      const animated = registry.list({ animated: true });
      expect(animated).toHaveLength(2);
    });

    it('should filter by tags', () => {
      const animationTagged = registry.list({ tags: ['animation'] });
      expect(animationTagged).toHaveLength(2);
    });

    it('should filter by tags matching any', () => {
      const result = registry.list({ tags: ['text', 'counter'] });
      expect(result).toHaveLength(2);
    });

    it('should search by name', () => {
      const result = registry.list({ search: 'Effect' });
      expect(result).toHaveLength(1);
      expect(result[0].metadata.id).toBe('effect-1');
    });

    it('should search by description', () => {
      const result = registry.list({ search: 'animated' });
      expect(result).toHaveLength(1);
      expect(result[0].metadata.id).toBe('animated-1');
    });

    it('should combine multiple filters', () => {
      const result = registry.list({ animated: true, tags: ['counter'] });
      expect(result).toHaveLength(1);
      expect(result[0].metadata.id).toBe('animated-1');
    });

    it('should return empty array when no matches', () => {
      const result = registry.list({ category: 'custom' });
      expect(result).toHaveLength(0);
    });
  });

  describe('listIds', () => {
    it('should return all component ids', () => {
      registry.register(DummyComponent, dummyMetadata);
      registry.register(AnotherComponent, {
        ...dummyMetadata,
        id: 'another',
      });
      const ids = registry.listIds();
      expect(ids).toContain('dummy');
      expect(ids).toContain('another');
      expect(ids).toHaveLength(2);
    });
  });

  describe('listMetadata', () => {
    it('should return metadata array', () => {
      registry.register(DummyComponent, dummyMetadata);
      const metadata = registry.listMetadata();
      expect(metadata).toHaveLength(1);
      expect(metadata[0].id).toBe('dummy');
    });

    it('should filter metadata like list()', () => {
      registry.register(DummyComponent, { ...dummyMetadata, id: 'a', category: 'basic' });
      registry.register(AnotherComponent, { ...dummyMetadata, id: 'b', category: 'effect' });
      const result = registry.listMetadata({ category: 'basic' });
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('a');
    });
  });

  describe('getCategories', () => {
    it('should return unique categories', () => {
      registry.register(DummyComponent, { ...dummyMetadata, id: 'a', category: 'basic' });
      registry.register(AnotherComponent, { ...dummyMetadata, id: 'b', category: 'effect' });
      registry.register(DummyComponent, { ...dummyMetadata, id: 'c', category: 'basic' });
      const categories = registry.getCategories();
      expect(categories).toContain('basic');
      expect(categories).toContain('effect');
      expect(categories).toHaveLength(2);
    });
  });

  describe('getTags', () => {
    it('should return unique tags across all components', () => {
      registry.register(DummyComponent, { ...dummyMetadata, id: 'a', tags: ['text', 'basic'] });
      registry.register(AnotherComponent, { ...dummyMetadata, id: 'b', tags: ['text', 'animation'] });
      const tags = registry.getTags();
      expect(tags).toContain('text');
      expect(tags).toContain('basic');
      expect(tags).toContain('animation');
      expect(tags).toHaveLength(3);
    });

    it('should handle components without tags', () => {
      registry.register(DummyComponent, { ...dummyMetadata, id: 'a', tags: undefined });
      const tags = registry.getTags();
      expect(tags).toHaveLength(0);
    });
  });

  describe('size', () => {
    it('should return the number of registered components', () => {
      expect(registry.size()).toBe(0);
      registry.register(DummyComponent, dummyMetadata);
      expect(registry.size()).toBe(1);
    });
  });

  describe('clear', () => {
    it('should remove all registered components', () => {
      registry.register(DummyComponent, dummyMetadata);
      registry.clear();
      expect(registry.size()).toBe(0);
      expect(registry.has('dummy')).toBe(false);
    });
  });

  describe('clone', () => {
    it('should create an independent copy of the registry', () => {
      registry.register(DummyComponent, dummyMetadata);
      const cloned = registry.clone();

      expect(cloned.has('dummy')).toBe(true);
      expect(cloned.size()).toBe(1);

      // Modifications to clone should not affect original
      cloned.register(AnotherComponent, { ...dummyMetadata, id: 'another' });
      expect(cloned.size()).toBe(2);
      expect(registry.size()).toBe(1);
    });
  });

  describe('URL validation', () => {
    it('should reject non-HTTPS URLs via registerFromUrl', async () => {
      await expect(
        registry.registerFromUrl('test', 'http://example.com/component.js')
      ).rejects.toThrow('Component URLs must use HTTPS');
    });

    it('should reject invalid URLs via registerFromUrl', async () => {
      await expect(
        registry.registerFromUrl('test', 'not-a-url')
      ).rejects.toThrow('Invalid URL');
    });

    it('should reject domains not in allowlist', async () => {
      registry.setAllowedDomains(['cdn.example.com']);
      await expect(
        registry.registerFromUrl('test', 'https://evil.com/component.js')
      ).rejects.toThrow('Domain not allowed');
    });

    it('should allow subdomains of allowed domains', async () => {
      registry.setAllowedDomains(['example.com']);
      // This will fail due to import, but should pass URL validation
      await expect(
        registry.registerFromUrl('test', 'https://sub.example.com/component.js')
      ).rejects.toThrow('Failed to load component');
    });
  });

  describe('registerFromCode', () => {
    it('should reject code with eval', () => {
      expect(() =>
        registry.registerFromCode('test', 'eval("bad code")')
      ).toThrow('forbidden construct');
    });

    it('should reject code with Function constructor', () => {
      expect(() =>
        registry.registerFromCode('test', 'new Function("bad")')
      ).toThrow('forbidden construct');
    });

    it('should reject code with document.write', () => {
      expect(() =>
        registry.registerFromCode('test', 'document.write("<script>")')
      ).toThrow('forbidden construct');
    });

    it('should reject code with innerHTML', () => {
      expect(() =>
        registry.registerFromCode('test', 'el.innerHTML = "<script>"')
      ).toThrow('forbidden construct');
    });

    it('should reject code with import statements', () => {
      expect(() =>
        registry.registerFromCode('test', 'import something from "module"')
      ).toThrow('forbidden construct');
    });

    it('should reject code with require', () => {
      expect(() =>
        registry.registerFromCode('test', 'const x = require("fs")')
      ).toThrow('forbidden construct');
    });

    it('should reject code with window access', () => {
      expect(() =>
        registry.registerFromCode('test', 'window.location = "evil"')
      ).toThrow('forbidden construct');
    });

    it('should reject unrecognized code format', () => {
      expect(() =>
        registry.registerFromCode('test', 'const x = 42;')
      ).toThrow('Unrecognized code format');
    });
  });
});
