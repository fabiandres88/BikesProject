var express = require ("express");
var router = express.Router();
var bikeController = require ("../../controllers/api/bikeControllerAPI");

router.get('/', bikeController.bike_list);
router.post("/create", bikeController.bike_create);
router.delete("/delete/:id", bikeController.bike_delete);
router.post("/update/:id", bikeController.bike_update);

module.exports= router;