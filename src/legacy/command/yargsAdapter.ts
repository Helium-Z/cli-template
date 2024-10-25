import { camelCase } from 'lodash';
import type { Arguments, Argv, CommandModule, Options } from 'yargs';
import { CommandRunner } from './commandRunner';
import type { Command } from './types';

export const GLOBAL_GROUP = 'Global';
export const STANDARD_GROUP = 'Options';

export class YargsAdapter implements CommandModule {
  command: string;

  describe?: string;

  aliases?: string;

  constructor(private commanderCommand: Command) {
    this.command = commanderCommand.usage;
    this.describe = commanderCommand.description;
    this.aliases = commanderCommand.alias;
  }

  builder(yargs: Argv) {
    const options = optionsToBuilder(this.commanderCommand);
    yargs.option(options);
    this.commanderCommand.arguments?.forEach((arg) => {
      yargs.positional(arg.name, { description: arg.description });
    });
    this.commanderCommand.examples?.forEach((example) => {
      yargs.example(example.cmd, example.description);
    });
    return yargs;
  }

  handler(argv: Arguments) {
    const enteredArgs = getArgsFromCommandName(this.commanderCommand.usage);
    const argsValues = enteredArgs.map((a) => argv[a]) as any[];

    // get flag syntax such as "--all [version]"
    const flags = Object.keys(argv).reduce((acc, current) => {
      if (current === '_' || current === '$0' || current === '--') return acc;
      acc[current] = typeof argv[current] === 'string' && !argv[current] ? true : argv[current];
      return acc;
    }, {});

    const commandRunner = new CommandRunner(this.commanderCommand, argsValues, flags);
    return commandRunner.runCommand();
  }
}

function optionsToBuilder(command: Command): { [key: string]: Options } {
  const option = command.options.reduce((acc, [alias, opt, desc]) => {
    const optName = opt.split(' ')[0];
    acc[optName] = {
      alias,
      describe: desc,
      group: STANDARD_GROUP,
      requiresArg: opt.includes('<'),
      type: opt.includes(' ') ? 'string' : 'boolean',
    } as Options;
    return acc;
  }, {});

  return {
    ...option,
    log: {
      describe: 'print log/debug messages to the screen',
      group: GLOBAL_GROUP,
    },
  };
}

function getArgsFromCommandName(usage: string) {
  const commandSplit = usage.split(/\s+/g);
  // remove the first element, it's the command-name
  commandSplit.shift();

  return commandSplit.map((existArg) => {
    const trimmed = existArg.trim();
    if (
      (!trimmed.startsWith('<') && !trimmed.startsWith('[')) ||
      (!trimmed.endsWith('>') && !trimmed.endsWith(']'))
    ) {
      throw new Error(`expect arg "${trimmed}" of "${usage}" to be wrapped with "[]" or "<>"`);
    }
    // remove the opening and closing brackets
    const withoutBrackets = trimmed.slice(1, -1);
    return camelCase(withoutBrackets);
  });
}
