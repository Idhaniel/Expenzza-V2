const express = require('express');
const { register, login, logout } = require('../controllers/authControllers');

const { validateUserRegistration } = require('../middlewares/validations');
const router = express.Router();

router.post('/register', validateUserRegistration(), register);

router.post('/login', login);
router.get('/logout', logout);

module.exports = router;
