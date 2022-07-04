const express = require('express');
const app = express();
const database = require('./model/database');
const dotenv = require('dotenv');
dotenv.config();

app.use(express.json());
console.log('\n' + 'BACK END PA' + '\n');

//rotte importate
const rottaProdotti = require('./routes/prodotti');
const rottaAcquisti = require('./routes/acquisti');
const rottaUtenti = require('./routes/utenti');
const rottaRegali = require('./routes/regali');

//rotte middleware
app.use('/api/prodotti', rottaProdotti);
app.use('/api/acquisti', rottaAcquisti);
app.use('/api/utenti', rottaUtenti);
app.use('/api/regali', rottaRegali);

// porta server 
const port = process.env.PORT;
app.listen(port, () => console.log('Listening on port ' + port));


// connessione al database

connessioneDB();

async function connessioneDB(){
       
    try {

        await database.sequelize;
        console.log('Connessione stabilita correttamente');
    
        await database.sequelize.sync();
        console.log("Sincronizzazione effettuta!"); 
    } catch (error) {
        console.error('Impossibile stabilire una connessione, errore: ', error);
    }
}