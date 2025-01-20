const pool = require('../database');

const Cart = {
    createCart: async (userId) => {
        const [rows] = await pool.query('INSERT INTO Cart (user_id) VALUES (?)', [userId]);
        return rows;
    },
    addToCart: async (cartId, gameId) => {
        const [rows] = await pool.query('INSERT INTO Cart_Game (cart_id, game_id) VALUES (?, ?)', [cartId, gameId]);
        return rows;
    },
    getCartIdByUserId: async (userId) => {
        const [rows] = await pool.query('SELECT Cart.id FROM Cart JOIN User ON Cart.user_id = User.id WHERE User.id = (?)', [userId]);
        return rows.length > 0 ? rows[0].id : null;
    },
    isGameInCart: async (cartId, gameId) => {
        const [rows] = await pool.query('SELECT COUNT(*) AS count FROM Cart_Game JOIN Game ON Cart_Game.game_id = Game.id WHERE Cart_Game.cart_id = (?) AND Game.id = (?)', [cartId, gameId]);
        return rows[0].count > 0;
    },
    deleteGameFromCart: async (cartId, gameId) => {
        const [rows] = await pool.query('DELETE FROM Cart_Game WHERE cart_id = ? AND game_id = ?', [cartId, gameId]);
        return rows;
    }
};

module.exports = Cart;