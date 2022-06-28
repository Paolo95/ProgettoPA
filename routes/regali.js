const express = require('express');
const router = express.Router();
const Controller_regalo = require('../controllers/controller_regalo');
const controller_regalo = new Controller_regalo();

router.post("/ottieniRegalo/:email/:id_utente/:id_prodotto", async (req, res) => {

    const result = await controller_regalo.ottieniRegalo(req.params);
    
    if(result.length === 1){
        try {
            res.download(result[0]);
        } catch{
            return res.status(404, "ERRORE: Impossibile scaricare il file");
        }
    }else{
        res.status(result[0]).json(result[1]);
    }
    
});

module.exports = router;