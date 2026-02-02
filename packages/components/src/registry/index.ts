/**
 * Component Registry Module
 *
 * Provides a centralized registry system for managing Rendervid components.
 * The registry supports component metadata, categorization, and flexible querying.
 *
 * @module registry
 */

// Export the ComponentRegistry class and types
export { ComponentRegistry } from './ComponentRegistry';
export type {
  ComponentMetadata,
  RegisteredComponent,
  ListComponentsOptions,
} from './ComponentRegistry';

// Export default registry functions
export {
  createDefaultRegistry,
  getDefaultRegistry,
  resetDefaultRegistry,
  defaultRegistry,
} from './defaultRegistry';
