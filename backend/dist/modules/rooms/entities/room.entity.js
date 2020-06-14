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
var __metadata =
	(this && this.__metadata) ||
	function (k, v) {
		if (typeof Reflect === 'object' && typeof Reflect.metadata === 'function')
			return Reflect.metadata(k, v);
	};
Object.defineProperty(exports, '__esModule', { value: true });
exports.Room = void 0;
const typeorm_1 = require('typeorm');
const swagger_1 = require('@nestjs/swagger');
const list_entity_1 = require('../../lists/entities/list.entity');
let Room = class Room extends typeorm_1.BaseEntity {};
__decorate(
	[
		typeorm_1.PrimaryColumn({ type: 'varchar', length: 16, readonly: true }),
		swagger_1.ApiProperty({
			required: true,
			example: 'l1fcqka1nm3fvw7j',
			description: 'Id of the room',
			readOnly: true,
		}),
		__metadata('design:type', String),
	],
	Room.prototype,
	'id',
	void 0
);
__decorate(
	[
		typeorm_1.Column({ type: 'varchar', length: 16, readonly: true }),
		swagger_1.ApiProperty({
			required: true,
			example: 'l1fcqka1nm3fvw7j',
			description: 'Id of the associated session',
			readOnly: true,
		}),
		__metadata('design:type', String),
	],
	Room.prototype,
	'sessionId',
	void 0
);
__decorate(
	[
		typeorm_1.Column({ type: 'varchar', length: 64, readonly: true }),
		swagger_1.ApiProperty({
			required: true,
			example: 'Anonymous',
			description: 'Name of the room',
			readOnly: true,
		}),
		__metadata('design:type', String),
	],
	Room.prototype,
	'name',
	void 0
);
__decorate(
	[
		typeorm_1.OneToMany(
			() => list_entity_1.List,
			(list) => list.room,
			{ cascade: true }
		),
		typeorm_1.JoinColumn(),
		swagger_1.ApiProperty({
			required: true,
			description: 'Lists associated with this room',
			type: () => [list_entity_1.List],
		}),
		__metadata('design:type', Array),
	],
	Room.prototype,
	'lists',
	void 0
);
__decorate(
	[
		typeorm_1.Column({ type: 'boolean' }),
		swagger_1.ApiProperty({
			required: true,
			example: false,
			description: 'Indicates if the room is ready',
		}),
		__metadata('design:type', Boolean),
	],
	Room.prototype,
	'ready',
	void 0
);
Room = __decorate([typeorm_1.Entity({ name: 'Room' })], Room);
exports.Room = Room;
//# sourceMappingURL=room.entity.js.map
