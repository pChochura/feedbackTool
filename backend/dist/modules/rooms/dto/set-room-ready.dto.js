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
exports.SetRoomReadyDto = void 0;
const class_validator_1 = require('class-validator');
const swagger_1 = require('@nestjs/swagger');
class SetRoomReadyDto {
	constructor() {
		this.ready = true;
	}
}
__decorate(
	[
		class_validator_1.IsBoolean(),
		swagger_1.ApiProperty({
			required: false,
			description: 'Indicates if the room have to be marked as ready or not',
			example: false,
			default: true,
		}),
		__metadata('design:type', Boolean),
	],
	SetRoomReadyDto.prototype,
	'ready',
	void 0
);
exports.SetRoomReadyDto = SetRoomReadyDto;
//# sourceMappingURL=set-room-ready.dto.js.map
