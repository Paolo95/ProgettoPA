const Database = require('../model/database');
const Factory = require('../functions/factoryErrori');
const factory = new Factory();

class ControllerUtente {

    constructor(){}
    

    async getUtenti(){

        try{
            const users = await Database.utente.findAll();
            return [200, users];
        }catch{
            return [500, 'ERRORE SERVER: impossibile visualizzare tutti gli utenti'];
        }
    
    }

    async getCreditoResiduo(decoded){

        const utente = await Database.utente.findOne({where: { id_utente: decoded.id_utente }});
        if( ! utente) return [404, 'ERRORE: utente [' + decoded.id_utente + '] non trovato'];

        return [200, 'SUCCESSO: il credito residuo dell\'utente [' + utente.nome + ' ' + utente.cognome + '] e\' ['
            + utente.credito + ']'];
    }
    
    async getAcquistiUtente(decoded, {tipologiaAcquisto}){
        
        const utente = await Database.utente.findOne({where: { id_utente: decoded.id_utente }});
        if(!utente) return [404, 'ERRORE: utente [' + decoded.id_utente + '] non trovato'];
        
        try {
            const acquistiUtente = await Database.acquisto.findAll({where: { utente: decoded.id_utente, originale: tipologiaAcquisto }});
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

    async ricaricaUtente({mailUtente, importo_ricarica}){

        const utente = await Database.utente.findOne({where: { mail: mailUtente}});
        if( ! utente) return factory.creaErrore({
            tipoErrore: 'Not Found',
            messaggio: 'ERRORE: utente [' + mailUtente + '] non trovato'});
        
        const nuovo_credito = utente.credito + importo_ricarica;
        const creditoAggiornato = await Database.utente.update({ credito: nuovo_credito }, {
            where: {
              id_utente: utente.id_utente
            }
          });

        if( ! creditoAggiornato) return [500, 'ERRORE SERVER: impossibile ricaricare l\'accounte dell\'utente'];
    
        return [200, 'SUCCESSO: l\'utente [' + utente.nome + ' '+ utente.cognome +
                       '] ha ricaricato con successo. Credito residuo: [' + nuovo_credito + ']'];
    
    }
    
}

module.exports = ControllerUtente;

