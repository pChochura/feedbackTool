const express = require('express');
const app = express();

app.get('/', (req, res) => {
	res.send('Heloł dere');
});

// Passing PORT as a first argument to the script
app.listen(process.argv[2]);