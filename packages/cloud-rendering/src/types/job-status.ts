/**
 * Status of a cloud rendering job
 */
export interface JobStatus {
  /** Unique job identifier */
  jobId: string;

  /** Current status of the job */
  status: 'queued' | 'validating' | 'rendering' | 'merging' | 'completed' | 'failed';

  /** Progress percentage (0-100) */
  progress: number;

  /** Number of chunks that have completed rendering */
  chunksCompleted: number;

  /** Total number of chunks */
  chunksTotal: number;

  /** Estimated time remaining in seconds (null if unknown) */
  estimatedTimeRemaining?: number;

  /** Cloud storage URL (available when status='completed') */
  storageUrl?: string;

  /** Error message (if status='failed') */
  error?: string;

  /** Timestamp when the job was created */
  createdAt: Date;

  /** Timestamp when the job was last updated */
  updatedAt: Date;

  /** Timestamp when the job completed or failed */
  completedAt?: Date;
}

/**
 * Internal manifest stored in cloud storage (S3/Blob/GCS)
 */
export interface JobManifest {
  /** Job ID */
  jobId: string;

  /** Total frames in the video */
  totalFrames: number;

  /** Frame rate (fps) */
  fps: number;

  /** Chunk definitions */
  chunks: ChunkDefinition[];

  /** Current status */
  status: JobStatus['status'];

  /** Timestamp when the job was created */
  createdAt: string;

  /** Timestamp when template was validated */
  validatedAt?: string;

  /** Quality preset used */
  quality: 'draft' | 'standard' | 'high';

  /** Cloud provider used */
  provider: 'aws' | 'azure' | 'gcp' | 'cloudflare';
}

/**
 * Definition of a chunk to be rendered by a worker
 */
export interface ChunkDefinition {
  /** Chunk ID (0-indexed) */
  id: number;

  /** First frame to render (inclusive) */
  startFrame: number;

  /** Last frame to render (inclusive) */
  endFrame: number;

  /** Number of frames in this chunk */
  frameCount: number;
}

/**
 * Progress data written by each worker
 */
export interface WorkerProgress {
  /** Chunk ID this worker is processing */
  chunkId: number;

  /** Worker status */
  status: 'started' | 'rendering' | 'encoding' | 'uploading' | 'completed' | 'failed';

  /** Number of frames rendered so far */
  framesRendered: number;

  /** Total frames this worker needs to render */
  totalFrames: number;

  /** Error message if failed */
  error?: string;

  /** Timestamp of last update */
  timestamp: string;

  /** Worker execution time in milliseconds */
  executionTimeMs?: number;
}

/**
 * Completion marker written by merger function
 */
export interface JobCompletion {
  /** Status */
  status: 'completed' | 'failed';

  /** Cloud storage URL of final video */
  outputUrl: string;

  /** File size in bytes */
  fileSize: number;

  /** Video duration in seconds */
  duration: number;

  /** Total render time in milliseconds */
  renderTime: number;

  /** Number of chunks that were rendered */
  chunksRendered: number;

  /** Timestamp when job completed */
  completedAt: string;

  /** Error message if failed */
  error?: string;
}
