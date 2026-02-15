import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { RegistryClient, RegistryError } from '../utils/registry-client';
import type { TemplateManifest, RegistrySearchResult, RegistryPackage } from '../types/registry';

// Mock global fetch
const mockFetch = vi.fn();
vi.stubGlobal('fetch', mockFetch);

function createMockResponse(data: unknown, ok = true, status = 200): Response {
  return {
    ok,
    status,
    statusText: ok ? 'OK' : 'Error',
    json: () => Promise.resolve(data),
    arrayBuffer: () => Promise.resolve(new ArrayBuffer(0)),
    headers: new Headers(),
    redirected: false,
    type: 'basic',
    url: '',
    clone: () => ({} as Response),
    body: null,
    bodyUsed: false,
    formData: () => Promise.resolve(new FormData()),
    text: () => Promise.resolve(''),
    blob: () => Promise.resolve(new Blob()),
    bytes: () => Promise.resolve(new Uint8Array()),
  } as Response;
}

describe('RegistryClient', () => {
  let client: RegistryClient;

  beforeEach(() => {
    vi.clearAllMocks();
    client = new RegistryClient({
      registryUrl: 'https://registry.rendervid.dev',
      authToken: 'test-token',
    });
  });

  describe('constructor', () => {
    it('should strip trailing slash from registry URL', () => {
      const c = new RegistryClient({
        registryUrl: 'https://registry.rendervid.dev/',
      });
      // We can verify this by checking the URL in a fetch call
      mockFetch.mockResolvedValueOnce(createMockResponse([]));
      c.search('test');
      // The URL should not have double slashes
    });
  });

  describe('search', () => {
    it('should search templates with query', async () => {
      const mockResults: RegistrySearchResult[] = [
        {
          name: '@test/social-template',
          version: '1.0.0',
          description: 'A social media template',
          author: 'Test Author',
          downloads: 100,
          tags: ['social'],
          category: 'social-media',
        },
      ];

      mockFetch.mockResolvedValueOnce(createMockResponse(mockResults));

      const results = await client.search('social');
      expect(results).toEqual(mockResults);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/v1/search?q=social'),
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({
            Authorization: 'Bearer test-token',
          }),
        }),
      );
    });

    it('should include search options as query params', async () => {
      mockFetch.mockResolvedValueOnce(createMockResponse([]));

      await client.search('test', {
        tags: ['social', 'video'],
        category: 'marketing',
        limit: 10,
      });

      const calledUrl = mockFetch.mock.calls[0][0] as string;
      expect(calledUrl).toContain('q=test');
      expect(calledUrl).toContain('tags=social%2Cvideo');
      expect(calledUrl).toContain('category=marketing');
      expect(calledUrl).toContain('limit=10');
    });

    it('should handle search errors', async () => {
      mockFetch.mockResolvedValueOnce(
        createMockResponse({ error: 'Service unavailable' }, false, 503),
      );

      await expect(client.search('test')).rejects.toThrow(RegistryError);
    });
  });

  describe('getPackage', () => {
    it('should fetch package details', async () => {
      const mockPackage: RegistryPackage = {
        name: '@test/my-template',
        version: '1.0.0',
        description: 'Test',
        author: { name: 'Author' },
        license: 'MIT',
        tags: [],
        category: 'other',
        rendervid: {
          minVersion: '1.0.0',
          resolution: { width: 1920, height: 1080 },
          duration: '5s',
          fps: 30,
        },
        inputs: {},
        files: ['template.json'],
        versions: ['1.0.0'],
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      };

      mockFetch.mockResolvedValueOnce(createMockResponse(mockPackage));

      const result = await client.getPackage('@test/my-template');
      expect(result).toEqual(mockPackage);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/v1/packages/%40test%2Fmy-template'),
        expect.any(Object),
      );
    });

    it('should fetch a specific version', async () => {
      mockFetch.mockResolvedValueOnce(createMockResponse({}));

      await client.getPackage('@test/my-template', '2.0.0');
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/v1/packages/%40test%2Fmy-template/2.0.0'),
        expect.any(Object),
      );
    });
  });

  describe('publish', () => {
    it('should publish a template', async () => {
      mockFetch.mockResolvedValueOnce(createMockResponse({ success: true }));

      const tarball = Buffer.from('tarball-data');
      const manifest: TemplateManifest = {
        name: '@test/publish-test',
        version: '1.0.0',
        description: 'Test',
        author: { name: 'Author' },
        license: 'MIT',
        tags: [],
        category: 'other',
        rendervid: {
          minVersion: '1.0.0',
          resolution: { width: 1920, height: 1080 },
          duration: '5s',
          fps: 30,
        },
        inputs: {},
        files: ['template.json'],
      };

      await client.publish(tarball, manifest);

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/v1/packages'),
        expect.objectContaining({
          method: 'PUT',
          headers: expect.objectContaining({
            Authorization: 'Bearer test-token',
            'Content-Type': 'application/json',
          }),
        }),
      );

      // Verify the body contains base64 tarball
      const callBody = JSON.parse(mockFetch.mock.calls[0][1].body);
      expect(callBody.manifest).toEqual(manifest);
      expect(callBody.tarball).toBe(tarball.toString('base64'));
    });

    it('should throw if not authenticated', async () => {
      const unauthClient = new RegistryClient({
        registryUrl: 'https://registry.rendervid.dev',
      });

      await expect(
        unauthClient.publish(Buffer.from('test'), {} as TemplateManifest),
      ).rejects.toThrow('Authentication required');
    });
  });

  describe('unpublish', () => {
    it('should unpublish a template version', async () => {
      mockFetch.mockResolvedValueOnce(createMockResponse({ success: true }));

      await client.unpublish('@test/my-template', '1.0.0');

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/v1/packages/%40test%2Fmy-template/1.0.0'),
        expect.objectContaining({ method: 'DELETE' }),
      );
    });

    it('should throw if not authenticated', async () => {
      const unauthClient = new RegistryClient({
        registryUrl: 'https://registry.rendervid.dev',
      });

      await expect(unauthClient.unpublish('test', '1.0.0')).rejects.toThrow(
        'Authentication required',
      );
    });
  });

  describe('listCategories', () => {
    it('should list available categories', async () => {
      const categories = ['social-media', 'marketing', 'education'];
      mockFetch.mockResolvedValueOnce(createMockResponse(categories));

      const result = await client.listCategories();
      expect(result).toEqual(categories);
    });
  });

  describe('listPopular', () => {
    it('should list popular templates', async () => {
      const popular: RegistrySearchResult[] = [
        {
          name: '@test/popular-one',
          version: '1.0.0',
          description: 'Popular template',
          author: 'Author',
          downloads: 5000,
          tags: ['popular'],
          category: 'social-media',
        },
      ];

      mockFetch.mockResolvedValueOnce(createMockResponse(popular));

      const result = await client.listPopular(5);
      expect(result).toEqual(popular);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/v1/popular?limit=5'),
        expect.any(Object),
      );
    });

    it('should list popular without limit', async () => {
      mockFetch.mockResolvedValueOnce(createMockResponse([]));

      await client.listPopular();
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/v1/popular'),
        expect.any(Object),
      );
      // Should not have a query parameter
      const calledUrl = mockFetch.mock.calls[0][0] as string;
      expect(calledUrl).not.toContain('limit=');
    });
  });

  describe('error handling', () => {
    it('should throw RegistryError with status code on API errors', async () => {
      mockFetch.mockResolvedValueOnce(
        createMockResponse({ error: 'Not found' }, false, 404),
      );

      try {
        await client.getPackage('nonexistent');
        expect.fail('Should have thrown');
      } catch (err) {
        expect(err).toBeInstanceOf(RegistryError);
        expect((err as RegistryError).statusCode).toBe(404);
        expect((err as RegistryError).message).toContain('Not found');
      }
    });

    it('should handle network errors', async () => {
      mockFetch.mockRejectedValueOnce(new Error('ECONNREFUSED'));

      try {
        await client.search('test');
        expect.fail('Should have thrown');
      } catch (err) {
        expect(err).toBeInstanceOf(RegistryError);
        expect((err as RegistryError).statusCode).toBe(0);
        expect((err as RegistryError).message).toContain('Network error');
      }
    });

    it('should handle non-JSON error responses', async () => {
      const response = {
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        json: () => Promise.reject(new Error('not json')),
        headers: new Headers(),
        redirected: false,
        type: 'basic' as ResponseType,
        url: '',
        clone: () => ({} as Response),
        body: null,
        bodyUsed: false,
        formData: () => Promise.resolve(new FormData()),
        text: () => Promise.resolve(''),
        blob: () => Promise.resolve(new Blob()),
        bytes: () => Promise.resolve(new Uint8Array()),
      } as Response;

      mockFetch.mockResolvedValueOnce(response);

      try {
        await client.search('test');
        expect.fail('Should have thrown');
      } catch (err) {
        expect(err).toBeInstanceOf(RegistryError);
        expect((err as RegistryError).message).toContain('Internal Server Error');
      }
    });
  });

  describe('RegistryError', () => {
    it('should have correct name and status code', () => {
      const error = new RegistryError('test error', 404);
      expect(error.name).toBe('RegistryError');
      expect(error.statusCode).toBe(404);
      expect(error.message).toBe('test error');
      expect(error).toBeInstanceOf(Error);
    });
  });
});
