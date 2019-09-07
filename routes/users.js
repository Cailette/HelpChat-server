const express = require('express');
const router = express.Router();

const userController = require('../app/api/controllers/users');
const authentication = require('../auth/auth');

router.post('/register', userController.create);
router.post('/authenticate', userController.authenticate);
router.post('/registerAgent', authentication.authenticateUser, userController.create);

router.get('/user', authentication.authenticateUser, userController.getById);
router.get('/:AgentId', authentication.authenticateUser, userController.getById);
router.get('/', authentication.authenticateUser, userController.getAll);

router.put('/activity', authentication.authenticateUser, userController.updateActivity);
router.put('/user', authentication.authenticateUser, userController.updateById);
router.put('/:AgentId', authentication.authenticateUser, userController.updateById);

router.delete('/user', authentication.authenticateUser, userController.delete);
router.delete('/:AgentId', authentication.authenticateUser, userController.delete);

router.get('/working-agent', authentication.authenticateVisitor, userController.getRandomWorkingAgent);

module.exports = router;