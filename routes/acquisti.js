const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const verificaToken = require('../middlewares/verificaToken');
const Controller_acquisto = require('../controllers/controller_acquisto');
const controller_acquisto = new Controller_acquisto();

router.post("/acquistoId", verificaToken, async (req, res) => {

    let token = req.header('Authorization');
    token = token.split(" ");
    const decoded = jwt.decode(token[1], process.env.TOKEN_SECRET);
 
    const result = await controller_acquisto.acquistoPerId(decoded, req.body);
    
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

router.post("/acquistoAggiuntivo", verificaToken, async (req, res) => {

    let token = req.header('Authorization');
    token = token.split(" ");
    const decoded = jwt.decode(token[1], process.env.TOKEN_SECRET);
 
    const result = await controller_acquisto.acquistoAggiuntivo(decoded, req.body);

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




router.post("/regaloAmico/:email", verificaToken, async (req, res) => {

    let token = req.header('Authorization');
    token = token.split(" ");
    const decoded = jwt.decode(token[1], process.env.TOKEN_SECRET);
 
    const result = await controller_acquisto.regaloAmico(decoded, req.body, req.params.email);

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