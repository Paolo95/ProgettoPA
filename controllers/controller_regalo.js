const Database = require('../model/database'); //model database
const Factory = require('../functions/factoryErrori');
const factory = new Factory();

class Controller_regalo {

    constructor(){}    

    //Funzione che ritorna il link di download per un amico non registrato
    async ottieniRegalo(params){

        // CERCA nel db se è presente un acquisto (regalo amico) contenente l'email dell'amico, l'id dell'utente che ha comprato
        // il regalo, l'id del prodotto regalato e che non sia stato già stato scaricato dall'amico
        const amico = await Database.acquisto.findOne({where: { 
            mail_amico: params.email,
            utente: params.id_utente,
            prodotto: params.id_prodotto,
            download_amico: false }
        });

        if( ! amico) return factory.creaErrore({
            tipoErrore: "Not Found",
            messaggio: "ERRORE: Nessun download disponibile per [" + params.email + "]"});

        // CONTROLLO PRODOTTO DISPONIBILE: controlla se il prodotto selezionato è disponibile
        const prodotto = await Database.prodotto.findOne({where: { id_prodotto: params.id_prodotto, disponibile: true}});
        if( ! prodotto) return factory.creaErrore({
            tipoErrore: "Not Found",
            messaggio: 'ERRORE: prodotto [' + datiProdotto.id_prodotto + '] non trovato o momentaneamente non disponibile!'});       
        
        // AGGIORNAMENTO SATATO: setta lo stato del download dell'acquisto (regalo) nel db a true
        const regaloScaricato = await amico.update({ download_amico: true });
        if( ! regaloScaricato) return factory.creaErrore({
            tipoErorre: "Internal Server Error",
            messaggio: 'ERRORE SERVER: impossibile aggiornare il database!'});
        
       return [prodotto.link];  
    }    
}


module.exports = Controller_regalo;
