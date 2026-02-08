import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';

export interface FunctionsStackProps extends cdk.StackProps {
  /**
   * S3 bucket for render jobs
   */
  renderBucket: s3.IBucket;

  /**
   * Chromium Lambda layer ARN
   */
  chromiumLayerArn: string;
}

/**
 * CDK Stack for Rendervid Lambda Functions
 *
 * Creates:
 * - Main coordinator Lambda
 * - Worker rendering Lambda
 * - Merger concatenation Lambda
 */
export class FunctionsStack extends cdk.Stack {
  public readonly mainFunction: lambda.Function;
  public readonly workerFunction: lambda.Function;
  public readonly mergerFunction: lambda.Function;

  constructor(scope: Construct, id: string, props: FunctionsStackProps) {
    super(scope, id, props);

    const { renderBucket, chromiumLayerArn } = props;

    // Import Chromium layer
    const chromiumLayer = lambda.LayerVersion.fromLayerVersionArn(
      this,
      'ChromiumLayer',
      chromiumLayerArn
    );

    // Shared environment variables
    const environment = {
      AWS_S3_BUCKET: renderBucket.bucketName,
      AWS_S3_PREFIX: 'rendervid',
      NODE_ENV: 'production',
    };

    // Main Coordinator Lambda
    this.mainFunction = new lambda.Function(this, 'MainFunction', {
      functionName: 'rendervid-main',
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: 'aws-main-function.handler',
      code: lambda.Code.fromAsset('../../dist'), // Built package
      timeout: cdk.Duration.seconds(300), // 5 minutes
      memorySize: 3008,
      environment: {
        ...environment,
        WORKER_FUNCTION_NAME: 'rendervid-worker',
      },
      layers: [chromiumLayer],
    });

    // Worker Rendering Lambda
    this.workerFunction = new lambda.Function(this, 'WorkerFunction', {
      functionName: 'rendervid-worker',
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: 'aws-worker-function.handler',
      code: lambda.Code.fromAsset('../../dist'),
      timeout: cdk.Duration.seconds(900), // 15 minutes
      memorySize: 5120, // Increased for Chromium
      ephemeralStorageSize: cdk.Size.mebibytes(10240), // 10 GB for frames
      environment,
      layers: [chromiumLayer],
      reservedConcurrentExecutions: 50, // Limit concurrent workers
    });

    // Merger Concatenation Lambda
    this.mergerFunction = new lambda.Function(this, 'MergerFunction', {
      functionName: 'rendervid-merger',
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: 'aws-merger-function.handler',
      code: lambda.Code.fromAsset('../../dist'),
      timeout: cdk.Duration.seconds(900), // 15 minutes
      memorySize: 3008,
      ephemeralStorageSize: cdk.Size.mebibytes(10240), // 10 GB for chunks
      environment,
      layers: [chromiumLayer],
    });

    // Grant S3 permissions
    renderBucket.grantReadWrite(this.mainFunction);
    renderBucket.grantReadWrite(this.workerFunction);
    renderBucket.grantReadWrite(this.mergerFunction);

    // Grant Lambda invoke permissions
    this.mainFunction.grantInvoke(
      new iam.ServicePrincipal('lambda.amazonaws.com')
    );

    this.workerFunction.grantInvoke(this.mainFunction);
    this.mergerFunction.grantInvoke(this.mainFunction);

    // Outputs
    new cdk.CfnOutput(this, 'MainFunctionArn', {
      value: this.mainFunction.functionArn,
      description: 'Main coordinator function ARN',
    });

    new cdk.CfnOutput(this, 'WorkerFunctionArn', {
      value: this.workerFunction.functionArn,
      description: 'Worker rendering function ARN',
    });

    new cdk.CfnOutput(this, 'MergerFunctionArn', {
      value: this.mergerFunction.functionArn,
      description: 'Merger concatenation function ARN',
    });
  }
}
