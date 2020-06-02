const io = require("socket.io").io;

module.exports = {
    mainExpired: (socketId) => {
        Object.keys(io.sockets.sockets).forEach((_socketId) => {
            if (socketId !== _socketId) {
                io.to(_socketId).emit('mainExpired');
            }
        });
    },

    mainLocked: (until) => {
        io.emit('mainLocked', { until });
    },

    roomJoined: (room) => {
        io.emit('roomJoined', {
            room: {
				id: room.id,
				name: room.name,
				lists: room.lists.map((list) => ({
					name: list.name,
					count: list.notes.length,
				})),
				ready: room.ready,
            }
        });
    },

    roomChanged: (room) => {
        io.emit('roomChanged', {
            room: {
				id: room.id,
				name: room.name,
				lists: room.lists.map((list) => ({
					name: list.name,
					count: list.notes.length,
				})),
				ready: room.ready,
            }
        });
    },

    roomRemoved: (room) => {
        io.emit('roomRemoved', {
            id: room.id,
        });
    },
};
