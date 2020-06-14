import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { List } from './entities/list.entity';

@Module({
	imports: [TypeOrmModule.forFeature([List])],
	providers: [],
	controllers: [],
})
export class ListModule {}
