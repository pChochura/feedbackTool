const API = require('./routes/api/');
const reload = require('reload');
const express = require('express');
const app = express();
const cors = require('cors')
require('dotenv').config();

app.use(cors())
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.static('./views'));
app.use('/styles', express.static('./styles'));
app.use('/public', express.static('./public'));

// API
app.get('/api/rooms', API.getAllRooms);
app.post('/api/rooms', API.createRoom);

app.get('/api/rooms/:id', API.getRoomById);
app.delete('/api/rooms/:id', API.removeRoomById);
app.patch('/api/rooms/:id/ready', API.markRoomAsReady);
app.patch('/api/rooms/:id/addNote', API.addNoteToRoom);

app.post('/api/main', API.createMainPage);
app.patch('/api/main', API.lockMainPage);
app.get('/api/main', API.getMainPage);
app.post('/api/main/end', API.endSession);
app.post('/api/main/agregate', API.agregateNotes);

if (process.env.DEV) {
	reload(app).then((_) => {
		app.listen(process.env.PORT);
	});
} else {
	app.listen(process.env.PORT);
}
