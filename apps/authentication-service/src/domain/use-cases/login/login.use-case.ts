import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';

import { UserRepo } from '@/domain/repo/user.repo';
import { HashPasswordService } from '@/domain/services/hash-password.service';
import { SignJwtService } from '@/domain/services/sign-jwt.service';
import { LoginReqDto } from '@/domain/use-cases/login/dtos/login.req.dto';
import { LoginResDto } from '@/domain/use-cases/login/dtos/login.res.dto';

@Injectable()
export class LoginUseCase {
    constructor(
        @Inject(UserRepo)
        private readonly userRepo: UserRepo,
        @Inject(SignJwtService)
        private readonly signJwtService: SignJwtService,
        @Inject(HashPasswordService)
        private readonly hashPasswordService: HashPasswordService,
    ) {}

    async execute(dto: LoginReqDto): Promise<LoginResDto> {
        const user = await this.userRepo.findByEmail(dto.email);
        if (!user) {
            throw new UnauthorizedException();
        }

        if (
            !(await this.hashPasswordService.compare(
                dto.password,
                user.hashedPassword,
            ))
        ) {
            throw new UnauthorizedException('Your credentials are incorrect');
        }

        const resDto = new LoginResDto(
            await this.signJwtService.signAccessToken(user),
            await this.signJwtService.signRefreshToken(user),
        );

        return resDto;
    }
}
