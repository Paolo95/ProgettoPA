const jwt = require('jsonwebtoken');

//Questo middleware può essere aggiunto ad ogni rotta (protetta o privta);
//Le rotte seguenti non possono essere utilizzate se l'utente non posside il relativo token.
//Il token si ottiene al login?

function verificaToken(req, res, next){

    // controllo della presenza del token nell'header
    let token = req.header('Authorization');
    token = token.split(" ");
    if( ! token) return res.status(401).send('ACCESSO NEGATO');

    try{
        // verifica della validità del token
        const verificato = jwt.verify(token[1], process.env.TOKEN_SECRET);
        req.utente = verificato;

        next();

    }catch(err){
        res.status(400).send('ERRORE: Token non valido: ' + err);
    }

}


module.exports = verificaToken;