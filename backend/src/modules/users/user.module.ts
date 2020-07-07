import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { EmailModule } from '../emails/email.module';
import { SocketModule } from '../sockets/socket.module';
import { PaypalModule } from '../paypal/paypal.module';
import { LoggerModule } from '../logger/logger.module';

@Module({
	imports: [
		TypeOrmModule.forFeature([User]),
		EmailModule,
		SocketModule,
		PaypalModule,
		LoggerModule,
	],
	controllers: [UserController],
	providers: [UserService],
	exports: [UserService],
})
export class UserModule {}
