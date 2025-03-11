import { Directive, Field, ID, ObjectType } from '@nestjs/graphql';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'users' })
@ObjectType()
@Directive('@key(fields: "id")')
export class UserEntity {
    @Field(() => ID, { description: "User's id" })
    @Column({ primary: true })
    id: string;

    @Column()
    @Field({ description: "User's email" })
    email: string;
}
