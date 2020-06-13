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
exports.List = void 0;
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
const note_entity_1 = require("../../notes/entities/note.entity");
const room_entity_1 = require("../../rooms/entities/room.entity");
let List = class List extends typeorm_1.BaseEntity {
};
__decorate([
    typeorm_1.PrimaryColumn({ type: 'varchar', length: 16, readonly: true }),
    swagger_1.ApiProperty({
        required: true,
        example: 'l1fcqka1nm3fvw7j',
        description: "Id of the room's list",
        readOnly: true,
    }),
    __metadata("design:type", String)
], List.prototype, "id", void 0);
__decorate([
    typeorm_1.Column({ type: 'varchar', length: 64, readonly: true }),
    swagger_1.ApiProperty({
        required: true,
        example: 'Anonymous',
        description: "Name of the room's list",
        readOnly: true,
    }),
    __metadata("design:type", String)
], List.prototype, "name", void 0);
__decorate([
    typeorm_1.OneToMany(() => note_entity_1.Note, (note) => note.list, { cascade: true }),
    typeorm_1.JoinColumn(),
    swagger_1.ApiProperty({
        required: true,
        description: "Lists' notes",
        type: () => [note_entity_1.Note],
    }),
    __metadata("design:type", Array)
], List.prototype, "notes", void 0);
__decorate([
    typeorm_1.ManyToOne(() => room_entity_1.Room),
    swagger_1.ApiProperty({
        required: true,
        description: 'Associated room',
        type: () => room_entity_1.Room,
    }),
    __metadata("design:type", room_entity_1.Room)
], List.prototype, "room", void 0);
List = __decorate([
    typeorm_1.Entity({ name: 'List' })
], List);
exports.List = List;
//# sourceMappingURL=list.entity.js.map