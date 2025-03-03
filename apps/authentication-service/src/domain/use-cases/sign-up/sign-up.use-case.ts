import { Inject, Injectable } from '@nestjs/common';

import { UserRepo } from '@/domain/repo/user.repo';
import { SignUpReqDto } from '@/domain/use-cases/sign-up/dtos/sign-up.req.dto';
import { SignUpResDto } from '@/domain/use-cases/sign-up/dtos/sign-up.res.dto';

@Injectable()
export class SignUpUseCase {
    constructor(
        @Inject(UserRepo)
        private readonly userRepo: UserRepo,
    ) {}

    async execute(dto: SignUpReqDto): Promise<SignUpResDto> {
        const hashedPassword = 'faked';
        const passwordVersion = 1;
        const user = await this.userRepo.add({
            email: dto.email,
            hashedPassword,
            passwordVersion,
        });
        console.log(user);
        return {
            accessToken: '',
            refreshToken: '',
        };
    }
}
