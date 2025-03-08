import { UserEntity } from '@/domain/entities/user.entity';

export abstract class UserRepo {
    abstract add(user: UserEntity): Promise<UserEntity>;
}
