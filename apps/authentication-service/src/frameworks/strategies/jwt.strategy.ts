import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { UserRepo } from '@/domain/repo/user.repo';
import { TJwtPayload } from '@/domain/types/jwt-payload';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        configService: ConfigService,
        @Inject(UserRepo)
        private readonly userRepo: UserRepo,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.getOrThrow('AUTH_ACCESS_TOKEN_SECRET'),
        });
    }

    async validate(payload: TJwtPayload) {
        const user = await this.userRepo.findById(payload.id);
        if (!user) {
            throw new UnauthorizedException();
        }
        if (payload.passwordVersion !== user.passwordVersion) {
            throw new UnauthorizedException('Your token is outdated');
        }
        return payload;
    }
}
