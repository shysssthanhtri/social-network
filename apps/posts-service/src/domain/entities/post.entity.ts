import { Directive, Field, ID, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'posts' })
@ObjectType()
@Directive('@key(fields: "id")')
export class PostEntity {
    @Field(() => ID, { description: "Post's id" })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    @Field()
    content: string;
}
