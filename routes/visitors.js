const express = require('express');
const router = express.Router();

const userController = require('../app/api/controllers/users');
const visitorsController = require('../app/api/controllers/visitors');
const authentication = require('../auth/auth');

router.get('/visitor/', authentication.authenticateVisitor, visitorsController.getById);
router.get('/working-agent/:licenceID', userController.getRandomWorkingAgent);

module.exports = router;