import { ConflictException, Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { SignUpEvent, SignUpQueue } from 'rabbitmq-config';

import { UserRepo } from '@/domain/repo/user.repo';
import { HashPasswordService } from '@/domain/services/hash-password.service';
import { SignJwtService } from '@/domain/services/sign-jwt.service';
import { SignUpReqDto } from '@/domain/use-cases/sign-up/dtos/sign-up.req.dto';
import { SignUpResDto } from '@/domain/use-cases/sign-up/dtos/sign-up.res.dto';

@Injectable()
export class SignUpUseCase {
    private readonly logger = new Logger(SignUpUseCase.name);

    constructor(
        @Inject(UserRepo)
        private readonly userRepo: UserRepo,
        @Inject(SignJwtService)
        private readonly signJwtService: SignJwtService,
        @Inject(HashPasswordService)
        private readonly hashPasswordService: HashPasswordService,
        @Inject(SignUpQueue.queue)
        private readonly queueClient: ClientProxy,
    ) {}

    async execute(dto: SignUpReqDto): Promise<SignUpResDto> {
        const isEmailDuplicated = await this.userRepo.isEmailExisted(dto.email);
        if (isEmailDuplicated) {
            throw new ConflictException('Email is existed');
        }

        const user = await this.userRepo.add({
            email: dto.email,
            hashedPassword: await this.hashPasswordService.hash(dto.password),
            passwordVersion: 1,
        });

        this.queueClient.emit(
            SignUpQueue.patterns.SIGN_UP,
            new SignUpEvent(user.id, user.email),
        );

        const resDto = new SignUpResDto(
            await this.signJwtService.signAccessToken(user),
            await this.signJwtService.signRefreshToken(user),
        );

        return resDto;
    }
}
