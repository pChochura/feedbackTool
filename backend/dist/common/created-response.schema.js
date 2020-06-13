"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreatedResponseSchema = void 0;
class CreatedResponseSchema {
    constructor(field, type, example, description) {
        this.type = 'object';
        this.properties = {
            [field || 'status']: {
                description: description || 'ID of the created entity',
                example: example || '43c781a7-ee84-4053-bb1d-1759d3b34dbb',
                type: type || 'string',
            },
        };
    }
}
exports.CreatedResponseSchema = CreatedResponseSchema;
//# sourceMappingURL=created-response.schema.js.map