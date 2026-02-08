import { pollJobUntilComplete, calculateEstimatedTimeRemaining } from '../job-poller';
import type { JobStatus } from '../../types/job-status';

describe('Job Poller', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  const makeStatus = (overrides: Partial<JobStatus> = {}): JobStatus => ({
    jobId: 'render-test',
    status: 'rendering',
    progress: 50,
    chunksCompleted: 5,
    chunksTotal: 10,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  });

  describe('pollJobUntilComplete', () => {
    it('should return immediately when job is already completed', async () => {
      const completedStatus = makeStatus({ status: 'completed', progress: 100 });
      const getStatus = jest.fn().mockResolvedValue(completedStatus);

      const promise = pollJobUntilComplete(getStatus, { intervalMs: 100 });
      const result = await promise;

      expect(result.status).toBe('completed');
      expect(getStatus).toHaveBeenCalledTimes(1);
    });

    it('should throw when job has failed', async () => {
      const failedStatus = makeStatus({
        status: 'failed',
        error: 'Out of memory',
      });
      const getStatus = jest.fn().mockResolvedValue(failedStatus);

      await expect(
        pollJobUntilComplete(getStatus, { intervalMs: 100 })
      ).rejects.toThrow('Job failed: Out of memory');
    });

    it('should throw with unknown error when job fails without error message', async () => {
      const failedStatus = makeStatus({ status: 'failed' });
      const getStatus = jest.fn().mockResolvedValue(failedStatus);

      await expect(
        pollJobUntilComplete(getStatus, { intervalMs: 100 })
      ).rejects.toThrow('Job failed: Unknown error');
    });

    it('should poll until job completes', async () => {
      const renderingStatus = makeStatus({ status: 'rendering', progress: 50 });
      const completedStatus = makeStatus({ status: 'completed', progress: 100 });

      const getStatus = jest
        .fn()
        .mockResolvedValueOnce(renderingStatus)
        .mockResolvedValueOnce(completedStatus);

      const promise = pollJobUntilComplete(getStatus, { intervalMs: 100 });

      // Advance past the first sleep
      await jest.advanceTimersByTimeAsync(100);

      const result = await promise;
      expect(result.status).toBe('completed');
      expect(getStatus).toHaveBeenCalledTimes(2);
    });

    it('should call onProgress callback', async () => {
      const renderingStatus = makeStatus({ status: 'rendering', progress: 50 });
      const completedStatus = makeStatus({ status: 'completed', progress: 100 });

      const getStatus = jest
        .fn()
        .mockResolvedValueOnce(renderingStatus)
        .mockResolvedValueOnce(completedStatus);

      const onProgress = jest.fn();

      const promise = pollJobUntilComplete(getStatus, {
        intervalMs: 100,
        onProgress,
      });

      await jest.advanceTimersByTimeAsync(100);

      await promise;

      expect(onProgress).toHaveBeenCalledTimes(2);
      expect(onProgress).toHaveBeenCalledWith(renderingStatus);
      expect(onProgress).toHaveBeenCalledWith(completedStatus);
    });

    it('should timeout after specified duration', async () => {
      jest.useRealTimers();

      const renderingStatus = makeStatus({ status: 'rendering', progress: 50 });
      const getStatus = jest.fn().mockResolvedValue(renderingStatus);

      await expect(
        pollJobUntilComplete(getStatus, {
          intervalMs: 10,
          timeoutMs: 50,
        })
      ).rejects.toThrow('Job polling timeout after 50ms');
    });
  });

  describe('calculateEstimatedTimeRemaining', () => {
    it('should return null when progress is 0', () => {
      const status = makeStatus({ progress: 0 });
      const result = calculateEstimatedTimeRemaining(status, Date.now() - 10000);
      expect(result).toBeNull();
    });

    it('should return null when progress is 100', () => {
      const status = makeStatus({ progress: 100 });
      const result = calculateEstimatedTimeRemaining(status, Date.now() - 10000);
      expect(result).toBeNull();
    });

    it('should estimate remaining time based on progress', () => {
      const now = Date.now();
      const startTime = now - 30000; // Started 30 seconds ago

      const status = makeStatus({ progress: 50 });
      const result = calculateEstimatedTimeRemaining(status, startTime);

      // At 50% in 30s, estimated total = 60s, remaining = 30s
      expect(result).toBe(30);
    });

    it('should return 0 for nearly complete jobs', () => {
      const now = Date.now();
      const startTime = now - 100; // Started 100ms ago

      const status = makeStatus({ progress: 99 });
      const result = calculateEstimatedTimeRemaining(status, startTime);

      expect(result).toBeGreaterThanOrEqual(0);
    });
  });
});
