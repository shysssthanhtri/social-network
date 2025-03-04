import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

import { UserRepo } from '@/domain/repo/user.repo';
import { HashPasswordService } from '@/domain/services/hash-password.service';
import { SignJwtService } from '@/domain/services/sign-jwt.service';
import { SignUpReqDto } from '@/domain/use-cases/sign-up/dtos/sign-up.req.dto';
import { SignUpResDto } from '@/domain/use-cases/sign-up/dtos/sign-up.res.dto';

@Injectable()
export class SignUpUseCase {
    constructor(
        @Inject(UserRepo)
        private readonly userRepo: UserRepo,
        @InjectConnection()
        private readonly connection: Connection,
        @Inject(SignJwtService)
        private readonly signJwtService: SignJwtService,
        @Inject(HashPasswordService)
        private readonly hashPasswordService: HashPasswordService,
    ) {}

    async execute(dto: SignUpReqDto): Promise<SignUpResDto> {
        const session = await this.connection.startSession();
        session.startTransaction();

        try {
            const isEmailDuplicated = await this.userRepo.isEmailExisted(
                dto.email,
            );
            if (isEmailDuplicated) {
                throw new ConflictException('Email is existed');
            }

            const user = await this.userRepo.add({
                email: dto.email,
                hashedPassword: await this.hashPasswordService.hash(
                    dto.password,
                ),
                passwordVersion: 1,
            });

            const resDto = new SignUpResDto(
                await this.signJwtService.signAccessToken(user),
                await this.signJwtService.signRefreshToken(user),
            );

            await session.commitTransaction();
            return resDto;
        } catch (err) {
            await session.abortTransaction();
            throw err;
        }
    }
}
