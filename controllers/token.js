var User = require ('../models/users');
var Token = require ('../models/token');

exports.confirmationGet =(req, res, next)=> {
    var { token } = req.params;
    Token.findOne({token: token, function (error, token) {
        if (!token) return res.status(400).send({type: 'not-verified', msg:'We not found a user with this token. Maybe it has expired and you must to generate a new token'});
        User.findById( token._userId, function (error, user) {
            if (!user) return res.status(400).send({ msg: 'We not found a user with this token.'});
            if (user.verified) return res.redirect('/users');
        User.verified= true;
        User.save(function (error){
            if (error){ return res.status(500).send({ msg: error.message});}
            res.redirect('/');
        });    
        })
                
    }})
};