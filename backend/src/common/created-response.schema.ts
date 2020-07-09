import {
	SchemaObject,
	ReferenceObject,
} from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';

export class CreatedResponseSchema implements SchemaObject {
	type = 'object';

	properties: Record<string, SchemaObject | ReferenceObject>;

	constructor(
		field?: string,
		type?: string,
		example?: any,
		description?: string
	) {
		this.properties = {
			[field || 'status']: {
				description: description || 'ID of the created entity',
				example: example || '43c781a7-ee84-4053-bb1d-1759d3b34dbb',
				type: type || 'string',
			},
		};
	}
}
