import { Parent, ResolveField, Resolver } from '@nestjs/graphql';

import { PostEntity } from '@/domain/entities/post.entity';
import { UserEntity } from '@/domain/entities/user.entity';
import { GetPostsUseCase } from '@/domain/use-cases/get-posts/get-posts.use-case';

@Resolver(() => UserEntity)
export class UserResolver {
    constructor(private readonly getPostsUseCase: GetPostsUseCase) {}

    @ResolveField(() => [PostEntity], { name: 'posts' })
    public getPosts(@Parent() user: UserEntity): Promise<PostEntity[]> {
        return this.getPostsUseCase.execute(user.id);
    }
}
