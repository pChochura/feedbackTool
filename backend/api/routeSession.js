const { generateId } = require('./utils');
const { sessions, rooms } = require('./data');

module.exports = {
	createSession: (req, res) => {
		const seed = req.body.seed;

		if (!seed) {
			res.status(400).send({
				message: 'You have to pass a seed to create a session',
			});
			return;
		}

		const session = {
			id: generateId(seed),
			addLink: generateId(),
			phase: 0,
		};
		sessions.push(session);

		require('../socket').mainExpired(req.cookies.io);

		res.json({
			id: session.id,
		});
	},

	lockSession: (req, res) => {
		const id = generateId(req.cookies.seed);
		const session = sessions.find((s) => s.id === id);

		session.locked = true;
		session.expirationTimestamp = Date.now() / 1000 + 3600;

		require('../socket').mainLocked(session.expirationTimestamp);

		res.json({
			message: 'OK',
		});
	},

	getSession: (req, res) => {
		const id = generateId(req.cookies.seed);
		const session = sessions.find((s) => s.id === id);

		if (!session) {
			res.status(404).send({
				message: 'Session not found',
			});
			return;
		}

		if (!req.adminAuth) {
			res.json({
				locked: session.locked,
				expirationTimestamp: session.expirationTimestamp,
			});
			return;
		}

		if (session.expirationTimestamp <= Date.now() / 1000) {
			// Session is inactive too long
			session.locked = false;
			session.id = undefined;
			session.phase = 0;
			session.addLink = undefined;
			session.expirationTimestamp = undefined;

			// @todo: remove only rooms from the current session
			rooms.splice(0, rooms.length);
		}

		res.json(session);
	},

	endSession: (_, res) => {
		const id = generateId(req.cookies.seed);
		const session = sessions.find((s) => s.id === id);

		if (!session) {
			res.status(404).send({
				message: 'Session not found',
			});
			return;
		}

		session.locked = false;
		session.id = undefined;
		session.phase = 0;
		session.expirationTimestamp = undefined;

		// @todo: remove only rooms from the current session
		rooms.splice(0, rooms.length);

		require('../socket').endSession();

		res.json({
			message: 'OK',
		});
	},

	aggregateNotes: (_, res) => {
		// @todo: aggregate notes only from rooms from the current session
		const roomsTemp = rooms.reduce((acc, room, index) => {
			acc.push({
				id: room.id,
				name: room.name,
				ownNotes: true,
				lists: [
					{
						id: generateId(),
						name: 'Positive',
						notes: rooms.reduce((acc2, room2, index2) => {
							if (index !== index2) {
								acc2.push(...room2.lists.find((list) => list.id === room.id).notes.filter((note) => note.rate === 1));
							}
							return acc2;
						}, []),
					},
					{
						id: generateId(),
						name: 'Negative',
						notes: rooms.reduce((acc2, room2, index2) => {
							if (index !== index2) {
								acc2.push(...room2.lists.find((list) => list.id === room.id).notes.filter((note) => note.rate === -1));
							}
							return acc2;
						}, []),
					},
				],
				ready: true,
			});
			return acc;
		}, []);

		rooms.splice(0, rooms.length);
		rooms.push(...roomsTemp);

		const id = generateId(req.cookies.seed);
		const session = sessions.find((s) => s.id === id);

		if (!session) {
			res.status(404).send({
				message: 'Session not found',
			});
			return;
		}

		session.phase = 1;
		session.addLink = undefined;

		require('../socket').aggregateNotes();

		res.json({
			message: 'OK',
		});
	},

	checkAddPage: (req, res) => {
		const id = req.body.id;
		const sessionId = generateId(req.cookies.seed);
		const session = sessions.find((s) => s.id === sessionId);

		if (!session) {
			res.status(404).send({
				message: 'Session not found',
			});
			return;
		}

		res.json({
			status: id === session.addLink,
		});
	},

	findMatchingSession: (req, res) => {
		const id = generateId(req.cookies.seed);
		const session = sessions.find((s) => s.id === id);

		if (!session) {
			res.status(404).send({
				message: 'Session not found',
			});
			return;
		}

		if (!session) {
			res.status(404).send({
				message: 'Session not found',
			});
			return;
		}

		res.json({
			id: session.id,
		});
	},
};
