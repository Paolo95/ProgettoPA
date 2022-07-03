const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');
dotenv.config();

// Uso del pattern Singleton per la gestione della connessione al Database

class Singleton{
    
    static creaSingleton = (function () {
        let instance;

        function createInstance() {
            const sequelize = new Sequelize(process.env.PG_DATABASE, process.env.PG_USER, process.env.PG_PASSWORD, {
                host: process.env.PG_HOST,
                port: process.env.PG_PORT,
                dialect: 'postgres',
                logging: false
            });
            return sequelize;
        }

        return {
            getInstance: function () {
                if (!instance) {
                    instance = createInstance();
                }
                return instance;
            }
        };
    })();


}

// Definizione del modello Sequelize del prodotto

const Prodotto = Singleton.creaSingleton.getInstance().define('prodotto', {
    id_prodotto: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
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
    prezzo: {
        type: Sequelize.INTEGER,
        allowNull: false
    },    
    disponibile: {
        type: Sequelize.BOOLEAN,
        allowNull: false
    },
    link: {
        type: Sequelize.STRING,
        allowNull: true
    },
}, { 
    timestamps: false,
    freezeTableName: true
});

// Definizione del modello Sequelize dell'utente

const Utente = Singleton.creaSingleton.getInstance().define('utente', {
    id_utente: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    username: {
        type: Sequelize.STRING,
        allowNull: false
    },
    passwd: {
        type: Sequelize.STRING,
        allowNull: false
    },
    cognome: {
        type: Sequelize.STRING,
        allowNull: false
    },
    nome: {
        type: Sequelize.STRING,
        allowNull: false
    },
    mail: {
        type: Sequelize.STRING,
        allowNull: true
    },
    ruolo: {
        type: Sequelize.STRING,
        allowNull: false
    },
    indirizzo: {
        type: Sequelize.STRING,
        allowNull: true
    },
    credito: {
        type: Sequelize.REAL,
        allowNull: false
    }

}, { 
    timestamps: false,
    freezeTableName: true
});

// Definizione del modello Sequelize dell'acquisto

const Acquisto = Singleton.creaSingleton.getInstance().define('acquisto', {
    id_acquisto: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    utente: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
            model: Utente,
            key: 'id_utente'
        }
    },
    prodotto: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
            model: Prodotto,
            key: 'id_prodotto'
        }
    },
    data_acquisto: {
        type: Sequelize.STRING,
        allowNull: false
    },
    originale: {
        type: Sequelize.BOOLEAN,
        allowNull: false
    },
    mail_amico: {
        type: Sequelize.STRING,
        allowNull: true
    },
    download_amico: {
        type: Sequelize.BOOLEAN,
        allowNull: true
    }
    
}, { 
    timestamps: false,
    freezeTableName: true
});

module.exports = {
    sequelize: Singleton.creaSingleton.getInstance(),
    utente: Utente,
    prodotto: Prodotto,
    acquisto: Acquisto
};