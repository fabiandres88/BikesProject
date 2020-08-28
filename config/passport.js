const passport = require('passport');
const localstrategy = require('passport-local').Strategy;
const User = require('../models/users');

passport.use(new localstrategy({
    function(email, password, done) {
        User.findOne({ email: email }, function (error, user) {
            if (error) return done(error);
            if (!user) return done(null, false, { message: 'Email does not exist.' });
            if (!user.validPassword(password)) return done(null, false, { message: 'Incorrect password.' });
            return done(null, user);
        })
    }
}));

passport.serializeUser(function (error, cb) {
    cb(null, user.id);
});

passport.deserializeUser(function (id, cb) {
    User.findById(id, function (error, user) {
        cb(error, user);
    });
});

// [alias] const expert= passport.PassportStatic
// import export=

module.exports = passport;