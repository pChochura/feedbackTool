import { EntitySchema } from 'typeorm';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
declare class PostgresConfig {
    getConfig(entities?: (string | Function | EntitySchema<any>)[]): TypeOrmModuleOptions;
}
export declare const postgresConfig: PostgresConfig;
export {};
