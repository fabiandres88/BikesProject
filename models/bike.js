var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var bikeSchema = new Schema({
    code: Number,
    color: String,
    modelo: String,
    location: {
        type: [Number], index: { type: '2dsphere', sparse: true }
    },
    
});

bikeSchema.statics.createInstance = function (code, color, modelo, location) {
    return new this ({
        code: code,
        color: color,
        modelo: modelo,
        location: location
    });
};

bikeSchema.methods.toString = function () {
    return 'code' + this.code + '| color' + this.color;
};

//We pass an empty filter "{}" to get all bikes
bikeSchema.statics.allBikes = function (callback) {
    return this.find({}, callback);    
};

bikeSchema.statics.add = function (aBike, callback) {    
    this.create(aBike, callback);
};

bikeSchema.statics.findBike = function (id, callback) {
    return this.where({_id: id}, callback);
};

bikeSchema.statics.findById = function (id, callback) {
    return this.findOne({_id: id}, callback);
};

bikeSchema.statics.removeByCode = function (aCode, callback) {
    return this.deleteOne({_id: aCode}, callback);
}; 

module.exports = mongoose.model('bike', bikeSchema);


//Model before use mongooge
// var bike = function (id, color, model, location) {
//     this.id = id;
//     this.color = color;
//     this.model = model;
//     this.location = location;
// };

// bike.prototype.toString = function () {
//     return 'id: ' + this.id + "| color: " + this.color;
// };

// bike.allBikes = [];
// bike.add = function (aBike) {
//     bike.allBikes.push(aBike);
// };

// //Method to find a bike by id
// bike.findById = function (aBikeId) {
//     var aBike = bike.allBikes.find(x => x.id == aBikeId);
//     if (aBike)
//         return aBike;
//     else
//         throw new Error(`There is not a bike with this id ${aBikeId}`);
// };

// //Now will be creted the remove bike method
// bike.removeById = function (aBikeId) {
//     for (var i = 0; i < bike.allBikes.length; i++) {
//         if (bike.allBikes[i].id == aBikeId) {
//             bike.allBikes.splice(0, 1);
//             break;
//         }
//     }
// };

// var bike1 = new bike(1, "red", "urban", [6.2200427, -75.5977792]);
// var bike2 = new bike(2, "white", "urban", [6.219982, -75.5958177]);
// var bike3 = new bike(3, "green", "mountain", [6.2223801, -75.5967358, 18.5]);

// bike.add(bike1);
// bike.add(bike2);
// bike.add(bike3);

// module.exports = bike;