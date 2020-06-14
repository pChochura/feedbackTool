import { Session } from './entities/session.entity';
import { Repository } from 'typeorm';
import { CreateSessionDto } from './dto/create-session.dto';
export declare class SessionService {
	private sessionRepository;
	constructor(sessionRepository: Repository<Session>);
	create(createSessionDto: CreateSessionDto): Promise<Session>;
	findMatching(seed: string): Promise<Session>;
	endMatching(seed: string): Promise<Session>;
	aggregateMatching(seed: string): Promise<Session>;
}
