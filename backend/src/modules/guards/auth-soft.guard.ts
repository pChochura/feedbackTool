import { CanActivate, Injectable, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { LoggerService } from '../logger/logger.service';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AuthSoftGuard implements CanActivate {
	constructor() {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const request: Request = context.switchToHttp().getRequest();
		const response = context.switchToHttp().getResponse();
		const sessionToken = request.cookies['x-session'];

		try {
			const user = await User.findOne({ sessionToken });
			response.user = user;
			new LoggerService(request).info(
				'User authorized',
				{ userId: user.id },
				'auth.guard'
			);
		} catch (error) {
			return true;
		}

		return true;
	}
}
