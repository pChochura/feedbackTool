const { generateId } = require('./utils');
const { main, rooms } = require('./data');

module.exports = {
	getAllRooms: (_, res) => {
		res.json(
			rooms.map((room) => ({
				id: room.id,
				name: room.name,
				lists: room.lists.map((list) => ({
					name: list.name,
					count: list.notes.length,
				})),
			})),
		);
	},

	getRoomById: (req, res) => {
		const room = rooms.find((r) => r.id == req.params.id);
		if (!room) {
			res.status(404).send({
				message: 'Room not found',
			});
			return;
		}
		res.json(room);
	},

	createRoom: (req, res) => {
		const { name, seed } = req.body;

		if (!seed || !name) {
			res.status(400).send({
				message: 'You have to pass a seed and a name to create a room',
			});
			return;
		}

		if (!main.id || main.phase !== 0) {
			res.status(423).send({
				message: 'This action is now locked',
			});
			return;
		}

		const roomId = generateId(seed);

		if (rooms.find((room) => room.id === roomId)) {
			res.status(400).send({
				message: 'Please try again',
			});
			return;
		}

		rooms.forEach((room) => {
			room.lists.push({
				id: roomId,
				name,
				notes: [],
			});
			room.ready = false;
		});

		const room = {
			name,
			lists: rooms.map((room) => ({ name: room.name, notes: [], id: room.id })),
			id: roomId,
		};

		rooms.push(room);

		res.status(201).send({
			id: room.id,
		});
	},

	removeRoomById: (req, res) => {
		const roomIndex = rooms.findIndex((r) => r.id === req.params.id);
		if (roomIndex === -1) {
			res.status(404).send({
				message: 'Room not found',
			});
			return;
		}

		const removedRoom = rooms.splice(roomIndex, 1)[0];

		rooms.forEach((room) => {
			const index = room.lists.findIndex((note) => note.id === removedRoom.id);
			if (index !== -1) {
				room.lists.splice(index, 1);
			}
		});

		res.json({
			message: 'Removed',
		});
	},

	markRoomAsReady: (req, res) => {
		const room = rooms.find((r) => r.id === req.params.id);
		if (!room) {
			res.status(404).send({
				message: 'Room not found',
			});
			return;
		}

		room.ready = true;

		res.json({
			message: 'OK',
		});
	},

	addNoteToRoom: (req, res) => {
		const room = rooms.find((r) => r.id === req.params.id);
		if (!room) {
			res.status(404).send({
				message: 'Room not found',
			});
			return;
		}

		const { listId } = req.body;
		const list = room.lists.find((item) => item.id === listId);

		if (!list) {
			res.status(404).send({
				message: 'Room list not found',
			});
			return;
		}

		list.notes.push(req.body.note);

		res.json({
			message: 'OK',
		});
	},
};
