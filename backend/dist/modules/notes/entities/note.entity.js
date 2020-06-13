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
exports.Note = void 0;
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
const list_entity_1 = require("../../lists/entities/list.entity");
let Note = class Note extends typeorm_1.BaseEntity {
};
__decorate([
    typeorm_1.PrimaryColumn({ type: 'varchar', length: 16, readonly: true }),
    swagger_1.ApiProperty({
        required: true,
        example: 'l1fcqka1nm3fvw7j',
        description: 'Id of the note',
        readOnly: true,
    }),
    __metadata("design:type", String)
], Note.prototype, "id", void 0);
__decorate([
    typeorm_1.Column({ type: 'varchar', length: 512 }),
    swagger_1.ApiProperty({
        required: true,
        example: 'Content of the note',
        description: 'Content of the note',
    }),
    __metadata("design:type", String)
], Note.prototype, "content", void 0);
__decorate([
    typeorm_1.Column({ type: 'boolean' }),
    swagger_1.ApiProperty({
        required: true,
        example: true,
        description: 'Indicates if the rating is positive or negative',
    }),
    __metadata("design:type", Boolean)
], Note.prototype, "positive", void 0);
__decorate([
    typeorm_1.ManyToOne(() => list_entity_1.List),
    swagger_1.ApiProperty({
        required: true,
        description: 'Associated list',
        type: () => list_entity_1.List,
    }),
    __metadata("design:type", list_entity_1.List)
], Note.prototype, "list", void 0);
Note = __decorate([
    typeorm_1.Entity({ name: 'Note' })
], Note);
exports.Note = Note;
//# sourceMappingURL=note.entity.js.map