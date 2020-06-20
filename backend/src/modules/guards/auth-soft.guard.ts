import { CanActivate, Injectable, ExecutionContext } from '@nestjs/common';
import { UserService } from '../users/user.service';

@Injectable()
export class AuthSoftGuard implements CanActivate {

    constructor(private readonly userService: UserService) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const response: Response = context.switchToHttp().getResponse();
        const user = await this.userService.getUserByAuthHeader(request.get('authorization'));

        response.headers.set('x-premium-user', user.premiumSessionsLeft || 0 > 0 ? 'true' : 'false');

        return true;
    }
}
