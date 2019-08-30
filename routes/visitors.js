const express = require('express');
const router = express.Router();

const userController = require('../app/api/controllers/users');

router.get('/active-users/:licenceID', userController.getActiveUsers);

module.exports = router;