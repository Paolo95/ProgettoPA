const Database = require('../model/database');
const sequelize = require('sequelize');

class ControllerUtente {

    constructor(){}
    

    async getUtenti(){

        try{
            const users = await Database.utente.findAll();
            return [200, users];
        }catch{
            return [500, 'SERVER ERROR: impossibile visualizzare tutti gli utenti'];
        }
    
    }

    async getCreditoResiduo(decoded){

        const utente = await Database.utente.findOne({where: { id_utente: decoded.id_utente }});
        if( ! utente) return [404, 'ERRORE: utente [' + decoded.id_utente + '] non trovato'];

        return [200, 'SUCCESS: il credito residuo dell\'utente [' + utente.nome + ' ' + utente.cognome + '] e\' ['
            + utente.credito + ']'];
    }
    
    async getAcquistiUtente(decoded){
       
        /*
            TODO: MANCA IL FILTRO PER DOWNLOAD ORIGINALE O AGGIUNTIVO
        */
        const utente = await Database.utente.findOne({where: { id_utente: decoded.id_utente }});
        if(!utente) return [404, 'ERRORE: utente [' + decoded.id_utente + '] non trovato'];
        
        try {
            const acquistiUtente = await Database.acquisto.findAll({where: { utente: decoded.id_utente }});
            return [200, acquistiUtente];
        } catch{
            return [404, 'ERRORE: lista degli acquisti dell\'utente [' + utente.id_utente + '] non trovata'];
        }
        
        
    }

    async getUtente(idUtente){
    
        const utente = await Database.utente.findOne({where: {id_utente: idUtente}});
        if( ! utente) return [404, 'ERRORE: utente [' + idUtente + '] non trovato'];
        else return [200, utente];

    }
    
/*
    async eliminaUtenti(){
    
        try{
            mongoose.connection.db.dropCollection('users');
            console.log('SUCCESS: users collection deleted');
            return [200, 'SUCCESS: users collection deleted'];
        }catch(err){
            console.log('couldn\'t drop user collection ' + err);
            return [500, 'SERVER ERROR: couldn\'t drop user collection'];
        }
    
    }

*/

/*
    async eliminaUtente(decoded, idUtente){
    
        const utente = await Database.utente.findOne({id_utente: idUtente});
        if( ! utente) return [404, 'ERRORE: utente [' + req.params.id_utente + '] non trovato'];
    //è corretto concettualmente? dove sta e quando parte isAdmin()?
        if(decoded.id_utente == idUtente) return [404, 'ERRORE: impossibile elminare, l\'utente [' + decoded.id_utente + '] non disponde dei privielgi necessari'];
    
        try{
            utente.destroy();
            return [200, 'SUCCESS: l\'amministratore [' + decoded.id_utente +'] ha eliminato l\'utente [' + idUtente + ']'];
        }catch{
            return [500, 'SERVER ERROR: impossibile eliminare l\'utetne ['+ idUtente +']'];
        }
    
    }*/

}

module.exports = ControllerUtente;

