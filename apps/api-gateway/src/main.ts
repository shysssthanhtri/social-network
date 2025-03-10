import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { Logger, LoggerErrorInterceptor } from 'nestjs-pino';

import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule, { bufferLogs: true });

    const logger = app.get(Logger);
    app.useLogger(logger);
    app.useGlobalInterceptors(new LoggerErrorInterceptor());

    const configService = app.get(ConfigService);
    const port = configService.getOrThrow<string>('API_GATEWAY_PORT');
    await app.listen(port, () => {
        logger.log(`Running on port ${port}...`);
    });
}
bootstrap().catch((err) => {
    console.error(err);
    throw err;
});
