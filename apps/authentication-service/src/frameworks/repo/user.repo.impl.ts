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

    async add(
        user: Pick<UserEntity, 'email' | 'hashedPassword' | 'passwordVersion'>,
    ): Promise<UserEntity> {
        const createdUser = new this.userModel(user);
        return (await createdUser.save()).toJSON();
    }

    async isEmailExisted(email: UserEntity['email']): Promise<boolean> {
        const user = await this.userModel.exists({ email }).exec();
        return !!user;
    }

    async findByEmail(
        email: UserEntity['email'],
    ): Promise<UserEntity | undefined> {
        const user = await this.userModel.findOne({ email }).exec();
        return user?.toJSON();
    }
}
