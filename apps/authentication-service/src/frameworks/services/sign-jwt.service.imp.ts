import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { UserEntity } from '@/domain/entities/user.entity';
import { SignJwtService } from '@/domain/services/sign-jwt.service';
import { TJwtPayload, TRefreshJwtPayload } from '@/domain/types/jwt-payload';

@Injectable()
export class SignJwtServiceImpl extends SignJwtService {
    private readonly logger = new Logger(SignJwtServiceImpl.name);

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

    parseRefreshToken(token: string): Promise<TRefreshJwtPayload> {
        try {
            return this.jwtService.verifyAsync(token, {
                secret: this.configService.getOrThrow(
                    'AUTH_ACCESS_REFRESH_SECRET',
                ),
                ignoreExpiration: true,
            });
        } catch (error) {
            this.logger.error(error);
            throw new UnauthorizedException();
        }
    }
}
