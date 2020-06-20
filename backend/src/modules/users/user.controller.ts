import { Controller, Post, Res, HttpStatus, Headers, UnauthorizedException, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiOkResponse, ApiUnauthorizedResponse, ApiConflictResponse } from '@nestjs/swagger';
import { UserService } from './user.service';
import { BasicResponseSchema } from '../../common/basic-response.schema';
import { sendError, sendResponse } from '../../common';
import { Response } from 'express';
import { OneOfResponseSchema } from '../../common/one-of-response.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';

@ApiTags('Users')
@Controller('api/v1/users')
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Post()
    @ApiOperation({ summary: 'Attempts logging in' })
    @ApiOkResponse({
        description: 'Logged in',
        schema: new BasicResponseSchema('OK'),
    })
    @ApiUnauthorizedResponse({
        description: 'Unathorized',
        schema: new OneOfResponseSchema([
            new BasicResponseSchema('Missing credentials'),
            new BasicResponseSchema('Bad credentials')
        ]),
    })
    async login(@Headers() headers: any, @Res() response: Response) {
        try {
            const result = await this.userService.login(headers['authorization']);
            if (result === true) {
                sendResponse(response, { status: 'OK' }, HttpStatus.OK);

                return;
            }

            // Send header used to authorization
            response.set('WWW-Authenticate', result as string);
            throw new UnauthorizedException('Missing credentials');
        } catch (error) {
            sendError(response, error);
        }
    }

    @Post('/create')
    @ApiOperation({ summary: 'Creates a new user' })
    @ApiOkResponse({
        description: 'Created a new user',
        type: User,
    })
    @ApiConflictResponse({
        description: 'Such user already exist',
        schema: new BasicResponseSchema('Such user already exist'),
    })
    async create(@Body() createUserDto: CreateUserDto, @Res() response: Response) {
        try {
            const user = await this.userService.create(createUserDto);
            sendResponse(response, user, HttpStatus.CREATED);
        } catch (error) {
            sendError(response, error);
        }
    }
}