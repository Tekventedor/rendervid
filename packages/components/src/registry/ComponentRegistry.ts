import type { ComponentType } from 'react';

/**
 * Metadata describing a registered component
 */
export interface ComponentMetadata {
  /** Unique identifier for the component */
  id: string;
  /** Display name */
  name: string;
  /** Component description */
  description: string;
  /** Component category */
  category: 'basic' | 'animated' | 'animation-wrapper' | 'effect' | 'background' | 'media' | 'custom';
  /** Component tags for searchability */
  tags?: string[];
  /** Whether the component requires frame/animation props */
  animated?: boolean;
  /** Example props for documentation */
  exampleProps?: Record<string, unknown>;
  /** Version when the component was added */
  version?: string;
  /** Additional metadata */
  metadata?: Record<string, unknown>;
}

/**
 * A registered component entry with both the component and its metadata
 */
export interface RegisteredComponent {
  /** The React component */
  component: ComponentType<any>;
  /** Component metadata */
  metadata: ComponentMetadata;
}

/**
 * Options for filtering components when listing
 */
export interface ListComponentsOptions {
  /** Filter by category */
  category?: ComponentMetadata['category'];
  /** Filter by tags (returns components that have any of the specified tags) */
  tags?: string[];
  /** Filter by animated status */
  animated?: boolean;
  /** Search in name and description */
  search?: string;
}

/**
 * Component Registry
 *
 * Manages registration and retrieval of Rendervid components.
 * Supports categorization, metadata, and flexible querying.
 *
 * @example
 * ```typescript
 * const registry = new ComponentRegistry();
 *
 * // Register a component
 * registry.register(Text, {
 *   id: 'text',
 *   name: 'Text',
 *   description: 'Renders styled text',
 *   category: 'basic',
 *   tags: ['text', 'typography'],
 * });
 *
 * // Get a component
 * const TextComponent = registry.get('text');
 *
 * // List all basic components
 * const basicComponents = registry.list({ category: 'basic' });
 * ```
 */
export class ComponentRegistry {
  private components: Map<string, RegisteredComponent>;

  constructor() {
    this.components = new Map();
  }

  /**
   * Register a component with metadata
   *
   * @param component - The React component to register
   * @param metadata - Component metadata including id, name, description, etc.
   * @throws Error if a component with the same id is already registered
   *
   * @example
   * ```typescript
   * registry.register(Text, {
   *   id: 'text',
   *   name: 'Text',
   *   description: 'Renders styled text',
   *   category: 'basic',
   * });
   * ```
   */
  register(component: ComponentType<any>, metadata: ComponentMetadata): void {
    if (this.components.has(metadata.id)) {
      throw new Error(`Component with id "${metadata.id}" is already registered`);
    }

    this.components.set(metadata.id, { component, metadata });
  }

  /**
   * Get a registered component by id
   *
   * @param id - The component id
   * @returns The React component, or undefined if not found
   *
   * @example
   * ```typescript
   * const TextComponent = registry.get('text');
   * if (TextComponent) {
   *   return <TextComponent text="Hello" />;
   * }
   * ```
   */
  get(id: string): ComponentType<any> | undefined {
    return this.components.get(id)?.component;
  }

  /**
   * Get a registered component's metadata by id
   *
   * @param id - The component id
   * @returns The component metadata, or undefined if not found
   *
   * @example
   * ```typescript
   * const metadata = registry.getMetadata('text');
   * console.log(metadata.description);
   * ```
   */
  getMetadata(id: string): ComponentMetadata | undefined {
    return this.components.get(id)?.metadata;
  }

  /**
   * Get a registered component with its metadata
   *
   * @param id - The component id
   * @returns The registered component entry, or undefined if not found
   *
   * @example
   * ```typescript
   * const entry = registry.getWithMetadata('text');
   * if (entry) {
   *   const { component, metadata } = entry;
   *   console.log(metadata.name);
   * }
   * ```
   */
  getWithMetadata(id: string): RegisteredComponent | undefined {
    return this.components.get(id);
  }

  /**
   * Check if a component is registered
   *
   * @param id - The component id
   * @returns True if the component is registered
   *
   * @example
   * ```typescript
   * if (registry.has('text')) {
   *   console.log('Text component is available');
   * }
   * ```
   */
  has(id: string): boolean {
    return this.components.has(id);
  }

  /**
   * Unregister a component
   *
   * @param id - The component id
   * @returns True if the component was unregistered, false if it wasn't registered
   *
   * @example
   * ```typescript
   * registry.unregister('old-component');
   * ```
   */
  unregister(id: string): boolean {
    return this.components.delete(id);
  }

  /**
   * List all registered components with optional filtering
   *
   * @param options - Filtering options
   * @returns Array of registered components matching the filter
   *
   * @example
   * ```typescript
   * // Get all components
   * const all = registry.list();
   *
   * // Get only animated components
   * const animated = registry.list({ animated: true });
   *
   * // Get components by category
   * const effects = registry.list({ category: 'effect' });
   *
   * // Search components
   * const searchResults = registry.list({ search: 'fade' });
   *
   * // Combine filters
   * const results = registry.list({
   *   category: 'animated',
   *   tags: ['counter', 'number'],
   * });
   * ```
   */
  list(options?: ListComponentsOptions): RegisteredComponent[] {
    let results = Array.from(this.components.values());

    if (!options) {
      return results;
    }

    // Filter by category
    if (options.category !== undefined) {
      results = results.filter((entry) => entry.metadata.category === options.category);
    }

    // Filter by animated status
    if (options.animated !== undefined) {
      results = results.filter((entry) => entry.metadata.animated === options.animated);
    }

    // Filter by tags (components that have ANY of the specified tags)
    if (options.tags && options.tags.length > 0) {
      results = results.filter((entry) => {
        const componentTags = entry.metadata.tags || [];
        return options.tags!.some((tag) => componentTags.includes(tag));
      });
    }

    // Search in name and description
    if (options.search) {
      const searchLower = options.search.toLowerCase();
      results = results.filter((entry) => {
        const nameLower = entry.metadata.name.toLowerCase();
        const descLower = entry.metadata.description.toLowerCase();
        return nameLower.includes(searchLower) || descLower.includes(searchLower);
      });
    }

    return results;
  }

  /**
   * List all component ids
   *
   * @returns Array of all registered component ids
   *
   * @example
   * ```typescript
   * const ids = registry.listIds();
   * console.log(ids); // ['text', 'image', 'fade', ...]
   * ```
   */
  listIds(): string[] {
    return Array.from(this.components.keys());
  }

  /**
   * List all component metadata
   *
   * @param options - Filtering options (same as list())
   * @returns Array of component metadata matching the filter
   *
   * @example
   * ```typescript
   * const metadata = registry.listMetadata({ category: 'basic' });
   * metadata.forEach(meta => console.log(meta.name));
   * ```
   */
  listMetadata(options?: ListComponentsOptions): ComponentMetadata[] {
    return this.list(options).map((entry) => entry.metadata);
  }

  /**
   * Get all available categories
   *
   * @returns Array of unique categories
   *
   * @example
   * ```typescript
   * const categories = registry.getCategories();
   * console.log(categories); // ['basic', 'animated', 'effect', ...]
   * ```
   */
  getCategories(): ComponentMetadata['category'][] {
    const categories = new Set<ComponentMetadata['category']>();
    for (const entry of this.components.values()) {
      categories.add(entry.metadata.category);
    }
    return Array.from(categories);
  }

  /**
   * Get all available tags
   *
   * @returns Array of unique tags
   *
   * @example
   * ```typescript
   * const tags = registry.getTags();
   * console.log(tags); // ['text', 'typography', 'animation', ...]
   * ```
   */
  getTags(): string[] {
    const tags = new Set<string>();
    for (const entry of this.components.values()) {
      if (entry.metadata.tags) {
        entry.metadata.tags.forEach((tag) => tags.add(tag));
      }
    }
    return Array.from(tags);
  }

  /**
   * Get the count of registered components
   *
   * @returns Number of registered components
   *
   * @example
   * ```typescript
   * console.log(`${registry.size()} components registered`);
   * ```
   */
  size(): number {
    return this.components.size;
  }

  /**
   * Clear all registered components
   *
   * @example
   * ```typescript
   * registry.clear();
   * ```
   */
  clear(): void {
    this.components.clear();
  }

  /**
   * Clone the registry
   *
   * @returns A new registry with the same components
   *
   * @example
   * ```typescript
   * const customRegistry = defaultRegistry.clone();
   * customRegistry.register(MyComponent, {...});
   * ```
   */
  clone(): ComponentRegistry {
    const newRegistry = new ComponentRegistry();
    for (const [id, entry] of this.components.entries()) {
      newRegistry.components.set(id, { ...entry });
    }
    return newRegistry;
  }
}
