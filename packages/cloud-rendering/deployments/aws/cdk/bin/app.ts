#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { StorageStack } from '../lib/storage-stack';
import { FunctionsStack } from '../lib/functions-stack';

const app = new cdk.App();

// Get configuration from context or environment
const env = {
  account: process.env.CDK_DEFAULT_ACCOUNT || process.env.AWS_ACCOUNT_ID,
  region: process.env.CDK_DEFAULT_REGION || process.env.AWS_REGION || 'us-east-1',
};

const chromiumLayerArn =
  process.env.AWS_CHROMIUM_LAYER_ARN ||
  app.node.tryGetContext('chromiumLayerArn') ||
  // Default to Sparticuz chromium layer (community-maintained)
  `arn:aws:lambda:${env.region}:764866452798:layer:chrome-aws-lambda:latest`;

// Storage Stack
const storageStack = new StorageStack(app, 'RendervidStorageStack', {
  env,
  description: 'Rendervid S3 storage for distributed rendering',
});

// Functions Stack
const functionsStack = new FunctionsStack(app, 'RendervidFunctionsStack', {
  env,
  description: 'Rendervid Lambda functions for distributed rendering',
  renderBucket: storageStack.renderBucket,
  chromiumLayerArn,
});

// Add dependency
functionsStack.addDependency(storageStack);

// Tags
cdk.Tags.of(app).add('Project', 'Rendervid');
cdk.Tags.of(app).add('Component', 'CloudRendering');
