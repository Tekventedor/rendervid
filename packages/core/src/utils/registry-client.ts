/**
 * Registry Client
 *
 * HTTP client for interacting with a rendervid template registry.
 * This is a client-side stub that communicates with a generic REST API.
 */

import type {
  TemplateManifest,
  RegistrySearchResult,
  RegistryPackage,
} from '../types/registry';

/**
 * Options for creating a RegistryClient instance.
 */
export interface RegistryClientOptions {
  /** Base URL of the registry API */
  registryUrl: string;
  /** Optional authentication token */
  authToken?: string;
}

/**
 * Search options for querying the registry.
 */
export interface SearchOptions {
  /** Filter by tags */
  tags?: string[];
  /** Filter by category */
  category?: string;
  /** Maximum number of results */
  limit?: number;
  /** Offset for pagination */
  offset?: number;
}

/**
 * Client for the rendervid template registry.
 *
 * Provides methods for searching, fetching, publishing, and managing
 * templates in a remote registry. Communicates via a standard REST API.
 *
 * @example
 * ```typescript
 * const client = new RegistryClient({
 *   registryUrl: 'https://registry.rendervid.dev',
 *   authToken: 'your-token-here',
 * });
 *
 * // Search for templates
 * const results = await client.search('social media', { category: 'social-media' });
 *
 * // Get a specific package
 * const pkg = await client.getPackage('@rendervid/instagram-story');
 * ```
 */
export class RegistryClient {
  private readonly registryUrl: string;
  private readonly authToken?: string;

  constructor(options: RegistryClientOptions) {
    // Remove trailing slash
    this.registryUrl = options.registryUrl.replace(/\/+$/, '');
    this.authToken = options.authToken;
  }

  /**
   * Search for templates in the registry.
   */
  async search(query: string, options?: SearchOptions): Promise<RegistrySearchResult[]> {
    const params = new URLSearchParams({ q: query });

    if (options?.tags && options.tags.length > 0) {
      params.set('tags', options.tags.join(','));
    }
    if (options?.category) {
      params.set('category', options.category);
    }
    if (options?.limit) {
      params.set('limit', String(options.limit));
    }
    if (options?.offset) {
      params.set('offset', String(options.offset));
    }

    const response = await this.fetch(`/api/v1/search?${params.toString()}`);
    return response as RegistrySearchResult[];
  }

  /**
   * Get full package details from the registry.
   */
  async getPackage(name: string, version?: string): Promise<RegistryPackage> {
    const encodedName = encodeURIComponent(name);
    const url = version
      ? `/api/v1/packages/${encodedName}/${version}`
      : `/api/v1/packages/${encodedName}`;

    const response = await this.fetch(url);
    return response as RegistryPackage;
  }

  /**
   * Publish a template package to the registry.
   *
   * Requires authentication (authToken).
   */
  async publish(tarball: Buffer, manifest: TemplateManifest): Promise<void> {
    if (!this.authToken) {
      throw new Error('Authentication required to publish. Set authToken in client options.');
    }

    const body = JSON.stringify({
      manifest,
      tarball: tarball.toString('base64'),
    });

    await this.fetch('/api/v1/packages', {
      method: 'PUT',
      body,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  /**
   * Unpublish a specific version of a template from the registry.
   *
   * Requires authentication (authToken).
   */
  async unpublish(name: string, version: string): Promise<void> {
    if (!this.authToken) {
      throw new Error('Authentication required to unpublish. Set authToken in client options.');
    }

    const encodedName = encodeURIComponent(name);
    await this.fetch(`/api/v1/packages/${encodedName}/${version}`, {
      method: 'DELETE',
    });
  }

  /**
   * List all available template categories.
   */
  async listCategories(): Promise<string[]> {
    const response = await this.fetch('/api/v1/categories');
    return response as string[];
  }

  /**
   * List popular templates.
   */
  async listPopular(limit?: number): Promise<RegistrySearchResult[]> {
    const params = limit ? `?limit=${limit}` : '';
    const response = await this.fetch(`/api/v1/popular${params}`);
    return response as RegistrySearchResult[];
  }

  /**
   * Download a template tarball from the registry.
   */
  async download(name: string, version?: string): Promise<Buffer> {
    const encodedName = encodeURIComponent(name);
    const url = version
      ? `/api/v1/packages/${encodedName}/${version}/download`
      : `/api/v1/packages/${encodedName}/download`;

    const fullUrl = `${this.registryUrl}${url}`;
    const headers: Record<string, string> = {};
    if (this.authToken) {
      headers['Authorization'] = `Bearer ${this.authToken}`;
    }

    const response = await fetch(fullUrl, { headers });

    if (!response.ok) {
      throw new RegistryError(
        `Download failed: ${response.status} ${response.statusText}`,
        response.status,
      );
    }

    const arrayBuffer = await response.arrayBuffer();
    return Buffer.from(arrayBuffer);
  }

  /**
   * Internal fetch helper with authentication and error handling.
   */
  private async fetch(
    urlPath: string,
    options?: { method?: string; body?: string; headers?: Record<string, string> },
  ): Promise<unknown> {
    const url = `${this.registryUrl}${urlPath}`;

    const headers: Record<string, string> = {
      Accept: 'application/json',
      ...(options?.headers || {}),
    };

    if (this.authToken) {
      headers['Authorization'] = `Bearer ${this.authToken}`;
    }

    let response: Response;
    try {
      response = await fetch(url, {
        method: options?.method || 'GET',
        headers,
        body: options?.body,
      });
    } catch (err) {
      throw new RegistryError(
        `Network error connecting to registry at ${this.registryUrl}: ${err instanceof Error ? err.message : String(err)}`,
        0,
      );
    }

    if (!response.ok) {
      let errorMessage: string;
      try {
        const errorBody = (await response.json()) as { error?: string; message?: string };
        errorMessage = errorBody.error || errorBody.message || response.statusText;
      } catch {
        errorMessage = response.statusText;
      }
      throw new RegistryError(
        `Registry error: ${errorMessage}`,
        response.status,
      );
    }

    return response.json();
  }
}

/**
 * Error thrown by registry operations.
 */
export class RegistryError extends Error {
  /** HTTP status code (0 for network errors) */
  readonly statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.name = 'RegistryError';
    this.statusCode = statusCode;
  }
}
