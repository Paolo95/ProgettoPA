const Database = require('../model/database');
const Factory = require('../functions/factoryErrori');
const factory = new Factory();

class Controller_utente {

    constructor(){}
    
    //Funzione che ritorna tutti gli utenti presenti nel db
    async getUtenti(){

        try{
            const users = await Database.utente.findAll();
            return [200, users];
        }catch{
            return factory.creaErrore({
               tipoErrore: 'Internal Server Error',
               messaggio: 'ERRORE SERVER: impossibile visualizzare tutti gli utenti'});
        }
    }

    //Funzione che ritorna il credito residuo di un utente autenticato
    async getCreditoResiduo(decoded){
        
        // CONTROLLO UTENTE REGISTRATO: controlla se l'username è nel db
        const utente = await Database.utente.findOne({where: { id_utente: decoded.id_utente }});
        if( ! utente) return factory.creaErrore({
            tipoErrore: 'Not Found',
            messaggio: 'ERRORE: utente [' + decoded.id_utente + '] non trovato'});

        return [200, 'SUCCESSO: il credito residuo dell\'utente ['+ utente.nome +' '+ utente.cognome +'] e\' ['+ utente.credito +']'];
    }
    
    //Funzione che ritorna tutti gli acquisti di un utente filtrati in base al tipo (Originale/Aggiuntivo)
    async getAcquistiUtente(decoded, {tipologiaAcquisto}){
        
        // CONTROLLO UTENTE REGISTRATO: controlla se l'username è nel db
        const utente = await Database.utente.findOne({where: { id_utente: decoded.id_utente }});
        if(!utente) return factory.creaErrore({
            tipoErrore: 'Not Found',
            messaggio: 'ERRORE: utente [' + decoded.id_utente + '] non trovato'});
        
        try {         
            const acquistiUtente = await Database.acquisto.findAll({where: { utente: decoded.id_utente, originale: tipologiaAcquisto }});
            return [200, acquistiUtente];
        } catch{
            return factory.creaErrore({
                tipoErrore: 'Not Found',
                messaggio: 'ERRORE: lista degli acquisti dell\'utente ['+ utente.id_utente +'] non trovata!'});
        }        
    }

    //Funzione che ritorna un utente del DB in base all id passato in ingresso
    async getUtente(idUtente){
        
        // CONTROLLO UTENTE REGISTRATO: controlla se l'username è nel db
        const utente = await Database.utente.findOne({where: {id_utente: idUtente}});
        if( ! utente) return factory.creaErrore({
            tipoErrore: 'Not Found',
            messaggio: 'ERRORE: utente ['+ idUtente +'] non trovato'});
        else return [200, utente];
    }

    //Funzione di ricarica del credito di un utente in base alla propria email e all'importo desiderato
    async ricaricaUtente({mailUtente, importo_ricarica}){

        // CONTROLLO EMAIL: controlla se la mail inserita appartiene ad un utente registrato nel db
        const utente = await Database.utente.findOne({where: { mail: mailUtente}});
        if( ! utente) return factory.creaErrore({
            tipoErrore: 'Not Found',
            messaggio: 'ERRORE: utente ['+ mailUtente +'] non trovato'});
        
        // AGGIORNAMENTO del credito nel db
        const nuovo_credito = utente.credito + importo_ricarica;
        const creditoAggiornato = await Database.utente.update({ credito: nuovo_credito }, {
            where: {
              id_utente: utente.id_utente
            }
          });

        if( ! creditoAggiornato) return factory.creaErrore({
            tipoErrore: 'Internal Server Error',
            messaggio: 'ERRORE SERVER: impossibile ricaricare l\'accounte dell\'utente'});
    
        return [200, 'SUCCESSO: l\'utente ['+ utente.nome +' '+ utente.cognome +'] ha ricaricato con successo. Credito residuo: ['+ nuovo_credito +']'];   
    }    
}

module.exports = Controller_utente;

