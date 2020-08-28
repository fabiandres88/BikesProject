var express = require ('express');
var router = express.Router();
var usersContoller = require ('../../controllers/api/userControllersAPI');

router.get('/', usersContoller.users_list);
router.post('/create', usersContoller.users_create);
router.post('/reserve', usersContoller.users_reserve);

module.exports = router;