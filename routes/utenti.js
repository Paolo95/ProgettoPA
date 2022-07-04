const router = require('express').Router();
const jwt = require('jsonwebtoken');
const isAdmin = require('../middlewares/isAdmin');
const verificaToken = require('../middlewares/verificaToken');
const Controller_accesso = require('../controllers/controller_accesso');
const controller_accesso = new Controller_accesso();
const Controller_utente = require('../controllers/controller_utente');
const controller_utente = new Controller_utente();
const ValidazioneRichieste = require('../functions/validazioneRichieste');
const validazioneRichieste = new ValidazioneRichieste();

//rotta per verificare il credito residuo di un utente (dati utente passati tramite il token)
router.post('/credito', verificaToken, async (req, res) => {
    
    let token = req.header('Authorization');
    token = token.split(" ");
    const decoded = jwt.decode(token[1], process.env.TOKEN_SECRET);

    const result = await controller_utente.getCreditoResiduo(decoded, req.body);
    res.status(result[0]).json(result[1]);
});

// rotta per ottenere la lista degli acquisti effettuati dall'utente (dati dell'utente
// ottenuti tramite il token JWT e tramite il body, viene indicata la tipologia di acquisto
// differenziandola per download originale o aggiuntivo)
router.post('/acquistiUtente', verificaToken, async (req, res) => {
    
    let token = req.header('Authorization');
    token = token.split(" ");
    const decoded = jwt.decode(token[1], process.env.TOKEN_SECRET);
    
    const result = await controller_utente.getAcquistiUtente(decoded, req.body);
    res.status(result[0]).json(result[1]);
});

// rotta per ottenere il token JWT dell'utente passando le credenziali tramite il body della
// richiesta.
router.post('/login', async (req, res) => {

    const result = await controller_accesso.login(req.body);
    res.status(result[0]).header('Authorization', result[1]).json( { "token": result[1], "user": result[2] } );
});


// rotta per la ricarica del credito di un utente specifico (dati utente ottenuti tramite il
// token JWT)
router.post('/ricaricaUtente', verificaToken, isAdmin, async (req, res) => {

    let error = await validazioneRichieste.controlloMail(req.body.mailUtente);
    if(error) return res.status(error[0]).send(error[1]);

    error = await validazioneRichieste.controlloImportoRicarica(req.body);
    if(error) return res.status(error[0]).send(error[1]);

    const result = await controller_utente.ricaricaUtente(req.body);
    res.status(result[0]).send(result[1]);
});

module.exports = router;