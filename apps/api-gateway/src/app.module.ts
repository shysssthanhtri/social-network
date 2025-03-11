import { IntrospectAndCompose } from '@apollo/gateway';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { ApolloGatewayDriver, ApolloGatewayDriverConfig } from '@nestjs/apollo';
import {
    MiddlewareConsumer,
    Module,
    NestModule,
    RequestMethod,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { CommonModule } from 'common-nestjs-server';

import { AuthProxyMiddleware } from '@/gateways/middlewares/auth-proxy.middleware';

import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
    imports: [
        CommonModule,
        GraphQLModule.forRootAsync<ApolloGatewayDriverConfig>({
            driver: ApolloGatewayDriver,
            useFactory: (configService: ConfigService) => ({
                server: {
                    playground: false,
                    plugins: [ApolloServerPluginLandingPageLocalDefault()],
                },
                gateway: {
                    supergraphSdl: new IntrospectAndCompose({
                        subgraphs: [
                            {
                                name: 'users',
                                url: `${configService.getOrThrow<string>('USERS_URL')}/graphql`,
                            },
                        ],
                    }),
                },
            }),
            inject: [ConfigService],
        }),
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(AuthProxyMiddleware)
            .forRoutes({ path: 'auth/*splat', method: RequestMethod.ALL });
    }
}
