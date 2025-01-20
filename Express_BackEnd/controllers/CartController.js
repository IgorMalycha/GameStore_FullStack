const Cart = require('../models/CartModel');
const Game = require("../models/GameModel");

exports.addGameToCart = async (req, res) => {
    try {
        const {userId, gameId} = req.params;

        const cartId = await Cart.getCartIdByUserId(userId);
        if(!cartId){
            return res.status(404).send({error: 'Can not find cart with Id: ' + cartId});
        }
        const gameInCart = await Cart.isGameInCart(cartId, gameId);
        if(gameInCart){
            return res.status(400).send({error: 'Game already in cart'});
        }

        const addedGameToCart = await Cart.addToCart(cartId, gameId);

        res.status(201).send(addedGameToCart);

    } catch (err) {
        res.status(500).send({error: 'Something went wrong in a server'});
    }
};

exports.getCart = async (req, res) => {
    try{
        const {userId} = req.params;

        const cartId = await Cart.getCartIdByUserId(userId);
        if(!cartId){
            return res.status(404).send({error: 'Can not find cart of user with email: ' + userEmail})
        }
        const cart = await Game.getGamesByCartId(cartId);
        if(!cart){
            return res.status(404).send({error: 'Can not find cart of user with email: ' + userEmail});
        }
        res.status(200).send(cart);
    }catch(err){
        res.status(500).send({error: 'Something went wrong in a server'});
    }
};

exports.deleteGameFromCart = async (req, res) => {
      try{
          const {userId, gameId} = req.params;

          const cartId = await Cart.getCartIdByUserId(userId);
          if(!cartId){
              return res.status(404).send({error: 'Can not find cart with Id: ' + cartId});
          }

          await Cart.deleteGameFromCart(cartId, gameId);
          res.status(204).send();
      }catch(err){
          res.status(500).send({error: 'Something went wrong in a server'});
      }
};