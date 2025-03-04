import { Inject, UnauthorizedException } from '@nestjs/common';

import { UserRepo } from '@/domain/repo/user.repo';
import { SignJwtService } from '@/domain/services/sign-jwt.service';
import { RefreshTokenReqDto } from '@/domain/use-cases/refresh-token/dtos/refresh-token.req.dto';
import { RefreshTokenResDto } from '@/domain/use-cases/refresh-token/dtos/refresh-token.res.dto';

export class RefreshTokenUseCase {
    constructor(
        @Inject(UserRepo)
        private readonly userRepo: UserRepo,
        @Inject(SignJwtService)
        private readonly signJwtService: SignJwtService,
    ) {}

    async execute(dto: RefreshTokenReqDto): Promise<RefreshTokenResDto> {
        const jwtPayload = await this.signJwtService.parseRefreshToken(
            dto.refreshToken,
        );
        const user = await this.userRepo.findById(jwtPayload.id);
        if (!user) {
            throw new UnauthorizedException();
        }
        if (jwtPayload.passwordVersion !== user.passwordVersion) {
            throw new UnauthorizedException('Your token is expired');
        }
        const resDto = new RefreshTokenResDto(
            await this.signJwtService.signAccessToken(user),
            await this.signJwtService.signRefreshToken(user),
        );

        return resDto;
    }
}
