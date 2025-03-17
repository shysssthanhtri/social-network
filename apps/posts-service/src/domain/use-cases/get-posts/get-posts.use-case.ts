import { Inject, Injectable } from '@nestjs/common';

import { PostEntity } from '@/domain/entities/post.entity';
import { PostRepo } from '@/domain/repo/post.repo';

@Injectable()
export class GetPostsUseCase {
    constructor(
        @Inject(PostRepo)
        private readonly postRepo: PostRepo,
    ) {}

    execute(authorId: PostEntity['authorId']) {
        return this.postRepo.getByAuthorId(authorId);
    }
}
