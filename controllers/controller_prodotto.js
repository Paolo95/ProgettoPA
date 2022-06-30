const Database = require('../model/database');
const Factory = require('../functions/factoryErrori');
const factory = new Factory();


class Controller_prodotto {

    constructor(){}
    
    //Funzione che ritorna tutti i prodotti disponibili nel db
    async getProdottiDisponibili(listParams){
        
        try{
            const prodotti = await Database.prodotto.findAll({
                where: {
                    disponibile: true,
                    tipologia: listParams.tipologia,
                    anno: listParams.anno,
                }
            });
            return [200, prodotti];
        }catch(err){
            return factory.creaErrore({
                tipoErrore: 'Internal Server Error',
                messaggio: 'ERRORE SERVER: Non e\' possibile soddisfare la richiesta: ' + err});
        }
    }
}

module.exports = Controller_prodotto;