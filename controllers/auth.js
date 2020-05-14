const User = require('../models/user');
const shortId = require('shortid');

exports.signup = (req, res) => {
    User.findOne({ email: req.body.email }).exec((err, user) => {
        if (user) {
            return res.send(400).json({ error: 'Email is already registered' })
        }

        //create a new user
        const { name, email, password } = req.body;
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