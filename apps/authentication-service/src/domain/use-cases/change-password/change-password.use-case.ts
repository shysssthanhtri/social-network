import { Inject, Injectable } from '@nestjs/common';

import { UserEntity } from '@/domain/entities/user.entity';
import { UserRepo } from '@/domain/repo/user.repo';
import { HashPasswordService } from '@/domain/services/hash-password.service';
import { SignJwtService } from '@/domain/services/sign-jwt.service';
import { ChangePasswordReqDto } from '@/domain/use-cases/change-password/dtos/change-password.req.dto';
import { ChangePasswordResDto } from '@/domain/use-cases/change-password/dtos/change-password.res.dto';

@Injectable()
export class ChangePasswordUseCase {
    constructor(
        @Inject(UserRepo)
        private readonly userRepo: UserRepo,
        @Inject(SignJwtService)
        private readonly signJwtService: SignJwtService,
        @Inject(HashPasswordService)
        private readonly hashPasswordService: HashPasswordService,
    ) {}

    async execute(
        userId: UserEntity['id'],
        dto: ChangePasswordReqDto,
    ): Promise<ChangePasswordResDto> {
        const user = await this.userRepo.getById(userId);
        user.hashedPassword = await this.hashPasswordService.hash(
            dto.newPassword,
        );
        user.passwordVersion += 1;
        await this.userRepo.save(user);

        const resDto = new ChangePasswordResDto(
            await this.signJwtService.signAccessToken(user),
            await this.signJwtService.signRefreshToken(user),
        );

        return resDto;
    }
}
