process.on('uncaughtException', (error) => {
  console.error('uncaughtException', error);
  process.exit(1);
});

import { CLIParser } from './cliParser';
import { StartCmd } from './command';
import { bootstrap } from './legacy/bootstrap';
import { handleErrorAndExit } from './legacy/exception';

async function runCLI() {
  const cliParser = new CLIParser([new StartCmd()]);
  await cliParser.parse();
}

(async function initApp() {
  try {
    await bootstrap();
    await runCLI();
  } catch (err) {
    handleErrorAndExit(err, process.argv[2]);
  }
})();
