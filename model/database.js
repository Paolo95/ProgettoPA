const { Sequelize } = require('sequelize');

let Singleton = (function () {
    let instance;

    function createInstance() {
        const sequelize = new Sequelize('progettopa', 'postgres', 'pa', {
            host: 'localhost',
            port: 5432,
            dialect: 'postgres'
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

(async () => {
    
    try {
        await Singleton.getInstance().authenticate();
        console.log('Connessione stabilita correttamente');
        } catch (error) {
        console.error('Impossibile stabilire una connesione, errore: ', error);
        }

})();

(async () => {
    
    await Singleton.getInstance().sync();
    console.log("Sincronizzazione effettuta!");

})();

const Prodotto = Singleton.getInstance().define('prodotto', {
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

const Utente = Singleton.getInstance().define('utente', {
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
        allowNull: true
    },
    indirizzo: {
        type: Sequelize.STRING,
        allowNull: true
    },
    credito: {
        type: Sequelize.INTEGER,
        allowNull: false
    }

}, { 
    timestamps: false,
    freezeTableName: true
});

const Acquisto = Singleton.getInstance().define('acquisto', {
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
    
}, { 
    timestamps: false,
    freezeTableName: true
});

module.exports = {
    sequelize: Singleton.getInstance(),
    utente: Utente,
    prodotto: Prodotto,
    acquisto: Acquisto
};