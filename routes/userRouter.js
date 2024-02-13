const express = require('express');
const authController = require('./controllers/user');

const router = express.Router();

router.post('/users/register', authController.register);
router.post('/users/login', authController.login);

module.exports = router;