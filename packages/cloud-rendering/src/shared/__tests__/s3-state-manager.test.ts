import { S3StateManager } from '../s3-state-manager';
import type { S3CompatibleStorage } from '../s3-state-manager';
import type { JobManifest, WorkerProgress, JobCompletion } from '../../types/job-status';

describe('S3StateManager', () => {
  let mockStorage: jest.Mocked<S3CompatibleStorage>;
  let stateManager: S3StateManager;

  beforeEach(() => {
    mockStorage = {
      upload: jest.fn().mockResolvedValue(undefined),
      download: jest.fn().mockResolvedValue(Buffer.from('{}')),
      exists: jest.fn().mockResolvedValue(false),
      list: jest.fn().mockResolvedValue([]),
      delete: jest.fn().mockResolvedValue(undefined),
      deletePrefix: jest.fn().mockResolvedValue(undefined),
    };
    stateManager = new S3StateManager(mockStorage, 'rendervid');
  });

  describe('uploadManifest / downloadManifest', () => {
    it('should upload manifest as JSON', async () => {
      const manifest: JobManifest = {
        jobId: 'job-1',
        totalFrames: 300,
        fps: 30,
        chunks: [{ id: 0, startFrame: 0, endFrame: 149, frameCount: 150 }],
        status: 'rendering',
        createdAt: '2025-01-01T00:00:00Z',
        quality: 'standard',
        provider: 'aws',
      };

      await stateManager.uploadManifest('job-1', manifest);

      expect(mockStorage.upload).toHaveBeenCalledWith(
        'rendervid/jobs/job-1/manifest.json',
        expect.any(String)
      );
      const uploadedData = JSON.parse(mockStorage.upload.mock.calls[0][1] as string);
      expect(uploadedData.jobId).toBe('job-1');
    });

    it('should download and parse manifest', async () => {
      const manifest: JobManifest = {
        jobId: 'job-1',
        totalFrames: 300,
        fps: 30,
        chunks: [],
        status: 'rendering',
        createdAt: '2025-01-01T00:00:00Z',
        quality: 'standard',
        provider: 'aws',
      };
      mockStorage.download.mockResolvedValue(Buffer.from(JSON.stringify(manifest)));

      const result = await stateManager.downloadManifest('job-1');

      expect(result.jobId).toBe('job-1');
      expect(result.totalFrames).toBe(300);
    });
  });

  describe('uploadTemplate / downloadTemplate', () => {
    it('should upload template', async () => {
      const template = { output: { width: 1920, height: 1080 } };
      await stateManager.uploadTemplate('job-1', template);

      expect(mockStorage.upload).toHaveBeenCalledWith(
        'rendervid/jobs/job-1/template.json',
        JSON.stringify(template)
      );
    });

    it('should download template', async () => {
      const template = { output: { width: 1920, height: 1080 } };
      mockStorage.download.mockResolvedValue(Buffer.from(JSON.stringify(template)));

      const result = await stateManager.downloadTemplate('job-1');
      expect(result).toEqual(template);
    });
  });

  describe('uploadChunk / downloadChunk', () => {
    it('should upload chunk data', async () => {
      const chunkData = Buffer.from('video data');
      await stateManager.uploadChunk('job-1', 0, chunkData);

      expect(mockStorage.upload).toHaveBeenCalledWith(
        'rendervid/jobs/job-1/chunks/chunk-0.mp4',
        chunkData
      );
    });

    it('should download chunk data', async () => {
      const chunkData = Buffer.from('video data');
      mockStorage.download.mockResolvedValue(chunkData);

      const result = await stateManager.downloadChunk('job-1', 0);
      expect(result).toEqual(chunkData);
    });
  });

  describe('listChunks', () => {
    it('should parse chunk IDs from file list', async () => {
      mockStorage.list.mockResolvedValue([
        'rendervid/jobs/job-1/chunks/chunk-0.mp4',
        'rendervid/jobs/job-1/chunks/chunk-1.mp4',
        'rendervid/jobs/job-1/chunks/chunk-2.mp4',
      ]);

      const chunkIds = await stateManager.listChunks('job-1');

      expect(chunkIds).toEqual([0, 1, 2]);
    });

    it('should return empty array when no chunks', async () => {
      mockStorage.list.mockResolvedValue([]);

      const chunkIds = await stateManager.listChunks('job-1');

      expect(chunkIds).toEqual([]);
    });

    it('should skip non-matching files', async () => {
      mockStorage.list.mockResolvedValue([
        'rendervid/jobs/job-1/chunks/chunk-0.mp4',
        'rendervid/jobs/job-1/chunks/readme.txt',
      ]);

      const chunkIds = await stateManager.listChunks('job-1');

      expect(chunkIds).toEqual([0]);
    });
  });

  describe('uploadWorkerProgress / downloadWorkerProgress', () => {
    it('should upload worker progress', async () => {
      const progress: WorkerProgress = {
        chunkId: 0,
        status: 'completed',
        framesRendered: 30,
        totalFrames: 30,
        timestamp: '2025-01-01T00:00:00Z',
      };

      await stateManager.uploadWorkerProgress('job-1', progress);

      expect(mockStorage.upload).toHaveBeenCalledWith(
        'rendervid/jobs/job-1/progress/worker-0.json',
        expect.any(String)
      );
    });

    it('should download worker progress', async () => {
      const progress: WorkerProgress = {
        chunkId: 0,
        status: 'completed',
        framesRendered: 30,
        totalFrames: 30,
        timestamp: '2025-01-01T00:00:00Z',
      };
      mockStorage.download.mockResolvedValue(Buffer.from(JSON.stringify(progress)));

      const result = await stateManager.downloadWorkerProgress('job-1', 0);

      expect(result?.chunkId).toBe(0);
      expect(result?.status).toBe('completed');
    });

    it('should return null when progress file not found', async () => {
      mockStorage.download.mockRejectedValue(new Error('Not found'));

      const result = await stateManager.downloadWorkerProgress('job-1', 99);

      expect(result).toBeNull();
    });
  });

  describe('uploadCompletion / downloadCompletion / isComplete', () => {
    const completion: JobCompletion = {
      status: 'completed',
      outputUrl: 's3://bucket/rendervid/jobs/job-1/output.mp4',
      fileSize: 1000000,
      duration: 10,
      renderTime: 5000,
      chunksRendered: 10,
      completedAt: '2025-01-01T00:01:00Z',
    };

    it('should upload completion marker', async () => {
      await stateManager.uploadCompletion('job-1', completion);

      expect(mockStorage.upload).toHaveBeenCalledWith(
        'rendervid/jobs/job-1/complete.json',
        expect.any(String)
      );
    });

    it('should check if job is complete', async () => {
      mockStorage.exists.mockResolvedValue(true);

      const result = await stateManager.isComplete('job-1');
      expect(result).toBe(true);
    });

    it('should return false when job is not complete', async () => {
      mockStorage.exists.mockResolvedValue(false);

      const result = await stateManager.isComplete('job-1');
      expect(result).toBe(false);
    });

    it('should download completion data', async () => {
      mockStorage.download.mockResolvedValue(Buffer.from(JSON.stringify(completion)));

      const result = await stateManager.downloadCompletion('job-1');

      expect(result?.status).toBe('completed');
      expect(result?.fileSize).toBe(1000000);
    });

    it('should return null when completion not found', async () => {
      mockStorage.download.mockRejectedValue(new Error('Not found'));

      const result = await stateManager.downloadCompletion('job-1');
      expect(result).toBeNull();
    });
  });

  describe('getJobStatus', () => {
    it('should return completed status when completion exists', async () => {
      const completion: JobCompletion = {
        status: 'completed',
        outputUrl: 's3://bucket/output.mp4',
        fileSize: 1000000,
        duration: 10,
        renderTime: 5000,
        chunksRendered: 10,
        completedAt: '2025-01-01T00:01:00Z',
      };

      // downloadCompletion reads from complete.json
      mockStorage.download.mockResolvedValue(Buffer.from(JSON.stringify(completion)));

      const status = await stateManager.getJobStatus('job-1');

      expect(status.status).toBe('completed');
      expect(status.progress).toBe(100);
      expect(status.storageUrl).toBe('s3://bucket/output.mp4');
    });

    it('should return failed status when completion marks failure', async () => {
      const completion: JobCompletion = {
        status: 'failed',
        outputUrl: '',
        fileSize: 0,
        duration: 0,
        renderTime: 0,
        chunksRendered: 0,
        completedAt: '2025-01-01T00:01:00Z',
        error: 'Worker timeout',
      };

      mockStorage.download.mockResolvedValue(Buffer.from(JSON.stringify(completion)));

      const status = await stateManager.getJobStatus('job-1');

      expect(status.status).toBe('failed');
      expect(status.progress).toBe(0);
      expect(status.error).toBe('Worker timeout');
    });

    it('should return rendering status with progress when no completion', async () => {
      const manifest: JobManifest = {
        jobId: 'job-1',
        totalFrames: 300,
        fps: 30,
        chunks: [
          { id: 0, startFrame: 0, endFrame: 149, frameCount: 150 },
          { id: 1, startFrame: 150, endFrame: 299, frameCount: 150 },
        ],
        status: 'rendering',
        createdAt: '2025-01-01T00:00:00Z',
        quality: 'standard',
        provider: 'aws',
      };

      const progress: WorkerProgress = {
        chunkId: 0,
        status: 'completed',
        framesRendered: 150,
        totalFrames: 150,
        timestamp: '2025-01-01T00:00:30Z',
      };

      // First call: downloadCompletion -> fail (no completion)
      // Second call: downloadManifest
      // Third+: downloadWorkerProgress
      mockStorage.download
        .mockRejectedValueOnce(new Error('Not found'))
        .mockResolvedValueOnce(Buffer.from(JSON.stringify(manifest)))
        .mockResolvedValueOnce(Buffer.from(JSON.stringify(progress)));

      mockStorage.list.mockResolvedValue([
        'rendervid/jobs/job-1/progress/worker-0.json',
      ]);

      const status = await stateManager.getJobStatus('job-1');

      expect(status.status).toBe('rendering');
      expect(status.chunksCompleted).toBe(1);
      expect(status.chunksTotal).toBe(2);
      expect(status.progress).toBe(45); // (1/2) * 90
    });

    it('should return merging status when all chunks complete', async () => {
      const manifest: JobManifest = {
        jobId: 'job-1',
        totalFrames: 300,
        fps: 30,
        chunks: [
          { id: 0, startFrame: 0, endFrame: 149, frameCount: 150 },
          { id: 1, startFrame: 150, endFrame: 299, frameCount: 150 },
        ],
        status: 'rendering',
        createdAt: '2025-01-01T00:00:00Z',
        quality: 'standard',
        provider: 'aws',
      };

      const progress0: WorkerProgress = {
        chunkId: 0, status: 'completed', framesRendered: 150, totalFrames: 150,
        timestamp: '2025-01-01T00:00:30Z',
      };
      const progress1: WorkerProgress = {
        chunkId: 1, status: 'completed', framesRendered: 150, totalFrames: 150,
        timestamp: '2025-01-01T00:00:35Z',
      };

      mockStorage.download
        .mockRejectedValueOnce(new Error('Not found'))
        .mockResolvedValueOnce(Buffer.from(JSON.stringify(manifest)))
        .mockResolvedValueOnce(Buffer.from(JSON.stringify(progress0)))
        .mockResolvedValueOnce(Buffer.from(JSON.stringify(progress1)));

      mockStorage.list.mockResolvedValue([
        'rendervid/jobs/job-1/progress/worker-0.json',
        'rendervid/jobs/job-1/progress/worker-1.json',
      ]);

      const status = await stateManager.getJobStatus('job-1');

      expect(status.status).toBe('merging');
      expect(status.progress).toBe(90);
    });

    it('should return queued status when no chunks completed', async () => {
      const manifest: JobManifest = {
        jobId: 'job-1',
        totalFrames: 300,
        fps: 30,
        chunks: [
          { id: 0, startFrame: 0, endFrame: 149, frameCount: 150 },
        ],
        status: 'rendering',
        createdAt: '2025-01-01T00:00:00Z',
        quality: 'standard',
        provider: 'aws',
      };

      mockStorage.download
        .mockRejectedValueOnce(new Error('Not found'))
        .mockResolvedValueOnce(Buffer.from(JSON.stringify(manifest)));

      mockStorage.list.mockResolvedValue([]);

      const status = await stateManager.getJobStatus('job-1');

      expect(status.status).toBe('queued');
      expect(status.chunksCompleted).toBe(0);
    });
  });

  describe('deleteJob', () => {
    it('should delete all job data', async () => {
      await stateManager.deleteJob('job-1');

      expect(mockStorage.deletePrefix).toHaveBeenCalledWith('rendervid/jobs/job-1');
    });
  });

  describe('getOutputUrl', () => {
    it('should return output URL', () => {
      const url = stateManager.getOutputUrl('job-1');
      expect(url).toBe('rendervid/jobs/job-1/output.mp4');
    });
  });

  describe('areAllChunksUploaded', () => {
    it('should return true when all chunks are uploaded', async () => {
      mockStorage.list.mockResolvedValue([
        'rendervid/jobs/job-1/chunks/chunk-0.mp4',
        'rendervid/jobs/job-1/chunks/chunk-1.mp4',
      ]);

      const chunks = [
        { id: 0, startFrame: 0, endFrame: 149, frameCount: 150 },
        { id: 1, startFrame: 150, endFrame: 299, frameCount: 150 },
      ];

      const result = await stateManager.areAllChunksUploaded('job-1', chunks);
      expect(result).toBe(true);
    });

    it('should return false when some chunks are missing', async () => {
      mockStorage.list.mockResolvedValue([
        'rendervid/jobs/job-1/chunks/chunk-0.mp4',
      ]);

      const chunks = [
        { id: 0, startFrame: 0, endFrame: 149, frameCount: 150 },
        { id: 1, startFrame: 150, endFrame: 299, frameCount: 150 },
      ];

      const result = await stateManager.areAllChunksUploaded('job-1', chunks);
      expect(result).toBe(false);
    });
  });
});
