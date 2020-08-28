var bike = require("../../models/bike");
var request = require("request");
var server = require("../../bin/www");
const base_url = 'http:localhost:3000/api/bikes';

describe('Testing Bike  API', () => {
    beforeEach(function (done) {
        const mongoDb = 'mongodb://localhost:testdb';
        mongoose.connect(mongoDb, { useNewUrlParser: true});

        const db = mongoose.connection;
        db.on('error', console.error.bind(console, 'Connection error'));
        db.once('open', () => {
            console.log('We are connected to the database');
            done();
        })
    });

    afterEach(function(done) {
        bike.deleteMany({}, function (error, success) {
            if (error) console.log(error);
            done();
        })
    });

    describe('GET bikes/', () => {
        it('Status 200', (done) => {
            request.get(base_url, function (error, response, body){
                var result = JSON.parse(body);
                expect(response.statusCode).toBe(200);
                expect(result.bikes.length).toBe(0);
                done();
            });
        });
    });

    describe('POST bikes/create', () => {
        it('Status 200', (done) => {
            var headers = {'content-type': 'application/json'};
            var aBike = '{"code": 10, "color": "red", "model": "urban", "latitude": 6.2212282, "length": -75.5965367}';
            request.post({
                headers: headers,
                url: base_url + '/create',
                body: aBike
            }, function (error, response, body) {
                expect(response.statusCode).toBe(200);
                var bike = JSON.parser(body).bike;
                console.log(bike);
                expect(bike.color).toBe("red");
                expect(bike.location[0]).toBe(6.2212282);
                expect(bike.location[1]).toBe(-75.5965367);
                done();
            });
        });
    });

    describe('DELETE bikes/delete', () => {
        it('Status 200', (done )=> {
            var a = bike.createInstance(1, 'black', 'urban', [6.2212282,-75.5965367]);
            bike.add(a, function (error, newBike){
                var headers = {'content-type': 'application/json'}
            })
        });
    });
});




//Test before apply Mongoose
// describe("Testing Bike  API", () => {
//     describe("GET Bikes/", () => {
//         it("Status 200", () => {
//             expect(bike.allBikes.length).toBe(3);

//             var bike4 = new bike(4, "red", "urban", [-34.6012424, -58.3861497]);
//             bike.add(bike4);

//             request.get("http://localhost:3000/api/bikes", (error, response, body) => {
//                 expect(response.statusCode).toBe(200);
//             });
//         });
//     });
// });

// describe("Testin POST/ create", () => {
//     it("Status 200", (done) => {
//         var headers = { 'Content-type': 'application/json' };
//         var bike5 = '{"id": 5, "color": "blue", "model": "urban", "latitude": -34.6012424, "length": -58.3861497}';
//         request.post({ headers: headers, url: "http://localhost:3000/api/bikes/create", body: bike5 }, (error, response, body) => {
//             expect(response.statusCode).toBe(200);
//             expect(bike.findById(5).color).toBe("blue");
//             done();
//         });
//     });
// });

// describe("Testing DELETE /delete/1", () => {
//     it("Status 200", () => {
//         request.delete({ url: "http://localhost:3000/api/bikes/delete/1" }, (error, response, body) => {
//             expect(response.statusCode).toBe(200);
//         });
//     });
// });

// describe("Testin POST/ update", () => {
//     it("Status 200", (done) => {
//         var headers = { 'Content-type': 'application/json' };
//         var bike3 = '{"color": "blue", "model": "urban", "latitude": -34.6012424, "length": -58.3861497}';
//         request.post({ headers: headers, url: "http://localhost:3000/api/bikes/update/3", body: bike3 }, (error, response, body) => {
//             expect(response.statusCode).toBe(200);
//             expect(bike.findById(3).color).toBe("blue");
//             done();
//         });
//     });
// });