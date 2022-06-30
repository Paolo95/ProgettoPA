const jwt = require('jsonwebtoken');
const Factory = require('../functions/factoryErrori');
const factory = new Factory();

//Questo middleware può essere aggiunto ad ogni rotta (protetta o privta);
//Le rotte in cui è utilizzato possono essere attraversate solo se l'utente posside il relativo token.
//Il token si ottiene al login

function verificaToken(req, res, next){

    // controllo della presenza del token nell'header
    let token = req.header('Authorization');
    token = token.split(" ");
    if( ! token){ 
        errore = factory.creaErrore({
        tipoErrore: 'Unauthorized',
        messaggio: 'ACCESSO NEGATO'});
        return res.status(errore[0]).send(errore[1]);
    }
    
    try{
        // verifica della validità del token
        const verificato = jwt.verify(token[1], process.env.TOKEN_SECRET);
        req.utente = verificato;
        next();

    } catch(err){
        errore = factory.creaErrore({
            tipoErrore: 'Bad Request',
            messaggio: 'ERRORE: Token non valido: ' + err});
        return res.status(errore[0]).send(errore[1]);
    }

}


module.exports = verificaToken;