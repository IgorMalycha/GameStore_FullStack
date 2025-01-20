const express = require('express');
const router = express.Router();
const gameController = require('../controllers/GameController');
const { auth, checkAdmin } = require('../helpers/auth');

router.get('/games', gameController.getAllGames);
router.get('/games/topGames', gameController.getTopGames);
router.get('/games/specialOfferGame', gameController.getSpecialOffer);

router.post('/games', [auth, checkAdmin], gameController.addGame);
router.put('/games/:gameId', [auth, checkAdmin], gameController.updateGame);
router.delete('/games/:gameId', [auth, checkAdmin], gameController.deleteGame);

module.exports = router;
