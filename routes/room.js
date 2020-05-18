module.exports = (_, res) => {
	res.render('room.ejs', {
		room: {
			name: 'Asia',
			rady: true,
			lists: [
				{
					title: 'Lorem ipsum',
					notes: [
						'Lorem ipsum dolor sit amet consectetur adipisicing elit.Eos voluptatum earum.',
						'Lorem ipsum dolor sit amet consectetur adipisicing elit.Eos voluptatum earum, doloribus maiores iste facere ducimus eligendi delectus quibusdam dicta atque, necessitatibus voluptas quas nemo quod quaerat hic ab libero.Lorem, ipsum dolor sit amet consectetur adipisicing elit.',
						'Lorem ipsum dolor sit amet consectetur adipisicing elit.Eos voluptatum earum, doloribus maiores iste facere ducimus eligendi delectus quibusdam dicta atque, necessitatibus voluptas quas nemo quod quaerat hic ab libero.Lorem, ipsum dolor sit.',
					],
				},
				{
					title: 'Title',
					notes: [
						'Lorem ipsum dolor sit amet consectetur adipisicing elit.Eos voluptatum earum, doloribus maiores iste facere ducimus eligendi delectus quibusdam dicta atque, necessitatibus voluptas quas nemo quod quaerat hic ab libero. Lorem, ipsum dolor sit amet consectetur adipisicing elit.',
						'Lorem ipsum dolor sit amet consectetur adipisicing elit.Eos.',
						'Lorem ipsum dolor sit amet consectetur adipisicing elit.Eos voluptatum earum, doloribus maiores iste facere ducimus eligendi delectus quibusdam dicta atque, necessitatibus voluptas quas nemo quod quaerat hic ab libero.',
					],
				},
				{
					title: 'List title',
					notes: [
						'Lorem ipsum dolor sit amet consectetur adipisicing elit.Eos voluptatum earum, doloribus maiores iste facere ducimus eligendi delectus quibusdam dicta atque, necessitatibus voluptas quas nemo quod quaerat hic ab libero. Lorem, ipsum dolor sit amet consectetur adipisicing elit.',
						'Lorem ipsum dolor sit amet consectetur adipisicing elit.Eos voluptatum earum, doloribus maiores iste facere ducimus eligendi delectus quibusdam dicta atque, necessitatibus voluptas quas nemo quod quaerat hic ab libero.Lorem, ipsum dolor sit amet consectetur adipisicing elit.',
						'Lorem ipsum dolor sit amet consectetur adipisicing elit.Eos voluptatum earum, doloribus maiores iste facere ducimus eligendi delectus quibusdam dicta atque, necessitatibus voluptas quas nemo quod quaerat hic ab libero.Lorem, ipsum dolor sit amet consectetur adipisicing elit.',
					],
				},
				{
					title: 'Another title',
					notes: [
						'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolorem expedita porro illo, rem possimus voluptatibus facilis, fugit et quisquam, asperiores libero? Perspiciatis corporis excepturi veniam fugit corrupti quasi esse consectetur!',
						'Lorem ipsum dolor sit amet consectetur adipisicing elit.Eos voluptatum earum, doloribus maiores iste facere ducimus eligendi delectus quibusdam dicta atque, necessitatibus voluptas quas nemo quod quaerat hic ab libero.Lorem, ipsum dolor sit amet consectetur adipisicing elit.',
					],
				},
				{
					title: 'Lorem ipsum',
					notes: [
						'Lorem ipsum dolor sit amet consectetur adipisicing elit. Pariatur, sequi, velit at nesciunt iusto quo eum obcaecati modi numquam est officiis suscipit distinctio quos error ea voluptas sunt similique placeat!',
						'Lorem ipsum dolor sit amet consectetur adipisicing elit.Eos voluptatum earum, doloribus maiores iste facere ducimus eligendi delectus quibusdam dicta atque, necessitatibus voluptas quas nemo quod quaerat hic ab libero. Lorem, ipsum dolor sit amet consectetur adipisicing elit.',
						'Lorem ipsum dolor sit amet consectetur adipisicing elit. Pariatur, sequi, velit at nesciunt iusto quo eum obcaecati modi numquam est officiis suscipit distinctio quos error ea voluptas sunt similique placeat!',
						'Lorem ipsum dolor sit amet consectetur adipisicing elit.Eos voluptatum earum, doloribus maiores iste facere ducimus eligendi delectus quibusdam dicta atque, necessitatibus voluptas quas nemo quod quaerat hic ab libero.Lorem, ipsum dolor sit amet consectetur adipisicing elit.',
						'Lorem ipsum dolor sit amet consectetur adipisicing elit.',
					],
				},
				{
					title: 'Lorem ipsum',
					notes: [
						'Lorem ipsum dolor sit amet consectetur adipisicing elit. Eum minima accusantium quam officiis minus illum voluptates, delectus ratione qui unde ex cupiditate voluptatem reprehenderit debitis pariatur a at soluta nisi.',
						'Eos voluptatum earum, doloribus maiores iste facere ducimus eligendi delectus quibusdam dicta atque, necessitatibus voluptas quas nemo quod quaerat hic ab libero.Lorem, ipsum dolor sit amet consectetur adipisicing elit.',
						'Lorem ipsum dolor sit amet consectetur adipisicing elit.Eos voluptatum earum, doloribus maiores iste facere ducimus eligendi delectus quibusdam dicta atque, necessitatibus voluptas quas nemo quod quaerat hic ab libero.Lorem, ipsum dolor sit amet consectetur adipisicing elit.Lorem ipsum dolor sit amet consectetur adipisicing elit. Eum minima accusantium quam officiis minus illum voluptates, delectus ratione qui unde ex cupiditate voluptatem reprehenderit debitis pariatur a at soluta nisi.',
					],
				},
			],
		},
	});
};
