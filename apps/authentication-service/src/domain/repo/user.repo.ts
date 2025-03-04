import { UserEntity } from '@/domain/entities/user.entity';

export abstract class UserRepo {
    abstract isEmailExisted(email: UserEntity['email']): Promise<boolean>;

    abstract add(
        user: Pick<UserEntity, 'email' | 'hashedPassword' | 'passwordVersion'>,
    ): Promise<UserEntity>;
}
