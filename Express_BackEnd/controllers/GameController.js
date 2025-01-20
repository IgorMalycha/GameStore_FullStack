const Game = require('../models/GameModel');

exports.getTopGames = async (req, res) => {
    try {
        const topGames = await Game.getTopGames();

        if (topGames.length > 0) {
            res.status(200).send(topGames);
        }else{
            res.status(404).send({error: 'Top Games not found'});
        }
    } catch (err) {
        res.status(500).send({error: 'Something went wrong in a server'});
    }
};

exports.getSpecialOffer = async (req, res) => {
    try {

        const specialOfferGame = await Game.getSpecialOffer();

        if (specialOfferGame !== null) {
            res.status(200).send(specialOfferGame);
        }else{
            res.status(404).send({error: 'Special offer game not found'});
        }
    } catch (err) {
        res.status(500).send({error: 'Something went wrong in a server'});
    }
};

exports.getAllGames = async (req, res) => {
    try {
        const allGames = await Game.getAllGames();

        if(!allGames) {
            res.status(404).send({error: 'Games not found'});
        }

        res.status(200).send(allGames);
    }catch (err) {
        res.status(500).send({error: 'Something went wrong in a server'});
    }

};

exports.addGame = async (req, res) => {
    try{
        const {name, publisher, price, image, description, is_special_offer} = req.body;

        const addedGame = Game.addGame(name, publisher, price, image, description, is_special_offer);

        res.status(201).send(addedGame);
    }catch (err){
        res.status(500).send({error: 'Something went wrong in a server'});
    }
}

exports.updateGame = async (req, res) => {
    try{
        const {gameId} = req.params;
        const {name, publisher, price, image, description, is_special_offer} = req.body;

        const updatedGame = Game.updateGame(gameId, name, publisher, price, image, description, is_special_offer);

        res.status(201).send(updatedGame);
    }catch (err){
        res.status(500).send({error: 'Something went wrong in a server'});
    }
};

exports.deleteGame = async (req, res) => {
    try {
        const {gameId} = req.params;

        await Game.deleteGame(gameId);
        res.status(204).send();
    }catch (err){
        res.status(500).send({error: 'Something went wrong in a server'});
    }
}