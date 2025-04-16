import { All, Controller } from '@nestjs/common';

@Controller()
export class AppController {
  @All('/')
  healthCheck() {
    return {
      msg: 'I am Alive',
    };
  }
}
