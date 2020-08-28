var mongoose = require('mongoose');
var bike = require("../../models/bike");

describe('Testing bikes', function () {
    beforeEach(function (done) {
        const mongoDB = 'mongodb://localhost/testdb';
        mongoose.set('useNewUrlParser', true);
        mongoose.set('useUnifiedTopology', true);
        mongoose.set('useFindAndModify', false);
        mongoose.set('useCreateIndex', true);
        mongoose.connect(mongoDB, function (error){
            console.error(error);
        })   
                   
        const db = mongoose.connection;
        db.on('error', console.error.bind(console, 'Connection error.'));
        db.once('open', function () {
            console.log("We are connected to test database!");
            done();
        });
    });

    afterEach(function (done) {
        bike.deleteMany({}, function (error, success) {
            if (error) console.log(error);
            done();
        });
    });

    describe('Bike createInstance', () => {
        it('Create new bike intance', () => {
            var bk = bike.createInstance(1, "green", "urban", [6.2212282, -75.5965367]);

            expect(bk.code).toBe(1);
            expect(bk.color).toBe("green");
            expect(bk.mod).toBe("urban");
            expect(bk.location[0]).toEqual(6.2212282);
            expect(bk.location[1]).toEqual(-75.5965367);
        });
    });

    describe('Bike allBikes', () => {

        it('Start empty', (done) => {

            bike.allBikes(function (err, bikes) {
                expect(bikes.length).toBe(0);
                done();
            });
        });
    });

    describe('Bike add', () => {
        it('Adding only one bike', (done) => {
            var aBike = new bike({ code: 1, color: "green", mod: "urban" })
            bike.add(aBike, function (error, newbike) {
                if (error) console.log(error);
                bike.allBikes(function (error, bikes) {
                    expect(bikes.length).toEqual(1);
                    expect(bikes[0].code).toEqual(aBike.code);
                    done();
                });

            });
        });
    });

    describe('Bike find by code', () => {
        it('It must to return the bike with code 1', (done) => {
            bike.allBikes(function (error, bikes) {
                expect(bikes.length).toBe(0);

                var aBike = new bike({ code: 1, color: "green", mod: "urban" });
                bike.add(aBike, function (error, newBike) {
                    if (error) console.log(error);

                    var aBike2 = new bike({ code: 2, color: "pink", mod: "urban" });
                    bike.add(aBike2, function (error, newBike) {
                        if (error) console.log(error);
                        bike.findByCode(1, function (error, targetBike) {
                            expect(targetBike.code).toBe(aBike.code);
                            expect(targetBike.color).toBe(aBike.color);
                            expect(targetBike.mod).toBe(aBike.mod);

                            done();
                        });
                    });
                });
            });
        });
    });
});

//To do delete test

//Test before use mongoose
// beforeEach(() => { console.log('Testing..') });

// describe("Testing method bike.allBikes", () => {
//     beforeEach(() => { console.log("Testing...") });
//     it("Starting empty", () => {
//         expect(bike.allBikes.length).toBe(3);
//     });
// });

// describe("Testing method bike.add", () => {
//     it("Adding a", () => {
//         expect(bike.allBikes.length).toBe(3);

//         var newBike = new bike(4, "pink", "urban", [6.222311, -75.5970919, 19.25])
//         bike.add(newBike);

//         expect(bike.allBikes.length).toBe(4);
//         expect(bike.allBikes[3]).toBe(newBike);
//     });
// });

// describe("Testing method findById", () => {
//     it("Should return the bike with id 5", () => {
//         expect(bike.allBikes.length).toBe(4);
//         var bike5 = new bike(5, "green", "urban");
//         var bike6 = new bike(6, "red", "mountain");
//         bike.add(bike5);
//         bike.add(bike6);

//         var targetBike5 = bike.findById(5);
//         expect(targetBike5.id).toBe(5);
//         expect(targetBike5.color).toBe(bike5.color);
//         expect(targetBike5.model).toBe(bike5.model);
//     });
// });

// describe("Testing method removeById", () => {
//     it("Should delete the bike with id 1", () => {
//         bike.removeById(1);        
//         expect(bike.allBikes.length).toBe(5);
//     });
// });