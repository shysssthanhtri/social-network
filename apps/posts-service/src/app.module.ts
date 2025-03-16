import { Module } from '@nestjs/common';
import { CommonModule } from 'common-nestjs-server';
import { CommonTypeOrmModule } from 'nestjs-postgresql';

import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
    imports: [
        CommonModule,
        CommonTypeOrmModule.forRootAsync({
            entities: [],
            urlKey: 'POST_DATABASE_URL',
        }),
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
