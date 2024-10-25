export class CLIError extends Error {
  constructor(msg = '') {
    super(msg);
    this.name = this.constructor.name;
  }

  report(): string {
    return this.message;
  }
}
