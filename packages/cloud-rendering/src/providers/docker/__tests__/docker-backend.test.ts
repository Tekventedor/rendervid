// Mock child_process and fs before imports
jest.mock('child_process', () => ({
  spawn: jest.fn(),
  execSync: jest.fn(),
}));

jest.mock('../local-storage', () => {
  return {
    LocalStorage: jest.fn().mockImplementation(() => ({
      upload: jest.fn().mockResolvedValue(undefined),
      download: jest.fn().mockResolvedValue(Buffer.from('{}')),
      exists: jest.fn().mockResolvedValue(false),
      list: jest.fn().mockResolvedValue([]),
      delete: jest.fn().mockResolvedValue(undefined),
      deletePrefix: jest.fn().mockResolvedValue(undefined),
      getLocalPath: jest.fn((key: string) => `/data/${key}`),
    })),
  };
});

jest.mock('../../../shared/s3-state-manager', () => {
  return {
    S3StateManager: jest.fn().mockImplementation(() => ({
      getJobStatus: jest.fn(),
      deleteJob: jest.fn(),
      downloadCompletion: jest.fn(),
      uploadManifest: jest.fn().mockResolvedValue(undefined),
      uploadTemplate: jest.fn().mockResolvedValue(undefined),
      downloadManifest: jest.fn(),
    })),
  };
});

jest.mock('../job-queue', () => {
  return {
    JobQueue: jest.fn().mockImplementation(() => ({
      enqueue: jest.fn().mockResolvedValue(undefined),
      dequeue: jest.fn().mockResolvedValue(null),
      complete: jest.fn(),
      fail: jest.fn(),
      getJob: jest.fn(),
      getStats: jest.fn().mockReturnValue({
        pending: 0,
        running: 0,
        completed: 0,
        failed: 0,
        total: 0,
      }),
    })),
  };
});

jest.mock('../../../core/chunking-algorithm', () => ({
  calculateChunks: jest.fn().mockReturnValue([
    { id: 0, startFrame: 0, endFrame: 14, frameCount: 15 },
    { id: 1, startFrame: 15, endFrame: 29, frameCount: 15 },
  ]),
}));

jest.mock('../../../core/job-poller', () => ({
  pollJobUntilComplete: jest.fn(),
}));

import { DockerBackend } from '../docker-backend';
import { pollJobUntilComplete } from '../../../core/job-poller';
import type { Template } from '@rendervid/core';

describe('DockerBackend', () => {
  let backend: DockerBackend;

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
    jest.useFakeTimers();

    backend = new DockerBackend({
      volumePath: '/tmp/test-volume',
      workersCount: 2,
    });
  });

  afterEach(() => {
    backend.shutdown();
    jest.useRealTimers();
  });

  it('should have correct name and provider', () => {
    expect(backend.name).toBe('Docker Local');
    expect(backend.provider).toBe('docker');
  });

  describe('startRenderAsync', () => {
    it('should create job and enqueue it', async () => {
      const jobId = await backend.startRenderAsync({
        template: testTemplate,
        quality: 'standard',
      });

      expect(jobId).toMatch(/^render-/);
      expect((backend as any).stateManager.uploadTemplate).toHaveBeenCalled();
      expect((backend as any).stateManager.uploadManifest).toHaveBeenCalled();
      expect((backend as any).queue.enqueue).toHaveBeenCalledWith(jobId);
    });
  });

  describe('getJobStatus', () => {
    it('should delegate to state manager', async () => {
      const expectedStatus = {
        jobId: 'job-1',
        status: 'rendering',
        progress: 50,
        chunksCompleted: 1,
        chunksTotal: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      (backend as any).stateManager.getJobStatus.mockResolvedValue(expectedStatus);

      const status = await backend.getJobStatus('job-1');
      expect(status).toEqual(expectedStatus);
    });
  });

  describe('cancelJob', () => {
    it('should fail in queue and delete from state manager', async () => {
      await backend.cancelJob('job-1');

      expect((backend as any).queue.fail).toHaveBeenCalledWith('job-1', 'Cancelled by user');
      expect((backend as any).stateManager.deleteJob).toHaveBeenCalledWith('job-1');
    });
  });

  describe('getQueueStats', () => {
    it('should return queue statistics', () => {
      const stats = backend.getQueueStats();
      expect(stats).toEqual({
        pending: 0,
        running: 0,
        completed: 0,
        failed: 0,
        total: 0,
      });
    });
  });

  describe('shutdown', () => {
    it('should clear the queue processor interval', async () => {
      expect((backend as any).queueProcessor).not.toBeNull();

      await backend.shutdown();

      expect((backend as any).queueProcessor).toBeNull();
    });
  });

  describe('renderVideo', () => {
    it('should start, poll, and return result', async () => {
      const finalStatus = {
        jobId: 'render-123',
        status: 'completed',
        progress: 100,
        chunksCompleted: 2,
        chunksTotal: 2,
        storageUrl: 'file:///tmp/test-volume/rendervid/jobs/render-123/output.mp4',
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
      expect(result.storageUrl).toContain('output.mp4');
    });
  });
});
