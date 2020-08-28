var express = require('express');
var router = express.Router();
const usersContoller = require ('../controllers/users');

router.get('/', usersContoller.list);
router.get('/create', usersContoller.create_get);
router.post('/create', usersContoller.create);
router.get('/:id/update', usersContoller.update_get);
router.post('/:id/update', usersContoller.update);
router.post('/:id/delete',usersContoller.delete);

module.exports = router;