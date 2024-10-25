export function rightPad(str: string, length: number, fillWith = ' ') {
  return `${str}${fillWith.repeat(length)}`.slice(0, length);
}
