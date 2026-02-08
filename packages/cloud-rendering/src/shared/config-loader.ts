import { config as loadEnv } from 'dotenv';
import type { AWSConfig, AzureConfig, GCPConfig } from '../types/provider-config';

/**
 * Load AWS configuration from environment variables
 */
export function loadAWSConfig(): AWSConfig {
  loadEnv();

  const region = process.env.AWS_REGION;
  const s3Bucket = process.env.AWS_S3_BUCKET;

  if (!region) {
    throw new Error('AWS_REGION environment variable is required');
  }

  if (!s3Bucket) {
    throw new Error('AWS_S3_BUCKET environment variable is required');
  }

  return {
    region,
    credentials:
      process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY
        ? {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
          }
        : undefined,
    s3Bucket,
    s3Prefix: process.env.AWS_S3_PREFIX || 'rendervid',
    mainFunctionName: process.env.AWS_MAIN_FUNCTION_NAME,
    workerFunctionName: process.env.AWS_WORKER_FUNCTION_NAME,
    mergerFunctionName: process.env.AWS_MERGER_FUNCTION_NAME,
    chromiumLayerArn: process.env.AWS_CHROMIUM_LAYER_ARN,
  };
}

/**
 * Load Azure configuration from environment variables
 */
export function loadAzureConfig(): AzureConfig {
  loadEnv();

  const subscriptionId = process.env.AZURE_SUBSCRIPTION_ID;
  const storageAccount = process.env.AZURE_STORAGE_ACCOUNT;
  const storageContainer = process.env.AZURE_STORAGE_CONTAINER;

  if (!subscriptionId) {
    throw new Error('AZURE_SUBSCRIPTION_ID environment variable is required');
  }

  if (!storageAccount) {
    throw new Error('AZURE_STORAGE_ACCOUNT environment variable is required');
  }

  if (!storageContainer) {
    throw new Error('AZURE_STORAGE_CONTAINER environment variable is required');
  }

  return {
    subscriptionId,
    tenantId: process.env.AZURE_TENANT_ID,
    credentials:
      process.env.AZURE_CLIENT_ID && process.env.AZURE_CLIENT_SECRET
        ? {
            clientId: process.env.AZURE_CLIENT_ID,
            clientSecret: process.env.AZURE_CLIENT_SECRET,
          }
        : undefined,
    storageAccount,
    storageContainer,
    storageConnectionString: process.env.AZURE_STORAGE_CONNECTION_STRING,
    storagePrefix: process.env.AZURE_STORAGE_PREFIX || 'rendervid',
    functionAppName: process.env.AZURE_FUNCTION_APP_NAME,
    mainFunctionName: process.env.AZURE_MAIN_FUNCTION_NAME,
    workerFunctionName: process.env.AZURE_WORKER_FUNCTION_NAME,
    mergerFunctionName: process.env.AZURE_MERGER_FUNCTION_NAME,
  };
}

/**
 * Load GCP configuration from environment variables
 */
export function loadGCPConfig(): GCPConfig {
  loadEnv();

  const projectId = process.env.GCP_PROJECT_ID;
  const region = process.env.GCP_REGION || 'us-central1';
  const storageBucket = process.env.GCP_STORAGE_BUCKET;

  if (!projectId) {
    throw new Error('GCP_PROJECT_ID environment variable is required');
  }

  if (!storageBucket) {
    throw new Error('GCP_STORAGE_BUCKET environment variable is required');
  }

  return {
    projectId,
    region,
    credentials: process.env.GOOGLE_APPLICATION_CREDENTIALS,
    storageBucket,
    storagePrefix: process.env.GCP_STORAGE_PREFIX || 'rendervid',
    mainFunctionName: process.env.GCP_MAIN_FUNCTION_NAME,
    workerFunctionName: process.env.GCP_WORKER_FUNCTION_NAME,
    mergerFunctionName: process.env.GCP_MERGER_FUNCTION_NAME,
  };
}

/**
 * Load provider configuration based on DEFAULT_PROVIDER env var
 */
export function loadDefaultProviderConfig():
  | { provider: 'aws'; config: AWSConfig }
  | { provider: 'azure'; config: AzureConfig }
  | { provider: 'gcp'; config: GCPConfig } {
  loadEnv();

  const provider = (process.env.DEFAULT_PROVIDER || 'aws') as 'aws' | 'azure' | 'gcp';

  switch (provider) {
    case 'aws':
      return { provider: 'aws', config: loadAWSConfig() };
    case 'azure':
      return { provider: 'azure', config: loadAzureConfig() };
    case 'gcp':
      return { provider: 'gcp', config: loadGCPConfig() };
    default:
      throw new Error(`Unknown provider: ${provider}`);
  }
}
