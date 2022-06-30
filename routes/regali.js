const express = require('express');
const router = express.Router();
const Controller_regalo = require('../controllers/controller_regalo');
const controller_regalo = new Controller_regalo();
const Factory = require('../functions/factoryErrori');
const factory = new Factory();

//Rotta per effettuare il download del prodotto in regalo
router.post("/ottieniRegalo/:email/:id_utente/:id_prodotto", async (req, res) => {

    const result = await controller_regalo.ottieniRegalo(req.params);
    
    if(result.length === 1){
        try {
            res.download(result[0]);
        } catch(err){
            errore = factory.creaErrore({
                tipoErrore: 'Not Found',
                messaggio: "ERRORE: Impossibile scaricare il file: " + err});
            return res.status(errore[0]).send(errore[1]);
        }
    }else{
        res.status(result[0]).json(result[1]);
    }    
});

module.exports = router;