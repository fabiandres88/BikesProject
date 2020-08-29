var user = require ('../../models/users');
const users = require('../../models/users');

exports.users_list = function (req, res){
    user.find({}, function (error, users) {
        res.status(200).json({
            users: users
        });
    });
};

exports.users_create = function (req, res) {
    var { name, email, password} = req.body;
    var user = new users ();
    user.name= name;
    user.email= email;
    user.password= password;
    user.save(function (error){
        if(error) return res.status(500).json(error);        
        res.status(200).json(user);
    });
};

exports.users_reserve = function (req, res) {
    user.findById(req.body._id, function (error, user){
        console.log(user);
        user.reserve(req.body.bike_id, req.body.from, req.body.to, function (error) {
            console.log('Reserve');
            res.status(200).send();
        });
    });
};