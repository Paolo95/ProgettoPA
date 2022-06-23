const Sequelize = require('sequelize');
const sequelize = new Sequelize(process.env.DB_SCHEMA || 'postgres',
    process.env.DB_USER || 'postgres',
    process.env.DB_PASSWORD || 'pa',
    {
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 5432,
        dialect: 'postgres',
        dialectOptions: {
            ssl: process.env.DB_SSL == "true"
        }
});
//const Rating = require('./Rating');
//const AutoIncrement = require('mongoose-sequence')(mongoose);
// Questo è il formato del prodotto in sequelize

const prodotto = sequelize.define('prodotto', {
    id_prodotto: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true
    },
    nome_prodotto: {
        type: Sequelize.STRING,
        allowNull: false
    },
    tipologia: {
        type: Sequelize.STRING,
        allowNull: false
    },
    anno: {
        type: Sequelize.INTEGER,
        allowNull: false
    },    
    disponibile: {
        type: Sequelize.BOOLEAN,
        allowNull: false
    }
}, {timestamps: false}
);

// Campo id_prodotto, questo plugin permette di effettuarne l'auto incremento ogni volta che viene creato un nuovo utente
//prodotto.plugin(AutoIncrement,  {inc_field: 'userID'});

module.exports = prodotto;