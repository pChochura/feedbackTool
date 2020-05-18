const fetch = require('node-fetch');

module.exports = async (req, res) => {
	let mainPage = await (await fetch('http://localhost:8080/api/main')).json();
	if (mainPage.locked) {
		res.render('root.ejs', { locked: true });
		return;
	}
	mainPage = await (await fetch('http://localhost:8080/api/main', { method: 'POST' })).json();
	res.render('root.ejs', { locked: false, link: `${req.protocol}://${req.get('host')}/${mainPage.id}` });
};
