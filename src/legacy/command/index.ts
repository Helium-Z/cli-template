import { CommandGroup } from './types';

export * from './types';
export * from './yargsAdapter';

export const COMMAND_GROUP_DESC: Record<CommandGroup, string> = {
  general: 'General commands',
  ungroupd: 'Ungrouped',
};
