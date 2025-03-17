import { Parent, ResolveField, Resolver } from '@nestjs/graphql';

import { PostEntity } from '@/domain/entities/post.entity';
import { UserEntity } from '@/domain/entities/user.entity';

@Resolver(() => PostEntity)
export class PostsResolver {
    @ResolveField(() => UserEntity, { name: 'author' })
    getAuthor(@Parent() post: PostEntity) {
        return { __typename: UserEntity.name, id: post.authorId };
    }
}
