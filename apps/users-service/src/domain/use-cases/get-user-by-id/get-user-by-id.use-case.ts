import { Inject, Injectable } from '@nestjs/common';

import { UserEntity } from '@/domain/entities/user.entity';
import { UserRepo } from '@/domain/repo/user.repo';

@Injectable()
export class GetUserByIdUseCase {
    constructor(
        @Inject(UserRepo)
        private readonly userRepo: UserRepo,
    ) {}

    async execute(id: UserEntity['id']): Promise<UserEntity> {
        return this.userRepo.getById(id);
    }
}
