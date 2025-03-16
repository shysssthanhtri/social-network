import { BasedRepo } from 'nestjs-postgresql';

import { PostEntity } from '@/domain/entities/post.entity';

export abstract class PostRepo extends BasedRepo {
    abstract create(post: Omit<PostEntity, 'id'>): Promise<PostEntity>;
}
