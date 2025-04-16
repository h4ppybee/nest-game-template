import { v4 } from 'uuid';

export class CommonUtil {
  static uuid() {
    const tokens = v4().split('-');
    return tokens[2] + tokens[1] + tokens[0] + tokens[3] + tokens[4];
  }

  static setConsoleColor(msg: string, color: number) {
    return '\u001b[' + color + 'm' + msg + '\u001b[0m';
  }
}
