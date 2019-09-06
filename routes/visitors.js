const express = require('express');
const router = express.Router();

const userController = require('../app/api/controllers/users');
const visitorsController = require('../app/api/controllers/visitors');
const authentication = require('../auth/auth');

router.post('/visitor', visitorsController.create);
router.get('/visitor', authentication.authenticateVisitor, visitorsController.getById);
router.put('/visitor', authentication.authenticateVisitor, visitorsController.updateLastVisit);
router.get('/working-agent', authentication.authenticateVisitor, userController.getRandomWorkingAgent);

module.exports = router;