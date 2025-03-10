import { CommonNestApp } from 'common-nestjs-server';

import { configSwagger } from '@/frameworks/config/swagger';

import { AppModule } from './app.module';

async function bootstrap() {
    const app = await CommonNestApp.bootstrap(AppModule);

    configSwagger(app.getApp());

    await app.listen('AUTH_PORT');
}

bootstrap().catch((err) => {
    console.error(err);
    throw err;
});
