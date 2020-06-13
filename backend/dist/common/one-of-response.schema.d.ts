import { SchemaObject, ReferenceObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
import { BasicResponseSchema } from './basic-response.schema';
export declare class OneOfResponseSchema implements SchemaObject {
    type: string;
    properties: Record<string, SchemaObject | ReferenceObject>;
    constructor(schemas: BasicResponseSchema[]);
}
