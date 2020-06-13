import { SchemaObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
export declare class CustomResponseSchema implements SchemaObject {
    type: string;
    example?: any;
    constructor(schema: object);
}
