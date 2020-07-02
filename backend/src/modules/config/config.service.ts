import { EntitySchema } from 'typeorm';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Session } from '../sessions/entities/session.entity';
import { Room } from '../rooms/entities/room.entity';
import { List } from '../lists/entities/list.entity';
import { Note } from '../notes/entities/note.entity';
import { User } from '../users/entities/user.entity';
import { Feedback } from '../feedback/entities/feedback.entity';
import { Transaction } from '../transactions/entities/transaction.entity';

require('dotenv').config({ path: `${process.cwd()}/.env` });

class PostgresConfig {
	getConfig(
		entities: (string | Function | EntitySchema<any>)[] = undefined
	): TypeOrmModuleOptions {
		return {
			type: 'postgres',
			host: process.env.POSTGRES_HOST,
			port: parseInt(process.env.POSTGRES_PORT),
			username: process.env.POSTGRES_USER,
			password: process.env.POSTGRES_PASSWORD,
			database: process.env.POSTGRES_DATABASE,
			entities: entities || [Session, Room, List, Note, User, Feedback, Transaction],
			migrationsTableName: 'migration',
			migrations: ['migration/*.ts'],
			cli: {
				migrationsDir: 'migration',
			},
		};
	}
}
export const postgresConfig = new PostgresConfig();
