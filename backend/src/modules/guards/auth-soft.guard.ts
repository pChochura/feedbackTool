import { CanActivate, Injectable, ExecutionContext } from '@nestjs/common';
import { UserService } from '../users/user.service';
import { Request } from 'express';
import { LoggerService } from '../logger/logger.service';

@Injectable()
export class AuthSoftGuard implements CanActivate {
	constructor(private readonly userService: UserService) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const request: Request = context.switchToHttp().getRequest();
		const response = context.switchToHttp().getResponse();
		const sessionToken = request.cookies['x-session'];

		try {
			const user = await this.userService.findByToken(sessionToken);
			response.user = user;
			new LoggerService(request).info('User authorized', { userId: user.id });
		} catch (error) {
			return true;
		}

		return true;
	}
}
