import { Logger, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonModule } from 'common-nestjs-server';
import { SignUpQueue } from 'rabbitmq-config';

import { UserEntity } from '@/domain/entities/user.entity';
import { UserRepo } from '@/domain/repo/user.repo';
import { HashPasswordService } from '@/domain/services/hash-password.service';
import { SignJwtService } from '@/domain/services/sign-jwt.service';
import { ChangePasswordUseCase } from '@/domain/use-cases/change-password/change-password.use-case';
import { LoginUseCase } from '@/domain/use-cases/login/login.use-case';
import { RefreshTokenUseCase } from '@/domain/use-cases/refresh-token/refresh-token.use-case';
import { SignUpUseCase } from '@/domain/use-cases/sign-up/sign-up.use-case';
import { UserRepoImpl } from '@/frameworks/repo/user.repo.impl';
import { HashPasswordServiceImpl } from '@/frameworks/services/hash-password.service.impl';
import { SignJwtServiceImpl } from '@/frameworks/services/sign-jwt.service.imp';
import { JwtStrategy } from '@/frameworks/strategies/jwt.strategy';
import { AuthController } from '@/gateways/controllers/auth.controller';

import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
    imports: [
        CommonModule,
        JwtModule.registerAsync({
            global: true,
            useFactory: (configService: ConfigService) => ({
                secret: configService.getOrThrow('AUTH_ACCESS_TOKEN_SECRET'),
                signOptions: { expiresIn: '60m' },
            }),
            inject: [ConfigService],
        }),
        ClientsModule.registerAsync([
            {
                name: SignUpQueue.queue,
                useFactory: (configService: ConfigService) => ({
                    transport: Transport.RMQ,
                    options: {
                        url: configService.getOrThrow<string>('RABBITMQ_URL'),
                        queue: SignUpQueue.queue,
                        queueOptions: {
                            durable: true,
                        },
                    },
                }),
                inject: [ConfigService],
            },
        ]),
        TypeOrmModule.forRootAsync({
            useFactory: (configService: ConfigService) => {
                const logger = new Logger('Typeorm');
                return {
                    type: 'postgres',
                    url: configService.getOrThrow<string>('AUTH_DATABASE_URL'),
                    entities: [UserEntity],
                    synchronize: true,
                    logging: true,
                    logger: {
                        logQuery(query) {
                            logger.debug(query);
                        },
                        logQueryError(error, query) {
                            logger.error(error);
                            logger.debug(query);
                        },
                        logQuerySlow(time, query) {
                            logger.warn(time);
                            logger.debug(query);
                        },
                        logSchemaBuild(message) {
                            logger.log(message);
                        },
                        logMigration(message) {
                            logger.log(message);
                        },
                        log(level, message) {
                            if (level === 'info' || level === 'log') {
                                logger.log(message);
                            }
                            if (level === 'warn') {
                                logger.warn(message);
                            }
                        },
                    },
                };
            },
            inject: [ConfigService],
        }),
        TypeOrmModule.forFeature([UserEntity]),
    ],
    controllers: [AppController, AuthController],
    providers: [
        AppService,

        //  STRATEGIES
        JwtStrategy,

        //  USE CASES
        SignUpUseCase,
        LoginUseCase,
        ChangePasswordUseCase,
        RefreshTokenUseCase,

        //  REPO
        { provide: UserRepo, useClass: UserRepoImpl },

        //  SERVICES
        { provide: SignJwtService, useClass: SignJwtServiceImpl },
        { provide: HashPasswordService, useClass: HashPasswordServiceImpl },
    ],
})
export class AppModule {}
