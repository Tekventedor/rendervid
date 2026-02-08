# AWS Lambda Deployment Guide

This guide walks you through deploying the Rendervid cloud rendering system on AWS Lambda.

## Prerequisites

- AWS Account with appropriate permissions
- AWS CLI configured (`aws configure`)
- Node.js 20.x or later
- pnpm (or npm)
- AWS CDK CLI installed (`npm install -g aws-cdk`)

## Architecture Overview

The AWS deployment consists of:

1. **S3 Bucket** - Stores templates, chunks, progress, and final videos
2. **Main Lambda** - Coordinates render jobs (3 GB RAM, 5 min timeout)
3. **Worker Lambdas** - Render video chunks in parallel (5 GB RAM, 15 min timeout)
4. **Merger Lambda** - Concatenates chunks into final video (3 GB RAM, 15 min timeout)
5. **Chromium Layer** - Provides Chromium and FFmpeg binaries

## Step 1: Set Up Chromium Lambda Layer

You need a Lambda layer containing Chromium and FFmpeg. We recommend using the community-maintained Sparticuz layer:

### Option A: Use Sparticuz Chromium Layer (Recommended)

The layer is available in all AWS regions:

```bash
# The CDK will automatically use this ARN:
# arn:aws:lambda:${region}:764866452798:layer:chrome-aws-lambda:latest
```

### Option B: Build Your Own Layer

If you prefer to build your own layer:

```bash
# Install dependencies
cd deployments/aws/layers/chromium
npm install

# Build layer
./build.sh

# Deploy layer
aws lambda publish-layer-version \
  --layer-name rendervid-chromium \
  --zip-file fileb://chromium-layer.zip \
  --compatible-runtimes nodejs20.x

# Save the ARN
export AWS_CHROMIUM_LAYER_ARN="arn:aws:lambda:us-east-1:YOUR_ACCOUNT:layer:rendervid-chromium:1"
```

## Step 2: Build the Package

Build the cloud-rendering package:

```bash
# From the cloud-rendering package directory
cd packages/cloud-rendering

# Install dependencies
pnpm install

# Build
pnpm build
```

## Step 3: Deploy Infrastructure with CDK

```bash
cd deployments/aws/cdk

# Install CDK dependencies
pnpm install

# Set environment variables
export AWS_REGION=us-east-1
export AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)

# Optional: Use custom Chromium layer
# export AWS_CHROMIUM_LAYER_ARN="arn:aws:lambda:..."

# Bootstrap CDK (first time only)
cdk bootstrap aws://$AWS_ACCOUNT_ID/$AWS_REGION

# Deploy stacks
cdk deploy --all

# OR deploy individually:
# cdk deploy RendervidStorageStack
# cdk deploy RendervidFunctionsStack
```

The deployment will output:
- S3 bucket name
- Lambda function ARNs

Save these values for your `.env` file.

## Step 4: Configure Environment Variables

Create a `.env` file in your application:

```bash
# AWS Configuration
AWS_REGION=us-east-1
AWS_ACCOUNT_ID=123456789012
AWS_ACCESS_KEY_ID=AKIA...
AWS_SECRET_ACCESS_KEY=...

# Lambda Function Names (from CDK deployment)
AWS_MAIN_FUNCTION_NAME=rendervid-main
AWS_WORKER_FUNCTION_NAME=rendervid-worker
AWS_MERGER_FUNCTION_NAME=rendervid-merger

# S3 Bucket (from CDK deployment)
AWS_S3_BUCKET=rendervid-renders-123456789012
AWS_S3_PREFIX=rendervid

# Chromium Layer ARN
AWS_CHROMIUM_LAYER_ARN=arn:aws:lambda:us-east-1:764866452798:layer:chrome-aws-lambda:latest
```

## Step 5: Test the Deployment

Create a test script:

```typescript
import { CloudRenderer } from '@rendervid/cloud-rendering';

const renderer = new CloudRenderer({
  provider: 'aws',
  awsConfig: {
    region: process.env.AWS_REGION!,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
    s3Bucket: process.env.AWS_S3_BUCKET!,
    s3Prefix: 'rendervid',
  },
});

// Test template
const testTemplate = {
  output: { width: 1920, height: 1080, fps: 30, duration: 5 },
  composition: {
    scenes: [
      {
        id: 'test',
        startFrame: 0,
        endFrame: 149,
        layers: [
          {
            type: 'text',
            props: {
              text: 'Hello from AWS Lambda!',
              x: 960,
              y: 540,
              fontSize: 72,
              color: '#ffffff',
            },
          },
        ],
      },
    ],
  },
};

// Render
const result = await renderer.renderVideo({
  template: testTemplate,
  quality: 'standard',
});

console.log('Render complete:', result);
```

Run the test:

```bash
node test-aws.js
```

## Step 6: Monitor and Debug

### CloudWatch Logs

View logs for each function:

```bash
# Main function logs
aws logs tail /aws/lambda/rendervid-main --follow

# Worker function logs
aws logs tail /aws/lambda/rendervid-worker --follow

# Merger function logs
aws logs tail /aws/lambda/rendervid-merger --follow
```

### S3 Job Status

Check job status in S3:

```bash
# List jobs
aws s3 ls s3://YOUR_BUCKET/rendervid/jobs/

# Check job manifest
aws s3 cp s3://YOUR_BUCKET/rendervid/jobs/render-abc123/manifest.json -

# Check worker progress
aws s3 ls s3://YOUR_BUCKET/rendervid/jobs/render-abc123/progress/

# Download rendered video
aws s3 cp s3://YOUR_BUCKET/rendervid/jobs/render-abc123/output.mp4 ./output.mp4
```

## Cost Optimization

### Estimated Costs

For a 1-minute video (1800 frames, 20 workers):

- **Lambda execution**: ~$0.02
  - Main: 5s × 3 GB = $0.0001
  - Workers: 20 × 15s × 5 GB = $0.015
  - Merger: 10s × 3 GB = $0.0002
- **S3 storage**: ~$0.001 (temporary)
- **Data transfer**: ~$0.01 (minimal)

**Total**: ~$0.03 per minute of rendered video

### Cost Reduction Tips

1. **Use draft quality** for testing (faster, cheaper)
2. **Clean up old jobs** - lifecycle policy deletes after 7 days
3. **Adjust concurrency** - fewer workers = lower cost (but slower)
4. **Use S3 Intelligent-Tiering** for long-term storage
5. **Monitor Lambda costs** with Cost Explorer

## Troubleshooting

### Issue: "Function timed out"

**Cause**: Worker Lambda ran out of time (15 min default)

**Solution**: Reduce frames per chunk or increase timeout

```typescript
const result = await renderer.renderVideo({
  template: myTemplate,
  quality: 'draft', // Faster encoding
  framesPerChunk: 20, // Fewer frames per worker
});
```

### Issue: "Out of memory"

**Cause**: Worker Lambda ran out of RAM

**Solution**: Increase Lambda memory in CDK:

```typescript
// In functions-stack.ts
this.workerFunction = new lambda.Function(this, 'WorkerFunction', {
  memorySize: 10240, // Increase to 10 GB
  // ...
});
```

Redeploy:

```bash
cd deployments/aws/cdk
cdk deploy RendervidFunctionsStack
```

### Issue: "Chromium not found"

**Cause**: Chromium layer not attached or wrong path

**Solution**: Verify layer ARN and path:

```bash
# Check layer is attached
aws lambda get-function --function-name rendervid-worker \
  | jq '.Configuration.Layers'

# Expected: [{ "Arn": "arn:aws:lambda:...:layer:chrome-aws-lambda:..." }]
```

### Issue: "Template validation failed"

**Cause**: Invalid template structure

**Solution**: Check template before rendering:

```typescript
import { validateTemplate } from '@rendervid/cloud-rendering';

const validation = validateTemplate(myTemplate);
if (!validation.valid) {
  console.error('Template errors:', validation.errors);
}
```

## Cleanup

To delete all AWS resources:

```bash
cd deployments/aws/cdk

# Delete all stacks
cdk destroy --all

# Confirm deletion
# WARNING: This will delete the S3 bucket and all rendered videos!
```

## Next Steps

- Read [API Documentation](../API.md)
- See [Examples](../../examples/)
- Configure [Azure Functions](./DEPLOYMENT_AZURE.md) or [Google Cloud](./DEPLOYMENT_GCP.md)
- Set up monitoring with CloudWatch Dashboards

## Support

- [GitHub Issues](https://github.com/rendervid/rendervid/issues)
- [AWS Lambda Limits](https://docs.aws.amazon.com/lambda/latest/dg/gettingstarted-limits.html)
- [Sparticuz Chromium Layer](https://github.com/Sparticuz/chromium)
