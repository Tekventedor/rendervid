/**
 * Documentation system types for Rendervid.
 * Used by the get_docs MCP tool to return structured documentation.
 */

/**
 * A single documented property.
 */
export interface DocProperty {
  /** TypeScript type string */
  type: string;
  /** Whether the property is required */
  required?: boolean;
  /** Default value */
  default?: unknown;
  /** Human-readable description */
  description: string;
  /** Example value */
  example?: unknown;
  /** Allowed values (for union/enum types) */
  values?: string[];
  /** Value range description (e.g., "0-1", "0-360") */
  range?: string;
}

/**
 * A section of documentation with optional properties and subsections.
 */
export interface DocSection {
  /** Section title */
  title: string;
  /** Section description */
  description: string;
  /** Properties documented in this section */
  properties?: Record<string, DocProperty>;
  /** Nested subsections */
  subsections?: Record<string, DocSection>;
  /** Example snippets */
  examples?: unknown[];
  /** Tips and recommendations */
  tips?: string[];
}

/**
 * Result returned by getDocumentation() for any topic.
 */
export interface DocResult {
  /** Topic identifier (e.g., "layer/text") */
  topic: string;
  /** Human-readable title */
  title: string;
  /** Brief description */
  description: string;
  /** Top-level sections */
  sections?: DocSection[];
  /** Top-level properties (for simple topics) */
  properties?: Record<string, DocProperty>;
  /** List items (for enumeration topics like animations, easings) */
  items?: unknown[];
  /** Tips and best practices */
  tips?: string[];
  /** Example snippets */
  examples?: unknown[];
  /** Related topics to explore */
  seeAlso?: string[];
}
