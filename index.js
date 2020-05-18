const express = require('express');
const ROUTES = require('./routes');
const app = express();

app.set('view engine', 'ejs');
app.use(express.static('./views'));
app.use('/styles', express.static('./styles'));

app.get('/', ROUTES.main);

// Passing PORT as a first argument to the script
app.listen(process.argv[2]);