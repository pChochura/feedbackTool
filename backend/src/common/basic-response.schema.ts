import {
	SchemaObject,
	ReferenceObject,
} from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';

export class BasicResponseSchema implements SchemaObject {
	type = 'object';
	properties: Record<string, SchemaObject | ReferenceObject>;

	constructor(status?: any) {
		this.properties = {
			status: {
				description: 'Status of the action',
				example: status || 'OK',
				type: 'string',
			},
		};
	}
}
