const User = require('../models/user');
const shortId = require('shortid');
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');

exports.signup = (req, res) => {
    const { name, email, password } = req.body;

    User.findOne({ email }).exec((err, user) => {
        // check if email is already registered
        if (user) {
            return res.send(400).json({ error: 'Email is already registered' })
        }

        // create a new user
        const username = shortId.generate();
        const profile = `${process.env.CLIENT_URL}/profile/${username}`;

        const newUser = new User({ username, name, email, password, profile });
        newUser.save((error, success) => {
            if (error) {
                return res.status(400).json({ error });
            }

            res.json({ message: 'Signup success!' });
        })
    })
}

exports.login = (req, res) => {
    const { email, password } = req.body;

    // check if user exists
    User.findOne({ email }).exec((err, user) => {
        if (err || !user) {
            return res.send(400).json({ error: 'This email does not exist. Please signup.' })
        }

        // authenticate
        if (!user.authenticate(password)) {
            return res.send(400).json({ error: 'Invalid email or password.' })
        }

        // generate jwt and send it to client
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
        
        res.cookie('token', token), { expiresIn: '1d' };
        const { _id, username, name, email, role } = user;
        
        return res.json({
            token,
            user: { _id, username, name, email, role }
        });
    })
}

exports.logout = (req, res) => {
    res.clearCookie('token');
    res.json({ message: 'Logout success' });
}

// a middleware used for protected resources
exports.requireLogin = expressJwt({ secret: process.env.JWT_SECRET });