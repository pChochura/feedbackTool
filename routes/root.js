const fetch = require('node-fetch');

module.exports = async (req, res) => {
	let mainPage = await (await fetch(`${process.env.URL}/api/main`)).json();
	if (mainPage.locked) {
		const date = new Date(mainPage.expirationTimestamp * 1000);
		const hours =
			date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
		const minutes =
			date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
		const seconds =
			date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
		res.render('root.ejs', {
			locked: true,
			date: `${hours}:${minutes}:${seconds}`,
		});
		return;
	}
	mainPage = await (
		await fetch(`${process.env.URL}/api/main`, { method: 'POST' })
	).json();
	res.render('root.ejs', {
		locked: false,
		link: `${req.protocol}://${req.get('host')}/${mainPage.id}`,
	});
};
