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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const session_service_1 = require("./session.service");
const common_2 = require("../../common");
const create_session_dto_1 = require("./dto/create-session.dto");
const created_response_schema_1 = require("../../common/created-response.schema");
const basic_response_schema_1 = require("../../common/basic-response.schema");
const cookies_1 = require("@nestjsplus/cookies");
const session_entity_1 = require("./entities/session.entity");
const one_of_response_schema_1 = require("../../common/one-of-response.schema");
let SessionController = class SessionController {
    constructor(sessionService) {
        this.sessionService = sessionService;
    }
    async create(createSessionDto, response) {
        try {
            const session = await this.sessionService.create(createSessionDto);
            common_2.sendResponse(response, { id: session.id }, common_1.HttpStatus.CREATED);
        }
        catch (error) {
            common_2.sendError(response, error);
        }
    }
    async find(seed, response) {
        try {
            const session = await this.sessionService.findMatching(seed);
            common_2.sendResponse(response, session);
        }
        catch (error) {
            common_2.sendError(response, error);
        }
    }
    async end(seed, response) {
        try {
            await this.sessionService.endMatching(seed);
            common_2.sendResponse(response, { status: 'OK' });
        }
        catch (error) {
            common_2.sendError(response, error);
        }
    }
    async aggregate(seed, response) {
        try {
            await this.sessionService.aggregateMatching(seed);
            common_2.sendResponse(response, { status: 'OK' });
        }
        catch (error) {
            common_2.sendError(response, error);
        }
    }
};
__decorate([
    common_1.Post(),
    swagger_1.ApiOperation({ summary: 'Creates a new session' }),
    swagger_1.ApiOkResponse({
        description: 'Created a new session',
        schema: new created_response_schema_1.CreatedResponseSchema('id', 'string', 'dasjhhjie34noi8f', 'Id of the created session'),
    }),
    swagger_1.ApiBadRequestResponse({
        description: 'Bad request',
        schema: new basic_response_schema_1.BasicResponseSchema('Session for this user already exist'),
    }),
    __param(0, common_1.Body()),
    __param(1, common_1.Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_session_dto_1.CreateSessionDto, Object]),
    __metadata("design:returntype", Promise)
], SessionController.prototype, "create", null);
__decorate([
    common_1.Get(),
    swagger_1.ApiOperation({ summary: 'Returns session matched by a seed in a cookie' }),
    swagger_1.ApiOkResponse({
        description: 'Returned session matched by a seed in a cookie',
        type: session_entity_1.Session,
    }),
    swagger_1.ApiNotFoundResponse({
        description: 'Item not found',
        schema: new one_of_response_schema_1.OneOfResponseSchema([
            new basic_response_schema_1.BasicResponseSchema('User not found'),
            new basic_response_schema_1.BasicResponseSchema('Session not found'),
        ]),
    }),
    __param(0, cookies_1.Cookies('seed')), __param(1, common_1.Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], SessionController.prototype, "find", null);
__decorate([
    common_1.Post('/end'),
    swagger_1.ApiOperation({
        summary: 'Ends a session and removes associated users froms the database',
    }),
    swagger_1.ApiOkResponse({
        description: 'Ended a session and removed associated users froms the database',
        schema: new basic_response_schema_1.BasicResponseSchema('OK'),
    }),
    swagger_1.ApiNotFoundResponse({
        description: 'Item not found',
        schema: new one_of_response_schema_1.OneOfResponseSchema([
            new basic_response_schema_1.BasicResponseSchema('User not found'),
            new basic_response_schema_1.BasicResponseSchema('Session not found'),
        ]),
    }),
    swagger_1.ApiForbiddenResponse({
        description: 'Authorization error',
        schema: new basic_response_schema_1.BasicResponseSchema('Only the creator of the session can modify it'),
    }),
    __param(0, cookies_1.Cookies('seed')), __param(1, common_1.Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], SessionController.prototype, "end", null);
__decorate([
    common_1.Patch('/aggregate'),
    swagger_1.ApiOperation({
        summary: 'Aggregates all notes from the room associated with a given session',
    }),
    swagger_1.ApiOkResponse({
        description: 'Aggregated all notes from the room associated with a given session',
        schema: new basic_response_schema_1.BasicResponseSchema('OK'),
    }),
    swagger_1.ApiNotFoundResponse({
        description: 'User not found',
        schema: new basic_response_schema_1.BasicResponseSchema('User not found'),
    }),
    swagger_1.ApiForbiddenResponse({
        description: 'Authorization error',
        schema: new basic_response_schema_1.BasicResponseSchema('Only the creator of the session can modify it'),
    }),
    __param(0, cookies_1.Cookies('seed')), __param(1, common_1.Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], SessionController.prototype, "aggregate", null);
SessionController = __decorate([
    swagger_1.ApiTags('Sessions'),
    common_1.Controller('api/v1/sessions'),
    __metadata("design:paramtypes", [session_service_1.SessionService])
], SessionController);
exports.SessionController = SessionController;
//# sourceMappingURL=session.controller.js.map