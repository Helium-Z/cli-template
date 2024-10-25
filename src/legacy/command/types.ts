export type Flags = { [flagName: string]: string | boolean | undefined };
export type CLIArgs = Array<string[] | string>;
export type Report = { code: number; message: string };
export type Example = { cmd: string; description: string };
export type CommandArg = { name: string; description?: string };
export type CommandOption = [string, string, string];
export type CommandOptions = Array<CommandOption>;

export type CommandGroup = 'general' | 'ungroupd';

export interface Command {
  /**
   * Name of this command. e.g. start/build
   */
  name: string;

  /**
   * Usage of command with arguments:
   * <> for mandatory arguments.
   * [] for optional arguments.
   * e.g. 'add <path>'
   */
  usage?: string;

  /**
   * Command alias (for example: 't' for 'tag')
   */
  alias?: string;

  /**
   * Description of the command, used in the commands summery and the help
   */
  description?: string;

  /**
   * Extended description of the command. Will be seen in only in the command help, just after the description.
   */
  extendedDescription?: string;

  /**
   * Allow grouping of commands to hint summery renderer in default automatic help
   */
  group?: CommandGroup;

  /**
   * Array of command options where each element is a tuple.
   * ['flag alias', 'flag name', 'flag description']
   * for example:
   * ['j', 'json', 'output json format']
   */
  options: CommandOptions;

  /**
   * Arguments are defined in the "name" property, and that's where the source of truth is.
   * This prop is optional and provides a way to describe the args.
   * If this is set, it'll be shown in the command help under "Arguments" section.
   */
  arguments?: CommandArg[];

  /**
   * Optionally, give some examples how to use the command.
   */
  examples?: Example[];

  /**
   * Command handler which is called for commands or when process.isTTY is false
   * @param args  - arguments object as defined in name.
   * @param flags - command flags as described in options.
   * @return - Report object. The Report data is printed to the stdout as is.
   */
  report?(args: CLIArgs, flags: Flags): Promise<string | Report>;

  /**
   * Optional handler to provide a raw result of the command.
   * Will be go called if '-j'/'--json' option is provided by user.
   * @param args  - arguments object as defined in name.
   * @param flags - command flags as described in options.
   * @return a GenericObject to be rendered to string (by json.stringify) in the console.
   */
  json?(args: CLIArgs, flags: Flags): Promise<Record<string, any>>;
}
