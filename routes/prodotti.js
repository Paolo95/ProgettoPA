const express = require('express');
const router = express.Router();
const Controller_prodotto = require('../controllers/controller_prodotto');
const controller_prodotto = new Controller_prodotto();

//Rotta per la lista dei prodotti disponibili
router.post("/lista", async (req, res) => {

    const result = await controller_prodotto.getProdottiDisponibili(req.body);
    res.status(result[0]).json(result[1]);
});

module.exports = router;