/**
 * Logger utility that writes to stderr only (MCP requirement)
 * NEVER use console.log or write to stdout as it interferes with MCP protocol
 */

export class Logger {
  private context: string;

  constructor(context: string) {
    this.context = context;
  }

  private formatMessage(level: string, message: string, meta?: unknown): string {
    const timestamp = new Date().toISOString();
    const metaStr = meta ? ` ${JSON.stringify(meta)}` : '';
    return `[${timestamp}] [${level}] [${this.context}] ${message}${metaStr}`;
  }

  info(message: string, meta?: unknown): void {
    console.error(this.formatMessage('INFO', message, meta));
  }

  warn(message: string, meta?: unknown): void {
    console.error(this.formatMessage('WARN', message, meta));
  }

  error(message: string, meta?: unknown): void {
    console.error(this.formatMessage('ERROR', message, meta));
  }

  debug(message: string, meta?: unknown): void {
    if (process.env.DEBUG) {
      console.error(this.formatMessage('DEBUG', message, meta));
    }
  }
}

export const createLogger = (context: string): Logger => new Logger(context);
