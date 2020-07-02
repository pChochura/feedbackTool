import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SessionService } from './session.service';
import { SessionController } from './session.controller';
import { Session } from './entities/session.entity';
import { Room } from '../rooms/entities/room.entity';
import { User } from '../users/entities/user.entity';
import { UserModule } from '../users/user.module';
import { SocketModule } from '../sockets/socket.module';

@Module({
	imports: [TypeOrmModule.forFeature([Session, Room, User]), UserModule, SocketModule],
	providers: [SessionService],
	controllers: [SessionController],
})
export class SessionModule { }
