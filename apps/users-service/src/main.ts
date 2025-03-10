import { ConfigService } from '@nestjs/config';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { CommonNestApp } from 'common-nestjs-server';
import { Logger } from 'nestjs-pino';
import { SignUpQueue } from 'rabbitmq-config';

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

    await app.getApp().startAllMicroservices();
    await app.listen('USER_PORT');
}

bootstrap().catch((err) => {
    console.error(err);
    throw err;
});
