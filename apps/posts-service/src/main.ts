import { CommonNestApp } from 'common-nestjs-server';

import { AppModule } from './app.module';

async function bootstrap() {
    const app = await CommonNestApp.bootstrap(AppModule);

    await app.listen('POSTS_PORT');
}

bootstrap().catch((err) => {
    console.error(err);
    throw err;
});
