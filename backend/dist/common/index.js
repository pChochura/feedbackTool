"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateId = exports.sendError = exports.sendResponse = void 0;
const seedRandom = require("seedrandom");
const common_1 = require("@nestjs/common");
exports.sendResponse = (response, message, statusCode = common_1.HttpStatus.OK) => {
    response.status(statusCode).json(message);
};
exports.sendError = (response, error) => {
    exports.sendResponse(response, { message: (error && error.message) || 'Something went wrong' }, (error && error.status) || common_1.HttpStatus.BAD_REQUEST);
};
exports.generateId = (seed) => {
    const generator = seed ? seedRandom(seed) : seedRandom();
    return `${generator().toString(36).slice(2)}${generator()
        .toString(36)
        .slice(2)}`.slice(0, 16);
};
//# sourceMappingURL=index.js.map