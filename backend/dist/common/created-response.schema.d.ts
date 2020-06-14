import {
	SchemaObject,
	ReferenceObject,
} from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
export declare class CreatedResponseSchema implements SchemaObject {
	type: string;
	properties: Record<string, SchemaObject | ReferenceObject>;
	constructor(
		field?: string,
		type?: string,
		example?: string,
		description?: string
	);
}
