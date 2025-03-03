import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UserEntity } from '@/domain/entities/user.entity';
import { UserRepo } from '@/domain/repo/user.repo';
import { SignUpUseCase } from '@/domain/use-cases/sign-up/sign-up.use-case';
import { UserRepoImpl } from '@/frameworks/repo/user.repo.impl';
import { UserSchema } from '@/frameworks/schemas/user.schema';
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
    ],
    controllers: [AppController, AuthController],
    providers: [
        AppService,

        //  USE CASES
        SignUpUseCase,

        //  REPO
        { provide: UserRepo, useClass: UserRepoImpl },
    ],
})
export class AppModule {}
