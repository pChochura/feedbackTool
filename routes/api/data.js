const rooms = [
	{
		id: '23123',
		name: 'Room 1',
		lists: [
			{
				name: 'List 1',
				notes: ['Note 1'],
			},
			{
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
	addLink: '',
};

module.exports = {
	main,
	rooms,
};
