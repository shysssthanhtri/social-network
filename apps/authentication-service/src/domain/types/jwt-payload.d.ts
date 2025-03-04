import { UserEntity } from '@/domain/entities/user.entity';

export type JwtPayload = {
    id: UserEntity['id'];
    email: UserEntity['email'];
    passwordVersion: UserEntity['passwordVersion'];
};

export type RefreshJwtPayload = {
    id: UserEntity['id'];
    email: UserEntity['email'];
    passwordVersion: UserEntity['passwordVersion'];
};
