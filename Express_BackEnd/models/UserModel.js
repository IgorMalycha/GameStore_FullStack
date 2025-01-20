const pool = require('../database');

const User = {
    doesEmailExist: async (email) => {
        const [rows] = await pool.query('SELECT COUNT(*) AS count FROM User WHERE email = ?', [email]);
        return rows[0].count > 0;
    },
    createUser: async (firstName, lastName, email, password) => {
        const [rows] = await pool.query('INSERT INTO User(firstName, lastName, email, password) VALUES(?, ?, ?, ?);', [firstName, lastName, email, password]);
        return rows;
    },
    getUserByEmail: async (email) => {
        const [rows] = await pool.query('SELECT id, firstName, lastName, password FROM User WHERE email = ?', [email]);
        return rows.length > 0 ? rows[0] : null;
    },
    updateUserNames: async (userId, firstName, lastName) => {
        const [rows] = await pool.query('UPDATE User SET firstName = ?, lastName = ? WHERE id=?', [firstName, lastName, userId]);
        if (rows.affectedRows === 0) {
            return null;
        }
        const [updatedUser] = await pool.query('SELECT id, firstName, lastName, email FROM User WHERE id = ?', [userId]);
        return updatedUser[0];
    },
    getUserDataById: async (id) => {
        const [rows] = await pool.query('SELECT id, firstName, lastName, email FROM User WHERE id = ?', [id]);
        return rows.length > 0 ? rows[0] : null;
    }
};

module.exports = User;
