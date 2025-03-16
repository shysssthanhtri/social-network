import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { type Request } from 'express';
import { catchError, concatMap, finalize, Observable } from 'rxjs';
import { type DataSource } from 'typeorm';
export const ENTITY_MANAGER_KEY = 'ENTITY_MANAGER';

@Injectable()
export class TransactionInterceptor implements NestInterceptor {
    constructor(private readonly dataSource: DataSource) {}

    async intercept(
        context: ExecutionContext,
        next: CallHandler<any>,
    ): Promise<Observable<any>> {
        // get request object
        const reqRest = context.switchToHttp().getRequest<Request>();

        const ctx = GqlExecutionContext.create(context);
        const reqGraphql = ctx.getContext<{ req: Request }>().req;

        // start transaction
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        // attach query manager with transaction to the request
        if (reqRest) {
            reqRest[ENTITY_MANAGER_KEY] = queryRunner.manager;
        }
        if (reqGraphql) {
            reqGraphql[ENTITY_MANAGER_KEY] = queryRunner.manager;
        }

        return next.handle().pipe(
            // concatMap gets called when route handler completes successfully
            concatMap(async (data) => {
                await queryRunner.commitTransaction();
                // eslint-disable-next-line @typescript-eslint/no-unsafe-return
                return data;
            }),
            // catchError gets called when route handler throws an exception
            catchError(async (e) => {
                await queryRunner.rollbackTransaction();
                throw e;
            }),
            // always executed, even if catchError method throws an exception
            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            finalize(async () => {
                await queryRunner.release();
            }),
        );
    }
}
