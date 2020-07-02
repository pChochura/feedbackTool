import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Room } from './entities/room.entity';
import { RoomService } from './room.service';
import { RoomController } from './room.controller';
import { User } from '../users/entities/user.entity';
import { SocketModule } from '../sockets/socket.module';
import { UserModule } from '../users/user.module';

@Module({
	imports: [TypeOrmModule.forFeature([Room, User]), SocketModule, UserModule],
	providers: [RoomService],
	controllers: [RoomController],
})
export class RoomModule {}
