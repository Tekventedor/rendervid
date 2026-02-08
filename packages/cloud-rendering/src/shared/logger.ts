/**
 * Structured logging for cloud rendering
 */

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface LogContext {
  jobId?: string;
  chunkId?: number;
  provider?: string;
  [key: string]: unknown;
}

class Logger {
  private minLevel: LogLevel = 'info';

  setLevel(level: LogLevel) {
    this.minLevel = level;
  }

  debug(message: string, context?: LogContext) {
    this.log('debug', message, context);
  }

  info(message: string, context?: LogContext) {
    this.log('info', message, context);
  }

  warn(message: string, context?: LogContext) {
    this.log('warn', message, context);
  }

  error(message: string, error?: Error, context?: LogContext) {
    const ctx = { ...context, error: error?.message, stack: error?.stack };
    this.log('error', message, ctx);
  }

  private log(level: LogLevel, message: string, context?: LogContext) {
    const levels: LogLevel[] = ['debug', 'info', 'warn', 'error'];
    if (levels.indexOf(level) < levels.indexOf(this.minLevel)) {
      return;
    }

    const logEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      ...context,
    };

    const output = JSON.stringify(logEntry);

    switch (level) {
      case 'error':
        console.error(output);
        break;
      case 'warn':
        console.warn(output);
        break;
      default:
        console.log(output);
    }
  }
}

export const logger = new Logger();
