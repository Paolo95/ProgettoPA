const express = require('express');
const router = express.Router();
const Controller_prodotto = require('../controllers/controller_prodotto');
const controller_prodotto = new Controller_prodotto();

router.post("/lista", async (req, res) => {

    const result = await controller_prodotto.getProdottiDisponibili(req.body);
    res.status(result[0]).json(result[1]);

});

/*
router.get("/:id", function(req, res) {
    db.prodotto.findByPk(req.params.id)
        .then( prodotto => {
            res.status(200).send(JSON.stringify(prodotto));
        })
        .catch( err => {
            res.status(500).send(JSON.stringify(err));
        });
});

router.put("/", function(req, res) {
    db.Person.create({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        id: req.body.id
        })
        .then( person => {
            res.status(200).send(JSON.stringify(person));
        })
        .catch( err => {
            res.status(500).send(JSON.stringify(err));
        });
});

router.delete("/:id", function(req, res) {
    db.Person.destroy({
        where: {
            id: req.params.id
        }
        })
        .then( () => {
            res.status(200).send();
        })
        .catch( err => {
            res.status(500).send(JSON.stringify(err));
        });
});

*/

module.exports = router;