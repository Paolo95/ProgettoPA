const Database = require('../model/database'); //model database
const getDataCorrente = require('../functions/funzioni_temporali');

class Controller_acquisti {

    constructor(){}
    

    async acquistoPerId(decoded, datiProdotto){
    
        const utente = await Database.utente.findOne({where: { id_utente: decoded.id_utente }});
        if( ! utente) return [404, 'ERRORE: utente [' + decoded.id_utente + '] non trovato'];

        if(utente.credito<1) return [401, 'ERRORE: credito residuo insufficiente'];
        
        const prodotto = await Database.prodotto.findOne({where: { id_prodotto: datiProdotto.id_prodotto}});
        if( ! prodotto) return [404, 'ERRORE: prdotto [' + datiProdotto.id_prodotto + '] non trovato'];       
        
        const dataAcquisto = getDataCorrente();

        const acquistoSalvato = await Database.acquisto.create({ utente: utente.id_utente, prodotto: datiProdotto.id_prodotto, data_acquisto: dataAcquisto});
        if( ! acquistoSalvato) return [500, 'SERVER ERROR: impossibile salvare l\'acquisto'];
    
        // aggiorna credito residuo dell'utente
        const creditoResiduo = utente.credito-1;
        const creditoAggiornato = await Database.utente.update({ credito: creditoResiduo }, {
            where: {
              id_utente: utente.id_utente
            }
          });
        if( ! creditoAggiornato) return [500, 'SERVER ERROR: impossibile aggiornare il credito residuo'];
    
        return [200, 'SUCCESS: l\'utente [' + utente.nome + ' '+ utente.cognome +
                       '] ha acquistato con successo [' + prodotto.nome_prodotto + '], ' +
                            'il link è: ' + prodotto.link];
        
    }

}


module.exports = Controller_acquisti;