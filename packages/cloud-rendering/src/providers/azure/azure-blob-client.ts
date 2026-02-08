import { BlobServiceClient, ContainerClient } from '@azure/storage-blob';
import type { S3CompatibleStorage } from '../../shared/s3-state-manager';

/**
 * Azure Blob Storage client implementing S3CompatibleStorage interface
 */
export class AzureBlobClient implements S3CompatibleStorage {
  private containerClient: ContainerClient;
  private storageAccount: string;
  private containerName: string;

  constructor(connectionString: string, containerName: string, storageAccount: string) {
    this.storageAccount = storageAccount;
    this.containerName = containerName;

    const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
    this.containerClient = blobServiceClient.getContainerClient(containerName);

    // Ensure container exists
    this.ensureContainer();
  }

  private async ensureContainer(): Promise<void> {
    try {
      await this.containerClient.createIfNotExists();
    } catch {
      // Container might already exist
    }
  }

  /**
   * Upload blob to Azure Storage
   */
  async upload(key: string, data: Buffer | string): Promise<void> {
    const buffer = typeof data === 'string' ? Buffer.from(data, 'utf-8') : data;
    const blockBlobClient = this.containerClient.getBlockBlobClient(key);

    await blockBlobClient.upload(buffer, buffer.length, {
      blobHTTPHeaders: {
        blobContentType: this.getContentType(key),
      },
    });
  }

  /**
   * Download blob from Azure Storage
   */
  async download(key: string): Promise<Buffer> {
    const blockBlobClient = this.containerClient.getBlockBlobClient(key);
    const downloadResponse = await blockBlobClient.download();

    if (!downloadResponse.readableStreamBody) {
      throw new Error(`Blob not found: ${key}`);
    }

    return this.streamToBuffer(downloadResponse.readableStreamBody);
  }

  /**
   * Check if blob exists
   */
  async exists(key: string): Promise<boolean> {
    const blockBlobClient = this.containerClient.getBlockBlobClient(key);
    return blockBlobClient.exists();
  }

  /**
   * List blobs with prefix
   */
  async list(prefix: string): Promise<string[]> {
    const keys: string[] = [];

    for await (const blob of this.containerClient.listBlobsFlat({ prefix })) {
      keys.push(blob.name);
    }

    return keys;
  }

  /**
   * Delete blob
   */
  async delete(key: string): Promise<void> {
    const blockBlobClient = this.containerClient.getBlockBlobClient(key);
    await blockBlobClient.delete();
  }

  /**
   * Delete all blobs with prefix
   */
  async deletePrefix(prefix: string): Promise<void> {
    const keys = await this.list(prefix);

    // Azure Blob Storage doesn't have batch delete like S3
    // Delete in parallel with limit
    const batchSize = 100;
    for (let i = 0; i < keys.length; i += batchSize) {
      const batch = keys.slice(i, i + batchSize);
      await Promise.all(batch.map((key) => this.delete(key)));
    }
  }

  /**
   * Get blob URL
   */
  getUrl(key: string): string {
    return `https://${this.storageAccount}.blob.core.windows.net/${this.containerName}/${key}`;
  }

  /**
   * Get container name
   */
  getContainer(): string {
    return this.containerName;
  }

  /**
   * Convert stream to buffer
   */
  private async streamToBuffer(stream: NodeJS.ReadableStream): Promise<Buffer> {
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
