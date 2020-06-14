import {
	SchemaObject,
	ReferenceObject,
} from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
export declare class BasicResponseSchema implements SchemaObject {
	type: string;
	properties: Record<string, SchemaObject | ReferenceObject>;
	constructor(status?: any);
}
