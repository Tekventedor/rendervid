jest.mock('../gcp-storage-client', () => {
  return {
    GCPStorageClient: jest.fn().mockImplementation(() => ({
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

import { GCPBackend } from '../gcp-backend';
import { pollJobUntilComplete } from '../../../core/job-poller';
import type { GCPConfig } from '../../../types/provider-config';
import type { Template } from '@rendervid/core';

describe('GCPBackend', () => {
  let backend: GCPBackend;
  const config: GCPConfig = {
    projectId: 'test-project',
    region: 'us-central1',
    storageBucket: 'test-bucket',
    storagePrefix: 'rendervid',
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
    global.fetch = jest.fn() as jest.Mock;
    backend = new GCPBackend(config);
  });

  afterEach(() => {
    (global.fetch as jest.Mock).mockRestore?.();
  });

  it('should have correct name and provider', () => {
    expect(backend.name).toBe('Google Cloud Functions');
    expect(backend.provider).toBe('gcp');
  });

  describe('startRenderAsync', () => {
    it('should call main function and return job ID', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ jobId: 'render-789', chunksTotal: 4 }),
      });

      const jobId = await backend.startRenderAsync({
        template: testTemplate,
        quality: 'high',
      });

      expect(jobId).toBe('render-789');
      expect(global.fetch).toHaveBeenCalledWith(
        'https://us-central1-test-project.cloudfunctions.net/main',
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        })
      );
    });

    it('should throw when main function returns non-OK response', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
        statusText: 'Bad Request',
      });

      await expect(
        backend.startRenderAsync({ template: testTemplate })
      ).rejects.toThrow('Main function failed: Bad Request');
    });
  });

  describe('getJobStatus', () => {
    it('should delegate to state manager', async () => {
      const expectedStatus = {
        jobId: 'job-1',
        status: 'completed',
        progress: 100,
        chunksCompleted: 4,
        chunksTotal: 4,
        storageUrl: 'gs://test-bucket/output.mp4',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      (backend as any).stateManager.getJobStatus.mockResolvedValue(expectedStatus);

      const status = await backend.getJobStatus('job-1');
      expect(status.status).toBe('completed');
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
        json: () => Promise.resolve({ jobId: 'render-789', chunksTotal: 4 }),
      });

      const finalStatus = {
        jobId: 'render-789',
        status: 'completed',
        progress: 100,
        chunksCompleted: 4,
        chunksTotal: 4,
        storageUrl: 'gs://test-bucket/rendervid/jobs/render-789/output.mp4',
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
        quality: 'high',
      });

      expect(result.success).toBe(true);
      expect(result.jobId).toBe('render-789');
      expect(result.chunksRendered).toBe(4);
    });
  });
});
