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
exports.SubmitNoteDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class SubmitNoteDto {
    constructor() {
        this.positive = true;
    }
}
__decorate([
    class_validator_1.IsString(),
    class_validator_1.Length(16, 32),
    swagger_1.ApiProperty({
        required: false,
        description: 'Id of the note to be edited. If omitted a new note will be created',
        example: 'l1fcqka1nm3fvw7j',
    }),
    __metadata("design:type", String)
], SubmitNoteDto.prototype, "id", void 0);
__decorate([
    class_validator_1.IsString(),
    class_validator_1.Length(16, 32),
    swagger_1.ApiProperty({
        required: true,
        description: 'Id of the list',
        example: 'l1fcqka1nm3fvw7j',
    }),
    __metadata("design:type", String)
], SubmitNoteDto.prototype, "listId", void 0);
__decorate([
    class_validator_1.IsString(),
    class_validator_1.Length(1, 512),
    swagger_1.ApiProperty({
        required: true,
        description: 'Content of the note',
        example: 'My awesome note',
    }),
    __metadata("design:type", String)
], SubmitNoteDto.prototype, "note", void 0);
__decorate([
    class_validator_1.IsBoolean(),
    swagger_1.ApiProperty({
        required: false,
        description: 'Indicates if the rating is positive or negative',
        example: false,
        default: true,
    }),
    __metadata("design:type", Boolean)
], SubmitNoteDto.prototype, "positive", void 0);
exports.SubmitNoteDto = SubmitNoteDto;
//# sourceMappingURL=submit-note.dto.js.map