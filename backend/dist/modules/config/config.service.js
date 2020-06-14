'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.postgresConfig = void 0;
const session_entity_1 = require('../sessions/entities/session.entity');
const room_entity_1 = require('../rooms/entities/room.entity');
const list_entity_1 = require('../lists/entities/list.entity');
const note_entity_1 = require('../notes/entities/note.entity');
const user_entity_1 = require('../users/entities/user.entity');
require('dotenv').config({ path: `${process.cwd()}/.env` });
class PostgresConfig {
	getConfig(entities = undefined) {
		return {
			type: 'postgres',
			host: process.env.POSTGRES_HOST,
			port: parseInt(process.env.POSTGRES_PORT),
			username: process.env.POSTGRES_USER,
			password: process.env.POSTGRES_PASSWORD,
			database: process.env.POSTGRES_DATABASE,
			entities: entities || [
				session_entity_1.Session,
				room_entity_1.Room,
				list_entity_1.List,
				note_entity_1.Note,
				user_entity_1.User,
			],
			migrationsTableName: 'migration',
			migrations: ['src/migration/*.ts'],
			cli: {
				migrationsDir: 'src/migration',
			},
		};
	}
}
exports.postgresConfig = new PostgresConfig();
//# sourceMappingURL=config.service.js.map
