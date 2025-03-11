import { ConfigService } from '@nestjs/config';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { CommonNestApp } from 'common-nestjs-server';
import { Logger } from 'nestjs-pino';
import { TransactionInterceptor } from 'nestjs-postgresql';
import { SignUpQueue } from 'rabbitmq-config';
import { DataSource } from 'typeorm';

import { AppModule } from './app.module';

async function bootstrap() {
    const app = await CommonNestApp.bootstrap(AppModule);

    const configService = app.getApp().get(ConfigService);

    const server = app.getApp().connectMicroservice<MicroserviceOptions>({
        transport: Transport.RMQ,
        options: {
            urls: [configService.getOrThrow<string>('RABBITMQ_URL')], // RabbitMQ server URL
            queue: SignUpQueue.queue, // Queue name to listen to
        },
    });
    const logger = app.getApp().get(Logger);
    server.status.subscribe((status) => {
        logger.log(`RabbitMQ status: ${status}`);
    });

    const dataSource = app.getApp().get(DataSource);
    app.getApp().useGlobalInterceptors(new TransactionInterceptor(dataSource));

    await app.getApp().startAllMicroservices();
    await app.listen('USER_PORT');
}

bootstrap().catch((err) => {
    console.error(err);
    throw err;
});
