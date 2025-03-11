import { BasedRepo } from 'nestjs-postgresql';

import { UserEntity } from '@/domain/entities/user.entity';

export abstract class UserRepo extends BasedRepo {
    abstract isEmailExisted(email: UserEntity['email']): Promise<boolean>;

    abstract findByEmail(
        email: UserEntity['email'],
    ): Promise<UserEntity | undefined>;

    abstract findById(id: UserEntity['id']): Promise<UserEntity | undefined>;

    abstract getById(id: UserEntity['id']): Promise<UserEntity>;

    abstract add(
        user: Pick<UserEntity, 'email' | 'hashedPassword' | 'passwordVersion'>,
    ): Promise<UserEntity>;

    abstract save(user: UserEntity): Promise<UserEntity>;
}
