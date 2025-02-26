import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { configSwagger } from 'src/config/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  configSwagger(app);

  await app.listen(process.env.PORT ?? 3000, () => {
    console.log('Running');
  });
}

bootstrap().catch((err) => {
  console.error(err);
  throw err;
});
