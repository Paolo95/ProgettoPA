const Database = require('../model/database'); //model database
const getDataCorrente = require('../functions/funzioni_temporali');
const JSZip = require('jszip');
const fs = require('fs');
const Factory = require('../functions/factoryErrori');
const factory = new Factory();

class Controller_acquisto {

    constructor(){}
    

    async acquistoPerId(decoded, datiProdotto){
    
        const utente = await Database.utente.findOne({where: { id_utente: decoded.id_utente }});
        if( ! utente) return factory.creaErrore({
          tipoErrore: 'Not Found',
          messaggio: 'ERRORE: utente [' + decoded.id_utente + '] non trovato'});

        if(utente.credito<1) return factory.creaErrore({
          tipoErrore: 'Unauthorized',
          messaggio: 'ERRORE: credito residuo insufficiente'});
        
        const prodotto = await Database.prodotto.findOne({where: { id_prodotto: datiProdotto.id_prodotto, disponibile: true}});
        if( ! prodotto) return factory.creaErrore({
          tipoErrore: 'Not Found',
          messaggio: 'ERRORE: prodotto [' + datiProdotto.id_prodotto + '] non trovato o momentaneamente non disponibile!'});       
        
        const dataAcquisto = getDataCorrente();
        const acquistoPresente = await Database.acquisto.findOne({where: {utente: utente.id_utente, prodotto: prodotto.id_prodotto}});
        if( ! acquistoPresente)  {
          const acquistoSalvato = await Database.acquisto.create({ utente: utente.id_utente, prodotto: datiProdotto.id_prodotto, data_acquisto: dataAcquisto, originale: true});
          if( ! acquistoSalvato) return factory.creaErrore({
            tipoErrore: 'Internal Server Error',
            messaggio: 'ERRORE SERVER: impossibile salvare l\'acquisto'});
        } else return factory.creaErrore({
          tipoErrore: 'Unauthorized',
          messaggio: 'ERRORE: impossibile acquistare nuovamente!'});
    
        // aggiorna credito residuo dell'utente
        const creditoResiduo = utente.credito-1;
        const creditoAggiornato = await Database.utente.update({ credito: creditoResiduo }, {
            where: {
              id_utente: utente.id_utente
            }
          });
        if( ! creditoAggiornato) return factory.creaErrore({
          tipoErrore: 'Internal Server Error',
          messaggio: 'ERRORE SERVER: impossibile aggiornare il credito residuo'});
        
      return [prodotto.link];
        
  }

  async acquistoAggiuntivo(decoded, datiProdotto){
    const utente = await Database.utente.findOne({where: { id_utente: decoded.id_utente }});
    if( ! utente) return factory.creaErrore({
      tipoErrore: 'Not Found',
      messaggio: 'ERRORE: utente [' + decoded.id_utente + '] non trovato'});

    if(utente.credito<1) return factory.creaErrore({
      tipoErrore: 'Unauthorized',
      messaggio: 'ERRORE: credito residuo insufficiente'});
    
    const prodotto = await Database.prodotto.findOne({where: { id_prodotto: datiProdotto.id_prodotto, disponibile: true}});
    if( ! prodotto) return factory.creaErrore({
      tipoErrore: 'Not Found',
      messaggio: 'ERRORE: prodotto [' + datiProdotto.id_prodotto + '] non trovato o momentaneamente non disponibile!'});
    
    const dataAcquisto = getDataCorrente();

    const acquistoOriginale = await Database.acquisto.findOne({where: {utente: utente.id_utente, prodotto: prodotto.id_prodotto, originale: true}});
    if( ! acquistoOriginale)  return factory.creaErrore({
      tipoErrore: 'Unauthorized',
      messaggio: 'ERRORE: impossibile effettuare un acquisto aggiuntivo di un prodotto non acquistato precedentemente!'});
  
    const acquistoSalvato = await Database.acquisto.create({ utente: utente.id_utente, prodotto: datiProdotto.id_prodotto, data_acquisto: dataAcquisto, originale: false});
    if( ! acquistoSalvato) return factory.creaErrore({
      tipoErrore: 'Internal Server Error',
      messaggio: 'ERRORE SERVER: impossibile salvare l\'acquisto'});
  
    // aggiorna credito residuo dell'utente
    const creditoResiduo = utente.credito-1;
    const creditoAggiornato = await Database.utente.update({ credito: creditoResiduo }, {
        where: {
          id_utente: utente.id_utente
        }
      });
    if( ! creditoAggiornato) return factory.creaErrore({
      tipoErrore: 'Internal Server Error',
      messaggio: 'ERRORE SERVER: impossibile aggiornare il credito residuo'});

    return [prodotto.link];
  }

  async regaloAmico(decoded, datiProdotto, mailAmico){

    const utente = await Database.utente.findOne({where: { id_utente: decoded.id_utente }});
    if( ! utente) return factory.creaErrore({
      tipoErrore: 'Not Found',
      messaggio: 'ERRORE: utente [' + decoded.id_utente + '] non trovato'});

    if(utente.credito<1.5) return factory.creaErrore({
      tipoErrore: 'Unauthorized',
      messaggio: 'ERRORE: credito residuo insufficiente'});
    
    const prodotto = await Database.prodotto.findOne({where: { id_prodotto: datiProdotto.id_prodotto, disponibile: true}});
    if( ! prodotto) return factory.creaErrore({
      tipoErrore: 'Not Found',
      messaggio: 'ERRORE: prodotto [' + datiProdotto.id_prodotto + '] non trovato o momentaneamente non disponibile!'});
    
    const dataAcquisto = getDataCorrente();
    let isOriginal = false;

    const acquistoOriginale = await Database.acquisto.findOne({where: {
        utente: utente.id_utente,
        prodotto: prodotto.id_prodotto,
        originale: true}
      });
    if( ! acquistoOriginale) isOriginal = true;
    
    console.log(mailAmico);

    const acquistoSalvato = await Database.acquisto.create({ 
        utente: utente.id_utente, 
        prodotto: datiProdotto.id_prodotto,
        data_acquisto: dataAcquisto, 
        originale: isOriginal,
        mail_amico: mailAmico,
        download_amico: false
    });

    if( ! acquistoSalvato) return factory.creaErrore({
      tipoErrore: 'Internal Server Error',
      messaggio: 'ERRORE SERVER: impossibile salvare l\'acquisto'});
    
    // aggiorna credito residuo dell'utente
    const creditoResiduo = utente.credito-1.5;
    const creditoAggiornato = await Database.utente.update({ credito: creditoResiduo }, {
        where: {
          id_utente: utente.id_utente
        }
      });
    if( ! creditoAggiornato) return factory.creaErrore({
      tipoErrore: 'Internal Server Error',
      messaggio: 'ERRORE SERVER: impossibile aggiornare il credito residuo'});
  
    return [prodotto.link];
  }

  async acquistoMultiplo(decoded, datiAcquisto){

    const utente = await Database.utente.findOne({where: { id_utente: decoded.id_utente }});
    if( ! utente) return factory.creaErrore({
      tipoErrore: 'Not Found',
      messaggio: 'ERRORE: utente [' + decoded.id_utente + '] non trovato'});
    
    if(utente.credito<datiAcquisto.length) return factory.creaErrore({
      tipoErrore: 'Unauthorized',
      messaggio: 'ERRORE: credito residuo insufficiente'});

    const zip = new JSZip();
    
    for(let i = 0; i < datiAcquisto.length; i++){
      let prodotto = await Database.prodotto.findOne({where: { id_prodotto: datiAcquisto[i].id_prodotto, disponibile: true}});
      if(! prodotto) return factory.creaErrore({
        tipoErrore: 'Not Found',
        messaggio: 'ERRORE: prodotto [' + datiAcquisto[i].id_prodotto + '] non trovato o momentaneamente non disponibile!'});

      const fileFS = fs.readFileSync(prodotto.link);
      zip.file(prodotto.link, fileFS);
    }
      
    const dataAcquisto = getDataCorrente();

    for(let i = 0; i < datiAcquisto.length; i++){

      const acquistoPresente = await Database.acquisto.findOne({where: {utente: utente.id_utente, prodotto: datiAcquisto[i].id_prodotto}});
      if( ! acquistoPresente)  {
        const acquistoSalvato = await Database.acquisto.create({ utente: utente.id_utente, prodotto: datiAcquisto[i].id_prodotto, data_acquisto: dataAcquisto, originale: true});
        if( ! acquistoSalvato) return factory.creaErrore({
          tipoErrore: 'Internal Server Error',
          messaggio: 'ERRORE SERVER: impossibile salvare l\'acquisto'});
      } else {
        const acquistoSalvato = await Database.acquisto.create({ utente: utente.id_utente, prodotto: datiAcquisto[i].id_prodotto, data_acquisto: dataAcquisto, originale: false});
        if( ! acquistoSalvato) return factory.creaErrore({
          tipoErrore: 'Internal Server Error',
          messaggio: 'ERRORE SERVER: impossibile salvare l\'acquisto'});
      }
    }

    // aggiorna credito residuo dell'utente
    const creditoResiduo = utente.credito-datiAcquisto.length;
    const creditoAggiornato = await Database.utente.update({ credito: creditoResiduo }, {
        where: {
          id_utente: utente.id_utente
        }
      });
    if( ! creditoAggiornato) return factory.creaErrore({
      tipoErrore: 'Internal Server Error',
      messaggio: 'ERRORE SERVER: impossibile aggiornare il credito residuo'});

    return [zip];    
  }
}


module.exports = Controller_acquisto;