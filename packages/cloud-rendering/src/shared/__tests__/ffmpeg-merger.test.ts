import { mergeChunks } from '../ffmpeg-merger';

// Mock child_process.spawn
jest.mock('child_process', () => {
  const EventEmitter = require('events');

  return {
    spawn: jest.fn(() => {
      const process = new EventEmitter();
      process.stdout = new EventEmitter();
      process.stderr = new EventEmitter();

      // Simulate successful exit by default
      setTimeout(() => {
        process.emit('close', 0);
      }, 0);

      return process;
    }),
  };
});

// Mock fs
jest.mock('fs', () => ({
  writeFileSync: jest.fn(),
  unlinkSync: jest.fn(),
}));

describe('FFmpeg Merger', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('mergeChunks', () => {
    it('should throw when no chunks provided', async () => {
      await expect(
        mergeChunks({ chunkPaths: [], outputPath: '/output.mp4' })
      ).rejects.toThrow('No chunks to merge');
    });

    it('should write concat list file', async () => {
      const { writeFileSync } = require('fs');

      await mergeChunks({
        chunkPaths: ['/tmp/chunk-0.mp4', '/tmp/chunk-1.mp4'],
        outputPath: '/output.mp4',
      });

      expect(writeFileSync).toHaveBeenCalledWith(
        expect.stringContaining('concat-'),
        expect.stringContaining("file '/tmp/chunk-0.mp4'"),
        'utf-8'
      );
    });

    it('should clean up concat list after merge', async () => {
      const { unlinkSync } = require('fs');

      await mergeChunks({
        chunkPaths: ['/tmp/chunk-0.mp4'],
        outputPath: '/output.mp4',
      });

      expect(unlinkSync).toHaveBeenCalled();
    });

    it('should call ffmpeg with correct arguments', async () => {
      const { spawn } = require('child_process');

      await mergeChunks({
        chunkPaths: ['/tmp/chunk-0.mp4'],
        outputPath: '/output.mp4',
      });

      expect(spawn).toHaveBeenCalledWith(
        'ffmpeg',
        expect.arrayContaining([
          '-y',
          '-f', 'concat',
          '-safe', '0',
          '-c', 'copy',
          '/output.mp4',
        ]),
        expect.any(Object)
      );
    });

    it('should use custom ffmpeg path', async () => {
      const { spawn } = require('child_process');

      await mergeChunks({
        chunkPaths: ['/tmp/chunk-0.mp4'],
        outputPath: '/output.mp4',
        ffmpegPath: '/custom/ffmpeg',
      });

      expect(spawn).toHaveBeenCalledWith(
        '/custom/ffmpeg',
        expect.any(Array),
        expect.any(Object)
      );
    });

    it('should handle ffmpeg failure', async () => {
      const { spawn } = require('child_process');
      const EventEmitter = require('events');

      spawn.mockImplementationOnce(() => {
        const process = new EventEmitter();
        process.stdout = new EventEmitter();
        process.stderr = new EventEmitter();

        setTimeout(() => {
          process.stderr.emit('data', Buffer.from('encoding error'));
          process.emit('close', 1);
        }, 0);

        return process;
      });

      await expect(
        mergeChunks({
          chunkPaths: ['/tmp/chunk-0.mp4'],
          outputPath: '/output.mp4',
        })
      ).rejects.toThrow('FFmpeg exited with code 1');
    });
  });
});
