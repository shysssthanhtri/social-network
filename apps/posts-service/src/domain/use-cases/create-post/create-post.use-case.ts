import { Inject, Injectable } from '@nestjs/common';

import { PostEntity } from '@/domain/entities/post.entity';
import { PostRepo } from '@/domain/repo/post.repo';

@Injectable()
export class CreatePostUseCase {
    constructor(
        @Inject(PostRepo)
        private readonly postRepo: PostRepo,
    ) {}

    async execute(post: Omit<PostEntity, 'id'>): Promise<PostEntity> {
        const createdPost = await this.postRepo.create(post);
        return createdPost;
    }
}
