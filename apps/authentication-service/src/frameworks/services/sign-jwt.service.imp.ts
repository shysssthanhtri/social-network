import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { UserEntity } from '@/domain/entities/user.entity';
import { SignJwtService } from '@/domain/services/sign-jwt.service';
import { TJwtPayload } from '@/domain/types/jwt-payload';

@Injectable()
export class SignJwtServiceImpl extends SignJwtService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
    ) {
        super();
    }

    signAccessToken(
        user: Pick<UserEntity, 'id' | 'passwordVersion' | 'email'>,
    ): Promise<string> {
        const payload: TJwtPayload = {
            id: user.id,
            email: user.email,
            passwordVersion: user.passwordVersion,
        };
        return this.jwtService.signAsync(payload);
    }

    signRefreshToken(
        user: Pick<UserEntity, 'id' | 'passwordVersion' | 'email'>,
    ): Promise<string> {
        const payload: TJwtPayload = {
            id: user.id,
            email: user.email,
            passwordVersion: user.passwordVersion,
        };
        return this.jwtService.signAsync(payload, {
            secret: this.configService.getOrThrow('AUTH_ACCESS_REFRESH_SECRET'),
        });
    }
}
