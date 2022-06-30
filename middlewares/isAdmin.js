const jwt = require('jsonwebtoken');
const Database = require('../model/database');
const Factory = require('../functions/factoryErrori');
const factory = new Factory();

//Questo middleware può essere aggiunto ad ogni rotta (protetta o privta);
//Le rotte che lo utilizzano ottengono la verifica che l'utente identificato dal relativo token
//Sia un utente con privilegi di Amministratore

async function isAdmin(req, res, next){

    // controllo della presenza del token nell'header
    let token = req.header('Authorization');
    token = token.split(" ");

    //decodifica del token per trovare a quale utente appartenga nel db
    const decoded = jwt.decode(token[1], process.env.TOKEN_SECRET);
    const utente = await Database.utente.findOne({where: {id_utente: decoded.id_utente}});

    //verifica del ruolo dell'utente identificato tramite il token in suo possesso
    if(utente.ruolo === 'admin') next();
    else {
        errore = factory.creaErrore({
        tipoErrore: 'Unauthorized',
        messaggio: 'NON AUTORIZZATO: l\'utente [' + utente.username + '] non e\' un amministratore'});
        return res.status(errore[0]).send(errore[1]);
    }
}


module.exports = isAdmin;