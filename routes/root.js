const fetch = require('node-fetch');

module.exports = async (req, res) => {
	let mainPage = await (await fetch(`${process.env.URL}/api/main`)).json();
	if (mainPage.locked) {
		res.render('root.ejs', { locked: true });
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
