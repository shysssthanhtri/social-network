import { Field, ObjectType } from '@nestjs/graphql';
import { Prop, Schema } from '@nestjs/mongoose';

@Schema({ collection: 'users' })
@ObjectType()
export class UserEntity {
    @Field({ description: "User's id" })
    id: string;

    @Prop()
    @Field({ description: "User's email" })
    email: string;
}
