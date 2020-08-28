var bike = require("../models/bike");
const { model } = require("../models/bike");

exports.bike_list = function (req, res) {
    bike.allBikes(function (error, bikes) {
        res.render('bikes/index', { bikes: bikes })
    });
};

exports.bike_create_get = (req, res) => {
    res.render('bikes/create');
};

exports.bike_create_post = function (req, res) {
    var { color, modelo } = req.body;
    var newbike = new bike();
    newbike.color = color;
    newbike.modelo = modelo
    newbike.location = [req.body.latitude, req.body.length];
    bike.add(newbike);

    res.redirect('/bikes');
};

exports.bike_update_get = function (req, res) {
    var { id } = req.params;    
    var query = bike.findBike({ _id: id });
    query.findOne(function (error, bikes) {
        if (error) return handleError(error);
        if (bikes) {
            var bk = bikes;            
            res.render('bikes/update', { bk })
        }
    });
};

exports.bike_update_post = function (req, res) {
    var { id } = req.params;   
    var {color, modelo, latitude, length} = req.body;        
    var query = bike.findBike({ _id: id });
    query.findOne(function (error, bikes) {
        if (error) return handleError(error);
        if (bikes) {                       
            if (bikes.color) {
                bikes.color= color;
            };
            if (bikes.modelo) {
                bikes.modelo=modelo;
            };
            if (bikes.latitude && bikes.length) {
                bikes.location = [latitude, length];
            };            
            res.redirect('/bikes')
        }
    });
};

exports.bike_delete_post = function (req, res) {
    console.log(req.body.id)
    bike.removeByCode(req.body.id);

    res.redirect('/bikes');
}