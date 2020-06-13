import { SessionService } from './session.service';
import { Response } from 'express';
import { CreateSessionDto } from './dto/create-session.dto';
export declare class SessionController {
    private readonly sessionService;
    constructor(sessionService: SessionService);
    create(createSessionDto: CreateSessionDto, response: Response): Promise<void>;
    find(seed: string, response: Response): Promise<void>;
    end(seed: string, response: Response): Promise<void>;
    aggregate(seed: string, response: Response): Promise<void>;
}
