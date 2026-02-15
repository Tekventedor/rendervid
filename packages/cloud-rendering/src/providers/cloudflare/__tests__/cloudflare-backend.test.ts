// Mock S3 SDK (used by R2 client via S3-compatible API)
jest.mock('@aws-sdk/client-s3', () => {
  return {
    S3Client: jest.fn().mockImplementation(() => ({
      send: jest.fn(),
    })),
    PutObjectCommand: jest.fn().mockImplementation((params) => params),
    GetObjectCommand: jest.fn().mockImplementation((params) => params),
    HeadObjectCommand: jest.fn().mockImplementation((params) => params),
    DeleteObjectCommand: jest.fn().mockImplementation((params) => params),
    ListObjectsV2Command: jest.fn().mockImplementation((params) => params),
    DeleteObjectsCommand: jest.fn().mockImplementation((params) => params),
  };
});

jest.mock('../cloudflare-r2-client', () => {
  return {
    CloudflareR2Client: jest.fn().mockImplementation(() => ({
      upload: jest.fn(),
      download: jest.fn(),
      exists: jest.fn(),
      list: jest.fn(),
      delete: jest.fn(),
      deletePrefix: jest.fn(),
      getUrl: jest.fn((key: string) => `r2://test-bucket/${key}`),
      getBucket: jest.fn(() => 'test-bucket'),
    })),
  };
});

jest.mock('../../../shared/s3-state-manager', () => {
  return {
    S3StateManager: jest.fn().mockImplementation(() => ({
      getJobStatus: jest.fn(),
      deleteJob: jest.fn(),
      downloadCompletion: jest.fn(),
      uploadManifest: jest.fn(),
      uploadTemplate: jest.fn(),
    })),
  };
});

jest.mock('../../../core/job-poller', () => ({
  pollJobUntilComplete: jest.fn(),
}));

// Mock global fetch
const mockFetch = jest.fn();
global.fetch = mockFetch;

import { CloudflareBackend } from '../cloudflare-backend';
import { CloudflareR2Client } from '../cloudflare-r2-client';
import { pollJobUntilComplete } from '../../../core/job-poller';
import type { CloudflareConfig } from '../../../types/provider-config';
import type { Template } from '@rendervid/core';

describe('CloudflareBackend', () => {
  let backend: CloudflareBackend;
  const config: CloudflareConfig = {
    accountId: 'test-account-id',
    apiToken: 'test-api-token',
    r2Bucket: 'test-bucket',
    r2AccessKeyId: 'test-access-key',
    r2SecretAccessKey: 'test-secret-key',
    storagePrefix: 'rendervid',
    workerName: 'rendervid-worker',
  };

  const testTemplate: Template = {
    name: 'Test Template',
    inputs: [],
    output: {
      type: 'video' as const,
      width: 1920,
      height: 1080,
      fps: 30,
      duration: 1,
    },
    composition: {
      scenes: [{
        id: 'test',
        startFrame: 0,
        endFrame: 29,
        layers: [{
          id: 'text1',
          type: 'text' as const,
          position: { x: 960, y: 540 },
          size: { width: 800, height: 100 },
          props: { text: 'Test', fontSize: 72, color: '#ffffff' },
        }],
      }],
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    backend = new CloudflareBackend(config);
  });

  it('should have correct name and provider', () => {
    expect(backend.name).toBe('Cloudflare Workers');
    expect(backend.provider).toBe('cloudflare');
  });

  it('should initialize R2 client with config', () => {
    expect(CloudflareR2Client).toHaveBeenCalledWith(
      'test-account-id',
      'test-bucket',
      {
        accessKeyId: 'test-access-key',
        secretAccessKey: 'test-secret-key',
      },
      undefined
    );
  });

  it('should initialize R2 client without credentials when not provided', () => {
    jest.clearAllMocks();
    const minimalConfig: CloudflareConfig = {
      accountId: 'test-account',
      r2Bucket: 'test-bucket',
    };

    new CloudflareBackend(minimalConfig);

    expect(CloudflareR2Client).toHaveBeenCalledWith(
      'test-account',
      'test-bucket',
      undefined,
      undefined
    );
  });

  describe('startRenderAsync', () => {
    it('should call Worker and return job ID', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({ jobId: 'render-123', chunksTotal: 5 }),
      });

      const jobId = await backend.startRenderAsync({
        template: testTemplate,
        quality: 'draft',
      });

      expect(jobId).toBe('render-123');
      expect(mockFetch).toHaveBeenCalledWith(
        'https://rendervid-worker.test-account-id.workers.dev',
        expect.objectContaining({
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer test-api-token',
          },
        })
      );
    });

    it('should throw when Worker returns error', async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 500,
        text: async () => 'Internal Server Error',
      });

      await expect(
        backend.startRenderAsync({ template: testTemplate })
      ).rejects.toThrow('Worker request failed (500): Internal Server Error');
    });

    it('should throw when Worker returns no job ID', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({}),
      });

      await expect(
        backend.startRenderAsync({ template: testTemplate })
      ).rejects.toThrow('Worker returned no job ID');
    });
  });

  describe('getJobStatus', () => {
    it('should delegate to state manager', async () => {
      const expectedStatus = {
        jobId: 'job-1',
        status: 'rendering',
        progress: 50,
        chunksCompleted: 5,
        chunksTotal: 10,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      (backend as any).stateManager.getJobStatus.mockResolvedValue(expectedStatus);

      const status = await backend.getJobStatus('job-1');

      expect(status).toEqual(expectedStatus);
    });
  });

  describe('cancelJob', () => {
    it('should delegate to state manager deleteJob', async () => {
      await backend.cancelJob('job-1');

      expect((backend as any).stateManager.deleteJob).toHaveBeenCalledWith('job-1');
    });
  });

  describe('renderVideo', () => {
    it('should start async render, poll, and return result', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({ jobId: 'render-123', chunksTotal: 2 }),
      });

      const finalStatus = {
        jobId: 'render-123',
        status: 'completed',
        progress: 100,
        chunksCompleted: 2,
        chunksTotal: 2,
        storageUrl: 'r2://test-bucket/rendervid/jobs/render-123/output.mp4',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (pollJobUntilComplete as jest.Mock).mockResolvedValue(finalStatus);
      (backend as any).stateManager.downloadCompletion.mockResolvedValue({
        duration: 1,
        fileSize: 50000,
      });

      const result = await backend.renderVideo({
        template: testTemplate,
        quality: 'draft',
      });

      expect(result.success).toBe(true);
      expect(result.jobId).toBe('render-123');
      expect(result.storageUrl).toBe('r2://test-bucket/rendervid/jobs/render-123/output.mp4');
      expect(result.chunksRendered).toBe(2);
    });
  });

  describe('downloadVideo', () => {
    it('should download from R2 and write to local file', async () => {
      const mockBuffer = Buffer.from('video data');
      (backend as any).r2Client.download.mockResolvedValue(mockBuffer);

      // Mock writeFileSync
      const fs = require('fs');
      jest.spyOn(fs, 'writeFileSync').mockImplementation(() => {});

      await backend.downloadVideo(
        'r2://test-bucket/rendervid/jobs/render-123/output.mp4',
        '/tmp/output.mp4'
      );

      expect((backend as any).r2Client.download).toHaveBeenCalledWith(
        'rendervid/jobs/render-123/output.mp4'
      );

      fs.writeFileSync.mockRestore();
    });
  });
});
