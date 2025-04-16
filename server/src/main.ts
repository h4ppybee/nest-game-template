import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PacketLoggingInterceptor } from './common/interceptor/packet.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalInterceptors(new PacketLoggingInterceptor());
  const port = process.env.PORT ?? 3000;
  await app.listen(port);
}
void bootstrap();
