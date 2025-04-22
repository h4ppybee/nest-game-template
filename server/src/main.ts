import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PacketLoggingInterceptor } from './common/interceptors/packet.interceptor';
import { SocketIoAdapter } from './common/socket/multi.socket';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useWebSocketAdapter(new SocketIoAdapter(app));
  app.useGlobalInterceptors(new PacketLoggingInterceptor());
  app.useGlobalPipes(new ValidationPipe());
  const port = process.env.PORT ?? 4000;
  await app.listen(port);
}
void bootstrap();
