const User = require('../models/UserModel');
const { hashPassword, comparePassword } = require('../helpers/auth');
const jwt = require("jsonwebtoken");
const Cart = require('../models/CartModel');

exports.registerUser = async (req, res) => {
    const { firstName, lastName, email, password } = req.body;

    const emailExist = await User.doesEmailExist(email);
    if (emailExist) {
        return res.status(400).send({ error: 'Email already exists' });
    }

    try {
        const hashedPassword = await hashPassword(password);
        const newUser = await User.createUser(firstName, lastName, email, hashedPassword);
        const newCart = await Cart.createCart(newUser.insertId);

        res.status(201).json(newUser);
    } catch (err) {
        res.status(500).json({ error: 'Error registering user' });
    }
};

exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const emailExist = await User.doesEmailExist(email);
        if (!emailExist) {
            return res.status(400).send({ error: 'Wrong email' });
        }

        const user = await User.getUserByEmail(email);
        const { password: hashedPassword, id } = user;

        const isGoodPassword = await comparePassword(password, hashedPassword);
        if (!isGoodPassword) {
            return res.status(400).send({ error: 'Wrong password' });
        }

        jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '1h' },
            (err, token) => {
                if (err) {
                    return res.status(500).json({ error: 'Error generating token' });
                }
                res.cookie('token', token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'Strict',
                    maxAge: 3600000,
                });
                res.status(200).json({ message: 'Logged in successfully', id: user.id });
            }
        );
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.getUserProfile = async (req, res) => {
    try{

    const { token } = req.cookies;
    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }

    jwt.verify(token, process.env.JWT_SECRET, {}, async (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid token' });
        }

        const id = Array.isArray(user.id) && user.id.length > 0 ? user.id[0].id : user.id;
        res.status(200).json({ ...user, id });
    });
    }catch(err){
        res.status(500).send({error: 'Internal server error'});
    }
};

exports.changeProfileNames = async (req, res) => {
    try{
        const {firstName, lastName} = req.body;
        const {userId} = req.params;

        const updated = await User.updateUserNames(userId, firstName, lastName);

        res.status(200).json(updated);
    }catch(err){
        console.log(err);
    }
};

exports.getUserData = async (req, res) => {
    try{
        const {userId} = req.params;

        const data = await User.getUserDataById(userId);
        if(!data){
            res.status(404).send({ error: 'No user with this id' });
        }

        res.status(200).json(data);
    }catch (err){
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.logout = (req, res) => {
    try {
        res.clearCookie('token');
        res.status(200).send({ message: 'Logged out successfully' });
    } catch (err) {
        res.status(500).send({ error: 'Something went wrong during logout' });
    }
};
