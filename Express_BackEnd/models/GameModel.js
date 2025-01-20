const pool = require('../database');

const Game = {
    getTopGames: async () => {
        const [rows] = await pool.query('SELECT id, name, price, image, description, sold FROM Game ORDER BY sold DESC LIMIT 3;');
        return rows;
    },
    getSpecialOffer: async () => {
        const [rows] = await pool.query('SELECT id, name, price, image, description, sold FROM Game WHERE is_special_offer = true;');
        return rows.length > 0 ? rows[0] : null;
    },
    getAllGames: async () => {
        const [rows] = await pool.query('SELECT id, name, publisher, price, image, description, sold FROM Game;');
        return rows.length > 0 ? rows : null;
    },
    getGamesByCartId: async (cartId) => {
        const [rows] = await pool.query('SELECT id, name, publisher, price, image, description, sold, is_special_offer, Cart_Game.added_at FROM Game JOIN Cart_Game ON Game.id = Cart_Game.game_id WHERE Cart_Game.cart_id = ?', [cartId]);
        return rows.length > 0 ? rows : null;
    },
    addGame: async (name, publisher, price, image, description, is_special_offer) => {
        const [rows] = await pool.query('INSERT INTO Game (name, publisher, price, image, description, is_special_offer) VALUES (?, ?, ?, ?, ?, ?)', [name, publisher, price, image, description, is_special_offer]);
        return rows;
    },
    updateGame: async (gameId, name, publisher, price, image, description, is_special_offer) => {
        const [rows] = await pool.query('UPDATE Game SET name = ?, publisher = ?, price = ?, image = ?, description = ?, is_special_offer = ? WHERE id = ?', [name, publisher, price, image, description, is_special_offer, gameId]);
        if (rows.affectedRows === 0) {
            return null;
        }
        return rows;
    },
    deleteGame: async (gameId) => {
        try {
            await pool.query('DELETE FROM Cart_Game WHERE game_id = ?', [gameId]);

            await pool.query('DELETE FROM Game WHERE id = ?', [gameId]);
        } catch (err) {
            console.error('Error during deleteGame:', err.message);
            throw err;
        }
    }
};

module.exports = Game;