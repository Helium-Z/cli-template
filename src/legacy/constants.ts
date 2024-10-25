// @ts-ignore
import packageJson from '../../package.json';

export const IS_WINDOWS = process.platform === 'win32';

export const VERSION = packageJson.version;

export const CLI_COMMAND_NAME = Object.keys(packageJson.bin || {})[0];
