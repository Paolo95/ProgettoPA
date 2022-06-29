const Database = require('../model/database'); //model database
const Factory = require('../functions/factoryErrori');
const factory = new Factory();

class Controller_regalo {

    constructor(){}    

    async ottieniRegalo(params){

        const amico = await Database.acquisto.findOne({where: { 
            mail_amico: params.email,
            utente: params.id_utente,
            prodotto: params.id_prodotto,
            download_amico: false }
        });
        if( ! amico) return factory.creaErrore({
            tipoErrore: "Not Found",
            messaggio: "ERRORE: Nessun download disponibile per [" + params.email + "]"});

        const prodotto = await Database.prodotto.findOne({where: { id_prodotto: params.id_prodotto, disponibile: true}});
        if( ! prodotto) return factory.creaErrore({
            tipoErrore: "Not Found",
            messaggio: 'ERRORE: prodotto [' + datiProdotto.id_prodotto + '] non trovato o momentaneamente non disponibile!'});       
        
        // aggiorna lo stato del download del regalo nel databse
        
        const regaloScaricato = await amico.update({ download_amico: true });
        if( ! regaloScaricato) return factory.creaErrore({
            tipoErorre: "Internal Server Error",
            messaggio: 'ERRORE SERVER: impossibile aggiornare il database!'});
        
       return [prodotto.link];
        
    }    

}


module.exports = Controller_regalo;
