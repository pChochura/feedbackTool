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
exports.SessionService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const session_entity_1 = require("./entities/session.entity");
const typeorm_2 = require("typeorm");
const common_2 = require("../../common");
const user_entity_1 = require("../users/entities/user.entity");
let SessionService = class SessionService {
    constructor(sessionRepository) {
        this.sessionRepository = sessionRepository;
    }
    async create(createSessionDto) {
        const id = common_2.generateId(createSessionDto.seed);
        if (!(await this.sessionRepository.findOne(id))) {
            throw new common_1.BadRequestException('Session for this user already exist');
        }
        const user = await user_entity_1.User.findOne(id);
        if (!user) {
            await user_entity_1.User.create({ id, sessionId: id }).save();
        }
        const session = this.sessionRepository.create({
            id,
            addLink: common_2.generateId(),
            expirationTimestamp: Math.floor(Date.now() / 1000 + 3600),
        });
        return session.save();
    }
    async findMatching(seed) {
        const id = common_2.generateId(seed);
        const user = await user_entity_1.User.findOne(id);
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        const session = await this.sessionRepository.findOne(user.sessionId);
        if (!session) {
            throw new common_1.NotFoundException('Session not found');
        }
        return session;
    }
    async endMatching(seed) {
        const id = common_2.generateId(seed);
        const user = await user_entity_1.User.findOne(id);
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        if (user.id !== user.sessionId) {
            throw new common_1.ForbiddenException('Only the creator of the session can modify it');
        }
        const session = await this.sessionRepository.findOne(user.sessionId);
        if (!session) {
            throw new common_1.NotFoundException('Session not found');
        }
        const users = await user_entity_1.User.find({
            where: {
                sessionId: id,
            },
        });
        await user_entity_1.User.remove(users);
        return this.sessionRepository.remove(session);
    }
    async aggregateMatching(seed) {
        const id = common_2.generateId(seed);
        const user = await user_entity_1.User.findOne(id);
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        if (user.id !== user.sessionId) {
            throw new common_1.ForbiddenException('Only the creator of the session can modify it');
        }
        const session = await this.sessionRepository.findOne(user.sessionId);
        session.phase = session_entity_1.SessionPhase.AGGREGATION;
        return session.save();
    }
};
SessionService = __decorate([
    common_1.Injectable(),
    __param(0, typeorm_1.InjectRepository(session_entity_1.Session)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], SessionService);
exports.SessionService = SessionService;
//# sourceMappingURL=session.service.js.map