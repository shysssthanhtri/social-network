import { INestApplication, Options, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { Logger, LoggerErrorInterceptor } from 'nestjs-pino';

type Module = Parameters<typeof NestFactory.create>[0];
type Options = Parameters<typeof NestFactory.create>[1];

export class CommonNestApp {
    private readonly app: INestApplication;

    constructor(app: INestApplication) {
        this.app = app;
    }

    static async bootstrap(module: Module, options?: Options) {
        const app = await NestFactory.create(module, {
            bufferLogs: true,
            ...options,
        });

        const logger = app.get(Logger);
        app.useLogger(logger);
        app.useGlobalInterceptors(new LoggerErrorInterceptor());

        app.useGlobalPipes(new ValidationPipe());

        return new CommonNestApp(app);
    }

    async listen(portKey: string) {
        const configService = this.app.get(ConfigService);
        const port = configService.getOrThrow<string>(portKey);
        const logger = this.app.get(Logger);

        await this.app.listen(port, () => {
            logger.log(`Running on port ${port}...`);
        });
    }

    getApp() {
        return this.app;
    }
}
