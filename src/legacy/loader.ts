import ora, { Ora } from 'ora';

export class Loader {
  private spinner: Ora | null;

  private createNewSpinner(): Ora {
    return ora({
      discardStdin: false,
      hideCursor: false,
      stream: process.stdout,
      text: '',
    });
  }

  get isLoading() {
    return this.spinner?.isSpinning;
  }

  on() {
    if (!this.spinner) {
      this.spinner = this.createNewSpinner();
    }
  }

  off() {
    this.stop();
    this.spinner = null;
  }

  setText(text: string) {
    if (this.spinner) this.spinner.text = text;
  }

  start(text?: string) {
    this.spinner?.start(text);
  }

  stop() {
    if (this.spinner?.isSpinning) {
      this.spinner.stop();
    }
  }

  stopAndPersist() {
    if (this.spinner?.isSpinning) {
      this.spinner?.stopAndPersist();
    }
  }

  succeed(text?: string) {
    this.spinner?.succeed(text);
  }

  fail(text?: string) {
    this.spinner?.fail(text);
  }

  warn(text?: string) {
    this.spinner?.warn(text);
  }

  info(text?: string) {
    this.spinner?.info(text);
  }
}

export const loader = new Loader();
