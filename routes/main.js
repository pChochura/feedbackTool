module.exports = (_, res) => {
	res.render('main.ejs', {
		rooms: [
			{
				name: 'Paweł',
				lists: [
					{
						name: 'Asia',
						notes: ['Notka 3'],
					},
					{
						name: 'Konrad',
						notes: ['Notka 1', 'Notka 2'],
					},
				],
				ready: true,
			},
			{
				name: 'Asia',
				lists: [
					{
						name: 'Paweł',
						notes: ['Notka 1', 'Notka 2'],
					},
					{
						name: 'Konrad',
						notes: ['Notka 1', 'Notka 2'],
					},
				],
				ready: false,
			},
			{
				name: 'Konrad',
				lists: [
					{
						name: 'Paweł',
						notes: ['Notka 1', 'Notka 2'],
					},
					{
						name: 'Asia',
						notes: ['Notka 1', 'Notka 2'],
					},
				],
				ready: false,
			},
		],
	});
};
