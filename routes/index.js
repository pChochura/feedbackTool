const routeRoot = require('./root');
const routeMain = require('./main');
const routeRoom = require('./room');
const routeNotFound = require('./notFound');

module.exports = {
	root: routeRoot,
	main: routeMain,
	room: routeRoom,
	notFound: routeNotFound,
};
