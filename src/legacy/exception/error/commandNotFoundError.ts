import chalk from 'chalk';
import { CLIError } from './cliError';

export class CommandNotFoundError extends CLIError {
  constructor(
    private commandName: string,
    private suggestion?: string
  ) {
    super(`command ${commandName} was not found`);
  }

  report() {
    return chalk.yellow(
      [
        `warning: '${chalk.bold(this.commandName)}' is not a valid command.`,
        `use '--help' for additional information.`,
        this.suggestion ? `Did you mean ${chalk.bold(this.suggestion)}?` : '',
      ]
        .filter(Boolean)
        .join('\n')
    );
  }
}
