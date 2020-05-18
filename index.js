const ROUTES = require('./routes');
const API = require('./routes/api/');
const reload = require('reload');
const express = require('express');
const app = express();

app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.static('./views'));
app.use('/styles', express.static('./styles'));
app.use('/public', express.static('./public'));

// Views
app.get(`/`, ROUTES.root);
app.get('/notFound', ROUTES.notFound);
app.get(`/:id`, ROUTES.main);
app.get('/room/:id', ROUTES.room);
app.get(`/add/:id`, ROUTES.add)

// API
app.get('/api/rooms', API.getAllRooms);
app.post('/api/rooms', API.createRoom);
app.patch('/api/rooms/regenerate', API.regenerateRoomId);

app.get('/api/rooms/:id', API.getRoomById);
app.delete('/api/rooms/:id', API.removeRoomById);
app.patch('/api/rooms/:id/regenerate', API.regenerateRoomIdById);
app.patch('/api/rooms/:id/ready', API.markRoomAsReady);

app.post('/api/main', API.createMainPage);
app.get('/api/main', API.getMainPage);
app.post('/api/main/end', API.endSession);

reload(app).then((_) => {
	// Passing PORT as a first argument to the script
	app.listen(process.argv[2]);
});
