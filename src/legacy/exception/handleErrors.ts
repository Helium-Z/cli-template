import chalk from 'chalk';
import { loader } from '../loader';
import { logger } from '../logger';
import { CLIError } from './error/cliError';

export function handleErrorAndExit(err: Error, commandName: string) {
  try {
    loader.off();
    logger.error(`got an error from command ${commandName}: ${err}`);
    logger.trace(err.stack || '<no error stack was found>');

    const formattedErrMsg = err instanceof CLIError ? err.report?.() : '';
    console.error(
      chalk.red(
        [formattedErrMsg, `use the '--log' flag for the full error.`].filter(Boolean).join('\n\n')
      )
    );
  } catch (e) {
    console.error('failed to log the error properly, failure error', e);
    console.error('failed to log the error properly, original error', err);
    process.exit(1);
  }
}
