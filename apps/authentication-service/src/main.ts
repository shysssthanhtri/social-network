import { NestFactory } from '@nestjs/core';

import { setupPipelines } from '@/frameworks/config/pipelines';
import { configSwagger } from '@/frameworks/config/swagger';

import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    configSwagger(app);
    setupPipelines(app);

    await app.listen(process.env.PORT ?? 3000, () => {
        console.log('Running');
    });
}

bootstrap().catch((err) => {
    console.error(err);
    throw err;
});
