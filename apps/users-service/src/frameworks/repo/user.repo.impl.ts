import { Inject, Injectable, NotFoundException, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { DataSource } from 'typeorm';

import { UserEntity } from '@/domain/entities/user.entity';
import { UserRepo } from '@/domain/repo/user.repo';

@Injectable({ scope: Scope.REQUEST })
export class UserRepoImpl extends UserRepo {
    constructor(dataSource: DataSource, @Inject(REQUEST) req: Request) {
        super(dataSource, req);
    }

    async add(user: UserEntity): Promise<UserEntity> {
        return this.getRepository(UserEntity).save(user);
    }

    async getById(id: UserEntity['id']): Promise<UserEntity> {
        const user = await this.getRepository(UserEntity).findOne({
            where: { id },
        });
        if (!user) {
            throw new NotFoundException();
        }
        return user;
    }
}
