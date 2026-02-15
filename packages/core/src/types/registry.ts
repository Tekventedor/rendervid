/**
 * Template Registry & Marketplace Types
 *
 * Types for publishing, discovering, and installing templates
 * from a template registry/marketplace.
 */

/**
 * Template manifest for registry publishing.
 * This is the metadata that accompanies a published template package.
 */
export interface TemplateManifest {
  /** Scoped package name, e.g. @scope/template-name */
  name: string;

  /** Semantic version string, e.g. "1.0.0" */
  version: string;

  /** Human-readable description of the template */
  description: string;

  /** Author information */
  author: {
    name: string;
    url?: string;
  };

  /** SPDX license identifier */
  license: string;

  /** Searchable tags */
  tags: string[];

  /** Template category (e.g. "social-media", "presentation", "marketing") */
  category: string;

  /** Rendervid engine compatibility and output configuration */
  rendervid: {
    /** Minimum rendervid version required */
    minVersion: string;
    /** Output resolution */
    resolution: {
      width: number;
      height: number;
    };
    /** Duration string, e.g. "5s" or "10s" */
    duration: string;
    /** Frames per second */
    fps: number;
  };

  /** Template input definitions */
  inputs: Record<
    string,
    {
      type: string;
      required?: boolean;
      default?: unknown;
      description: string;
    }
  >;

  /** Preview assets */
  preview?: {
    thumbnail?: string;
    video?: string;
    gif?: string;
  };

  /** List of files included in the template package */
  files: string[];

  /** Source repository URL */
  repository?: string;
}

/**
 * Search result from the template registry.
 */
export interface RegistrySearchResult {
  /** Package name */
  name: string;
  /** Latest version */
  version: string;
  /** Package description */
  description: string;
  /** Author name */
  author: string;
  /** Total download count */
  downloads: number;
  /** Searchable tags */
  tags: string[];
  /** Template category */
  category: string;
}

/**
 * Full package information from the registry.
 */
export interface RegistryPackage extends TemplateManifest {
  /** README content (markdown) */
  readme?: string;
  /** All published versions */
  versions: string[];
  /** ISO date string of first publish */
  createdAt: string;
  /** ISO date string of last update */
  updatedAt: string;
}
