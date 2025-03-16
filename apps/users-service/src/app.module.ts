import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import {
    ApolloFederationDriver,
    ApolloFederationDriverConfig,
} from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { CommonModule } from 'common-nestjs-server';
import { CommonTypeOrmModule } from 'nestjs-postgresql';

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
        CommonTypeOrmModule.forRootAsync({
            entities: [UserEntity],
            urlKey: 'USER_DATABASE_URL',
        }),
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
