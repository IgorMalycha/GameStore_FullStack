const express = require('express');
const router = express.Router();
const userController = require('../controllers/UserController');
const {auth}= require("../helpers/auth");


router.post('/users/register', userController.registerUser);
router.post('/users/login', userController.loginUser)
router.get('/users/profile', userController.getUserProfile);

router.put('/users/:userId', [auth], userController.changeProfileNames);
router.get('/users/:userId', [auth], userController.getUserData);
router.post('/users/logout', [auth], userController.logout);
module.exports = router;