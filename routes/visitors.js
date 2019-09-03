const express = require('express');
const router = express.Router();

const userController = require('../app/api/controllers/users');

router.get('/working-agent/:licenceID', userController.getRandomWorkingAgent);

module.exports = router;