import { Response } from 'express';
import { User } from '../modules/users/entities/user.entity';

export interface AuthResponse<T = any> extends Response<T> {
	user?: User;
}
