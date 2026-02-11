// Mock AWS SDK before imports
jest.mock('@aws-sdk/client-lambda', () => {
  return {
    LambdaClient: jest.fn().mockImplementation(() => ({
      send: jest.fn(),
    })),
    InvokeCommand: jest.fn().mockImplementation((params) => params),
  };
});

jest.mock('../aws-s3-client', () => {
  return {
    AWSS3Client: jest.fn().mockImplementation(() => ({
      upload: jest.fn(),
      download: jest.fn(),
      exists: jest.fn(),
      list: jest.fn(),
      delete: jest.fn(),
      deletePrefix: jest.fn(),
    })),
  };
});

jest.mock('../../../shared/s3-state-manager', () => {
  return {
    S3StateManager: jest.fn().mockImplementation(() => ({
      getJobStatus: jest.fn(),
      deleteJob: jest.fn(),
      downloadCompletion: jest.fn(),
      uploadManifest: jest.fn(),
      uploadTemplate: jest.fn(),
    })),
  };
});

jest.mock('../../../core/job-poller', () => ({
  pollJobUntilComplete: jest.fn(),
}));

import { AWSBackend } from '../aws-backend';
import { LambdaClient, InvokeCommand } from '@aws-sdk/client-lambda';
import { pollJobUntilComplete } from '../../../core/job-poller';
import type { AWSConfig } from '../../../types/provider-config';
import type { Template } from '@rendervid/core';

describe('AWSBackend', () => {
  let backend: AWSBackend;
  const config: AWSConfig = {
    region: 'us-east-1',
    s3Bucket: 'test-bucket',
    s3Prefix: 'rendervid',
  };

  const testTemplate: Template = {
    name: 'Test Template',
    inputs: [],
    output: {
      type: 'video' as const,
      width: 1920,
      height: 1080,
      fps: 30,
      duration: 1,
    },
    composition: {
      scenes: [{
        id: 'test',
        startFrame: 0,
        endFrame: 29,
        layers: [{
          id: 'text1',
          type: 'text' as const,
          position: { x: 960, y: 540 },
          size: { width: 800, height: 100 },
          props: { text: 'Test', fontSize: 72, color: '#ffffff' },
        }],
      }],
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    backend = new AWSBackend(config);
  });

  it('should have correct name and provider', () => {
    expect(backend.name).toBe('AWS Lambda');
    expect(backend.provider).toBe('aws');
  });

  it('should initialize Lambda client with config', () => {
    expect(LambdaClient).toHaveBeenCalledWith({
      region: 'us-east-1',
      credentials: undefined,
    });
  });

  describe('startRenderAsync', () => {
    it('should invoke main Lambda and return job ID', async () => {
      const mockSend = (backend as any).lambdaClient.send;
      mockSend.mockResolvedValue({
        Payload: Buffer.from(JSON.stringify({
          jobId: 'render-123',
          chunksTotal: 5,
        })),
      });

      const jobId = await backend.startRenderAsync({
        template: testTemplate,
        quality: 'draft',
      });

      expect(jobId).toBe('render-123');
      expect(mockSend).toHaveBeenCalled();
    });

    it('should throw when Lambda returns no payload', async () => {
      const mockSend = (backend as any).lambdaClient.send;
      mockSend.mockResolvedValue({ Payload: undefined });

      await expect(
        backend.startRenderAsync({ template: testTemplate })
      ).rejects.toThrow('Main Lambda returned no payload');
    });
  });

  describe('getJobStatus', () => {
    it('should delegate to state manager', async () => {
      const expectedStatus = {
        jobId: 'job-1',
        status: 'rendering',
        progress: 50,
        chunksCompleted: 5,
        chunksTotal: 10,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      (backend as any).stateManager.getJobStatus.mockResolvedValue(expectedStatus);

      const status = await backend.getJobStatus('job-1');

      expect(status).toEqual(expectedStatus);
    });
  });

  describe('cancelJob', () => {
    it('should delegate to state manager deleteJob', async () => {
      await backend.cancelJob('job-1');

      expect((backend as any).stateManager.deleteJob).toHaveBeenCalledWith('job-1');
    });
  });

  describe('renderVideo', () => {
    it('should start async render, poll, and return result', async () => {
      const mockSend = (backend as any).lambdaClient.send;
      mockSend.mockResolvedValue({
        Payload: Buffer.from(JSON.stringify({
          jobId: 'render-123',
          chunksTotal: 2,
        })),
      });

      const finalStatus = {
        jobId: 'render-123',
        status: 'completed',
        progress: 100,
        chunksCompleted: 2,
        chunksTotal: 2,
        storageUrl: 's3://test-bucket/rendervid/jobs/render-123/output.mp4',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (pollJobUntilComplete as jest.Mock).mockResolvedValue(finalStatus);
      (backend as any).stateManager.downloadCompletion.mockResolvedValue({
        duration: 1,
        fileSize: 50000,
      });

      const result = await backend.renderVideo({
        template: testTemplate,
        quality: 'draft',
      });

      expect(result.success).toBe(true);
      expect(result.jobId).toBe('render-123');
      expect(result.storageUrl).toBe('s3://test-bucket/rendervid/jobs/render-123/output.mp4');
      expect(result.chunksRendered).toBe(2);
    });
  });
});
