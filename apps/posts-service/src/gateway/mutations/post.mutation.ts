import { Injectable } from '@nestjs/common';
import { Args, Mutation } from '@nestjs/graphql';

import { PostEntity } from '@/domain/entities/post.entity';
import { CreatePostUseCase } from '@/domain/use-cases/create-post/create-post.use-case';
import { CreatePostInputType } from '@/domain/use-cases/create-post/input-types/create-post.input-type';

@Injectable()
export class PostMutation {
    constructor(private readonly createPoseUseCase: CreatePostUseCase) {}

    @Mutation(() => PostEntity, { name: 'createPost' })
    createPost(@Args('createPostInput') createPostInput: CreatePostInputType) {
        return this.createPoseUseCase.execute(createPostInput);
    }
}
