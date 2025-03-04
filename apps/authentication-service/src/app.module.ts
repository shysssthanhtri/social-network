import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { LoggerModule } from 'nestjs-pino';

import { UserEntity } from '@/domain/entities/user.entity';
import { UserRepo } from '@/domain/repo/user.repo';
import { HashPasswordService } from '@/domain/services/hash-password.service';
import { SignJwtService } from '@/domain/services/sign-jwt.service';
import { ChangePasswordUseCase } from '@/domain/use-cases/change-password/change-password.use-case';
import { LoginUseCase } from '@/domain/use-cases/login/login.use-case';
import { RefreshTokenUseCase } from '@/domain/use-cases/refresh-token/refresh-token.use-case';
import { SignUpUseCase } from '@/domain/use-cases/sign-up/sign-up.use-case';
import { UserRepoImpl } from '@/frameworks/repo/user.repo.impl';
import { UserSchema } from '@/frameworks/schemas/user.schema';
import { HashPasswordServiceImpl } from '@/frameworks/services/hash-password.service.impl';
import { SignJwtServiceImpl } from '@/frameworks/services/sign-jwt.service.imp';
import { JwtStrategy } from '@/frameworks/strategies/jwt.strategy';
import { AuthController } from '@/gateways/controllers/auth.controller';

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
        MongooseModule.forRootAsync({
            useFactory: (configService: ConfigService) => {
                return {
                    uri: configService.getOrThrow('AUTH_DATABASE_URL'),
                };
            },
            inject: [ConfigService],
        }),
        MongooseModule.forFeature([
            { name: UserEntity.name, schema: UserSchema },
        ]),
        JwtModule.registerAsync({
            global: true,
            useFactory: (configService: ConfigService) => ({
                secret: configService.getOrThrow('AUTH_ACCESS_TOKEN_SECRET'),
                signOptions: { expiresIn: '60m' },
            }),
            inject: [ConfigService],
        }),
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
