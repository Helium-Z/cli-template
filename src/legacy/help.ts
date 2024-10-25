import chalk from 'chalk';
import { capitalize } from 'lodash';
import { rightPad } from '../utils';
import { Command, COMMAND_GROUP_DESC } from './command';
import { CLI_COMMAND_NAME } from './constants';

const SPACE = ' ';
const LEFT_SPACE_NUM_TITLE = 2;
const LEFT_SPACE_NUM_COMMAND = 4;
const NAME_WITH_SPACES_LENGTH = 15;

type GroupContent = {
  commands: { [cmdName: string]: string };
  description: string;
};

type HelpProps = {
  [groupName: string]: GroupContent;
};

export function formatHelp(commands: Command[]) {
  const helpProps = commands
    .filter((command) => command.description)
    .reduce((partialHelp, command) => {
      const groupName = command.group;
      partialHelp[groupName] ||= {
        commands: {},
        description: COMMAND_GROUP_DESC[groupName] || capitalize(command.group),
      };
      partialHelp[groupName].commands[command.name] = command.description;
      return partialHelp;
    }, {});
  const commandsStr = formatCommandsHelp(helpProps);

  return `${getHeader()}

${commandsStr}

${getFooter()}`;
}

function formatCommandsHelp(helpProps: HelpProps): string {
  return Object.keys(helpProps)
    .map((groupName) => commandsSectionTemplate(helpProps[groupName]))
    .join('\n\n');
}

function commandsSectionTemplate(section: GroupContent): string {
  const titleSpace = SPACE.repeat(LEFT_SPACE_NUM_TITLE);
  const title = `${titleSpace}${chalk.underline.bold.blue(section.description)}`;
  const commands = Object.keys(section.commands)
    .map((cmdName) => commandTemplate(cmdName, section.commands[cmdName]))
    .join('\n');
  return `${title}\n${commands}`;
}

function commandTemplate(name: string, description: string): string {
  const nameSpace = SPACE.repeat(LEFT_SPACE_NUM_COMMAND);
  const nameWithRightSpace = rightPad(name, NAME_WITH_SPACES_LENGTH);
  return `${nameSpace}${chalk.green(nameWithRightSpace)}${description}`;
}

function getHeader(): string {
  return `${chalk.bold(`usage: ${CLI_COMMAND_NAME} [--version] [--help] <command> [<args>]`)}`;
}

function getFooter(): string {
  return `${chalk.yellow(
    `Please use '${CLI_COMMAND_NAME} <command> --help' for more information and guides on specific commands.`
  )}`;
}
