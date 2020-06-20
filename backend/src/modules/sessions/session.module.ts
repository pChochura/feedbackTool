import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SessionService } from './session.service';
import { SessionController } from './session.controller';
import { Session } from './entities/session.entity';
import { Room } from '../rooms/entities/room.entity';
import { SocketGateway } from '../sockets/socket.gateway';
import { SchedulerRegistry } from '@nestjs/schedule';
import { UserService } from '../users/user.service';
import { User } from '../users/entities/user.entity';

@Module({
	imports: [TypeOrmModule.forFeature([Session, Room, User])],
	providers: [SessionService, SocketGateway, SchedulerRegistry, UserService],
	controllers: [SessionController],
})
export class SessionModule { }
