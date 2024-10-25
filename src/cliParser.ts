import chalk from 'chalk';
import didYouMean from 'didyoumean';
import { compact } from 'lodash';
import yargs from 'yargs';
import { Command, GLOBAL_GROUP, STANDARD_GROUP, YargsAdapter } from './legacy/command';
import { CommandNotFoundError } from './legacy/exception';
import { formatHelp } from './legacy/help';
import { logger } from './legacy/logger';

export class CLIParser {
  constructor(private commands: Command[]) {}

  private configureParser() {
    yargs.parserConfiguration({
      'boolean-negation': false,
      'populate--': true,
      'strip-aliased': true,
    });
  }

  private configureGlobalFlags() {
    yargs.version(false);
    yargs
      .option('help', {
        alias: 'h',
        describe: 'show help',
        group: GLOBAL_GROUP,
      })
      .option('version', {
        alias: 'v',
        describe: 'show version',
        global: false,
        group: GLOBAL_GROUP,
      });
  }

  private setHelpMiddleware() {
    yargs.middleware((argv) => {
      if (argv.help) {
        if (argv._.length === 0) {
          // this is the main help page
          this.printHelp();
        } else {
          // this is a command help page
          yargs.showHelp(this.printCommandHelp.bind(this));
        }
        process.exit(0);
      }
    }, true);
  }

  private findCommandByArgv(): Command | undefined {
    const enteredCommand = process.argv[0];
    if (!enteredCommand) return null;
    return this.commands.find((cmd) => cmd.name === enteredCommand || cmd.alias === enteredCommand);
  }

  private printHelp() {
    const help = formatHelp(this.commands);
    console.log(help);
  }

  private printCommandHelp(help: string) {
    const command = this.findCommandByArgv();

    const replacer = (_, p1, p2) => {
      return `${p1}${chalk.green(p2)}`;
    };
    const lines = help.split('\n');
    const linesWithoutEmpty = compact(lines);
    const cmdLine = linesWithoutEmpty[0];
    const description: string[] = [];
    const options: string[] = [];
    const globalOptions: string[] = [];
    const args: string[] = [];
    const examples: string[] = [];

    let optionsStarted = false;
    let globalStarted = false;
    let positionalsStarted = false;
    let examplesStarted = false;

    for (let i = 1; i < linesWithoutEmpty.length; i++) {
      const currentLine = linesWithoutEmpty[i];
      if (currentLine === STANDARD_GROUP) {
        optionsStarted = true;
      } else if (currentLine === GLOBAL_GROUP) {
        globalStarted = true;
      } else if (currentLine === 'Positionals:') {
        positionalsStarted = true;
      } else if (currentLine === 'Examples:') {
        examplesStarted = true;
      } else if (examplesStarted) {
        examples.push(currentLine);
      } else if (positionalsStarted) {
        args.push(currentLine);
      } else if (globalStarted) {
        globalOptions.push(currentLine);
      } else if (optionsStarted) {
        options.push(currentLine);
      } else {
        description.push(currentLine);
      }
    }

    // show the flags in green
    const optionsColored = options.map((opt) => opt.replace(/(-{1,2})([\w-]+)/g, replacer));
    const argsColored = args.map((arg) =>
      arg.replace(/^ {2}\S+/, (argName) => chalk.green(argName))
    ); // regex: two spaces then the first word until a white space
    const optionsStr = options.length ? `\n${STANDARD_GROUP}\n${optionsColored.join('\n')}\n` : '';
    const argumentsStr = args.length ? `\nArguments:\n${argsColored.join('\n')}\n` : '';
    const examplesStr = examples.length ? `\nExamples:\n${examples.join('\n')}\n` : '';

    // show the description in bold
    const descriptionColored = description.map((desc) => chalk.bold(desc));
    if (command?.extendedDescription) {
      descriptionColored.push(command?.extendedDescription);
    }

    const descriptionStr = descriptionColored.join('\n');
    const globalOptionsStr = globalOptions.join('\n');

    const finalOutput = `${cmdLine}

${descriptionStr}
${argumentsStr}${optionsStr}${examplesStr}
${GLOBAL_GROUP}
${globalOptionsStr}`;

    console.log(finalOutput);
  }

  private getYargsCommand(command: Command): YargsAdapter {
    const yarnCommand = new YargsAdapter(command);
    yarnCommand.builder = yarnCommand.builder.bind(yarnCommand);
    yarnCommand.handler = yarnCommand.handler.bind(yarnCommand);
    return yarnCommand;
  }

  private checkCommandExist(commandName: string) {
    if (!commandName || commandName.startsWith('-')) {
      return;
    }

    const names = this.commands.map(({ name }) => name);
    const aliases = this.commands.map((c) => c.alias).filter((a) => a);
    const existingGlobalFlags = ['-V', '--version'];
    const validCommands = [...names, ...aliases, ...existingGlobalFlags];
    const commandExist = validCommands.includes(commandName);

    if (!commandExist) {
      didYouMean.returnFirstMatch = true;
      const suggestions = didYouMean(
        commandName,
        this.commands.map(({ name }) => name)
      );
      const suggestion = suggestions && Array.isArray(suggestions) ? suggestions[0] : suggestions;

      throw new CommandNotFoundError(commandName, suggestion as string);
    }
  }

  private handleCommandFailure() {
    yargs.fail((msg, err) => {
      if (err) throw err;
      yargs.showHelp(this.printCommandHelp.bind(this));
      const args = process.argv.slice(2);
      const isHelpFlagEntered = args.includes('--help') || args.includes('-h');
      // avoid showing the error message when the user is trying to get the command help
      if (!isHelpFlagEntered) {
        console.log(`\n${chalk.yellow(msg)}`);
      }
      process.exit(isHelpFlagEntered ? 0 : 1);
    });
  }

  async parse(args = process.argv.slice(2)) {
    this.checkCommandExist(args[0]);

    logger.debug(`CLI-INPUT: ${args.join(' ')}`);
    yargs(args);
    yargs.help(false);

    this.configureParser();

    this.commands.forEach((command: Command) => {
      const yargsCommand = this.getYargsCommand(command);
      yargs.command(yargsCommand);
    });

    this.setHelpMiddleware();
    this.configureGlobalFlags();
    this.handleCommandFailure();

    // don't allow non-exist flags and non-exist commands
    yargs.strict();
    yargs.wrap(null);

    await yargs.parse();
  }
}
