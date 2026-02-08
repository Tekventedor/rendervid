import { JobQueue } from '../job-queue';
import { rmSync, existsSync } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';

describe('JobQueue', () => {
  let queue: JobQueue;
  let basePath: string;

  beforeEach(() => {
    basePath = join(tmpdir(), `rendervid-queue-test-${Date.now()}-${Math.random().toString(36).slice(2)}`);
    queue = new JobQueue(basePath, 2);
  });

  afterEach(() => {
    if (existsSync(basePath)) {
      rmSync(basePath, { recursive: true, force: true });
    }
  });

  describe('enqueue', () => {
    it('should add a job to the queue', async () => {
      await queue.enqueue('job-1');

      const job = queue.getJob('job-1');
      expect(job).not.toBeNull();
      expect(job!.jobId).toBe('job-1');
      expect(job!.status).toBe('pending');
      expect(job!.priority).toBe(0);
    });

    it('should support custom priority', async () => {
      await queue.enqueue('job-high', 10);
      await queue.enqueue('job-low', 1);

      const highJob = queue.getJob('job-high');
      const lowJob = queue.getJob('job-low');

      expect(highJob!.priority).toBe(10);
      expect(lowJob!.priority).toBe(1);
    });
  });

  describe('dequeue', () => {
    it('should return next pending job', async () => {
      await queue.enqueue('job-1');

      const job = await queue.dequeue();

      expect(job).not.toBeNull();
      expect(job!.jobId).toBe('job-1');
      expect(job!.status).toBe('running');
    });

    it('should return null when no pending jobs', async () => {
      const job = await queue.dequeue();
      expect(job).toBeNull();
    });

    it('should return null when max concurrent reached', async () => {
      await queue.enqueue('job-1');
      await queue.enqueue('job-2');
      await queue.enqueue('job-3');

      // Dequeue 2 jobs (max concurrent)
      await queue.dequeue();
      await queue.dequeue();

      // Third should be null
      const third = await queue.dequeue();
      expect(third).toBeNull();
    });

    it('should dequeue highest priority first', async () => {
      await queue.enqueue('low', 1);
      await queue.enqueue('high', 10);
      await queue.enqueue('medium', 5);

      const first = await queue.dequeue();
      expect(first!.jobId).toBe('high');

      const second = await queue.dequeue();
      expect(second!.jobId).toBe('medium');
    });

    it('should dequeue oldest first when same priority', async () => {
      await queue.enqueue('first', 0);
      // Small delay to ensure different createdAt
      await new Promise(resolve => setTimeout(resolve, 10));
      await queue.enqueue('second', 0);

      const job = await queue.dequeue();
      expect(job!.jobId).toBe('first');
    });
  });

  describe('complete', () => {
    it('should mark job as completed', async () => {
      await queue.enqueue('job-1');
      await queue.dequeue();

      await queue.complete('job-1');

      const job = queue.getJob('job-1');
      expect(job!.status).toBe('completed');
      expect(job!.completedAt).toBeDefined();
    });

    it('should do nothing for non-existent job', async () => {
      await expect(queue.complete('nonexistent')).resolves.toBeUndefined();
    });
  });

  describe('fail', () => {
    it('should mark job as failed with error', async () => {
      await queue.enqueue('job-1');
      await queue.dequeue();

      await queue.fail('job-1', 'Worker crashed');

      const job = queue.getJob('job-1');
      expect(job!.status).toBe('failed');
      expect(job!.error).toBe('Worker crashed');
      expect(job!.completedAt).toBeDefined();
    });
  });

  describe('getJob', () => {
    it('should return null for non-existent job', () => {
      const job = queue.getJob('nonexistent');
      expect(job).toBeNull();
    });
  });

  describe('getStats', () => {
    it('should return queue statistics', async () => {
      await queue.enqueue('job-1');
      await queue.enqueue('job-2');
      await queue.enqueue('job-3');

      await queue.dequeue(); // job-1 running
      await queue.complete('job-1'); // job-1 completed
      await queue.dequeue(); // job-2 running
      await queue.fail('job-2', 'error'); // job-2 failed

      const stats = queue.getStats();
      expect(stats.pending).toBe(1);
      expect(stats.running).toBe(0);
      expect(stats.completed).toBe(1);
      expect(stats.failed).toBe(1);
      expect(stats.total).toBe(3);
    });
  });

  describe('cleanup', () => {
    it('should remove old completed jobs', async () => {
      await queue.enqueue('job-1');
      await queue.dequeue();
      await queue.complete('job-1');

      // Force the completedAt to be old
      const job = queue.getJob('job-1')!;
      job.completedAt = Date.now() - 2 * 24 * 60 * 60 * 1000; // 2 days ago
      const { writeFileSync } = require('fs');
      writeFileSync(
        join(basePath, 'queue', 'job-1.json'),
        JSON.stringify(job, null, 2)
      );

      const cleaned = await queue.cleanup(24 * 60 * 60 * 1000); // 1 day
      expect(cleaned).toBe(1);
      expect(queue.getJob('job-1')).toBeNull();
    });

    it('should not remove recent completed jobs', async () => {
      await queue.enqueue('job-1');
      await queue.dequeue();
      await queue.complete('job-1');

      const cleaned = await queue.cleanup(24 * 60 * 60 * 1000);
      expect(cleaned).toBe(0);
      expect(queue.getJob('job-1')).not.toBeNull();
    });

    it('should remove old failed jobs', async () => {
      await queue.enqueue('job-1');
      await queue.dequeue();
      await queue.fail('job-1', 'error');

      // Force the completedAt to be old
      const job = queue.getJob('job-1')!;
      job.completedAt = Date.now() - 2 * 24 * 60 * 60 * 1000;
      const { writeFileSync } = require('fs');
      writeFileSync(
        join(basePath, 'queue', 'job-1.json'),
        JSON.stringify(job, null, 2)
      );

      const cleaned = await queue.cleanup(24 * 60 * 60 * 1000);
      expect(cleaned).toBe(1);
    });
  });
});
