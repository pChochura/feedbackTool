'use strict';
var __decorate =
	(this && this.__decorate) ||
	function (decorators, target, key, desc) {
		var c = arguments.length,
			r =
				c < 3
					? target
					: desc === null
					? (desc = Object.getOwnPropertyDescriptor(target, key))
					: desc,
			d;
		if (typeof Reflect === 'object' && typeof Reflect.decorate === 'function')
			r = Reflect.decorate(decorators, target, key, desc);
		else
			for (var i = decorators.length - 1; i >= 0; i--)
				if ((d = decorators[i]))
					r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
		return c > 3 && r && Object.defineProperty(target, key, r), r;
	};
Object.defineProperty(exports, '__esModule', { value: true });
exports.AppModule = void 0;
const common_1 = require('@nestjs/common');
const config_1 = require('@nestjs/config');
const typeorm_1 = require('@nestjs/typeorm');
const config_service_1 = require('./modules/config/config.service');
const session_module_1 = require('./modules/sessions/session.module');
const user_module_1 = require('./modules/users/user.module');
const list_module_1 = require('./modules/lists/list.module');
const note_module_1 = require('./modules/notes/note.module');
const room_module_1 = require('./modules/rooms/room.module');
let AppModule = class AppModule {};
AppModule = __decorate(
	[
		common_1.Module({
			imports: [
				session_module_1.SessionModule,
				user_module_1.UserModule,
				list_module_1.ListModule,
				note_module_1.NoteModule,
				room_module_1.RoomModule,
				config_1.ConfigModule.forRoot({ isGlobal: true }),
				typeorm_1.TypeOrmModule.forRootAsync({
					useFactory: () => config_service_1.postgresConfig.getConfig(),
				}),
			],
		}),
	],
	AppModule
);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map
