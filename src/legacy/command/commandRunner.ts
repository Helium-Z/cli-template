import { handleErrorAndExit } from '../exception';
import { loader } from '../loader';
import { logger } from '../logger';
import { CLIArgs, Command, Flags } from './types';

export class CommandRunner {
  constructor(
    private command: Command,
    private args: CLIArgs,
    private flags: Flags
  ) {
    this.commandName = this.command.name;
  }

  private readonly commandName: string;

  private bootstrapCommand() {
    logger.debug(`[*] started a new command: "${this.commandName}" with the following data:`, {
      args: this.args,
      flags: this.flags,
    });
  }

  private writeAndExit(message: string, code: number) {
    process.stdout.write(`${message}\n`, () => process.exit(code));
  }

  private async runJsonHandler() {
    if (!this.flags.json) return null;
    if (!this.command.json)
      throw new Error(`command "${this.commandName}" doesn't implement "json" method`);
    const result = await this.command.json(this.args, this.flags);
    const data = result.data || result;
    this.writeAndExit(JSON.stringify(data, null, 2), 0);
  }

  private async runReportHandler() {
    if (!this.command.report)
      throw new Error('runReportHandler expects command.report to be implemented');
    const result = await this.command.report(this.args, this.flags);
    const message = typeof result === 'string' ? result : result.message;
    const code = typeof result === 'string' ? 0 : result.code;
    this.writeAndExit(message, code);
  }

  /**
   * the logger write output to the console during the command execution.
   */
  private determineConsoleWritingDuringCommand() {
    const { json, log } = this.flags;
    if (json) {
      loader.off();
      logger.shouldWriteToConsole(false);
    } else {
      loader.on();
      logger.shouldWriteToConsole(!!log);
    }
  }

  /**
   * run command using one of the handler, "json"/"report". once done, exit the process.
   */
  async runCommand(): Promise<void> {
    try {
      this.bootstrapCommand();
      this.determineConsoleWritingDuringCommand();
      if (this.flags.json) {
        return await this.runJsonHandler();
      }
      if (this.command.report) {
        return await this.runReportHandler();
      }
    } catch (err: any) {
      return handleErrorAndExit(err, this.commandName);
    }

    throw new Error(
      `command "${this.commandName}" doesn't implement "render" nor "report" methods`
    );
  }
}
