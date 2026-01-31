import type { JSONSchema7 } from './schema';

/**
 * Custom component source type.
 */
export type ComponentSourceType = 'reference' | 'url' | 'inline';

/**
 * Definition of a custom React component used in a template.
 *
 * @example Reference to pre-registered component:
 * ```typescript
 * const chartComponent: CustomComponentDefinition = {
 *   type: 'reference',
 *   reference: 'AnimatedChart',
 *   description: 'Animated bar/line/pie chart',
 * };
 * ```
 *
 * @example Loading from URL:
 * ```typescript
 * const urlComponent: CustomComponentDefinition = {
 *   type: 'url',
 *   url: 'https://example.com/components/Chart.js',
 *   propsSchema: { ... },
 * };
 * ```
 */
export interface CustomComponentDefinition {
  /**
   * Component source type
   */
  type: ComponentSourceType;

  /**
   * Reference to pre-registered component name.
   * Used when type is 'reference'.
   */
  reference?: string;

  /**
   * URL to load component from.
   * Used when type is 'url'.
   */
  url?: string;

  /**
   * Inline component code (for simple components).
   * Used when type is 'inline'.
   * @deprecated Use 'url' or 'reference' for better security
   */
  code?: string;

  /**
   * Props schema for validation.
   * Helps AI agents understand what props are available.
   */
  propsSchema?: JSONSchema7;

  /**
   * Description of what this component does.
   * Used by AI agents and in documentation.
   */
  description?: string;
}

/**
 * Information about a registered component.
 */
export interface ComponentInfo {
  /** Component name */
  name: string;
  /** Description of the component */
  description?: string;
  /** Props schema for validation */
  propsSchema?: JSONSchema7;
  /** Example props */
  example?: Record<string, unknown>;
}

/**
 * Component registry interface.
 */
export interface ComponentRegistry {
  /**
   * Register a React component.
   * @param name - Unique component name
   * @param component - React component
   * @param schema - Optional props schema
   */
  register(name: string, component: React.ComponentType<unknown>, schema?: JSONSchema7): void;

  /**
   * Get a registered component by name.
   * @param name - Component name
   * @returns The component or undefined if not found
   */
  get(name: string): React.ComponentType<unknown> | undefined;

  /**
   * List all registered components.
   * @returns Array of component info
   */
  list(): ComponentInfo[];

  /**
   * Register a component from a URL (dynamic import).
   * @param name - Component name
   * @param url - URL to load from
   */
  registerFromUrl(name: string, url: string): Promise<void>;

  /**
   * Unregister a component.
   * @param name - Component name
   * @returns true if component was found and removed
   */
  unregister(name: string): boolean;

  /**
   * Check if a component is registered.
   * @param name - Component name
   */
  has(name: string): boolean;
}
