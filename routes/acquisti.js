const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const verificaToken = require('../middlewares/verificaToken');
const Controller_acquisto = require('../controllers/controller_acquisto');
const controller_acquisto = new Controller_acquisto();
const JSZip = require('jszip');
const fs = require('fs');
const Factory = require('../functions/factoryErrori');
const factory = new Factory();
const ValidazioneRichieste = require('../functions/validazioneRichieste');
const validazioneRichieste = new ValidazioneRichieste();

//Rotta per effettuare l'acquisto di un prodotto originale tramite ID (dati utente passati tramite il token,
//dati prodotto passati tramite il body della richiesta)
router.post("/acquistoId", verificaToken, async (req, res) => {

    //decodifica del token; token = (id_utente, username, mail, ruolo)
    let token = req.header('Authorization');
    token = token.split(" ");
    const decoded = jwt.decode(token[1], process.env.TOKEN_SECRET);
 
    const result = await controller_acquisto.acquistoPerId(decoded, req.body);
    
    if(result.length === 1){
        try {
            res.download(result[0]);
        } catch{
            errore = factory.creaErrore({
                tipoErrore: 'Internal Server Error',
                messaggio: 'ERRORE SERVER: Impossibile scaricare il file'});
            return res.status(errore[0]).send(errore[1]);
        }
    }else{
        res.status(result[0]).json(result[1]);
    } 
});

//Rotta per effettuare l'acquisto aggiuntivo di un prodotto originale tramite ID (dati utente passati tramite il token,
//dati prodotto passati tramite il body della richiesta)
router.post("/acquistoAggiuntivo", verificaToken, async (req, res) => {

    let token = req.header('Authorization');
    token = token.split(" ");
    const decoded = jwt.decode(token[1], process.env.TOKEN_SECRET);
 
    const result = await controller_acquisto.acquistoAggiuntivo(decoded, req.body);

    if(result.length === 1){
        try {
            res.download(result[0]);
        } catch{
            errore = factory.creaErrore({
                tipoErrore: 'Internal Server Error',
                messaggio: 'ERRORE SERVER: Impossibile scaricare il file'});
            return res.status(errore[0]).send(errore[1]);
        }
    }else{
        res.status(result[0]).json(result[1]);
    }
});

//Rotta per effettuare l'acquisto e regalarlo ad un amico tramite ID (dati utente passati tramite il token,
//dati prodotto passati tramite il body della richiesta insieme all'email dell'amico)
router.post("/regaloAmico/:email", verificaToken, async (req, res) => {

    let token = req.header('Authorization');
    token = token.split(" ");
    const decoded = jwt.decode(token[1], process.env.TOKEN_SECRET);
    
    const error = await validazioneRichieste.controlloMail(req.params.email);
    if(error) return res.status(error[0]).send(error[1]);
    
    const result = await controller_acquisto.regaloAmico(decoded, req.body, req.params.email);
    
    if(result.length === 1){
        try {
            res.download(result[0]);
        } catch{
            errore = factory.creaErrore({
                tipoErrore: 'Internal Server Error',
                messaggio: 'ERRORE SERVER: Impossibile scaricare il file'});
            return res.status(errore[0]).send(errore[1]);
        }
    }else{
        res.status(result[0]).json(result[1]);
    }
});

//Rotta per effettuare un acquisto di più prodotti (multiplo) tramite ID (dati utente passati tramite il token,
//dati dei prodotti passati tramite il body della richiesta)
router.post("/acquistoMultiplo", verificaToken, async (req, res) => {

    let token = req.header('Authorization');
    token = token.split(" ");
    const decoded = jwt.decode(token[1], process.env.TOKEN_SECRET);
 
    const result = await controller_acquisto.acquistoMultiplo(decoded, req.body);
    
    if(result.length === 1){
        
        try {
            result[0].generateNodeStream({type:'nodebuffer',streamFiles:true})
                .pipe(fs.createWriteStream('./files/out.zip'))
                .on('finish', function(){
            res.download('./files/out.zip');
            });            
        } catch{
            errore = factory.creaErrore({
                tipoErrore: 'Internal Server Error',
                messaggio: 'ERRORE SERVER: Impossibile scaricare il file'});
            return res.status(errore[0]).send(errore[1]);
        }
    }else{
        res.status(result[0]).json(result[1]);
    }
});

module.exports = router;