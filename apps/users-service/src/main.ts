import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { Logger, LoggerErrorInterceptor } from 'nestjs-pino';
import { SignUpQueue } from 'rabbitmq-config';

import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule, { bufferLogs: true });

    const logger = app.get(Logger);
    app.useLogger(logger);
    app.useGlobalInterceptors(new LoggerErrorInterceptor());

    const configService = app.get(ConfigService);

    const server = app.connectMicroservice<MicroserviceOptions>({
        transport: Transport.RMQ,
        options: {
            urls: [configService.getOrThrow<string>('RABBITMQ_URL')], // RabbitMQ server URL
            queue: SignUpQueue.queue, // Queue name to listen to
        },
    });
    server.status.subscribe((status) => {
        logger.log(`RabbitMQ status: ${status}`);
    });

    const port = configService.getOrThrow<string>('USER_PORT');
    await app.startAllMicroservices();
    await app.listen(port, () => {
        logger.log(`Running on port ${port}...`);
    });
}

bootstrap().catch((err) => {
    console.error(err);
    throw err;
});
