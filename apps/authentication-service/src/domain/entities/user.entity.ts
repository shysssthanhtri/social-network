import { Prop, Schema } from '@nestjs/mongoose';

@Schema({ collection: 'users' })
export class UserEntity {
    id: string;

    @Prop()
    email: string;

    @Prop()
    hashedPassword: string;

    @Prop()
    passwordVersion: number;
}
