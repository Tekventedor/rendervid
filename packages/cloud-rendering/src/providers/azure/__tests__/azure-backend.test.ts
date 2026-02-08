jest.mock('../azure-blob-client', () => {
  return {
    AzureBlobClient: jest.fn().mockImplementation(() => ({
      upload: jest.fn(),
      download: jest.fn(),
      exists: jest.fn(),
      list: jest.fn(),
      delete: jest.fn(),
      deletePrefix: jest.fn(),
    })),
  };
});

jest.mock('../../../shared/s3-state-manager', () => {
  return {
    S3StateManager: jest.fn().mockImplementation(() => ({
      getJobStatus: jest.fn(),
      deleteJob: jest.fn(),
      downloadCompletion: jest.fn(),
    })),
  };
});

jest.mock('../../../core/job-poller', () => ({
  pollJobUntilComplete: jest.fn(),
}));

import { AzureBackend } from '../azure-backend';
import { pollJobUntilComplete } from '../../../core/job-poller';
import type { AzureConfig } from '../../../types/provider-config';
import type { Template } from '@rendervid/core';

describe('AzureBackend', () => {
  let backend: AzureBackend;
  const config: AzureConfig = {
    subscriptionId: 'sub-123',
    storageAccount: 'teststorageaccount',
    storageContainer: 'testcontainer',
    storageConnectionString: 'DefaultEndpointsProtocol=https;AccountName=test',
    storagePrefix: 'rendervid',
  };

  const testTemplate: Template = {
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
    // Mock global fetch
    global.fetch = jest.fn() as jest.Mock;
    backend = new AzureBackend(config);
  });

  afterEach(() => {
    (global.fetch as jest.Mock).mockRestore?.();
  });

  it('should have correct name and provider', () => {
    expect(backend.name).toBe('Azure Functions');
    expect(backend.provider).toBe('azure');
  });

  it('should throw when storage connection string is missing', () => {
    const badConfig: AzureConfig = {
      subscriptionId: 'sub-123',
      storageAccount: 'test',
      storageContainer: 'container',
    };

    expect(() => new AzureBackend(badConfig)).toThrow(
      'Azure storage connection string is required'
    );
  });

  describe('startRenderAsync', () => {
    it('should call main function and return job ID', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ jobId: 'render-456', chunksTotal: 3 }),
      });

      const jobId = await backend.startRenderAsync({
        template: testTemplate,
        quality: 'standard',
      });

      expect(jobId).toBe('render-456');
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('rendervid-functions.azurewebsites.net'),
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        })
      );
    });

    it('should throw when main function fails', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
        statusText: 'Internal Server Error',
      });

      await expect(
        backend.startRenderAsync({ template: testTemplate })
      ).rejects.toThrow('Main function failed: Internal Server Error');
    });
  });

  describe('getJobStatus', () => {
    it('should delegate to state manager', async () => {
      const expectedStatus = {
        jobId: 'job-1',
        status: 'rendering',
        progress: 30,
        chunksCompleted: 1,
        chunksTotal: 3,
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
    it('should start, poll, and return result', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ jobId: 'render-456', chunksTotal: 2 }),
      });

      const finalStatus = {
        jobId: 'render-456',
        status: 'completed',
        progress: 100,
        chunksCompleted: 2,
        chunksTotal: 2,
        storageUrl: 'https://test.blob.core.windows.net/container/output.mp4',
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
      expect(result.jobId).toBe('render-456');
    });
  });
});
