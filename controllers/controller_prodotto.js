const Database = require('../model/database');


class Controller_prodotto {

    constructor(){}
    

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
            return [500, 'ERRORE SERVER: Non e\' possibile soddisfare la richiesta: ' + err];
        }
    
    }

}

module.exports = Controller_prodotto;