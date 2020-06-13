const AUTH = require('./routeAuth');
const ROOMS = require('./routeRooms');
const SESSION = require('./routeSession');

module.exports = {
	...ROOMS,
	...SESSION,
	...AUTH,
};
