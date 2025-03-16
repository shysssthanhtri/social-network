import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        LoggerModule.forRoot({
            pinoHttp: {
                level: process.env.NODE_ENV !== 'production' ? 'debug' : 'info',
                transport: {
                    targets: [
                        {
                            level: 'debug',
                            target: 'pino-pretty',
                        },
                    ],
                },
            },
        }),
    ],
    controllers: [],
    providers: [],
})
export class CommonModule {}
