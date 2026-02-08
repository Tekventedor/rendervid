import { logger } from '../logger';

describe('Logger', () => {
  let consoleSpy: {
    log: jest.SpyInstance;
    warn: jest.SpyInstance;
    error: jest.SpyInstance;
  };

  beforeEach(() => {
    consoleSpy = {
      log: jest.spyOn(console, 'log').mockImplementation(() => {}),
      warn: jest.spyOn(console, 'warn').mockImplementation(() => {}),
      error: jest.spyOn(console, 'error').mockImplementation(() => {}),
    };
    // Reset to default level
    logger.setLevel('info');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should log info messages to console.log', () => {
    logger.info('test message');

    expect(consoleSpy.log).toHaveBeenCalledTimes(1);
    const output = JSON.parse(consoleSpy.log.mock.calls[0][0]);
    expect(output.level).toBe('info');
    expect(output.message).toBe('test message');
    expect(output.timestamp).toBeDefined();
  });

  it('should log warn messages to console.warn', () => {
    logger.warn('warning message');

    expect(consoleSpy.warn).toHaveBeenCalledTimes(1);
    const output = JSON.parse(consoleSpy.warn.mock.calls[0][0]);
    expect(output.level).toBe('warn');
    expect(output.message).toBe('warning message');
  });

  it('should log error messages to console.error', () => {
    const err = new Error('test error');
    logger.error('error occurred', err);

    expect(consoleSpy.error).toHaveBeenCalledTimes(1);
    const output = JSON.parse(consoleSpy.error.mock.calls[0][0]);
    expect(output.level).toBe('error');
    expect(output.message).toBe('error occurred');
    expect(output.error).toBe('test error');
    expect(output.stack).toBeDefined();
  });

  it('should include context in log output', () => {
    logger.info('rendering', { jobId: 'job-1', chunkId: 3, provider: 'aws' });

    const output = JSON.parse(consoleSpy.log.mock.calls[0][0]);
    expect(output.jobId).toBe('job-1');
    expect(output.chunkId).toBe(3);
    expect(output.provider).toBe('aws');
  });

  it('should respect minimum log level', () => {
    logger.setLevel('warn');

    logger.debug('debug msg');
    logger.info('info msg');
    logger.warn('warn msg');
    logger.error('error msg');

    expect(consoleSpy.log).not.toHaveBeenCalled();
    expect(consoleSpy.warn).toHaveBeenCalledTimes(1);
    expect(consoleSpy.error).toHaveBeenCalledTimes(1);
  });

  it('should filter debug messages at info level', () => {
    logger.setLevel('info');

    logger.debug('debug msg');

    expect(consoleSpy.log).not.toHaveBeenCalled();
  });

  it('should show debug messages at debug level', () => {
    logger.setLevel('debug');

    logger.debug('debug msg');

    expect(consoleSpy.log).toHaveBeenCalledTimes(1);
    const output = JSON.parse(consoleSpy.log.mock.calls[0][0]);
    expect(output.level).toBe('debug');
  });

  it('should only show error messages at error level', () => {
    logger.setLevel('error');

    logger.debug('debug msg');
    logger.info('info msg');
    logger.warn('warn msg');
    logger.error('error msg');

    expect(consoleSpy.log).not.toHaveBeenCalled();
    expect(consoleSpy.warn).not.toHaveBeenCalled();
    expect(consoleSpy.error).toHaveBeenCalledTimes(1);
  });

  it('should handle error method with context', () => {
    const err = new Error('db error');
    logger.error('query failed', err, { jobId: 'job-1' });

    const output = JSON.parse(consoleSpy.error.mock.calls[0][0]);
    expect(output.message).toBe('query failed');
    expect(output.error).toBe('db error');
    expect(output.jobId).toBe('job-1');
  });

  it('should handle error method without Error object', () => {
    logger.error('something went wrong', undefined, { provider: 'gcp' });

    const output = JSON.parse(consoleSpy.error.mock.calls[0][0]);
    expect(output.message).toBe('something went wrong');
    expect(output.provider).toBe('gcp');
  });
});
