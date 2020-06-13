import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { postgresConfig } from './modules/config/config.service';
import { SessionModule } from './modules/sessions/session.module';
import { UserModule } from './modules/users/user.module';
import { ListModule } from './modules/lists/list.module';
import { NoteModule } from './modules/notes/note.module';
import { RoomModule } from './modules/rooms/room.module';

@Module({
	imports: [
		SessionModule,
		UserModule,
		ListModule,
		NoteModule,
		RoomModule,
		ConfigModule.forRoot({ isGlobal: true }),
		TypeOrmModule.forRootAsync({
			useFactory: () => postgresConfig.getConfig(),
		}),
	],
})
export class AppModule {}
