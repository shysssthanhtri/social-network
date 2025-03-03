import { UserEntity } from '@/domain/entities/user.entity';

export abstract class UserRepo {
    abstract add(
        user: Pick<UserEntity, 'email' | 'hashedPassword' | 'passwordVersion'>,
    ): Promise<UserEntity>;
}
