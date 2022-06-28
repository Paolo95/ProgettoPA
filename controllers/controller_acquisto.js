const Database = require('../model/database'); //model database
const getDataCorrente = require('../functions/funzioni_temporali');

class Controller_acquisti {

    constructor(){}
    

    async acquistoPerId(decoded, datiProdotto){
    
        const utente = await Database.utente.findOne({where: { id_utente: decoded.id_utente }});
        if( ! utente) return [404, 'ERRORE: utente [' + decoded.id_utente + '] non trovato'];

        if(utente.credito<1) return [401, 'ERRORE: credito residuo insufficiente'];
        
        const prodotto = await Database.prodotto.findOne({where: { id_prodotto: datiProdotto.id_prodotto, disponibile: true}});
        if( ! prodotto) return [404, 'ERRORE: prodotto [' + datiProdotto.id_prodotto + '] non trovato o momentaneamente on disponibile!'];       
        
        const dataAcquisto = getDataCorrente();
        const acquistoPresente = await Database.acquisto.findOne({where: {utente: utente.id_utente, prodotto: prodotto.id_prodotto}});
        if( ! acquistoPresente)  {
          const acquistoSalvato = await Database.acquisto.create({ utente: utente.id_utente, prodotto: datiProdotto.id_prodotto, data_acquisto: dataAcquisto, originale: true});
          if( ! acquistoSalvato) return [500, 'ERRORE SERVER: impossibile salvare l\'acquisto'];
        } else return [401, 'ERRORE: impossibile acquistare nuovamente!'];
    
        // aggiorna credito residuo dell'utente
        const creditoResiduo = utente.credito-1;
        const creditoAggiornato = await Database.utente.update({ credito: creditoResiduo }, {
            where: {
              id_utente: utente.id_utente
            }
          });
        if( ! creditoAggiornato) return [500, 'ERRORE SERVER: impossibile aggiornare il credito residuo'];
        
       return [prodotto.link];
        
    }

    async acquistoAggiuntivo(decoded, datiProdotto){
       const utente = await Database.utente.findOne({where: { id_utente: decoded.id_utente }});
       if( ! utente) return [404, 'ERRORE: utente [' + decoded.id_utente + '] non trovato'];

       if(utente.credito<1) return [401, 'ERRORE: credito residuo insufficiente'];
       
       const prodotto = await Database.prodotto.findOne({where: { id_prodotto: datiProdotto.id_prodotto, disponibile: true}});
       if( ! prodotto) return [404, 'ERRORE: prodotto [' + datiProdotto.id_prodotto + '] non trovato o momentaneamente non disponibile!'];
       
       const dataAcquisto = getDataCorrente();

       const acquistoOriginale = await Database.acquisto.findOne({where: {utente: utente.id_utente, prodotto: prodotto.id_prodotto, originale: true}});
       if( ! acquistoOriginale)  return [401, 'ERRORE: impossibile effettuare un acquisto aggiuntivo di un prodotto non acquistato precedentemente!'];
      
       const acquistoSalvato = await Database.acquisto.create({ utente: utente.id_utente, prodotto: datiProdotto.id_prodotto, data_acquisto: dataAcquisto, originale: false});
       if( ! acquistoSalvato) return [500, 'ERRORE SERVER: impossibile salvare l\'acquisto'];
      
       // aggiorna credito residuo dell'utente
       const creditoResiduo = utente.credito-1;
       const creditoAggiornato = await Database.utente.update({ credito: creditoResiduo }, {
           where: {
             id_utente: utente.id_utente
           }
         });
       if( ! creditoAggiornato) return [500, 'ERRORE SERVER: impossibile aggiornare il credito residuo'];
   
       return [prodotto.link];
    }

}


module.exports = Controller_acquisti;