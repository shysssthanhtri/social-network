import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

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

    async add(user: UserEntity): Promise<UserEntity> {
        const createdUser = new this.userModel(user);
        createdUser._id = new Types.ObjectId(user.id);
        return (await createdUser.save()).toJSON();
    }

    async getById(id: UserEntity['id']): Promise<UserEntity> {
        const user = await this.userModel.findById(id);
        if (!user) throw new NotFoundException();
        return user;
    }
}
