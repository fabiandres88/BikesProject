const User = require('../../models/users');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports = {
    authenticate: function (req, res, next) {
        User.findOne({ email: req.body.email }, function (error, usrInfo) {
            if (error) {
                next(error);
            } else {
                if (userInfo === null) { return res.status(401).json({ status: 'error', message: "Invalid email or password", data:null });}
                if (userInfo != null && bcrypt.compareSync(req.body.password, userInfo.password)) {
                    userInfo.save(function (error, user) {
                        const token = jwt.sign({ id: userInfo._id }, req.app.get('secretKey'), {expiresIn: '7d'});
                        res.status(200).json({ message: "User found", data: { user: user, token: token } });
                    });
                } else {
                    res.status(401).json({ status: "error", message: 'Invalid email or password', data:null });
                }
            }
        });
    },
    forgotPassword: function (req, res, next) {
        User.findOne({email:req.body.email}, function (error, user){
            if (!user) return res.status(401).json({message: "User does not exist.", data: null});
            user.resetPassword(function (error){
                if (error) {return next (error);}
                res.status(200).json({message: "An email was sending to restore the password.", data: null});
            });
        });
    },
    authFacebookToken: function (req, res, next) {
        if (req.user){
            req.user.save().then(() =>{
                const token = jwt.sign({id: req.user.id}, req.app.get('secretKey'), {expiresIn: '7d'});
                res.status(200).json({message: "User found or created", data: {user: req.user, token: token}});                
            }).catch ((error)=>{
                console.log(error);
                res.status(500).json({message: error.message});
            }); 
        }else {
            res.status(401);
        }
    }    
}