import type { Command, CommandGroup, CommandOption } from '../legacy/command';
import { loader } from '../legacy/loader';
import { logger } from '../legacy/logger';

export class StartCmd implements Command {
  name = 'start';

  description = 'start a workspace project';

  group = 'general' as CommandGroup;

  get usage() {
    return `${this.name} <project> [component]`;
  }

  arguments = [
    {
      name: 'project',
      description: 'project name',
    },
    {
      name: 'component',
      description: 'component name',
    },
  ];

  options = [
    ['f', 'force', 'force update this component'],
    ['s', 'silent', 'no message output'],
  ] as CommandOption[];

  async report(args, options) {
    const [workspace, component] = args;
    const { force, silent } = options;

    loader.start('Staring...');

    const res: string = await new Promise((resolve) => {
      logger.debug('received args:', { workspace, component, force, silent });
      setTimeout(() => resolve('Final Data'), 200);
    });

    loader.succeed('Succeed...');

    return `Final data is:\n${JSON.stringify(res, null, 2)}`;
  }
}
