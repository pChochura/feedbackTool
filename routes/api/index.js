const { main, rooms } = require('./data');

const generateId = () => {
	return Math.random().toString(36).slice(2);
};

module.exports = {
	getAllRooms: (_, res) => {
		res.json(rooms);
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
		const name = req.body.name;

		const roomId = generateId();

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
				message: 'Room not found',
			});
			return;
		}

		list.notes.push(req.body.note);

		res.json({
			message: 'OK',
		});
	},

	createMainPage: (_, res) => {
		main.id = generateId();
		main.addLink = generateId();

		res.json({
			id: main.id,
		});
	},

	lockMainPage: (_, res) => {
		main.locked = true;
		main.expirationTimestamp = Date.now() / 1000 + 3600;

		res.json({
			message: 'OK',
		});
	},

	getMainPage: (_, res) => {
		if (main.expirationTimestamp <= Date.now() / 1000) {
			// Session is inactive too long
			main.locked = false;
			main.id = undefined;
			main.phase = 0;
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
