import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserEntity } from '@/domain/entities/user.entity';
import { UserRepo } from '@/domain/repo/user.repo';

@Injectable()
export class UserRepoImpl extends UserRepo {
    constructor(
        @InjectRepository(UserEntity)
        private readonly usersRepository: Repository<UserEntity>,
    ) {
        super();
    }

    async add(
        user: Pick<UserEntity, 'email' | 'hashedPassword' | 'passwordVersion'>,
    ): Promise<UserEntity> {
        return this.usersRepository.save(user);
    }

    async isEmailExisted(email: UserEntity['email']): Promise<boolean> {
        return this.usersRepository.exists({ where: { email } });
    }

    async findByEmail(
        email: UserEntity['email'],
    ): Promise<UserEntity | undefined> {
        const user = await this.usersRepository.findOne({ where: { email } });
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
        const user = await this.usersRepository.findOne({ where: { id } });
        return user ?? undefined;
    }

    async save(user: UserEntity): Promise<UserEntity> {
        return this.usersRepository.save(user);
    }
}
