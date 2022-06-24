const express = require('express');
const router = express.Router();
const db = require('../model/database');
const jwt = require('jsonwebtoken');
const verifyToken = require('../middlewares/verifyToken');
const Controller_acquisti = require('../controllers/controller_acquisti');
const controller_acquisti = new Controller_acquisti();

router.post("/acquistoId", verifyToken, async (req, res) => {

    let token = req.header('Authorization');
    token = token.split(" ");
    const decoded = jwt.decode(token[1], process.env.TOKEN_SECRET);
 
    const result = await controller_acquisti.acquistoPerId(decoded, req.body);
    res.status(result[0]).json(result[1]);

});

module.exports = router;