'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.sendResponse = void 0;
function sendResponse(response, message, statusCode) {
	response.status(statusCode).json(message);
}
exports.sendResponse = sendResponse;
//# sourceMappingURL=idnex.js.map
