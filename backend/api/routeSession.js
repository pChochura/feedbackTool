const { generateId } = require('./utils');
const { main, rooms } = require('./data');

module.exports = {
	createMainPage: (req, res) => {
		const seed = req.body.seed;

		if (!seed) {
			res.status(400).send({
				message: 'You have to pass a seed to create a session',
			});
			return;
		}

		if (main.locked) {
			res.status(423).send({
				message: 'This action is now locked',
			});
			return;
		}

		main.id = generateId(seed);
		main.addLink = generateId();

		res.json({
			id: main.id,
		});
	},

	lockMainPage: (_, res) => {
		if (!main.id || main.locked) {
			res.status(423).send({
				message: 'This action is now locked',
			});
			return;
		}

		main.locked = true;
		main.expirationTimestamp = Date.now() / 1000 + 3600;

		res.json({
			message: 'OK',
		});
	},

	getMainPage: (req, res) => {
		if (!req.adminAuth) {
			res.json({
				locked: main.locked,
				expirationTimestamp: main.expirationTimestamp,
			});
			return;
		}

		if (main.expirationTimestamp <= Date.now() / 1000) {
			// Session is inactive too long
			main.locked = false;
			main.id = undefined;
			main.phase = 0;
			main.addLink = undefined;
			main.expirationTimestamp = undefined;

			rooms.splice(0, rooms.length);
		}

		res.json(main);
	},

	endSession: (_, res) => {
		main.locked = false;
		main.id = undefined;
		main.phase = 0;
		main.expirationTimestamp = undefined;

		rooms.splice(0, rooms.length);

		res.json({
			message: 'OK',
		});
	},

	agregateNotes: (_, res) => {
		const roomsTemp = [];
		rooms.forEach((room, index) => {
			const notes = [];
			rooms.forEach((room2, index2) => {
				if (index !== index2) {
					notes.push(...room2.lists.find((l) => l.id === room.id).notes);
				}
			});
			roomsTemp.push({
				id: room.id,
				name: room.name,
				lists: [
					{
						name: 'Notes',
						notes,
					},
				],
				ready: true,
			});
		});

		rooms.splice(0, rooms.length);
		rooms.push(...roomsTemp);

		main.phase = 1;
		main.addLink = undefined;

		res.json({
			message: 'OK',
		});
	},
};
