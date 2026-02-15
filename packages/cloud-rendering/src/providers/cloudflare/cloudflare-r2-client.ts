import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  HeadObjectCommand,
  DeleteObjectCommand,
  ListObjectsV2Command,
  DeleteObjectsCommand,
} from '@aws-sdk/client-s3';
import { Readable } from 'stream';
import type { S3CompatibleStorage } from '../../shared/s3-state-manager';

/**
 * Cloudflare R2 client implementing S3CompatibleStorage interface
 *
 * R2 uses the S3-compatible API, so this is similar to AWSS3Client
 * but configured with Cloudflare R2 endpoint.
 */
export class CloudflareR2Client implements S3CompatibleStorage {
  private client: S3Client;
  private bucket: string;

  constructor(
    accountId: string,
    bucket: string,
    credentials?: { accessKeyId: string; secretAccessKey: string },
    endpoint?: string
  ) {
    this.bucket = bucket;
    this.client = new S3Client({
      region: 'auto',
      endpoint: endpoint || `https://${accountId}.r2.cloudflarestorage.com`,
      credentials,
    });
  }

  /**
   * Upload object to R2
   */
  async upload(key: string, data: Buffer | string): Promise<void> {
    const body = typeof data === 'string' ? Buffer.from(data, 'utf-8') : data;

    await this.client.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: body,
        ContentType: this.getContentType(key),
      })
    );
  }

  /**
   * Download object from R2
   */
  async download(key: string): Promise<Buffer> {
    const response = await this.client.send(
      new GetObjectCommand({
        Bucket: this.bucket,
        Key: key,
      })
    );

    if (!response.Body) {
      throw new Error(`Object not found: ${key}`);
    }

    return this.streamToBuffer(response.Body as Readable);
  }

  /**
   * Check if object exists in R2
   */
  async exists(key: string): Promise<boolean> {
    try {
      await this.client.send(
        new HeadObjectCommand({
          Bucket: this.bucket,
          Key: key,
        })
      );
      return true;
    } catch (error: any) {
      if (error.name === 'NotFound' || error.$metadata?.httpStatusCode === 404) {
        return false;
      }
      throw error;
    }
  }

  /**
   * List objects with prefix
   */
  async list(prefix: string): Promise<string[]> {
    const keys: string[] = [];
    let continuationToken: string | undefined;

    do {
      const response = await this.client.send(
        new ListObjectsV2Command({
          Bucket: this.bucket,
          Prefix: prefix,
          ContinuationToken: continuationToken,
        })
      );

      if (response.Contents) {
        for (const object of response.Contents) {
          if (object.Key) {
            keys.push(object.Key);
          }
        }
      }

      continuationToken = response.NextContinuationToken;
    } while (continuationToken);

    return keys;
  }

  /**
   * Delete object from R2
   */
  async delete(key: string): Promise<void> {
    await this.client.send(
      new DeleteObjectCommand({
        Bucket: this.bucket,
        Key: key,
      })
    );
  }

  /**
   * Delete all objects with prefix (recursive delete)
   */
  async deletePrefix(prefix: string): Promise<void> {
    const keys = await this.list(prefix);

    if (keys.length === 0) {
      return;
    }

    // R2 DeleteObjects can handle up to 1000 objects per request
    const batchSize = 1000;
    for (let i = 0; i < keys.length; i += batchSize) {
      const batch = keys.slice(i, i + batchSize);

      await this.client.send(
        new DeleteObjectsCommand({
          Bucket: this.bucket,
          Delete: {
            Objects: batch.map((key) => ({ Key: key })),
            Quiet: true,
          },
        })
      );
    }
  }

  /**
   * Get R2 URL for a key
   */
  getUrl(key: string): string {
    return `r2://${this.bucket}/${key}`;
  }

  /**
   * Get bucket name
   */
  getBucket(): string {
    return this.bucket;
  }

  /**
   * Convert stream to buffer
   */
  private async streamToBuffer(stream: Readable): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const chunks: Buffer[] = [];
      stream.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
      stream.on('error', reject);
      stream.on('end', () => resolve(Buffer.concat(chunks)));
    });
  }

  /**
   * Get content type based on file extension
   */
  private getContentType(key: string): string {
    if (key.endsWith('.json')) return 'application/json';
    if (key.endsWith('.mp4')) return 'video/mp4';
    if (key.endsWith('.mp3')) return 'audio/mpeg';
    if (key.endsWith('.png')) return 'image/png';
    if (key.endsWith('.jpg') || key.endsWith('.jpeg')) return 'image/jpeg';
    return 'application/octet-stream';
  }
}
