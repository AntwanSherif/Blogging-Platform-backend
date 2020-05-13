const mongoose = require('mongoose');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        trim: true,
        required: true,
        max: 32,
        unique: true,
        index: true,
        lowercase: true
    },
    name: {
        type: String,
        trim: true,
        required: true,
        max: 32,
    },
    email: {
        type: String,
        trim: true,
        required: true,
        unique: true,
        lowercase: true
    },
    profile: {
        type: String,
        required: true,
    },
    //hashed password
    hashedPassword: {
        type: String,
        required: true
    },
    salt: String,   //password strength
    about: String,
    role: {
        type: Number,
        trim: true
    },
    photo: {
        type: Buffer,
        contentType: String
    },
    resetPasswordLink: {
        data: String,
        default: ''
    }

}, { timestamps: true });

userSchema.virtual('password')
    .set(function (password) {
        //create temp variable _id
        this._password = password;
        //generate salt
        this.salt = this.makeSalt();
        //encrypt password
        this.hashedPassword = this.encryptPassword(password);
    })
    .get(function () {
        return this._password
    });

userSchema.methods = {
    encryptPassword: function (password) {
        if (!password) return '';
        try {
            return crypto.createHmac('sha1', this.salt)
                .update(password)
                .digest('hex')
        } catch (err) {
            return '';
        }
    },
    makeSalt: function () {
        return Math.round(new Date().valueOf * Math.random()) + '';
    },
    authenticate: function (plainPassword) {
        return this.encryptPassword(plainPassword) === this.hashedPassword
    }
}

module.exports = mongoose.model('User', userSchema);