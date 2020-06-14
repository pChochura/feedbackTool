import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Room } from './entities/room.entity';
import { RoomService } from './room.service';
import { RoomController } from './room.controller';
import { SocketGateway } from '../sockets/socket.gateway';

@Module({
	imports: [TypeOrmModule.forFeature([Room])],
	providers: [RoomService, SocketGateway],
	controllers: [RoomController],
})
export class RoomModule {}
