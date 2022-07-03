const Database = require("../model/database"); //model database
const FunzioniTemporali = require("../functions/funzioniTemporali");
const funzioneTemporale = new FunzioniTemporali();
const JSZip = require("jszip");
const fs = require("fs");
const Factory = require("../functions/factoryErrori");
const factory = new Factory();

class Controller_acquisto {

  constructor() {}

  //Funzione che ritorna il link del prodotto acquistato (acquisto originale) in base all'id del prodotto
  async acquistoPerId(decoded, datiProdotto) {

    // CONTROLLO UTENTE REGISTRATO: controlla se l'username è nel db
    const utente = await Database.utente.findOne({where: { id_utente: decoded.id_utente }});
    if (!utente) return factory.creaErrore({
      tipoErrore: "Not Found",
      messaggio: "ERRORE: utente [" + decoded.id_utente + "] non trovato"
    });

    // CONTROLLO PRODOTTO DISPONIBILE: controlla se il prodotto selezionato è disponibile
    const prodotto = await Database.prodotto.findOne({
      where: { id_prodotto: datiProdotto.id_prodotto, disponibile: true }
    });
    if (!prodotto) return factory.creaErrore({
      tipoErrore: "Not Found",
      messaggio: "ERRORE: prodotto ["+ datiProdotto.id_prodotto +"] non trovato o momentaneamente non disponibile!"
    });

    // CONTROLLO CREDITO SUFFICIENTE: controlla se l'utente verificato abbia abbastanza credito per l'acquisto
    if (utente.credito < prodotto.prezzo) return factory.creaErrore({
      tipoErrore: "Unauthorized",
      messaggio: "ERRORE: credito residuo insufficiente"
    });

    const dataAcquisto = funzioneTemporale.getDataCorrente();
    // CONTROLLO ACQUISTO GIA' EFFETTUATO: se già effettuato non autorizza un ulteriore acquisto/download
    const acquistoPresente = await Database.acquisto.findOne({
      where: { utente: utente.id_utente, prodotto: prodotto.id_prodotto },
    });
    if (!acquistoPresente) {
      const acquistoSalvato = await Database.acquisto.create({
        utente: utente.id_utente,
        prodotto: datiProdotto.id_prodotto,
        data_acquisto: dataAcquisto,
        originale: true,
      });
      if (!acquistoSalvato) return factory.creaErrore({
        tipoErrore: "Internal Server Error",
        messaggio: "ERRORE SERVER: impossibile salvare l'acquisto"
      });
    } else return factory.creaErrore({
      tipoErrore: "Unauthorized",
      messaggio: "ERRORE: impossibile acquistare nuovamente!",
    });

    // AGGIRNAMENTO CREDITO: aggiorna credito residuo dell'utente
    const creditoResiduo = utente.credito - prodotto.prezzo;
    const creditoAggiornato = await Database.utente.update({ credito: creditoResiduo},{ where: { id_utente: utente.id_utente }});
    if (!creditoAggiornato) return factory.creaErrore({
      tipoErrore: "Internal Server Error",
      messaggio: "ERRORE SERVER: impossibile aggiornare il credito residuo",
    });

    return [prodotto.link];
  }

  //Funzione che ritorna il link del prodotto acquistato (Aggiuntivo) in base all'id del prodotto
  async acquistoAggiuntivo(decoded, datiProdotto) {

    // CONTROLLO UTENTE REGISTRATO: controlla se l'username è nel db
    const utente = await Database.utente.findOne({where: { id_utente: decoded.id_utente }});
    if (!utente) return factory.creaErrore({
      tipoErrore: "Not Found",
      messaggio: "ERRORE: utente [" + decoded.id_utente + "] non trovato",
    });

    // CONTROLLO CREDITO SUFFICIENTE: controlla se l'utente verificato abbia abbastanza credito per l'acquisto
    if (utente.credito < 1) return factory.creaErrore({
      tipoErrore: "Unauthorized",
      messaggio: "ERRORE: credito residuo insufficiente",
    });

    // CONTROLLO PRODOTTO DISPONIBILE: controlla se il prodotto selezionato è disponibile
    const prodotto = await Database.prodotto.findOne({where: { id_prodotto: datiProdotto.id_prodotto, disponibile: true }});
    if (!prodotto) return factory.creaErrore({
      tipoErrore: "Not Found",
      messaggio: "ERRORE: prodotto ["+ datiProdotto.id_prodotto +"] non trovato o momentaneamente non disponibile!"
    });

    const dataAcquisto = funzioneTemporale.getDataCorrente();

    // CONTROLLO ACQUISTO AGGIUNTIVO: controlla se l'acquisto è effettivamente un acquisto aggiuntivo
    const acquistoOriginale = await Database.acquisto.findOne({where: {
      utente: utente.id_utente,
      prodotto: prodotto.id_prodotto,
      originale: true }
    });
    if (!acquistoOriginale) return factory.creaErrore({
      tipoErrore: "Unauthorized",
      messaggio: "ERRORE: impossibile effettuare un acquisto aggiuntivo di un prodotto non acquistato precedentemente!"
    });

    // SALVATAGGIO ACQUISTO: crea un nuovo record nel db contenente le informazioni dell'acquisto aggiuntivo
    const acquistoSalvato = await Database.acquisto.create({
      utente: utente.id_utente,
      prodotto: datiProdotto.id_prodotto,
      data_acquisto: dataAcquisto,
      originale: false
    });
    if (!acquistoSalvato) return factory.creaErrore({
      tipoErrore: "Internal Server Error",
      messaggio: "ERRORE SERVER: impossibile salvare l'acquisto"
    });

    // AGGIRNAMENTO CREDITO: aggiorna credito residuo dell'utente
    const creditoResiduo = utente.credito - 1;
    const creditoAggiornato = await Database.utente.update({ credito: creditoResiduo },{ where: { id_utente: utente.id_utente }});
    if (!creditoAggiornato) return factory.creaErrore({
      tipoErrore: "Internal Server Error",
      messaggio: "ERRORE SERVER: impossibile aggiornare il credito residuo"
    });

    return [prodotto.link];
  }

  //Funzione che ritorna il link del prodotto acquistato (regalo amico) in base all'id del prodotto e salva i dati nel db
  async regaloAmico(decoded, datiProdotto, mailAmico) {
    
    // CONTROLLO UTENTE REGISTRATO: controlla se l'username è nel db
    const utente = await Database.utente.findOne({where: { id_utente: decoded.id_utente }});
    if (!utente) return factory.creaErrore({
      tipoErrore: "Not Found",
      messaggio: "ERRORE: utente [" + decoded.id_utente + "] non trovato"
    });;

    // CONTROLLO PRODOTTO DISPONIBILE: controlla se il prodotto selezionato è disponibile
    const prodotto = await Database.prodotto.findOne({ where: { id_prodotto: datiProdotto.id_prodotto, disponibile: true }});
    if (!prodotto) return factory.creaErrore({
      tipoErrore: "Not Found",
      messaggio: "ERRORE: prodotto ["+ datiProdotto.id_prodotto +"] non trovato o momentaneamente non disponibile!"
    });

    // CONTROLLO CREDITO SUFFICIENTE: controlla se l'utente verificato abbia abbastanza credito per l'acquisto
    if (utente.credito < (prodotto.prezzo + 0.5)) return factory.creaErrore({
      tipoErrore: "Unauthorized",
      messaggio: "ERRORE: credito residuo insufficiente"
    });

    const dataAcquisto = funzioneTemporale.getDataCorrente();
    let isOriginal = false;

    // CONTROLLO ACQUISTO: controlla se l'acquisto è originale o aggiuntivo per l'utente che compra il regalo
    const acquistoOriginale = await Database.acquisto.findOne({ where: {
      utente: utente.id_utente,
      prodotto: prodotto.id_prodotto,
      originale: true }
    })
    if (!acquistoOriginale) isOriginal = true;

    // SALVATAGGIO ACQUISTO: crea un nuovo record nel db contenente le informazioni dell'acquisto (regalo amico)
    const acquistoSalvato = await Database.acquisto.create({
      utente: utente.id_utente,
      prodotto: datiProdotto.id_prodotto,
      data_acquisto: dataAcquisto,
      originale: isOriginal,
      mail_amico: mailAmico,
      download_amico: false,
    });
    if (!acquistoSalvato) return factory.creaErrore({
      tipoErrore: "Internal Server Error",
      messaggio: "ERRORE SERVER: impossibile salvare l'acquisto"
    });

    // AGGIRNAMENTO CREDITO: aggiorna credito residuo dell'utente
    const creditoResiduo = utente.credito - (prodotto.prezzo + 0.5);
    const creditoAggiornato = await Database.utente.update({ credito: creditoResiduo },{ where: { id_utente: utente.id_utente }});
    if (!creditoAggiornato) return factory.creaErrore({
      tipoErrore: "Internal Server Error",
      messaggio: "ERRORE SERVER: impossibile aggiornare il credito residuo"
    });

    return [prodotto.link];
  }

  //Funzione che ritorna lo zip dei prodotti acquistati in base agli id del prodotti
  async acquistoMultiplo(decoded, datiAcquisto) {

    // CONTROLLO UTENTE REGISTRATO: controlla se l'username è nel db
    const utente = await Database.utente.findOne({where: { id_utente: decoded.id_utente }});
    if (!utente) return factory.creaErrore({
      tipoErrore: "Not Found",
      messaggio: "ERRORE: utente [" + decoded.id_utente + "] non trovato"
    });
    
    // CONTROLLO CREDITO SUFFICIENTE: controlla se l'utente verificato abbia abbastanza credito per l'acquisto
    let prezzoTotale = 0;
    for(let i = 0; i < datiAcquisto.length; i++){
      let prodotto = await Database.prodotto.findOne({ where: { id_prodotto: datiAcquisto[i].id_prodotto, disponibile: true }});
      const acquistoPresente = await Database.acquisto.findOne({ where: { 
        utente: utente.id_utente,
        prodotto: datiAcquisto[i].id_prodotto }
      });
      if(!acquistoPresente){
        prezzoTotale += prodotto.prezzo;
      } else prezzoTotale += 1; 
    }
    if (utente.credito < prezzoTotale) return factory.creaErrore({
      tipoErrore: "Unauthorized",
      messaggio: "ERRORE: credito residuo insufficiente"
    });

    // creazione dell'oggetto JSZip dell'omonima libreria
    const zip = new JSZip();
    // CONTROLLO PRODOTTO DISPONIBILE: controlla se i prodotti selezionati sono disponibili
    for (let i = 0; i < datiAcquisto.length; i++) {
      let prodotto = await Database.prodotto.findOne({ where: { id_prodotto: datiAcquisto[i].id_prodotto, disponibile: true }});
      if (!prodotto) return factory.creaErrore({
        tipoErrore: "Not Found",
        messaggio: "ERRORE: prodotto ["+ datiAcquisto[i].id_prodotto +"] non trovato o momentaneamente non disponibile!"
      });
      // ogni prodotto disponibile viene aggiunto al file zip
      const fileFS = fs.readFileSync(prodotto.link);
      zip.file(prodotto.link, fileFS);
    }

    const dataAcquisto = funzioneTemporale.getDataCorrente();
    // CONTROLLO ACQUISTO: controlla se ogni acquisto è originale o aggiuntivo per l'utente che compra i diversi prodotti
    for (let i = 0; i < datiAcquisto.length; i++) {
      const acquistoPresente = await Database.acquisto.findOne({ where: { 
        utente: utente.id_utente,
        prodotto: datiAcquisto[i].id_prodotto }
      });
      //se l'acquisto non è presente nel db viene salvato come originale
      if (!acquistoPresente) { 
        const acquistoSalvato = await Database.acquisto.create({
          utente: utente.id_utente,
          prodotto: datiAcquisto[i].id_prodotto,
          data_acquisto: dataAcquisto,
          originale: true,
        });
        if (!acquistoSalvato) return factory.creaErrore({
          tipoErrore: "Internal Server Error",
          messaggio: "ERRORE SERVER: impossibile salvare l'acquisto",
        });
      } else {
      //altrimenti se l'acqusito è presente nel db viene salvato come aggiuntivo
        const acquistoSalvato = await Database.acquisto.create({
          utente: utente.id_utente,
          prodotto: datiAcquisto[i].id_prodotto,
          data_acquisto: dataAcquisto,
          originale: false,
        });
        if (!acquistoSalvato) return factory.creaErrore({
          tipoErrore: "Internal Server Error",
          messaggio: "ERRORE SERVER: impossibile salvare l'acquisto",
        });
      }
    }

    // AGGIRNAMENTO CREDITO: aggiorna credito residuo dell'utente
    const creditoResiduo = utente.credito - prezzoTotale;
    const creditoAggiornato = await Database.utente.update({ credito: creditoResiduo },{ where: { id_utente: utente.id_utente }});
    if (!creditoAggiornato) return factory.creaErrore({
      tipoErrore: "Internal Server Error",
      messaggio: "ERRORE SERVER: impossibile aggiornare il credito residuo",
    });

    return [zip];
  }
  //se riusciamo a gestire l'errore con il middleware
  /*async #getUtente(utenteDecoded){
    const utente = await Database.utente.findOne({where: { id_utente: utenteDecoded.id_utente }});
    if (!utente) return factory.creaErrore({
      tipoErrore: "Not Found",
      messaggio: "ERRORE: utente [" + utenteDecoded.id_utente + "] non trovato"
    });
    return utente;
  }*/
}

module.exports = Controller_acquisto;
