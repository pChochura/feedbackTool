const fetch = require('node-fetch');

module.exports = async (req, res) => {
	const mainPage = await (await fetch(`${process.env.URL}/api/main`)).json();
	if (mainPage.id !== req.params.id) {
		res.redirect('/notFound');
		return;
	}
	await fetch(`${process.env.URL}/api/main`, { method: 'PATCH' });
	const rooms = await (await fetch(`${process.env.URL}/api/rooms`)).json();
	res.render('main.ejs', {
		rooms,
		createRoom: { name: '', lists: [] },
		addLink: mainPage.addLink,
		phase: rooms.length < 1 ? 1 : mainPage.phase,
	});
};
