import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';

/**
 * CDK Stack for Rendervid S3 Storage
 *
 * Creates:
 * - S3 bucket for render jobs
 * - Lifecycle policies for automatic cleanup
 */
export class StorageStack extends cdk.Stack {
  public readonly renderBucket: s3.Bucket;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // S3 Bucket for render jobs
    this.renderBucket = new s3.Bucket(this, 'RenderBucket', {
      bucketName: `rendervid-renders-${this.account}`,
      encryption: s3.BucketEncryption.S3_MANAGED,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      versioned: false,
      cors: [
        {
          allowedMethods: [
            s3.HttpMethods.GET,
            s3.HttpMethods.PUT,
            s3.HttpMethods.POST,
            s3.HttpMethods.DELETE,
          ],
          allowedOrigins: ['*'],
          allowedHeaders: ['*'],
        },
      ],
      lifecycleRules: [
        {
          id: 'DeleteOldRenders',
          enabled: true,
          prefix: 'rendervid/jobs/',
          expiration: cdk.Duration.days(7), // Auto-delete after 7 days
        },
        {
          id: 'TransitionToIA',
          enabled: true,
          prefix: 'rendervid/jobs/',
          transitions: [
            {
              storageClass: s3.StorageClass.INFREQUENT_ACCESS,
              transitionAfter: cdk.Duration.days(1),
            },
          ],
        },
      ],
    });

    // Outputs
    new cdk.CfnOutput(this, 'RenderBucketName', {
      value: this.renderBucket.bucketName,
      description: 'S3 bucket for render jobs',
    });

    new cdk.CfnOutput(this, 'RenderBucketArn', {
      value: this.renderBucket.bucketArn,
      description: 'S3 bucket ARN',
    });
  }
}
