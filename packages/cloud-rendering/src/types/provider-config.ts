/**
 * Configuration for AWS Lambda backend
 */
export interface AWSConfig {
  /** AWS region (e.g., 'us-east-1') */
  region: string;

  /** AWS credentials */
  credentials?: {
    accessKeyId: string;
    secretAccessKey: string;
  };

  /** S3 bucket name for storing render jobs */
  s3Bucket: string;

  /** S3 key prefix (default: 'rendervid') */
  s3Prefix?: string;

  /** Main coordinator Lambda function name */
  mainFunctionName?: string;

  /** Worker Lambda function name */
  workerFunctionName?: string;

  /** Merger Lambda function name */
  mergerFunctionName?: string;

  /** Chromium Lambda layer ARN */
  chromiumLayerArn?: string;
}

/**
 * Configuration for Azure Functions backend
 */
export interface AzureConfig {
  /** Azure subscription ID */
  subscriptionId: string;

  /** Azure tenant ID */
  tenantId?: string;

  /** Azure credentials */
  credentials?: {
    clientId: string;
    clientSecret: string;
  };

  /** Storage account name */
  storageAccount: string;

  /** Storage container name */
  storageContainer: string;

  /** Storage connection string */
  storageConnectionString?: string;

  /** Storage key prefix (default: 'rendervid') */
  storagePrefix?: string;

  /** Function app name */
  functionAppName?: string;

  /** Main coordinator function name */
  mainFunctionName?: string;

  /** Worker function name */
  workerFunctionName?: string;

  /** Merger function name */
  mergerFunctionName?: string;
}

/**
 * Configuration for Google Cloud Functions backend
 */
export interface GCPConfig {
  /** GCP project ID */
  projectId: string;

  /** GCP region (e.g., 'us-central1') */
  region: string;

  /** Path to service account key file */
  credentials?: string;

  /** Cloud Storage bucket name */
  storageBucket: string;

  /** Storage key prefix (default: 'rendervid') */
  storagePrefix?: string;

  /** Main coordinator function name */
  mainFunctionName?: string;

  /** Worker function name */
  workerFunctionName?: string;

  /** Merger function name */
  mergerFunctionName?: string;
}

/**
 * Quality presets for rendering
 */
export interface QualityPreset {
  /** Function memory allocation (MB) */
  memory: number;

  /** Function timeout (seconds) */
  timeout: number;

  /** Maximum concurrent workers */
  concurrency: number;

  /** Frames per chunk */
  framesPerChunk: number;
}

/**
 * Configuration for Docker backend
 */
export interface DockerConfig {
  /** Number of worker containers to spawn */
  workersCount?: number;

  /** Local volume path for job storage */
  volumePath: string;

  /** Docker network name (default: 'rendervid-network') */
  networkName?: string;

  /** Docker Compose project name (default: 'rendervid') */
  projectName?: string;

  /** Maximum concurrent jobs (default: 10) */
  maxConcurrentJobs?: number;

  /** Job queue check interval in ms (default: 2000) */
  queueCheckInterval?: number;

  /** Worker container image (default: 'rendervid-worker:latest') */
  workerImage?: string;

  /** Merger container image (default: 'rendervid-merger:latest') */
  mergerImage?: string;
}

/**
 * Provider-specific quality presets
 */
export interface ProviderPresets {
  draft: QualityPreset;
  standard: QualityPreset;
  high: QualityPreset;
}
