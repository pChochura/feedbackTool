const cookieParser = require('cookie-parser');
const express = require('express');
const API = require('./api');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

// Return all rooms (only admin)
app.get('/api/rooms', API.adminAuth, API.getAllRooms);
// Create room (all)
app.post('/api/rooms', API.createRoom);
// Return one room (only creator)
app.get('/api/rooms/:id', API.userAuth, API.getRoomById);
// Remove one room (only admin)
app.delete('/api/rooms/:id', API.adminAuth, API.removeRoomById);
// Mark one room as ready (only creator)
app.patch('/api/rooms/:id/ready', API.userAuth, API.markRoomAsReady);
// Add note to a room (only creator)
app.patch('/api/rooms/:id/addNote', API.userAuth, API.addNoteToRoom);

// Create session (all)
app.post('/api/main', API.createMainPage);
// Lock session (only admin)
app.patch('/api/main', API.adminAuth, API.lockMainPage);
// Return session (only admin)
app.get('/api/main', API.adminAuth, API.getMainPage);
// End session (only admin)
app.post('/api/main/end', API.adminAuth, API.endSession);
// Aggregate all notes (only admin)
app.post('/api/main/agregate', API.adminAuth, API.agregateNotes);

app.listen(process.env.PORT);
