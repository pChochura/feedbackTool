const nodemailer = require('nodemailer');
const { generateId, composeEmail } = require('./utils');
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

		require('../socket').mainExpired(req.cookies.io);

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

		require('../socket').mainLocked(main.expirationTimestamp);

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
		if (!main.id || !main.locked) {
			res.status(423).send({
				message: 'This action is now locked',
			});
			return;
		}

		main.locked = false;
		main.id = undefined;
		main.phase = 0;
		main.expirationTimestamp = undefined;

		rooms.splice(0, rooms.length);

		require('../socket').endSession();

		res.json({
			message: 'OK',
		});
	},

	aggregateNotes: (_, res) => {
		if (!main.id || !main.locked) {
			res.status(423).send({
				message: 'This action is now locked',
			});
			return;
		}

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
								acc2.push(
									...room2.lists
										.find((list) => list.id === room.id)
										.notes.filter((note) => note.rate === 1)
								);
							}
							return acc2;
						}, []),
					},
					{
						id: generateId(),
						name: 'Negative',
						notes: rooms.reduce((acc2, room2, index2) => {
							if (index !== index2) {
								acc2.push(
									...room2.lists
										.find((list) => list.id === room.id)
										.notes.filter((note) => note.rate === -1)
								);
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

		main.phase = 1;
		main.addLink = undefined;

		require('../socket').aggregateNotes();

		res.json({
			message: 'OK',
		});
	},

	checkAddPage: (req, res) => {
		const id = req.body.id;

		if (!main.id) {
			res.status(423).send({
				message: 'This action is now locked',
			});
			return;
		}

		res.json({
			status: id === main.addLink,
		});
	},

	findMatchingSession: (req, res) => {
		if (!main.id) {
			res.status(423).send({
				message: 'This action is now locked',
			});
			return;
		}

		const seed = req.cookies.seed;
		const id = generateId(seed);

		if (main.id !== id) {
			res.status(404).send({
				message: 'Session not found',
			});
			return;
		}

		res.json({
			id: main.id,
		});
	},

	sendEmail: async (req, res) => {
		const { from, content } = req.body;

		if (!content) {
			res.status(400).send({
				message: 'You have to pass a content of the email to send feedback',
			});
			return;
		}

		const transporter = nodemailer.createTransport({
			host: process.env.SMTP_HOST,
			port: process.env.SMTP_PORT,
			auth: {
				user: process.env.SMTP_USER,
				pass: process.env.SMTP_PASS,
			},
		});

		const info = await transporter.sendMail({
			from: from || 'anonymous@ft.tech',
			to: process.env.EMAIL,
			subject: `Feedback - FeedbackTool from ${from || 'anonymous@ft.tech'}`,
			text: content,
			html: composeEmail(from || 'anonymous@ft.tech', content),
		});

		res.status(200).json({
			status: 'OK',
		});
	},
};
