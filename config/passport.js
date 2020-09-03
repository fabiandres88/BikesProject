const passport = require('passport');
const Localstrategy = require('passport-local').Strategy;
const User = require('../models/users');
const GoogleStratgey = require('passport-google-oauth20').Strategy;

passport.use(new Localstrategy(
    function(email, password, done) {
        User.findOne({ email: email }, function (error, user) {
            if (error) {return done(error);}
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
    function(accessToken, refreshToken, profile, callback){
        console.log(profile);

        User.findOneOrCreateByGoogle(profile, function (error, user){
            return callback(error, user);
        })
    }
))

passport.serializeUser(function (error, done) {
    done (null, user.id);
});

passport.deserializeUser(function (id, done) {
    User.findById(id, function (error, user) {
        done(error, user);
    });
});

// [alias] const expert= passport.PassportStatic
// import export=

module.exports = passport;