var bike = require("../../models/bike");


exports.bike_list = function (req, res) { 
    bike.allBikes(function (error, bikes){
        res.status(200).json({
            bikes: bikes
        });
    });   
};

exports.bike_create = function (req, res) {
    var { color, modelo, latitude, length} = req.body;    
    var newbike = new bike();    
    newbike.color= color;
    newbike.modelo = modelo;
    newbike.location = [latitude, length];
    
    bike.add(newbike);

    res.status(200).json({
        bike: newbike
    });
};

exports.bike_delete = (req, res) => {
    var { id } = req.params;
    bike.removeById(id);
    res.status(200).json("Bike deleted.");
};

exports.bike_update = (req, res) => {
    var { id } = req.params;   
    var bk = bike.findById(id);
    var { color, models, latitude, length } = req.body;
    bk.id = id;
    if (color) {
        bk.color = color;
    };
    if (models) {
        bk.models = models;
    };
    if (latitude && length) {
        bk.location = [latitude, length];
    };
    res.status(200).json("Features updated.");
};