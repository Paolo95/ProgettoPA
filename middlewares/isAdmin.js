const jwt = require('jsonwebtoken');
const Database = require('../model/database');
const Factory = require('../functions/factoryErrori');
const factory = new Factory();

async function isAdmin(req, res, next){

    let token = req.header('Authorization');
    token = token.split(" ");

    const decoded = jwt.decode(token[1], process.env.TOKEN_SECRET);
    const utente = await Database.utente.findOne({where: {id_utente: decoded.id_utente}});

    if(utente.ruolo === 'admin') next();
    else {
        prova = factory.creaErrore({
        tipoErrore: 'Unauthorized',
        messaggio: 'NON AUTORIZZATO: l\'utente [' + utente.username + '] non e\' un amministratore'});
        return res.status(prova[0]).send(prova[1]);
    }
}


module.exports = isAdmin;