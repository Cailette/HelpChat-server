const express = require('express');
const router = express.Router();

const visitorsController = require('../app/api/controllers/visitors');
const authentication = require('../auth/auth');

router.post('/', visitorsController.create);
router.put('/', authentication.authenticateVisitor, visitorsController.update);
router.get('/', authentication.authenticateUser, visitorsController.getAll);
router.get('/:VisitorId', authentication.authenticateUser, visitorsController.getById);

module.exports = router;