import { DataSource, EntityManager, ObjectLiteral, Repository } from 'typeorm';

import { ENTITY_MANAGER_KEY } from '../interceptors';

export abstract class BasedRepo {
    constructor(
        private readonly dataSource: DataSource,
        private readonly request: Request,
    ) {}

    protected getRepository<T extends ObjectLiteral>(
        entityCls: new () => T,
    ): Repository<T> {
        const entityManager: EntityManager =
            (this.request[ENTITY_MANAGER_KEY] as EntityManager) ??
            this.dataSource.manager;
        return entityManager.getRepository(entityCls);
    }
}
