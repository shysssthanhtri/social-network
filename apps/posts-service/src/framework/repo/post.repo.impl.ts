import { Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { DataSource } from 'typeorm';

import { PostEntity } from '@/domain/entities/post.entity';
import { PostRepo } from '@/domain/repo/post.repo';

@Injectable({ scope: Scope.REQUEST })
export class PostRepoImpl extends PostRepo {
    constructor(
        dataSource: DataSource,
        @Inject(REQUEST) req: { req: Request },
    ) {
        super(dataSource, req.req);
    }

    create(post: Omit<PostEntity, 'id'>): Promise<PostEntity> {
        return this.getRepository(PostEntity).save(post);
    }

    getByAuthorId(authorId: PostEntity['authorId']): Promise<PostEntity[]> {
        return this.getRepository(PostEntity).find({ where: { authorId } });
    }
}
