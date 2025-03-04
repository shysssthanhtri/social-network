import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';

import { UserEntity } from '@/domain/entities/user.entity';
import { UserRepo } from '@/domain/repo/user.repo';
import { HashPasswordService } from '@/domain/services/hash-password.service';
import { SignJwtService } from '@/domain/services/sign-jwt.service';
import { SignUpUseCase } from '@/domain/use-cases/sign-up/sign-up.use-case';
import { UserRepoImpl } from '@/frameworks/repo/user.repo.impl';
import { UserSchema } from '@/frameworks/schemas/user.schema';
import { HashPasswordServiceImpl } from '@/frameworks/services/hash-password.service.impl';
import { SignJwtServiceImpl } from '@/frameworks/services/sign-jwt.service.imp';
import { AuthController } from '@/gateways/controllers/auth.controller';

import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
    imports: [
        MongooseModule.forRoot(
            'mongodb://auth-admin:auth-admin@localhost:27017/auth',
        ),
        MongooseModule.forFeature([
            { name: UserEntity.name, schema: UserSchema },
        ]),
        JwtModule.register({
            global: true,
            secret: 'access_token_secret',
            signOptions: { expiresIn: '60m' },
        }),
    ],
    controllers: [AppController, AuthController],
    providers: [
        AppService,

        //  USE CASES
        SignUpUseCase,

        //  REPO
        { provide: UserRepo, useClass: UserRepoImpl },

        //  SERVICES
        { provide: SignJwtService, useClass: SignJwtServiceImpl },
        { provide: HashPasswordService, useClass: HashPasswordServiceImpl },
    ],
})
export class AppModule {}
