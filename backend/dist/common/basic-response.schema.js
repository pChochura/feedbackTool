'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.BasicResponseSchema = void 0;
class BasicResponseSchema {
	constructor(status) {
		this.type = 'object';
		this.properties = {
			status: {
				description: 'Status of the action',
				example: status || 'OK',
				type: 'string',
			},
		};
	}
}
exports.BasicResponseSchema = BasicResponseSchema;
//# sourceMappingURL=basic-response.schema.js.map
