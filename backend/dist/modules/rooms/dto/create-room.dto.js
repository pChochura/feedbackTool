"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateRoomDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class CreateRoomDto {
}
__decorate([
    class_validator_1.IsString(),
    class_validator_1.Length(16, 32),
    swagger_1.ApiProperty({
        required: true,
        description: 'Unique seed created on the client side',
        example: 'l1fcqka1nm3fvw7j',
    }),
    __metadata("design:type", String)
], CreateRoomDto.prototype, "seed", void 0);
__decorate([
    class_validator_1.IsString(),
    swagger_1.ApiProperty({
        required: true,
        description: 'Name of the room',
        example: 'Anonymous',
    }),
    __metadata("design:type", String)
], CreateRoomDto.prototype, "name", void 0);
__decorate([
    class_validator_1.IsString(),
    class_validator_1.Length(16, 32),
    swagger_1.ApiProperty({
        required: true,
        description: 'Link used to create a room',
        example: 'l1fcqka1nm3fvw7j',
    }),
    __metadata("design:type", String)
], CreateRoomDto.prototype, "addLink", void 0);
exports.CreateRoomDto = CreateRoomDto;
//# sourceMappingURL=create-room.dto.js.map