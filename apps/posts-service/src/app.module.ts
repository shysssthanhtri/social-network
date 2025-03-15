import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonModule } from 'common-nestjs-server';

import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
    imports: [
        CommonModule,
        TypeOrmModule.forRootAsync({
            useFactory: (configService: ConfigService) => ({
                type: 'postgres',
                url: configService.getOrThrow<string>('POST_DATABASE_URL'),
                entities: [],
                synchronize: true,
                logging: true,
            }),
            inject: [ConfigService],
        }),
        TypeOrmModule.forFeature([]),
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
