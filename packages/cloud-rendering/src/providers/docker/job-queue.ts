import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

/**
 * Job queue status
 */
export type QueueJobStatus = 'pending' | 'running' | 'completed' | 'failed';

/**
 * Job in the queue
 */
export interface QueueJob {
  jobId: string;
  status: QueueJobStatus;
  priority: number;
  createdAt: number;
  startedAt?: number;
  completedAt?: number;
  error?: string;
}

/**
 * Simple file-based job queue for Docker rendering
 * Handles multiple concurrent render requests with limited workers
 */
export class JobQueue {
  private queuePath: string;
  private maxConcurrent: number;

  constructor(basePath: string, maxConcurrent: number = 10) {
    this.queuePath = join(basePath, 'queue');
    this.maxConcurrent = maxConcurrent;

    // Ensure queue directory exists
    if (!existsSync(this.queuePath)) {
      mkdirSync(this.queuePath, { recursive: true });
    }
  }

  /**
   * Add a new job to the queue
   */
  async enqueue(jobId: string, priority: number = 0): Promise<void> {
    const job: QueueJob = {
      jobId,
      status: 'pending',
      priority,
      createdAt: Date.now(),
    };

    this.saveJob(job);
  }

  /**
   * Get next job to process (highest priority, oldest first)
   * Returns null if max concurrent jobs reached
   */
  async dequeue(): Promise<QueueJob | null> {
    const jobs = this.getAllJobs();

    // Count running jobs
    const runningCount = jobs.filter((j) => j.status === 'running').length;

    if (runningCount >= this.maxConcurrent) {
      return null; // Max concurrent jobs reached
    }

    // Find next pending job (highest priority, then oldest)
    const pendingJobs = jobs
      .filter((j) => j.status === 'pending')
      .sort((a, b) => {
        if (a.priority !== b.priority) {
          return b.priority - a.priority; // Higher priority first
        }
        return a.createdAt - b.createdAt; // Older first
      });

    if (pendingJobs.length === 0) {
      return null; // No pending jobs
    }

    const nextJob = pendingJobs[0];

    // Mark as running
    nextJob.status = 'running';
    nextJob.startedAt = Date.now();
    this.saveJob(nextJob);

    return nextJob;
  }

  /**
   * Mark job as completed
   */
  async complete(jobId: string): Promise<void> {
    const job = this.getJob(jobId);
    if (!job) return;

    job.status = 'completed';
    job.completedAt = Date.now();
    this.saveJob(job);
  }

  /**
   * Mark job as failed
   */
  async fail(jobId: string, error: string): Promise<void> {
    const job = this.getJob(jobId);
    if (!job) return;

    job.status = 'failed';
    job.error = error;
    job.completedAt = Date.now();
    this.saveJob(job);
  }

  /**
   * Get job status
   */
  getJob(jobId: string): QueueJob | null {
    const filePath = join(this.queuePath, `${jobId}.json`);

    if (!existsSync(filePath)) {
      return null;
    }

    const content = readFileSync(filePath, 'utf-8');
    return JSON.parse(content) as QueueJob;
  }

  /**
   * Get all jobs
   */
  private getAllJobs(): QueueJob[] {
    const { readdirSync } = require('fs');
    const files = readdirSync(this.queuePath);

    return files
      .filter((f: string) => f.endsWith('.json'))
      .map((f: string) => {
        const content = readFileSync(join(this.queuePath, f), 'utf-8');
        return JSON.parse(content) as QueueJob;
      });
  }

  /**
   * Save job to disk
   */
  private saveJob(job: QueueJob): void {
    const filePath = join(this.queuePath, `${job.jobId}.json`);
    writeFileSync(filePath, JSON.stringify(job, null, 2));
  }

  /**
   * Get queue statistics
   */
  getStats(): {
    pending: number;
    running: number;
    completed: number;
    failed: number;
    total: number;
  } {
    const jobs = this.getAllJobs();

    return {
      pending: jobs.filter((j) => j.status === 'pending').length,
      running: jobs.filter((j) => j.status === 'running').length,
      completed: jobs.filter((j) => j.status === 'completed').length,
      failed: jobs.filter((j) => j.status === 'failed').length,
      total: jobs.length,
    };
  }

  /**
   * Clean up old completed/failed jobs
   */
  async cleanup(olderThanMs: number = 24 * 60 * 60 * 1000): Promise<number> {
    const jobs = this.getAllJobs();
    const now = Date.now();
    let cleaned = 0;

    for (const job of jobs) {
      if (
        (job.status === 'completed' || job.status === 'failed') &&
        job.completedAt &&
        now - job.completedAt > olderThanMs
      ) {
        const filePath = join(this.queuePath, `${job.jobId}.json`);
        const { unlinkSync } = require('fs');
        unlinkSync(filePath);
        cleaned++;
      }
    }

    return cleaned;
  }
}
