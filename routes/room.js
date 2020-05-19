const fetch = require('node-fetch');

module.exports = async (req, res) => {
	const room = await (
		await fetch(`${process.env.URL}/api/rooms/${req.params.id}`)
	).json();
	if (!room.id) {
		res.redirect('/notFound');
		return;
	}
	res.render('room.ejs', { room });
};
