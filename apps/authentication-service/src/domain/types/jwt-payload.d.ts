import { UserEntity } from '@/domain/entities/user.entity';

export type TJwtPayload = {
    id: UserEntity['id'];
    email: UserEntity['email'];
    passwordVersion: UserEntity['passwordVersion'];
};

export type TRefreshJwtPayload = {
    id: UserEntity['id'];
    email: UserEntity['email'];
    passwordVersion: UserEntity['passwordVersion'];
};
