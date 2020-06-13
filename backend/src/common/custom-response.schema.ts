import { SchemaObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';

export class CustomResponseSchema implements SchemaObject {
	type = 'object';
	example?: any;

	constructor(schema: object) {
		this.example = schema;
	}
}
