const jwt = require('jsonwebtoken');
const Database = require('../model/database');


async function isAdmin(req, res, next){

    let token = req.header('Authorization');
    token = token.split(" ");

    const decoded = jwt.decode(token[1], process.env.TOKEN_SECRET);
    const utente = await Database.utente.findOne({where: {id_utente: decoded.id_utente}});

    if(utente.ruolo === 'admin') next();
    else return res.status(401).send('NON AUTORIZZATO: l\'utente [' + utente.username + '] non e\' un amministratore');

}


module.exports = isAdmin;