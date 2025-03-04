import { UserEntity } from '@/domain/entities/user.entity';

export abstract class SignJwtService {
    abstract signAccessToken(
        user: Pick<UserEntity, 'id' | 'passwordVersion'>,
    ): Promise<string>;

    abstract signRefreshToken(
        user: Pick<UserEntity, 'id' | 'passwordVersion'>,
    ): Promise<string>;
}
