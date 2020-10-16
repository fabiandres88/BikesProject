const passport = require('passport');
const Localstrategy = require('passport-local').Strategy;
const User = require('../models/users');
const GoogleStratgey = require('passport-google-oauth20').Strategy;
const FacebookTokenStrategy = require('passport-facebook-token');

passport.use(new FacebookTokenStrategy({
    clientID: process.env.FACEBOOK_ID,
    clientSecret: process.env.FACEBOOK_SECRET
}, function (accessToken, refreshToken, profile, done) {
    try {
        User.findOneOrCreateByFacebook(profile, function (error, user) {
            if (error) console.log('error' + error);
            return done(error, user);
        });
    } catch (error2) {
        console.log(error2);
        return done(error2, null);
    }
}
));

passport.use(new Localstrategy(
    function (email, password, done) {
        User.findOne({ email: email }, function (error, user) {
            if (error) { return done(error); }
            if (!user) {
                return done(null, false, { message: 'Email does not exist.' });
            }
            if (!user.validPassword(password)) {
                return done(null, false, { message: 'Incorrect password.' });
            }
            return done(null, user);
        });
    }
));

passport.use(new GoogleStratgey({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.HOST + "/auth/google/callback"
},
    function (accessToken, refreshToken, profile, callback) {
        console.log(profile);

        User.findOneOrCreateByGoogle(profile, function (error, user) {
            return callback(error, user);
        })
    }
))

passport.serializeUser(function (error,user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    User.findById(id, function (error, user) {
        done(error, user);
    });
});

// [alias] const expert= passport.PassportStatic
// import export=

module.exports = passport;