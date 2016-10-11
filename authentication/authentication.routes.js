'use strict';
let router = require('express').Router();
let authentication = require('./authentication.js');

router.post('/signup', authentication.signup);
router.post('/login', authentication.login);
router.post('/revoke', authentication.revoke);

module.exports = router;