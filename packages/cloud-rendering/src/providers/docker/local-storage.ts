import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync, unlinkSync, rmSync } from 'fs';
import { join, dirname } from 'path';
import type { S3CompatibleStorage } from '../../shared/s3-state-manager';

/**
 * Local filesystem storage implementation
 * Compatible with S3CompatibleStorage interface
 */
export class LocalStorage implements S3CompatibleStorage {
  constructor(private basePath: string) {
    // Ensure base directory exists
    if (!existsSync(basePath)) {
      mkdirSync(basePath, { recursive: true });
    }
  }

  async upload(key: string, data: Buffer | string): Promise<void> {
    const fullPath = join(this.basePath, key);
    const dir = dirname(fullPath);

    // Ensure directory exists
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }

    writeFileSync(fullPath, data);
  }

  async download(key: string): Promise<Buffer> {
    const fullPath = join(this.basePath, key);

    if (!existsSync(fullPath)) {
      throw new Error(`File not found: ${key}`);
    }

    return readFileSync(fullPath);
  }

  async list(prefix: string): Promise<string[]> {
    const fullPath = join(this.basePath, prefix);

    if (!existsSync(fullPath)) {
      return [];
    }

    // Recursively list all files
    const files: string[] = [];
    const traverse = (dir: string, basePrefix: string = '') => {
      const items = readdirSync(dir, { withFileTypes: true });

      for (const item of items) {
        const itemPath = join(dir, item.name);
        const relativePath = join(basePrefix, item.name);

        if (item.isDirectory()) {
          traverse(itemPath, relativePath);
        } else {
          files.push(join(prefix, relativePath));
        }
      }
    };

    traverse(fullPath);
    return files;
  }

  async delete(key: string): Promise<void> {
    const fullPath = join(this.basePath, key);

    if (!existsSync(fullPath)) {
      return; // Already deleted
    }

    unlinkSync(fullPath);
  }

  async deletePrefix(prefix: string): Promise<void> {
    const fullPath = join(this.basePath, prefix);

    if (!existsSync(fullPath)) {
      return; // Already deleted
    }

    rmSync(fullPath, { recursive: true, force: true });
  }

  async exists(key: string): Promise<boolean> {
    const fullPath = join(this.basePath, key);
    return existsSync(fullPath);
  }

  /**
   * Get local file path for a storage key
   */
  getLocalPath(key: string): string {
    return join(this.basePath, key);
  }

  /**
   * Get storage URL for a key (file:// URL)
   */
  getStorageUrl(key: string): string {
    return `file://${join(this.basePath, key)}`;
  }
}
