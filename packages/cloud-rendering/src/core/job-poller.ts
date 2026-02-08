import type { JobStatus } from '../types/job-status';

/**
 * Options for job polling
 */
export interface JobPollerOptions {
  /** Polling interval in milliseconds (default: 5000) */
  intervalMs?: number;

  /** Maximum time to wait in milliseconds (default: 3600000 = 1 hour) */
  timeoutMs?: number;

  /** Callback for progress updates */
  onProgress?: (status: JobStatus) => void;
}

/**
 * Poll a job until completion or failure
 *
 * @param getStatus - Function to get current job status
 * @param options - Polling options
 * @returns Final job status
 * @throws Error if timeout is reached or job fails
 */
export async function pollJobUntilComplete(
  getStatus: () => Promise<JobStatus>,
  options: JobPollerOptions = {}
): Promise<JobStatus> {
  const {
    intervalMs = 5000,
    timeoutMs = 3600000, // 1 hour default
    onProgress,
  } = options;

  const startTime = Date.now();

  while (true) {
    // Check timeout
    if (Date.now() - startTime > timeoutMs) {
      throw new Error(`Job polling timeout after ${timeoutMs}ms`);
    }

    // Get current status
    const status = await getStatus();

    // Call progress callback
    if (onProgress) {
      onProgress(status);
    }

    // Check if job is done
    if (status.status === 'completed') {
      return status;
    }

    if (status.status === 'failed') {
      throw new Error(`Job failed: ${status.error || 'Unknown error'}`);
    }

    // Wait before next poll
    await sleep(intervalMs);
  }
}

/**
 * Sleep for a given number of milliseconds
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Calculate estimated time remaining based on progress
 *
 * @param status - Current job status
 * @param startTime - Job start time (milliseconds since epoch)
 * @returns Estimated seconds remaining (or null if unknown)
 */
export function calculateEstimatedTimeRemaining(
  status: JobStatus,
  startTime: number
): number | null {
  if (status.progress <= 0 || status.progress >= 100) {
    return null;
  }

  const elapsed = Date.now() - startTime;
  const estimatedTotal = elapsed / (status.progress / 100);
  const remaining = estimatedTotal - elapsed;

  return Math.max(0, Math.round(remaining / 1000));
}
