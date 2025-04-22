// src/common/adapters/socket-io.adapter.ts
import { INestApplication } from '@nestjs/common';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { ServerOptions } from 'socket.io';

export class SocketIoAdapter extends IoAdapter {
  constructor(private app: INestApplication) {
    super(app);
  }

  createIOServer(port: number, options?: ServerOptions) {
    const cors = {
      origin: '*', // 여기에 프론트엔드 주소 작성
      methods: ['GET', 'POST'],
      credentials: true,
    };
    return super.createIOServer(port, { ...options, cors });
  }
}
