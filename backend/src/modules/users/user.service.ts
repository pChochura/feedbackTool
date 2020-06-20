import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { QOP_AUTH, ServerDigestAuth } from '@mreal/digest-auth';
import { CreateUserDto } from './dto/create-user.dto';
import { generateId } from '../../common';

@Injectable()
export class UserService {
    constructor(@InjectRepository(User) private readonly userRespository: Repository<User>) { }

    async getUserByAuthHeader(authHeader: string): Promise<User> {
        const incomingDigest = ServerDigestAuth.analyze(authHeader, [QOP_AUTH]);
        return this.userRespository.findOne({ email: incomingDigest.username });
    }

    async verifyBySecret(authHeader: string): Promise<boolean> {
        const incomingDigest = ServerDigestAuth.analyze(authHeader, [QOP_AUTH]);

        const user = await this.userRespository.findOne({ email: incomingDigest.username });
        if (!user) {
            return false;
        }

        const result = ServerDigestAuth.verifyBySecret(incomingDigest, user.secret, {
            method: 'POST',
            uri: '/api/v1/users',
            entryBody: '',
        });

        return result;
    }

    async login(auth?: string): Promise<string | boolean> {
        if (!auth) {
            return ServerDigestAuth.generateResponse('all').raw;
        }

        if (!(await this.verifyBySecret(auth))) {
            throw new UnauthorizedException('Bad credentials');
        }

        return true;
    }

    async create(createUserDto: CreateUserDto): Promise<User> {
        if (await this.userRespository.findOne({ email: createUserDto.email })) {
            throw new ConflictException('Such user already exist');
        }

        return this.userRespository.create({
            ...createUserDto,
            id: generateId(),
        }).save();
    }
}