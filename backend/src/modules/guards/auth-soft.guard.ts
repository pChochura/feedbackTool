import { CanActivate, Injectable, ExecutionContext } from '@nestjs/common';
import { UserService } from '../users/user.service';
import { Request } from 'express';

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
		} catch (error) {
			return true;
		}

		return true;
	}
}
