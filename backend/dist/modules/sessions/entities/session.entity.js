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
exports.Session = exports.SessionPhase = void 0;
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
var SessionPhase;
(function (SessionPhase) {
    SessionPhase[SessionPhase["CREATION"] = 0] = "CREATION";
    SessionPhase[SessionPhase["AGGREGATION"] = 1] = "AGGREGATION";
})(SessionPhase = exports.SessionPhase || (exports.SessionPhase = {}));
let Session = class Session extends typeorm_1.BaseEntity {
};
__decorate([
    typeorm_1.PrimaryColumn({ type: 'varchar', length: 16, readonly: true }),
    swagger_1.ApiProperty({
        required: true,
        example: 'l1fcqka1nm3fvw7j',
        description: 'Id of the session',
        readOnly: true,
    }),
    __metadata("design:type", String)
], Session.prototype, "id", void 0);
__decorate([
    typeorm_1.Column({ length: 16, readonly: true }),
    swagger_1.ApiProperty({
        required: true,
        example: 'l1fcqka1nm3fvw7j',
        description: 'Id of the add room page',
        readOnly: true,
    }),
    __metadata("design:type", String)
], Session.prototype, "addLink", void 0);
__decorate([
    typeorm_1.Column({ type: 'integer', readonly: true }),
    swagger_1.ApiProperty({
        required: true,
        example: '1590320753',
        description: 'Timestamp indicating expiration time',
        readOnly: true,
    }),
    __metadata("design:type", Number)
], Session.prototype, "expirationTimestamp", void 0);
__decorate([
    typeorm_1.Column({ type: 'smallint', default: 0 }),
    swagger_1.ApiProperty({
        required: true,
        example: 0,
        description: 'Current phase of the session (creation / aggregation)',
        default: 0,
    }),
    __metadata("design:type", Number)
], Session.prototype, "phase", void 0);
Session = __decorate([
    typeorm_1.Entity({ name: 'Session' })
], Session);
exports.Session = Session;
//# sourceMappingURL=session.entity.js.map