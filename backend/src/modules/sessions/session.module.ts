import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SessionService } from './session.service';
import { SessionController } from './session.controller';
import { Session } from './entities/session.entity';
import { Room } from '../rooms/entities/room.entity';
import { SocketGateway } from '../sockets/socket.gateway';

@Module({
	imports: [TypeOrmModule.forFeature([Session, Room])],
	providers: [SessionService, SocketGateway],
	controllers: [SessionController],
})
export class SessionModule {}
