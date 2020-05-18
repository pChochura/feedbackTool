const rooms = [
	{
		id: '23123',
		name: 'Room 1',
		lists: [
			{
				id: '123',
				name: 'List 1',
				notes: ['Note 1'],
			},
			{
				id: '321',
				name: 'List 2',
				notes: ['Note 2', 'Note 3'],
			},
		],
		ready: true,
	},
];

const main = {
	id: '123',
	locked: false,
};

module.exports = {
	main,
	rooms,
};
