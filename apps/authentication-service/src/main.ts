import { CommonNestApp } from 'common-nestjs-server';
import { TransactionInterceptor } from 'nestjs-postgresql';
import { DataSource } from 'typeorm';

import { configSwagger } from '@/frameworks/config/swagger';

import { AppModule } from './app.module';

async function bootstrap() {
    const app = await CommonNestApp.bootstrap(AppModule);

    configSwagger(app.getApp());

    const dataSource = app.getApp().get(DataSource);
    app.getApp().useGlobalInterceptors(new TransactionInterceptor(dataSource));

    app.getApp().setGlobalPrefix('/api');
    console.log('Hello world 5');
    await app.listen('AUTH_PORT');
}

bootstrap().catch((err) => {
    console.error(err);
    throw err;
});
