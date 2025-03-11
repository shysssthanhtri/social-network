import { BasedRepo } from 'nestjs-postgresql';

import { UserEntity } from '@/domain/entities/user.entity';

export abstract class UserRepo extends BasedRepo {
    abstract add(user: UserEntity): Promise<UserEntity>;

    abstract getById(id: UserEntity['id']): Promise<UserEntity>;
}
