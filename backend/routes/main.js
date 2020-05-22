const fetch = require('node-fetch');

module.exports = async (req, res) => {
	let mainPage = await (await fetch(`${process.env.URL}/api/main`)).json();
	if (mainPage.id !== req.params.id) {
		res.redirect('/notFound');
		return;
	}
	if (!mainPage.locked) {
		await fetch(`${process.env.URL}/api/main`, { method: 'PATCH' });
		mainPage = await (await fetch(`${process.env.URL}/api/main`)).json();
	}
	const rooms = await (await fetch(`${process.env.URL}/api/rooms`)).json();
	res.render('main.ejs', {
		rooms,
		addLink: mainPage.addLink,
		phase: mainPage.phase,
		expirationTimestamp: mainPage.expirationTimestamp,
	});
};
