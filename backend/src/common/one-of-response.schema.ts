import {
	SchemaObject,
	ReferenceObject,
} from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
import { BasicResponseSchema } from './basic-response.schema';

export class OneOfResponseSchema implements SchemaObject {
	type = 'object';
	properties: Record<string, SchemaObject | ReferenceObject>;

	constructor(schemas: BasicResponseSchema[]) {
		const example: { [key: string]: any } = [];
		schemas.forEach((s) => {
			const status = s.properties.status;
			// @ts-ignore
			example.push({ status: status.example });
		});
		this.properties = {
			oneOf: {
				example,
			},
		};
	}
}
