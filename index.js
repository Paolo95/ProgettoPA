const express = require('express');
const pg = require('pg');
const app = express();
const dotenv = require('dotenv');
dotenv.config();


app.use(express.json());
console.log('\n' + 'BACK END PA' + '\n');

//rotte importate
const usersRoute = require('./routes/prodotti');

//rotte middleware
app.use('/', usersRoute);

// server port
const port = process.env.PORT;
app.listen(port, () => console.log('Listening on port ' + port));