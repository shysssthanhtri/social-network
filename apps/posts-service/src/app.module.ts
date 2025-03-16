import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import {
    ApolloFederationDriver,
    ApolloFederationDriverConfig,
} from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { CommonModule } from 'common-nestjs-server';
import { CommonTypeOrmModule } from 'nestjs-postgresql';

import { PostEntity } from '@/domain/entities/post.entity';
import { PostRepo } from '@/domain/repo/post.repo';
import { CreatePostUseCase } from '@/domain/use-cases/create-post/create-post.use-case';
import { PostRepoImpl } from '@/framework/repo/post.repo.impl';
import { PostMutation } from '@/gateway/mutations/post.mutation';

import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
    imports: [
        CommonModule,
        CommonTypeOrmModule.forRootAsync({
            entities: [PostEntity],
            urlKey: 'POST_DATABASE_URL',
        }),
        GraphQLModule.forRoot<ApolloFederationDriverConfig>({
            driver: ApolloFederationDriver,
            autoSchemaFile: {
                federation: 2,
            },
            playground: false,
            plugins: [ApolloServerPluginLandingPageLocalDefault()],
        }),
    ],
    controllers: [AppController],
    providers: [
        AppService,

        //  USE CASES
        CreatePostUseCase,

        //  MUTATIONS
        PostMutation,

        //  REPO
        { provide: PostRepo, useClass: PostRepoImpl },
    ],
})
export class AppModule {}
