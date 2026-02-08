import { retryWithBackoff, isRetryableError } from '../retry-handler';

describe('Retry Handler', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  describe('retryWithBackoff', () => {
    it('should return result on first successful call', async () => {
      const fn = jest.fn().mockResolvedValue('success');

      const result = await retryWithBackoff(fn);

      expect(result).toBe('success');
      expect(fn).toHaveBeenCalledTimes(1);
    });

    it('should retry on failure and succeed', async () => {
      const fn = jest
        .fn()
        .mockRejectedValueOnce(new Error('fail'))
        .mockResolvedValueOnce('success');

      const promise = retryWithBackoff(fn, {
        maxRetries: 3,
        initialDelayMs: 100,
      });

      // Advance past the delay
      await jest.advanceTimersByTimeAsync(100);

      const result = await promise;
      expect(result).toBe('success');
      expect(fn).toHaveBeenCalledTimes(2);
    });

    it('should throw after exceeding max retries', async () => {
      jest.useRealTimers();

      const fn = jest.fn().mockRejectedValue(new Error('persistent failure'));

      await expect(
        retryWithBackoff(fn, {
          maxRetries: 2,
          initialDelayMs: 10,
          maxDelayMs: 20,
        })
      ).rejects.toThrow('Failed after 2 retries: persistent failure');
      expect(fn).toHaveBeenCalledTimes(3); // initial + 2 retries
    });

    it('should apply exponential backoff', async () => {
      const fn = jest
        .fn()
        .mockRejectedValueOnce(new Error('fail'))
        .mockRejectedValueOnce(new Error('fail'))
        .mockResolvedValueOnce('success');

      const promise = retryWithBackoff(fn, {
        maxRetries: 3,
        initialDelayMs: 1000,
        backoffMultiplier: 2,
      });

      // First retry: 1000ms delay
      await jest.advanceTimersByTimeAsync(1000);
      // Second retry: 2000ms delay (1000 * 2)
      await jest.advanceTimersByTimeAsync(2000);

      const result = await promise;
      expect(result).toBe('success');
      expect(fn).toHaveBeenCalledTimes(3);
    });

    it('should respect max delay', async () => {
      const fn = jest
        .fn()
        .mockRejectedValueOnce(new Error('fail'))
        .mockRejectedValueOnce(new Error('fail'))
        .mockResolvedValueOnce('success');

      const promise = retryWithBackoff(fn, {
        maxRetries: 3,
        initialDelayMs: 1000,
        backoffMultiplier: 100,
        maxDelayMs: 5000,
      });

      // First retry: 1000ms
      await jest.advanceTimersByTimeAsync(1000);
      // Second retry: capped at 5000ms (1000 * 100 would be 100000)
      await jest.advanceTimersByTimeAsync(5000);

      const result = await promise;
      expect(result).toBe('success');
    });

    it('should handle non-Error thrown values', async () => {
      const fn = jest
        .fn()
        .mockRejectedValueOnce('string error')
        .mockResolvedValueOnce('success');

      const promise = retryWithBackoff(fn, {
        maxRetries: 2,
        initialDelayMs: 100,
      });

      await jest.advanceTimersByTimeAsync(100);

      const result = await promise;
      expect(result).toBe('success');
    });

    it('should use default options when none provided', async () => {
      const fn = jest.fn().mockResolvedValue('result');

      const result = await retryWithBackoff(fn);

      expect(result).toBe('result');
    });
  });

  describe('isRetryableError', () => {
    it('should return false for non-Error values', () => {
      expect(isRetryableError('string')).toBe(false);
      expect(isRetryableError(42)).toBe(false);
      expect(isRetryableError(null)).toBe(false);
      expect(isRetryableError(undefined)).toBe(false);
    });

    it('should return true for timeout errors', () => {
      expect(isRetryableError(new Error('Connection timeout'))).toBe(true);
      expect(isRetryableError(new Error('Request TIMEOUT exceeded'))).toBe(true);
    });

    it('should return true for connection reset errors', () => {
      expect(isRetryableError(new Error('ECONNRESET'))).toBe(true);
    });

    it('should return true for connection refused errors', () => {
      expect(isRetryableError(new Error('ECONNREFUSED'))).toBe(true);
    });

    it('should return true for throttling errors', () => {
      expect(isRetryableError(new Error('Request throttled'))).toBe(true);
      expect(isRetryableError(new Error('Throttling exception'))).toBe(true);
    });

    it('should return true for rate limit errors', () => {
      expect(isRetryableError(new Error('Rate limit exceeded'))).toBe(true);
    });

    it('should return true for 429 errors', () => {
      expect(isRetryableError(new Error('HTTP 429 Too Many Requests'))).toBe(true);
    });

    it('should return true for 503 errors', () => {
      expect(isRetryableError(new Error('HTTP 503 Service Unavailable'))).toBe(true);
    });

    it('should return true for temporarily unavailable errors', () => {
      expect(isRetryableError(new Error('Service temporarily unavailable'))).toBe(true);
    });

    it('should return false for non-retryable errors', () => {
      expect(isRetryableError(new Error('Not found'))).toBe(false);
      expect(isRetryableError(new Error('Permission denied'))).toBe(false);
      expect(isRetryableError(new Error('Invalid input'))).toBe(false);
    });
  });
});
