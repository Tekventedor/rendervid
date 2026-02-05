import { randomBytes } from 'crypto';
import { EventEmitter } from 'events';

export interface RenderJob {
  id: string;
  status: 'queued' | 'rendering' | 'completed' | 'failed';
  progress: number;
  currentFrame: number;
  totalFrames: number;
  phase: string;
  eta?: number;
  startTime: number;
  endTime?: number;
  outputPath?: string;
  error?: string;
  template: any;
  inputs: any;
  renderOptions: any;
}

/**
 * Job manager for async video rendering
 * Stores jobs in memory and allows status checking
 */
class JobManager extends EventEmitter {
  private jobs: Map<string, RenderJob> = new Map();
  private maxJobs = 100; // Keep last 100 jobs in memory

  /**
   * Create a new render job
   */
  createJob(template: any, inputs: any, renderOptions: any): string {
    const jobId = this.generateJobId();

    const job: RenderJob = {
      id: jobId,
      status: 'queued',
      progress: 0,
      currentFrame: 0,
      totalFrames: 0,
      phase: 'queued',
      startTime: Date.now(),
      template,
      inputs,
      renderOptions,
    };

    this.jobs.set(jobId, job);
    this.emit('job:created', job);

    // Clean up old jobs if we exceed max
    this.cleanupOldJobs();

    return jobId;
  }

  /**
   * Update job progress
   */
  updateProgress(jobId: string, progress: {
    phase: string;
    percent?: number;
    currentFrame?: number;
    totalFrames?: number;
    eta?: number;
  }): void {
    const job = this.jobs.get(jobId);
    if (!job) return;

    job.phase = progress.phase;
    job.progress = progress.percent || job.progress;
    job.currentFrame = progress.currentFrame || job.currentFrame;
    job.totalFrames = progress.totalFrames || job.totalFrames;
    job.eta = progress.eta;

    if (progress.phase === 'rendering' && job.status === 'queued') {
      job.status = 'rendering';
    }

    this.emit('job:progress', job);
  }

  /**
   * Mark job as completed
   */
  completeJob(jobId: string, outputPath: string): void {
    const job = this.jobs.get(jobId);
    if (!job) return;

    job.status = 'completed';
    job.progress = 100;
    job.endTime = Date.now();
    job.outputPath = outputPath;

    this.emit('job:completed', job);
  }

  /**
   * Mark job as failed
   */
  failJob(jobId: string, error: string): void {
    const job = this.jobs.get(jobId);
    if (!job) return;

    job.status = 'failed';
    job.endTime = Date.now();
    job.error = error;

    this.emit('job:failed', job);
  }

  /**
   * Get job status
   */
  getJob(jobId: string): RenderJob | undefined {
    return this.jobs.get(jobId);
  }

  /**
   * Get all jobs
   */
  getAllJobs(): RenderJob[] {
    return Array.from(this.jobs.values()).sort((a, b) => b.startTime - a.startTime);
  }

  /**
   * Get active jobs (queued or rendering)
   */
  getActiveJobs(): RenderJob[] {
    return this.getAllJobs().filter(job =>
      job.status === 'queued' || job.status === 'rendering'
    );
  }

  /**
   * Delete a job
   */
  deleteJob(jobId: string): boolean {
    return this.jobs.delete(jobId);
  }

  /**
   * Generate unique job ID
   */
  private generateJobId(): string {
    return `render-${randomBytes(8).toString('hex')}`;
  }

  /**
   * Clean up old completed/failed jobs
   */
  private cleanupOldJobs(): void {
    const allJobs = this.getAllJobs();

    if (allJobs.length <= this.maxJobs) return;

    // Keep active jobs and most recent completed/failed jobs
    const activeJobs = allJobs.filter(j => j.status === 'queued' || j.status === 'rendering');
    const inactiveJobs = allJobs.filter(j => j.status === 'completed' || j.status === 'failed');

    // Remove oldest inactive jobs
    const toRemove = inactiveJobs.slice(this.maxJobs - activeJobs.length);
    toRemove.forEach(job => this.jobs.delete(job.id));
  }
}

// Singleton instance
export const jobManager = new JobManager();
