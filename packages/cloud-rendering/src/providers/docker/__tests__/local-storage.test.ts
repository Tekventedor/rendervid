import { LocalStorage } from '../local-storage';
import { mkdirSync, rmSync, existsSync } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';

describe('LocalStorage', () => {
  let storage: LocalStorage;
  let basePath: string;

  beforeEach(() => {
    basePath = join(tmpdir(), `rendervid-test-${Date.now()}-${Math.random().toString(36).slice(2)}`);
    storage = new LocalStorage(basePath);
  });

  afterEach(() => {
    if (existsSync(basePath)) {
      rmSync(basePath, { recursive: true, force: true });
    }
  });

  describe('upload / download', () => {
    it('should upload and download a buffer', async () => {
      const data = Buffer.from('hello world');
      await storage.upload('test/file.txt', data);

      const result = await storage.download('test/file.txt');
      expect(result.toString()).toBe('hello world');
    });

    it('should upload and download a string', async () => {
      await storage.upload('test/data.json', '{"key": "value"}');

      const result = await storage.download('test/data.json');
      expect(JSON.parse(result.toString())).toEqual({ key: 'value' });
    });

    it('should create directories automatically', async () => {
      await storage.upload('deep/nested/dir/file.txt', 'data');
      const result = await storage.download('deep/nested/dir/file.txt');
      expect(result.toString()).toBe('data');
    });

    it('should throw when downloading non-existent file', async () => {
      await expect(storage.download('nonexistent.txt')).rejects.toThrow('File not found');
    });
  });

  describe('exists', () => {
    it('should return true for existing file', async () => {
      await storage.upload('exists.txt', 'data');
      const result = await storage.exists('exists.txt');
      expect(result).toBe(true);
    });

    it('should return false for non-existent file', async () => {
      const result = await storage.exists('nonexistent.txt');
      expect(result).toBe(false);
    });
  });

  describe('list', () => {
    it('should list files with prefix', async () => {
      await storage.upload('jobs/job1/file1.txt', 'a');
      await storage.upload('jobs/job1/file2.txt', 'b');
      await storage.upload('jobs/job2/file1.txt', 'c');

      const files = await storage.list('jobs/job1');
      expect(files).toHaveLength(2);
      expect(files).toEqual(
        expect.arrayContaining([
          expect.stringContaining('file1.txt'),
          expect.stringContaining('file2.txt'),
        ])
      );
    });

    it('should return empty array for non-existent prefix', async () => {
      const files = await storage.list('nonexistent/prefix');
      expect(files).toEqual([]);
    });
  });

  describe('delete', () => {
    it('should delete a file', async () => {
      await storage.upload('to-delete.txt', 'data');
      expect(await storage.exists('to-delete.txt')).toBe(true);

      await storage.delete('to-delete.txt');
      expect(await storage.exists('to-delete.txt')).toBe(false);
    });

    it('should not throw when deleting non-existent file', async () => {
      await expect(storage.delete('nonexistent.txt')).resolves.toBeUndefined();
    });
  });

  describe('deletePrefix', () => {
    it('should delete all files with prefix', async () => {
      await storage.upload('jobs/job1/file1.txt', 'a');
      await storage.upload('jobs/job1/file2.txt', 'b');
      await storage.upload('jobs/job2/file1.txt', 'c');

      await storage.deletePrefix('jobs/job1');

      expect(await storage.exists('jobs/job1/file1.txt')).toBe(false);
      expect(await storage.exists('jobs/job1/file2.txt')).toBe(false);
      expect(await storage.exists('jobs/job2/file1.txt')).toBe(true);
    });

    it('should not throw when deleting non-existent prefix', async () => {
      await expect(storage.deletePrefix('nonexistent')).resolves.toBeUndefined();
    });
  });

  describe('getLocalPath', () => {
    it('should return full local path', () => {
      const path = storage.getLocalPath('jobs/job1/output.mp4');
      expect(path).toBe(join(basePath, 'jobs/job1/output.mp4'));
    });
  });

  describe('getStorageUrl', () => {
    it('should return file:// URL', () => {
      const url = storage.getStorageUrl('jobs/job1/output.mp4');
      expect(url).toBe(`file://${join(basePath, 'jobs/job1/output.mp4')}`);
    });
  });
});
