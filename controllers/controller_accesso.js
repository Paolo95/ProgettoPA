const Database = require('../model/database');
const jwt = require('jsonwebtoken');
const { getDataCorrente } = require('../functions/funzioni_temporali');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
dotenv.config();

class ControllerAccesso {

    constructor(){}

    async login(loginData){

        // CONTROLLO UTENTE REGISTRATO: controlla se l'username è nel db
        const utente = await Database.utente.findOne({username: loginData.username});
        if( ! utente) return [400, 'Username o email errati!'];
    
        // CONTROLO PASSWORD: compara la pw nel body con quella criptata nel db tramite bcrypt
        const validPass = await bcrypt.compare(loginData.passwd, utente.passwd);
        if( ! validPass) return [400, 'Username o email errati!'];
    
        // CREAZIONE E ASSEGNAZIONE JWT: se l'utente è in possesso del token può fare azioni -> private routes middlewares
        
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
    
    /*

    async register(registerData){
    
        // CONTROLLO USERNAME IN USO: controlla se c'è già un utente con quel username
        const usernameExists = await User.findOne({username: registerData.username});
        if(usernameExists) return [400, 'ERROR: username [' + registerData.username + '] already in use'];
    
        // CONTROLLO EMAIL IN USO: controlla se la email è già presente nel db
        const emailExists = await User.findOne({email: registerData.email});
        if(emailExists) return [400, 'ERROR: email [' + registerData.email + '] already in use'];
    
        // PASSWORD HASHING: tramite hash + salt
        const salt = await bcrypt.genSalt(10);
        const hashedPassword  = await bcrypt.hash(registerData.password, salt); // hashing pw with salt
    
        var appRegisterDate = getCurrentDate();
        var appRegisterTime = getCurrentTime();
    
        // CREAZIONE NUOVO UTENTE:
        const user = new User({
    
            username: registerData.username,
            email: registerData.email,
            password: hashedPassword,
    
            registerDate: appRegisterDate,
            registerTime: appRegisterTime
    
        });
    
        try{
            const savedUser = await user.save();
            return [200, 'SUCCESS: user with id [' + savedUser.userID + '] created'];   
        }catch(err){
            return [500, "SERVER ERROR: couldn't save user " + err];
        }
    
    }

    */

}

module.exports = ControllerAccesso;