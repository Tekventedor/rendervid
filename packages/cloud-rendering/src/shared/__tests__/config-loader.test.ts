import { loadAWSConfig, loadAzureConfig, loadGCPConfig, loadDefaultProviderConfig } from '../config-loader';

// Mock dotenv
jest.mock('dotenv', () => ({
  config: jest.fn(),
}));

describe('Config Loader', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  describe('loadAWSConfig', () => {
    it('should load config from environment variables', () => {
      process.env.AWS_REGION = 'us-west-2';
      process.env.AWS_S3_BUCKET = 'my-bucket';

      const config = loadAWSConfig();

      expect(config.region).toBe('us-west-2');
      expect(config.s3Bucket).toBe('my-bucket');
      expect(config.s3Prefix).toBe('rendervid');
      expect(config.credentials).toBeUndefined();
    });

    it('should load credentials when both keys are set', () => {
      process.env.AWS_REGION = 'us-east-1';
      process.env.AWS_S3_BUCKET = 'my-bucket';
      process.env.AWS_ACCESS_KEY_ID = 'AKID123';
      process.env.AWS_SECRET_ACCESS_KEY = 'secret123';

      const config = loadAWSConfig();

      expect(config.credentials).toEqual({
        accessKeyId: 'AKID123',
        secretAccessKey: 'secret123',
      });
    });

    it('should throw when AWS_REGION is missing', () => {
      process.env.AWS_S3_BUCKET = 'my-bucket';
      delete process.env.AWS_REGION;

      expect(() => loadAWSConfig()).toThrow('AWS_REGION environment variable is required');
    });

    it('should throw when AWS_S3_BUCKET is missing', () => {
      process.env.AWS_REGION = 'us-east-1';
      delete process.env.AWS_S3_BUCKET;

      expect(() => loadAWSConfig()).toThrow('AWS_S3_BUCKET environment variable is required');
    });

    it('should load optional function names', () => {
      process.env.AWS_REGION = 'us-east-1';
      process.env.AWS_S3_BUCKET = 'my-bucket';
      process.env.AWS_S3_PREFIX = 'custom-prefix';
      process.env.AWS_MAIN_FUNCTION_NAME = 'my-main';
      process.env.AWS_WORKER_FUNCTION_NAME = 'my-worker';
      process.env.AWS_MERGER_FUNCTION_NAME = 'my-merger';
      process.env.AWS_CHROMIUM_LAYER_ARN = 'arn:aws:lambda:us-east-1:123:layer:chromium';

      const config = loadAWSConfig();

      expect(config.s3Prefix).toBe('custom-prefix');
      expect(config.mainFunctionName).toBe('my-main');
      expect(config.workerFunctionName).toBe('my-worker');
      expect(config.mergerFunctionName).toBe('my-merger');
      expect(config.chromiumLayerArn).toBe('arn:aws:lambda:us-east-1:123:layer:chromium');
    });
  });

  describe('loadAzureConfig', () => {
    it('should load config from environment variables', () => {
      process.env.AZURE_SUBSCRIPTION_ID = 'sub-123';
      process.env.AZURE_STORAGE_ACCOUNT = 'mystorageaccount';
      process.env.AZURE_STORAGE_CONTAINER = 'mycontainer';

      const config = loadAzureConfig();

      expect(config.subscriptionId).toBe('sub-123');
      expect(config.storageAccount).toBe('mystorageaccount');
      expect(config.storageContainer).toBe('mycontainer');
      expect(config.storagePrefix).toBe('rendervid');
    });

    it('should load credentials when both are set', () => {
      process.env.AZURE_SUBSCRIPTION_ID = 'sub-123';
      process.env.AZURE_STORAGE_ACCOUNT = 'mystorageaccount';
      process.env.AZURE_STORAGE_CONTAINER = 'mycontainer';
      process.env.AZURE_CLIENT_ID = 'client-id';
      process.env.AZURE_CLIENT_SECRET = 'client-secret';

      const config = loadAzureConfig();

      expect(config.credentials).toEqual({
        clientId: 'client-id',
        clientSecret: 'client-secret',
      });
    });

    it('should throw when AZURE_SUBSCRIPTION_ID is missing', () => {
      process.env.AZURE_STORAGE_ACCOUNT = 'mystorageaccount';
      process.env.AZURE_STORAGE_CONTAINER = 'mycontainer';
      delete process.env.AZURE_SUBSCRIPTION_ID;

      expect(() => loadAzureConfig()).toThrow(
        'AZURE_SUBSCRIPTION_ID environment variable is required'
      );
    });

    it('should throw when AZURE_STORAGE_ACCOUNT is missing', () => {
      process.env.AZURE_SUBSCRIPTION_ID = 'sub-123';
      process.env.AZURE_STORAGE_CONTAINER = 'mycontainer';
      delete process.env.AZURE_STORAGE_ACCOUNT;

      expect(() => loadAzureConfig()).toThrow(
        'AZURE_STORAGE_ACCOUNT environment variable is required'
      );
    });

    it('should throw when AZURE_STORAGE_CONTAINER is missing', () => {
      process.env.AZURE_SUBSCRIPTION_ID = 'sub-123';
      process.env.AZURE_STORAGE_ACCOUNT = 'mystorageaccount';
      delete process.env.AZURE_STORAGE_CONTAINER;

      expect(() => loadAzureConfig()).toThrow(
        'AZURE_STORAGE_CONTAINER environment variable is required'
      );
    });
  });

  describe('loadGCPConfig', () => {
    it('should load config from environment variables', () => {
      process.env.GCP_PROJECT_ID = 'my-project';
      process.env.GCP_STORAGE_BUCKET = 'my-bucket';

      const config = loadGCPConfig();

      expect(config.projectId).toBe('my-project');
      expect(config.region).toBe('us-central1');
      expect(config.storageBucket).toBe('my-bucket');
      expect(config.storagePrefix).toBe('rendervid');
    });

    it('should use custom region when set', () => {
      process.env.GCP_PROJECT_ID = 'my-project';
      process.env.GCP_STORAGE_BUCKET = 'my-bucket';
      process.env.GCP_REGION = 'europe-west1';

      const config = loadGCPConfig();

      expect(config.region).toBe('europe-west1');
    });

    it('should throw when GCP_PROJECT_ID is missing', () => {
      process.env.GCP_STORAGE_BUCKET = 'my-bucket';
      delete process.env.GCP_PROJECT_ID;

      expect(() => loadGCPConfig()).toThrow(
        'GCP_PROJECT_ID environment variable is required'
      );
    });

    it('should throw when GCP_STORAGE_BUCKET is missing', () => {
      process.env.GCP_PROJECT_ID = 'my-project';
      delete process.env.GCP_STORAGE_BUCKET;

      expect(() => loadGCPConfig()).toThrow(
        'GCP_STORAGE_BUCKET environment variable is required'
      );
    });

    it('should load optional fields', () => {
      process.env.GCP_PROJECT_ID = 'my-project';
      process.env.GCP_STORAGE_BUCKET = 'my-bucket';
      process.env.GCP_STORAGE_PREFIX = 'custom';
      process.env.GCP_MAIN_FUNCTION_NAME = 'main-fn';
      process.env.GCP_WORKER_FUNCTION_NAME = 'worker-fn';
      process.env.GCP_MERGER_FUNCTION_NAME = 'merger-fn';
      process.env.GOOGLE_APPLICATION_CREDENTIALS = '/path/to/key.json';

      const config = loadGCPConfig();

      expect(config.storagePrefix).toBe('custom');
      expect(config.mainFunctionName).toBe('main-fn');
      expect(config.workerFunctionName).toBe('worker-fn');
      expect(config.mergerFunctionName).toBe('merger-fn');
      expect(config.credentials).toBe('/path/to/key.json');
    });
  });

  describe('loadDefaultProviderConfig', () => {
    it('should default to AWS when DEFAULT_PROVIDER is not set', () => {
      process.env.AWS_REGION = 'us-east-1';
      process.env.AWS_S3_BUCKET = 'my-bucket';
      delete process.env.DEFAULT_PROVIDER;

      const result = loadDefaultProviderConfig();

      expect(result.provider).toBe('aws');
    });

    it('should load Azure config when DEFAULT_PROVIDER is azure', () => {
      process.env.DEFAULT_PROVIDER = 'azure';
      process.env.AZURE_SUBSCRIPTION_ID = 'sub-123';
      process.env.AZURE_STORAGE_ACCOUNT = 'mystorageaccount';
      process.env.AZURE_STORAGE_CONTAINER = 'mycontainer';

      const result = loadDefaultProviderConfig();

      expect(result.provider).toBe('azure');
    });

    it('should load GCP config when DEFAULT_PROVIDER is gcp', () => {
      process.env.DEFAULT_PROVIDER = 'gcp';
      process.env.GCP_PROJECT_ID = 'my-project';
      process.env.GCP_STORAGE_BUCKET = 'my-bucket';

      const result = loadDefaultProviderConfig();

      expect(result.provider).toBe('gcp');
    });
  });
});
