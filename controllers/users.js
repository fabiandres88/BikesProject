var User = require('../models/users');

module.exports = {
    list: function (req, res, next) {
        User.find({}, (error, users) => {
            res.render('users/index', { users: users });
        });
    },
    update_get: function (req, res, next) {
        var { id } = req.params;
        User.findById(id, function (error, user) {
            res.render('users/update', { error: {}, user: user });
        });
    },
    update: function (req, res, next) {
        var { id } = req.params;
        var { name, email } = req.body;
        var update_values = { name: name };
        user.findByIdAndUpdate(id, update_values, function (error, user) {
            if (error) {
                console.log(error);
                res.render('users/update', { errors: error.errors, user: new User({ name: name, email: email }) });
            } else {
                res.redirect('/users');
                return;
            }
        });
    },
    create_get: function (req, res, next) {
        res.render('users/create', { errors: {}, user: new User() });
    },
    create: function (req, res, next) {
        var { name, email, password, confirm_password } = req.body;
        if (password != confirm_password) {
            res.render('users/create', { errors: { confirm_password: { message: 'Passwords not match' } }, user: new User({ name: name, email: email }) });
            return;
        }

        User.create({ name: name, email: email, password: password }, function (error, newUser) {
            if (error) {
                res.render('users/create', { errors: error.errors, user: new User({ name: name, email: email }) });
            } else {
                newUser.sentWelcomeEmail();
                res.redirect('/users');
            }
        });
    },
    delete: function (req, res, next) {
        var { id } = req.body;
        User.findByIdAndDelete(id, function (error) {
            if (error) {
                next(error);
            } else {
                res.redirect('/users');
            }
        });
    },
}