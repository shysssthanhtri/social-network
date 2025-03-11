import { Directive, Field, ID, ObjectType } from '@nestjs/graphql';
import { Prop, Schema } from '@nestjs/mongoose';

@Schema({ collection: 'users' })
@ObjectType()
@Directive('@key(fields: "id")')
export class UserEntity {
    @Field(() => ID, { description: "User's id" })
    id: string;

    @Prop()
    @Field({ description: "User's email" })
    email: string;
}
