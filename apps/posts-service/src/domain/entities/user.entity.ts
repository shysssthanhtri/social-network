import { Directive, Field, ID, ObjectType } from '@nestjs/graphql';

import { PostEntity } from '@/domain/entities/post.entity';

@ObjectType()
@Directive('@extends')
@Directive('@key(fields: "id")')
export class UserEntity {
    @Field(() => ID)
    @Directive('@external')
    id: string;

    @Field(() => [PostEntity])
    posts?: PostEntity[];
}
