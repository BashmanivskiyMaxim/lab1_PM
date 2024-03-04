import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as process from 'process';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  console.log('PORT:', process.env.PORT);
  await app.listen(process.env.PORT, '0.0.0.0');
  //await app.listen(3000);
}
bootstrap();
