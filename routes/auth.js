const express = require('express');
const router = express.Router();
const { signup, login, logout, requireLogin } = require('../controllers/auth');

//validators
const { runValidation } = require('../validators/index');
const { signupValidator, loginValidator } = require('../validators/auth');

router.post('/signup', signupValidator, runValidation, signup);
router.post('/login', loginValidator, runValidation, login);
router.get('/logout', logout);

//test
router.get('/secret', requireLogin, (req, res) => {
    res.json({ message: 'you have access to this protected page' });
});


module.exports = router;