import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { CommonModule } from 'common-nestjs-server';

import { UserEntity } from '@/domain/entities/user.entity';
import { UserRepo } from '@/domain/repo/user.repo';
import { AddUserUseCase } from '@/domain/use-cases/add-user.use-case';
import { UserRepoImpl } from '@/frameworks/repo/user.repo.impl';
import { UserSchema } from '@/frameworks/schemas/user.schema';
import { UsersController } from '@/gateways/users.controller';

import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
    imports: [
        CommonModule,
        MongooseModule.forRootAsync({
            useFactory: (configService: ConfigService) => {
                return {
                    uri: configService.getOrThrow('USER_DATABASE_URL'),
                };
            },
            inject: [ConfigService],
        }),
        MongooseModule.forFeature([
            { name: UserEntity.name, schema: UserSchema },
        ]),
    ],
    controllers: [AppController, UsersController],
    providers: [
        AppService,

        //  USE CASES
        AddUserUseCase,

        //  REPO
        { provide: UserRepo, useClass: UserRepoImpl },
    ],
})
export class AppModule {}
