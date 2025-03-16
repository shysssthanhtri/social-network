import { DynamicModule, Global, Logger, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BaseDataSourceOptions } from 'typeorm/data-source/BaseDataSourceOptions';

@Global()
@Module({})
export class CommonTypeOrmModule {
    static forRootAsync(
        options: Pick<BaseDataSourceOptions, 'entities'> & {
            urlKey: string;
        },
    ): DynamicModule {
        return TypeOrmModule.forRootAsync({
            useFactory: (configService: ConfigService) => {
                const logger = new Logger('Typeorm');
                return {
                    type: 'postgres',
                    synchronize: true,
                    logging: true,
                    logger: {
                        logQuery(query) {
                            logger.debug(query);
                        },
                        logQueryError(error, query) {
                            logger.error(error);
                            logger.debug(query);
                        },
                        logQuerySlow(time, query) {
                            logger.warn(time);
                            logger.debug(query);
                        },
                        logSchemaBuild(message) {
                            logger.log(message);
                        },
                        logMigration(message) {
                            logger.log(message);
                        },
                        log(level, message) {
                            if (level === 'info' || level === 'log') {
                                logger.log(message);
                            }
                            if (level === 'warn') {
                                logger.warn(message);
                            }
                        },
                    },
                    url: configService.getOrThrow(options.urlKey),
                    ...options,
                };
            },
            inject: [ConfigService],
        });
    }
}
