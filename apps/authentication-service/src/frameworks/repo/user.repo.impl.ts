import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { UserEntity } from '@/domain/entities/user.entity';
import { UserRepo } from '@/domain/repo/user.repo';

@Injectable()
export class UserRepoImpl extends UserRepo {
    constructor(
        @InjectModel(UserEntity.name)
        private readonly userModel: Model<UserEntity>,
    ) {
        super();
    }

    add(
        user: Pick<UserEntity, 'email' | 'hashedPassword' | 'passwordVersion'>,
    ): Promise<UserEntity> {
        const createdUser = new this.userModel(user);
        return createdUser.save();
    }
}
