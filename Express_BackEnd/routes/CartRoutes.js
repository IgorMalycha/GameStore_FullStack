const express = require('express');
const router = express.Router();
const cartController = require('../controllers/CartController');
const {auth} = require("../helpers/auth");

router.post('/cart/:userId/game/:gameId', [auth], cartController.addGameToCart);
router.get('/cart/:userId', [auth], cartController.getCart);
router.delete('/cart/:userId/game/:gameId', [auth], cartController.deleteGameFromCart)

module.exports = router;