import { SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

import { UserEntity } from '@/domain/entities/user.entity';

export type UserDocument = HydratedDocument<UserEntity>;
export const UserSchema = SchemaFactory.createForClass(UserEntity);

UserSchema.set('toJSON', {
    transform: (doc, ret) => {
        ret.id = doc._id;
        delete ret._id;
        return ret;
    },
});
