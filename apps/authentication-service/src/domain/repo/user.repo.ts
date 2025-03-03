import { UserEntity } from '@/domain/entities/user.entity';

export abstract class UserRepo {
    abstract findByEmail(
        email: UserEntity['email'],
    ): Promise<UserEntity | null>;

    abstract add(
        user: Pick<UserEntity, 'email' | 'hashedPassword' | 'passwordVersion'>,
    ): Promise<UserEntity>;
}
