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

    async add(
        user: Pick<UserEntity, 'email' | 'hashedPassword' | 'passwordVersion'>,
    ): Promise<UserEntity> {
        return this.getRepository(UserEntity).save(user);
    }

    async isEmailExisted(email: UserEntity['email']): Promise<boolean> {
        return this.getRepository(UserEntity).exists({ where: { email } });
    }

    async findByEmail(
        email: UserEntity['email'],
    ): Promise<UserEntity | undefined> {
        const user = await this.getRepository(UserEntity).findOne({
            where: { email },
        });
        return user ?? undefined;
    }

    async getById(id: UserEntity['id']): Promise<UserEntity> {
        const user = await this.findById(id);
        if (!user) {
            throw new NotFoundException();
        }
        return user;
    }

    async findById(id: UserEntity['id']): Promise<UserEntity | undefined> {
        const user = await this.getRepository(UserEntity).findOne({
            where: { id },
        });
        return user ?? undefined;
    }

    async save(user: UserEntity): Promise<UserEntity> {
        return this.getRepository(UserEntity).save(user);
    }
}
