var mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
var Reserve = require('./reserve');
var Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
const saltRounds = 10;
const token = require('../models/token');
const mailer = require('../mailer/mailer');

const validateEmail = function (email) {
    const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3,4})+$/;
    return regex.test(email);
};

var userSchema = new Schema({
    name: {
        type: String,
        trim: true,
        required: [true, "Name is required."]
    },
    email: {
        type: String,
        trim: true,
        required: [true, "Email is required."],
        lowercase: true,
        unique: true,
        validate: [validateEmail, "Please anter a valid Email"],
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3,4})+$/]
    },
    password: {
        type: String,
        required: [true, "Password is required."]
    },
    passwordResetToken: String,
    passwordResetTokenExpires: Date,
    verified: {
        type: Boolean,
        default: false
    }
});

userSchema.plugin(uniqueValidator, { message: 'PATH alreay exist whit other user.' });

//SaltRounds is to add randomness the password will be encrypted,
//and it is to try avoiding that two encrypt password will be the same.
userSchema.pre('save', function (next) {
    if (this.isModified('password')) {
        this.password = bcrypt.hashSync(this.password, saltRounds);
    };
    next();
});

userSchema.methods.validPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
};

userSchema.methods.reserve = function (bikeId, from, to, callback) {
    var reserve = new Reserve({ user: this.id, bike: bikeId, from: from, to: to });
    console.log(reserve);
    reserve.save(callback);
};

userSchema.methods.sentWelcomeEmail = function (callback) {
    const token = new token({ _userId: this.id, token: crypto.randomBytes(16).toString('hex') });
    const emailDestination = this.email;
    token.save(function (error) {
        if (error) { return console.log(error.message); }

        const mailOptions = {
            from: 'no-reply@bikesnetwork.com',
            to: emailDestination,
            subject: 'Account verification.',
            test: 'Hello,\n\n' + 'Please, to verify your account click in this link:\n' + 'http://localhost:3000' + '\/token/confirmation\/' + token.token + '.\n'
        };

        mailer.sendMail(mailOptions, function (error) {
            if (error) { console.log(error.message) };
            console.log('A verification mail has been sent to' + emailDestination + '.');
        });
    });
};

module.exports = mongoose.model('users', userSchema);