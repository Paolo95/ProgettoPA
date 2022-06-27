const router = require('express').Router();
const jwt = require('jsonwebtoken');
const isAdmin = require('../middlewares/isAdmin');
const verificaToken = require('../middlewares/verificaToken');
//const isAdmin = require('../middlewares/isAdmin');

const ControllerAccesso = require('../controllers/controller_accesso');
const controllerAccesso = new ControllerAccesso();

const ControllerUtente = require('../controllers/controller_utente');
const controllerUtente = new ControllerUtente();


// Definizione delle varie rotte per gli utenti

router.post('/credito', verificaToken, async (req, res) => {
    
    let token = req.header('Authorization');
    token = token.split(" ");
    const decoded = jwt.decode(token[1], process.env.TOKEN_SECRET);
    
    const result = await controllerUtente.getCreditoResiduo(decoded, req.body);
    res.status(result[0]).json(result[1]);

});

router.post('/acquistiUtente', verificaToken, async (req, res) => {
    
    let token = req.header('Authorization');
    token = token.split(" ");
    const decoded = jwt.decode(token[1], process.env.TOKEN_SECRET);
    
    const result = await controllerUtente.getAcquistiUtente(decoded, req.body);
    res.status(result[0]).json(result[1]);

});

// login
router.post('/login', async (req, res) => {

    /*
    // LOGIN VALIDATION
    const { error } = loginValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    */

    const result = await controllerAccesso.login(req.body);
    res.status(result[0]).header('Authorization', result[1]).json( { "token": result[1], "user": result[2] } );

});


// ricarica il credito di un utente specifico
router.post('/ricaricaUtente', verificaToken, isAdmin, async (req, res) => {

    const result = await controllerUtente.ricaricaUtente(req.body);
    res.status(result[0]).send(result[1]);

});

module.exports = router;