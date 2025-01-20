const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const hashPassword = (password) => {
    return new Promise((resolve, reject) => {
        bcrypt.genSalt(12, (err, salt) => {
            if (err) return reject(err);

            bcrypt.hash(password, salt, (err, hash) => {
                if (err) return reject(err);

                resolve(hash);
            });
        });
    });
};

const comparePassword = (password, hashedPassword) => {
    return bcrypt.compare(password, hashedPassword);
};

const auth = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(400).json({ message: 'Invalid token.' });
    }
};

const checkAdmin = (req, res, next) => {
    if (!req.user || req.user.id !== 1) {
        return res.status(403).json({ message: 'Access denied. Admins only.' });
    }
    next();
};

const generateToken = (user) => {
    const payload = {
        id: user.id,
        email: user.email,
    };
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
};

module.exports = {
    auth,
    checkAdmin,
    generateToken,
    hashPassword,
    comparePassword
};
