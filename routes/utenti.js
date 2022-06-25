const router = require('express').Router();
const jwt = require('jsonwebtoken');
const isAdmin = require('../middlewares/isAdmin');
const verificaToken = require('../middlewares/verificaToken');
//const isAdmin = require('../middlewares/isAdmin');

const ControllerAccesso = require('../controllers/controller_accesso');
const controllerAccesso = new ControllerAccesso();

const ControllerUtente = require('../controllers/controller_utente');
const controllerUtente = new ControllerUtente();

/*
// Definizione delle varie rotte per gli utenti

router.get('/', verifyToken, async (req, res) => {

    var result = await userController.getAllUsers();
    res.status(result[0]).json(result[1]);
    
});


// ottieni profilo utente corrente
router.get('/:userID', verifyToken, async (req, res) => {

    var result = await userController.getUser(req.params.userID);
    res.status(result[0]).json(result[1]);

});


// registrazione
router.post('/register', async (req, res) => {

    // REGISTER VALIDATION: controlla se vengono rispettati i criteri definiti con joi in validation.js
    const { error } = registerValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    var result = await authController.register(req.body);
    res.status(result[0]).send(result[1]);

});

*/
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
    
    const result = await controllerUtente.getAcquistiUtente(req.body);
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


// elimina utente specifico
router.post('/ricaricaUtente', verificaToken, isAdmin, async (req, res) => {

    let token = req.header('Authorization');
    token = token.split(" ");
    const decoded = jwt.decode(token[1], process.env.TOKEN_SECRET);

    const result = await controllerUtente.ricaricaUtente(req.body);
    res.status(result[0]).send(result[1]);

});

/*

// elimina collezione utenti
router.delete('/', verifyToken, isAdmin, async (req, res) => {

    var result = await userController.deleteAllUsers();
    res.status(result[0]).send(result[1]);

});

*/
module.exports = router;