const express = require('express');

const pg = require('pg');
const app = express();

const dotenv = require('dotenv');
dotenv.config();

console.log('\n' + 'BACK END PA' + '\n');

const usersRoute = require('./routes/prodotti');

app.use('/', usersRoute);

// server port
const port = process.env.PORT;
app.listen(port, () => console.log('Listening on port ' + port));