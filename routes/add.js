const fetch = require('node-fetch');

module.exports = async (req, res) => {
    const main = await (await fetch('http://localhost:8080/api/main')).json();
    if(main.addLink !== req.params.id) {
        res.redirect('/notfound');
        return;
    }
	res.render('add.ejs');
};
