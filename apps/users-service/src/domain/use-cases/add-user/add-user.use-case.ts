import { Inject } from '@nestjs/common';

import { UserEntity } from '@/domain/entities/user.entity';
import { UserRepo } from '@/domain/repo/user.repo';

export class AddUserUseCase {
    constructor(
        @Inject(UserRepo)
        private readonly userRepo: UserRepo,
    ) {}

    async execute(user: UserEntity) {
        return this.userRepo.add(user);
    }
}
