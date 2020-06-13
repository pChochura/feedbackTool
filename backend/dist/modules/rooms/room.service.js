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
exports.RoomService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const room_entity_1 = require("./entities/room.entity");
const common_2 = require("../../common");
const session_entity_1 = require("../sessions/entities/session.entity");
const list_entity_1 = require("../lists/entities/list.entity");
const user_entity_1 = require("../users/entities/user.entity");
const note_entity_1 = require("../notes/entities/note.entity");
let RoomService = class RoomService {
    constructor(roomRepository) {
        this.roomRepository = roomRepository;
    }
    async create(createRoomDto) {
        const id = common_2.generateId(createRoomDto.seed);
        if (await this.roomRepository.findOne(id)) {
            throw new common_1.ConflictException('Room for this user already exist');
        }
        const session = await session_entity_1.Session.findOne({
            where: {
                addLink: createRoomDto.addLink,
            },
        });
        if (!session) {
            throw new common_1.NotFoundException('Session not found');
        }
        if (session.phase !== session_entity_1.SessionPhase.CREATION) {
            throw new common_1.BadRequestException('This action is now locked');
        }
        const user = await user_entity_1.User.findOne(id);
        if (!user) {
            await user_entity_1.User.create({ id, sessionId: session.id }).save();
        }
        const rooms = await this.roomRepository.find({
            where: {
                sessionId: session.id,
            },
        });
        rooms.forEach((room) => {
            room.lists.push(list_entity_1.List.create({
                id: common_2.generateId(),
                name: createRoomDto.name,
                notes: [],
            }));
        });
        await this.roomRepository.save(rooms);
        const room = this.roomRepository.create({
            id,
            name: createRoomDto.name,
            sessionId: session.id,
            ready: false,
            lists: [],
        });
        return room.save();
    }
    async findMatching(seed) {
        const id = common_2.generateId(seed);
        const user = await user_entity_1.User.findOne(id);
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        if (user.sessionId !== user.id) {
            throw new common_1.ForbiddenException('Only the creator of the session can access it');
        }
        if (!(await session_entity_1.Session.findOne(user.sessionId))) {
            throw new common_1.NotFoundException('Session not found');
        }
        const rooms = await this.roomRepository.find({
            where: {
                sessionId: id,
            },
        });
        return rooms;
    }
    async remove(seed, roomId) {
        const id = common_2.generateId(seed);
        const user = await user_entity_1.User.findOne(id);
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        if (user.sessionId !== user.id) {
            throw new common_1.ForbiddenException('Only the creator of the session can modify it');
        }
        const session = await session_entity_1.Session.findOne(user.sessionId);
        if (session.phase !== session_entity_1.SessionPhase.CREATION) {
            throw new common_1.BadRequestException('This action is now locked');
        }
        const room = await room_entity_1.Room.findOne(roomId);
        if (!room) {
            throw new common_1.NotFoundException('Room not found');
        }
        return await room.remove();
    }
    async setReady(seed, roomId, setRoomReadyDto) {
        const id = common_2.generateId(seed);
        const user = await user_entity_1.User.findOne(id);
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        if (user.id !== roomId && user.id !== user.sessionId) {
            throw new common_1.ForbiddenException('Only the creator of the session or room can modify it');
        }
        const session = await session_entity_1.Session.findOne(user.sessionId);
        if (session.phase !== session_entity_1.SessionPhase.CREATION) {
            throw new common_1.BadRequestException('This action is now locked');
        }
        const room = await this.roomRepository.findOne(roomId);
        if (!room) {
            throw new common_1.NotFoundException('Room not found');
        }
        room.ready = setRoomReadyDto.ready;
        return room.save();
    }
    async sumbitNote(seed, roomId, submitNoteDto) {
        const id = common_2.generateId(seed);
        const user = await user_entity_1.User.findOne(id);
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        if (user.id !== roomId) {
            throw new common_1.ForbiddenException('Only the creator of room can modify it');
        }
        const session = await session_entity_1.Session.findOne(user.sessionId);
        if (session.phase !== session_entity_1.SessionPhase.CREATION) {
            throw new common_1.BadRequestException('This action is now locked');
        }
        const room = await this.roomRepository.findOne(roomId);
        if (!room) {
            throw new common_1.NotFoundException('Room not found');
        }
        if (room.ready) {
            throw new common_1.BadRequestException('This action is now locked');
        }
        const list = room.lists.find((list) => list.id === submitNoteDto.listId);
        if (!list) {
            throw new common_1.NotFoundException('List not found');
        }
        const note = list.notes.find((note) => note.id === submitNoteDto.id);
        if (submitNoteDto.id && note) {
            note.content = submitNoteDto.note;
            note.positive = submitNoteDto.positive;
        }
        else {
            list.notes.push(note_entity_1.Note.create({
                id: common_2.generateId(),
                content: submitNoteDto.note,
                positive: submitNoteDto.positive,
            }));
        }
        return room.save();
    }
    async removeNote(seed, roomId, removeNoteDto) {
        const id = common_2.generateId(seed);
        const user = await user_entity_1.User.findOne(id);
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        if (user.id !== roomId) {
            throw new common_1.ForbiddenException('Only the creator of room can modify it');
        }
        const session = await session_entity_1.Session.findOne(user.sessionId);
        if (session.phase !== session_entity_1.SessionPhase.CREATION) {
            throw new common_1.BadRequestException('This action is now locked');
        }
        const room = await this.roomRepository.findOne(roomId);
        if (!room) {
            throw new common_1.NotFoundException('Room not found');
        }
        if (room.ready) {
            throw new common_1.BadRequestException('This action is now locked');
        }
        const list = room.lists.find((list) => list.id === removeNoteDto.listId);
        if (!list) {
            throw new common_1.NotFoundException('List not found');
        }
        const noteIndex = list.notes.findIndex((note) => note.id === removeNoteDto.id);
        if (noteIndex === -1) {
            throw new common_1.NotFoundException('Note not found');
        }
        list.notes.splice(noteIndex, 1);
        await list.save();
        return room;
    }
};
RoomService = __decorate([
    common_1.Injectable(),
    __param(0, typeorm_1.InjectRepository(room_entity_1.Room)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], RoomService);
exports.RoomService = RoomService;
//# sourceMappingURL=room.service.js.map