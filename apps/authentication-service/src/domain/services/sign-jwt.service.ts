import { UserEntity } from '@/domain/entities/user.entity';
import { TRefreshJwtPayload } from '@/domain/types/jwt-payload';

export abstract class SignJwtService {
    abstract signAccessToken(
        user: Pick<UserEntity, 'id' | 'passwordVersion'>,
    ): Promise<string>;

    abstract signRefreshToken(
        user: Pick<UserEntity, 'id' | 'passwordVersion'>,
    ): Promise<string>;

    abstract parseRefreshToken(token: string): Promise<TRefreshJwtPayload>;
}
