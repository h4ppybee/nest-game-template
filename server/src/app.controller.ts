import { All, Controller } from '@nestjs/common';

@Controller()
export class AppController {
  @All('/')
  getHello() {
    return {
      msg: 'I am Alive',
    };
  }
}
