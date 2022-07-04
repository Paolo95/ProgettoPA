const Database = require('../model/database');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
dotenv.config();
const Factory = require('../functions/factoryErrori');
const factory = new Factory();

class Controller_accesso {

    constructor(){}

    async login(loginData){

        // CONTROLLO UTENTE REGISTRATO: controlla se l'username è nel db
        const utente = await Database.utente.findOne({where: {username: loginData.username}});
        if( ! utente) return factory.creaErrore({
            tipoErrore: 'Bad Request',
            messaggio: 'ERRORE: username errato!'});
    
        // CONTROLO PASSWORD: compara la pw nel body con quella criptata nel db tramite bcrypt
        const validPass = await bcrypt.compare(loginData.passwd, utente.passwd);
        if( ! validPass) return factory.creaErrore({
            tipoErrore: 'Bad Request',
            messaggio: 'Errore: password errata!'});
    
        // CREAZIONE E ASSEGNAZIONE TOKEN JWT: se l'utente è in possesso del token può fare azioni a lui dedicate
        const token = jwt.sign({
            id_utente: utente.id_utente, 
            username: utente.username,
            email: utente.mail,
            ruolo: utente.ruolo
        },
        process.env.TOKEN_SECRET);

        var utenteJson = {
            "id_utente": utente.id_utente,
            "username": utente.username,
            "email": utente.mail,
            "ruolo": utente.ruolo            
        }
    
        return [200, token, utenteJson];
    }
}

module.exports = Controller_accesso;