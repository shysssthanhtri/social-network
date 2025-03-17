import { Args, Query, Resolver, ResolveReference } from '@nestjs/graphql';

import { UserEntity } from '@/domain/entities/user.entity';
import { GetUserByIdUseCase } from '@/domain/use-cases/get-user-by-id/get-user-by-id.use-case';

@Resolver(() => UserEntity)
export class UsersResolver {
    constructor(private readonly getUserByIdUseCase: GetUserByIdUseCase) {}

    @Query(() => UserEntity, { name: 'user' })
    async user(@Args('id', { type: () => String }) id: UserEntity['id']) {
        return this.getUserByIdUseCase.execute(id);
    }

    @ResolveReference()
    resolveReference(reference: {
        __typename: string;
        id: UserEntity['id'];
    }): Promise<UserEntity> {
        console.log(reference);
        return this.getUserByIdUseCase.execute(reference.id);
    }
}
