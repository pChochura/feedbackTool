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
				ready: room.ready,
			}))
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

		if (!main.locked || main.phase !== 0) {
			res.status(423).send({
				message: 'This action is now locked',
			});
			return;
		}

		const roomId = generateId(seed);

		if (rooms.find((room) => room.id === roomId)) {
			res.status(400).send({
				message: 'Maybe try clearing your cookies?',
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

		require('../socket').roomJoined(room);

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

		require('../socket').roomRemoved(removedRoom);

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

		require('../socket').roomChanged(room);

		res.json({
			message: 'OK',
		});
	},

	markRoomAsNotReady: (req, res) => {
		const room = rooms.find((r) => r.id === req.params.id);
		if (!room) {
			res.status(404).send({
				message: 'Room not found',
			});
			return;
		}

		room.ready = false;

		require('../socket').roomChanged(room);

		res.json({
			message: 'OK',
		});
	},

	submitNoteToRoom: (req, res) => {
		const room = rooms.find((r) => r.id === req.params.id);
		if (!room) {
			res.status(404).send({
				message: 'Room not found',
			});
			return;
		}

		if (room.ready) {
			res.status(423).send({
				message: 'This action is now locked',
			});
			return;
		}

		const { listId, note, rate, id } = req.body;
		const list = room.lists.find((item) => item.id === listId);

		if (!list) {
			res.status(404).send({
				message: 'Room list not found',
			});
			return;
		}

		const exitstingNote = list.notes.find((note) => note.id === id);

		if (id && exitstingNote) {
			exitstingNote.note = note;
			exitstingNote.rate = rate;
		} else {
			list.notes.push({ note, rate, id: generateId() });
		}

		require('../socket').roomChanged(room);

		res.json({
			message: 'OK',
		});
	},

	removeNoteFromRoom: (req, res) => {
		const room = rooms.find((r) => r.id === req.params.id);
		if (!room) {
			res.status(404).send({
				message: 'Room not found',
			});
			return;
		}

		if (room.ready) {
			res.status(423).send({
				message: 'This action is now locked',
			});
			return;
		}

		const { listId, id } = req.body;
		const list = room.lists.find((item) => item.id === listId);

		if (!list) {
			res.status(404).send({
				message: 'Room list not found',
			});
			return;
		}

		const noteIndex = list.notes.findIndex((note) => note.id === id);

		if (noteIndex === -1) {
			res.status(404).send({
				message: 'Note not found',
			});
			return;
		}

		list.notes.splice(noteIndex, 1);

		require('../socket').roomChanged(room);

		res.json({
			message: 'OK',
		});
	},

	findMatchingRoom: (req, res) => {
		if (!main.id) {
			res.status(423).send({
				message: 'This action is now locked',
			});
			return;
		}

		const seed = req.cookies.seed;
		const id = generateId(seed);

		const room = rooms.find((room) => room.id === id);

		if (!room) {
			res.status(404).send({
				message: 'Room not found',
			});
			return;
		}

		res.json({
			id: room.id,
		});
	},
};
