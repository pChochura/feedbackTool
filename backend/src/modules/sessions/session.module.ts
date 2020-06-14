import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SessionService } from './session.service';
import { SessionController } from './session.controller';
import { Session } from './entities/session.entity';
import { Room } from '../rooms/entities/room.entity';

@Module({
	imports: [TypeOrmModule.forFeature([Session, Room])],
	providers: [SessionService],
	controllers: [SessionController],
})
export class SessionModule {}
