"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OneOfResponseSchema = void 0;
class OneOfResponseSchema {
    constructor(schemas) {
        this.type = 'object';
        const example = [];
        schemas.forEach((s) => {
            const status = s.properties.status;
            example.push({ status: status.example });
        });
        this.properties = {
            oneOf: {
                example,
            },
        };
    }
}
exports.OneOfResponseSchema = OneOfResponseSchema;
//# sourceMappingURL=one-of-response.schema.js.map