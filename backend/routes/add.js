const fetch = require('node-fetch');

module.exports = async (req, res) => {
	const main = await (await fetch(`${process.env.URL}/api/main`)).json();
	if (main.addLink !== req.params.id) {
		res.redirect('/notfound');
		return;
	}
	res.render('add.ejs');
};
