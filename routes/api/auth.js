const express= require('express');
const router = express.Router();
const passport= require('../../config/passport');
const authContoller = require('../../controllers/api/authContollerAPI');

router.post('/authenticate', authContoller.authenticate);
router.post('/forgotPassword', authContoller.forgotPassword);
router.post('/facebook_token', passport.authenticate('facebook-token'), authContoller.authFacebookToken);

module.exports = router;