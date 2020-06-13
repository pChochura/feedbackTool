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
exports.RoomController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const room_service_1 = require("./room.service");
const room_entity_1 = require("./entities/room.entity");
const basic_response_schema_1 = require("../../common/basic-response.schema");
const common_2 = require("../../common");
const cookies_1 = require("@nestjsplus/cookies");
const create_room_dto_1 = require("./dto/create-room.dto");
const one_of_response_schema_1 = require("../../common/one-of-response.schema");
const set_room_ready_dto_1 = require("./dto/set-room-ready.dto");
const submit_note_dto_1 = require("./dto/submit-note.dto");
const remove_note_dto_1 = require("./dto/remove-note.dto");
const custom_response_schema_1 = require("../../common/custom-response.schema");
let RoomController = class RoomController {
    constructor(roomService) {
        this.roomService = roomService;
    }
    async create(createRoomDto, response) {
        try {
            const room = await this.roomService.create(createRoomDto);
            common_2.sendResponse(response, room, common_1.HttpStatus.CREATED);
        }
        catch (error) {
            common_2.sendError(response, error);
        }
    }
    async find(seed, response) {
        try {
            const rooms = await this.roomService.findMatching(seed);
            common_2.sendResponse(response, rooms.map((room) => ({
                id: room.id,
                name: room.name,
                lists: room.lists.map((list) => ({
                    id: list.id,
                    name: list.name,
                    count: list.notes.length,
                })),
                ready: room.ready,
            })));
        }
        catch (error) {
            common_2.sendError(response, error);
        }
    }
    async remove(seed, id, response) {
        try {
            await this.roomService.remove(seed, id);
            common_2.sendResponse(response, { status: 'OK' });
        }
        catch (error) {
            common_2.sendError(response, error);
        }
    }
    async setReady(seed, id, setRoomReadyDto, response) {
        try {
            await this.roomService.setReady(seed, id, setRoomReadyDto);
            common_2.sendResponse(response, { status: 'OK' });
        }
        catch (error) {
            common_2.sendError(response, error);
        }
    }
    async submitNote(seed, id, submitNoteDto, response) {
        try {
            await this.roomService.sumbitNote(seed, id, submitNoteDto);
            common_2.sendResponse(response, { status: 'OK' });
        }
        catch (error) {
            common_2.sendError(response, error);
        }
    }
    async removeNote(seed, id, removeNoteDto, response) {
        try {
            await this.roomService.removeNote(seed, id, removeNoteDto);
            common_2.sendResponse(response, { status: 'OK' });
        }
        catch (error) {
            common_2.sendError(response, error);
        }
    }
};
__decorate([
    common_1.Post(),
    swagger_1.ApiOperation({ summary: 'Creates a room' }),
    swagger_1.ApiOkResponse({
        description: 'Created a room',
        type: room_entity_1.Room,
    }),
    swagger_1.ApiConflictResponse({
        description: 'Room for this user already exist',
        schema: new basic_response_schema_1.BasicResponseSchema('Room for this user already exist'),
    }),
    swagger_1.ApiNotFoundResponse({
        description: 'Session not found',
        schema: new basic_response_schema_1.BasicResponseSchema('Session not found'),
    }),
    swagger_1.ApiBadRequestResponse({
        description: 'This action is now locked',
        schema: new basic_response_schema_1.BasicResponseSchema('This action is now locked'),
    }),
    __param(0, common_1.Body()),
    __param(1, common_1.Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_room_dto_1.CreateRoomDto, Object]),
    __metadata("design:returntype", Promise)
], RoomController.prototype, "create", null);
__decorate([
    common_1.Get(),
    swagger_1.ApiOperation({ summary: 'Returns a matching room' }),
    swagger_1.ApiOkResponse({
        description: 'Returned a matching room',
        schema: new custom_response_schema_1.CustomResponseSchema({
            id: 'l1fcqka1nm3fvw7j',
            sessionId: 'l1fcqka1nm3fvw7j',
            name: 'Anonymous',
            lists: [
                {
                    id: 'l1fcqka1nm3fvw7j',
                    name: 'Anonymous',
                    count: 1,
                },
            ],
        }),
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
        schema: new basic_response_schema_1.BasicResponseSchema('Only the creator of the session can access it'),
    }),
    __param(0, cookies_1.Cookies('seed')), __param(1, common_1.Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], RoomController.prototype, "find", null);
__decorate([
    common_1.Delete('/:id'),
    swagger_1.ApiOperation({ summary: 'Removes the given room' }),
    swagger_1.ApiOkResponse({
        description: 'Removed the given room',
        schema: new basic_response_schema_1.BasicResponseSchema('OK'),
    }),
    swagger_1.ApiNotFoundResponse({
        description: 'Item not found',
        schema: new one_of_response_schema_1.OneOfResponseSchema([
            new basic_response_schema_1.BasicResponseSchema('User not found'),
            new basic_response_schema_1.BasicResponseSchema('Room not found'),
        ]),
    }),
    swagger_1.ApiForbiddenResponse({
        description: 'Authorization error',
        schema: new basic_response_schema_1.BasicResponseSchema('Only the creator of the session can modify it'),
    }),
    __param(0, cookies_1.Cookies('seed')),
    __param(1, common_1.Param('id')),
    __param(2, common_1.Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], RoomController.prototype, "remove", null);
__decorate([
    common_1.Patch('/:id/ready'),
    swagger_1.ApiOperation({
        summary: 'Marks the given room as ready or not (depending on the input)',
    }),
    swagger_1.ApiOkResponse({
        description: 'Marked the given room as ready or not (depending on the input)',
        schema: new basic_response_schema_1.BasicResponseSchema('OK'),
    }),
    swagger_1.ApiNotFoundResponse({
        description: 'Item not found',
        schema: new one_of_response_schema_1.OneOfResponseSchema([
            new basic_response_schema_1.BasicResponseSchema('User not found'),
            new basic_response_schema_1.BasicResponseSchema('Room not found'),
        ]),
    }),
    swagger_1.ApiForbiddenResponse({
        description: 'Authorization error',
        schema: new basic_response_schema_1.BasicResponseSchema('Only the creator of the session or room can modify it'),
    }),
    swagger_1.ApiBadRequestResponse({
        description: 'This action is now locked',
        schema: new basic_response_schema_1.BasicResponseSchema('This action is now locked'),
    }),
    __param(0, cookies_1.Cookies('seed')),
    __param(1, common_1.Param('id')),
    __param(2, common_1.Body()),
    __param(3, common_1.Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, set_room_ready_dto_1.SetRoomReadyDto, Object]),
    __metadata("design:returntype", Promise)
], RoomController.prototype, "setReady", null);
__decorate([
    common_1.Patch('/:id/note'),
    swagger_1.ApiOperation({
        summary: 'Adds a new note to the room or edits existing note',
    }),
    swagger_1.ApiOkResponse({
        description: 'Added a new note to the room or edited existing note',
        schema: new basic_response_schema_1.BasicResponseSchema('OK'),
    }),
    swagger_1.ApiNotFoundResponse({
        description: 'Item not found',
        schema: new one_of_response_schema_1.OneOfResponseSchema([
            new basic_response_schema_1.BasicResponseSchema('User not found'),
            new basic_response_schema_1.BasicResponseSchema('Room not found'),
            new basic_response_schema_1.BasicResponseSchema('List not found'),
        ]),
    }),
    swagger_1.ApiForbiddenResponse({
        description: 'Authorization error',
        schema: new basic_response_schema_1.BasicResponseSchema('Only the creator of room can modify it'),
    }),
    swagger_1.ApiBadRequestResponse({
        description: 'This action is now locked',
        schema: new basic_response_schema_1.BasicResponseSchema('This action is now locked'),
    }),
    __param(0, cookies_1.Cookies('seed')),
    __param(1, common_1.Param('id')),
    __param(2, common_1.Body()),
    __param(3, common_1.Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, submit_note_dto_1.SubmitNoteDto, Object]),
    __metadata("design:returntype", Promise)
], RoomController.prototype, "submitNote", null);
__decorate([
    common_1.Delete('/:id/note'),
    swagger_1.ApiOperation({ summary: 'Removes note from the room' }),
    swagger_1.ApiOkResponse({
        description: 'Removed note from the room',
        schema: new basic_response_schema_1.BasicResponseSchema('OK'),
    }),
    swagger_1.ApiNotFoundResponse({
        description: 'Item not found',
        schema: new one_of_response_schema_1.OneOfResponseSchema([
            new basic_response_schema_1.BasicResponseSchema('User not found'),
            new basic_response_schema_1.BasicResponseSchema('Room not found'),
            new basic_response_schema_1.BasicResponseSchema('List not found'),
            new basic_response_schema_1.BasicResponseSchema('Note not found'),
        ]),
    }),
    swagger_1.ApiForbiddenResponse({
        description: 'Authorization error',
        schema: new basic_response_schema_1.BasicResponseSchema('Only the creator of room can modify it'),
    }),
    swagger_1.ApiBadRequestResponse({
        description: 'This action is now locked',
        schema: new basic_response_schema_1.BasicResponseSchema('This action is now locked'),
    }),
    __param(0, cookies_1.Cookies('seed')),
    __param(1, common_1.Param('id')),
    __param(2, common_1.Body()),
    __param(3, common_1.Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, remove_note_dto_1.RemoveNoteDto, Object]),
    __metadata("design:returntype", Promise)
], RoomController.prototype, "removeNote", null);
RoomController = __decorate([
    swagger_1.ApiTags('Rooms'),
    common_1.Controller('api/v1/rooms'),
    __metadata("design:paramtypes", [room_service_1.RoomService])
], RoomController);
exports.RoomController = RoomController;
//# sourceMappingURL=room.controller.js.map