const fetch = require('node-fetch');

module.exports = async (req, res) => {
	const mainPage = await (await fetch('http://localhost:8080/api/main')).json();
	if (mainPage.id !== req.params.id) {
		res.redirect('/notFound');
		return;
	}
	const rooms = await (await fetch('http://localhost:8080/api/rooms')).json();
	res.render('main.ejs', { rooms, createRoom: { name: '', lists: [] } });
};
