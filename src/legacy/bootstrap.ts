import { VERSION } from './constants';

function printVersionIfAsked() {
  if (['-V', '-v', '--version'].includes(process.argv[2])) {
    console.log(`you are using ${VERSION} for now.`);
    process.exit();
  }
}

export async function bootstrap() {
  printVersionIfAsked();
}
