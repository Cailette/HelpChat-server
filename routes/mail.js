const express = require('express');
const router = express.Router();

const authorizate = require('../buisnessLogic/auth/authorizate');
const mailController = require('../api/controllers/mail');

router.post('/sendMail', authorizate.authorizate, mailController.sendMail);

module.exports = router;