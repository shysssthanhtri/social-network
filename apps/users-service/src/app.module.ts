import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import {
    ApolloFederationDriver,
    ApolloFederationDriverConfig,
} from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonModule } from 'common-nestjs-server';

import { UserEntity } from '@/domain/entities/user.entity';
import { UserRepo } from '@/domain/repo/user.repo';
import { AddUserUseCase } from '@/domain/use-cases/add-user/add-user.use-case';
import { GetUserByIdUseCase } from '@/domain/use-cases/get-user-by-id/get-user-by-id.use-case';
import { UserRepoImpl } from '@/frameworks/repo/user.repo.impl';
import { UsersListener } from '@/gateways/users.listener';
import { UsersResolver } from '@/gateways/users.resolver';

import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
    imports: [
        CommonModule,
        GraphQLModule.forRoot<ApolloFederationDriverConfig>({
            driver: ApolloFederationDriver,
            autoSchemaFile: {
                federation: 2,
            },
            playground: false,
            plugins: [ApolloServerPluginLandingPageLocalDefault()],
        }),
        TypeOrmModule.forRootAsync({
            useFactory: (configService: ConfigService) => ({
                type: 'postgres',
                url: configService.getOrThrow<string>('USER_DATABASE_URL'),
                entities: [UserEntity],
                synchronize: true,
                logging: true,
            }),
            inject: [ConfigService],
        }),
        TypeOrmModule.forFeature([UserEntity]),
    ],
    controllers: [AppController, UsersListener],
    providers: [
        AppService,

        //  RESOLVERS
        UsersResolver,

        //  USE CASES
        AddUserUseCase,
        GetUserByIdUseCase,

        //  REPO
        { provide: UserRepo, useClass: UserRepoImpl },
    ],
})
export class AppModule {}
