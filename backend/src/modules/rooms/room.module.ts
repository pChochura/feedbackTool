import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Room } from './entities/room.entity';
import { RoomService } from './room.service';
import { RoomController } from './room.controller';
import { SocketGateway } from '../sockets/socket.gateway';
import { AuthSoftGuard } from '../guards/auth-soft.guard';
import { UserService } from '../users/user.service';
import { User } from '../users/entities/user.entity';

@Module({
	imports: [TypeOrmModule.forFeature([Room, User])],
	providers: [RoomService, SocketGateway, AuthSoftGuard, UserService],
	controllers: [RoomController],
})
export class RoomModule { }
