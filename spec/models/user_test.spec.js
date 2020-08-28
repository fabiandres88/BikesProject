var mongoose = require('mongoose');
var bike = require('../../models/bike');
var user = require('../../models/user');
var Reserve = require('../../models/reserve');

describe('Testing users', function () {
    beforeEach(function (done) {
        var mongoDB = 'mongodb://localhost/testbd';
        mongoose.connect(mongoDB, { useNewUrlParser: true });

        const db = mongoose.connection;
        db.on('error', console.error.bind(console, 'Connection error'));
        db.once('open', function () {
            console.log('We are connected');
            done();
        });
    });

    afterEach(function (done) {
        Reserve.deleteMany({}, function (error, success) {
            if (error) console.log(error);
            user.deleteMany({}, function (error, success) {
                if (error) console.log(error);
                bike.deleteMany({}, function (error, succes) {
                    if (error) console.log(error);
                    done();
                });
            });
        });
    });

    describe('When a user reserve a bike', () => {
        it ('Must exist the reserve', (done) => {
            const users = new user ({ name: 'Fabian'});
            users.save();
            const bk = new bike ({ code: 1, color: 'green', models: 'urban'});
            bk.save();
            
            var today = new Date();
            var tomorrow = new Date ();
            tomorrow.setDate(today.getDate()+1);
            users.reserve(bk.id, today, tomorrow, function (error, rese) {
                Reserve.find({}).populate('bike').populate('user').exec(function (error, reserves) {
                    console.log(reserves[0]);
                    expect(reserves.length).toBe(1);
                    expect(reserves[0].daysOfReserve()).toBe(2);
                    expect(reserves[0].bike.code).toBe(1);
                    expect(reserves[0].user.name).toBe(users.name);
                    done();
                });
            });
        });
    });
});