const { generateId } = require('./utils');
const { main } = require('./data');

module.exports = {
	userAuth: (req, res, next) => {
		if (req.params.id !== generateId(req.cookies.seed)) {
			res.status(404).send({
				message: "There's nothing here",
			});
			return;
		}

		next();
	},

	adminAuth: (req, res, next) => {
		if (main.id !== generateId(req.cookies.seed)) {
			res.status(403).send({
				message: 'You cannot do that',
			});
			return;
		}

		next();
	},

	adminAuthSoft: (req, _, next) => {
		req.adminAuth = main.id === generateId(req.cookies.seed);

		next();
	},
};
