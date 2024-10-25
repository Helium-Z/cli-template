import { ConsolaInstance, createConsola } from 'consola';
import { IS_WINDOWS } from './constants';
import { loader } from './loader';

/**
 * Consola only shows logs with configured log level or below
 * 0: Fatal and Error
 * 1: Warnings
 * 2: Normal logs
 * 3: Informational logs, success, fail, ready, start, ...
 * 4: Debug logs
 * 5: Trace logs
 * -999: Silent
 * +999: Verbose logs
 */
const enum ConsolaLogLevel {
  LOG_CONSOLE = 999,
  NOT_LOG_CONSOLE = 3,
}

export class Logger {
  private readonly consola: ConsolaInstance;

  shouldWriteToConsole(value: boolean) {
    if (this.consola) {
      this.consola.level = value ? ConsolaLogLevel.LOG_CONSOLE : ConsolaLogLevel.NOT_LOG_CONSOLE;
    }
  }

  constructor() {
    this.consola = createConsola();
    this.shouldWriteToConsole(!process.argv.includes('--json') && process.argv.includes('--log'));
  }

  info(message: string, ...meta: any[]) {
    loader.stopAndPersist();
    this.consola.info(message, ...meta);
  }

  success(message: string, ...meta: any[]) {
    loader.stopAndPersist();
    this.consola.success(message, ...meta);
  }

  warn(message: string, ...meta: any[]) {
    loader.stopAndPersist();
    this.consola.warn(message, ...meta);
  }

  error(message: string, ...meta: any[]) {
    loader.stopAndPersist();
    this.consola.error(message, ...meta);
  }

  debug(message?: string | Error, ...meta: any[]) {
    loader.stopAndPersist();
    this.consola.debug(message, ...meta);
  }

  trace(message?: string, ...meta: any[]) {
    this.consola.trace(message, ...meta);
  }

  clearConsole() {
    process.stdout.write(IS_WINDOWS ? '\x1B[2J\x1B[0f' : '\x1B[2J\x1B[3J\x1B[H');
  }
}

export const logger = new Logger();
