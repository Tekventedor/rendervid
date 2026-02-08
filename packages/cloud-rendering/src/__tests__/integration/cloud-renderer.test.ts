/**
 * Integration tests for CloudRenderer
 * Tests all three cloud providers
 */

import { CloudRenderer } from '../../core/cloud-renderer';
import type { Template } from '@rendervid/core';

const testTemplate = {
  output: {
    type: 'video' as const,
    width: 1920,
    height: 1080,
    fps: 30,
    duration: 1,
  },
  composition: {
    scenes: [
      {
        id: 'test',
        startFrame: 0,
        endFrame: 29,
        layers: [
          {
            id: 'text1',
            type: 'text' as const,
            position: { x: 960, y: 540 },
            size: { width: 800, height: 100 },
            props: {
              text: 'Integration Test',
              fontSize: 72,
              color: '#ffffff',
            },
          },
        ],
      },
    ],
  },
} as Template;

describe('CloudRenderer Integration Tests', () => {
  describe('AWS Lambda', () => {
    it('should render video with AWS backend', async () => {
      // Skip if AWS credentials not configured
      if (!process.env.AWS_S3_BUCKET) {
        console.log('Skipping AWS test - no credentials');
        return;
      }

      const renderer = new CloudRenderer({
        provider: 'aws',
        awsConfig: {
          region: process.env.AWS_REGION || 'us-east-1',
          s3Bucket: process.env.AWS_S3_BUCKET!,
        },
      });

      const jobId = await renderer.startRenderAsync({
        template: testTemplate,
        quality: 'draft',
      });

      expect(jobId).toMatch(/^render-/);

      // Poll for completion (with timeout)
      const status = await renderer.getJobStatus(jobId);
      expect(status.jobId).toBe(jobId);
      expect(status.status).toMatch(/queued|rendering|merging|completed/);
    }, 60000); // 60s timeout
  });

  describe('Azure Functions', () => {
    it('should render video with Azure backend', async () => {
      if (!process.env.AZURE_STORAGE_ACCOUNT) {
        console.log('Skipping Azure test - no credentials');
        return;
      }

      const renderer = new CloudRenderer({
        provider: 'azure',
        azureConfig: {
          subscriptionId: process.env.AZURE_SUBSCRIPTION_ID!,
          storageAccount: process.env.AZURE_STORAGE_ACCOUNT!,
          storageContainer: process.env.AZURE_STORAGE_CONTAINER!,
          storageConnectionString: process.env.AZURE_STORAGE_CONNECTION_STRING!,
        },
      });

      const jobId = await renderer.startRenderAsync({
        template: testTemplate,
        quality: 'draft',
      });

      expect(jobId).toMatch(/^render-/);
    }, 60000);
  });

  describe('Google Cloud Functions', () => {
    it('should render video with GCP backend', async () => {
      if (!process.env.GCP_PROJECT_ID) {
        console.log('Skipping GCP test - no credentials');
        return;
      }

      const renderer = new CloudRenderer({
        provider: 'gcp',
        gcpConfig: {
          projectId: process.env.GCP_PROJECT_ID!,
          region: process.env.GCP_REGION || 'us-central1',
          storageBucket: process.env.GCP_STORAGE_BUCKET!,
        },
      });

      const jobId = await renderer.startRenderAsync({
        template: testTemplate,
        quality: 'draft',
      });

      expect(jobId).toMatch(/^render-/);
    }, 60000);
  });
});
