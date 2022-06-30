const Factory = require('../functions/factoryErrori');
const factory = new Factory();
const regexMail = new RegExp('[a-z0-9]+@[a-z]+\.[a-z]{2,3}');

class ValidazioneRichieste{
    
    constructor() {}

    async controlloMail(mailRichiesta) {
        console.log(mailRichiesta)
        if (!typeof mailRichiesta === "string" || !regexMail.test(mailRichiesta)){
            return factory.creaErrore({
                tipoErrore: 'Bad Request',
                messaggio: 'ERRORE: l\'email non e\' valida!'
            });
        }
    }
  
    async controlloImportoRicarica(importoRichiesta){

        if (!typeof !importoRichiesta.importo_ricarica === "number" || importoRichiesta.importo_ricarica < 0.5){
            return factory.creaErrore({
                tipoErrore: 'Bad Request',
                messaggio: 'ERRORE: l\'importo della ricarica non e\' valido!'
            });
        }
    }
}

module.exports =  ValidazioneRichieste;