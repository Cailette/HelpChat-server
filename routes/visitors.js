const express = require('express');
const router = express.Router();

const visitorsController = require('../api/controllers/visitors');
const userController = require('../api/controllers/users');
const authorizate = require('../BuisnessLogic/auth/authorizate');

router.post('/', visitorsController.create);
router.put('/', authorizate.authorizate, visitorsController.update);
router.get('/', authorizate.authorizate, visitorsController.getAll);
router.get('/:VisitorId', authorizate.authorizate, visitorsController.getById);
router.get('/visitor', authorizate.authorizate, visitorsController.getById);

router.get('/found-agent', authorizate.authorizate, userController.getRandomWorkingUser);

module.exports = router;