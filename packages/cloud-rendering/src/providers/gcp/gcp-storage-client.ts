import { Storage, Bucket } from '@google-cloud/storage';
import type { S3CompatibleStorage } from '../../shared/s3-state-manager';

/**
 * Google Cloud Storage client implementing S3CompatibleStorage interface
 */
export class GCPStorageClient implements S3CompatibleStorage {
  private bucket: Bucket;
  private bucketName: string;

  constructor(projectId: string, bucketName: string, keyFilename?: string) {
    this.bucketName = bucketName;

    const storage = new Storage({
      projectId,
      keyFilename,
    });

    this.bucket = storage.bucket(bucketName);
  }

  async upload(key: string, data: Buffer | string): Promise<void> {
    const buffer = typeof data === 'string' ? Buffer.from(data, 'utf-8') : data;
    const file = this.bucket.file(key);

    await file.save(buffer, {
      metadata: {
        contentType: this.getContentType(key),
      },
    });
  }

  async download(key: string): Promise<Buffer> {
    const file = this.bucket.file(key);
    const [buffer] = await file.download();
    return buffer;
  }

  async exists(key: string): Promise<boolean> {
    const file = this.bucket.file(key);
    const [exists] = await file.exists();
    return exists;
  }

  async list(prefix: string): Promise<string[]> {
    const [files] = await this.bucket.getFiles({ prefix });
    return files.map((file) => file.name);
  }

  async delete(key: string): Promise<void> {
    const file = this.bucket.file(key);
    await file.delete();
  }

  async deletePrefix(prefix: string): Promise<void> {
    const keys = await this.list(prefix);

    const batchSize = 100;
    for (let i = 0; i < keys.length; i += batchSize) {
      const batch = keys.slice(i, i + batchSize);
      await Promise.all(batch.map((key) => this.delete(key)));
    }
  }

  getUrl(key: string): string {
    return `gs://${this.bucketName}/${key}`;
  }

  getBucket(): string {
    return this.bucketName;
  }

  private getContentType(key: string): string {
    if (key.endsWith('.json')) return 'application/json';
    if (key.endsWith('.mp4')) return 'video/mp4';
    if (key.endsWith('.mp3')) return 'audio/mpeg';
    if (key.endsWith('.png')) return 'image/png';
    if (key.endsWith('.jpg') || key.endsWith('.jpeg')) return 'image/jpeg';
    return 'application/octet-stream';
  }
}
