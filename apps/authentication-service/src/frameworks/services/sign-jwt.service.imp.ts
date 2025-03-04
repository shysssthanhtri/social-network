import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { UserEntity } from '@/domain/entities/user.entity';
import { SignJwtService } from '@/domain/services/sign-jwt.service';
import { JwtPayload } from '@/domain/types/jwt-payload';

@Injectable()
export class SignJwtServiceImpl extends SignJwtService {
    constructor(private readonly jwtService: JwtService) {
        super();
    }

    signAccessToken(
        user: Pick<UserEntity, 'id' | 'passwordVersion' | 'email'>,
    ): Promise<string> {
        const payload: JwtPayload = {
            id: user.id,
            email: user.email,
            passwordVersion: user.passwordVersion,
        };
        return this.jwtService.signAsync(payload);
    }

    signRefreshToken(
        user: Pick<UserEntity, 'id' | 'passwordVersion' | 'email'>,
    ): Promise<string> {
        const payload: JwtPayload = {
            id: user.id,
            email: user.email,
            passwordVersion: user.passwordVersion,
        };
        return this.jwtService.signAsync(payload, {
            secret: 'refresh-token-secret',
        });
    }
}
