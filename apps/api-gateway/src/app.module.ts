import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';

import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        LoggerModule.forRoot({
            pinoHttp: {
                name: 'add some name to every JSON line',
                level: process.env.NODE_ENV !== 'production' ? 'debug' : 'info',
                transport:
                    process.env.NODE_ENV !== 'production'
                        ? { target: 'pino-pretty' }
                        : undefined,
            },
        }),
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
