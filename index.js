const ROUTES = require('./routes');
const reload = require('reload');
const express = require('express');
const app = express();

app.set('view engine', 'ejs');
app.use(express.static('./views'));
app.use('/styles', express.static('./styles'));

app.get('/', ROUTES.main);

reload(app).then((_) => {
	// Passing PORT as a first argument to the script
	app.listen(process.argv[2]);
});
