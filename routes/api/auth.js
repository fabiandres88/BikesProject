const express= require('express');
const router = express.Router();
const authContoller = require('../../controllers/api/authContollerAPI');

router.post('/authenticate', authContoller.authenticate);
router.post('/forgotPassword', authContoller.forgotPassword);

module.exports = router;