const express = require('express');
const pg = require('pg');
const app = express();
const dotenv = require('dotenv');
dotenv.config();


app.use(express.json());
console.log('\n' + 'BACK END PA' + '\n');

//rotte importate
const rottaProdotti = require('./routes/prodotti');
const rottaAcquisti = require('./routes/acquisti');
const rottaUtenti = require('./routes/utenti');

//rotte middleware
app.use('/api/prodotti', rottaProdotti);
app.use('/api/acquisti', rottaAcquisti);
app.use('/api/utenti', rottaUtenti);

// server port
const port = process.env.PORT;
app.listen(port, () => console.log('Listening on port ' + port));